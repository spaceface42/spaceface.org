class CookieBanner {
    constructor(bannerId = "cookieBanner", closeButtonId = "closeBanner") {

        console.log('[module] CookieBanner started')

        this.banner = document.getElementById(bannerId);
        this.closeButton = document.getElementById(closeButtonId);

        if (!this.banner || !this.closeButton) {
            console.warn("Cookie banner elements not found. Skipping initialization.");
            return;
        }

        this.init();
    }

    init() {
        const gdprAcknowledgment = localStorage.getItem("gdprAcknowledgment");
        const thirtyDays = 30 * 24 * 60 * 60 * 1000;
        
        if (!gdprAcknowledgment || new Date().getTime() - gdprAcknowledgment > thirtyDays) {
            setTimeout(() => this.showBanner(), 100);
        } else {
            this.hideBanner(true);
        }

        this.closeButton.addEventListener("click", () => this.acknowledgeConsent());
    }

    showBanner() {
        this.banner.style.visibility = "visible";
        this.banner.style.opacity = "1";
    }

    hideBanner(permanent = false) {
        this.banner.style.visibility = "hidden";
        this.banner.style.opacity = "0";
        if (permanent) {
            this.banner.style.display = "none";
        }
    }

    acknowledgeConsent() {
        this.hideBanner();
        localStorage.setItem("gdprAcknowledgment", new Date().getTime());
    }
}

export default CookieBanner