const CACHE = 'stage-hours-2'

// The built script and stylesheet have a different name after every build, so read their names from index.html.
async function saveAppFiles() {
  const cache = await caches.open(CACHE)
  const page = await (await fetch('index.html', { cache: 'reload' })).text()
  const built = [...page.matchAll(/(?:src|href)="\.\/(assets\/[^"]+)"/g)].map(match => match[1])
  await cache.addAll(['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', ...built])
}

self.addEventListener('install', event => {
  event.waitUntil(saveAppFiles())
  self.skipWaiting()
})

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  )
})

// Online: always take the fresh file and keep a copy. Offline: use the copy.
self.addEventListener('fetch', event => {
  const request = event.request
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return
  event.respondWith(
    fetch(request)
      .then(response => {
        if (response.ok) {
          const copy = response.clone()
          caches.open(CACHE).then(cache => cache.put(request, copy))
        }
        return response
      })
      .catch(() => caches.match(request, { ignoreSearch: true }))
  )
})
