export default class SmoothScroll {
    constructor(target, speed, smooth) {
      if (target === document)
        target = (document.scrollingElement || document.documentElement || document.body.parentNode || document.body); // cross browser support for document scrolling
  
      this.target = target;
      this.speed = speed;
      this.smooth = smooth;
      this.moving = false;
      this.pos = target.scrollTop;
      this.frame = (target === document.body && document.documentElement) ? document.documentElement : target; // safari is the new IE
  
      this.scrolled = this.scrolled.bind(this);
      this.update = this.update.bind(this);
  
      this.target.addEventListener('mousewheel', this.scrolled, { passive: false });
      this.target.addEventListener('DOMMouseScroll', this.scrolled, { passive: false });
    }
  
    scrolled(e) {
      e.preventDefault(); // disable default scrolling
  
      const delta = this.normalizeWheelDelta(e);
  
      this.pos += -delta * this.speed;
      this.pos = Math.max(0, Math.min(this.pos, this.target.scrollHeight - this.frame.clientHeight)); // limit scrolling
  
      if (!this.moving) this.update();
    }
  
    normalizeWheelDelta(e) {
      if (e.detail) {
        if (e.wheelDelta)
          return e.wheelDelta / e.detail / 40 * (e.detail > 0 ? 1 : -1); // Opera
        else
          return -e.detail / 3; // Firefox
      } else
        return e.wheelDelta / 120; // IE, Safari, Chrome
    }
  
    update() {
      this.moving = true;
  
      const delta = (this.pos - this.target.scrollTop) / this.smooth;
  
      this.target.scrollTop += delta;
  
      if (Math.abs(delta) > 0.5)
        this.requestFrame(this.update);
      else
        this.moving = false;
    }
  
    requestFrame(func) { // requestAnimationFrame cross browser
      return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(func) {
          window.setTimeout(func, 1000 / 50);
        }
      )(func);
    }
  }
  
