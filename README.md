# Schulroutenplaner Neuss

## GitHub Pages veröffentlichen

1. In GitHub **Settings → Pages** öffnen.
2. Bei **Build and deployment** `Deploy from a branch`, Branch `main` und Ordner `/docs` auswählen und speichern.
3. Die öffentliche Seite erscheint unter `https://dmacworks.github.io/Schulroutenplaner/`.

Die Routenplanung per Google Maps und die vorhandenen Neusser Schulen funktionieren als statische Seite. Die Seite übernimmt die Reihenfolge aus der Liste; sie optimiert sie nicht automatisch.

## Jamf School verbinden

GitHub Pages ist statisch und kann die Jamf-API-Zugangsdaten nicht sicher verarbeiten. Für die Jamf-Geräteliste läuft `server.mjs` separat auf einem HTTPS-fähigen Node-Host. Die Jamf-Zugangsdaten und das Planerpasswort kommen ausschließlich in die Umgebungsvariablen dieses Servers, niemals in `docs/`, in GitHub Secrets für Pages oder in `config.js`.

Der Server stellt nur lesende Endpunkte für Geräte, Standorte und Gerätegruppen bereit. Er liefert nur die für die Seite benötigten Gerätedaten. CORS ist für `https://dmacworks.github.io` vorgesehen.

### Backend bereitstellen

1. Erstelle auf einem Node-Hostingdienst einen Web Service aus diesem Repository. Node.js 20 oder neuer; Startbefehl: `npm start`.
2. Setze beim Host diese Umgebungsvariablen:
   - `JAMF_BASE_URL` – API-Basis aus Jamf School unter **Organization → Settings → API** (z. B. `https://neuss.jamfcloud.com/api/`; der Server versucht auch die Tenant-Wurzel).
   - `JAMF_NETWORK_ID` – Network ID deiner Organisation.
   - `JAMF_API_KEY` – dedizierter API-Schlüssel mit ausschließlich GET-Leserechten für Geräte, Standorte und Gerätegruppen.
   - `APP_PASSWORD` – langes, eigenes Passwort für die Planer-Seite.
   - `CORS_ALLOWED_ORIGIN=https://dmacworks.github.io`
   - `HOST=0.0.0.0`
3. Kopiere die HTTPS-Adresse des Backend-Hosts.
4. Trage sie ohne `/api` in `docs/config.js` ein:
   `window.JAMF_API_BASE_URL = 'https://DEIN-BACKEND-HOST';`
5. Committe `config.js` und warte auf die GitHub-Pages-Veröffentlichung. In der Seite das Planerpasswort eingeben und **Jamf-Daten laden** wählen.

Die Route fasst ausgewählte Geräte anhand der Jamf-`locationId` zusammen. Google Maps erhält beim Öffnen die Standortadressen und die angezeigte Reihenfolge. Geräte-, Benutzer- und Asset-Tag-Daten gehen nicht an Google.

## Lokal starten

`.env.example` nach `.env` kopieren, Werte eintragen und `npm start` ausführen. `.env` ist durch `.gitignore` ausgeschlossen. Die `.env` niemals committen.
