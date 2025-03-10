/**
 * Startup Script for SpaceFace App with Prioritized UI Partial Loading
 * Enhanced with modern JS features, better error handling, and performance optimizations
 */
console.log("[spaceface] booting...");
console.time('app-initialization');

import DomObserver from "./app/DomObserver.js";
import ServiceWorkerManager from "./app/ServiceWorkerManager.js";
import HTMLFragmentFetcher from "./app/HTMLFragmentFetcher.js";
import ErrorTracker from "./app/ErrorTracker.js"; // New module for structured error tracking

// App configuration with environment-specific overrides
const APP_CONFIG = {
    FETCH_TIMEOUT: 3000,
    STORAGE_KEY: "darkMode",
    ERROR_LEVELS: {
        INFO: 'info',
        WARN: 'warn',
        ERROR: 'error',
        FATAL: 'fatal'
    },
    CACHE: {
        VERSION: '1.0.0',
        TTL: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    },
    PERFORMANCE: {
        MARK_PREFIX: 'spaceface-'
    }
};

// Performance tracking utility
const PerformanceMonitor = {
    mark(name) {
        if (window.performance && window.performance.mark) {
            const markName = `${APP_CONFIG.PERFORMANCE.MARK_PREFIX}${name}`;
            window.performance.mark(markName);
            console.debug(`[spaceface:perf] Marked: ${markName}`);
            return markName;
        }
        return null;
    },
    measure(name, startMark, endMark) {
        if (window.performance && window.performance.measure) {
            try {
                const fullStartMark = startMark && `${APP_CONFIG.PERFORMANCE.MARK_PREFIX}${startMark}`;
                const fullEndMark = endMark && `${APP_CONFIG.PERFORMANCE.MARK_PREFIX}${endMark}`;
                const measureName = `${APP_CONFIG.PERFORMANCE.MARK_PREFIX}${name}`;
                
                window.performance.measure(measureName, fullStartMark, fullEndMark);
                const measure = window.performance.getEntriesByName(measureName).pop();
                console.debug(`[spaceface:perf] ${name}: ${measure?.duration.toFixed(2)}ms`);
                return measure;
            } catch (e) {
                console.warn(`[spaceface:perf] Failed to measure ${name}:`, e);
            }
        }
        return null;
    },
    clearMarks() {
        if (window.performance && window.performance.clearMarks) {
            window.performance.getEntriesByType('mark')
                .filter(mark => mark.name.startsWith(APP_CONFIG.PERFORMANCE.MARK_PREFIX))
                .forEach(mark => window.performance.clearMarks(mark.name));
        }
    }
};

// Simple state management for app state
const createStore = (initialState) => {
    let state = initialState;
    const listeners = [];
    const unsubscribers = new WeakMap(); // For proper cleanup
    
    return {
        getState: () => ({...state}),
        setState: (newState) => {
            const prevState = {...state};
            state = {...state, ...newState};
            
            // Only notify listeners if something actually changed
            if (JSON.stringify(prevState) !== JSON.stringify(state)) {
                listeners.forEach(listener => {
                    try {
                        listener(state, prevState);
                    } catch (error) {
                        console.error("[spaceface:store] Error in state listener:", error);
                    }
                });
            }
        },
        subscribe: (listener) => {
            if (typeof listener !== 'function') {
                throw new Error('Expected the listener to be a function');
            }
            
            listeners.push(listener);
            
            // Create unsubscribe function
            const unsubscribe = () => {
                const index = listeners.indexOf(listener);
                if (index > -1) listeners.splice(index, 1);
            };
            
            // Store reference in WeakMap for potential auto-cleanup
            unsubscribers.set(listener, unsubscribe);
            
            return unsubscribe;
        }
    };
};

// Application state store
const appStore = createStore({
    uiInitialized: false,
    darkMode: false,
    fragmentsLoaded: false,
    offlineMode: false,
    errors: [],
    criticalResourcesLoaded: false
});

// Enhanced feature detection
const FeatureDetector = {
    hasStorage() {
        try {
            const testKey = '__spaceface_test__';
            localStorage.setItem(testKey, testKey);
            localStorage.removeItem(testKey);
            return true;
        } catch (e) {
            return false;
        }
    },
    
    hasServiceWorker() {
        return 'serviceWorker' in navigator;
    },
    
    hasIndexedDB() {
        return window.indexedDB !== undefined;
    },
    
    hasWebWorkers() {
        return typeof Worker !== 'undefined';
    },
    
    canUseCache() {
        return 'caches' in window;
    }
};

// Cache manager for persistent data


// Cache manager for persistent data
// Cache manager for persistent data
const CacheManager = {
    async getDatabase() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('spaceface-cache', 1);

            request.onupgradeneeded = function(event) {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('cache')) {
                    db.createObjectStore('cache', { keyPath: 'key' });
                }
            };

            request.onsuccess = function(event) {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('cache')) {
                    console.warn("[spaceface:cache] Object store 'cache' not found. Recreating DB.");
                    db.close();
                    indexedDB.deleteDatabase('spaceface-cache').onsuccess = () => {
                        CacheManager.getDatabase().then(resolve);
                    };
                    return;
                }
                resolve(db);
            };

            request.onerror = function() {
                console.warn("[spaceface:cache] IndexedDB access error");
                resolve(null);
            };
        });
    },

    async get(key) {
        const db = await this.getDatabase();
        if (!db) return null;

        return new Promise((resolve) => {
            const transaction = db.transaction(['cache'], 'readonly');
            const store = transaction.objectStore('cache');
            const getRequest = store.get(key);

            getRequest.onsuccess = function() {
                const result = getRequest.result;
                if (!result || (result.expires && result.expires < Date.now())) {
                    resolve(null);
                    return;
                }
                resolve(result.value);
            };

            getRequest.onerror = function() {
                console.warn(`[spaceface:cache] Failed to get ${key} from cache`);
                resolve(null);
            };
        });
    },

    async set(key, value, ttl = 24 * 60 * 60 * 1000) {
        const db = await this.getDatabase();
        if (!db) return false;

        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['cache'], 'readwrite');
            const store = transaction.objectStore('cache');

            const item = {
                key,
                value,
                timestamp: Date.now(),
                expires: ttl ? Date.now() + ttl : null
            };

            const setRequest = store.put(item);

            setRequest.onsuccess = function() {
                resolve(true);
            };

            setRequest.onerror = function() {
                console.warn(`[spaceface:cache] Failed to store ${key} in cache`);
                reject(new Error(`Failed to store ${key} in cache`));
            };
        });
    },

    async cleanUp() {
        const db = await this.getDatabase();
        if (!db) return;

        const transaction = db.transaction(['cache'], 'readwrite');
        const store = transaction.objectStore('cache');
        const cursorRequest = store.openCursor();

        cursorRequest.onsuccess = function(event) {
            const cursor = event.target.result;
            if (cursor) {
                const item = cursor.value;
                if ((item.expires && item.expires < Date.now())) {
                    cursor.delete();
                }
                cursor.continue();
            }
        };
    }
};

// Other parts of the script remain unchanged...



// cache manager end

/**
 * Function to handle theme switching logic with improved resource management
 */
async function initializeThemeSwitcher(DarkModeToggle) {
    PerformanceMonitor.mark('theme-init-start');
    console.log("[spaceface] initializeThemeSwitcher working");

    // Initialize the dark mode toggle component
    const toggleInstance = new DarkModeToggle('#dark-mode-toggle', { useCSSVar: true });

    const toggle = document.getElementById("toggle");
    const darkModeToggle = document.getElementById("dark-mode-toggle");
    
    if (!toggle || !darkModeToggle) {
        console.warn("[spaceface] Toggle elements not found", { toggle, darkModeToggle });
        return null;
    }

    // Use enhanced storage through CacheManager
    let storedTheme = await CacheManager.get('theme');
    let toggled = storedTheme === "enabled"; // Only enable if explicitly stored as "enabled"

    // Function to update the toggle position
    function updateTogglePosition() {
        toggle.style.transform = toggled ? "translateX(30px)" : "translateX(0px)";
    }

    // Apply stored theme state (light or dark)
    if (storedTheme !== null) {
        updateTogglePosition();
        if (storedTheme === "enabled") {
            document.documentElement.classList.add('darkmode');
            appStore.setState({ darkMode: true });
        } else {
            document.documentElement.classList.remove('darkmode');
            appStore.setState({ darkMode: false });
        }
    }

    // Store the event listener reference for cleanup
    const toggleClickHandler = () => {
        toggled = !toggled;

        // Save theme to cache
        CacheManager.set('theme', toggled ? "enabled" : "disabled").catch(error => {
            console.warn("[spaceface] Failed to save theme preference:", error);
        });

        // Apply theme based on the new state
        if (toggled) {
            document.documentElement.classList.add('darkmode');
            appStore.setState({ darkMode: true });
        } else {
            document.documentElement.classList.remove('darkmode');
            appStore.setState({ darkMode: false });
        }

        updateTogglePosition();
    };

    // Clean up any existing listeners to prevent duplicates
    darkModeToggle.removeEventListener("click", toggleClickHandler);
    
    // Add the event listener
    darkModeToggle.addEventListener("click", toggleClickHandler);
    
    // Store reference for cleanup
    darkModeToggle._cleanupFunction = () => {
        darkModeToggle.removeEventListener("click", toggleClickHandler);
        toggleInstance?.destroy?.();
    };
    
    PerformanceMonitor.mark('theme-init-end');
    PerformanceMonitor.measure('theme-initialization', 'theme-init-start', 'theme-init-end');
    
    return {
        destroy: () => darkModeToggle._cleanupFunction()
    };
}

/**
 * Enhanced HTML fragment fetching with proper resource management and fallbacks
 */
async function fetchPartials(fetcher) {
    PerformanceMonitor.mark('fetch-partials-start');
    console.log("[spaceface] fetchPartials is fetching HTML partials");
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), APP_CONFIG.FETCH_TIMEOUT);
    
    try {
        const htmlFetcher = fetcher || new HTMLFragmentFetcher({ 
            signal: controller.signal,
            cacheStrategy: 'stale-while-revalidate'
        });
        
        await htmlFetcher.fetchAll();
        clearTimeout(timeoutId);
        
        const watchers = htmlFetcher.watch();
        const observers = htmlFetcher.observeLinks();
        
        // Store references for cleanup
        appStore.setState({
            fragmentsLoaded: true,
            resources: {
                ...(appStore.getState().resources || {}),
                htmlWatchers: watchers,
                linkObservers: observers
            }
        });
        
        return true;
    } catch (error) {
        if (error.name === 'AbortError') {
            console.warn('[spaceface] Fetch operation timed out');
            ErrorTracker.captureError({
                level: APP_CONFIG.ERROR_LEVELS.WARN,
                message: 'HTML fragments fetch timeout',
                error
            });
        } else {
            ErrorTracker.captureError({
                level: APP_CONFIG.ERROR_LEVELS.ERROR,
                message: 'Failed to fetch HTML fragments',
                error,
                context: { usingFallback: true }
            });
        }
        
        // Try to load cached fragments as fallback
        await loadCachedFragments();
        throw error;
    } finally {
        PerformanceMonitor.mark('fetch-partials-end');
        PerformanceMonitor.measure('fetch-partials', 'fetch-partials-start', 'fetch-partials-end');
    }
}

/**
 * Fallback function to load fragments from cache
 */
async function loadCachedFragments() {
    console.log('[spaceface] Attempting to load cached fragments');
    try {
        const fragments = await CacheManager.get('html-fragments');
        if (fragments) {
            // Simplified logic to append cached fragments to DOM
            Object.entries(fragments).forEach(([id, html]) => {
                const container = document.getElementById(id);
                if (container) {
                    container.innerHTML = html;
                }
            });
            return true;
        }
    } catch (error) {
        console.error('[spaceface] Failed to load cached fragments:', error);
    }
    return false;
}

/**
 * Enhanced service worker initialization with proper update strategies
 */
async function initializeServiceWorker(swManager) {
    PerformanceMonitor.mark('sw-init-start');
    console.log('[spaceface] setting up Service Worker');
    
    if (!FeatureDetector.hasServiceWorker()) {
        console.warn('[spaceface] Service Worker not supported');
        return null;
    }
    
    try {
        const serviceWorkerManager = swManager || new ServiceWorkerManager({
            updateInterval: 7 * 24 * 60 * 60 * 1000, // weekly (7 days in milliseconds)
            showUpdateNotification: true,
            onUpdateFound: handleServiceWorkerUpdate,
            onOffline: () => appStore.setState({ offlineMode: true }),
            onOnline: () => appStore.setState({ offlineMode: false })
        });
        
        // Register in one step
        const registration = await serviceWorkerManager.register();
        console.log("[spaceface] Service Worker registered:", registration);

        // Setup offline/online detection
        window.addEventListener('online', () => {
            appStore.setState({ offlineMode: false });
        });
        
        window.addEventListener('offline', () => {
            appStore.setState({ offlineMode: true });
        });
        
        // Store reference for cleanup
        appStore.setState({
            resources: {
                ...(appStore.getState().resources || {}),
                serviceWorker: {
                    registration,
                    manager: serviceWorkerManager
                }
            }
        });

        return registration;
    } catch (error) {
        ErrorTracker.captureError({
            level: APP_CONFIG.ERROR_LEVELS.ERROR,
            message: 'Service Worker registration failed',
            error,
            context: { recoverableError: true }
        });
        console.error("[spaceface] Service Worker registration failed:", error);
        throw error;
    } finally {
        PerformanceMonitor.mark('sw-init-end');
        PerformanceMonitor.measure('sw-initialization', 'sw-init-start', 'sw-init-end');
    }
}

/**
 * Handler for service worker updates
 */
function handleServiceWorkerUpdate(registration) {
    if (!registration.waiting) return;
    
    console.log('[spaceface] New service worker waiting to activate');
    
    // Create update notification
    const updateBar = document.createElement('div');
    updateBar.className = 'sw-update-bar';
    updateBar.innerHTML = `
        <p>A new version is available</p>
        <button id="sw-refresh">Refresh</button>
        <button id="sw-dismiss">Later</button>
    `;
    document.body.appendChild(updateBar);
    
    // Handle refresh click
    document.getElementById('sw-refresh').addEventListener('click', () => {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        window.location.reload();
    });
    
    // Handle dismiss click
    document.getElementById('sw-dismiss').addEventListener('click', () => {
        updateBar.remove();
    });
}

/**
 * Use Web Workers for CPU-intensive tasks
 */
function setupWebWorkers() {
    if (!FeatureDetector.hasWebWorkers()) {
        console.warn('[spaceface] Web Workers not supported');
        return null;
    }
    
    // Create a resource cleanup object to track workers
    const workers = {};
    
    // Example function to run expensive calculation in worker
    const runInWorker = (taskName, data) => {
        return new Promise((resolve, reject) => {
            const worker = new Worker(`./workers/${taskName}.js`);
            
            // Store worker reference for cleanup
            workers[taskName] = worker;
            
            worker.onmessage = (event) => {
                resolve(event.data);
                worker.terminate();
                delete workers[taskName];
            };
            
            worker.onerror = (error) => {
                reject(error);
                worker.terminate();
                delete workers[taskName];
            };
            
            worker.postMessage(data);
        });
    };
    
    // Example function to terminate all workers during cleanup
    const terminateAll = () => {
        Object.values(workers).forEach(worker => worker.terminate());
    };
    
    // Store reference for cleanup
    appStore.setState({
        resources: {
            ...(appStore.getState().resources || {}),
            workers: {
                instances: workers,
                terminate: terminateAll
            }
        }
    });
    
    return {
        runInWorker,
        terminateAll
    };
}

/**
 * Enhanced UI initialization with prioritized loading
 */
async function initializeUI(options = {}) {
    PerformanceMonitor.mark('ui-init-start');
    console.log("[spaceface] Initializing UI components", options.limitedMode ? "(limited mode)" : "");

    const { uiInitialized } = appStore.getState();
    if (uiInitialized) return;
    
    // Try to use requestIdleCallback for non-critical UI components
    const runWhenIdle = (callback) => {
        if (window.requestIdleCallback) {
            return window.requestIdleCallback(callback);
        } else {
            return setTimeout(callback, 1);
        }
    };
    
    try {
        // Critical components load first
        const criticalModules = await Promise.allSettled([
            import("./app/DarkModeToggle.js"),
        ]);
        
        // Check if critical modules loaded successfully
        const criticalSuccess = criticalModules.every(result => result.status === 'fulfilled');
        if (!criticalSuccess) {
            throw new Error('Failed to load critical UI components');
        }
        
        // Extract the DarkModeToggle
        const DarkModeToggle = criticalModules[0].value.default;
        
        // Initialize critical components
        const themeSwitcher = await initializeThemeSwitcher(DarkModeToggle);
        
        appStore.setState({ criticalResourcesLoaded: true });
        
        // Non-critical components load in idle time
        runWhenIdle(async () => {
            try {
                const [{ default: CookieBanner }] = await Promise.allSettled([
                    import("./modules/cookiebanner/CookieBanner.js"),
                ]).then(results => results.map(r => r.status === 'fulfilled' ? r.value : null));
                
                if (CookieBanner) {
                    console.log('[spaceface] setting up cookiebanner');
                    const cookieBanner = new CookieBanner();
                    
                    // Store reference for cleanup
                    appStore.setState({
                        resources: {
                            ...(appStore.getState().resources || {}),
                            cookieBanner
                        }
                    });
                }
            } catch (error) {
                console.warn('[spaceface] Non-critical UI components failed to load:', error);
                // Still consider UI initialized even if non-critical components fail
            } finally {
                appStore.setState({ uiInitialized: true });
            }
        });
        
        return {
            cleanup: () => {
                themeSwitcher?.destroy?.();
                // Other cleanup as needed
            }
        };
    } catch (error) {
        ErrorTracker.captureError({
            level: APP_CONFIG.ERROR_LEVELS.ERROR,
            message: 'Failed to initialize UI components',
            error,
            context: { usingFallback: options.limitedMode }
        });
        console.error("[spaceface] Failed to initialize UI components:", error);
        
        // Still mark as initialized to prevent infinite retries
        appStore.setState({ uiInitialized: true });
        throw error;
    } finally {
        PerformanceMonitor.mark('ui-init-end');
        PerformanceMonitor.measure('ui-initialization', 'ui-init-start', 'ui-init-end');
    }
}

/**
 * Resource cleanup function
 */
function cleanupResources() {
    const { resources } = appStore.getState();
    
    if (!resources) return;
    
    // Clean up HTML watchers
    resources.htmlWatchers?.forEach(watcher => watcher.disconnect?.());
    
    // Clean up link observers
    resources.linkObservers?.forEach(observer => observer.disconnect?.());
    
    // Clean up cookie banner
    resources.cookieBanner?.destroy?.();
    
    // Clean up workers
    resources.workers?.terminate?.();
    
    // Other cleanup as needed
    console.log('[spaceface] Resources cleaned up');
}

/**
 * Main app initialization with enhanced error handling and recovery
 */
async function initializeApp(dependencies = {}) {
    PerformanceMonitor.mark('app-init-start');
    console.log('[spaceface] initializeApp started');
    
    // Clean up potentially lingering resources
    cleanupResources();
    
    // Clean up expired cache entries
    runWhenIdle(() => CacheManager.cleanUp());
    
    try {
        // Setup web workers if available
        const workerManager = setupWebWorkers();
        
        // Fetch partials with timeout and fallbacks
        try {
            await fetchPartials(dependencies.htmlFragmentFetcher);
        } catch (error) {
            console.warn('[spaceface] Using fallback mode for partials');
            // Continue execution even if partials fail - we've already tried fallbacks
        }
        
        // Initialize service worker with proper error handling
        if (FeatureDetector.hasServiceWorker()) {
            try {
                await initializeServiceWorker(dependencies.serviceWorkerManager);
            } catch (error) {
                // Service worker failure is non-critical, continue
                console.warn('[spaceface] Running without service worker');
            }
        }
        
        // Send telemetry for real-world performance monitoring
        runWhenIdle(() => {
            // Simplified example - you'd send this to your analytics
            const performanceData = {
                timing: window.performance.timing,
                memory: window.performance.memory,
                entries: window.performance.getEntriesByType('measure')
                    .filter(entry => entry.name.startsWith(APP_CONFIG.PERFORMANCE.MARK_PREFIX))
            };
            
            console.debug('[spaceface:perf] Performance data:', performanceData);
            // In real implementation, send this data to your server
        });
        
        return true;
    } catch (error) {
        ErrorTracker.captureError({
            level: APP_CONFIG.ERROR_LEVELS.FATAL,
            message: 'App initialization failed',
            error
        });
        console.error('[spaceface] App initialization error:', error);
        throw error;
    } finally {
        console.timeEnd('app-initialization');
        PerformanceMonitor.mark('app-init-end');
        PerformanceMonitor.measure('app-initialization', 'app-init-start', 'app-init-end');
        console.log('[spaceface] initializeApp completed');
    }
}

/**
 * Helper function for non-critical tasks
 */
function runWhenIdle(callback) {
    if (window.requestIdleCallback) {
        return window.requestIdleCallback(callback);
    } else {
        return setTimeout(callback, 1);
    }
}

// Dependency injection with enhanced resource management
function createAppWithDependencies(dependencies = {}) {
    // Create storage for cleanup functions
    const cleanupFunctions = [];
    
    const {
        domObserver = DomObserver,
        serviceWorkerManager = dependencies.serviceWorkerManager || null,
        htmlFragmentFetcher = dependencies.htmlFragmentFetcher || null,
        errorTracker = ErrorTracker
    } = dependencies;
    
    return {
        init: () => {
            // Use performance marks for monitoring
            PerformanceMonitor.mark('app-start');
            
            // Initialize error tracking
            errorTracker.init();
            
            // Still maintain the original flow:
            // 1. Wait for DOM to be loaded, then initialize app
            const domReadyPromise = domObserver.onDomLoaded().then(() => {
                console.log("[spaceface] DOM is loaded.");
                return initializeApp({
                    serviceWorkerManager,
                    htmlFragmentFetcher
                });
            });
            
            // 2. Simultaneously check for UI partials - enhanced priority system
            const uiPromise = domObserver.onSpecificFragmentsLoaded(["navigation", "cookieBanner"], APP_CONFIG.FETCH_TIMEOUT)
                .then(() => {
                    console.log("[spaceface] user interface is fully loaded.");
                    return initializeUI();
                })
                .catch(error => {
                    console.error("Error loading specific fragments:", error);
                    // Still initialize UI with limited functionality
                    return initializeUI({ limitedMode: true });
                });
                
            // Store cleanup for UI
            uiPromise.then(result => {
                if (result?.cleanup) {
                    cleanupFunctions.push(result.cleanup);
                }
            });
            
            // Listen for window unload to clean up resources
            window.addEventListener('beforeunload', () => {
                this.cleanup();
            });
                
            return domReadyPromise;
        },
        getState: appStore.getState,
        setState: appStore.setState,
        setTheme: (darkMode) => {
            appStore.setState({ darkMode });
            if (darkMode) {
                document.documentElement.classList.add('darkmode');
                CacheManager.set('theme', "enabled");
            } else {
                document.documentElement.classList.remove('darkmode');
                CacheManager.set('theme', "disabled");
            }
        },
        cleanup: () => {
            // Run registered cleanup functions
            cleanupFunctions.forEach(fn => {
                try {
                    fn();
                } catch (e) {
                    console.warn('[spaceface] Cleanup error:', e);
                }
            });
            
            // Clean up resources tracked in store
            cleanupResources();
            
            // Clear performance marks
            PerformanceMonitor.clearMarks();
        }
    };
}

// Start app initialization when script is executed
const app = createAppWithDependencies();
app.init();

// Handle visibility changes for optimizing performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Page is hidden, pause non-essential operations
        console.log('[spaceface] Page hidden, pausing non-essential operations');
        // Pause any animations, polling, or non-essential background tasks
        const state = appStore.getState();
        if (state.resources?.workers) {
            // Potentially pause heavy worker operations
            state.resources.workers.instances = {};
        }
    } else {
        // Page is visible again, resume operations
        console.log('[spaceface] Page visible, resuming operations');
        // Resume any paused operations
        
        // Check for updates if we've been hidden for a while
        const state = appStore.getState();
        if (state.resources?.serviceWorker?.manager) {
            state.resources.serviceWorker.manager.checkForUpdates();
        }
        
        // Refresh stale data if needed
        if (state.fragmentsLoaded) {
            runWhenIdle(() => {
                fetchPartials().catch(err => console.warn('[spaceface] Background refresh failed:', err));
            });
        }
    }
});

// Export app for external access
export default app;