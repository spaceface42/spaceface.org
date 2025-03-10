/**
 * Startup Script for SpaceFace App with Prioritized UI Partial Loading
 */
console.log("[spaceface] booting...");
console.time('app-initialization');

import DomObserver from "./app/DomObserver.js";
import ServiceWorkerManager from "./app/ServiceWorkerManager.js";
import HTMLFragmentFetcher from "./app/HTMLFragmentFetcher.js";

const APP_CONFIG = {
    FETCH_TIMEOUT: 3000,
    STORAGE_KEY: "darkMode",
};

// Simple state management for app state
const createStore = (initialState) => {
    let state = initialState;
    const listeners = [];
    
    return {
        getState: () => ({...state}),
        setState: (newState) => {
            state = {...state, ...newState};
            listeners.forEach(listener => listener(state));
        },
        subscribe: (listener) => {
            listeners.push(listener);
            return () => {
                const index = listeners.indexOf(listener);
                if (index > -1) listeners.splice(index, 1);
            };
        }
    };
};

// Application state store
const appStore = createStore({
    uiInitialized: false,
    darkMode: false,
    fragmentsLoaded: false
});

// Lightweight feature detection
const hasStorage = () => {
    try {
        return 'localStorage' in window && window.localStorage !== null;
    } catch (e) {
        return false;
    }
};

// Service worker support check
const hasServiceWorker = 'serviceWorker' in navigator;

/**
 * Function to handle theme switching logic
 */
async function initializeThemeSwitcher(DarkModeToggle) {
    console.log("[spaceface] initializeThemeSwitcher working");

    // Initialize the dark mode toggle component
    new DarkModeToggle('#dark-mode-toggle', { useCSSVar: true });

    const toggle = document.getElementById("toggle");
    if (!toggle) {
        console.warn("[spaceface] Toggle element not found");
        return;
    }

    const darkModeToggle = document.getElementById("dark-mode-toggle");
    if (!darkModeToggle) {
        console.warn("[spaceface] Dark mode toggle element not found");
        return;
    }

    // Use simplified storage check
    const canUseStorage = hasStorage();
    let storedTheme = null;

    // Only try to access localStorage if it's available
    if (canUseStorage) {
        storedTheme = localStorage.getItem(APP_CONFIG.STORAGE_KEY);
        console.log("[_________] Stored theme:", storedTheme);
    } else {
        console.warn("[spaceface] localStorage is not available, defaulting to system preference.");
    }

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
        } else {
            document.documentElement.classList.remove('darkmode');
        }
    }

    // Store the event listener reference for potential cleanup
    const toggleClickHandler = () => {
        toggled = !toggled;

        // Save theme to localStorage if available
        if (canUseStorage) {
            try {
                localStorage.setItem(APP_CONFIG.STORAGE_KEY, toggled ? "enabled" : "disabled");
            } catch (error) {
                console.warn("[spaceface] Failed to save theme preference:", error);
            }
        }

        // Apply theme based on the new state
        if (toggled) {
            document.documentElement.classList.add('darkmode');
        } else {
            document.documentElement.classList.remove('darkmode');
        }

        updateTogglePosition();
    };

    // Clean up any existing listeners to prevent duplicates
    darkModeToggle.removeEventListener("click", toggleClickHandler);
    
    // Add the event listener
    darkModeToggle.addEventListener("click", toggleClickHandler);
}

async function fetchPartials(fetcher) {
    console.log("[spaceface] fetchPartials is fetching HTML partials");
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), APP_CONFIG.FETCH_TIMEOUT);
    
    try {
        const htmlFetcher = fetcher || new HTMLFragmentFetcher({ signal: controller.signal });
        await htmlFetcher.fetchAll();
        clearTimeout(timeoutId);
        
        htmlFetcher.watch();
        htmlFetcher.observeLinks();
        
        return true;
    } catch (error) {
        if (error.name === 'AbortError') {
            console.warn('[spaceface] Fetch operation timed out');
        }
        throw error;
    }
}

/**
 * Simplified service worker initialization
 */
async function initializeServiceWorker(swManager) {
    console.log('[spaceface] setting up Service Worker');
    try {
        const serviceWorkerManager = swManager || new ServiceWorkerManager({
            updateInterval: 7 * 24 * 60 * 60 * 1000, // weekly (7 days in milliseconds)
            showUpdateNotification: true
        });
        
        // Register in one step
        const registration = await serviceWorkerManager.register();
        console.log("[spaceface] Service Worker registered:", registration);

        if (registration.installing) {
            console.log('[spaceface] Service worker installing');
        } else if (registration.waiting) {
            console.log('[spaceface] Service worker installed');
        } else if (registration.active) {
            console.log('[spaceface] Service worker active');
        }

        return registration;
    } catch (error) {
        console.error("[spaceface] Service Worker registration failed:", error);
        throw error;
    }
}

async function initializeUI(options = {}) {
    console.log("[spaceface] Initializing UI components", options.limitedMode ? "(limited mode)" : "");

    const { uiInitialized } = appStore.getState();
    if (uiInitialized) return;
    
    try {
        // Lazy load UI components
        const [
            { default: DarkModeToggle },
            { default: CookieBanner }
        ] = await Promise.all([
            import("./app/DarkModeToggle.js"),
            import("./modules/cookiebanner/CookieBanner.js")
        ]);
    
        initializeThemeSwitcher(DarkModeToggle);
    
        console.log('[spaceface] setting up cookiebanner');
        new CookieBanner();
        
        appStore.setState({ uiInitialized: true });
        return true;
    } catch (error) {
        console.error("[spaceface] Failed to initialize UI components:", error);
        throw error;
    }
}

async function initializeApp(dependencies = {}) {
    console.log('[spaceface] initializeApp started');
    
    try {
        // Fetch partials with timeout
        await fetchPartials(dependencies.htmlFragmentFetcher);
        
        // Initialize service worker if supported
        if (hasServiceWorker) {
            await initializeServiceWorker(dependencies.serviceWorkerManager);
        }
        
        return true;
    } catch (error) {
        console.error('[spaceface] App initialization error:', error);
        throw error;
    } finally {
        console.timeEnd('app-initialization');
        console.log('[spaceface] initializeApp completed');
    }
}

// Dependency injection for testing
function createAppWithDependencies(dependencies = {}) {
    const {
        domObserver = DomObserver,
        serviceWorkerManager = dependencies.serviceWorkerManager || null,
        htmlFragmentFetcher = dependencies.htmlFragmentFetcher || null
    } = dependencies;
    
    return {
        init: () => {
            // Still maintain the original flow:
            // 1. Wait for DOM to be loaded, then initialize app
            const domReadyPromise = domObserver.onDomLoaded().then(() => {
                console.log("[spaceface] DOM is loaded.");
                return initializeApp({
                    serviceWorkerManager,
                    htmlFragmentFetcher
                });
            });
            
            // 2. Simultaneously check for UI partials
            domObserver.onSpecificFragmentsLoaded(["navigation", "cookieBanner"], APP_CONFIG.FETCH_TIMEOUT)
                .then(() => {
                    console.log("[spaceface] user interface is fully loaded.");
                    initializeUI();
                })
                .catch(error => {
                    console.error("Error loading specific fragments:", error);
                    // Still initialize UI with limited functionality
                    initializeUI({ limitedMode: true });
                });
                
            return domReadyPromise;
        },
        getState: appStore.getState,
        setState: appStore.setState,
        setTheme: (darkMode) => {
            appStore.setState({ darkMode });
            if (darkMode) {
                document.documentElement.classList.add('darkmode');
            } else {
                document.documentElement.classList.remove('darkmode');
            }
        }
    };
}

// Start app initialization when script is executed
const app = createAppWithDependencies();
app.init();