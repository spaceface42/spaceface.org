class ServiceWorkerManager {
  constructor(options = {}) {
    this.swPath = options.swPath || "/sw.js";
    this.scope = options.scope || "/";
    this.updateInterval = options.updateInterval || 7 * 24 * 60 * 60 * 1000; // Default: weekly
    this.registrationDelay = options.registrationDelay || 1000;
    this.reloadDelay = options.reloadDelay || 1000;
    this.showUpdateNotification = options.showUpdateNotification !== false;
    
    this.updateInProgress = false;
    this.initialized = false;
    this.registration = null;
    this.updateCheckInterval = null;
    
    // Setup listener for partial load failures from service worker
    this._setupPartialFailureListener();
  }

  async register() {
    if (!("serviceWorker" in navigator)) {
      console.warn("[ServiceWorkerManager] Service Workers are not supported in this browser.");
      return null;
    }

    try {
      // Wait before registering to allow theme and cookie scripts to initialize first
      await new Promise(resolve => setTimeout(resolve, this.registrationDelay));
      
      this.registration = await navigator.serviceWorker.register(this.swPath, { scope: this.scope });
      console.log("[ServiceWorkerManager] Service Worker Registered");

      // Setup listeners for updates
      this._setupUpdateListeners();
      
      // Setup periodic update checks
      this._startUpdateChecks();
      
      // Listen for theme changes to avoid caching issues
      this._setupThemeChangeListener();
      
      this.initialized = true;
      return this.registration;
    } catch (err) {
      console.error("[ServiceWorkerManager] Service Worker Registration Failed:", err);
      this._tryRecovery();
      return null;
    }
  }

  async checkForUpdates() {
    console.error("[ServiceWorkerManager] Checking for updates");
    if (!("serviceWorker" in navigator)) return;
    
    try {
      if (!this.registration) {
        this.registration = await navigator.serviceWorker.getRegistration();
      }
      
      if (this.registration) {
        await this.registration.update();
        if (this.registration.waiting) {
          this._notifyUpdateAvailable();
        }
      }
    } catch (err) {
      console.error("[ServiceWorkerManager] Update check failed:", err);
    }
  }

  _startUpdateChecks() {
    // Clear any existing interval
    if (this.updateCheckInterval) {
      clearInterval(this.updateCheckInterval);
    }
    
    // For portfolio site with infrequent updates: check weekly
    this.updateCheckInterval = setInterval(() => this.checkForUpdates(), this.updateInterval);
  }

  _setupUpdateListeners() {
    if (!this.registration) return;

    // Check if there's a waiting service worker
    if (this.registration.waiting) {
      this._notifyUpdateAvailable();
    }

    // Listen for new updates
    this.registration.addEventListener("updatefound", () => {
      const newWorker = this.registration.installing;
      if (newWorker) {
        newWorker.addEventListener("statechange", () => {
          if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
            this._notifyUpdateAvailable();
          }
        });
      }
    });

    // Listen for messages from service worker
    navigator.serviceWorker.addEventListener("message", (event) => {
      if (event.data?.action === "updateAvailable") {
        this._notifyUpdateAvailable();
      }
    });
  }
  
  // Setup listener for partial load failures
  _setupPartialFailureListener() {
    if (!("serviceWorker" in navigator)) return;
    
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data && event.data.action === 'partialLoadFailed') {
        console.warn(`Partial HTML failed to load: ${event.data.url}`);
        
        // Dispatch a custom event that the app can listen for
        document.dispatchEvent(new CustomEvent('partialLoadFailed', {
          detail: {
            url: event.data.url
          }
        }));
        
        // Force trigger fragmentsLoaded event to ensure UI components initialize
        if (!document.fragmentsAlreadyLoaded) {
          document.fragmentsAlreadyLoaded = true;
          document.dispatchEvent(new Event('fragmentsLoaded'));
        }
      }
    });
  }

  _notifyUpdateAvailable() {
    // For a portfolio site, optionally show a user-friendly notification
    if (this.showUpdateNotification) {
      this._showUpdateUI();
    } else {
      this._applyUpdate();
    }
  }
  
  _showUpdateUI() {
    // Prevent multiple notifications
    if (document.getElementById('sw-update-notification')) return;
    
    const notification = document.createElement('div');
    notification.id = 'sw-update-notification';
    notification.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #333;
      color: white;
      padding: 15px;
      border-radius: 4px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
      z-index: 10000;
      display: flex;
      align-items: center;
      font-family: system-ui, -apple-system, sans-serif;
    `;
    
    notification.innerHTML = `
      <div style="flex: 1">Site update available. Refresh to view the latest version.</div>
      <button id="sw-update-now" style="margin-left: 10px; background: #4CAF50; border: none; color: white; padding: 5px 10px; border-radius: 3px; cursor: pointer;">Update Now</button>
      <button id="sw-update-later" style="margin-left: 5px; background: transparent; border: 1px solid #999; color: white; padding: 5px 10px; border-radius: 3px; cursor: pointer;">Later</button>
    `;
    
    document.body.appendChild(notification);
    
    document.getElementById('sw-update-now').addEventListener('click', () => {
      this._applyUpdate();
      notification.remove();
    });
    
    document.getElementById('sw-update-later').addEventListener('click', () => {
      notification.remove();
    });
  }

  _applyUpdate() {
    console.error("[ServiceWorkerManager] Updateing");
    // Prevent multiple update attempts
    if (this.updateInProgress) return;
    this.updateInProgress = true;
    
    if (!this.registration) {
      window.location.reload();
      return;
    }
    
    // For portfolio site: Add a small delay before reload to ensure content is displayed
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      // Save theme preference before reload
      const currentTheme = document.documentElement.dataset.theme || 
                          localStorage.getItem('theme') || 
                          'light';
      
      localStorage.setItem('theme', currentTheme);
      
      // Add a delay to ensure visitors see the content before reload
      setTimeout(() => {
        window.location.reload();
      }, this.reloadDelay);
    }, { once: true });
    
    // Skip waiting and activate new service worker
    if (this.registration.waiting) {
      this.registration.waiting.postMessage({ action: "skipWaiting" });
    }
  }
  
  // Listen for theme changes to avoid caching issues
  _setupThemeChangeListener() {
    // Watch for theme toggle button clicks
    document.addEventListener('click', event => {
      const themeToggle = event.target.closest('[data-theme-toggle]');
      if (themeToggle) {
        this._notifyServiceWorkerOfThemeChange();
      }
    });
    
    // Watch for theme changes in localStorage
    window.addEventListener('storage', event => {
      if (event.key === 'theme') {
        this._notifyServiceWorkerOfThemeChange();
      }
    });
    
    // Check theme on page load
    document.addEventListener('DOMContentLoaded', () => {
      this._notifyServiceWorkerOfThemeChange();
    });
  }
  
  // Notify service worker when theme changes
  _notifyServiceWorkerOfThemeChange() {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        action: 'themeChanged',
        theme: document.documentElement.dataset.theme || localStorage.getItem('theme') || 'light'
      });
    }
  }
  
  // Attempt to recover from registration failures
  _tryRecovery() {
    // Try to clear service worker registration if it failed
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        for (const registration of registrations) {
          registration.unregister();
        }
        console.log('Attempted recovery by unregistering service workers');
      });
    }
  }
  
  // Cleanup method to stop update checks
  destroy() {
    if (this.updateCheckInterval) {
      clearInterval(this.updateCheckInterval);
    }
    this.updateInProgress = false;
    this.initialized = false;
  }
}

export default ServiceWorkerManager;