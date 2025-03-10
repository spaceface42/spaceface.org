/**
 * DarkModeToggle v1
 *
 * Usage example:
 * <script type="module" src="./index.js"></script>
 * import DarkModeToggle from "./DarkModeToggle.js";
 * new DarkModeToggle('#dark-mode-toggle');
  // import DarkModeToggle from "./DarkModeToggle.js";
  // new DarkModeToggle('#dark-mode-toggle', { useCSSVar: true });
 *
 */

class DarkModeToggle {
  constructor(toggleSelector, { storageKey = 'darkMode', darkModeClass = 'darkmode', useCSSVar = true } = {}) {
    if (!toggleSelector) {
      console.warn("DarkModeToggle: No selector provided.");
      return;
    }

    this.toggleButton = document.querySelector(toggleSelector);
    if (!this.toggleButton) {
      console.warn(`DarkModeToggle: No element found for selector '${toggleSelector}'`);
      return;
    }

    this.storageKey = storageKey;
    this.darkModeClass = darkModeClass;
    this.useCSSVar = useCSSVar;
    this.handleToggleClick = this.toggleDarkMode.bind(this);

    this.init();
  }

  init() {
    const storedTheme = localStorage.getItem(this.storageKey);
    
    if (storedTheme === 'enabled') {
      this.enableDarkMode();
    } else {
      this.disableDarkMode(); // Explicitly disable dark mode if it's not "enabled"
    }
  
    this.enable();
  }
  
  initOld() {
    const storedTheme = localStorage.getItem(this.storageKey);
    
    if (storedTheme === 'enabled' || (storedTheme === null && this.isSystemDarkMode())) {
      this.enableDarkMode();
    }

    this.enable();
  }

  isDarkModeEnabled() {
    return localStorage.getItem(this.storageKey) === 'enabled';
  }

  isSystemDarkMode() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  enableDarkMode() {
    if (this.useCSSVar) {
      document.documentElement.style.setProperty('--dark-mode', '1');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
    localStorage.setItem(this.storageKey, 'enabled');
    this.updateButtonState(true);
  }

  disableDarkMode() {
    if (this.useCSSVar) {
      document.documentElement.style.removeProperty('--dark-mode');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
    localStorage.setItem(this.storageKey, 'disabled');
    this.updateButtonState(false);
  }

  resetToSystemPreference() {
    localStorage.removeItem(this.storageKey);
    document.documentElement.removeAttribute('style'); 
    document.documentElement.removeAttribute('data-theme');
    this.updateButtonState(null);
  }

  toggleDarkMode() {
    const storedTheme = localStorage.getItem(this.storageKey);

    if (storedTheme === 'enabled') {
      this.disableDarkMode();
    } else if (storedTheme === 'disabled') {
      this.enableDarkMode();
    } else {
      this.resetToSystemPreference();
    }
  }

  updateButtonState(isEnabled) {
    if (isEnabled === null) {
      this.toggleButton.setAttribute('aria-pressed', 'mixed'); // Represents "system setting"
    } else {
      this.toggleButton.setAttribute('aria-pressed', isEnabled);
    }
  }

  enable() {
    this.toggleButton.addEventListener('click', this.handleToggleClick);
  }

  disable() {
    this.toggleButton.removeEventListener('click', this.handleToggleClick);
  }

  destroy() {
    this.disable();
  }
}

export default DarkModeToggle

