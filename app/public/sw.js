const PRECACHE = 'precache-v2'
const RUNTIME = 'runtime'

// A list of local resources we always want to be cached.
const PRECACHE_URLS = [`/`]

self.addEventListener('install', function (event) {
  console.log('Hello world from the Service Worker 🤙')
  event.waitUntil(
    caches
      .open(PRECACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  const currentCaches = [PRECACHE, RUNTIME]
  console.log('activate cache')
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return cacheNames.filter((cacheName) => !currentCaches.includes(cacheName))
      })
      .then((cachesToDelete) => {
        console.log('cache is deleting')
        return Promise.all(
          cachesToDelete.map((cacheToDelete) => {
            return caches.delete(cacheToDelete)
          }),
        )
      })
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const itemUrl = event.request?.url

  const isImage = itemUrl.match(/png/) || itemUrl.match(/webp/) || itemUrl.match(/jpg/) || itemUrl.match(/jpeg/)
  // just let the browser do the normal thing:
  // const url = new URL(event.request.url)
  // console.log(url.pathname.match(/admin/), location.origin)
  // if (url.origin === location.origin && url.pathname.match(/admin/)) {
  //   // just let the browser do the normal thing:
  //   return
  // } else

  // console.log(event.request.destination, event.request.url)

  if (isImage && event.request.destination === 'image') {
    event.respondWith(
      // Offline First For Image <--------------
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          const imageExpDate = new Date(cachedResponse.headers.get('date'))
          const isHigherThan24Hours = Date.now() > imageExpDate.getTime() + 1000 * 60 * 60 * 24
          // 60 * 60 * 24
          // console.log('higher 1 minutes', isHigherThan24Hours, Date.now(), imageExpDate.getTime() + 1000 * 60)
          if (isHigherThan24Hours) {
            return caches.open(RUNTIME).then((cache) => {
              return fetch(event.request, {}).then((response) => {
                return cache.put(event.request, response.clone()).then(() => {
                  return response
                })
              })
            })
          }
          return cachedResponse
        }
        return caches.open(RUNTIME).then((cache) => {
          return fetch(event.request, {}).then((response) => {
            return cache.put(event.request, response.clone()).then(() => {
              return response
            })
          })
        })
      }),
    )
  } else if (event.request.destination === 'style' || event.request.destination === 'font') {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse
        }
        return caches.open(RUNTIME).then((cache) => {
          return fetch(event.request, {}).then((response) => {
            // Put a copy of the response in the runtime cache.
            return cache.put(event.request, response.clone()).then(() => {
              return response
            })
          })
        })
      }),
    )
  }
  //  else if (event.request.url.startsWith(self.location.origin)) {
  //   event.respondWith(
  //     caches.match(event.request).then((cachedResponse) => {
  //       if (cachedResponse) {
  //         return cachedResponse
  //       }
  //       return caches.open(RUNTIME).then((cache) => {
  //         return fetch(event.request, {}).then((response) => {
  //           // Put a copy of the response in the runtime cache.
  //           return cache.put(event.request, response.clone()).then(() => {
  //             return response
  //           })
  //         })
  //       })
  //     }),
  //   )
  // }
  return
})

/**
 * Offline First Caches Service Worker
 */

// event.respondWith(
//   caches.match(event.request).then((cachedResponse) => {
//     // console.log('event request', event.request, cachedResponse)
//     if (cachedResponse) {
//       return cachedResponse
//     }
//     return caches.open(RUNTIME).then((cache) => {
//       return fetch(event.request, {}).then((response) => {
//         // Put a copy of the response in the runtime cache.
//         return cache.put(event.request, response.clone()).then(() => {
//           return response
//         })
//       })
//     })
//   }),
// )
