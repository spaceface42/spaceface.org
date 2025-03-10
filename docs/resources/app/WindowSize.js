import { throttleWithTimeout, throttleWithRAF } from './utils.js';

export class WindowSize {
    constructor(selector) {
        this.element = document.querySelector(selector);
        if (!this.element) {
            console.error('Element not found');
            return;
        }

        this.sizeText = '';
        this.mouseText = '';
        this.timeText = '';
        this.isUpdating = false;

        this.updateSize();
        this.updateTime();

        // Use throttling to reduce frequency of updates
        this.throttledUpdateSize = throttleWithTimeout(() => this.updateSize(), 200);
        this.throttledMouseUpdate = throttleWithRAF((event) => this.requestMouseUpdate(event));

        window.addEventListener('resize', this.throttledUpdateSize);
        window.addEventListener('mousemove', this.throttledMouseUpdate);

        setInterval(() => this.updateTime(), 60000);
    }

    updateSize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        this.sizeText = `Size: ${width} x ${height}`;
        this.updateDisplay();
    }

    requestMouseUpdate(event) {
        this.mouseX = event.clientX;
        this.mouseY = event.clientY;
        if (!this.isUpdating) {
            this.isUpdating = true;
            requestAnimationFrame(() => this.updateMousePosition());
        }
    }

    updateMousePosition() {
        this.mouseText = `Mouse: ${this.mouseX}, ${this.mouseY}`;
        this.updateDisplay();
        this.isUpdating = false;
    }

    updateTime() {
        const now = new Date();
        this.timeText = `Time: ${now.getHours()}:${now.getMinutes()} | Date: ${now.toLocaleDateString()}`;
        this.updateDisplay();
    }

    updateDisplay() {
        const data = {
            size: this.sizeText,
            mouse: this.mouseText || '',
            time: this.timeText || ''
        };

        document.querySelector('#windowSize').textContent = `${data.size}`;
        document.querySelector('#mousePos').textContent = `${data.mouse}`;
        document.querySelector('#time').textContent = `${data.time}`;
    }
}
