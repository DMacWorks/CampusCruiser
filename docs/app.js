(() => {
  'use strict';
  const schools = [{"itas":"446","name":"Adolf-Clarenbach-Schule","address":"Clarenbachplatz 1, 41462 Neuss"},{"itas":"452","name":"Albert-Schweitzer-Schule","address":"Tulpenstr. 66, 41466 Neuss"},{"itas":"491","name":"Alexander-v.-Humboldt-Gymnasium","address":"Bergheimer Str. 233, 41464 Neuss"},{"itas":"432","name":"Burgunderschule","address":"Burgunderstr. 1, 41462 Neuss"},{"itas":"473","name":"Comenius-Schule","address":"Weberstr. 90a, 41464 Neuss"},{"itas":"447","name":"Die Brücke","address":"Weißenberger Weg 151, 41462 Neuss"},{"itas":"4471","name":"Die Brücke Dep","address":"Heerderstr. 69, 41460 Neuss"},{"itas":"434","name":"Dreikönigenschule","address":"Im Hammfelddamm 2a, 41460 Neuss"},{"itas":"448","name":"Friedrich-von-Bodelschwingh-Schule","address":"Weberstr. 49, 41464 Neuss"},{"itas":"484","name":"Ganztagsrealschule Norf","address":"Feuerbachweg, 41469 Neuss"},{"itas":"454","name":"Gebrüder-Grimm-Schule","address":"Harfferstr. 9-11, 41469 Neuss"},{"itas":"496","name":"Gesamtschule an der Erft","address":"Aurinstr. 59, 41466 Neuss"},{"itas":"4961","name":"Gesamtschule an der Erft Dep","address":"Am Lindenplatz 29, 41466 Neuss"},{"itas":"497","name":"Gesamtschule Nordstadt","address":"Leostr. 37, 41462 Neuss"},{"itas":"4971","name":"Gesamtschule Nordstadt Dep","address":"Kaarster. 14, 41462 Neuss"},{"itas":"498","name":"Gesamtschule Norf","address":"Feuerbachweg 29, 41469 Neuss"},{"itas":"459","name":"Geschwister-Scholl-Grundschule","address":"Ruhrstr. 38, 41469 Neuss"},{"itas":"436","name":"Görresschule","address":"Konrad-Adenauer-Ring 67, 41464 Neuss"},{"itas":"453","name":"Grundschule Allerheiligen","address":"Am Henselsgraben 15, 41470 Neuss"},{"itas":"494","name":"Gymnasium Norf","address":"Eichenallee 8, 41469 Neuss"},{"itas":"476","name":"Herbert-Karrenberg-Schule","address":"Neusser Weyhe 20, 41462 Neuss"},{"itas":"495","name":"Janusz-Korczak-Gesamtschule","address":"Platz am Niedertor 6, 41460 Neuss"},{"itas":"4951","name":"Janusz-Korczak-Gesamtschule Dep","address":"Schwannstr. 39, 41460 Neuss"},{"itas":"444","name":"Karl-Kreiner-Schule","address":"Gladbacherstr. 60, 41462 Neuss"},{"itas":"440","name":"Kreuzschule","address":"Sternstr. 43-45, 41460 Neuss"},{"itas":"430","name":"Kyburg","address":"Maximilian-Kolbe-Str. 14, 41466 Neuss"},{"itas":"441","name":"Leoschule","address":"Am Kivitzbusch 30, 41462 Neuss"},{"itas":"493","name":"Marie-Curie-Gymnasium","address":"Jostenallee 49-51, 41462 Neuss"},{"itas":"4931","name":"Marie-Curie-Gymnasium Dep","address":"Annostr. 30, 41462 Neuss"},{"itas":"449","name":"Martin-Luther-Schule","address":"Sternstr. 45, 41460 Neuss"},{"itas":"455","name":"Martinus-Schule Holzheim","address":"Martinstr. 19-21, 41472 Neuss"},{"itas":"462","name":"Maximilian-Kolbe-Schule","address":"Bergheimer Str. 213, 41464 Neuss"},{"itas":"443","name":"Münsterschule","address":"Hafenstr. 29, 41460 Neuss"},{"itas":"492","name":"Nelly-Sachs-Gymnasium","address":"Eichendorffstr. 65, 41464 Neuss"},{"itas":"437","name":"Pestalozzischule","address":"Pestalozzistr. 2, 41468 Neuss"},{"itas":"489","name":"Quirinus-Gymnasium","address":"Sternstr. 49, 41460 Neuss"},{"itas":"486","name":"Realschule Holzheim","address":"Reuschenbergerstr. 28a, 41472 Neuss"},{"itas":"","name":"Rita-Süssmuth-Realschule","address":"Gnadentaler Allee 36a, 41468 Neuss"},{"itas":"483","name":"Realschule Südstadt","address":"Weberstr. 90, 41464 Neuss"},{"itas":"457","name":"Richard-Schirrman-Schule","address":"Hoistener Schulstr. 13-15, 41469 Neuss"},{"itas":"472","name":"Sekundarschule Neuss","address":"Gnadentaler Allee 36a, 41468 Neuss"},{"itas":"458","name":"St.-Andreas-Schule","address":"Norfer Schulstr. 13, 41469 Neuss"},{"itas":"438","name":"St.-Hubertus-Schule","address":"Aurinstr. 57, 41466 Neuss"},{"itas":"439","name":"St.-Konrad-Schule","address":"Löhrerstr. 7, 41468 Neuss"},{"itas":"442","name":"St.-Martinus-Schule","address":"Rheinfährstr. 161, 41468 Neuss"},{"itas":"456","name":"St.-Stephanus-Schule","address":"Birkhofstr. 26, 41472 Neuss"},{"itas":"460","name":"St.Peter-Schule","address":"Rosellener Schulstr. 9, 41470 Neuss"},{"itas":"488","name":"Theodor-Schwann-Kolleg","address":"Lahnstr. 2-4, 41469 Neuss"},{"itas":"499","name":"VHS Neuss","address":"Brückstraße 1, 41460 Neuss"}];
  const $ = id => document.getElementById(id);
  const routeKey = 'itk-neuss-route-v2';
  const prefsKey = 'itk-neuss-route-settings-v1';
  const state = { route: [], prefs: { start: 'current', custom: '' }, password: '', devices: [], allDevices: [], groups: [], locations: [], selected: new Set() };
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function status(id, text, type = 'info') { const el=$(id); el.textContent=text; el.className='status '+type; }
  function persist() { try { localStorage.setItem(routeKey, JSON.stringify(state.route)); } catch { status('appStatus','Der Browser konnte die Route nicht speichern.','error'); } }
  function savePrefs() { state.prefs={start:$('start').value,custom:$('custom').value}; try{localStorage.setItem(prefsKey,JSON.stringify(state.prefs));}catch{} }
  function startAddress() {
    if ($('start').value==='custom') return $('custom').value.trim();
    if ($('start').value!=='current') return $('start').value;
    return '';
  }
  function draw() {
    $('count').textContent=state.route.length;
    $('doneCount').textContent=state.route.filter(s=>s.done).length;
    if (!state.route.length) { $('list').innerHTML='<div class="empty">Noch keine Stopps. Wähle links eine Schule aus.</div>'; return; }
    $('list').innerHTML=state.route.map((s,i)=>`<article class="stop ${s.done?'done':''}"><span class="num">${i+1}</span><div><div class="name">${esc(s.name)}</div><div class="address">${esc(s.address||'Keine Adresse hinterlegt')}</div><span class="tag ${s.type==='delivery'?'delivery':''}">${s.type==='pickup'?'Abholung':s.type==='jamf'?'Jamf-Geräte':'Lieferung'}${s.locationId?` · Location ID ${esc(s.locationId)}`:''}</span>${s.devices?.length?`<div class="device-meta">${s.devices.map(d=>esc(d.name||'Gerät')+' ('+esc(d.assetTag||'ohne Asset Tag')+')').join(', ')}</div>`:''}</div><div class="actions"><button type="button" class="icon" data-action="up" data-index="${i}" aria-label="Nach oben">↑</button><button type="button" class="icon" data-action="down" data-index="${i}" aria-label="Nach unten">↓</button><button type="button" class="icon check" data-action="done" data-index="${i}" aria-label="Erledigt umschalten">${s.done?'↶':'✓'}</button><button type="button" class="icon remove" data-action="remove" data-index="${i}" aria-label="Entfernen">×</button></div></article>`).join('');
  }
  function addSchool(type) {
    const value=$('school').value;
    if(value===''){status('appStatus','Bitte zuerst eine Schule auswählen.','error');return;}
    const school=schools[Number(value)]; if(!school){status('appStatus','Die ausgewählte Schule wurde nicht gefunden.','error');return;}
    state.route.push({id:'school-'+Date.now()+'-'+Math.random().toString(16).slice(2),name:school.name,address:school.address,itas:school.itas||'',type,done:false});
    $('school').value='';persist();draw();status('appStatus',`${type==='pickup'?'Abholung':'Lieferung'} für ${school.name} hinzugefügt.`,'ok');
  }
  function mapsUrl(kind) {
    if(!state.route.length) throw new Error('Füge zuerst mindestens einen Stopp zur Route hinzu.');
    const origin=startAddress()||state.route[0].address;
    const destinations=state.route.map(s=>s.address).filter(Boolean);
    if(!destinations.length) throw new Error('Die Stopps enthalten keine verwendbaren Adressen.');
    if(kind==='apple') {
      const end=destinations[destinations.length-1], waypoints=destinations.slice(0,-1).slice(0,14);
      const params=new URLSearchParams({source:origin||destinations[0],destination:end,mode:'driving'});
      waypoints.forEach(w=>params.append('waypoint',w));
      return 'https://maps.apple.com/directions?'+params.toString();
    }
    const params=new URLSearchParams({api:'1',travelmode:'driving',origin,destination:destinations[destinations.length-1]});
    const waypoints=destinations.slice(0,-1); if(waypoints.length)params.set('waypoints',waypoints.join('|'));
    return 'https://www.google.com/maps/dir/?'+params.toString();
  }
  function openMaps(kind) { try { const url=mapsUrl(kind); window.location.assign(url); } catch(e) { status('appStatus',e.message,'error'); } }
  function postcode(address='') { const m=String(address).match(/\b(\d{5})\b/); return m?Number(m[1]):null; }
  function sortRoute() {
    if(state.route.length<2){status('appStatus','Zum Sortieren werden mindestens zwei Stopps benötigt.','error');return;}
    const start=postcode(startAddress())??postcode(state.route[0].address);
    const decorated=state.route.map((s,i)=>({s,i,zip:postcode(s.address)}));
    if(decorated.every(x=>x.zip===null)){status('appStatus','In den Adressen wurden keine Postleitzahlen gefunden.','error');return;}
    // A stable PLZ proximity estimate; exact road distances and traffic are unavailable offline.
    const pending=decorated.slice(), ordered=[]; let cursor=start??pending[0].zip;
    while(pending.length){let best=0,bestDelta=Infinity;for(let i=0;i<pending.length;i++){const z=pending[i].zip;const delta=z===null?Infinity:Math.abs(z-cursor);if(delta<bestDelta){best=i;bestDelta=delta;}}const next=pending.splice(best,1)[0];ordered.push(next);if(next.zip!==null)cursor=next.zip;}
    state.route=ordered.map(x=>x.s);persist();draw();status('appStatus','Stopps anhand ihrer Postleitzahlen näherungsweise sortiert.','ok');
  }
  function exportCsv() {
    if(!state.route.length){status('appStatus','Es gibt noch keine Stopps zum Exportieren.','error');return;}
    const quote=v=>'"'+String(v??'').replace(/"/g,'""')+'"';
    const rows=[['Reihenfolge','Status','Typ','Standort/Schule','Adresse','Location ID','Gerät','Asset Tag','Benutzer','ITaS']];
    state.route.forEach((s,i)=>{const base=[i+1,s.done?'Erledigt':'Offen',s.type==='pickup'?'Abholung':s.type==='jamf'?'Geräte':'Lieferung',s.name,s.address,s.locationId||''];if(s.devices?.length)s.devices.forEach(d=>rows.push([...base,d.name,d.assetTag,d.owner,s.itas||'']));else rows.push([...base,'','','',s.itas||'']);});
    const csv='\ufeff'+rows.map(row=>row.map(quote).join(';')).join('\r\n');
    try { const blob=new Blob([csv],{type:'text/csv;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='Schulroute_Neuss_'+new Date().toISOString().slice(0,10)+'.csv';a.style.display='none';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);status('appStatus','CSV-Export gestartet. Falls Safari nachfragt, bestätige den Download.','ok'); }
    catch(e){status('appStatus','CSV konnte nicht erstellt werden: '+e.message,'error');}
  }
  async function shareRoute() {
    if(!state.route.length){status('appStatus','Es gibt noch keine Route zum Teilen.','error');return;}
    const text=state.route.map((s,i)=>`${i+1}. ${s.type==='pickup'?'Abholung':s.type==='jamf'?'Jamf-Geräte':'Lieferung'}: ${s.name} — ${s.address}`).join('\n');
    let url='';try{url=mapsUrl('apple');}catch{}
    try { if(navigator.share){await navigator.share({title:'Schulroute Neuss',text,url});status('appStatus','Teilen geöffnet.','ok');return;} if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(text+(url?'\n\nApple Karten: '+url:''));status('appStatus','Routenliste wurde in die Zwischenablage kopiert.','ok');return;} window.prompt('Route kopieren:',text+(url?'\n\nApple Karten: '+url:'')); }
    catch(e){if(e.name!=='AbortError')status('appStatus','Teilen nicht möglich: '+(e.message||'Safari hat die Aktion verhindert.'),'error');}
  }
  function apiUrl(path) {
    const base=String(window.JAMF_API_BASE_URL||'').trim();
    if(!base) throw new Error('Die Backend-Adresse fehlt in docs/config.js.');
    return new URL(path.replace(/^\/+/,''),base.replace(/\/+$/,'')+'/').href;
  }
  function authHeader() { const bytes=new TextEncoder().encode('planner:'+state.password);let bin='';bytes.forEach(b=>bin+=String.fromCharCode(b));return 'Basic '+btoa(bin); }
  async function jamfFetch(path) {
    let response;
    try { response=await fetch(apiUrl(path),{method:'GET',headers:{Authorization:authHeader(),Accept:'application/json'}}); }
    catch(e){throw new Error('Backend nicht erreichbar. Prüfe Internetverbindung, Backend-Adresse und CORS. ('+e.message+')');}
    const raw=await response.text();let data;try{data=raw?JSON.parse(raw):{};}catch{throw new Error(`Backend-Antwort ist kein JSON (HTTP ${response.status}).`);}
    if(!response.ok)throw new Error(data.error||`Backend meldet HTTP ${response.status}.`);
    if(!data||typeof data!=='object')throw new Error('Backend hat eine unerwartete Antwort geliefert.');
    return data;
  }
  const listOf=data=>Array.isArray(data)?data:(Array.isArray(data?.items)?data.items:Array.isArray(data?.data)?data.data:[]);
  function ownerObj(d){const o=d.owner??d.user??d.username;return Array.isArray(o)?o[0]||{}:typeof o==='object'&&o?o:{username:o||''};}
  function ownerName(d){const o=ownerObj(d);return [o.firstName,o.lastName].filter(Boolean).join(' ')||o.name||o.username||d.username||'';}
  function renderDevices() {
    const owner=$('ownerFilter').value.trim().toLowerCase(),asset=$('assetFilter').value.trim().toLowerCase(),group=$('groupFilter').value;
    const matches=state.devices.filter(d=>{const own=ownerObj(d);const user=[ownerName(d),own.username,d.name].join(' ').toLowerCase();const tag=String(d.assetTag??d.asset_tag??'').toLowerCase();const groups=Array.isArray(d.groups)?d.groups:Array.isArray(d.deviceGroups)?d.deviceGroups:[];const groupIds=groups.map(g=>String(typeof g==='object'?g.id:g));const groupMatch=!group||groupIds.includes(String(group))||String(d.groupId??'')===String(group);return(!owner||user.includes(owner))&&(!asset||tag.includes(asset))&&groupMatch;});
    $('jamfCount').textContent=`${matches.length} Geräte${matches.length!==state.devices.length?' von '+state.devices.length:''}`;
    const visible=matches.slice(0,200);
    $('deviceList').innerHTML=visible.length?visible.map(d=>{const id=String(d.id??d.UDID??d.udid??'');const tag=d.assetTag??d.asset_tag??'';const groups=Array.isArray(d.groups)?d.groups:[];const gn=groups.map(g=>typeof g==='object'?(g.name||g.id):g).join(', ')||state.groups.find(g=>String(g.id)===String(d.groupId))?.name||'—';return `<label class="device-row"><input type="checkbox" data-device="${esc(id)}" ${state.selected.has(id)?'checked':''}><span><span class="device-title">${esc(d.name||'Gerät ohne Namen')} · ${esc(tag||'Kein Asset Tag')}</span><span class="device-meta">${esc(ownerName(d)||'Ohne Benutzer')} · Gruppe: ${esc(gn)} · Location ID: ${esc(d.locationId??'—')}</span></span></label>`}).join(''):'<div class="empty">Keine passenden Geräte gefunden.</div>';
    $('deviceList').querySelectorAll('input[data-device]').forEach(box=>box.addEventListener('change',()=>{if(box.checked)state.selected.add(box.dataset.device);else state.selected.delete(box.dataset.device);$('addJamfLocations').disabled=state.selected.size===0;}));
    $('addJamfLocations').disabled=state.selected.size===0;
    if(matches.length>200)status('jamfStatus','Es werden die ersten 200 Geräte angezeigt. Bitte Filter verwenden.','info');
  }
  async function loadJamf() {
    state.password=$('appPassword').value;
    if(!state.password){status('jamfStatus','Bitte das App-Passwort eingeben.','error');$('appPassword').focus();return;}
    $('loadJamf').disabled=true;status('jamfStatus','Jamf-Daten werden geladen …','info');
    try {
      const [devices,groups,locations]=await Promise.all(['devices','device-groups','locations'].map(name=>jamfFetch('/api/jamf/'+name)));
      state.devices=listOf(devices);state.allDevices=state.devices.slice();state.groups=listOf(groups);state.locations=listOf(locations);state.selected.clear();
      $('groupFilter').innerHTML='<option value="">Alle Gruppen</option>'+state.groups.map(g=>`<option value="${esc(g.id)}">${esc(g.name||g.id)}</option>`).join('');
      renderDevices();status('jamfStatus',`${state.devices.length} Geräte, ${state.groups.length} Gruppen und ${state.locations.length} Standorte geladen.`,'ok');
    } catch(e) { status('jamfStatus',e.message||'Jamf-Daten konnten nicht geladen werden.','error'); }
    finally {$('loadJamf').disabled=false;}
  }
  function addJamfLocations() {
    const selected=state.devices.filter(d=>state.selected.has(String(d.id??d.UDID??d.udid??'')));
    if(!selected.length){status('jamfStatus','Bitte mindestens ein Gerät auswählen.','error');return;}
    const buckets=new Map();let unassigned=0;
    selected.forEach(d=>{const id=String(d.locationId??d.location?.id??'');if(!id){unassigned++;return;}if(!buckets.has(id))buckets.set(id,[]);buckets.get(id).push(d);});
    let added=0;const missing=[];
    for(const [id,devices] of buckets){const loc=state.locations.find(x=>String(x.id)===id);if(!loc){missing.push(id);continue;}
      const address=[loc.street,loc.streetNumber,[loc.postalCode,loc.city].filter(Boolean).join(' '),loc.country||'Deutschland'].filter(Boolean).join(', ');
      if(!loc.city||!loc.postalCode){missing.push(id);continue;}
      const deviceData=devices.map(d=>({name:d.name||'',assetTag:d.assetTag??d.asset_tag??'',owner:ownerName(d)}));
      const existing=state.route.find(s=>String(s.locationId??'')===id);
      if(existing){const have=new Set((existing.devices||[]).map(d=>String(d.assetTag)));existing.devices=[...(existing.devices||[]),...deviceData.filter(d=>!have.has(String(d.assetTag)))];}
      else state.route.push({id:'jamf-location-'+id,locationId:id,name:loc.name||`Standort ${id}`,address,latitude:loc.latitude,longitude:loc.longitude,type:'jamf',done:false,devices:deviceData});added++;
    }
    persist();draw();const details=[unassigned?`${unassigned} Geräte ohne Location ID`:null,missing.length?`keine vollständige Adresse für Location ID ${missing.join(', ')}`:null].filter(Boolean).join('; ');
    status('jamfStatus',`${added} Standort${added===1?'':'e'} zur Route hinzugefügt.${details?' '+details+'.':''}`,'ok');
    if(added)status('appStatus',`${added} Jamf-Standort${added===1?'':'e'} zur Route hinzugefügt.`,'ok');
  }
  function init() {
    schools.forEach((s,i)=>{const o=document.createElement('option');o.value=String(i);o.textContent=s.name+(s.itas?' (ITaS: '+s.itas+')':'');$('school').appendChild(o);});
    try{const saved=JSON.parse(localStorage.getItem(routeKey)||'[]');if(Array.isArray(saved))state.route=saved;}catch{}
    try{state.prefs={...state.prefs,...JSON.parse(localStorage.getItem(prefsKey)||'{}')};}catch{}
    $('start').value=state.prefs.start;$('custom').value=state.prefs.custom;$('customWrap').classList.toggle('hidden',$('start').value!=='custom');
    $('start').addEventListener('change',()=>{$('customWrap').classList.toggle('hidden',$('start').value!=='custom');savePrefs();});$('custom').addEventListener('input',savePrefs);
    $('pickup').addEventListener('click',()=>addSchool('pickup'));$('delivery').addEventListener('click',()=>addSchool('delivery'));
    $('list').addEventListener('click',e=>{const b=e.target.closest('button[data-action]');if(!b)return;const i=Number(b.dataset.index);if(!Number.isInteger(i)||!state.route[i])return;const action=b.dataset.action;if(action==='up'&&i>0)[state.route[i-1],state.route[i]]=[state.route[i],state.route[i-1]];if(action==='down'&&i<state.route.length-1)[state.route[i+1],state.route[i]]=[state.route[i],state.route[i+1]];if(action==='done')state.route[i].done=!state.route[i].done;if(action==='remove')state.route.splice(i,1);persist();draw();});
    $('optimize').addEventListener('click',sortRoute);$('clear').addEventListener('click',()=>{if(!state.route.length){status('appStatus','Die Route ist bereits leer.','info');return;}state.route=[];persist();draw();status('appStatus','Route geleert.','ok');});
    $('mapsApple').addEventListener('click',()=>openMaps('apple'));$('mapsGoogle').addEventListener('click',()=>openMaps('google'));$('export').addEventListener('click',exportCsv);$('share').addEventListener('click',shareRoute);
    $('loadJamf').addEventListener('click',loadJamf);$('ownerFilter').addEventListener('input',renderDevices);$('assetFilter').addEventListener('input',renderDevices);$('groupFilter').addEventListener('change',async()=>{const group=$('groupFilter').value;if(!group){state.devices=state.allDevices.slice();renderDevices();return;}status('jamfStatus','Geräte der ausgewählten Gruppe werden geladen …','info');try{const data=await jamfFetch('/api/jamf/devices?groups='+encodeURIComponent(group));state.devices=listOf(data);state.selected.clear();renderDevices();status('jamfStatus',`${state.devices.length} Geräte in dieser Gruppe geladen.`,'ok');}catch(e){status('jamfStatus',e.message,'error');}});$('addJamfLocations').addEventListener('click',addJamfLocations);
    draw();
  }
  try { init(); } catch(e) { status('appStatus','Seitenstart fehlgeschlagen: '+e.message,'error'); }
})();
