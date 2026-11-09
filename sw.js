// Permite abrir la app sin conexión. Siempre intenta traer la última versión; si no hay red, usa la guardada.
const CACHE='formulario-v1', BASE=['./','index.html','manifest.webmanifest','icon-180.png','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{ e.waitUntil(caches.open(CACHE).then(c=>c.addAll(BASE)).then(()=>self.skipWaiting())); });
self.addEventListener('activate',e=>{ e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch',e=>{ const r=e.request; if(r.method!=='GET') return; const u=new URL(r.url);
  if(u.origin===location.origin){ e.respondWith(fetch(r,{cache:'no-cache'}).then(n=>{ if(n.ok){ const c=n.clone(); caches.open(CACHE).then(x=>x.put(r,c)); } return n; }).catch(()=>caches.match(r,{ignoreSearch:true}).then(m=>m||caches.match('index.html')))); return; }
  if(/^fonts\.(googleapis|gstatic)\.com$/.test(u.hostname)) e.respondWith(caches.match(r).then(m=>m||fetch(r).then(n=>{ const c=n.clone(); caches.open(CACHE).then(x=>x.put(r,c)); return n; }))); });
