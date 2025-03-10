const CACHE_NAME = "spaceface-cache-03082025";
const IMAGE_CACHE = "spaceface-image-cache-03082025";
const OFFLINE_PAGE = "/resources/modules/offline/index.html";
const IMAGE_EXPIRATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days expiration for images

const ASSETS_TO_CACHE = [
    OFFLINE_PAGE,
    "/resources/app/__startSpaceface.js",
    "/resources/app/DarkModeToggle.js",
    "/resources/app/DomObserver.js",
    "/resources/app/HTMLFragmentFetcher.js",
    "/resources/app/ServiceWorkerManager.js",
    "/resources/app/utils.js",
    "/resources/app/WindowSize.js",
    "/resources/partials/_footer.html",
    "/resources/partials/_main.html",
    "/resources/partials/_nav.html",
    "/resources/spacesuit/defaults.css",
    "/resources/spacesuit/diagonal.svg",
    "/resources/spacesuit/favicon.ico",
    "/resources/spacesuit/layer.svg",
    "/resources/spacesuit/layout-flex.css",
    "/resources/spacesuit/logo-alt.svg",
    "/resources/spacesuit/logo-sandorzsolt-2.svg",
    "/resources/spacesuit/logo-sandorzsolt-620.svg",
    "/resources/spacesuit/logo-sandorzsolt.svg",
    "/resources/spacesuit/logo-spaceface.svg",
    "/resources/spacesuit/marks.svg",
    "/resources/spacesuit/sp-620.svg",
    "/resources/spacesuit/spaceface-s.svg",
    "/resources/spacesuit/spaceface-text-2.svg",
    "/resources/spacesuit/spaceface-text.svg",
    "/resources/spacesuit/spaceface-tipo-rounded.svg",
    "/resources/spacesuit/spaceface-tipo.svg",
    "/resources/spacesuit/spacesuit.css",
    "/resources/spacesuit/fonts/ArrivalApercuMonoPro-Regular.woff2"
];

// Theme-specific resources
let currentTheme = 'light';

// Install event - Cache essential assets
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => 
            Promise.all(
                ASSETS_TO_CACHE.map((url) =>
                    fetch(url).then((response) => {
                        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
                        return cache.put(url, response);
                    }).catch((err) => console.warn(`[serviceworker] Skipping: ${url}`, err))
                )
            )
        )
    );
    self.skipWaiting();
});

// Activate event - Cleanup old caches & notify clients
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME && cache !== IMAGE_CACHE) {
                        return caches.delete(cache);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );

    // Notify clients about update
    self.clients.matchAll().then((clients) => {
        clients.forEach(client => client.postMessage({ action: "updateAvailable" }));
    });
});

// Message handler
self.addEventListener("message", (event) => {
    if (event.data && event.data.action === "skipWaiting") {
        self.skipWaiting();
    }
    
    if (event.data && event.data.action === "themeChanged") {
        currentTheme = event.data.theme || 'light';
        // Clear CSS cache on theme change to ensure proper styling
        caches.open(CACHE_NAME).then(cache => {
            cache.keys().then(keys => {
                keys.forEach(request => {
                    if (request.url.endsWith('.css')) {
                        cache.delete(request);
                    }
                });
            });
        });
    }
});

// Fetch event - Cache assets, handle offline fallback
self.addEventListener("fetch", (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Don't cache POST requests or API calls
    if (request.method !== 'GET' || url.pathname.includes('/api/')) {
        event.respondWith(fetch(request).catch(error => {
            console.error('[serviceworker] Fetch error:', error);
            return caches.match(OFFLINE_PAGE);
        }));
        return;
    }
    
    // Special handling for HTML partials
    if (url.pathname.includes('/resources/partials/') || url.pathname.includes('/content/partials/')) {
        event.respondWith(
            caches.open(CACHE_NAME).then((cache) => {
                return cache.match(request).then((cachedResponse) => {
                    const fetchPromise = fetch(request).then((networkResponse) => {
                        if (networkResponse.ok) {
                            cache.put(request, networkResponse.clone());
                        }
                        return networkResponse;
                    }).catch(error => {
                        console.error('[serviceworker] Partial HTML fetch error:', error);
                        
                        // If we have a cached version, use it even if fetch fails
                        if (cachedResponse) return cachedResponse;
                        
                        // If no cached version exists, we need to signal the main thread
                        // that this partial has failed to load
                        self.clients.matchAll().then(clients => {
                            clients.forEach(client => {
                                client.postMessage({
                                    action: "partialLoadFailed",
                                    url: request.url
                                });
                            });
                        });
                        
                        // Return a special response for failed partials
                        return new Response(
                            `<div class="partial-error" data-failed-url="${request.url}">
                               <!-- Empty placeholder for failed partial -->
                             </div>`, 
                            { 
                                headers: {'Content-Type': 'text/html'},
                                status: 200 
                            }
                        );
                    });
                    
                    return cachedResponse || fetchPromise;
                });
            }).catch(error => {
                console.error('[serviceworker] Cache error:', error);
                return new Response(
                    `<div class="partial-error">Error loading content</div>`, 
                    { 
                        headers: {'Content-Type': 'text/html'},
                        status: 200 
                    }
                );
            })
        );
        return;
    }

    // Cache images separately (dynamic caching with expiration)
    if (request.destination === "image") {
        event.respondWith(
            caches.open(IMAGE_CACHE).then((cache) => {
                return cache.match(request).then((cachedResponse) => {
                    // Use stale-while-revalidate for images
                    const fetchPromise = fetch(request).then((networkResponse) => {
                        // Check if response is valid
                        if (networkResponse.ok) {
                            cache.put(request, networkResponse.clone());
                        }
                        return networkResponse;
                    }).catch(error => {
                        console.error('[serviceworker] Image fetch error:', error);
                        return null;
                    });
                    
                    // Return cached response immediately if available, otherwise wait for network
                    return cachedResponse || fetchPromise;
                });
            }).catch(error => {
                console.error('[serviceworker] Cache error:', error);
                return caches.match(OFFLINE_PAGE);
            })
        );
        return;
    }
    
    // Check if CSS file and apply theme handling
    if (request.destination === "style") {
        event.respondWith(
            caches.open(CACHE_NAME).then((cache) => {
                // Add theme version to cache key for CSS files
                const themeKey = `${request.url}?theme=${currentTheme}`;
                return cache.match(themeKey).then((cachedResponse) => {
                    // Use stale-while-revalidate for CSS
                    const fetchPromise = fetch(request).then((networkResponse) => {
                        if (networkResponse.ok) {
                            cache.put(themeKey, networkResponse.clone());
                        }
                        return networkResponse;
                    }).catch(error => {
                        console.error('[serviceworker] CSS fetch error:', error);
                        return null;
                    });
                    
                    return cachedResponse || fetchPromise;
                });
            }).catch(error => {
                console.error('[serviceworker] Cache error:', error);
                return fetch(request);
            })
        );
        return;
    }

    // Default asset caching strategy (Stale-while-revalidate)
    event.respondWith(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.match(request).then((cachedResponse) => {
                const fetchPromise = fetch(request).then((networkResponse) => {
                    if (networkResponse.ok) {
                        cache.put(request, networkResponse.clone());
                    }
                    return networkResponse;
                }).catch(error => {
                    console.error('[serviceworker] Fetch error:', error);
                    return null;
                });
                
                // Return cached version immediately if available
                return cachedResponse || fetchPromise;
            });
        }).catch(error => {
            console.error('[serviceworker] Cache error:', error);
            return caches.match(OFFLINE_PAGE);
        })
    );
});

// Periodic cleanup of old images
async function cleanupOldImages() {
    try {
        const cache = await caches.open(IMAGE_CACHE);
        const keys = await cache.keys();
        const now = Date.now();

        for (const request of keys) {
            const response = await cache.match(request);
            if (!response) continue;

            const dateHeader = response.headers.get("Date");
            const responseTime = dateHeader ? new Date(dateHeader).getTime() : now;

            if (now - responseTime > IMAGE_EXPIRATION_MS) {
                await cache.delete(request);
            }
        }
        console.log('[serviceworker] Image cache cleanup completed');
    } catch (error) {
        console.error('[serviceworker] Image cache cleanup failed:', error);
    }
}

// Handle periodic sync if supported
self.addEventListener("periodicsync", (event) => {
    if (event.tag === "cleanup-images") {
        event.waitUntil(cleanupOldImages());
    }
});

// Fallback for browsers that don't support periodic sync
self.addEventListener("activate", (event) => {
    // Run cleanup on activation as well
    event.waitUntil(cleanupOldImages());
});