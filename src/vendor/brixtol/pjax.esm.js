/**
 * Attribute Configuration
 *
 * Used to match Pjax data attribute names
 */
const Attr = /^data-pjax-(append|prepend|replace|history|progress|threshold|position)$/i;
/**
 * URL Pathname
 *
 * Used to match first pathname from a URL (group 1)

 */
const Pathname = /\/\/[^/]*(\/[^;]*)/;
/**
 * Boolean Attribute value
 *
 * Used to Match 'true' or 'false' attribute
 */
const isBoolean = /^(true|false)$/i;
/**
 * Matches decimal number
 *
 * Used to Match number, respected negative numbers
 */
const isNumber = /^[+-]?\d*\.?\d+$/;
/**
 * Attribute Parameter Value
 *
 * Used to match a class event caller target attributes
 */
const ActionParams = /[^,'"[\]()\s]+/g;
/**
 * Array Value
 *
 * Used to test value for a string array attribute value, like data-pjax-replace.
 *
 * @example
 * https://regex101.com/r/I77U9B/1
 *
 */
const isArray = /\(?\[['"].*?['"],?\]\)?/;
/**
 * Append or Prepend attribute value
 *
 * Used to test value for append or prepend, array within array
 *
 * @example
 * https://regex101.com/r/QDSRBK/1
 *
 */
const isPenderValue = /\(?(\[(['"].*?['"],?){2}\],?)\1?\)?/;
/**
 * Test Position Attributes
 *
 * Tests attribute values for a position config
 *
 * @example
 * https://regex101.com/r/DG2LI1/1
 *
 */
const isPosition = /[xy]:[0-9.]+/;
/**
 * Mached Position Attributes
 *
 * Used to match `x:0` and `y:0` JSON space separated attributes
 */
const inPosition = /[xy]|\d*\.?\d+/g;
/**
 * Protocol
 *
 * Used to match Protocol
 */
const Protocol = /^https?:$/;

// This file replaces `index.js` in bundlers like webpack or Rollup,

let nanoid = (size = 21) => {
  let id = '';
  let bytes = crypto.getRandomValues(new Uint8Array(size));

  // A compact alternative for `for (var i = 0; i < step; i++)`.
  while (size--) {
    // It is incorrect to use bytes exceeding the alphabet size.
    // The following mask reduces the random byte in the 0-255 value
    // range to the 0-63 value range. Therefore, adding hacks, such
    // as empty string fallback or magic numbers, is unneccessary because
    // the bitmask trims bytes down to the alphabet size.
    let byte = bytes[size] & 63;
    if (byte < 36) {
      // `0-9a-z`
      id += byte.toString(36);
    } else if (byte < 62) {
      // `A-Z`
      id += (byte - 26).toString(36).toUpperCase();
    } else if (byte < 63) {
      id += '_';
    } else {
      id += '-';
    }
  }
  return id
};

const e=Object.assign||((e,t)=>(t&&Object.keys(t).forEach(o=>e[o]=t[o]),e)),t=(e,r,s)=>{const c=typeof s;if(s&&"object"===c)if(Array.isArray(s))for(const o of s)r=t(e,r,o);else for(const c of Object.keys(s)){const f=s[c];"function"==typeof f?r[c]=f(r[c],o):void 0===f?e&&!isNaN(c)?r.splice(c,1):delete r[c]:null===f||"object"!=typeof f||Array.isArray(f)?r[c]=f:"object"==typeof r[c]?r[c]=f===r[c]?f:o(r[c],f):r[c]=t(!1,{},f);}else "function"===c&&(r=s(r,o));return r},o=(o,...r)=>{const s=Array.isArray(o);return t(s,s?o.slice():e({},o),r)};

function m$1(){m$1=Object.assign||function(a){for(var c=1;c<arguments.length;c++){var g=arguments[c],h;for(h in g)Object.prototype.hasOwnProperty.call(g,h)&&(a[h]=g[h]);}return a};return m$1.apply(this,arguments)}var r,v=r||(r={});v.Pop="POP";v.Push="PUSH";v.Replace="REPLACE";var y=function(a){return Object.freeze(a)};function z(a,c){if(!a){"undefined"!==typeof console&&console.warn(c);try{throw Error(c);}catch(g){}}}
function A(a){a.preventDefault();a.returnValue="";}function E$1(){var a=[];return {get length(){return a.length},push:function(c){a.push(c);return function(){a=a.filter(function(a){return a!==c});}},call:function(c){a.forEach(function(a){return a&&a(c)});}}}
var F$1=function(a){function c(){var b=n.location,a=p.state||{};return [a.idx,y({pathname:b.pathname,search:b.search,hash:b.hash,state:a.usr||null,key:a.key||"default"})]}function g(b){if("string"===typeof b)var a=b;else {a=b.pathname;var c=b.search;b=b.hash;a=(void 0===a?"/":a)+(void 0===c?"":c)+(void 0===b?"":b);}return a}function h(b,a){void 0===a&&(a=null);var c=m$1,f=t;if("string"===typeof b){var d={};if(b){var e=b.indexOf("#");0<=e&&(d.hash=b.substr(e),b=b.substr(0,e));e=b.indexOf("?");0<=e&&(d.search=
b.substr(e),b=b.substr(0,e));b&&(d.pathname=b);}b=d;}return y(c({},f,{},b,{state:a,key:Math.random().toString(36).substr(2,8)}))}function w(b){x=b;b=c();l=b[0];t=b[1];B.call({action:x,location:t});}function C(b,a){function c(){C(b,a);}var f=r.Push,d=h(b,a);if(!k.length||(k.call({action:f,location:d,retry:c}),!1)){var e=[{usr:d.state,key:d.key,idx:l+1},g(d)];d=e[0];e=e[1];try{p.pushState(d,"",e);}catch(G){n.location.assign(e);}w(f);}}function D(a,c){function b(){D(a,c);}var f=r.Replace,d=h(a,c);k.length&&
(k.call({action:f,location:d,retry:b}),1)||(d=[{usr:d.state,key:d.key,idx:l},g(d)],p.replaceState(d[0],"",d[1]),w(f));}function q(a){p.go(a);}void 0===a&&(a={});a=a.window;var n=void 0===a?document.defaultView:a,p=n.history,u=null;n.addEventListener("popstate",function(){if(u)k.call(u),u=null;else {var a=r.Pop,f=c(),g=f[0];f=f[1];if(k.length)if(null!=g){var h=l-g;h&&(u={action:a,location:f,retry:function(){q(-1*h);}},q(h));}else z(!1,"You are trying to block a POP navigation to a location that was not created by the history library. The block will fail silently in production, but in general you should do all navigation with the history library (instead of using window.history.pushState directly) to avoid this situation.");else w(a);}});var x=r.Pop;a=c();var l=a[0],t=a[1],B=E$1(),k=E$1();null==l&&(l=0,p.replaceState(m$1({},p.state,{idx:l}),""));return {get action(){return x},get location(){return t},createHref:g,push:C,replace:D,go:q,back:function(){q(-1);},forward:function(){q(1);},listen:function(a){return B.push(a)},block:function(a){var b=k.push(a);1===k.length&&n.addEventListener("beforeunload",A);return function(){b();k.length||n.removeEventListener("beforeunload",A);}}}}();const _history = F$1;

/**
 * Dispatches lifecycle events on the document.
 */
/**
 * Dispatches lifecycle events on the document.
 */
function dispatchEvent(eventName, detail, cancelable = false) {
    // create and dispatch the event
    const newEvent = new CustomEvent(eventName, { detail, cancelable });
    return document.dispatchEvent(newEvent);
}

let connected$5 = false;
/**
 * Returns to current scroll position, the `reset()`
 * function **MUST** be called after referencing this
 * to reset position.
 */
let position = { x: 0, y: 0 };
/**
 * onScroll event, asserts the current X and Y page
 * offset position of the document
 */
function onScroll() {
    var _a, _b;
    position.x = (_a = window.screenX) !== null && _a !== void 0 ? _a : window.pageXOffset;
    position.y = (_b = window.screenY) !== null && _b !== void 0 ? _b : window.pageYOffset;
}
/**
 * Resets the scroll position`of the document, applying
 * a `x`and `y` positions to `0`
 */
function reset() {
    position.x = 0;
    position.y = 0;
    return position;
}
/**
 * Returns a faux scroll position. This prevents the
 * tracked scroll position from being overwritten and is
 * used within functions like `href.attrparse`
 */
function y0x0() {
    return {
        x: 0,
        y: 0
    };
}
/**
 * Attached `scroll` event listener.
 */
function start$4() {
    if (!connected$5) {
        addEventListener('scroll', onScroll, false);
        onScroll();
        connected$5 = true;
    }
}
/**
 * Removed `scroll` event listener.
 */
function stop$4() {
    if (connected$5) {
        removeEventListener('scroll', onScroll, false);
        position = y0x0();
        connected$5 = false;
    }
}

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn) {
  var module = { exports: {} };
    return fn(module, module.exports), module.exports;
}

/* NProgress, (c) 2013, 2014 Rico Sta. Cruz - http://ricostacruz.com/nprogress
 * @license MIT */

var nprogress = createCommonjsModule(function (module, exports) {
(function(root, factory) {

  {
    module.exports = factory();
  }

})(commonjsGlobal, function() {
  var NProgress = {};

  NProgress.version = '0.2.0';

  var Settings = NProgress.settings = {
    minimum: 0.08,
    easing: 'ease',
    positionUsing: '',
    speed: 200,
    trickle: true,
    trickleRate: 0.02,
    trickleSpeed: 800,
    showSpinner: true,
    barSelector: '[role="bar"]',
    spinnerSelector: '[role="spinner"]',
    parent: 'body',
    template: '<div class="bar" role="bar"><div class="peg"></div></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
  };

  /**
   * Updates configuration.
   *
   *     NProgress.configure({
   *       minimum: 0.1
   *     });
   */
  NProgress.configure = function(options) {
    var key, value;
    for (key in options) {
      value = options[key];
      if (value !== undefined && options.hasOwnProperty(key)) Settings[key] = value;
    }

    return this;
  };

  /**
   * Last number.
   */

  NProgress.status = null;

  /**
   * Sets the progress bar status, where `n` is a number from `0.0` to `1.0`.
   *
   *     NProgress.set(0.4);
   *     NProgress.set(1.0);
   */

  NProgress.set = function(n) {
    var started = NProgress.isStarted();

    n = clamp(n, Settings.minimum, 1);
    NProgress.status = (n === 1 ? null : n);

    var progress = NProgress.render(!started),
        bar      = progress.querySelector(Settings.barSelector),
        speed    = Settings.speed,
        ease     = Settings.easing;

    progress.offsetWidth; /* Repaint */

    queue(function(next) {
      // Set positionUsing if it hasn't already been set
      if (Settings.positionUsing === '') Settings.positionUsing = NProgress.getPositioningCSS();

      // Add transition
      css(bar, barPositionCSS(n, speed, ease));

      if (n === 1) {
        // Fade out
        css(progress, { 
          transition: 'none', 
          opacity: 1 
        });
        progress.offsetWidth; /* Repaint */

        setTimeout(function() {
          css(progress, { 
            transition: 'all ' + speed + 'ms linear', 
            opacity: 0 
          });
          setTimeout(function() {
            NProgress.remove();
            next();
          }, speed);
        }, speed);
      } else {
        setTimeout(next, speed);
      }
    });

    return this;
  };

  NProgress.isStarted = function() {
    return typeof NProgress.status === 'number';
  };

  /**
   * Shows the progress bar.
   * This is the same as setting the status to 0%, except that it doesn't go backwards.
   *
   *     NProgress.start();
   *
   */
  NProgress.start = function() {
    if (!NProgress.status) NProgress.set(0);

    var work = function() {
      setTimeout(function() {
        if (!NProgress.status) return;
        NProgress.trickle();
        work();
      }, Settings.trickleSpeed);
    };

    if (Settings.trickle) work();

    return this;
  };

  /**
   * Hides the progress bar.
   * This is the *sort of* the same as setting the status to 100%, with the
   * difference being `done()` makes some placebo effect of some realistic motion.
   *
   *     NProgress.done();
   *
   * If `true` is passed, it will show the progress bar even if its hidden.
   *
   *     NProgress.done(true);
   */

  NProgress.done = function(force) {
    if (!force && !NProgress.status) return this;

    return NProgress.inc(0.3 + 0.5 * Math.random()).set(1);
  };

  /**
   * Increments by a random amount.
   */

  NProgress.inc = function(amount) {
    var n = NProgress.status;

    if (!n) {
      return NProgress.start();
    } else {
      if (typeof amount !== 'number') {
        amount = (1 - n) * clamp(Math.random() * n, 0.1, 0.95);
      }

      n = clamp(n + amount, 0, 0.994);
      return NProgress.set(n);
    }
  };

  NProgress.trickle = function() {
    return NProgress.inc(Math.random() * Settings.trickleRate);
  };

  /**
   * Waits for all supplied jQuery promises and
   * increases the progress as the promises resolve.
   *
   * @param $promise jQUery Promise
   */
  (function() {
    var initial = 0, current = 0;

    NProgress.promise = function($promise) {
      if (!$promise || $promise.state() === "resolved") {
        return this;
      }

      if (current === 0) {
        NProgress.start();
      }

      initial++;
      current++;

      $promise.always(function() {
        current--;
        if (current === 0) {
            initial = 0;
            NProgress.done();
        } else {
            NProgress.set((initial - current) / initial);
        }
      });

      return this;
    };

  })();

  /**
   * (Internal) renders the progress bar markup based on the `template`
   * setting.
   */

  NProgress.render = function(fromStart) {
    if (NProgress.isRendered()) return document.getElementById('nprogress');

    addClass(document.documentElement, 'nprogress-busy');
    
    var progress = document.createElement('div');
    progress.id = 'nprogress';
    progress.innerHTML = Settings.template;

    var bar      = progress.querySelector(Settings.barSelector),
        perc     = fromStart ? '-100' : toBarPerc(NProgress.status || 0),
        parent   = document.querySelector(Settings.parent),
        spinner;
    
    css(bar, {
      transition: 'all 0 linear',
      transform: 'translate3d(' + perc + '%,0,0)'
    });

    if (!Settings.showSpinner) {
      spinner = progress.querySelector(Settings.spinnerSelector);
      spinner && removeElement(spinner);
    }

    if (parent != document.body) {
      addClass(parent, 'nprogress-custom-parent');
    }

    parent.appendChild(progress);
    return progress;
  };

  /**
   * Removes the element. Opposite of render().
   */

  NProgress.remove = function() {
    removeClass(document.documentElement, 'nprogress-busy');
    removeClass(document.querySelector(Settings.parent), 'nprogress-custom-parent');
    var progress = document.getElementById('nprogress');
    progress && removeElement(progress);
  };

  /**
   * Checks if the progress bar is rendered.
   */

  NProgress.isRendered = function() {
    return !!document.getElementById('nprogress');
  };

  /**
   * Determine which positioning CSS rule to use.
   */

  NProgress.getPositioningCSS = function() {
    // Sniff on document.body.style
    var bodyStyle = document.body.style;

    // Sniff prefixes
    var vendorPrefix = ('WebkitTransform' in bodyStyle) ? 'Webkit' :
                       ('MozTransform' in bodyStyle) ? 'Moz' :
                       ('msTransform' in bodyStyle) ? 'ms' :
                       ('OTransform' in bodyStyle) ? 'O' : '';

    if (vendorPrefix + 'Perspective' in bodyStyle) {
      // Modern browsers with 3D support, e.g. Webkit, IE10
      return 'translate3d';
    } else if (vendorPrefix + 'Transform' in bodyStyle) {
      // Browsers without 3D support, e.g. IE9
      return 'translate';
    } else {
      // Browsers without translate() support, e.g. IE7-8
      return 'margin';
    }
  };

  /**
   * Helpers
   */

  function clamp(n, min, max) {
    if (n < min) return min;
    if (n > max) return max;
    return n;
  }

  /**
   * (Internal) converts a percentage (`0..1`) to a bar translateX
   * percentage (`-100%..0%`).
   */

  function toBarPerc(n) {
    return (-1 + n) * 100;
  }


  /**
   * (Internal) returns the correct CSS for changing the bar's
   * position given an n percentage, and speed and ease from Settings
   */

  function barPositionCSS(n, speed, ease) {
    var barCSS;

    if (Settings.positionUsing === 'translate3d') {
      barCSS = { transform: 'translate3d('+toBarPerc(n)+'%,0,0)' };
    } else if (Settings.positionUsing === 'translate') {
      barCSS = { transform: 'translate('+toBarPerc(n)+'%,0)' };
    } else {
      barCSS = { 'margin-left': toBarPerc(n)+'%' };
    }

    barCSS.transition = 'all '+speed+'ms '+ease;

    return barCSS;
  }

  /**
   * (Internal) Queues a function to be executed.
   */

  var queue = (function() {
    var pending = [];
    
    function next() {
      var fn = pending.shift();
      if (fn) {
        fn(next);
      }
    }

    return function(fn) {
      pending.push(fn);
      if (pending.length == 1) next();
    };
  })();

  /**
   * (Internal) Applies css properties to an element, similar to the jQuery 
   * css method.
   *
   * While this helper does assist with vendor prefixed property names, it 
   * does not perform any manipulation of values prior to setting styles.
   */

  var css = (function() {
    var cssPrefixes = [ 'Webkit', 'O', 'Moz', 'ms' ],
        cssProps    = {};

    function camelCase(string) {
      return string.replace(/^-ms-/, 'ms-').replace(/-([\da-z])/gi, function(match, letter) {
        return letter.toUpperCase();
      });
    }

    function getVendorProp(name) {
      var style = document.body.style;
      if (name in style) return name;

      var i = cssPrefixes.length,
          capName = name.charAt(0).toUpperCase() + name.slice(1),
          vendorName;
      while (i--) {
        vendorName = cssPrefixes[i] + capName;
        if (vendorName in style) return vendorName;
      }

      return name;
    }

    function getStyleProp(name) {
      name = camelCase(name);
      return cssProps[name] || (cssProps[name] = getVendorProp(name));
    }

    function applyCss(element, prop, value) {
      prop = getStyleProp(prop);
      element.style[prop] = value;
    }

    return function(element, properties) {
      var args = arguments,
          prop, 
          value;

      if (args.length == 2) {
        for (prop in properties) {
          value = properties[prop];
          if (value !== undefined && properties.hasOwnProperty(prop)) applyCss(element, prop, value);
        }
      } else {
        applyCss(element, args[1], args[2]);
      }
    }
  })();

  /**
   * (Internal) Determines if an element or space separated list of class names contains a class name.
   */

  function hasClass(element, name) {
    var list = typeof element == 'string' ? element : classList(element);
    return list.indexOf(' ' + name + ' ') >= 0;
  }

  /**
   * (Internal) Adds a class to an element.
   */

  function addClass(element, name) {
    var oldList = classList(element),
        newList = oldList + name;

    if (hasClass(oldList, name)) return; 

    // Trim the opening space.
    element.className = newList.substring(1);
  }

  /**
   * (Internal) Removes a class from an element.
   */

  function removeClass(element, name) {
    var oldList = classList(element),
        newList;

    if (!hasClass(element, name)) return;

    // Replace the class name.
    newList = oldList.replace(' ' + name + ' ', ' ');

    // Trim the opening and closing spaces.
    element.className = newList.substring(1, newList.length - 1);
  }

  /**
   * (Internal) Gets a space separated list of the class names on the element. 
   * The list is wrapped with a single space on each end to facilitate finding 
   * matches within the list.
   */

  function classList(element) {
    return (' ' + (element.className || '') + ' ').replace(/\s+/gi, ' ');
  }

  /**
   * (Internal) Removes an element from the DOM.
   */

  function removeElement(element) {
    element && element.parentNode && element.parentNode.removeChild(element);
  }

  return NProgress;
});
});

let progress;
/* -------------------------------------------- */
/* FUNCTIONS                                    */
/* -------------------------------------------- */
/**
 * Setup nprogress
 *
 * @export
 * @param {Store.IProgress} options
 */
function config({ options }) {
    progress = nprogress.configure(Object.assign(Object.assign({}, options), { template: '<div class="bar" role="bar"><div class="peg"></div></div>' }));
}

/**
 * store
 */
const store = new class Store {
    constructor() {
        /**
         * Cache
         */
        this.cache = new Map();
        /**
         * Snapshots
         */
        this.snapshots = new Map();
        /**
         * Configuration
         */
        this.config = {
            targets: ['body'],
            request: {
                timeout: 30000,
                poll: 250,
                async: true,
                dispatch: 'mousedown'
            },
            prefetch: {
                mouseover: {
                    enable: true,
                    threshold: 100,
                    proximity: 0
                },
                intersect: {
                    enable: true
                }
            },
            cache: {
                enable: true,
                limit: 25,
                save: false
            },
            progress: {
                enable: true,
                threshold: 850,
                style: {
                    render: true,
                    colour: '#111',
                    height: '2px'
                },
                options: {
                    minimum: 0.10,
                    easing: 'ease',
                    speed: 225,
                    trickle: true,
                    trickleSpeed: 225,
                    showSpinner: false
                }
            }
        };
        this.set = {
            /**
             * Sets a provided recrod to cache
             */
            cache: (key, value) => {
                this.cache.set(key, value);
                return value;
            },
            /**
             * Sets a provided record to snapshot
             */
            snapshots: (key, value) => {
                this.snapshots.set(key, value);
                return key;
            }
        };
        /**
          * Map Deletions
          */
        this.delete = {
            cache: (url) => this.cache.delete(url),
            snapshots: (id) => this.snapshots.delete(id)
        };
    }
    /**
     * Connects store and intialized the workable
     * state management model. Connect MUST be called
     * upon Pjax initialization. This function acts
     * as a class `constructor` establishing an instance.
     */
    connect(options = {}) {
        this.config = o(this.config, Object.assign(Object.assign({}, options), { request: Object.assign(Object.assign({}, options === null || options === void 0 ? void 0 : options.request), { dispatch: undefined }), cache: Object.assign(Object.assign({}, options === null || options === void 0 ? void 0 : options.cache), { save: undefined }) }));
        // Assert Progress
        if (this.config.progress.enable)
            config(this.config.progress);
    }
    /**
     * Indicates a new page visit or a return page visit. New visits
     * are defined by an event dispatched from a `href` link. Both a new
     * new page visit or subsequent visit will call this function.
     *
     * **Breakdown**
     *
     * Subsequent visits calling this function will have their per-page
     * specifics configs (generally those configs set with attributes)
     * reset and merged into its existing records (if it has any), otherwise
     * a new page instance will be generated including defult preset configs.
     */
    create(state, snapshot) {
        const page = Object.assign(Object.assign({ 
            // EDITABLE
            //
            history: true, snapshot: (state === null || state === void 0 ? void 0 : state.snapshot) || nanoid(16), position: (state === null || state === void 0 ? void 0 : state.position) || reset(), cache: this.config.cache.enable, progress: this.config.progress.threshold, threshold: this.config.prefetch.mouseover.threshold }, state), { 
            // READ ONLY
            //
            targets: this.config.targets });
        if (page.cache && dispatchEvent('pjax:cache', page, true)) {
            this.cache.set(page.url, page);
            this.snapshots.set(page.snapshot, snapshot);
        }
        // console.log(cache, snapshot)
        return page;
    }
    /**
     * Returns a snapshot matching provided ID
     */
    snapshot(id) {
        return this.snapshots.get(id);
    }
    /**
     * Removes cached records. Optionally pass in URL
     * to remove specific record.
     */
    clear(url) {
        if (typeof url === 'string') {
            this.snapshots.delete(this.cache.get(url).snapshot);
            this.cache.delete(url);
        }
        else {
            this.snapshots.clear();
            this.cache.clear();
        }
    }
    /**
    * Check if cache record exists with snapshot
    *
    * @param {string} url
    * @param {{snapshot?: boolean}} has
    */
    get(url) {
        var _a;
        const record = {
            page: this.cache.get(url)
        };
        record.snapshot = ((_a = record.page) === null || _a === void 0 ? void 0 : _a.snapshot)
            ? this.snapshots.get(record.page.snapshot)
            : undefined;
        return record;
    }
    /**
     * Check if cache record exists with snapshot
     */
    has(url, has) {
        var _a;
        return !(has === null || has === void 0 ? void 0 : has.snapshot) ? this.cache.has(url) : (this.cache.has(url) ||
            this.snapshots.has((_a = this.cache.get(url)) === null || _a === void 0 ? void 0 : _a.snapshot));
    }
    /**
    * Update current pushState History
    */
    history() {
        _history.replace(_history.location, Object.assign(Object.assign({}, _history.location.state), { position: position }));
        // @ts-ignore
        return _history.location.state.url;
    }
    /**
    * Updates page state, this function will run a merge
    * on the current page instance and re-assign the `pageState`
    * letting to updated config.
    *
    * If newState contains a different `ILocation.url` value from
    * that of the current page instance `url` then it will be updated
    * to match that of the `newState.url` value.
    *
    * The cache will e updated accordingly, so `this.page` will provide
    * access to the updated instance.
    *
    * @param {IPage} state
    * @returns {IPage}
    */
    update(state) {
        return this.cache
            .set(state.url, o(this.cache.get(state.url), state))
            .get(state.url);
    }
}();

var m,x=m||(m={});x.Pop="POP";x.Push="PUSH";x.Replace="REPLACE";function E(a){var b=a.pathname,g=a.search;a=a.hash;return (void 0===b?"/":b)+(void 0===g?"":g)+(void 0===a?"":a)}
function F(a){var b={};if(a){var g=a.indexOf("#");0<=g&&(b.hash=a.substr(g),a=a.substr(0,g));g=a.indexOf("?");0<=g&&(b.search=a.substr(g),a=a.substr(0,g));a&&(b.pathname=a);}return b}

const { origin, hostname } = window.location;
/**
 * Returns the next parsed url value.
 * Next URL is the new navigation URL key from
 * which a navigation will render. This is set
 * right before page replacements.
 *
 * **BEWARE**
 *
 * Use this with caution, this value will change only when
 * a new navigation has began. Otherwise it returns
 * the same value as `url`
 */
let next = E(window.location);
/**
 * Returns the last parsed url value.
 * Prev URL is the current URL. Calling this will
 * return the same value as it would `window.location.pathname`
 *
 * **BEWARE**
 *
 * Use this with caution, this value will change on new
 * navigations.
 *
 * @returns {string}
 */
let url = next;
/**
 * Returns the pathname cache key URL
 */
function key(link) {
    var _a;
    return link.charCodeAt(0) === 47 // 47 is unicode value for '/'
        ? link
        : ((_a = link.match(Pathname)) !== null && _a !== void 0 ? _a : [])[1] || '/';
}
/**
 * Parses link and returns an ILocation.
 * Accepts either a `href` target or `string`.
 * If no parameter value is passed, the
 * current location pathname (string) is used.
 */
function parse$1(link) {
    const location = F(link instanceof Element ? link.getAttribute('href') : link);
    return Object.assign({ lastpath: E(_history.location), search: '', origin,
        hostname }, location);
}
/**
 * Parses link and returns a location.
 *
 * **IMPORTANT**
 *
 * This function will modify the next url value
 */
function get$1(link, update) {
    const path = key(link instanceof Element ? link.getAttribute('href') : link);
    if (update) {
        url = E(_history.location);
        next = path;
    }
    return { url: path, location: parse$1(path) };
}

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

// so it doesn't throw if no window or matchMedia
var w = typeof window !== 'undefined' ? window : { screen: {}, navigator: {} };
var matchMedia = (w.matchMedia || (function () { return ({ matches: false }); })).bind(w);
var options = {
    get passive() {
        return (true);
    },
};
// have to set and remove a no-op listener instead of null
// (which was used previously), because Edge v15 throws an error
// when providing a null callback.
// https://github.com/rafgraph/detect-passive-events/pull/3
// eslint-disable-next-line @typescript-eslint/no-empty-function
var noop = function () { };
w.addEventListener && w.addEventListener('p', noop, options);
w.removeEventListener && w.removeEventListener('p', noop, false);
var supportsPointerEvents = 'PointerEvent' in w;
var onTouchStartInWindow = 'ontouchstart' in w;
var touchEventInWindow = 'TouchEvent' in w;
// onTouchStartInWindow is the old-old-legacy way to determine a touch device
// and many websites interpreted it to mean that the device is a touch only phone,
// so today browsers on a desktop/laptop computer with a touch screen (primary input mouse)
// have onTouchStartInWindow as false (to prevent from being confused with a
// touchOnly phone) even though they support the TouchEvents API, so need to check
// both onTouchStartInWindow and touchEventInWindow for TouchEvent support,
// however, some browsers (chromium) support the TouchEvents API even when running on
// a mouse only device (touchEventInWindow true, but onTouchStartInWindow false)
// so the touchEventInWindow check needs to include an coarse pointer media query
var supportsTouchEvents = onTouchStartInWindow ||
    (touchEventInWindow && matchMedia('(any-pointer: coarse)').matches);
(w.navigator.maxTouchPoints || 0) > 0 || supportsTouchEvents;
// userAgent is used as a backup to correct for known device/browser bugs
// and when the browser doesn't support interaction media queries (pointer and hover)
// see https://caniuse.com/css-media-interaction
var userAgent = w.navigator.userAgent || '';
// iPads now support a mouse that can hover, however the media query interaction
// feature results always say iPads only have a coarse pointer that can't hover
// even when a mouse is connected (anyFine and anyHover are always false),
// this unfortunately indicates a touch only device but iPads should
// be classified as a hybrid device, so determine if it is an iPad
// to indicate it should be treated as a hybrid device with anyHover true
var isIPad = matchMedia('(pointer: coarse)').matches &&
    // both iPad and iPhone can "request desktop site", which sets the userAgent to Macintosh
    // so need to check both userAgents to determine if it is an iOS device
    // and screen size to separate iPad from iPhone
    /iPad|Macintosh/.test(userAgent) &&
    Math.min(w.screen.width || 0, w.screen.height || 0) >= 768;
(matchMedia('(pointer: coarse)').matches ||
    // if the pointer is not coarse and not fine then the browser doesn't support
    // interaction media queries (see https://caniuse.com/css-media-interaction)
    // so if it has onTouchStartInWindow assume it has a coarse primary pointer
    (!matchMedia('(pointer: fine)').matches && onTouchStartInWindow)) &&
    // bug in firefox (as of v81) on hybrid windows devices where the interaction media queries
    // always indicate a touch only device (only has a coarse pointer that can't hover)
    // so assume that the primary pointer is not coarse for firefox windows
    !/Windows.*Firefox/.test(userAgent);
matchMedia('(any-pointer: fine)').matches ||
    matchMedia('(any-hover: hover)').matches ||
    // iPads might have an input device that can hover, so assume it has anyHover
    isIPad ||
    // if no onTouchStartInWindow then the browser is indicating that it is not a touch only device
    // see above note for supportsTouchEvents
    !onTouchStartInWindow;

/**
 * Array Chunk function
 */
function chunk(size = 2) {
    return (acc, value) => {
        const length = acc.length;
        return (!length || Object.is(acc[length - 1].length, size)
            ? acc.push([value])
            : acc[length - 1].push(value)) && acc;
    };
}
/**
 * Constructs a JSON object from HTML `data-pjax-*` attributes.
 * Attributes are passed in as array items
 *
 * @example
 *
 * // Attribute values are seperated by whitespace
 * // For example, a HTML attribute would look like:
 * <data-pjax-prop="string:foo number:200">
 *
 * // Attribute values are split into an Array
 * // The array is passed to this reducer function
 * ["string", "foo", "number", "200"]
 *
 * // This reducer function will return:
 * { string: 'foo', number: 200 }
 *
 */
function jsonattrs(accumulator, current, index, source) {
    const prop = (source.length - 1) >= index ? (index - 1) : index;
    return (index % 2 ? (Object.assign(Object.assign({}, accumulator), { [source[prop]]: isNumber.test(current)
            ? Number(current)
            : current })) : accumulator);
}
/**
 * Parses link `href` attributes and assigns them to
 * configuration options.
 */
function attrparse({ attributes }, state = {}) {
    return ([...attributes].reduce((config, { nodeName, nodeValue }) => {
        if (!Attr.test(nodeName))
            return config;
        const value = nodeValue.replace(/\s+/g, '');
        config[nodeName.slice(10)] = isArray.test(value) ? (value.match(ActionParams)) : isPenderValue.test(value) ? (value.match(ActionParams).reduce(chunk(2), [])) : isPosition.test(value) ? (value.match(inPosition).reduce(jsonattrs, {})) : isBoolean.test(value) ? (value === 'true') : isNumber.test(value) ? (Number(value)) : (value);
        return config;
    }, state));
}
/**
 * Locted the closest link when click bubbles.
 */
function getLink(target, selector) {
    if (target instanceof Element) {
        const element = target.closest(selector);
        if (element && element.tagName === 'A')
            return element;
    }
    return false;
}
/**
 * Returns the byte size of a string value
 */
function byteSize(string) {
    return new Blob([string]).size;
}
/**
 * Link is not cached and can be fetched
 */
function canFetch(target) {
    return !store.has(get$1(target).url, { snapshot: true });
}
/**
 * Returns a list of link elements to be prefetched. Filters out
 * any links which exist in cache to prevent extrenous transit.
 */
function getTargets(selector) {
    const targets = document.body.querySelectorAll(selector);
    return Array.from(targets).filter(canFetch);
}
/**
 * Each iterator helper function. Provides a util function
 * for loop iterations
 */
function forEach(fn, list) {
    if (arguments.length === 1)
        return (_list) => forEach(fn, _list);
    let i = 0;
    const len = list.length;
    while (i < len) {
        fn(list[i], i, list);
        i++;
    }
}

let ratelimit = 0;
let storage = 0;
let showprogress = false;
/**
 * XHR Requests
 */
const transit$1 = new Map();
/**
 * Async Timeout
 */
function asyncTimeout(callback, ms = 0) {
    return new Promise(resolve => setTimeout(() => {
        const fn = callback();
        resolve(fn);
    }, ms));
}
/**
 * Executes on request end. Removes the XHR recrod and update
 * the response DOMString cache size record.
 */
function HttpRequestEnd(url, DOMString) {
    transit$1.delete(url);
    storage = storage + byteSize(DOMString);
}
/**
 * Fetch XHR Request wrapper function
 */
function HttpRequest(url) {
    const xhr = new XMLHttpRequest();
    return new Promise((resolve, reject) => {
        // OPEN
        //
        xhr.open('GET', url, store.config.request.async);
        // HEADERS
        //
        xhr.setRequestHeader('X-Pjax', 'true');
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        // EVENTS
        //
        xhr.onloadstart = e => transit$1.set(url, xhr);
        xhr.onload = e => xhr.status === 200 ? resolve(xhr.responseText) : null;
        xhr.onloadend = e => HttpRequestEnd(url, xhr.responseText);
        xhr.onerror = reject;
        xhr.timeout = store.config.request.timeout;
        xhr.responseType = 'text';
        // SEND
        //
        xhr.send(null);
    });
}
/**
 * Cancels the request in transit
 */
function cancel(url) {
    if (transit$1.has(url)) {
        transit$1.get(url).abort();
        transit$1.delete(url);
        console.warn(`Pjax: XHR Request was cancelled for url: ${url}`);
    }
}
/**
 * Prevents repeated requests from being executed.
 * When prefetching, if a request is in transit and a click
 * event dispatched this will prevent multiple requests and
 * instead wait for initial fetch to complete.
 *
 * Number of recursive runs to make, set this to 85 to disable,
 * else just leave it to execute as is.
 *
 * Returns `true` if request resolved in `850ms` else `false`
 */
function inFlight(url) {
    return __awaiter(this, void 0, void 0, function* () {
        if (transit$1.has(url) && ratelimit <= store.config.request.timeout) {
            if (!showprogress && Object.is((ratelimit * 10), store.config.progress.threshold)) {
                progress.start();
                showprogress = true;
            }
            return asyncTimeout(() => {
                ratelimit++;
                return inFlight(url);
            }, 1);
        }
        ratelimit = 0;
        showprogress = false;
        return !transit$1.has(url);
    });
}
/**
 * Fetches documents and guards from duplicated requests
 * from being dispatched if an indentical fetch is in flight.
 * Requests will always save responses and snapshots.
 */
function get(state) {
    return __awaiter(this, void 0, void 0, function* () {
        if (transit$1.has(state.url)) {
            console.warn(`Pjax: XHR Request is already in transit for: ${state.url}`);
            return false;
        }
        if (!dispatchEvent('pjax:request', { state }, true)) {
            console.warn(`Pjax: Request cancelled via dispatched event for: ${state.url}`);
            return false;
        }
        try {
            const response = yield HttpRequest(state.url);
            if (typeof response === 'string')
                return store.create(state, response);
            console.warn(`Pjax: Failed to retrive response at: ${state.url}`);
        }
        catch (error) {
            transit$1.delete(state.url);
            console.error(error);
        }
        return false;
    });
}

var loadjs_umd = createCommonjsModule(function (module, exports) {
(function(root, factory) {
  {
    module.exports = factory();
  }
}(commonjsGlobal, function() {
/**
 * Global dependencies.
 * @global {Object} document - DOM
 */

var devnull = function() {},
    bundleIdCache = {},
    bundleResultCache = {},
    bundleCallbackQueue = {};


/**
 * Subscribe to bundle load event.
 * @param {string[]} bundleIds - Bundle ids
 * @param {Function} callbackFn - The callback function
 */
function subscribe(bundleIds, callbackFn) {
  // listify
  bundleIds = bundleIds.push ? bundleIds : [bundleIds];

  var depsNotFound = [],
      i = bundleIds.length,
      numWaiting = i,
      fn,
      bundleId,
      r,
      q;

  // define callback function
  fn = function (bundleId, pathsNotFound) {
    if (pathsNotFound.length) depsNotFound.push(bundleId);

    numWaiting--;
    if (!numWaiting) callbackFn(depsNotFound);
  };

  // register callback
  while (i--) {
    bundleId = bundleIds[i];

    // execute callback if in result cache
    r = bundleResultCache[bundleId];
    if (r) {
      fn(bundleId, r);
      continue;
    }

    // add to callback queue
    q = bundleCallbackQueue[bundleId] = bundleCallbackQueue[bundleId] || [];
    q.push(fn);
  }
}


/**
 * Publish bundle load event.
 * @param {string} bundleId - Bundle id
 * @param {string[]} pathsNotFound - List of files not found
 */
function publish(bundleId, pathsNotFound) {
  // exit if id isn't defined
  if (!bundleId) return;

  var q = bundleCallbackQueue[bundleId];

  // cache result
  bundleResultCache[bundleId] = pathsNotFound;

  // exit if queue is empty
  if (!q) return;

  // empty callback queue
  while (q.length) {
    q[0](bundleId, pathsNotFound);
    q.splice(0, 1);
  }
}


/**
 * Execute callbacks.
 * @param {Object or Function} args - The callback args
 * @param {string[]} depsNotFound - List of dependencies not found
 */
function executeCallbacks(args, depsNotFound) {
  // accept function as argument
  if (args.call) args = {success: args};

  // success and error callbacks
  if (depsNotFound.length) (args.error || devnull)(depsNotFound);
  else (args.success || devnull)(args);
}


/**
 * Load individual file.
 * @param {string} path - The file path
 * @param {Function} callbackFn - The callback function
 */
function loadFile(path, callbackFn, args, numTries) {
  var doc = document,
      async = args.async,
      maxTries = (args.numRetries || 0) + 1,
      beforeCallbackFn = args.before || devnull,
      pathname = path.replace(/[\?|#].*$/, ''),
      pathStripped = path.replace(/^(css|img)!/, ''),
      isLegacyIECss,
      e;

  numTries = numTries || 0;

  if (/(^css!|\.css$)/.test(pathname)) {
    // css
    e = doc.createElement('link');
    e.rel = 'stylesheet';
    e.href = pathStripped;

    // tag IE9+
    isLegacyIECss = 'hideFocus' in e;

    // use preload in IE Edge (to detect load errors)
    if (isLegacyIECss && e.relList) {
      isLegacyIECss = 0;
      e.rel = 'preload';
      e.as = 'style';
    }
  } else if (/(^img!|\.(png|gif|jpg|svg|webp)$)/.test(pathname)) {
    // image
    e = doc.createElement('img');
    e.src = pathStripped;    
  } else {
    // javascript
    e = doc.createElement('script');
    e.src = path;
    e.async = async === undefined ? true : async;
  }

  e.onload = e.onerror = e.onbeforeload = function (ev) {
    var result = ev.type[0];

    // treat empty stylesheets as failures to get around lack of onerror
    // support in IE9-11
    if (isLegacyIECss) {
      try {
        if (!e.sheet.cssText.length) result = 'e';
      } catch (x) {
        // sheets objects created from load errors don't allow access to
        // `cssText` (unless error is Code:18 SecurityError)
        if (x.code != 18) result = 'e';
      }
    }

    // handle retries in case of load failure
    if (result == 'e') {
      // increment counter
      numTries += 1;

      // exit function and try again
      if (numTries < maxTries) {
        return loadFile(path, callbackFn, args, numTries);
      }
    } else if (e.rel == 'preload' && e.as == 'style') {
      // activate preloaded stylesheets
      return e.rel = 'stylesheet'; // jshint ignore:line
    }
    
    // execute callback
    callbackFn(path, result, ev.defaultPrevented);
  };

  // add to document (unless callback returns `false`)
  if (beforeCallbackFn(path, e) !== false) doc.head.appendChild(e);
}


/**
 * Load multiple files.
 * @param {string[]} paths - The file paths
 * @param {Function} callbackFn - The callback function
 */
function loadFiles(paths, callbackFn, args) {
  // listify paths
  paths = paths.push ? paths : [paths];

  var numWaiting = paths.length,
      x = numWaiting,
      pathsNotFound = [],
      fn,
      i;

  // define callback function
  fn = function(path, result, defaultPrevented) {
    // handle error
    if (result == 'e') pathsNotFound.push(path);

    // handle beforeload event. If defaultPrevented then that means the load
    // will be blocked (ex. Ghostery/ABP on Safari)
    if (result == 'b') {
      if (defaultPrevented) pathsNotFound.push(path);
      else return;
    }

    numWaiting--;
    if (!numWaiting) callbackFn(pathsNotFound);
  };

  // load scripts
  for (i=0; i < x; i++) loadFile(paths[i], fn, args);
}


/**
 * Initiate script load and register bundle.
 * @param {(string|string[])} paths - The file paths
 * @param {(string|Function|Object)} [arg1] - The (1) bundleId or (2) success
 *   callback or (3) object literal with success/error arguments, numRetries,
 *   etc.
 * @param {(Function|Object)} [arg2] - The (1) success callback or (2) object
 *   literal with success/error arguments, numRetries, etc.
 */
function loadjs(paths, arg1, arg2) {
  var bundleId,
      args;

  // bundleId (if string)
  if (arg1 && arg1.trim) bundleId = arg1;

  // args (default is {})
  args = (bundleId ? arg2 : arg1) || {};

  // throw error if bundle is already defined
  if (bundleId) {
    if (bundleId in bundleIdCache) {
      throw "LoadJS";
    } else {
      bundleIdCache[bundleId] = true;
    }
  }

  function loadFn(resolve, reject) {
    loadFiles(paths, function (pathsNotFound) {
      // execute callbacks
      executeCallbacks(args, pathsNotFound);
      
      // resolve Promise
      if (resolve) {
        executeCallbacks({success: resolve, error: reject}, pathsNotFound);
      }

      // publish bundle load event
      publish(bundleId, pathsNotFound);
    }, args);
  }
  
  if (args.returnPromise) return new Promise(loadFn);
  else loadFn();
}


/**
 * Execute callbacks when dependencies have been satisfied.
 * @param {(string|string[])} deps - List of bundle ids
 * @param {Object} args - success/error arguments
 */
loadjs.ready = function ready(deps, args) {
  // subscribe to bundle load event
  subscribe(deps, function (depsNotFound) {
    // execute callbacks
    executeCallbacks(args, depsNotFound);
  });

  return loadjs;
};


/**
 * Manually satisfy bundle dependencies.
 * @param {string} bundleId - The bundle id
 */
loadjs.done = function done(bundleId) {
  publish(bundleId, []);
};


/**
 * Reset loadjs dependencies statuses
 */
loadjs.reset = function reset() {
  bundleIdCache = {};
  bundleResultCache = {};
  bundleCallbackQueue = {};
};


/**
 * Determine if bundle has already been defined
 * @param String} bundleId - The bundle id
 */
loadjs.isDefined = function isDefined(bundleId) {
  return bundleId in bundleIdCache;
};


// export
return loadjs;

}));
});

let connected$4 = false;
const transit = new Map();
/**
 * Cleanup throttlers
 */
function cleanup(url) {
    clearTimeout(transit.get(url));
    return transit.delete(url);
}
/**
 * Cancels prefetch, if mouse leaves target before threshold
 * concludes. This prevents fetches being made for hovers that
 * do not exceeds threshold.
 */
function onMouseleave(event) {
    const target = getLink(event.target, "a[data-pjax-prefetch=\"hover\"]" /* LinkPrefetchHover */);
    if (target) {
        cleanup(get$1(target).url);
        handleLeave(target);
    }
}
/**
 * Fetch Throttle
 */
function throttle(url, fn, delay) {
    if (!store.has(url) && !transit.has(url)) {
        const timeout = setTimeout(fn, delay);
        transit.set(url, timeout);
    }
}
/**
 * Fetch document and add the response to session cache.
 * Lifecycle event `pjax:cache` will fire upon completion.
 */
function prefetch(state) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!(yield get(state))) {
            console.warn(`Pjax: Prefetch will retry on next mouseover for: ${state.url}`);
        }
        return cleanup(state.url);
    });
}
/**
 * Attempts to visit location, Handles bubbled mousovers and
 * Dispatches to the fetcher. Once item is cached, the mouseover
 * event is removed.
 *
 * @param {MouseEvent} event
 */
function onMouseover(event) {
    const target = getLink(event.target, "a[data-pjax-prefetch=\"hover\"]" /* LinkPrefetchHover */);
    if (!target)
        return undefined;
    const { url, location } = get$1(target);
    if (!dispatchEvent('pjax:prefetch', { target, url, location }, true)) {
        return disconnect$1(target);
    }
    if (store.has(url, { snapshot: true }))
        return disconnect$1(target);
    handleLeave(target);
    const state = attrparse(target, { url, location, position: y0x0() });
    throttle(url, () => __awaiter(this, void 0, void 0, function* () {
        if ((yield prefetch(state)))
            handleLeave(target);
    }), (state === null || state === void 0 ? void 0 : state.threshold) || store.config.prefetch.mouseover.threshold);
}
/**
 * Attach mouseover events to all defined element targets
 */
function handleHover(target, index, items) {
    // if (target instanceof Element) proximity(target, index)
    if (supportsPointerEvents) {
        target.addEventListener('pointerover', onMouseover, false);
    }
    else {
        target.addEventListener('mouseover', onMouseover, false);
    }
}
/**
 * Cancels prefetch, if mouse leaves target before threshold
 * concludes. This prevents fetches being made for hovers that
 * do not exceeds threshold.
 */
function handleLeave(target) {
    if (supportsPointerEvents) {
        target.removeEventListener('pointerout', onMouseleave, false);
    }
    else {
        target.removeEventListener('mouseleave', onMouseleave, false);
    }
}
/**
 * Adds and/or Removes click events.
 */
function disconnect$1(target) {
    if (supportsPointerEvents) {
        target.removeEventListener('pointerover', onMouseleave, false);
        target.removeEventListener('pointerout', onMouseleave, false);
    }
    else {
        target.removeEventListener('mouseleave', onMouseleave, false);
        target.removeEventListener('mouseover', onMouseover, false);
    }
}
/**
 * Starts mouseovers, will attach mouseover events
 * to all elements which contain a `data-pjax-prefetch="hover"`
 * data attribute
 */
function start$3() {
    if (!connected$4) {
        forEach(handleHover)(getTargets("a[data-pjax-prefetch=\"hover\"]" /* LinkPrefetchHover */));
        connected$4 = true;
    }
}
/**
 * Stops mouseovers, will remove all mouseover and mouseout
 * events on elements which contains a `data-pjax-prefetch="hover"`
 * unless target href already exists in cache.
 */
function stop$3() {
    if (connected$4) {
        transit.clear();
        forEach(disconnect$1)(getTargets("a[data-pjax-prefetch=\"hover\"]" /* LinkPrefetchHover */));
        connected$4 = false;
    }
}

/**
 * @type IntersectionObserver
 */
let entries;
let connected$3 = false;
/**
 * Intersection callback when entries are in viewport.
 */
function onIntersect(entry) {
    return __awaiter(this, void 0, void 0, function* () {
        if (entry.isIntersecting) {
            const state = attrparse(entry.target, get$1(entry.target));
            const response = yield get(state);
            if (response) {
                entries.unobserve(entry.target);
            }
            else {
                console.warn(`Pjax: Prefetch will retry at next intersect for: ${state.url}`);
                entries.observe(entry.target);
            }
        }
    });
}
/**
 * Starts prefetch, will initialize `IntersectionObserver` and
 * add event listeners and other logics.
 */
function start$2() {
    if (!connected$3) {
        entries = new IntersectionObserver(forEach(onIntersect));
        forEach(target => entries.observe(target))(getTargets("a[data-pjax-prefetch=\"intersect\"]" /* LinkPrefetchIntersect */));
        connected$3 = true;
    }
}
/**
 * Stops prefetch, will disconnect `IntersectionObserver` and
 * remove any event listeners or transits.
 */
function stop$2() {
    if (connected$3) {
        entries.disconnect();
        connected$3 = false;
    }
}

const DOMParse = new DOMParser();
/**
 * Tracked Elements
 */
const tracked = new Set();
/**
 * DOM Scripts elements, eg: `<script>` - We will parse
 * all load all scripts for each navigation. We lean on
 * the powerful little module known as `loadjs` for script
 * execution and tracking
 */
function DOMScripts({ src, id = src }) {
    if (!loadjs_umd.isDefined(id)) {
        loadjs_umd(src, id, {
            before: (_, script) => script.setAttribute('data-pjax-eval', 'false'),
            success: () => dispatchEvent('pjax:script', { id }),
            error: (path) => console.error(`Pjax: Failed to load script ${path} `),
            numRetries: 1
        });
    }
}
/**
 * DOM Head Nodes
 */
function DOMHeadNodes(nodes, _a) {
    var children = __rest(_a, []);
    forEach(DOMNode => {
        if (DOMNode.tagName === 'TITLE')
            return null;
        if (DOMNode.getAttribute('data-pjax-eval') !== 'false') {
            const index = nodes.indexOf(DOMNode.outerHTML);
            index === -1 ? DOMNode.parentNode.removeChild(DOMNode) : nodes.splice(index, 1);
        }
    })(children);
    return nodes.join('');
}
/**
 * DOM Head
 */
function DOMHead({ children }) {
    const targetNodes = Array.from(children).reduce((arr, node) => {
        if (node.tagName === 'SCRIPT' && node.hasAttribute('src')) {
            if (node.getAttribute('data-pjax-eval') !== 'false') {
                if (node instanceof HTMLScriptElement) {
                    DOMScripts(node);
                    node.parentNode.removeChild(node);
                }
            }
        }
        return node.tagName !== 'TITLE' && node.tagName !== 'SCRIPT'
            ? [...arr, node.outerHTML]
            : arr;
    }, []);
    const fragment = document.createElement('div');
    fragment.innerHTML = DOMHeadNodes(targetNodes, document.head);
    // console.log(fragment.children);
    forEach(DOMNode => {
        if (!DOMNode.hasAttribute('data-pjax-eval'))
            document.head.appendChild(DOMNode);
    })(Array.from(fragment.children));
}
/**
 * Append Tracked Node
 */
function appendTrackedNode(node) {
    // tracked element must contain id
    if (!node.hasAttribute('id'))
        return;
    if (!tracked.has(node.id)) {
        document.body.appendChild(node);
        tracked.add(node.id);
    }
}
/**
 * Apply actions to the documents target fragments
 * with the request response.
 */
function replaceTarget(target, state) {
    return DOM => {
        if (dispatchEvent('pjax:render', { target }, true)) {
            DOM.innerHTML = target.innerHTML;
            if ((state === null || state === void 0 ? void 0 : state.append) || (state === null || state === void 0 ? void 0 : state.prepend)) {
                const fragment = document.createElement('div');
                forEach(node => fragment.appendChild(node))([...target.childNodes]);
                state.append
                    ? DOM.appendChild(fragment)
                    : DOM.insertBefore(fragment, DOM.firstChild);
            }
        }
    };
}
/**
 * Parse HTML document string from request response
 * using `parser()` method. Cached pages will pass
 * the saved response here.
 */
function parse(HTMLString) {
    return DOMParse.parseFromString(HTMLString, 'text/html');
}
/**
 * Captures current document element and sets a
 * record to snapshot state
 */
function capture({ url, snapshot }) {
    return __awaiter(this, void 0, void 0, function* () {
        if (store.has(url, { snapshot: true })) {
            const target = parse(store.snapshot(snapshot));
            target.body.innerHTML = document.body.innerHTML;
            store.set.snapshots(snapshot, target.documentElement.outerHTML);
        }
    });
}
/**
 * Observe Head Element
 */
// const observer = new MutationObserver(observeHead)
/**
   * Observe Head Element
   */
// observer.observe(document.head, { attributes: true, childList: true, subtree: true })
/**
 * Update the DOM and execute page adjustments
 * to new navigation point
 */
function update(state, popstate) {
    // console.log(state)
    // window.performance.mark('render')
    // console.log(window.performance.measure('time', 'start'))
    if (store.config.prefetch.mouseover.enable)
        stop$3();
    if (store.config.prefetch.intersect.enable)
        stop$2();
    // observer.disconnect()
    const target = parse(store.snapshot(state.snapshot));
    state.title = document.title = (target === null || target === void 0 ? void 0 : target.title) || '';
    if (!popstate && state.history) {
        if (state.url === state.location.lastpath) {
            _history.replace(state.location, state);
        }
        else {
            _history.push(state.location, state);
        }
    }
    if (target === null || target === void 0 ? void 0 : target.head)
        DOMHead(target.head);
    // Later, you can stop observing
    let fallback = 1;
    forEach(element => {
        const node = target.body.querySelector(element);
        node
            ? forEach(replaceTarget(node, state))(document.body.querySelectorAll(element))
            : fallback++;
    }, (state === null || state === void 0 ? void 0 : state.replace) ? [...state.targets, ...state.replace] : state.targets);
    if (Object.is(fallback, state.targets.length)) {
        replaceTarget(target.body, state)(document.body);
    }
    // APPEND TRACKED NODES
    target.body.querySelectorAll('[data-pjax-track]').forEach(appendTrackedNode);
    window.scrollTo(state.position.x, state.position.y);
    progress.done();
    if (store.config.prefetch.mouseover.enable)
        start$3();
    if (store.config.prefetch.intersect.enable)
        start$2();
    dispatchEvent('pjax:load', state);
    // console.log(window.performance.measure('Render Time', 'render'))
    // console.log(window.performance.measure('Total', 'started'))
}

let connected$2 = false;
let unlisten = null;
let inTransit;
/**
 * Popstate Navigation
 */
function popstate(url, state) {
    return __awaiter(this, void 0, void 0, function* () {
        if (url !== inTransit)
            cancel(inTransit);
        if (store.has(url, { snapshot: true })) {
            return update(store.get(url).page, true);
        }
        inTransit = url;
        const page = yield get(state);
        return page
            ? update(page, true)
            : location.assign(url);
    });
}
/**
 * Event History dispatch controller, handles popstate,
 * push and replace events via third party module
 */
function listener({ action, location }) {
    if (action === 'POP') {
        return popstate(E(location), location.state);
    }
}
/**
 * Attached `history` event listener.
 */
function start$1() {
    if (!connected$2) {
        unlisten = _history.listen(listener);
        connected$2 = false;
    }
}
/**
 * Removed `history` event listener.
 */
function stop$1() {
    if (!connected$2) {
        unlisten();
        connected$2 = true;
    }
}
/**
 * Execute a history state replacement for the current
 * page location. It's intended use is to update the
 * current scroll position and any other values stored
 * in history state.
 *
 */
function updateState() {
    _history.replace(_history.location, Object.assign(Object.assign({}, _history.location.state), { position }));
    return _history.location.state;
}

/**
 * Handles a clicked link, prevents special click types.
 */
function linkEvent(event) {
    // @ts-ignore
    return !((event.target && event.target.isContentEditable) ||
        event.defaultPrevented ||
        event.which > 1 ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey);
}
/**
 * Triggers click events
 *
 * @param {Element} target
 * @returns {(state: clickState) => (event: MouseEvent) => void}
 */
function handleClick(target) {
    return (state) => function click(event) {
        event.preventDefault();
        target.removeEventListener('click', click, false);
        capture(updateState()); // PRESERVE CURRENT PAGE
        return typeof state === 'object'
            ? update(state)
            : typeof state === 'string'
                ? navigate(state)
                : location.assign(url);
    };
}
/**
 * Triggers a page fetch
 *
 * @param {MouseEvent} event
 * @returns {void}
 */
function handleTrigger(event) {
    if (!linkEvent(event))
        return undefined;
    const target = getLink(event.target, "a:not([data-pjax-disable]):not([href^=\"#\"])" /* Link */);
    if (!target)
        return undefined;
    if (!dispatchEvent('pjax:trigger', { target }, true))
        return undefined;
    const { url, location } = get$1(target, true);
    const click = handleClick(target);
    if (transit$1.has(url)) {
        target.addEventListener('click', click(url), false);
    }
    else {
        const state = attrparse(target, { url, location, position: y0x0() });
        if (store.has(url, { snapshot: true })) {
            target.addEventListener('click', click(store.update(state)), false);
        }
        else {
            get(state); // TRIGGERS FETCH
            target.addEventListener('click', click(url), false);
        }
    }
}
let connected$1 = false;
/**
 * Executes a pjax navigation.
 */
function navigate(url, state = false) {
    return __awaiter(this, void 0, void 0, function* () {
        if (state) {
            if (typeof state.cache === 'string') {
                state.cache === 'clear'
                    ? store.clear()
                    : store.clear(url);
            }
            const page = yield get(state);
            if (page)
                return update(page);
        }
        else {
            if ((yield inFlight(url))) {
                return update(store.get(url).page);
            }
            else {
                cancel(url);
            }
        }
        return location.assign(url);
    });
}
/**
 * Attached `click` event listener.
 *
 * @returns {void}
 */
function start() {
    if (!connected$1) {
        if (supportsPointerEvents) {
            addEventListener('pointerdown', handleTrigger, false);
        }
        else {
            addEventListener('mousedown', handleTrigger, false);
            addEventListener('touchstart', handleTrigger, false);
        }
        connected$1 = true;
    }
}
/**
 * Removed `click` event listener.
 */
function stop() {
    if (connected$1) {
        if (supportsPointerEvents) {
            removeEventListener('pointerdown', handleTrigger, false);
        }
        else {
            removeEventListener('mousedown', handleTrigger, false);
            removeEventListener('touchstart', handleTrigger, false);
        }
        connected$1 = false;
    }
}

let connected = false;
/**
 * Sets initial page state executing on intial load.
 * Caches page so a return navigation does not perform
 * an extrenous request.
 */
function onload() {
    const page = store.create({
        url,
        location: parse$1(url),
        position: position
    }, document.documentElement.outerHTML);
    _history.replace(window.location, page);
    removeEventListener('load', onload);
}
/**
 * Initialize
 */
function initialize() {
    if (!connected) {
        start$1();
        start();
        start$4();
        start$3();
        start$2();
        addEventListener('load', onload);
        connected = true;
        console.info('Pjax: Connection Established ⚡');
    }
}
/**
 * Destory Pjax instances
 */
function destroy() {
    if (connected) {
        stop$1();
        stop();
        stop$4();
        stop$3();
        stop$2();
        store.clear();
        connected = false;
        console.warn('Pjax: Instance has been disconnected! 😔');
    }
    else {
        console.warn('Pjax: No connection made, disconnection is void 🙃');
    }
}

/**
 * Supported
 */
const supported = !!(window.history.pushState &&
    window.requestAnimationFrame &&
    window.addEventListener &&
    window.DOMParser);
/**
 * Connect Pjax
 */
const connect = (options) => {
    store.connect(options);
    if (supported) {
        if (Protocol.test(window.location.protocol)) {
            addEventListener('DOMContentLoaded', initialize);
        }
        else {
            console.error('Invalid protocol, pjax expects https or http protocol');
        }
    }
    else {
        console.error('Pjax is not supported by this browser');
    }
};
/**
 * Reload
 *
 * Reloads the current page
 */
const reload = () => { };
/**
 * UUID Generator
 */
const uuid = (size = 12) => nanoid(size);
/**
 * Flush Cache
 */
const clear = (url) => store.clear(url);
/**
 * Visit
 */
const visit = (link, state = {}) => {
    const { url, location } = get$1(link, true);
    return navigate(url, Object.assign(Object.assign({}, state), { url, location }));
};
/**
 * Disconnect
 */
const disconnect = () => destroy();

export { clear, connect, disconnect, reload, supported, uuid, visit };
