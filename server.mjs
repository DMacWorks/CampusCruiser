import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { timingSafeEqual } from 'node:crypto';

const root = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.join(root, 'docs');

// Load local secrets from .env; never commit that file.
try {
  const envText = await readFile(path.join(root, '.env'), 'utf8');
  for (const line of envText.split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2].replace(/^(["'])(.*)\1$/, '$2');
  }
} catch {}

const port = Number(process.env.PORT || 8787);
const host = process.env.HOST || '127.0.0.1';
const jamfBase = process.env.JAMF_BASE_URL || '';
const networkId = process.env.JAMF_NETWORK_ID || '';
const apiKey = process.env.JAMF_API_KEY || '';
const appPassword = process.env.APP_PASSWORD || '';
const corsAllowedOrigin = process.env.CORS_ALLOWED_ORIGIN || '';

function send(res, status, body, type = 'application/json; charset=utf-8', extraHeaders = {}) {
  res.writeHead(status, { 'content-type': type, 'cache-control': 'no-store', 'x-content-type-options': 'nosniff', ...extraHeaders });
  res.end(type.startsWith('application/json') ? JSON.stringify(body) : body);
}
function corsHeaders(req) {
  const origin = req.headers.origin;
  if (!origin) return {};
  if (!corsAllowedOrigin || origin !== corsAllowedOrigin) return null;
  return {
    'access-control-allow-origin': corsAllowedOrigin,
    'access-control-allow-methods': 'GET, OPTIONS',
    'access-control-allow-headers': 'Authorization, Content-Type',
    'access-control-max-age': '600',
    'vary': 'Origin'
  };
}
function authorized(req) {
  if (!appPassword) return false;
  const header = req.headers.authorization || '';
  if (!header.startsWith('Basic ')) return false;
  let decoded;
  try { decoded = Buffer.from(header.slice(6), 'base64').toString('utf8'); } catch { return false; }
  const pass = decoded.slice(decoded.indexOf(':') + 1);
  const a = Buffer.from(pass), b = Buffer.from(appPassword);
  return a.length === b.length && timingSafeEqual(a, b);
}
function unwrap(payload, candidates) {
  if (Array.isArray(payload)) return payload;
  for (const key of candidates) if (Array.isArray(payload?.[key])) return payload[key];
  return [];
}
function ownerSummary(owner) {
  const user = Array.isArray(owner) ? owner[0] : owner;
  if (!user) return null;
  if (typeof user === 'string' || typeof user === 'number') return { id: String(user), name: String(user), username: '' };
  const name = [user.firstName, user.lastName].filter(Boolean).join(' ') || user.name || user.username || '';
  return { id: String(user.id ?? ''), name, username: user.username || '' };
}
function normalize(resource, payload) {
  if (resource === 'devices') return unwrap(payload, ['devices']).map(d => ({
    id: String(d.UDID ?? d.udid ?? d.id ?? d.assetTag ?? ''),
    name: d.name || d.deviceName || '',
    assetTag: d.assetTag || d.asset_tag || '',
    locationId: String(d.locationId ?? d.location_id ?? ''),
    owner: ownerSummary(d.owner ?? d.user ?? d.ownerName),
    groups: d.groups || d.deviceGroups || d.groupIds || d.deviceGroupIds || []
  }));
  if (resource === 'locations') return unwrap(payload, ['locations']).map(x => ({
    id: String(x.id ?? x.locationId ?? ''), name: x.name || '', street: x.street || x.address || '',
    streetNumber: x.streetNumber || '', postalCode: x.postalCode || '', city: x.city || '', country: x.country || 'Deutschland',
    latitude: x.latitude ?? x.lat ?? null, longitude: x.longitude ?? x.lon ?? x.lng ?? null
  }));
  if (resource === 'device-groups') return unwrap(payload, ['DeviceGroups', 'deviceGroups', 'groups']).map(x => ({
    id: String(x.id ?? ''), name: x.name || '', locationId: String(x.locationId ?? ''), members: x.members ?? null
  }));
  return [];
}
const apiResources = {
  devices: '/devices?inTrash=false&includeApps=false',
  locations: '/locations/',
  'device-groups': '/devices/groups',
};
async function readJson(req) {
  let data = ''; for await (const chunk of req) { data += chunk; if (data.length > 100_000) throw new Error('Request zu groß'); }
  return JSON.parse(data || '{}');
}
async function jamf(resource, filters = {}) {
  if (!jamfBase || !networkId || !apiKey) throw new Error('Jamf-Zugangsdaten fehlen in der .env-Datei.');
  let base;
  try { base = new URL(jamfBase); } catch { throw new Error('JAMF_BASE_URL ist ungültig.'); }
  if (base.protocol !== 'https:' || !base.hostname.endsWith('.jamfcloud.com')) throw new Error('JAMF_BASE_URL muss die HTTPS-Adresse deines Jamf-School-Tenants sein.');
  const relativePath = apiResources[resource].replace(/^\/+/, '');
  const basePath = base.pathname.replace(/\/+$/, '');
  // Jamf's help page uses a base ending in /api, while the interactive API
  // reference also shows tenant-root paths. Try both using GET only.
  const alternatePath = /(?:^|\/)api$/i.test(basePath) ? basePath.replace(/\/api$/i, '') : `${basePath}/api`;
  const candidateBases = [...new Set([basePath, alternatePath])];
  const auth = Buffer.from(`${networkId}:${apiKey}`).toString('base64');
  let lastReply = '';
  for (const candidateBase of candidateBases) {
    const prefix = candidateBase ? `${candidateBase}/` : '/';
    const url = new URL(`${prefix}${relativePath}`, base.origin);
    if (resource === 'devices') {
      for (const key of ['owner', 'location', 'name', 'assettag', 'groups']) {
        const value = String(filters[key] || '').trim();
        if (value && value.length <= 200) url.searchParams.set(key, value);
      }
    }
    const response = await fetch(url, { headers: { authorization: `Basic ${auth}`, accept: 'application/json' }, signal: AbortSignal.timeout(30_000) });
    const text = await response.text();
    const contentType = response.headers.get('content-type') || 'kein Content-Type';
    let data;
    try { data = JSON.parse(text); } catch {}
    if (response.ok && data !== undefined) return normalize(resource, data);
    lastReply = `GET ${url.pathname}: HTTP ${response.status}, ${contentType}${response.url !== url.href ? `, Weiterleitung auf ${new URL(response.url).pathname}` : ''}`;
    if (response.status === 401 || response.status === 403) {
      throw new Error(`Jamf verweigert den Zugriff (${lastReply}). Prüfe den API-Schlüssel und die GET-Leserechte.`);
    }
  }
  throw new Error(`Jamf lieferte auf beiden API-Pfaden kein JSON (${lastReply}). Prüfe unter Organization > Settings > API die angezeigte Basis-URL und dass der API-Schlüssel für GET freigeschaltet ist.`);
}


const server = http.createServer(async (req, res) => {
  let requestCorsHeaders = {};
  try {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    if (url.pathname.startsWith('/api/')) {
      const cors = corsHeaders(req);
      if (cors === null) return send(res, 403, { error: 'CORS-Quelle nicht freigeschaltet.' });
      requestCorsHeaders = cors;
      if (req.method === 'OPTIONS') { res.writeHead(204, cors); return res.end(); }
      if (!authorized(req)) return send(res, appPassword ? 401 : 503, { error: appPassword ? 'Bitte App-Passwort eingeben.' : 'APP_PASSWORD ist nicht konfiguriert.' }, 'application/json; charset=utf-8', cors);
      if (req.method === 'GET' && url.pathname === '/api/status') return send(res, 200, { jamfConfigured: !!(jamfBase && networkId && apiKey) }, 'application/json; charset=utf-8', cors);
      const match = url.pathname.match(/^\/api\/jamf\/(devices|locations|device-groups)$/);
      if (req.method === 'GET' && match) return send(res, 200, { items: await jamf(match[1], Object.fromEntries(url.searchParams)) }, 'application/json; charset=utf-8', cors);
      return send(res, 404, { error: 'API-Endpunkt nicht gefunden.' }, 'application/json; charset=utf-8', cors);
    }
    if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, { error: 'Methode nicht erlaubt.' });
    const rel = url.pathname === '/' ? 'index.html' : decodeURIComponent(url.pathname).replace(/^\/+/, '');
    const filePath = path.resolve(webRoot, rel);
    if (!filePath.startsWith(webRoot + path.sep)) return send(res, 403, { error: 'Zugriff verweigert.' });
    const body = await readFile(filePath);
    const ext = path.extname(filePath);
    const type = ext === '.html' ? 'text/html; charset=utf-8'
      : ext === '.css' ? 'text/css; charset=utf-8'
      : ext === '.js' ? 'text/javascript; charset=utf-8'
      : 'application/octet-stream';
    res.writeHead(200, { 'content-type': type, 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' });
    res.end(req.method === 'HEAD' ? undefined : body);
  } catch (err) {
    send(res, 502, { error: err?.message || 'Unerwarteter Serverfehler.' }, 'application/json; charset=utf-8', requestCorsHeaders);
  }
});
server.listen(port, host, () => console.log(`Schulroutenplaner läuft auf http://${host}:${port}`));
