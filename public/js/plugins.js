/**
 * SmoothScroll
 * This helper script created by DWUser.com.  Copyright 2013 DWUser.com.
 * Dual-licensed under the GPL and MIT licenses.
 * All individual scripts remain property of their copyrighters.
 * Date: 10-Sep-2013
 * Version: 1.0.1
 */
if (!window['jQuery']) alert('The jQuery library must be included before the smoothscroll.js file.  The plugin will not work propery.');

/**
 * jQuery.ScrollTo - Easy element scrolling using jQuery.
 * Copyright (c) 2007-2013 Ariel Flesler - aflesler(at)gmail(dot)com | http://flesler.blogspot.com
 * Dual licensed under MIT and GPL.
 * @author Ariel Flesler
 * @version 1.4.3.1
 */
(function ($) {
  var h = ($.scrollTo = function (a, b, c) {
    $(window).scrollTo(a, b, c);
  });
  h.defaults = { axis: 'xy', duration: parseFloat($.fn.jquery) >= 1.3 ? 0 : 1, limit: true };
  h.window = function (a) {
    return $(window)._scrollable();
  };
  $.fn._scrollable = function () {
    return this.map(function () {
      var a = this,
        isWin = !a.nodeName || $.inArray(a.nodeName.toLowerCase(), ['iframe', '#document', 'html', 'body']) != -1;
      if (!isWin) return a;
      var b = (a.contentWindow || a).document || a.ownerDocument || a;
      return /webkit/i.test(navigator.userAgent) || b.compatMode == 'BackCompat' ? b.body : b.documentElement;
    });
  };
  $.fn.scrollTo = function (e, f, g) {
    if (typeof f == 'object') {
      g = f;
      f = 0;
    }
    if (typeof g == 'function') g = { onAfter: g };
    if (e == 'max') e = 9e9;
    g = $.extend({}, h.defaults, g);
    f = f || g.duration;
    g.queue = g.queue && g.axis.length > 1;
    if (g.queue) f /= 2;
    g.offset = both(g.offset);
    g.over = both(g.over);
    return this._scrollable()
      .each(function () {
        if (e == null) return;
        var d = this,
          $elem = $(d),
          targ = e,
          toff,
          attr = {},
          win = $elem.is('html,body');
        switch (typeof targ) {
          case 'number':
          case 'string':
            if (/^([+-]=)?\d+(\.\d+)?(px|%)?$/.test(targ)) {
              targ = both(targ);
              break;
            }
            targ = $(targ, this);
            if (!targ.length) return;
          case 'object':
            if (targ.is || targ.style) toff = (targ = $(targ)).offset();
        }
        $.each(g.axis.split(''), function (i, a) {
          var b = a == 'x' ? 'Left' : 'Top',
            pos = b.toLowerCase(),
            key = 'scroll' + b,
            old = d[key],
            max = h.max(d, a);
          if (toff) {
            attr[key] = toff[pos] + (win ? 0 : old - $elem.offset()[pos]);
            if (g.margin) {
              attr[key] -= parseInt(targ.css('margin' + b)) || 0;
              attr[key] -= parseInt(targ.css('border' + b + 'Width')) || 0;
            }
            attr[key] += g.offset[pos] || 0;
            if (g.over[pos]) attr[key] += targ[a == 'x' ? 'width' : 'height']() * g.over[pos];
          } else {
            var c = targ[pos];
            attr[key] = c.slice && c.slice(-1) == '%' ? (parseFloat(c) / 100) * max : c;
          }
          if (g.limit && /^\d+$/.test(attr[key])) attr[key] = attr[key] <= 0 ? 0 : Math.min(attr[key], max);
          if (!i && g.queue) {
            if (old != attr[key]) animate(g.onAfterFirst);
            delete attr[key];
          }
        });
        animate(g.onAfter);
        function animate(a) {
          $elem.animate(
            attr,
            f,
            g.easing,
            a &&
              function () {
                a.call(this, e, g);
              }
          );
        }
      })
      .end();
  };
  h.max = function (a, b) {
    var c = b == 'x' ? 'Width' : 'Height',
      scroll = 'scroll' + c;
    if (!$(a).is('html,body')) return a[scroll] - $(a)[c.toLowerCase()]();
    var d = 'client' + c,
      html = a.ownerDocument.documentElement,
      body = a.ownerDocument.body;
    return Math.max(html[scroll], body[scroll]) - Math.min(html[d], body[d]);
  };
  function both(a) {
    return typeof a == 'object' ? a : { top: a, left: a };
  }
})(jQuery);

/**
 * jQuery.LocalScroll
 * Copyright (c) 2007-2010 Ariel Flesler - aflesler(at)gmail(dot)com | http://flesler.blogspot.com
 * Dual licensed under MIT and GPL.
 * Date: 05/31/2010
 * @author Ariel Flesler
 * @version 1.2.8b
 **/
(function (b) {
  function g(a, e, d) {
    var h = e.hash.slice(1),
      f = document.getElementById(h) || document.getElementsByName(h)[0];
    if (f) {
      a && a.preventDefault();
      var c = b(d.target);
      if (!((d.lock && c.is(':animated')) || (d.onBefore && !1 === d.onBefore(a, f, c)))) {
        d.stop && c._scrollable().stop(!0);
        if (d.hash) {
          var a = f.id == h ? 'id' : 'name',
            g = b('<a> </a>')
              .attr(a, h)
              .css({ position: 'absolute', top: b(window).scrollTop(), left: b(window).scrollLeft() });
          f[a] = '';
          b('body').prepend(g);
          location = e.hash;
          g.remove();
          f[a] = h;
        }
        c.scrollTo(f, d).trigger('notify.serialScroll', [f]);
      }
    }
  }
  var i = location.href.replace(/#.*/, ''),
    c = (b.localScroll = function (a) {
      b('body').localScroll(a);
    });
  c.defaults = { duration: 1e3, axis: 'y', event: 'click', stop: !0, target: window, reset: !0 };
  c.hash = function (a) {
    if (location.hash) {
      a = b.extend({}, c.defaults, a);
      a.hash = !1;
      if (a.reset) {
        var e = a.duration;
        delete a.duration;
        b(a.target).scrollTo(0, a);
        a.duration = e;
      }
      g(0, location, a);
    }
  };
  b.fn.localScroll = function (a) {
    function e() {
      return !!this.href && !!this.hash && this.href.replace(this.hash, '') == i && (!a.filter || b(this).is(a.filter));
    }
    a = b.extend({}, c.defaults, a);
    return a.lazy
      ? this.bind(a.event, function (d) {
          var c = b([d.target, d.target.parentNode]).filter(e)[0];
          c && g(d, c, a);
        })
      : this.find('a,area')
          .filter(e)
          .bind(a.event, function (b) {
            g(b, this, a);
          })
          .end()
          .end();
  };
})(jQuery);

// Initialize all .smoothScroll links
jQuery(function ($) {
  $.localScroll({
    filter: '.smoothScroll',
    offset: -40,
  });
});

/*
 * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
 *
 * Uses the built in easing capabilities added In jQuery 1.1
 * to offer multiple easing options
 *
 * TERMS OF USE - jQuery Easing
 *
 * Open source under the BSD License.
 *
 * Copyright © 2008 George McGinley Smith
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice, this list of
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list
 * of conditions and the following disclaimer in the documentation and/or other materials
 * provided with the distribution.
 *
 * Neither the name of the author nor the names of contributors may be used to endorse
 * or promote products derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
 * OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 */

// t: current time, b: begInnIng value, c: change In value, d: duration
jQuery.easing['jswing'] = jQuery.easing['swing'];

jQuery.extend(jQuery.easing, {
  def: 'easeOutQuad',
  swing: function (x, t, b, c, d) {
    //alert(jQuery.easing.default);
    return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
  },
  easeInQuad: function (x, t, b, c, d) {
    return c * (t /= d) * t + b;
  },
  easeOutQuad: function (x, t, b, c, d) {
    return -c * (t /= d) * (t - 2) + b;
  },
  easeInOutQuad: function (x, t, b, c, d) {
    if ((t /= d / 2) < 1) return (c / 2) * t * t + b;
    return (-c / 2) * (--t * (t - 2) - 1) + b;
  },
  easeInCubic: function (x, t, b, c, d) {
    return c * (t /= d) * t * t + b;
  },
  easeOutCubic: function (x, t, b, c, d) {
    return c * ((t = t / d - 1) * t * t + 1) + b;
  },
  easeInOutCubic: function (x, t, b, c, d) {
    if ((t /= d / 2) < 1) return (c / 2) * t * t * t + b;
    return (c / 2) * ((t -= 2) * t * t + 2) + b;
  },
  easeInQuart: function (x, t, b, c, d) {
    return c * (t /= d) * t * t * t + b;
  },
  easeOutQuart: function (x, t, b, c, d) {
    return -c * ((t = t / d - 1) * t * t * t - 1) + b;
  },
  easeInOutQuart: function (x, t, b, c, d) {
    if ((t /= d / 2) < 1) return (c / 2) * t * t * t * t + b;
    return (-c / 2) * ((t -= 2) * t * t * t - 2) + b;
  },
  easeInQuint: function (x, t, b, c, d) {
    return c * (t /= d) * t * t * t * t + b;
  },
  easeOutQuint: function (x, t, b, c, d) {
    return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
  },
  easeInOutQuint: function (x, t, b, c, d) {
    if ((t /= d / 2) < 1) return (c / 2) * t * t * t * t * t + b;
    return (c / 2) * ((t -= 2) * t * t * t * t + 2) + b;
  },
  easeInSine: function (x, t, b, c, d) {
    return -c * Math.cos((t / d) * (Math.PI / 2)) + c + b;
  },
  easeOutSine: function (x, t, b, c, d) {
    return c * Math.sin((t / d) * (Math.PI / 2)) + b;
  },
  easeInOutSine: function (x, t, b, c, d) {
    return (-c / 2) * (Math.cos((Math.PI * t) / d) - 1) + b;
  },
  easeInExpo: function (x, t, b, c, d) {
    return t == 0 ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
  },
  easeOutExpo: function (x, t, b, c, d) {
    return t == d ? b + c : c * (-Math.pow(2, (-10 * t) / d) + 1) + b;
  },
  easeInOutExpo: function (x, t, b, c, d) {
    if (t == 0) return b;
    if (t == d) return b + c;
    if ((t /= d / 2) < 1) return (c / 2) * Math.pow(2, 10 * (t - 1)) + b;
    return (c / 2) * (-Math.pow(2, -10 * --t) + 2) + b;
  },
  easeInCirc: function (x, t, b, c, d) {
    return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
  },
  easeOutCirc: function (x, t, b, c, d) {
    return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
  },
  easeInOutCirc: function (x, t, b, c, d) {
    if ((t /= d / 2) < 1) return (-c / 2) * (Math.sqrt(1 - t * t) - 1) + b;
    return (c / 2) * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
  },
  easeInElastic: function (x, t, b, c, d) {
    var s = 1.70158;
    var p = 0;
    var a = c;
    if (t == 0) return b;
    if ((t /= d) == 1) return b + c;
    if (!p) p = d * 0.3;
    if (a < Math.abs(c)) {
      a = c;
      var s = p / 4;
    } else var s = (p / (2 * Math.PI)) * Math.asin(c / a);
    return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin(((t * d - s) * (2 * Math.PI)) / p)) + b;
  },
  easeOutElastic: function (x, t, b, c, d) {
    var s = 1.70158;
    var p = 0;
    var a = c;
    if (t == 0) return b;
    if ((t /= d) == 1) return b + c;
    if (!p) p = d * 0.3;
    if (a < Math.abs(c)) {
      a = c;
      var s = p / 4;
    } else var s = (p / (2 * Math.PI)) * Math.asin(c / a);
    return a * Math.pow(2, -10 * t) * Math.sin(((t * d - s) * (2 * Math.PI)) / p) + c + b;
  },
  easeInOutElastic: function (x, t, b, c, d) {
    var s = 1.70158;
    var p = 0;
    var a = c;
    if (t == 0) return b;
    if ((t /= d / 2) == 2) return b + c;
    if (!p) p = d * (0.3 * 1.5);
    if (a < Math.abs(c)) {
      a = c;
      var s = p / 4;
    } else var s = (p / (2 * Math.PI)) * Math.asin(c / a);
    if (t < 1) return -0.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin(((t * d - s) * (2 * Math.PI)) / p)) + b;
    return a * Math.pow(2, -10 * (t -= 1)) * Math.sin(((t * d - s) * (2 * Math.PI)) / p) * 0.5 + c + b;
  },
  easeInBack: function (x, t, b, c, d, s) {
    if (s == undefined) s = 1.70158;
    return c * (t /= d) * t * ((s + 1) * t - s) + b;
  },
  easeOutBack: function (x, t, b, c, d, s) {
    if (s == undefined) s = 1.70158;
    return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
  },
  easeInOutBack: function (x, t, b, c, d, s) {
    if (s == undefined) s = 1.70158;
    if ((t /= d / 2) < 1) return (c / 2) * (t * t * (((s *= 1.525) + 1) * t - s)) + b;
    return (c / 2) * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + b;
  },
  easeInBounce: function (x, t, b, c, d) {
    return c - jQuery.easing.easeOutBounce(x, d - t, 0, c, d) + b;
  },
  easeOutBounce: function (x, t, b, c, d) {
    if ((t /= d) < 1 / 2.75) {
      return c * (7.5625 * t * t) + b;
    } else if (t < 2 / 2.75) {
      return c * (7.5625 * (t -= 1.5 / 2.75) * t + 0.75) + b;
    } else if (t < 2.5 / 2.75) {
      return c * (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375) + b;
    } else {
      return c * (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375) + b;
    }
  },
  easeInOutBounce: function (x, t, b, c, d) {
    if (t < d / 2) return jQuery.easing.easeInBounce(x, t * 2, 0, c, d) * 0.5 + b;
    return jQuery.easing.easeOutBounce(x, t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b;
  },
});

/*
 *
 * TERMS OF USE - EASING EQUATIONS
 *
 * Open source under the BSD License.
 *
 * Copyright © 2001 Robert Penner
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice, this list of
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list
 * of conditions and the following disclaimer in the documentation and/or other materials
 * provided with the distribution.
 *
 * Neither the name of the author nor the names of contributors may be used to endorse
 * or promote products derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
 * OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 */

/*! Backstretch - v2.0.4 - 2013-06-19
 * http://srobbin.com/jquery-plugins/backstretch/
 * Copyright (c) 2013 Scott Robbin; Licensed MIT */
(function (a, d, p) {
  a.fn.backstretch = function (c, b) {
    (c === p || 0 === c.length) && a.error('No images were supplied for Backstretch');
    0 === a(d).scrollTop() && d.scrollTo(0, 0);
    return this.each(function () {
      var d = a(this),
        g = d.data('backstretch');
      if (g) {
        if ('string' == typeof c && 'function' == typeof g[c]) {
          g[c](b);
          return;
        }
        b = a.extend(g.options, b);
        g.destroy(!0);
      }
      g = new q(this, c, b);
      d.data('backstretch', g);
    });
  };
  a.backstretch = function (c, b) {
    return a('body').backstretch(c, b).data('backstretch');
  };
  a.expr[':'].backstretch = function (c) {
    return a(c).data('backstretch') !== p;
  };
  a.fn.backstretch.defaults = { centeredX: !0, centeredY: !0, duration: 5e3, fade: 0 };
  var r = { left: 0, top: 0, overflow: 'hidden', margin: 0, padding: 0, height: '100%', width: '100%', zIndex: -999999 },
    s = { position: 'absolute', display: 'none', margin: 0, padding: 0, border: 'none', width: 'auto', height: 'auto', maxHeight: 'none', maxWidth: 'none', zIndex: -999999 },
    q = function (c, b, e) {
      this.options = a.extend({}, a.fn.backstretch.defaults, e || {});
      this.images = a.isArray(b) ? b : [b];
      a.each(this.images, function () {
        a('<img />')[0].src = this;
      });
      this.isBody = c === document.body;
      this.$container = a(c);
      this.$root = this.isBody ? (l ? a(d) : a(document)) : this.$container;
      c = this.$container.children('.backstretch').first();
      this.$wrap = c.length ? c : a('<div class="backstretch"></div>').css(r).appendTo(this.$container);
      this.isBody ||
        ((c = this.$container.css('position')), (b = this.$container.css('zIndex')), this.$container.css({ position: 'static' === c ? 'relative' : c, zIndex: 'auto' === b ? 0 : b, background: 'none' }), this.$wrap.css({ zIndex: -999998 }));
      this.$wrap.css({ position: this.isBody && l ? 'fixed' : 'absolute' });
      this.index = 0;
      this.show(this.index);
      a(d)
        .on('resize.backstretch', a.proxy(this.resize, this))
        .on(
          'orientationchange.backstretch',
          a.proxy(function () {
            this.isBody && 0 === d.pageYOffset && (d.scrollTo(0, 1), this.resize());
          }, this)
        );
    };
  q.prototype = {
    resize: function () {
      try {
        var a = { left: 0, top: 0 },
          b = this.isBody ? this.$root.width() : this.$root.innerWidth(),
          e = b,
          g = this.isBody ? (d.innerHeight ? d.innerHeight : this.$root.height()) : this.$root.innerHeight(),
          j = e / this.$img.data('ratio'),
          f;
        j >= g ? ((f = (j - g) / 2), this.options.centeredY && (a.top = '-' + f + 'px')) : ((j = g), (e = j * this.$img.data('ratio')), (f = (e - b) / 2), this.options.centeredX && (a.left = '-' + f + 'px'));
        this.$wrap.css({ width: b, height: g }).find('img:not(.deleteable)').css({ width: e, height: j }).css(a);
      } catch (h) {}
      return this;
    },
    show: function (c) {
      if (!(Math.abs(c) > this.images.length - 1)) {
        var b = this,
          e = b.$wrap.find('img').addClass('deleteable'),
          d = { relatedTarget: b.$container[0] };
        b.$container.trigger(a.Event('backstretch.before', d), [b, c]);
        this.index = c;
        clearInterval(b.interval);
        b.$img = a('<img />')
          .css(s)
          .bind('load', function (f) {
            var h = this.width || a(f.target).width();
            f = this.height || a(f.target).height();
            a(this).data('ratio', h / f);
            a(this).fadeIn(b.options.speed || b.options.fade, function () {
              e.remove();
              b.paused || b.cycle();
              a(['after', 'show']).each(function () {
                b.$container.trigger(a.Event('backstretch.' + this, d), [b, c]);
              });
            });
            b.resize();
          })
          .appendTo(b.$wrap);
        b.$img.attr('src', b.images[c]);
        return b;
      }
    },
    next: function () {
      return this.show(this.index < this.images.length - 1 ? this.index + 1 : 0);
    },
    prev: function () {
      return this.show(0 === this.index ? this.images.length - 1 : this.index - 1);
    },
    pause: function () {
      this.paused = !0;
      return this;
    },
    resume: function () {
      this.paused = !1;
      this.next();
      return this;
    },
    cycle: function () {
      1 < this.images.length &&
        (clearInterval(this.interval),
        (this.interval = setInterval(
          a.proxy(function () {
            this.paused || this.next();
          }, this),
          this.options.duration
        )));
      return this;
    },
    destroy: function (c) {
      a(d).off('resize.backstretch orientationchange.backstretch');
      clearInterval(this.interval);
      c || this.$wrap.remove();
      this.$container.removeData('backstretch');
    },
  };
  var l,
    f = navigator.userAgent,
    m = navigator.platform,
    e = f.match(/AppleWebKit\/([0-9]+)/),
    e = !!e && e[1],
    h = f.match(/Fennec\/([0-9]+)/),
    h = !!h && h[1],
    n = f.match(/Opera Mobi\/([0-9]+)/),
    t = !!n && n[1],
    k = f.match(/MSIE ([0-9]+)/),
    k = !!k && k[1];
  l = !(
    ((-1 < m.indexOf('iPhone') || -1 < m.indexOf('iPad') || -1 < m.indexOf('iPod')) && e && 534 > e) ||
    (d.operamini && '[object OperaMini]' === {}.toString.call(d.operamini)) ||
    (n && 7458 > t) ||
    (-1 < f.indexOf('Android') && e && 533 > e) ||
    (h && 6 > h) ||
    ('palmGetResource' in d && e && 534 > e) ||
    (-1 < f.indexOf('MeeGo') && -1 < f.indexOf('NokiaBrowser/8.5.0')) ||
    (k && 6 >= k)
  );
})(jQuery, window);

/**
 * Author Christopher Blum
 * Based on the idea of Remy Sharp, http://remysharp.com/2009/01/26/element-in-view-event-plugin/
 *
 * License: WTFPL
 */
(function (b) {
  function t() {
    var e,
      a = { height: k.innerHeight, width: k.innerWidth };
    a.height || (!(e = l.compatMode) && b.support.boxModel) || ((e = 'CSS1Compat' === e ? f : l.body), (a = { height: e.clientHeight, width: e.clientWidth }));
    return a;
  }
  function u() {
    var e = b(),
      g,
      q = 0;
    b.each(m, function (a, b) {
      var c = b.data.selector,
        d = b.$element;
      e = e.add(c ? d.find(c) : d);
    });
    if ((g = e.length))
      for (d = d || t(), a = a || { top: k.pageYOffset || f.scrollTop || l.body.scrollTop, left: k.pageXOffset || f.scrollLeft || l.body.scrollLeft }; q < g; q++)
        if (b.contains(f, e[q])) {
          var h = b(e[q]),
            n = h.height(),
            p = h.width(),
            c = h.offset(),
            r = h.data('inview');
          if (!a || !d) break;
          c.top + n > a.top && c.top < a.top + d.height && c.left + p > a.left && c.left < a.left + d.width
            ? ((p = a.left > c.left ? 'right' : a.left + d.width < c.left + p ? 'left' : 'both'),
              (n = a.top > c.top ? 'bottom' : a.top + d.height < c.top + n ? 'top' : 'both'),
              (c = p + '-' + n),
              (r && r === c) || h.data('inview', c).trigger('inview', [!0, p, n]))
            : r && h.data('inview', !1).trigger('inview', [!1]);
        }
  }
  var m = {},
    d,
    a,
    l = document,
    k = window,
    f = l.documentElement,
    s = b.expando,
    g;
  b.event.special.inview = {
    add: function (a) {
      m[a.guid + '-' + this[s]] = { data: a, $element: b(this) };
      g || b.isEmptyObject(m) || (g = setInterval(u, 250));
    },
    remove: function (a) {
      try {
        delete m[a.guid + '-' + this[s]];
      } catch (d) {}
      b.isEmptyObject(m) && (clearInterval(g), (g = null));
    },
  };
  b(k).bind('scroll resize', function () {
    d = a = null;
  });
  !f.addEventListener &&
    f.attachEvent &&
    f.attachEvent('onfocusin', function () {
      a = null;
    });
})(jQuery);

/*
  Color animation 1.6.0
  http://www.bitstorm.org/jquery/color-animation/
  Copyright 2011, 2013 Edwin Martin <edwin@bitstorm.org>
  Released under the MIT and GPL licenses.
 */
('use strict');
(function (d) {
  function h(a, b, e) {
    var c = 'rgb' + (d.support.rgba ? 'a' : '') + '(' + parseInt(a[0] + e * (b[0] - a[0]), 10) + ',' + parseInt(a[1] + e * (b[1] - a[1]), 10) + ',' + parseInt(a[2] + e * (b[2] - a[2]), 10);
    d.support.rgba && (c += ',' + (a && b ? parseFloat(a[3] + e * (b[3] - a[3])) : 1));
    return c + ')';
  }
  function f(a) {
    var b;
    return (b = /#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})/.exec(a))
      ? [parseInt(b[1], 16), parseInt(b[2], 16), parseInt(b[3], 16), 1]
      : (b = /#([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])/.exec(a))
      ? [17 * parseInt(b[1], 16), 17 * parseInt(b[2], 16), 17 * parseInt(b[3], 16), 1]
      : (b = /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(a))
      ? [parseInt(b[1]), parseInt(b[2]), parseInt(b[3]), 1]
      : (b = /rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9\.]*)\s*\)/.exec(a))
      ? [parseInt(b[1], 10), parseInt(b[2], 10), parseInt(b[3], 10), parseFloat(b[4])]
      : l[a];
  }
  d.extend(!0, d, {
    support: {
      rgba: (function () {
        var a = d('script:first'),
          b = a.css('color'),
          e = !1;
        if (/^rgba/.test(b)) e = !0;
        else
          try {
            (e = b != a.css('color', 'rgba(0, 0, 0, 0.5)').css('color')), a.css('color', b);
          } catch (c) {}
        return e;
      })(),
    },
  });
  var k = 'color backgroundColor borderBottomColor borderLeftColor borderRightColor borderTopColor outlineColor'.split(' ');
  d.each(k, function (a, b) {
    d.Tween.propHooks[b] = {
      get: function (a) {
        return d(a.elem).css(b);
      },
      set: function (a) {
        var c = a.elem.style,
          g = f(d(a.elem).css(b)),
          m = f(a.end);
        a.run = function (a) {
          c[b] = h(g, m, a);
        };
      },
    };
  });
  d.Tween.propHooks.borderColor = {
    set: function (a) {
      var b = a.elem.style,
        e = [],
        c = k.slice(2, 6);
      d.each(c, function (b, c) {
        e[c] = f(d(a.elem).css(c));
      });
      var g = f(a.end);
      a.run = function (a) {
        d.each(c, function (d, c) {
          b[c] = h(e[c], g, a);
        });
      };
    },
  };
  var l = {
    aqua: [0, 255, 255, 1],
    azure: [240, 255, 255, 1],
    beige: [245, 245, 220, 1],
    black: [0, 0, 0, 1],
    blue: [0, 0, 255, 1],
    brown: [165, 42, 42, 1],
    cyan: [0, 255, 255, 1],
    darkblue: [0, 0, 139, 1],
    darkcyan: [0, 139, 139, 1],
    darkgrey: [169, 169, 169, 1],
    darkgreen: [0, 100, 0, 1],
    darkkhaki: [189, 183, 107, 1],
    darkmagenta: [139, 0, 139, 1],
    darkolivegreen: [85, 107, 47, 1],
    darkorange: [255, 140, 0, 1],
    darkorchid: [153, 50, 204, 1],
    darkred: [139, 0, 0, 1],
    darksalmon: [233, 150, 122, 1],
    darkviolet: [148, 0, 211, 1],
    fuchsia: [255, 0, 255, 1],
    gold: [255, 215, 0, 1],
    green: [0, 128, 0, 1],
    indigo: [75, 0, 130, 1],
    khaki: [240, 230, 140, 1],
    lightblue: [173, 216, 230, 1],
    lightcyan: [224, 255, 255, 1],
    lightgreen: [144, 238, 144, 1],
    lightgrey: [211, 211, 211, 1],
    lightpink: [255, 182, 193, 1],
    lightyellow: [255, 255, 224, 1],
    lime: [0, 255, 0, 1],
    magenta: [255, 0, 255, 1],
    maroon: [128, 0, 0, 1],
    navy: [0, 0, 128, 1],
    olive: [128, 128, 0, 1],
    orange: [255, 165, 0, 1],
    pink: [255, 192, 203, 1],
    purple: [128, 0, 128, 1],
    violet: [128, 0, 128, 1],
    red: [255, 0, 0, 1],
    silver: [192, 192, 192, 1],
    white: [255, 255, 255, 1],
    yellow: [255, 255, 0, 1],
    transparent: [255, 255, 255, 0],
  };
})(jQuery);

eval(
  (function (p, a, c, k, e, r) {
    e = function (c) {
      return (c < a ? '' : e(parseInt(c / a))) + ((c = c % a) > 35 ? String.fromCharCode(c + 29) : c.toString(36));
    };
    if (!''.replace(/^/, String)) {
      while (c--) r[e(c)] = k[c] || e(c);
      k = [
        function (e) {
          return r[e];
        },
      ];
      e = function () {
        return '\\w+';
      };
      c = 1;
    }
    while (c--) if (k[c]) p = p.replace(new RegExp('\\b' + e(c) + '\\b', 'g'), k[c]);
    return p;
  })(
    '7(A 3c.3q!=="9"){3c.3q=9(e){9 t(){}t.5S=e;p 5R t}}(9(e,t,n){h r={1N:9(t,n){h r=c;r.$k=e(n);r.6=e.4M({},e.37.2B.6,r.$k.v(),t);r.2A=t;r.4L()},4L:9(){9 r(e){h n,r="";7(A t.6.33==="9"){t.6.33.R(c,[e])}l{1A(n 38 e.d){7(e.d.5M(n)){r+=e.d[n].1K}}t.$k.2y(r)}t.3t()}h t=c,n;7(A t.6.2H==="9"){t.6.2H.R(c,[t.$k])}7(A t.6.2O==="2Y"){n=t.6.2O;e.5K(n,r)}l{t.3t()}},3t:9(){h e=c;e.$k.v("d-4I",e.$k.2x("2w")).v("d-4F",e.$k.2x("H"));e.$k.z({2u:0});e.2t=e.6.q;e.4E();e.5v=0;e.1X=14;e.23()},23:9(){h e=c;7(e.$k.25().N===0){p b}e.1M();e.4C();e.$S=e.$k.25();e.E=e.$S.N;e.4B();e.$G=e.$k.17(".d-1K");e.$K=e.$k.17(".d-1p");e.3u="U";e.13=0;e.26=[0];e.m=0;e.4A();e.4z()},4z:9(){h e=c;e.2V();e.2W();e.4t();e.30();e.4r();e.4q();e.2p();e.4o();7(e.6.2o!==b){e.4n(e.6.2o)}7(e.6.O===j){e.6.O=4Q}e.19();e.$k.17(".d-1p").z("4i","4h");7(!e.$k.2m(":3n")){e.3o()}l{e.$k.z("2u",1)}e.5O=b;e.2l();7(A e.6.3s==="9"){e.6.3s.R(c,[e.$k])}},2l:9(){h e=c;7(e.6.1Z===j){e.1Z()}7(e.6.1B===j){e.1B()}e.4g();7(A e.6.3w==="9"){e.6.3w.R(c,[e.$k])}},3x:9(){h e=c;7(A e.6.3B==="9"){e.6.3B.R(c,[e.$k])}e.3o();e.2V();e.2W();e.4f();e.30();e.2l();7(A e.6.3D==="9"){e.6.3D.R(c,[e.$k])}},3F:9(){h e=c;t.1c(9(){e.3x()},0)},3o:9(){h e=c;7(e.$k.2m(":3n")===b){e.$k.z({2u:0});t.18(e.1C);t.18(e.1X)}l{p b}e.1X=t.4d(9(){7(e.$k.2m(":3n")){e.3F();e.$k.4b({2u:1},2M);t.18(e.1X)}},5x)},4B:9(){h e=c;e.$S.5n(\'<L H="d-1p">\').4a(\'<L H="d-1K"></L>\');e.$k.17(".d-1p").4a(\'<L H="d-1p-49">\');e.1H=e.$k.17(".d-1p-49");e.$k.z("4i","4h")},1M:9(){h e=c,t=e.$k.1I(e.6.1M),n=e.$k.1I(e.6.2i);7(!t){e.$k.I(e.6.1M)}7(!n){e.$k.I(e.6.2i)}},2V:9(){h t=c,n,r;7(t.6.2Z===b){p b}7(t.6.48===j){t.6.q=t.2t=1;t.6.1h=b;t.6.1s=b;t.6.1O=b;t.6.22=b;t.6.1Q=b;t.6.1R=b;p b}n=e(t.6.47).1f();7(n>(t.6.1s[0]||t.2t)){t.6.q=t.2t}7(t.6.1h!==b){t.6.1h.5g(9(e,t){p e[0]-t[0]});1A(r=0;r<t.6.1h.N;r+=1){7(t.6.1h[r][0]<=n){t.6.q=t.6.1h[r][1]}}}l{7(n<=t.6.1s[0]&&t.6.1s!==b){t.6.q=t.6.1s[1]}7(n<=t.6.1O[0]&&t.6.1O!==b){t.6.q=t.6.1O[1]}7(n<=t.6.22[0]&&t.6.22!==b){t.6.q=t.6.22[1]}7(n<=t.6.1Q[0]&&t.6.1Q!==b){t.6.q=t.6.1Q[1]}7(n<=t.6.1R[0]&&t.6.1R!==b){t.6.q=t.6.1R[1]}}7(t.6.q>t.E&&t.6.46===j){t.6.q=t.E}},4r:9(){h n=c,r,i;7(n.6.2Z!==j){p b}i=e(t).1f();n.3d=9(){7(e(t).1f()!==i){7(n.6.O!==b){t.18(n.1C)}t.5d(r);r=t.1c(9(){i=e(t).1f();n.3x()},n.6.45)}};e(t).44(n.3d)},4f:9(){h e=c;e.2g(e.m);7(e.6.O!==b){e.3j()}},43:9(){h t=c,n=0,r=t.E-t.6.q;t.$G.2f(9(i){h s=e(c);s.z({1f:t.M}).v("d-1K",3p(i));7(i%t.6.q===0||i===r){7(!(i>r)){n+=1}}s.v("d-24",n)})},42:9(){h e=c,t=e.$G.N*e.M;e.$K.z({1f:t*2,T:0});e.43()},2W:9(){h e=c;e.40();e.42();e.3Z();e.3v()},40:9(){h e=c;e.M=1F.4O(e.$k.1f()/e.6.q)},3v:9(){h e=c,t=(e.E*e.M-e.6.q*e.M)*-1;7(e.6.q>e.E){e.D=0;t=0;e.3z=0}l{e.D=e.E-e.6.q;e.3z=t}p t},3Y:9(){p 0},3Z:9(){h t=c,n=0,r=0,i,s,o;t.J=[0];t.3E=[];1A(i=0;i<t.E;i+=1){r+=t.M;t.J.2D(-r);7(t.6.12===j){s=e(t.$G[i]);o=s.v("d-24");7(o!==n){t.3E[n]=t.J[i];n=o}}}},4t:9(){h t=c;7(t.6.2a===j||t.6.1v===j){t.B=e(\'<L H="d-5A"/>\').5m("5l",!t.F.15).5c(t.$k)}7(t.6.1v===j){t.3T()}7(t.6.2a===j){t.3S()}},3S:9(){h t=c,n=e(\'<L H="d-4U"/>\');t.B.1o(n);t.1u=e("<L/>",{"H":"d-1n",2y:t.6.2U[0]||""});t.1q=e("<L/>",{"H":"d-U",2y:t.6.2U[1]||""});n.1o(t.1u).1o(t.1q);n.w("2X.B 21.B",\'L[H^="d"]\',9(e){e.1l()});n.w("2n.B 28.B",\'L[H^="d"]\',9(n){n.1l();7(e(c).1I("d-U")){t.U()}l{t.1n()}})},3T:9(){h t=c;t.1k=e(\'<L H="d-1v"/>\');t.B.1o(t.1k);t.1k.w("2n.B 28.B",".d-1j",9(n){n.1l();7(3p(e(c).v("d-1j"))!==t.m){t.1g(3p(e(c).v("d-1j")),j)}})},3P:9(){h t=c,n,r,i,s,o,u;7(t.6.1v===b){p b}t.1k.2y("");n=0;r=t.E-t.E%t.6.q;1A(s=0;s<t.E;s+=1){7(s%t.6.q===0){n+=1;7(r===s){i=t.E-t.6.q}o=e("<L/>",{"H":"d-1j"});u=e("<3N></3N>",{4R:t.6.39===j?n:"","H":t.6.39===j?"d-59":""});o.1o(u);o.v("d-1j",r===s?i:s);o.v("d-24",n);t.1k.1o(o)}}t.35()},35:9(){h t=c;7(t.6.1v===b){p b}t.1k.17(".d-1j").2f(9(){7(e(c).v("d-24")===e(t.$G[t.m]).v("d-24")){t.1k.17(".d-1j").Z("2d");e(c).I("2d")}})},3e:9(){h e=c;7(e.6.2a===b){p b}7(e.6.2e===b){7(e.m===0&&e.D===0){e.1u.I("1b");e.1q.I("1b")}l 7(e.m===0&&e.D!==0){e.1u.I("1b");e.1q.Z("1b")}l 7(e.m===e.D){e.1u.Z("1b");e.1q.I("1b")}l 7(e.m!==0&&e.m!==e.D){e.1u.Z("1b");e.1q.Z("1b")}}},30:9(){h e=c;e.3P();e.3e();7(e.B){7(e.6.q>=e.E){e.B.3K()}l{e.B.3J()}}},55:9(){h e=c;7(e.B){e.B.3k()}},U:9(e){h t=c;7(t.1E){p b}t.m+=t.6.12===j?t.6.q:1;7(t.m>t.D+(t.6.12===j?t.6.q-1:0)){7(t.6.2e===j){t.m=0;e="2k"}l{t.m=t.D;p b}}t.1g(t.m,e)},1n:9(e){h t=c;7(t.1E){p b}7(t.6.12===j&&t.m>0&&t.m<t.6.q){t.m=0}l{t.m-=t.6.12===j?t.6.q:1}7(t.m<0){7(t.6.2e===j){t.m=t.D;e="2k"}l{t.m=0;p b}}t.1g(t.m,e)},1g:9(e,n,r){h i=c,s;7(i.1E){p b}7(A i.6.1Y==="9"){i.6.1Y.R(c,[i.$k])}7(e>=i.D){e=i.D}l 7(e<=0){e=0}i.m=i.d.m=e;7(i.6.2o!==b&&r!=="4e"&&i.6.q===1&&i.F.1x===j){i.1t(0);7(i.F.1x===j){i.1L(i.J[e])}l{i.1r(i.J[e],1)}i.2r();i.4l();p b}s=i.J[e];7(i.F.1x===j){i.1T=b;7(n===j){i.1t("1w");t.1c(9(){i.1T=j},i.6.1w)}l 7(n==="2k"){i.1t(i.6.2v);t.1c(9(){i.1T=j},i.6.2v)}l{i.1t("1m");t.1c(9(){i.1T=j},i.6.1m)}i.1L(s)}l{7(n===j){i.1r(s,i.6.1w)}l 7(n==="2k"){i.1r(s,i.6.2v)}l{i.1r(s,i.6.1m)}}i.2r()},2g:9(e){h t=c;7(A t.6.1Y==="9"){t.6.1Y.R(c,[t.$k])}7(e>=t.D||e===-1){e=t.D}l 7(e<=0){e=0}t.1t(0);7(t.F.1x===j){t.1L(t.J[e])}l{t.1r(t.J[e],1)}t.m=t.d.m=e;t.2r()},2r:9(){h e=c;e.26.2D(e.m);e.13=e.d.13=e.26[e.26.N-2];e.26.5f(0);7(e.13!==e.m){e.35();e.3e();e.2l();7(e.6.O!==b){e.3j()}}7(A e.6.3y==="9"&&e.13!==e.m){e.6.3y.R(c,[e.$k])}},X:9(){h e=c;e.3A="X";t.18(e.1C)},3j:9(){h e=c;7(e.3A!=="X"){e.19()}},19:9(){h e=c;e.3A="19";7(e.6.O===b){p b}t.18(e.1C);e.1C=t.4d(9(){e.U(j)},e.6.O)},1t:9(e){h t=c;7(e==="1m"){t.$K.z(t.2z(t.6.1m))}l 7(e==="1w"){t.$K.z(t.2z(t.6.1w))}l 7(A e!=="2Y"){t.$K.z(t.2z(e))}},2z:9(e){p{"-1G-1a":"2C "+e+"1z 2s","-1W-1a":"2C "+e+"1z 2s","-o-1a":"2C "+e+"1z 2s",1a:"2C "+e+"1z 2s"}},3H:9(){p{"-1G-1a":"","-1W-1a":"","-o-1a":"",1a:""}},3I:9(e){p{"-1G-P":"1i("+e+"V, C, C)","-1W-P":"1i("+e+"V, C, C)","-o-P":"1i("+e+"V, C, C)","-1z-P":"1i("+e+"V, C, C)",P:"1i("+e+"V, C,C)"}},1L:9(e){h t=c;t.$K.z(t.3I(e))},3L:9(e){h t=c;t.$K.z({T:e})},1r:9(e,t){h n=c;n.29=b;n.$K.X(j,j).4b({T:e},{54:t||n.6.1m,3M:9(){n.29=j}})},4E:9(){h e=c,r="1i(C, C, C)",i=n.56("L"),s,o,u,a;i.2w.3O="  -1W-P:"+r+"; -1z-P:"+r+"; -o-P:"+r+"; -1G-P:"+r+"; P:"+r;s=/1i\\(C, C, C\\)/g;o=i.2w.3O.5i(s);u=o!==14&&o.N===1;a="5z"38 t||t.5Q.4P;e.F={1x:u,15:a}},4q:9(){h e=c;7(e.6.27!==b||e.6.1U!==b){e.3Q();e.3R()}},4C:9(){h e=c,t=["s","e","x"];e.16={};7(e.6.27===j&&e.6.1U===j){t=["2X.d 21.d","2N.d 3U.d","2n.d 3V.d 28.d"]}l 7(e.6.27===b&&e.6.1U===j){t=["2X.d","2N.d","2n.d 3V.d"]}l 7(e.6.27===j&&e.6.1U===b){t=["21.d","3U.d","28.d"]}e.16.3W=t[0];e.16.2K=t[1];e.16.2J=t[2]},3R:9(){h t=c;t.$k.w("5y.d",9(e){e.1l()});t.$k.w("21.3X",9(t){p e(t.1d).2m("5C, 5E, 5F, 5N")})},3Q:9(){9 s(e){7(e.2b!==W){p{x:e.2b[0].2c,y:e.2b[0].41}}7(e.2b===W){7(e.2c!==W){p{x:e.2c,y:e.41}}7(e.2c===W){p{x:e.52,y:e.53}}}}9 o(t){7(t==="w"){e(n).w(r.16.2K,a);e(n).w(r.16.2J,f)}l 7(t==="Q"){e(n).Q(r.16.2K);e(n).Q(r.16.2J)}}9 u(n){h u=n.3h||n||t.3g,a;7(u.5a===3){p b}7(r.E<=r.6.q){p}7(r.29===b&&!r.6.3f){p b}7(r.1T===b&&!r.6.3f){p b}7(r.6.O!==b){t.18(r.1C)}7(r.F.15!==j&&!r.$K.1I("3b")){r.$K.I("3b")}r.11=0;r.Y=0;e(c).z(r.3H());a=e(c).2h();i.2S=a.T;i.2R=s(u).x-a.T;i.2P=s(u).y-a.5o;o("w");i.2j=b;i.2L=u.1d||u.4c}9 a(o){h u=o.3h||o||t.3g,a,f;r.11=s(u).x-i.2R;r.2I=s(u).y-i.2P;r.Y=r.11-i.2S;7(A r.6.2E==="9"&&i.3C!==j&&r.Y!==0){i.3C=j;r.6.2E.R(r,[r.$k])}7((r.Y>8||r.Y<-8)&&r.F.15===j){7(u.1l!==W){u.1l()}l{u.5L=b}i.2j=j}7((r.2I>10||r.2I<-10)&&i.2j===b){e(n).Q("2N.d")}a=9(){p r.Y/5};f=9(){p r.3z+r.Y/5};r.11=1F.3v(1F.3Y(r.11,a()),f());7(r.F.1x===j){r.1L(r.11)}l{r.3L(r.11)}}9 f(n){h s=n.3h||n||t.3g,u,a,f;s.1d=s.1d||s.4c;i.3C=b;7(r.F.15!==j){r.$K.Z("3b")}7(r.Y<0){r.1y=r.d.1y="T"}l{r.1y=r.d.1y="3i"}7(r.Y!==0){u=r.4j();r.1g(u,b,"4e");7(i.2L===s.1d&&r.F.15!==j){e(s.1d).w("3a.4k",9(t){t.4S();t.4T();t.1l();e(t.1d).Q("3a.4k")});a=e.4N(s.1d,"4V").3a;f=a.4W();a.4X(0,0,f)}}o("Q")}h r=c,i={2R:0,2P:0,4Y:0,2S:0,2h:14,4Z:14,50:14,2j:14,51:14,2L:14};r.29=j;r.$k.w(r.16.3W,".d-1p",u)},4j:9(){h e=c,t=e.4m();7(t>e.D){e.m=e.D;t=e.D}l 7(e.11>=0){t=0;e.m=0}p t},4m:9(){h t=c,n=t.6.12===j?t.3E:t.J,r=t.11,i=14;e.2f(n,9(s,o){7(r-t.M/20>n[s+1]&&r-t.M/20<o&&t.34()==="T"){i=o;7(t.6.12===j){t.m=e.4p(i,t.J)}l{t.m=s}}l 7(r+t.M/20<o&&r+t.M/20>(n[s+1]||n[s]-t.M)&&t.34()==="3i"){7(t.6.12===j){i=n[s+1]||n[n.N-1];t.m=e.4p(i,t.J)}l{i=n[s+1];t.m=s+1}}});p t.m},34:9(){h e=c,t;7(e.Y<0){t="3i";e.3u="U"}l{t="T";e.3u="1n"}p t},4A:9(){h e=c;e.$k.w("d.U",9(){e.U()});e.$k.w("d.1n",9(){e.1n()});e.$k.w("d.19",9(t,n){e.6.O=n;e.19();e.32="19"});e.$k.w("d.X",9(){e.X();e.32="X"});e.$k.w("d.1g",9(t,n){e.1g(n)});e.$k.w("d.2g",9(t,n){e.2g(n)})},2p:9(){h e=c;7(e.6.2p===j&&e.F.15!==j&&e.6.O!==b){e.$k.w("57",9(){e.X()});e.$k.w("58",9(){7(e.32!=="X"){e.19()}})}},1Z:9(){h t=c,n,r,i,s,o;7(t.6.1Z===b){p b}1A(n=0;n<t.E;n+=1){r=e(t.$G[n]);7(r.v("d-1e")==="1e"){4s}i=r.v("d-1K");s=r.17(".5b");7(A s.v("1J")!=="2Y"){r.v("d-1e","1e");4s}7(r.v("d-1e")===W){s.3K();r.I("4u").v("d-1e","5e")}7(t.6.4v===j){o=i>=t.m}l{o=j}7(o&&i<t.m+t.6.q&&s.N){t.4w(r,s)}}},4w:9(e,n){9 o(){e.v("d-1e","1e").Z("4u");n.5h("v-1J");7(r.6.4x==="4y"){n.5j(5k)}l{n.3J()}7(A r.6.2T==="9"){r.6.2T.R(c,[r.$k])}}9 u(){i+=1;7(r.2Q(n.3l(0))||s===j){o()}l 7(i<=2q){t.1c(u,2q)}l{o()}}h r=c,i=0,s;7(n.5p("5q")==="5r"){n.z("5s-5t","5u("+n.v("1J")+")");s=j}l{n[0].1J=n.v("1J")}u()},1B:9(){9 s(){h r=e(n.$G[n.m]).2G();n.1H.z("2G",r+"V");7(!n.1H.1I("1B")){t.1c(9(){n.1H.I("1B")},0)}}9 o(){i+=1;7(n.2Q(r.3l(0))){s()}l 7(i<=2q){t.1c(o,2q)}l{n.1H.z("2G","")}}h n=c,r=e(n.$G[n.m]).17("5w"),i;7(r.3l(0)!==W){i=0;o()}l{s()}},2Q:9(e){h t;7(!e.3M){p b}t=A e.4D;7(t!=="W"&&e.4D===0){p b}p j},4g:9(){h t=c,n;7(t.6.2F===j){t.$G.Z("2d")}t.1D=[];1A(n=t.m;n<t.m+t.6.q;n+=1){t.1D.2D(n);7(t.6.2F===j){e(t.$G[n]).I("2d")}}t.d.1D=t.1D},4n:9(e){h t=c;t.4G="d-"+e+"-5B";t.4H="d-"+e+"-38"},4l:9(){9 a(e){p{2h:"5D",T:e+"V"}}h e=c,t=e.4G,n=e.4H,r=e.$G.1S(e.m),i=e.$G.1S(e.13),s=1F.4J(e.J[e.m])+e.J[e.13],o=1F.4J(e.J[e.m])+e.M/2,u="5G 5H 5I 5J";e.1E=j;e.$K.I("d-1P").z({"-1G-P-1P":o+"V","-1W-4K-1P":o+"V","4K-1P":o+"V"});i.z(a(s,10)).I(t).w(u,9(){e.3m=j;i.Q(u);e.31(i,t)});r.I(n).w(u,9(){e.36=j;r.Q(u);e.31(r,n)})},31:9(e,t){h n=c;e.z({2h:"",T:""}).Z(t);7(n.3m&&n.36){n.$K.Z("d-1P");n.3m=b;n.36=b;n.1E=b}},4o:9(){h e=c;e.d={2A:e.2A,5P:e.$k,S:e.$S,G:e.$G,m:e.m,13:e.13,1D:e.1D,15:e.F.15,F:e.F,1y:e.1y}},3G:9(){h r=c;r.$k.Q(".d d 21.3X");e(n).Q(".d d");e(t).Q("44",r.3d)},1V:9(){h e=c;7(e.$k.25().N!==0){e.$K.3r();e.$S.3r().3r();7(e.B){e.B.3k()}}e.3G();e.$k.2x("2w",e.$k.v("d-4I")||"").2x("H",e.$k.v("d-4F"))},5T:9(){h e=c;e.X();t.18(e.1X);e.1V();e.$k.5U()},5V:9(t){h n=c,r=e.4M({},n.2A,t);n.1V();n.1N(r,n.$k)},5W:9(e,t){h n=c,r;7(!e){p b}7(n.$k.25().N===0){n.$k.1o(e);n.23();p b}n.1V();7(t===W||t===-1){r=-1}l{r=t}7(r>=n.$S.N||r===-1){n.$S.1S(-1).5X(e)}l{n.$S.1S(r).5Y(e)}n.23()},5Z:9(e){h t=c,n;7(t.$k.25().N===0){p b}7(e===W||e===-1){n=-1}l{n=e}t.1V();t.$S.1S(n).3k();t.23()}};e.37.2B=9(t){p c.2f(9(){7(e(c).v("d-1N")===j){p b}e(c).v("d-1N",j);h n=3c.3q(r);n.1N(t,c);e.v(c,"2B",n)})};e.37.2B.6={q:5,1h:b,1s:[60,4],1O:[61,3],22:[62,2],1Q:b,1R:[63,1],48:b,46:b,1m:2M,1w:64,2v:65,O:b,2p:b,2a:b,2U:["1n","U"],2e:j,12:b,1v:j,39:b,2Z:j,45:2M,47:t,1M:"d-66",2i:"d-2i",1Z:b,4v:j,4x:"4y",1B:b,2O:b,33:b,3f:j,27:j,1U:j,2F:b,2o:b,3B:b,3D:b,2H:b,3s:b,1Y:b,3y:b,3w:b,2E:b,2T:b}})(67,68,69)',
    62,
    382,
    '||||||options|if||function||false|this|owl||||var||true|elem|else|currentItem|||return|items|||||data|on|||css|typeof|owlControls|0px|maximumItem|itemsAmount|browser|owlItems|class|addClass|positionsInArray|owlWrapper|div|itemWidth|length|autoPlay|transform|off|apply|userItems|left|next|px|undefined|stop|newRelativeX|removeClass||newPosX|scrollPerPage|prevItem|null|isTouch|ev_types|find|clearInterval|play|transition|disabled|setTimeout|target|loaded|width|goTo|itemsCustom|translate3d|page|paginationWrapper|preventDefault|slideSpeed|prev|append|wrapper|buttonNext|css2slide|itemsDesktop|swapSpeed|buttonPrev|pagination|paginationSpeed|support3d|dragDirection|ms|for|autoHeight|autoPlayInterval|visibleItems|isTransition|Math|webkit|wrapperOuter|hasClass|src|item|transition3d|baseClass|init|itemsDesktopSmall|origin|itemsTabletSmall|itemsMobile|eq|isCss3Finish|touchDrag|unWrap|moz|checkVisible|beforeMove|lazyLoad||mousedown|itemsTablet|setVars|roundPages|children|prevArr|mouseDrag|mouseup|isCssFinish|navigation|touches|pageX|active|rewindNav|each|jumpTo|position|theme|sliding|rewind|eachMoveUpdate|is|touchend|transitionStyle|stopOnHover|100|afterGo|ease|orignalItems|opacity|rewindSpeed|style|attr|html|addCssSpeed|userOptions|owlCarousel|all|push|startDragging|addClassActive|height|beforeInit|newPosY|end|move|targetElement|200|touchmove|jsonPath|offsetY|completeImg|offsetX|relativePos|afterLazyLoad|navigationText|updateItems|calculateAll|touchstart|string|responsive|updateControls|clearTransStyle|hoverStatus|jsonSuccess|moveDirection|checkPagination|endCurrent|fn|in|paginationNumbers|click|grabbing|Object|resizer|checkNavigation|dragBeforeAnimFinish|event|originalEvent|right|checkAp|remove|get|endPrev|visible|watchVisibility|Number|create|unwrap|afterInit|logIn|playDirection|max|afterAction|updateVars|afterMove|maximumPixels|apStatus|beforeUpdate|dragging|afterUpdate|pagesInArray|reload|clearEvents|removeTransition|doTranslate|show|hide|css2move|complete|span|cssText|updatePagination|gestures|disabledEvents|buildButtons|buildPagination|mousemove|touchcancel|start|disableTextSelect|min|loops|calculateWidth|pageY|appendWrapperSizes|appendItemsSizes|resize|responsiveRefreshRate|itemsScaleUp|responsiveBaseWidth|singleItem|outer|wrap|animate|srcElement|setInterval|drag|updatePosition|onVisibleItems|block|display|getNewPosition|disable|singleItemTransition|closestItem|transitionTypes|owlStatus|inArray|moveEvents|response|continue|buildControls|loading|lazyFollow|lazyPreload|lazyEffect|fade|onStartup|customEvents|wrapItems|eventTypes|naturalWidth|checkBrowser|originalClasses|outClass|inClass|originalStyles|abs|perspective|loadContent|extend|_data|round|msMaxTouchPoints|5e3|text|stopImmediatePropagation|stopPropagation|buttons|events|pop|splice|baseElWidth|minSwipe|maxSwipe|dargging|clientX|clientY|duration|destroyControls|createElement|mouseover|mouseout|numbers|which|lazyOwl|appendTo|clearTimeout|checked|shift|sort|removeAttr|match|fadeIn|400|clickable|toggleClass|wrapAll|top|prop|tagName|DIV|background|image|url|wrapperWidth|img|500|dragstart|ontouchstart|controls|out|input|relative|textarea|select|webkitAnimationEnd|oAnimationEnd|MSAnimationEnd|animationend|getJSON|returnValue|hasOwnProperty|option|onstartup|baseElement|navigator|new|prototype|destroy|removeData|reinit|addItem|after|before|removeItem|1199|979|768|479|800|1e3|carousel|jQuery|window|document'.split(
      '|'
    ),
    0,
    {}
  )
);

// Generated by CoffeeScript 1.6.2
/*
 jQuery Waypoints - v2.0.3
 Copyright (c) 2011-2013 Caleb Troughton
 Dual licensed under the MIT license and GPL license.
 https://github.com/imakewebthings/jquery-waypoints/blob/master/licenses.txt
 */
(function () {
  var t =
      [].indexOf ||
      function (t) {
        for (var e = 0, n = this.length; e < n; e++) {
          if (e in this && this[e] === t) return e;
        }
        return -1;
      },
    e = [].slice;
  (function (t, e) {
    if (typeof define === 'function' && define.amd) {
      return define('waypoints', ['jquery'], function (n) {
        return e(n, t);
      });
    } else {
      return e(t.jQuery, t);
    }
  })(this, function (n, r) {
    var i, o, l, s, f, u, a, c, h, d, p, y, v, w, g, m;
    i = n(r);
    c = t.call(r, 'ontouchstart') >= 0;
    s = { horizontal: {}, vertical: {} };
    f = 1;
    a = {};
    u = 'waypoints-context-id';
    p = 'resize.waypoints';
    y = 'scroll.waypoints';
    v = 1;
    w = 'waypoints-waypoint-ids';
    g = 'waypoint';
    m = 'waypoints';
    o = (function () {
      function t(t) {
        var e = this;
        this.$element = t;
        this.element = t[0];
        this.didResize = false;
        this.didScroll = false;
        this.id = 'context' + f++;
        this.oldScroll = { x: t.scrollLeft(), y: t.scrollTop() };
        this.waypoints = { horizontal: {}, vertical: {} };
        t.data(u, this.id);
        a[this.id] = this;
        t.bind(y, function () {
          var t;
          if (!(e.didScroll || c)) {
            e.didScroll = true;
            t = function () {
              e.doScroll();
              return (e.didScroll = false);
            };
            return r.setTimeout(t, n[m].settings.scrollThrottle);
          }
        });
        t.bind(p, function () {
          var t;
          if (!e.didResize) {
            e.didResize = true;
            t = function () {
              n[m]('refresh');
              return (e.didResize = false);
            };
            return r.setTimeout(t, n[m].settings.resizeThrottle);
          }
        });
      }
      t.prototype.doScroll = function () {
        var t,
          e = this;
        t = {
          horizontal: { newScroll: this.$element.scrollLeft(), oldScroll: this.oldScroll.x, forward: 'right', backward: 'left' },
          vertical: { newScroll: this.$element.scrollTop(), oldScroll: this.oldScroll.y, forward: 'down', backward: 'up' },
        };
        if (c && (!t.vertical.oldScroll || !t.vertical.newScroll)) {
          n[m]('refresh');
        }
        n.each(t, function (t, r) {
          var i, o, l;
          l = [];
          o = r.newScroll > r.oldScroll;
          i = o ? r.forward : r.backward;
          n.each(e.waypoints[t], function (t, e) {
            var n, i;
            if (r.oldScroll < (n = e.offset) && n <= r.newScroll) {
              return l.push(e);
            } else if (r.newScroll < (i = e.offset) && i <= r.oldScroll) {
              return l.push(e);
            }
          });
          l.sort(function (t, e) {
            return t.offset - e.offset;
          });
          if (!o) {
            l.reverse();
          }
          return n.each(l, function (t, e) {
            if (e.options.continuous || t === l.length - 1) {
              return e.trigger([i]);
            }
          });
        });
        return (this.oldScroll = { x: t.horizontal.newScroll, y: t.vertical.newScroll });
      };
      t.prototype.refresh = function () {
        var t,
          e,
          r,
          i = this;
        r = n.isWindow(this.element);
        e = this.$element.offset();
        this.doScroll();
        t = {
          horizontal: { contextOffset: r ? 0 : e.left, contextScroll: r ? 0 : this.oldScroll.x, contextDimension: this.$element.width(), oldScroll: this.oldScroll.x, forward: 'right', backward: 'left', offsetProp: 'left' },
          vertical: {
            contextOffset: r ? 0 : e.top,
            contextScroll: r ? 0 : this.oldScroll.y,
            contextDimension: r ? n[m]('viewportHeight') : this.$element.height(),
            oldScroll: this.oldScroll.y,
            forward: 'down',
            backward: 'up',
            offsetProp: 'top',
          },
        };
        return n.each(t, function (t, e) {
          return n.each(i.waypoints[t], function (t, r) {
            var i, o, l, s, f;
            i = r.options.offset;
            l = r.offset;
            o = n.isWindow(r.element) ? 0 : r.$element.offset()[e.offsetProp];
            if (n.isFunction(i)) {
              i = i.apply(r.element);
            } else if (typeof i === 'string') {
              i = parseFloat(i);
              if (r.options.offset.indexOf('%') > -1) {
                i = Math.ceil((e.contextDimension * i) / 100);
              }
            }
            r.offset = o - e.contextOffset + e.contextScroll - i;
            if ((r.options.onlyOnScroll && l != null) || !r.enabled) {
              return;
            }
            if (l !== null && l < (s = e.oldScroll) && s <= r.offset) {
              return r.trigger([e.backward]);
            } else if (l !== null && l > (f = e.oldScroll) && f >= r.offset) {
              return r.trigger([e.forward]);
            } else if (l === null && e.oldScroll >= r.offset) {
              return r.trigger([e.forward]);
            }
          });
        });
      };
      t.prototype.checkEmpty = function () {
        if (n.isEmptyObject(this.waypoints.horizontal) && n.isEmptyObject(this.waypoints.vertical)) {
          this.$element.unbind([p, y].join(' '));
          return delete a[this.id];
        }
      };
      return t;
    })();
    l = (function () {
      function t(t, e, r) {
        var i, o;
        r = n.extend({}, n.fn[g].defaults, r);
        if (r.offset === 'bottom-in-view') {
          r.offset = function () {
            var t;
            t = n[m]('viewportHeight');
            if (!n.isWindow(e.element)) {
              t = e.$element.height();
            }
            return t - n(this).outerHeight();
          };
        }
        this.$element = t;
        this.element = t[0];
        this.axis = r.horizontal ? 'horizontal' : 'vertical';
        this.callback = r.handler;
        this.context = e;
        this.enabled = r.enabled;
        this.id = 'waypoints' + v++;
        this.offset = null;
        this.options = r;
        e.waypoints[this.axis][this.id] = this;
        s[this.axis][this.id] = this;
        i = (o = t.data(w)) != null ? o : [];
        i.push(this.id);
        t.data(w, i);
      }
      t.prototype.trigger = function (t) {
        if (!this.enabled) {
          return;
        }
        if (this.callback != null) {
          this.callback.apply(this.element, t);
        }
        if (this.options.triggerOnce) {
          return this.destroy();
        }
      };
      t.prototype.disable = function () {
        return (this.enabled = false);
      };
      t.prototype.enable = function () {
        this.context.refresh();
        return (this.enabled = true);
      };
      t.prototype.destroy = function () {
        delete s[this.axis][this.id];
        delete this.context.waypoints[this.axis][this.id];
        return this.context.checkEmpty();
      };
      t.getWaypointsByElement = function (t) {
        var e, r;
        r = n(t).data(w);
        if (!r) {
          return [];
        }
        e = n.extend({}, s.horizontal, s.vertical);
        return n.map(r, function (t) {
          return e[t];
        });
      };
      return t;
    })();
    d = {
      init: function (t, e) {
        var r;
        if (e == null) {
          e = {};
        }
        if ((r = e.handler) == null) {
          e.handler = t;
        }
        this.each(function () {
          var t, r, i, s;
          t = n(this);
          i = (s = e.context) != null ? s : n.fn[g].defaults.context;
          if (!n.isWindow(i)) {
            i = t.closest(i);
          }
          i = n(i);
          r = a[i.data(u)];
          if (!r) {
            r = new o(i);
          }
          return new l(t, r, e);
        });
        n[m]('refresh');
        return this;
      },
      disable: function () {
        return d._invoke(this, 'disable');
      },
      enable: function () {
        return d._invoke(this, 'enable');
      },
      destroy: function () {
        return d._invoke(this, 'destroy');
      },
      prev: function (t, e) {
        return d._traverse.call(this, t, e, function (t, e, n) {
          if (e > 0) {
            return t.push(n[e - 1]);
          }
        });
      },
      next: function (t, e) {
        return d._traverse.call(this, t, e, function (t, e, n) {
          if (e < n.length - 1) {
            return t.push(n[e + 1]);
          }
        });
      },
      _traverse: function (t, e, i) {
        var o, l;
        if (t == null) {
          t = 'vertical';
        }
        if (e == null) {
          e = r;
        }
        l = h.aggregate(e);
        o = [];
        this.each(function () {
          var e;
          e = n.inArray(this, l[t]);
          return i(o, e, l[t]);
        });
        return this.pushStack(o);
      },
      _invoke: function (t, e) {
        t.each(function () {
          var t;
          t = l.getWaypointsByElement(this);
          return n.each(t, function (t, n) {
            n[e]();
            return true;
          });
        });
        return this;
      },
    };
    n.fn[g] = function () {
      var t, r;
      (r = arguments[0]), (t = 2 <= arguments.length ? e.call(arguments, 1) : []);
      if (d[r]) {
        return d[r].apply(this, t);
      } else if (n.isFunction(r)) {
        return d.init.apply(this, arguments);
      } else if (n.isPlainObject(r)) {
        return d.init.apply(this, [null, r]);
      } else if (!r) {
        return n.error('jQuery Waypoints needs a callback function or handler option.');
      } else {
        return n.error('The ' + r + ' method does not exist in jQuery Waypoints.');
      }
    };
    n.fn[g].defaults = { context: r, continuous: true, enabled: true, horizontal: false, offset: 0, triggerOnce: false };
    h = {
      refresh: function () {
        return n.each(a, function (t, e) {
          return e.refresh();
        });
      },
      viewportHeight: function () {
        var t;
        return (t = r.innerHeight) != null ? t : i.height();
      },
      aggregate: function (t) {
        var e, r, i;
        e = s;
        if (t) {
          e = (i = a[n(t).data(u)]) != null ? i.waypoints : void 0;
        }
        if (!e) {
          return [];
        }
        r = { horizontal: [], vertical: [] };
        n.each(r, function (t, i) {
          n.each(e[t], function (t, e) {
            return i.push(e);
          });
          i.sort(function (t, e) {
            return t.offset - e.offset;
          });
          r[t] = n.map(i, function (t) {
            return t.element;
          });
          return (r[t] = n.unique(r[t]));
        });
        return r;
      },
      above: function (t) {
        if (t == null) {
          t = r;
        }
        return h._filter(t, 'vertical', function (t, e) {
          return e.offset <= t.oldScroll.y;
        });
      },
      below: function (t) {
        if (t == null) {
          t = r;
        }
        return h._filter(t, 'vertical', function (t, e) {
          return e.offset > t.oldScroll.y;
        });
      },
      left: function (t) {
        if (t == null) {
          t = r;
        }
        return h._filter(t, 'horizontal', function (t, e) {
          return e.offset <= t.oldScroll.x;
        });
      },
      right: function (t) {
        if (t == null) {
          t = r;
        }
        return h._filter(t, 'horizontal', function (t, e) {
          return e.offset > t.oldScroll.x;
        });
      },
      enable: function () {
        return h._invoke('enable');
      },
      disable: function () {
        return h._invoke('disable');
      },
      destroy: function () {
        return h._invoke('destroy');
      },
      extendFn: function (t, e) {
        return (d[t] = e);
      },
      _invoke: function (t) {
        var e;
        e = n.extend({}, s.vertical, s.horizontal);
        return n.each(e, function (e, n) {
          n[t]();
          return true;
        });
      },
      _filter: function (t, e, r) {
        var i, o;
        i = a[n(t).data(u)];
        if (!i) {
          return [];
        }
        o = [];
        n.each(i.waypoints[e], function (t, e) {
          if (r(i, e)) {
            return o.push(e);
          }
        });
        o.sort(function (t, e) {
          return t.offset - e.offset;
        });
        return n.map(o, function (t) {
          return t.element;
        });
      },
    };
    n[m] = function () {
      var t, n;
      (n = arguments[0]), (t = 2 <= arguments.length ? e.call(arguments, 1) : []);
      if (h[n]) {
        return h[n].apply(null, t);
      } else {
        return h.aggregate.call(null, n);
      }
    };
    n[m].settings = { resizeThrottle: 100, scrollThrottle: 30 };
    return i.load(function () {
      return n[m]('refresh');
    });
  });
}.call(this));
/*!
 * jquery.counterup.js 1.0
 *
 * Copyright 2013, Benjamin Intal http://gambit.ph @bfintal
 * Released under the GPL v2 License
 *
 * Date: Nov 26, 2013
 */
(function (e) {
  'use strict';
  e.fn.counterUp = function (t) {
    var n = e.extend({ time: 400, delay: 10 }, t);
    return this.each(function () {
      var t = e(this),
        r = n,
        i = function () {
          var e = [],
            n = r.time / r.delay,
            i = t.text(),
            s = /[0-9]+,[0-9]+/.test(i);
          i = i.replace(/,/g, '');
          var o = /^[0-9]+$/.test(i),
            u = /^[0-9]+\.[0-9]+$/.test(i),
            a = u ? (i.split('.')[1] || []).length : 0;
          for (var f = n; f >= 1; f--) {
            var l = parseInt((i / n) * f);
            u && (l = parseFloat((i / n) * f).toFixed(a));
            if (s) while (/(\d+)(\d{3})/.test(l.toString())) l = l.toString().replace(/(\d+)(\d{3})/, '$1,$2');
            e.unshift(l);
          }
          t.data('counterup-nums', e);
          t.text('0');
          var c = function () {
            t.text(t.data('counterup-nums').shift());
            if (t.data('counterup-nums').length) setTimeout(t.data('counterup-func'), r.delay);
            else {
              delete t.data('counterup-nums');
              t.data('counterup-nums', null);
              t.data('counterup-func', null);
            }
          };
          t.data('counterup-func', c);
          setTimeout(t.data('counterup-func'), r.delay);
        };
      t.waypoint(i, { offset: '100%', triggerOnce: !0 });
    });
  };
})(jQuery);

/*
 * jquery.gmap
 * Version 2.1.5 2013-10-30
 * @requires jQuery >= 1.6.1 or later
 *
 * Homepage: http://labs.mario.ec/jquery-gmap/
 * Author: Mario Estrada <me@mario.ec>
 * License: MIT
 */
!(function (a) {
  (a.fn.gMap = function (b, c) {
    switch (b) {
      case 'addMarker':
        return a(this).trigger('gMap.addMarker', [c.latitude, c.longitude, c.content, c.icon, c.popup]);
      case 'centerAt':
        return a(this).trigger('gMap.centerAt', [c.latitude, c.longitude, c.zoom]);
      case 'clearMarkers':
        return a(this).trigger('gMap.clearMarkers');
    }
    var d = a.extend({}, a.fn.gMap.defaults, b);
    return this.each(function () {
      var b = new google.maps.Map(this);
      a(this).data('gMap.reference', b);
      var c = new google.maps.Geocoder();
      d.address
        ? c.geocode({ address: d.address }, function (a) {
            a && a.length && b.setCenter(a[0].geometry.location);
          })
        : d.latitude && d.longitude
        ? b.setCenter(new google.maps.LatLng(d.latitude, d.longitude))
        : a.isArray(d.markers) && d.markers.length > 0
        ? d.markers[0].address
          ? c.geocode({ address: d.markers[0].address }, function (a) {
              a && a.length > 0 && b.setCenter(a[0].geometry.location);
            })
          : b.setCenter(new google.maps.LatLng(d.markers[0].latitude, d.markers[0].longitude))
        : b.setCenter(new google.maps.LatLng(34.885931, 9.84375)),
        b.setZoom(d.zoom),
        b.setMapTypeId(google.maps.MapTypeId[d.maptype]);
      var e = { scrollwheel: d.scrollwheel, disableDoubleClickZoom: !d.doubleclickzoom };
      d.controls === !1 ? a.extend(e, { disableDefaultUI: !0 }) : 0 !== d.controls.length && a.extend(e, d.controls, { disableDefaultUI: !0 }), b.setOptions(e);
      var f,
        g,
        h = new google.maps.Marker();
      (f = new google.maps.MarkerImage(d.icon.image)),
        (f.size = new google.maps.Size(d.icon.iconsize[0], d.icon.iconsize[1])),
        (f.anchor = new google.maps.Point(d.icon.iconanchor[0], d.icon.iconanchor[1])),
        h.setIcon(f),
        d.icon.shadow &&
          ((g = new google.maps.MarkerImage(d.icon.shadow)), (g.size = new google.maps.Size(d.icon.shadowsize[0], d.icon.shadowsize[1])), (g.anchor = new google.maps.Point(d.icon.shadowanchor[0], d.icon.shadowanchor[1])), h.setShadow(g)),
        a(this).bind('gMap.centerAt', function (a, c, d, e) {
          e && b.setZoom(e), b.panTo(new google.maps.LatLng(parseFloat(c), parseFloat(d)));
        });
      var i = [];
      a(this).bind('gMap.clearMarkers', function () {
        for (; i[0]; ) i.pop().setMap(null);
      });
      var j;
      a(this).bind('gMap.addMarker', function (a, c, e, f, g, k) {
        var l,
          m,
          n = new google.maps.LatLng(parseFloat(c), parseFloat(e)),
          o = new google.maps.Marker({ position: n });
        if (
          (g
            ? ((l = new google.maps.MarkerImage(g.image)),
              (l.size = new google.maps.Size(g.iconsize[0], g.iconsize[1])),
              (l.anchor = new google.maps.Point(g.iconanchor[0], g.iconanchor[1])),
              o.setIcon(l),
              g.shadow && ((m = new google.maps.MarkerImage(g.shadow)), (m.size = new google.maps.Size(g.shadowsize[0], g.shadowsize[1])), (m.anchor = new google.maps.Point(g.shadowanchor[0], g.shadowanchor[1])), h.setShadow(m)))
            : (o.setIcon(h.getIcon()), o.setShadow(h.getShadow())),
          f)
        ) {
          '_latlng' === f && (f = c + ', ' + e);
          var p = new google.maps.InfoWindow({ content: d.html_prepend + f + d.html_append });
          google.maps.event.addListener(o, 'click', function () {
            j && j.close(), p.open(b, o), (j = p);
          }),
            k &&
              google.maps.event.addListenerOnce(b, 'tilesloaded', function () {
                p.open(b, o);
              });
        }
        o.setMap(b), i.push(o);
      });
      for (
        var k,
          l = this,
          m = function (b) {
            return function (c) {
              c && c.length > 0 && a(l).trigger('gMap.addMarker', [c[0].geometry.location.lat(), c[0].geometry.location.lng(), b.html, b.icon, b.popup]);
            };
          },
          n = 0;
        n < d.markers.length;
        n++
      )
        (k = d.markers[n]), k.address ? ('_address' === k.html && (k.html = k.address), c.geocode({ address: k.address }, m(k))) : a(this).trigger('gMap.addMarker', [k.latitude, k.longitude, k.html, k.icon, k.popup]);
    });
  }),
    (a.fn.gMap.defaults = {
      address: '',
      latitude: 0,
      longitude: 0,
      zoom: 1,
      markers: [],
      controls: [],
      scrollwheel: !1,
      doubleclickzoom: !0,
      maptype: 'ROADMAP',
      html_prepend: '<div class="gmap_marker">',
      html_append: '</div>',
      icon: { image: 'http://www.google.com/mapfiles/marker.png', shadow: 'http://www.google.com/mapfiles/shadow50.png', iconsize: [20, 34], shadowsize: [37, 34], iconanchor: [9, 34], shadowanchor: [6, 34] },
    });
})(jQuery);

/*! Magnific Popup - v0.9.9 - 2013-12-27
 * http://dimsemenov.com/plugins/magnific-popup/
 * Copyright (c) 2013 Dmitry Semenov; */
(function (e) {
  var t,
    n,
    i,
    o,
    r,
    a,
    s,
    l = 'Close',
    c = 'BeforeClose',
    d = 'AfterClose',
    u = 'BeforeAppend',
    p = 'MarkupParse',
    f = 'Open',
    m = 'Change',
    g = 'mfp',
    h = '.' + g,
    v = 'mfp-ready',
    C = 'mfp-removing',
    y = 'mfp-prevent-close',
    w = function () {},
    b = !!window.jQuery,
    I = e(window),
    x = function (e, n) {
      t.ev.on(g + e + h, n);
    },
    k = function (t, n, i, o) {
      var r = document.createElement('div');
      return (r.className = 'mfp-' + t), i && (r.innerHTML = i), o ? n && n.appendChild(r) : ((r = e(r)), n && r.appendTo(n)), r;
    },
    T = function (n, i) {
      t.ev.triggerHandler(g + n, i), t.st.callbacks && ((n = n.charAt(0).toLowerCase() + n.slice(1)), t.st.callbacks[n] && t.st.callbacks[n].apply(t, e.isArray(i) ? i : [i]));
    },
    E = function (n) {
      return (n === s && t.currTemplate.closeBtn) || ((t.currTemplate.closeBtn = e(t.st.closeMarkup.replace('%title%', t.st.tClose))), (s = n)), t.currTemplate.closeBtn;
    },
    _ = function () {
      e.magnificPopup.instance || ((t = new w()), t.init(), (e.magnificPopup.instance = t));
    },
    S = function () {
      var e = document.createElement('p').style,
        t = ['ms', 'O', 'Moz', 'Webkit'];
      if (void 0 !== e.transition) return !0;
      for (; t.length; ) if (t.pop() + 'Transition' in e) return !0;
      return !1;
    };
  (w.prototype = {
    constructor: w,
    init: function () {
      var n = navigator.appVersion;
      (t.isIE7 = -1 !== n.indexOf('MSIE 7.')),
        (t.isIE8 = -1 !== n.indexOf('MSIE 8.')),
        (t.isLowIE = t.isIE7 || t.isIE8),
        (t.isAndroid = /android/gi.test(n)),
        (t.isIOS = /iphone|ipad|ipod/gi.test(n)),
        (t.supportsTransition = S()),
        (t.probablyMobile = t.isAndroid || t.isIOS || /(Opera Mini)|Kindle|webOS|BlackBerry|(Opera Mobi)|(Windows Phone)|IEMobile/i.test(navigator.userAgent)),
        (o = e(document)),
        (t.popupsCache = {});
    },
    open: function (n) {
      i || (i = e(document.body));
      var r;
      if (n.isObj === !1) {
        (t.items = n.items.toArray()), (t.index = 0);
        var s,
          l = n.items;
        for (r = 0; l.length > r; r++)
          if (((s = l[r]), s.parsed && (s = s.el[0]), s === n.el[0])) {
            t.index = r;
            break;
          }
      } else (t.items = e.isArray(n.items) ? n.items : [n.items]), (t.index = n.index || 0);
      if (t.isOpen) return t.updateItemHTML(), void 0;
      (t.types = []),
        (a = ''),
        (t.ev = n.mainEl && n.mainEl.length ? n.mainEl.eq(0) : o),
        n.key ? (t.popupsCache[n.key] || (t.popupsCache[n.key] = {}), (t.currTemplate = t.popupsCache[n.key])) : (t.currTemplate = {}),
        (t.st = e.extend(!0, {}, e.magnificPopup.defaults, n)),
        (t.fixedContentPos = 'auto' === t.st.fixedContentPos ? !t.probablyMobile : t.st.fixedContentPos),
        t.st.modal && ((t.st.closeOnContentClick = !1), (t.st.closeOnBgClick = !1), (t.st.showCloseBtn = !1), (t.st.enableEscapeKey = !1)),
        t.bgOverlay ||
          ((t.bgOverlay = k('bg').on('click' + h, function () {
            t.close();
          })),
          (t.wrap = k('wrap')
            .attr('tabindex', -1)
            .on('click' + h, function (e) {
              t._checkIfClose(e.target) && t.close();
            })),
          (t.container = k('container', t.wrap))),
        (t.contentContainer = k('content')),
        t.st.preloader && (t.preloader = k('preloader', t.container, t.st.tLoading));
      var c = e.magnificPopup.modules;
      for (r = 0; c.length > r; r++) {
        var d = c[r];
        (d = d.charAt(0).toUpperCase() + d.slice(1)), t['init' + d].call(t);
      }
      T('BeforeOpen'),
        t.st.showCloseBtn &&
          (t.st.closeBtnInside
            ? (x(p, function (e, t, n, i) {
                n.close_replaceWith = E(i.type);
              }),
              (a += ' mfp-close-btn-in'))
            : t.wrap.append(E())),
        t.st.alignTop && (a += ' mfp-align-top'),
        t.fixedContentPos ? t.wrap.css({ overflow: t.st.overflowY, overflowX: 'hidden', overflowY: t.st.overflowY }) : t.wrap.css({ top: I.scrollTop(), position: 'absolute' }),
        (t.st.fixedBgPos === !1 || ('auto' === t.st.fixedBgPos && !t.fixedContentPos)) && t.bgOverlay.css({ height: o.height(), position: 'absolute' }),
        t.st.enableEscapeKey &&
          o.on('keyup' + h, function (e) {
            27 === e.keyCode && t.close();
          }),
        I.on('resize' + h, function () {
          t.updateSize();
        }),
        t.st.closeOnContentClick || (a += ' mfp-auto-cursor'),
        a && t.wrap.addClass(a);
      var u = (t.wH = I.height()),
        m = {};
      if (t.fixedContentPos && t._hasScrollBar(u)) {
        var g = t._getScrollbarSize();
        g && (m.marginRight = g);
      }
      t.fixedContentPos && (t.isIE7 ? e('body, html').css('overflow', 'hidden') : (m.overflow = 'hidden'));
      var C = t.st.mainClass;
      return (
        t.isIE7 && (C += ' mfp-ie7'),
        C && t._addClassToMFP(C),
        t.updateItemHTML(),
        T('BuildControls'),
        e('html').css(m),
        t.bgOverlay.add(t.wrap).prependTo(t.st.prependTo || i),
        (t._lastFocusedEl = document.activeElement),
        setTimeout(function () {
          t.content ? (t._addClassToMFP(v), t._setFocus()) : t.bgOverlay.addClass(v), o.on('focusin' + h, t._onFocusIn);
        }, 16),
        (t.isOpen = !0),
        t.updateSize(u),
        T(f),
        n
      );
    },
    close: function () {
      t.isOpen &&
        (T(c),
        (t.isOpen = !1),
        t.st.removalDelay && !t.isLowIE && t.supportsTransition
          ? (t._addClassToMFP(C),
            setTimeout(function () {
              t._close();
            }, t.st.removalDelay))
          : t._close());
    },
    _close: function () {
      T(l);
      var n = C + ' ' + v + ' ';
      if ((t.bgOverlay.detach(), t.wrap.detach(), t.container.empty(), t.st.mainClass && (n += t.st.mainClass + ' '), t._removeClassFromMFP(n), t.fixedContentPos)) {
        var i = { marginRight: '' };
        t.isIE7 ? e('body, html').css('overflow', '') : (i.overflow = ''), e('html').css(i);
      }
      o.off('keyup' + h + ' focusin' + h),
        t.ev.off(h),
        t.wrap.attr('class', 'mfp-wrap').removeAttr('style'),
        t.bgOverlay.attr('class', 'mfp-bg'),
        t.container.attr('class', 'mfp-container'),
        !t.st.showCloseBtn || (t.st.closeBtnInside && t.currTemplate[t.currItem.type] !== !0) || (t.currTemplate.closeBtn && t.currTemplate.closeBtn.detach()),
        t._lastFocusedEl && e(t._lastFocusedEl).focus(),
        (t.currItem = null),
        (t.content = null),
        (t.currTemplate = null),
        (t.prevHeight = 0),
        T(d);
    },
    updateSize: function (e) {
      if (t.isIOS) {
        var n = document.documentElement.clientWidth / window.innerWidth,
          i = window.innerHeight * n;
        t.wrap.css('height', i), (t.wH = i);
      } else t.wH = e || I.height();
      t.fixedContentPos || t.wrap.css('height', t.wH), T('Resize');
    },
    updateItemHTML: function () {
      var n = t.items[t.index];
      t.contentContainer.detach(), t.content && t.content.detach(), n.parsed || (n = t.parseEl(t.index));
      var i = n.type;
      if ((T('BeforeChange', [t.currItem ? t.currItem.type : '', i]), (t.currItem = n), !t.currTemplate[i])) {
        var o = t.st[i] ? t.st[i].markup : !1;
        T('FirstMarkupParse', o), (t.currTemplate[i] = o ? e(o) : !0);
      }
      r && r !== n.type && t.container.removeClass('mfp-' + r + '-holder');
      var a = t['get' + i.charAt(0).toUpperCase() + i.slice(1)](n, t.currTemplate[i]);
      t.appendContent(a, i), (n.preloaded = !0), T(m, n), (r = n.type), t.container.prepend(t.contentContainer), T('AfterChange');
    },
    appendContent: function (e, n) {
      (t.content = e),
        e ? (t.st.showCloseBtn && t.st.closeBtnInside && t.currTemplate[n] === !0 ? t.content.find('.mfp-close').length || t.content.append(E()) : (t.content = e)) : (t.content = ''),
        T(u),
        t.container.addClass('mfp-' + n + '-holder'),
        t.contentContainer.append(t.content);
    },
    parseEl: function (n) {
      var i,
        o = t.items[n];
      if ((o.tagName ? (o = { el: e(o) }) : ((i = o.type), (o = { data: o, src: o.src })), o.el)) {
        for (var r = t.types, a = 0; r.length > a; a++)
          if (o.el.hasClass('mfp-' + r[a])) {
            i = r[a];
            break;
          }
        (o.src = o.el.attr('data-mfp-src')), o.src || (o.src = o.el.attr('href'));
      }
      return (o.type = i || t.st.type || 'inline'), (o.index = n), (o.parsed = !0), (t.items[n] = o), T('ElementParse', o), t.items[n];
    },
    addGroup: function (e, n) {
      var i = function (i) {
        (i.mfpEl = this), t._openClick(i, e, n);
      };
      n || (n = {});
      var o = 'click.magnificPopup';
      (n.mainEl = e), n.items ? ((n.isObj = !0), e.off(o).on(o, i)) : ((n.isObj = !1), n.delegate ? e.off(o).on(o, n.delegate, i) : ((n.items = e), e.off(o).on(o, i)));
    },
    _openClick: function (n, i, o) {
      var r = void 0 !== o.midClick ? o.midClick : e.magnificPopup.defaults.midClick;
      if (r || (2 !== n.which && !n.ctrlKey && !n.metaKey)) {
        var a = void 0 !== o.disableOn ? o.disableOn : e.magnificPopup.defaults.disableOn;
        if (a)
          if (e.isFunction(a)) {
            if (!a.call(t)) return !0;
          } else if (a > I.width()) return !0;
        n.type && (n.preventDefault(), t.isOpen && n.stopPropagation()), (o.el = e(n.mfpEl)), o.delegate && (o.items = i.find(o.delegate)), t.open(o);
      }
    },
    updateStatus: function (e, i) {
      if (t.preloader) {
        n !== e && t.container.removeClass('mfp-s-' + n), i || 'loading' !== e || (i = t.st.tLoading);
        var o = { status: e, text: i };
        T('UpdateStatus', o),
          (e = o.status),
          (i = o.text),
          t.preloader.html(i),
          t.preloader.find('a').on('click', function (e) {
            e.stopImmediatePropagation();
          }),
          t.container.addClass('mfp-s-' + e),
          (n = e);
      }
    },
    _checkIfClose: function (n) {
      if (!e(n).hasClass(y)) {
        var i = t.st.closeOnContentClick,
          o = t.st.closeOnBgClick;
        if (i && o) return !0;
        if (!t.content || e(n).hasClass('mfp-close') || (t.preloader && n === t.preloader[0])) return !0;
        if (n === t.content[0] || e.contains(t.content[0], n)) {
          if (i) return !0;
        } else if (o && e.contains(document, n)) return !0;
        return !1;
      }
    },
    _addClassToMFP: function (e) {
      t.bgOverlay.addClass(e), t.wrap.addClass(e);
    },
    _removeClassFromMFP: function (e) {
      this.bgOverlay.removeClass(e), t.wrap.removeClass(e);
    },
    _hasScrollBar: function (e) {
      return (t.isIE7 ? o.height() : document.body.scrollHeight) > (e || I.height());
    },
    _setFocus: function () {
      (t.st.focus ? t.content.find(t.st.focus).eq(0) : t.wrap).focus();
    },
    _onFocusIn: function (n) {
      return n.target === t.wrap[0] || e.contains(t.wrap[0], n.target) ? void 0 : (t._setFocus(), !1);
    },
    _parseMarkup: function (t, n, i) {
      var o;
      i.data && (n = e.extend(i.data, n)),
        T(p, [t, n, i]),
        e.each(n, function (e, n) {
          if (void 0 === n || n === !1) return !0;
          if (((o = e.split('_')), o.length > 1)) {
            var i = t.find(h + '-' + o[0]);
            if (i.length > 0) {
              var r = o[1];
              'replaceWith' === r ? i[0] !== n[0] && i.replaceWith(n) : 'img' === r ? (i.is('img') ? i.attr('src', n) : i.replaceWith('<img src="' + n + '" class="' + i.attr('class') + '" />')) : i.attr(o[1], n);
            }
          } else t.find(h + '-' + e).html(n);
        });
    },
    _getScrollbarSize: function () {
      if (void 0 === t.scrollbarSize) {
        var e = document.createElement('div');
        (e.id = 'mfp-sbm'), (e.style.cssText = 'width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;'), document.body.appendChild(e), (t.scrollbarSize = e.offsetWidth - e.clientWidth), document.body.removeChild(e);
      }
      return t.scrollbarSize;
    },
  }),
    (e.magnificPopup = {
      instance: null,
      proto: w.prototype,
      modules: [],
      open: function (t, n) {
        return _(), (t = t ? e.extend(!0, {}, t) : {}), (t.isObj = !0), (t.index = n || 0), this.instance.open(t);
      },
      close: function () {
        return e.magnificPopup.instance && e.magnificPopup.instance.close();
      },
      registerModule: function (t, n) {
        n.options && (e.magnificPopup.defaults[t] = n.options), e.extend(this.proto, n.proto), this.modules.push(t);
      },
      defaults: {
        disableOn: 0,
        key: null,
        midClick: !1,
        mainClass: '',
        preloader: !0,
        focus: '',
        closeOnContentClick: !1,
        closeOnBgClick: !0,
        closeBtnInside: !0,
        showCloseBtn: !0,
        enableEscapeKey: !0,
        modal: !1,
        alignTop: !1,
        removalDelay: 0,
        prependTo: null,
        fixedContentPos: 'auto',
        fixedBgPos: 'auto',
        overflowY: 'auto',
        closeMarkup: '<button title="%title%" type="button" class="mfp-close">&times;</button>',
        tClose: 'Close (Esc)',
        tLoading: 'Loading...',
      },
    }),
    (e.fn.magnificPopup = function (n) {
      _();
      var i = e(this);
      if ('string' == typeof n)
        if ('open' === n) {
          var o,
            r = b ? i.data('magnificPopup') : i[0].magnificPopup,
            a = parseInt(arguments[1], 10) || 0;
          r.items ? (o = r.items[a]) : ((o = i), r.delegate && (o = o.find(r.delegate)), (o = o.eq(a))), t._openClick({ mfpEl: o }, i, r);
        } else t.isOpen && t[n].apply(t, Array.prototype.slice.call(arguments, 1));
      else (n = e.extend(!0, {}, n)), b ? i.data('magnificPopup', n) : (i[0].magnificPopup = n), t.addGroup(i, n);
      return i;
    });
  var P,
    O,
    z,
    M = 'inline',
    B = function () {
      z && (O.after(z.addClass(P)).detach(), (z = null));
    };
  e.magnificPopup.registerModule(M, {
    options: { hiddenClass: 'hide', markup: '', tNotFound: 'Content not found' },
    proto: {
      initInline: function () {
        t.types.push(M),
          x(l + '.' + M, function () {
            B();
          });
      },
      getInline: function (n, i) {
        if ((B(), n.src)) {
          var o = t.st.inline,
            r = e(n.src);
          if (r.length) {
            var a = r[0].parentNode;
            a && a.tagName && (O || ((P = o.hiddenClass), (O = k(P)), (P = 'mfp-' + P)), (z = r.after(O).detach().removeClass(P))), t.updateStatus('ready');
          } else t.updateStatus('error', o.tNotFound), (r = e('<div>'));
          return (n.inlineElement = r), r;
        }
        return t.updateStatus('ready'), t._parseMarkup(i, {}, n), i;
      },
    },
  });
  var F,
    H = 'ajax',
    L = function () {
      F && i.removeClass(F);
    },
    A = function () {
      L(), t.req && t.req.abort();
    };
  e.magnificPopup.registerModule(H, {
    options: { settings: null, cursor: 'mfp-ajax-cur', tError: '<a href="%url%">The content</a> could not be loaded.' },
    proto: {
      initAjax: function () {
        t.types.push(H), (F = t.st.ajax.cursor), x(l + '.' + H, A), x('BeforeChange.' + H, A);
      },
      getAjax: function (n) {
        F && i.addClass(F), t.updateStatus('loading');
        var o = e.extend(
          {
            url: n.src,
            success: function (i, o, r) {
              var a = { data: i, xhr: r };
              T('ParseAjax', a),
                t.appendContent(e(a.data), H),
                (n.finished = !0),
                L(),
                t._setFocus(),
                setTimeout(function () {
                  t.wrap.addClass(v);
                }, 16),
                t.updateStatus('ready'),
                T('AjaxContentAdded');
            },
            error: function () {
              L(), (n.finished = n.loadError = !0), t.updateStatus('error', t.st.ajax.tError.replace('%url%', n.src));
            },
          },
          t.st.ajax.settings
        );
        return (t.req = e.ajax(o)), '';
      },
    },
  });
  var j,
    N = function (n) {
      if (n.data && void 0 !== n.data.title) return n.data.title;
      var i = t.st.image.titleSrc;
      if (i) {
        if (e.isFunction(i)) return i.call(t, n);
        if (n.el) return n.el.attr(i) || '';
      }
      return '';
    };
  e.magnificPopup.registerModule('image', {
    options: {
      markup: '<div class="mfp-figure"><div class="mfp-close"></div><figure><div class="mfp-img"></div><figcaption><div class="mfp-bottom-bar"><div class="mfp-title"></div><div class="mfp-counter"></div></div></figcaption></figure></div>',
      cursor: 'mfp-zoom-out-cur',
      titleSrc: 'title',
      verticalFit: !0,
      tError: '<a href="%url%">The image</a> could not be loaded.',
    },
    proto: {
      initImage: function () {
        var e = t.st.image,
          n = '.image';
        t.types.push('image'),
          x(f + n, function () {
            'image' === t.currItem.type && e.cursor && i.addClass(e.cursor);
          }),
          x(l + n, function () {
            e.cursor && i.removeClass(e.cursor), I.off('resize' + h);
          }),
          x('Resize' + n, t.resizeImage),
          t.isLowIE && x('AfterChange', t.resizeImage);
      },
      resizeImage: function () {
        var e = t.currItem;
        if (e && e.img && t.st.image.verticalFit) {
          var n = 0;
          t.isLowIE && (n = parseInt(e.img.css('padding-top'), 10) + parseInt(e.img.css('padding-bottom'), 10)), e.img.css('max-height', t.wH - n);
        }
      },
      _onImageHasSize: function (e) {
        e.img && ((e.hasSize = !0), j && clearInterval(j), (e.isCheckingImgSize = !1), T('ImageHasSize', e), e.imgHidden && (t.content && t.content.removeClass('mfp-loading'), (e.imgHidden = !1)));
      },
      findImageSize: function (e) {
        var n = 0,
          i = e.img[0],
          o = function (r) {
            j && clearInterval(j),
              (j = setInterval(function () {
                return i.naturalWidth > 0 ? (t._onImageHasSize(e), void 0) : (n > 200 && clearInterval(j), n++, 3 === n ? o(10) : 40 === n ? o(50) : 100 === n && o(500), void 0);
              }, r));
          };
        o(1);
      },
      getImage: function (n, i) {
        var o = 0,
          r = function () {
            n && (n.img[0].complete ? (n.img.off('.mfploader'), n === t.currItem && (t._onImageHasSize(n), t.updateStatus('ready')), (n.hasSize = !0), (n.loaded = !0), T('ImageLoadComplete')) : (o++, 200 > o ? setTimeout(r, 100) : a()));
          },
          a = function () {
            n && (n.img.off('.mfploader'), n === t.currItem && (t._onImageHasSize(n), t.updateStatus('error', s.tError.replace('%url%', n.src))), (n.hasSize = !0), (n.loaded = !0), (n.loadError = !0));
          },
          s = t.st.image,
          l = i.find('.mfp-img');
        if (l.length) {
          var c = document.createElement('img');
          (c.className = 'mfp-img'),
            (n.img = e(c).on('load.mfploader', r).on('error.mfploader', a)),
            (c.src = n.src),
            l.is('img') && (n.img = n.img.clone()),
            (c = n.img[0]),
            c.naturalWidth > 0 ? (n.hasSize = !0) : c.width || (n.hasSize = !1);
        }
        return (
          t._parseMarkup(i, { title: N(n), img_replaceWith: n.img }, n),
          t.resizeImage(),
          n.hasSize
            ? (j && clearInterval(j), n.loadError ? (i.addClass('mfp-loading'), t.updateStatus('error', s.tError.replace('%url%', n.src))) : (i.removeClass('mfp-loading'), t.updateStatus('ready')), i)
            : (t.updateStatus('loading'), (n.loading = !0), n.hasSize || ((n.imgHidden = !0), i.addClass('mfp-loading'), t.findImageSize(n)), i)
        );
      },
    },
  });
  var W,
    R = function () {
      return void 0 === W && (W = void 0 !== document.createElement('p').style.MozTransform), W;
    };
  e.magnificPopup.registerModule('zoom', {
    options: {
      enabled: !1,
      easing: 'ease-in-out',
      duration: 300,
      opener: function (e) {
        return e.is('img') ? e : e.find('img');
      },
    },
    proto: {
      initZoom: function () {
        var e,
          n = t.st.zoom,
          i = '.zoom';
        if (n.enabled && t.supportsTransition) {
          var o,
            r,
            a = n.duration,
            s = function (e) {
              var t = e.clone().removeAttr('style').removeAttr('class').addClass('mfp-animated-image'),
                i = 'all ' + n.duration / 1e3 + 's ' + n.easing,
                o = { position: 'fixed', zIndex: 9999, left: 0, top: 0, '-webkit-backface-visibility': 'hidden' },
                r = 'transition';
              return (o['-webkit-' + r] = o['-moz-' + r] = o['-o-' + r] = o[r] = i), t.css(o), t;
            },
            d = function () {
              t.content.css('visibility', 'visible');
            };
          x('BuildControls' + i, function () {
            if (t._allowZoom()) {
              if ((clearTimeout(o), t.content.css('visibility', 'hidden'), (e = t._getItemToZoom()), !e)) return d(), void 0;
              (r = s(e)),
                r.css(t._getOffset()),
                t.wrap.append(r),
                (o = setTimeout(function () {
                  r.css(t._getOffset(!0)),
                    (o = setTimeout(function () {
                      d(),
                        setTimeout(function () {
                          r.remove(), (e = r = null), T('ZoomAnimationEnded');
                        }, 16);
                    }, a));
                }, 16));
            }
          }),
            x(c + i, function () {
              if (t._allowZoom()) {
                if ((clearTimeout(o), (t.st.removalDelay = a), !e)) {
                  if (((e = t._getItemToZoom()), !e)) return;
                  r = s(e);
                }
                r.css(t._getOffset(!0)),
                  t.wrap.append(r),
                  t.content.css('visibility', 'hidden'),
                  setTimeout(function () {
                    r.css(t._getOffset());
                  }, 16);
              }
            }),
            x(l + i, function () {
              t._allowZoom() && (d(), r && r.remove(), (e = null));
            });
        }
      },
      _allowZoom: function () {
        return 'image' === t.currItem.type;
      },
      _getItemToZoom: function () {
        return t.currItem.hasSize ? t.currItem.img : !1;
      },
      _getOffset: function (n) {
        var i;
        i = n ? t.currItem.img : t.st.zoom.opener(t.currItem.el || t.currItem);
        var o = i.offset(),
          r = parseInt(i.css('padding-top'), 10),
          a = parseInt(i.css('padding-bottom'), 10);
        o.top -= e(window).scrollTop() - r;
        var s = { width: i.width(), height: (b ? i.innerHeight() : i[0].offsetHeight) - a - r };
        return R() ? (s['-moz-transform'] = s.transform = 'translate(' + o.left + 'px,' + o.top + 'px)') : ((s.left = o.left), (s.top = o.top)), s;
      },
    },
  });
  var Z = 'iframe',
    q = '//about:blank',
    D = function (e) {
      if (t.currTemplate[Z]) {
        var n = t.currTemplate[Z].find('iframe');
        n.length && (e || (n[0].src = q), t.isIE8 && n.css('display', e ? 'block' : 'none'));
      }
    };
  e.magnificPopup.registerModule(Z, {
    options: {
      markup: '<div class="mfp-iframe-scaler"><div class="mfp-close"></div><iframe class="mfp-iframe" src="//about:blank" frameborder="0" allowfullscreen></iframe></div>',
      srcAction: 'iframe_src',
      patterns: {
        youtube: { index: 'youtube.com', id: 'v=', src: '//www.youtube.com/embed/%id%?autoplay=1' },
        vimeo: { index: 'vimeo.com/', id: '/', src: '//player.vimeo.com/video/%id%?autoplay=1' },
        gmaps: { index: '//maps.google.', src: '%id%&output=embed' },
      },
    },
    proto: {
      initIframe: function () {
        t.types.push(Z),
          x('BeforeChange', function (e, t, n) {
            t !== n && (t === Z ? D() : n === Z && D(!0));
          }),
          x(l + '.' + Z, function () {
            D();
          });
      },
      getIframe: function (n, i) {
        var o = n.src,
          r = t.st.iframe;
        e.each(r.patterns, function () {
          return o.indexOf(this.index) > -1 ? (this.id && (o = 'string' == typeof this.id ? o.substr(o.lastIndexOf(this.id) + this.id.length, o.length) : this.id.call(this, o)), (o = this.src.replace('%id%', o)), !1) : void 0;
        });
        var a = {};
        return r.srcAction && (a[r.srcAction] = o), t._parseMarkup(i, a, n), t.updateStatus('ready'), i;
      },
    },
  });
  var K = function (e) {
      var n = t.items.length;
      return e > n - 1 ? e - n : 0 > e ? n + e : e;
    },
    Y = function (e, t, n) {
      return e.replace(/%curr%/gi, t + 1).replace(/%total%/gi, n);
    };
  e.magnificPopup.registerModule('gallery', {
    options: {
      enabled: !1,
      arrowMarkup: '<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"></button>',
      preload: [0, 2],
      navigateByImgClick: !0,
      arrows: !0,
      tPrev: 'Previous (Left arrow key)',
      tNext: 'Next (Right arrow key)',
      tCounter: '%curr% of %total%',
    },
    proto: {
      initGallery: function () {
        var n = t.st.gallery,
          i = '.mfp-gallery',
          r = Boolean(e.fn.mfpFastClick);
        return (
          (t.direction = !0),
          n && n.enabled
            ? ((a += ' mfp-gallery'),
              x(f + i, function () {
                n.navigateByImgClick &&
                  t.wrap.on('click' + i, '.mfp-img', function () {
                    return t.items.length > 1 ? (t.next(), !1) : void 0;
                  }),
                  o.on('keydown' + i, function (e) {
                    37 === e.keyCode ? t.prev() : 39 === e.keyCode && t.next();
                  });
              }),
              x('UpdateStatus' + i, function (e, n) {
                n.text && (n.text = Y(n.text, t.currItem.index, t.items.length));
              }),
              x(p + i, function (e, i, o, r) {
                var a = t.items.length;
                o.counter = a > 1 ? Y(n.tCounter, r.index, a) : '';
              }),
              x('BuildControls' + i, function () {
                if (t.items.length > 1 && n.arrows && !t.arrowLeft) {
                  var i = n.arrowMarkup,
                    o = (t.arrowLeft = e(i.replace(/%title%/gi, n.tPrev).replace(/%dir%/gi, 'left')).addClass(y)),
                    a = (t.arrowRight = e(i.replace(/%title%/gi, n.tNext).replace(/%dir%/gi, 'right')).addClass(y)),
                    s = r ? 'mfpFastClick' : 'click';
                  o[s](function () {
                    t.prev();
                  }),
                    a[s](function () {
                      t.next();
                    }),
                    t.isIE7 && (k('b', o[0], !1, !0), k('a', o[0], !1, !0), k('b', a[0], !1, !0), k('a', a[0], !1, !0)),
                    t.container.append(o.add(a));
                }
              }),
              x(m + i, function () {
                t._preloadTimeout && clearTimeout(t._preloadTimeout),
                  (t._preloadTimeout = setTimeout(function () {
                    t.preloadNearbyImages(), (t._preloadTimeout = null);
                  }, 16));
              }),
              x(l + i, function () {
                o.off(i), t.wrap.off('click' + i), t.arrowLeft && r && t.arrowLeft.add(t.arrowRight).destroyMfpFastClick(), (t.arrowRight = t.arrowLeft = null);
              }),
              void 0)
            : !1
        );
      },
      next: function () {
        (t.direction = !0), (t.index = K(t.index + 1)), t.updateItemHTML();
      },
      prev: function () {
        (t.direction = !1), (t.index = K(t.index - 1)), t.updateItemHTML();
      },
      goTo: function (e) {
        (t.direction = e >= t.index), (t.index = e), t.updateItemHTML();
      },
      preloadNearbyImages: function () {
        var e,
          n = t.st.gallery.preload,
          i = Math.min(n[0], t.items.length),
          o = Math.min(n[1], t.items.length);
        for (e = 1; (t.direction ? o : i) >= e; e++) t._preloadItem(t.index + e);
        for (e = 1; (t.direction ? i : o) >= e; e++) t._preloadItem(t.index - e);
      },
      _preloadItem: function (n) {
        if (((n = K(n)), !t.items[n].preloaded)) {
          var i = t.items[n];
          i.parsed || (i = t.parseEl(n)),
            T('LazyLoad', i),
            'image' === i.type &&
              (i.img = e('<img class="mfp-img" />')
                .on('load.mfploader', function () {
                  i.hasSize = !0;
                })
                .on('error.mfploader', function () {
                  (i.hasSize = !0), (i.loadError = !0), T('LazyLoadError', i);
                })
                .attr('src', i.src)),
            (i.preloaded = !0);
        }
      },
    },
  });
  var U = 'retina';
  e.magnificPopup.registerModule(U, {
    options: {
      replaceSrc: function (e) {
        return e.src.replace(/\.\w+$/, function (e) {
          return '@2x' + e;
        });
      },
      ratio: 1,
    },
    proto: {
      initRetina: function () {
        if (window.devicePixelRatio > 1) {
          var e = t.st.retina,
            n = e.ratio;
          (n = isNaN(n) ? n() : n),
            n > 1 &&
              (x('ImageHasSize.' + U, function (e, t) {
                t.img.css({ 'max-width': t.img[0].naturalWidth / n, width: '100%' });
              }),
              x('ElementParse.' + U, function (t, i) {
                i.src = e.replaceSrc(i, n);
              }));
        }
      },
    },
  }),
    (function () {
      var t = 1e3,
        n = 'ontouchstart' in window,
        i = function () {
          I.off('touchmove' + r + ' touchend' + r);
        },
        o = 'mfpFastClick',
        r = '.' + o;
      (e.fn.mfpFastClick = function (o) {
        return e(this).each(function () {
          var a,
            s = e(this);
          if (n) {
            var l, c, d, u, p, f;
            s.on('touchstart' + r, function (e) {
              (u = !1),
                (f = 1),
                (p = e.originalEvent ? e.originalEvent.touches[0] : e.touches[0]),
                (c = p.clientX),
                (d = p.clientY),
                I.on('touchmove' + r, function (e) {
                  (p = e.originalEvent ? e.originalEvent.touches : e.touches), (f = p.length), (p = p[0]), (Math.abs(p.clientX - c) > 10 || Math.abs(p.clientY - d) > 10) && ((u = !0), i());
                }).on('touchend' + r, function (e) {
                  i(),
                    u ||
                      f > 1 ||
                      ((a = !0),
                      e.preventDefault(),
                      clearTimeout(l),
                      (l = setTimeout(function () {
                        a = !1;
                      }, t)),
                      o());
                });
            });
          }
          s.on('click' + r, function () {
            a || o();
          });
        });
      }),
        (e.fn.destroyMfpFastClick = function () {
          e(this).off('touchstart' + r + ' click' + r), n && I.off('touchmove' + r + ' touchend' + r);
        });
    })(),
    _();
})(window.jQuery || window.Zepto);

/* jquery.nicescroll 3.5.4 InuYaksa*2013 MIT http://areaaperta.com/nicescroll */ (function (e) {
  'function' === typeof define && define.amd ? define(['jquery'], e) : e(jQuery);
})(function (e) {
  var y = !1,
    C = !1,
    J = 5e3,
    K = 2e3,
    x = 0,
    F = ['ms', 'moz', 'webkit', 'o'],
    s = window.requestAnimationFrame || !1,
    v = window.cancelAnimationFrame || !1;
  if (!s)
    for (var L in F) {
      var D = F[L];
      s || (s = window[D + 'RequestAnimationFrame']);
      v || (v = window[D + 'CancelAnimationFrame'] || window[D + 'CancelRequestAnimationFrame']);
    }
  var z = window.MutationObserver || window.WebKitMutationObserver || !1,
    G = {
      zindex: 'auto',
      cursoropacitymin: 0,
      cursoropacitymax: 1,
      cursorcolor: '#424242',
      cursorwidth: '5px',
      cursorborder: '1px solid #fff',
      cursorborderradius: '5px',
      scrollspeed: 60,
      mousescrollstep: 24,
      touchbehavior: !1,
      hwacceleration: !0,
      usetransition: !0,
      boxzoom: !1,
      dblclickzoom: !0,
      gesturezoom: !0,
      grabcursorenabled: !0,
      autohidemode: !0,
      background: '',
      iframeautoresize: !0,
      cursorminheight: 32,
      preservenativescrolling: !0,
      railoffset: !1,
      bouncescroll: !0,
      spacebarenabled: !0,
      railpadding: { top: 0, right: 0, left: 0, bottom: 0 },
      disableoutline: !0,
      horizrailenabled: !0,
      railalign: 'right',
      railvalign: 'bottom',
      enabletranslate3d: !0,
      enablemousewheel: !0,
      enablekeyboard: !0,
      smoothscroll: !0,
      sensitiverail: !0,
      enablemouselockapi: !0,
      cursorfixedheight: !1,
      directionlockdeadzone: 6,
      hidecursordelay: 400,
      nativeparentscrolling: !0,
      enablescrollonselection: !0,
      overflowx: !0,
      overflowy: !0,
      cursordragspeed: 0.3,
      rtlmode: 'auto',
      cursordragontouch: !1,
      oneaxismousemode: 'auto',
      scriptpath: (function () {
        var e = document.getElementsByTagName('script'),
          e = e[e.length - 1].src.split('?')[0];
        return 0 < e.split('/').length ? e.split('/').slice(0, -1).join('/') + '/' : '';
      })(),
    },
    E = !1,
    M = function () {
      if (E) return E;
      var e = document.createElement('DIV'),
        b = { haspointerlock: 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document };
      b.isopera = 'opera' in window;
      b.isopera12 = b.isopera && 'getUserMedia' in navigator;
      b.isoperamini = '[object OperaMini]' === Object.prototype.toString.call(window.operamini);
      b.isie = 'all' in document && 'attachEvent' in e && !b.isopera;
      b.isieold = b.isie && !('msInterpolationMode' in e.style);
      b.isie7 = b.isie && !b.isieold && (!('documentMode' in document) || 7 == document.documentMode);
      b.isie8 = b.isie && 'documentMode' in document && 8 == document.documentMode;
      b.isie9 = b.isie && 'performance' in window && 9 <= document.documentMode;
      b.isie10 = b.isie && 'performance' in window && 10 <= document.documentMode;
      b.isie9mobile = /iemobile.9/i.test(navigator.userAgent);
      b.isie9mobile && (b.isie9 = !1);
      b.isie7mobile = !b.isie9mobile && b.isie7 && /iemobile/i.test(navigator.userAgent);
      b.ismozilla = 'MozAppearance' in e.style;
      b.iswebkit = 'WebkitAppearance' in e.style;
      b.ischrome = 'chrome' in window;
      b.ischrome22 = b.ischrome && b.haspointerlock;
      b.ischrome26 = b.ischrome && 'transition' in e.style;
      b.cantouch = 'ontouchstart' in document.documentElement || 'ontouchstart' in window;
      b.hasmstouch = window.navigator.msPointerEnabled || !1;
      b.ismac = /^mac$/i.test(navigator.platform);
      b.isios = b.cantouch && /iphone|ipad|ipod/i.test(navigator.platform);
      b.isios4 = b.isios && !('seal' in Object);
      b.isandroid = /android/i.test(navigator.userAgent);
      b.trstyle = !1;
      b.hastransform = !1;
      b.hastranslate3d = !1;
      b.transitionstyle = !1;
      b.hastransition = !1;
      b.transitionend = !1;
      for (var h = ['transform', 'msTransform', 'webkitTransform', 'MozTransform', 'OTransform'], k = 0; k < h.length; k++)
        if ('undefined' != typeof e.style[h[k]]) {
          b.trstyle = h[k];
          break;
        }
      b.hastransform = !1 != b.trstyle;
      b.hastransform && ((e.style[b.trstyle] = 'translate3d(1px,2px,3px)'), (b.hastranslate3d = /translate3d/.test(e.style[b.trstyle])));
      b.transitionstyle = !1;
      b.prefixstyle = '';
      b.transitionend = !1;
      for (
        var h = 'transition webkitTransition MozTransition OTransition OTransition msTransition KhtmlTransition'.split(' '),
          l = ' -webkit- -moz- -o- -o -ms- -khtml-'.split(' '),
          q = 'transitionend webkitTransitionEnd transitionend otransitionend oTransitionEnd msTransitionEnd KhtmlTransitionEnd'.split(' '),
          k = 0;
        k < h.length;
        k++
      )
        if (h[k] in e.style) {
          b.transitionstyle = h[k];
          b.prefixstyle = l[k];
          b.transitionend = q[k];
          break;
        }
      b.ischrome26 && (b.prefixstyle = l[1]);
      b.hastransition = b.transitionstyle;
      a: {
        h = ['-moz-grab', '-webkit-grab', 'grab'];
        if ((b.ischrome && !b.ischrome22) || b.isie) h = [];
        for (k = 0; k < h.length; k++)
          if (((l = h[k]), (e.style.cursor = l), e.style.cursor == l)) {
            h = l;
            break a;
          }
        h = 'url(http://www.google.com/intl/en_ALL/mapfiles/openhand.cur),n-resize';
      }
      b.cursorgrabvalue = h;
      b.hasmousecapture = 'setCapture' in e;
      b.hasMutationObserver = !1 !== z;
      return (E = b);
    },
    N = function (g, b) {
      function h() {
        var c = a.win;
        if ('zIndex' in c) return c.zIndex();
        for (; 0 < c.length && 9 != c[0].nodeType; ) {
          var b = c.css('zIndex');
          if (!isNaN(b) && 0 != b) return parseInt(b);
          c = c.parent();
        }
        return !1;
      }
      function k(c, b, f) {
        b = c.css(b);
        c = parseFloat(b);
        return isNaN(c) ? ((c = w[b] || 0), (f = 3 == c ? (f ? a.win.outerHeight() - a.win.innerHeight() : a.win.outerWidth() - a.win.innerWidth()) : 1), a.isie8 && c && (c += 1), f ? c : 0) : c;
      }
      function l(c, b, f, e) {
        a._bind(
          c,
          b,
          function (a) {
            a = a ? a : window.event;
            var e = {
              original: a,
              target: a.target || a.srcElement,
              type: 'wheel',
              deltaMode: 'MozMousePixelScroll' == a.type ? 0 : 1,
              deltaX: 0,
              deltaZ: 0,
              preventDefault: function () {
                a.preventDefault ? a.preventDefault() : (a.returnValue = !1);
                return !1;
              },
              stopImmediatePropagation: function () {
                a.stopImmediatePropagation ? a.stopImmediatePropagation() : (a.cancelBubble = !0);
              },
            };
            'mousewheel' == b ? ((e.deltaY = -0.025 * a.wheelDelta), a.wheelDeltaX && (e.deltaX = -0.025 * a.wheelDeltaX)) : (e.deltaY = a.detail);
            return f.call(c, e);
          },
          e
        );
      }
      function q(c, b, f) {
        var e, d;
        0 == c.deltaMode
          ? ((e = -Math.floor(c.deltaX * (a.opt.mousescrollstep / 54))), (d = -Math.floor(c.deltaY * (a.opt.mousescrollstep / 54))))
          : 1 == c.deltaMode && ((e = -Math.floor(c.deltaX * a.opt.mousescrollstep)), (d = -Math.floor(c.deltaY * a.opt.mousescrollstep)));
        b && a.opt.oneaxismousemode && 0 == e && d && ((e = d), (d = 0));
        e &&
          (a.scrollmom && a.scrollmom.stop(),
          (a.lastdeltax += e),
          a.debounced(
            'mousewheelx',
            function () {
              var c = a.lastdeltax;
              a.lastdeltax = 0;
              a.rail.drag || a.doScrollLeftBy(c);
            },
            15
          ));
        if (d) {
          if (a.opt.nativeparentscrolling && f && !a.ispage && !a.zoomactive)
            if (0 > d) {
              if (a.getScrollTop() >= a.page.maxh) return !0;
            } else if (0 >= a.getScrollTop()) return !0;
          a.scrollmom && a.scrollmom.stop();
          a.lastdeltay += d;
          a.debounced(
            'mousewheely',
            function () {
              var c = a.lastdeltay;
              a.lastdeltay = 0;
              a.rail.drag || a.doScrollBy(c);
            },
            15
          );
        }
        c.stopImmediatePropagation();
        return c.preventDefault();
      }
      var a = this;
      this.version = '3.5.4';
      this.name = 'nicescroll';
      this.me = b;
      this.opt = { doc: e('body'), win: !1 };
      e.extend(this.opt, G);
      this.opt.snapbackspeed = 80;
      if (g) for (var p in a.opt) 'undefined' != typeof g[p] && (a.opt[p] = g[p]);
      this.iddoc = (this.doc = a.opt.doc) && this.doc[0] ? this.doc[0].id || '' : '';
      this.ispage = /^BODY|HTML/.test(a.opt.win ? a.opt.win[0].nodeName : this.doc[0].nodeName);
      this.haswrapper = !1 !== a.opt.win;
      this.win = a.opt.win || (this.ispage ? e(window) : this.doc);
      this.docscroll = this.ispage && !this.haswrapper ? e(window) : this.win;
      this.body = e('body');
      this.iframe = this.isfixed = this.viewport = !1;
      this.isiframe = 'IFRAME' == this.doc[0].nodeName && 'IFRAME' == this.win[0].nodeName;
      this.istextarea = 'TEXTAREA' == this.win[0].nodeName;
      this.forcescreen = !1;
      this.canshowonmouseevent = 'scroll' != a.opt.autohidemode;
      this.page =
        this.view =
        this.onzoomout =
        this.onzoomin =
        this.onscrollcancel =
        this.onscrollend =
        this.onscrollstart =
        this.onclick =
        this.ongesturezoom =
        this.onkeypress =
        this.onmousewheel =
        this.onmousemove =
        this.onmouseup =
        this.onmousedown =
          !1;
      this.scroll = { x: 0, y: 0 };
      this.scrollratio = { x: 0, y: 0 };
      this.cursorheight = 20;
      this.scrollvaluemax = 0;
      this.observerremover = this.observer = this.scrollmom = this.scrollrunning = this.isrtlmode = !1;
      do this.id = 'ascrail' + K++;
      while (document.getElementById(this.id));
      this.hasmousefocus = this.hasfocus = this.zoomactive = this.zoom = this.selectiondrag = this.cursorfreezed = this.cursor = this.rail = !1;
      this.visibility = !0;
      this.hidden = this.locked = !1;
      this.cursoractive = !0;
      this.wheelprevented = !1;
      this.overflowx = a.opt.overflowx;
      this.overflowy = a.opt.overflowy;
      this.nativescrollingarea = !1;
      this.checkarea = 0;
      this.events = [];
      this.saved = {};
      this.delaylist = {};
      this.synclist = {};
      this.lastdeltay = this.lastdeltax = 0;
      this.detected = M();
      var d = e.extend({}, this.detected);
      this.ishwscroll = (this.canhwscroll = d.hastransform && a.opt.hwacceleration) && a.haswrapper;
      this.istouchcapable = !1;
      d.cantouch && d.ischrome && !d.isios && !d.isandroid && ((this.istouchcapable = !0), (d.cantouch = !1));
      d.cantouch && d.ismozilla && !d.isios && !d.isandroid && ((this.istouchcapable = !0), (d.cantouch = !1));
      a.opt.enablemouselockapi || ((d.hasmousecapture = !1), (d.haspointerlock = !1));
      this.delayed = function (c, b, f, e) {
        var d = a.delaylist[c],
          h = new Date().getTime();
        if (!e && d && d.tt) return !1;
        d && d.tt && clearTimeout(d.tt);
        if (d && d.last + f > h && !d.tt)
          a.delaylist[c] = {
            last: h + f,
            tt: setTimeout(function () {
              a && ((a.delaylist[c].tt = 0), b.call());
            }, f),
          };
        else if (!d || !d.tt)
          (a.delaylist[c] = { last: h, tt: 0 }),
            setTimeout(function () {
              b.call();
            }, 0);
      };
      this.debounced = function (c, b, f) {
        var d = a.delaylist[c];
        new Date().getTime();
        a.delaylist[c] = b;
        d ||
          setTimeout(function () {
            var b = a.delaylist[c];
            a.delaylist[c] = !1;
            b.call();
          }, f);
      };
      var r = !1;
      this.synched = function (c, b) {
        a.synclist[c] = b;
        (function () {
          r ||
            (s(function () {
              r = !1;
              for (c in a.synclist) {
                var b = a.synclist[c];
                b && b.call(a);
                a.synclist[c] = !1;
              }
            }),
            (r = !0));
        })();
        return c;
      };
      this.unsynched = function (c) {
        a.synclist[c] && (a.synclist[c] = !1);
      };
      this.css = function (c, b) {
        for (var f in b) a.saved.css.push([c, f, c.css(f)]), c.css(f, b[f]);
      };
      this.scrollTop = function (c) {
        return 'undefined' == typeof c ? a.getScrollTop() : a.setScrollTop(c);
      };
      this.scrollLeft = function (c) {
        return 'undefined' == typeof c ? a.getScrollLeft() : a.setScrollLeft(c);
      };
      BezierClass = function (a, b, f, d, e, h, k) {
        this.st = a;
        this.ed = b;
        this.spd = f;
        this.p1 = d || 0;
        this.p2 = e || 1;
        this.p3 = h || 0;
        this.p4 = k || 1;
        this.ts = new Date().getTime();
        this.df = this.ed - this.st;
      };
      BezierClass.prototype = {
        B2: function (a) {
          return 3 * a * a * (1 - a);
        },
        B3: function (a) {
          return 3 * a * (1 - a) * (1 - a);
        },
        B4: function (a) {
          return (1 - a) * (1 - a) * (1 - a);
        },
        getNow: function () {
          var a = 1 - (new Date().getTime() - this.ts) / this.spd,
            b = this.B2(a) + this.B3(a) + this.B4(a);
          return 0 > a ? this.ed : this.st + Math.round(this.df * b);
        },
        update: function (a, b) {
          this.st = this.getNow();
          this.ed = a;
          this.spd = b;
          this.ts = new Date().getTime();
          this.df = this.ed - this.st;
          return this;
        },
      };
      if (this.ishwscroll) {
        this.doc.translate = { x: 0, y: 0, tx: '0px', ty: '0px' };
        d.hastranslate3d && d.isios && this.doc.css('-webkit-backface-visibility', 'hidden');
        var t = function () {
          var c = a.doc.css(d.trstyle);
          return c && 'matrix' == c.substr(0, 6)
            ? c
                .replace(/^.*\((.*)\)$/g, '$1')
                .replace(/px/g, '')
                .split(/, +/)
            : !1;
        };
        this.getScrollTop = function (c) {
          if (!c) {
            if ((c = t())) return 16 == c.length ? -c[13] : -c[5];
            if (a.timerscroll && a.timerscroll.bz) return a.timerscroll.bz.getNow();
          }
          return a.doc.translate.y;
        };
        this.getScrollLeft = function (c) {
          if (!c) {
            if ((c = t())) return 16 == c.length ? -c[12] : -c[4];
            if (a.timerscroll && a.timerscroll.bh) return a.timerscroll.bh.getNow();
          }
          return a.doc.translate.x;
        };
        this.notifyScrollEvent = document.createEvent
          ? function (a) {
              var b = document.createEvent('UIEvents');
              b.initUIEvent('scroll', !1, !0, window, 1);
              a.dispatchEvent(b);
            }
          : document.fireEvent
          ? function (a) {
              var b = document.createEventObject();
              a.fireEvent('onscroll');
              b.cancelBubble = !0;
            }
          : function (a, b) {};
        d.hastranslate3d && a.opt.enabletranslate3d
          ? ((this.setScrollTop = function (c, b) {
              a.doc.translate.y = c;
              a.doc.translate.ty = -1 * c + 'px';
              a.doc.css(d.trstyle, 'translate3d(' + a.doc.translate.tx + ',' + a.doc.translate.ty + ',0px)');
              b || a.notifyScrollEvent(a.win[0]);
            }),
            (this.setScrollLeft = function (c, b) {
              a.doc.translate.x = c;
              a.doc.translate.tx = -1 * c + 'px';
              a.doc.css(d.trstyle, 'translate3d(' + a.doc.translate.tx + ',' + a.doc.translate.ty + ',0px)');
              b || a.notifyScrollEvent(a.win[0]);
            }))
          : ((this.setScrollTop = function (c, b) {
              a.doc.translate.y = c;
              a.doc.translate.ty = -1 * c + 'px';
              a.doc.css(d.trstyle, 'translate(' + a.doc.translate.tx + ',' + a.doc.translate.ty + ')');
              b || a.notifyScrollEvent(a.win[0]);
            }),
            (this.setScrollLeft = function (c, b) {
              a.doc.translate.x = c;
              a.doc.translate.tx = -1 * c + 'px';
              a.doc.css(d.trstyle, 'translate(' + a.doc.translate.tx + ',' + a.doc.translate.ty + ')');
              b || a.notifyScrollEvent(a.win[0]);
            }));
      } else
        (this.getScrollTop = function () {
          return a.docscroll.scrollTop();
        }),
          (this.setScrollTop = function (c) {
            return a.docscroll.scrollTop(c);
          }),
          (this.getScrollLeft = function () {
            return a.docscroll.scrollLeft();
          }),
          (this.setScrollLeft = function (c) {
            return a.docscroll.scrollLeft(c);
          });
      this.getTarget = function (a) {
        return !a ? !1 : a.target ? a.target : a.srcElement ? a.srcElement : !1;
      };
      this.hasParent = function (a, b) {
        if (!a) return !1;
        for (var f = a.target || a.srcElement || a || !1; f && f.id != b; ) f = f.parentNode || !1;
        return !1 !== f;
      };
      var w = { thin: 1, medium: 3, thick: 5 };
      this.getOffset = function () {
        if (a.isfixed) return { top: parseFloat(a.win.css('top')), left: parseFloat(a.win.css('left')) };
        if (!a.viewport) return a.win.offset();
        var c = a.win.offset(),
          b = a.viewport.offset();
        return { top: c.top - b.top + a.viewport.scrollTop(), left: c.left - b.left + a.viewport.scrollLeft() };
      };
      this.updateScrollBar = function (c) {
        if (a.ishwscroll) a.rail.css({ height: a.win.innerHeight() }), a.railh && a.railh.css({ width: a.win.innerWidth() });
        else {
          var b = a.getOffset(),
            f = b.top,
            d = b.left,
            f = f + k(a.win, 'border-top-width', !0);
          a.win.outerWidth();
          a.win.innerWidth();
          var d = d + (a.rail.align ? a.win.outerWidth() - k(a.win, 'border-right-width') - a.rail.width : k(a.win, 'border-left-width')),
            e = a.opt.railoffset;
          e && (e.top && (f += e.top), a.rail.align && e.left && (d += e.left));
          a.locked || a.rail.css({ top: f, left: d, height: c ? c.h : a.win.innerHeight() });
          a.zoom && a.zoom.css({ top: f + 1, left: 1 == a.rail.align ? d - 20 : d + a.rail.width + 4 });
          a.railh &&
            !a.locked &&
            ((f = b.top),
            (d = b.left),
            (c = a.railh.align ? f + k(a.win, 'border-top-width', !0) + a.win.innerHeight() - a.railh.height : f + k(a.win, 'border-top-width', !0)),
            (d += k(a.win, 'border-left-width')),
            a.railh.css({ top: c, left: d, width: a.railh.width }));
        }
      };
      this.doRailClick = function (c, b, f) {
        var d;
        a.locked ||
          (a.cancelEvent(c),
          b
            ? ((b = f ? a.doScrollLeft : a.doScrollTop), (d = f ? (c.pageX - a.railh.offset().left - a.cursorwidth / 2) * a.scrollratio.x : (c.pageY - a.rail.offset().top - a.cursorheight / 2) * a.scrollratio.y), b(d))
            : ((b = f ? a.doScrollLeftBy : a.doScrollBy), (d = f ? a.scroll.x : a.scroll.y), (c = f ? c.pageX - a.railh.offset().left : c.pageY - a.rail.offset().top), (f = f ? a.view.w : a.view.h), d >= c ? b(f) : b(-f)));
      };
      a.hasanimationframe = s;
      a.hascancelanimationframe = v;
      a.hasanimationframe
        ? a.hascancelanimationframe ||
          (v = function () {
            a.cancelAnimationFrame = !0;
          })
        : ((s = function (a) {
            return setTimeout(a, 15 - (Math.floor(+new Date() / 1e3) % 16));
          }),
          (v = clearInterval));
      this.init = function () {
        a.saved.css = [];
        if (d.isie7mobile || d.isoperamini) return !0;
        d.hasmstouch && a.css(a.ispage ? e('html') : a.win, { '-ms-touch-action': 'none' });
        a.zindex = 'auto';
        a.zindex = !a.ispage && 'auto' == a.opt.zindex ? h() || 'auto' : a.opt.zindex;
        !a.ispage && 'auto' != a.zindex && a.zindex > x && (x = a.zindex);
        a.isie && 0 == a.zindex && 'auto' == a.opt.zindex && (a.zindex = 'auto');
        if (!a.ispage || (!d.cantouch && !d.isieold && !d.isie9mobile)) {
          var c = a.docscroll;
          a.ispage && (c = a.haswrapper ? a.win : a.doc);
          d.isie9mobile || a.css(c, { 'overflow-y': 'hidden' });
          a.ispage && d.isie7 && ('BODY' == a.doc[0].nodeName ? a.css(e('html'), { 'overflow-y': 'hidden' }) : 'HTML' == a.doc[0].nodeName && a.css(e('body'), { 'overflow-y': 'hidden' }));
          d.isios && !a.ispage && !a.haswrapper && a.css(e('body'), { '-webkit-overflow-scrolling': 'touch' });
          var b = e(document.createElement('div'));
          b.css({
            position: 'relative',
            top: 0,
            float: 'right',
            width: a.opt.cursorwidth,
            height: '0px',
            'background-color': a.opt.cursorcolor,
            border: a.opt.cursorborder,
            'background-clip': 'padding-box',
            '-webkit-border-radius': a.opt.cursorborderradius,
            '-moz-border-radius': a.opt.cursorborderradius,
            'border-radius': a.opt.cursorborderradius,
          });
          b.hborder = parseFloat(b.outerHeight() - b.innerHeight());
          a.cursor = b;
          var f = e(document.createElement('div'));
          f.attr('id', a.id);
          f.addClass('nicescroll-rails');
          var u,
            k,
            g = ['left', 'right'],
            l;
          for (l in g) (k = g[l]), (u = a.opt.railpadding[k]) ? f.css('padding-' + k, u + 'px') : (a.opt.railpadding[k] = 0);
          f.append(b);
          f.width = Math.max(parseFloat(a.opt.cursorwidth), b.outerWidth()) + a.opt.railpadding.left + a.opt.railpadding.right;
          f.css({ width: f.width + 'px', zIndex: a.zindex, background: a.opt.background, cursor: 'default' });
          f.visibility = !0;
          f.scrollable = !0;
          f.align = 'left' == a.opt.railalign ? 0 : 1;
          a.rail = f;
          b = a.rail.drag = !1;
          a.opt.boxzoom &&
            !a.ispage &&
            !d.isieold &&
            ((b = document.createElement('div')),
            a.bind(b, 'click', a.doZoom),
            (a.zoom = e(b)),
            a.zoom.css({ cursor: 'pointer', 'z-index': a.zindex, backgroundImage: 'url(' + a.opt.scriptpath + 'zoomico.png)', height: 18, width: 18, backgroundPosition: '0px 0px' }),
            a.opt.dblclickzoom && a.bind(a.win, 'dblclick', a.doZoom),
            d.cantouch &&
              a.opt.gesturezoom &&
              ((a.ongesturezoom = function (c) {
                1.5 < c.scale && a.doZoomIn(c);
                0.8 > c.scale && a.doZoomOut(c);
                return a.cancelEvent(c);
              }),
              a.bind(a.win, 'gestureend', a.ongesturezoom)));
          a.railh = !1;
          if (a.opt.horizrailenabled) {
            a.css(c, { 'overflow-x': 'hidden' });
            b = e(document.createElement('div'));
            b.css({
              position: 'relative',
              top: 0,
              height: a.opt.cursorwidth,
              width: '0px',
              'background-color': a.opt.cursorcolor,
              border: a.opt.cursorborder,
              'background-clip': 'padding-box',
              '-webkit-border-radius': a.opt.cursorborderradius,
              '-moz-border-radius': a.opt.cursorborderradius,
              'border-radius': a.opt.cursorborderradius,
            });
            b.wborder = parseFloat(b.outerWidth() - b.innerWidth());
            a.cursorh = b;
            var m = e(document.createElement('div'));
            m.attr('id', a.id + '-hr');
            m.addClass('nicescroll-rails');
            m.height = Math.max(parseFloat(a.opt.cursorwidth), b.outerHeight());
            m.css({ height: m.height + 'px', zIndex: a.zindex, background: a.opt.background });
            m.append(b);
            m.visibility = !0;
            m.scrollable = !0;
            m.align = 'top' == a.opt.railvalign ? 0 : 1;
            a.railh = m;
            a.railh.drag = !1;
          }
          a.ispage
            ? (f.css({ position: 'fixed', top: '0px', height: '100%' }),
              f.align ? f.css({ right: '0px' }) : f.css({ left: '0px' }),
              a.body.append(f),
              a.railh && (m.css({ position: 'fixed', left: '0px', width: '100%' }), m.align ? m.css({ bottom: '0px' }) : m.css({ top: '0px' }), a.body.append(m)))
            : (a.ishwscroll
                ? ('static' == a.win.css('position') && a.css(a.win, { position: 'relative' }),
                  (c = 'HTML' == a.win[0].nodeName ? a.body : a.win),
                  a.zoom && (a.zoom.css({ position: 'absolute', top: 1, right: 0, 'margin-right': f.width + 4 }), c.append(a.zoom)),
                  f.css({ position: 'absolute', top: 0 }),
                  f.align ? f.css({ right: 0 }) : f.css({ left: 0 }),
                  c.append(f),
                  m && (m.css({ position: 'absolute', left: 0, bottom: 0 }), m.align ? m.css({ bottom: 0 }) : m.css({ top: 0 }), c.append(m)))
                : ((a.isfixed = 'fixed' == a.win.css('position')),
                  (c = a.isfixed ? 'fixed' : 'absolute'),
                  a.isfixed || (a.viewport = a.getViewport(a.win[0])),
                  a.viewport && ((a.body = a.viewport), !1 == /fixed|relative|absolute/.test(a.viewport.css('position')) && a.css(a.viewport, { position: 'relative' })),
                  f.css({ position: c }),
                  a.zoom && a.zoom.css({ position: c }),
                  a.updateScrollBar(),
                  a.body.append(f),
                  a.zoom && a.body.append(a.zoom),
                  a.railh && (m.css({ position: c }), a.body.append(m))),
              d.isios && a.css(a.win, { '-webkit-tap-highlight-color': 'rgba(0,0,0,0)', '-webkit-touch-callout': 'none' }),
              d.isie && a.opt.disableoutline && a.win.attr('hideFocus', 'true'),
              d.iswebkit && a.opt.disableoutline && a.win.css({ outline: 'none' }));
          !1 === a.opt.autohidemode
            ? ((a.autohidedom = !1), a.rail.css({ opacity: a.opt.cursoropacitymax }), a.railh && a.railh.css({ opacity: a.opt.cursoropacitymax }))
            : !0 === a.opt.autohidemode || 'leave' === a.opt.autohidemode
            ? ((a.autohidedom = e().add(a.rail)), d.isie8 && (a.autohidedom = a.autohidedom.add(a.cursor)), a.railh && (a.autohidedom = a.autohidedom.add(a.railh)), a.railh && d.isie8 && (a.autohidedom = a.autohidedom.add(a.cursorh)))
            : 'scroll' == a.opt.autohidemode
            ? ((a.autohidedom = e().add(a.rail)), a.railh && (a.autohidedom = a.autohidedom.add(a.railh)))
            : 'cursor' == a.opt.autohidemode
            ? ((a.autohidedom = e().add(a.cursor)), a.railh && (a.autohidedom = a.autohidedom.add(a.cursorh)))
            : 'hidden' == a.opt.autohidemode && ((a.autohidedom = !1), a.hide(), (a.locked = !1));
          if (d.isie9mobile)
            (a.scrollmom = new H(a)),
              (a.onmangotouch = function (c) {
                c = a.getScrollTop();
                var b = a.getScrollLeft();
                if (c == a.scrollmom.lastscrolly && b == a.scrollmom.lastscrollx) return !0;
                var f = c - a.mangotouch.sy,
                  d = b - a.mangotouch.sx;
                if (0 != Math.round(Math.sqrt(Math.pow(d, 2) + Math.pow(f, 2)))) {
                  var n = 0 > f ? -1 : 1,
                    e = 0 > d ? -1 : 1,
                    h = +new Date();
                  a.mangotouch.lazy && clearTimeout(a.mangotouch.lazy);
                  80 < h - a.mangotouch.tm || a.mangotouch.dry != n || a.mangotouch.drx != e
                    ? (a.scrollmom.stop(), a.scrollmom.reset(b, c), (a.mangotouch.sy = c), (a.mangotouch.ly = c), (a.mangotouch.sx = b), (a.mangotouch.lx = b), (a.mangotouch.dry = n), (a.mangotouch.drx = e), (a.mangotouch.tm = h))
                    : (a.scrollmom.stop(),
                      a.scrollmom.update(a.mangotouch.sx - d, a.mangotouch.sy - f),
                      (a.mangotouch.tm = h),
                      (f = Math.max(Math.abs(a.mangotouch.ly - c), Math.abs(a.mangotouch.lx - b))),
                      (a.mangotouch.ly = c),
                      (a.mangotouch.lx = b),
                      2 < f &&
                        (a.mangotouch.lazy = setTimeout(function () {
                          a.mangotouch.lazy = !1;
                          a.mangotouch.dry = 0;
                          a.mangotouch.drx = 0;
                          a.mangotouch.tm = 0;
                          a.scrollmom.doMomentum(30);
                        }, 100)));
                }
              }),
              (f = a.getScrollTop()),
              (m = a.getScrollLeft()),
              (a.mangotouch = { sy: f, ly: f, dry: 0, sx: m, lx: m, drx: 0, lazy: !1, tm: 0 }),
              a.bind(a.docscroll, 'scroll', a.onmangotouch);
          else {
            if (d.cantouch || a.istouchcapable || a.opt.touchbehavior || d.hasmstouch) {
              a.scrollmom = new H(a);
              a.ontouchstart = function (c) {
                if (c.pointerType && 2 != c.pointerType) return !1;
                a.hasmoving = !1;
                if (!a.locked) {
                  if (d.hasmstouch)
                    for (var b = c.target ? c.target : !1; b; ) {
                      var f = e(b).getNiceScroll();
                      if (0 < f.length && f[0].me == a.me) break;
                      if (0 < f.length) return !1;
                      if ('DIV' == b.nodeName && b.id == a.id) break;
                      b = b.parentNode ? b.parentNode : !1;
                    }
                  a.cancelScroll();
                  if ((b = a.getTarget(c)) && /INPUT/i.test(b.nodeName) && /range/i.test(b.type)) return a.stopPropagation(c);
                  !('clientX' in c) && 'changedTouches' in c && ((c.clientX = c.changedTouches[0].clientX), (c.clientY = c.changedTouches[0].clientY));
                  a.forcescreen && ((f = c), (c = { original: c.original ? c.original : c }), (c.clientX = f.screenX), (c.clientY = f.screenY));
                  a.rail.drag = { x: c.clientX, y: c.clientY, sx: a.scroll.x, sy: a.scroll.y, st: a.getScrollTop(), sl: a.getScrollLeft(), pt: 2, dl: !1 };
                  if (a.ispage || !a.opt.directionlockdeadzone) a.rail.drag.dl = 'f';
                  else {
                    var f = e(window).width(),
                      n = e(window).height(),
                      h = Math.max(document.body.scrollWidth, document.documentElement.scrollWidth),
                      k = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight),
                      n = Math.max(0, k - n),
                      f = Math.max(0, h - f);
                    a.rail.drag.ck = !a.rail.scrollable && a.railh.scrollable ? (0 < n ? 'v' : !1) : a.rail.scrollable && !a.railh.scrollable ? (0 < f ? 'h' : !1) : !1;
                    a.rail.drag.ck || (a.rail.drag.dl = 'f');
                  }
                  a.opt.touchbehavior && a.isiframe && d.isie && ((f = a.win.position()), (a.rail.drag.x += f.left), (a.rail.drag.y += f.top));
                  a.hasmoving = !1;
                  a.lastmouseup = !1;
                  a.scrollmom.reset(c.clientX, c.clientY);
                  if (!d.cantouch && !this.istouchcapable && !d.hasmstouch) {
                    if (!b || !/INPUT|SELECT|TEXTAREA/i.test(b.nodeName))
                      return (
                        !a.ispage && d.hasmousecapture && b.setCapture(),
                        a.opt.touchbehavior
                          ? (b.onclick &&
                              !b._onclick &&
                              ((b._onclick = b.onclick),
                              (b.onclick = function (c) {
                                if (a.hasmoving) return !1;
                                b._onclick.call(this, c);
                              })),
                            a.cancelEvent(c))
                          : a.stopPropagation(c)
                      );
                    /SUBMIT|CANCEL|BUTTON/i.test(e(b).attr('type')) && ((pc = { tg: b, click: !1 }), (a.preventclick = pc));
                  }
                }
              };
              a.ontouchend = function (c) {
                if (c.pointerType && 2 != c.pointerType) return !1;
                if (a.rail.drag && 2 == a.rail.drag.pt && (a.scrollmom.doMomentum(), (a.rail.drag = !1), a.hasmoving && ((a.lastmouseup = !0), a.hideCursor(), d.hasmousecapture && document.releaseCapture(), !d.cantouch)))
                  return a.cancelEvent(c);
              };
              var q = a.opt.touchbehavior && a.isiframe && !d.hasmousecapture;
              a.ontouchmove = function (c, b) {
                if (c.pointerType && 2 != c.pointerType) return !1;
                if (a.rail.drag && 2 == a.rail.drag.pt) {
                  if (d.cantouch && 'undefined' == typeof c.original) return !0;
                  a.hasmoving = !0;
                  a.preventclick && !a.preventclick.click && ((a.preventclick.click = a.preventclick.tg.onclick || !1), (a.preventclick.tg.onclick = a.onpreventclick));
                  c = e.extend({ original: c }, c);
                  'changedTouches' in c && ((c.clientX = c.changedTouches[0].clientX), (c.clientY = c.changedTouches[0].clientY));
                  if (a.forcescreen) {
                    var f = c;
                    c = { original: c.original ? c.original : c };
                    c.clientX = f.screenX;
                    c.clientY = f.screenY;
                  }
                  f = ofy = 0;
                  if (q && !b) {
                    var n = a.win.position(),
                      f = -n.left;
                    ofy = -n.top;
                  }
                  var h = c.clientY + ofy,
                    n = h - a.rail.drag.y,
                    k = c.clientX + f,
                    u = k - a.rail.drag.x,
                    g = a.rail.drag.st - n;
                  a.ishwscroll && a.opt.bouncescroll ? (0 > g ? (g = Math.round(g / 2)) : g > a.page.maxh && (g = a.page.maxh + Math.round((g - a.page.maxh) / 2))) : (0 > g && (h = g = 0), g > a.page.maxh && ((g = a.page.maxh), (h = 0)));
                  if (a.railh && a.railh.scrollable) {
                    var l = a.rail.drag.sl - u;
                    a.ishwscroll && a.opt.bouncescroll ? (0 > l ? (l = Math.round(l / 2)) : l > a.page.maxw && (l = a.page.maxw + Math.round((l - a.page.maxw) / 2))) : (0 > l && (k = l = 0), l > a.page.maxw && ((l = a.page.maxw), (k = 0)));
                  }
                  f = !1;
                  if (a.rail.drag.dl) (f = !0), 'v' == a.rail.drag.dl ? (l = a.rail.drag.sl) : 'h' == a.rail.drag.dl && (g = a.rail.drag.st);
                  else {
                    var n = Math.abs(n),
                      u = Math.abs(u),
                      m = a.opt.directionlockdeadzone;
                    if ('v' == a.rail.drag.ck) {
                      if (n > m && u <= 0.3 * n) return (a.rail.drag = !1), !0;
                      u > m && ((a.rail.drag.dl = 'f'), e('body').scrollTop(e('body').scrollTop()));
                    } else if ('h' == a.rail.drag.ck) {
                      if (u > m && n <= 0.3 * u) return (a.rail.drag = !1), !0;
                      n > m && ((a.rail.drag.dl = 'f'), e('body').scrollLeft(e('body').scrollLeft()));
                    }
                  }
                  a.synched('touchmove', function () {
                    a.rail.drag &&
                      2 == a.rail.drag.pt &&
                      (a.prepareTransition && a.prepareTransition(0),
                      a.rail.scrollable && a.setScrollTop(g),
                      a.scrollmom.update(k, h),
                      a.railh && a.railh.scrollable ? (a.setScrollLeft(l), a.showCursor(g, l)) : a.showCursor(g),
                      d.isie10 && document.selection.clear());
                  });
                  d.ischrome && a.istouchcapable && (f = !1);
                  if (f) return a.cancelEvent(c);
                }
              };
            }
            a.onmousedown = function (c, b) {
              if (!(a.rail.drag && 1 != a.rail.drag.pt)) {
                if (a.locked) return a.cancelEvent(c);
                a.cancelScroll();
                a.rail.drag = { x: c.clientX, y: c.clientY, sx: a.scroll.x, sy: a.scroll.y, pt: 1, hr: !!b };
                var f = a.getTarget(c);
                !a.ispage && d.hasmousecapture && f.setCapture();
                a.isiframe && !d.hasmousecapture && ((a.saved.csspointerevents = a.doc.css('pointer-events')), a.css(a.doc, { 'pointer-events': 'none' }));
                a.hasmoving = !1;
                return a.cancelEvent(c);
              }
            };
            a.onmouseup = function (c) {
              if (a.rail.drag && (d.hasmousecapture && document.releaseCapture(), a.isiframe && !d.hasmousecapture && a.doc.css('pointer-events', a.saved.csspointerevents), 1 == a.rail.drag.pt))
                return (a.rail.drag = !1), a.hasmoving && a.triggerScrollEnd(), a.cancelEvent(c);
            };
            a.onmousemove = function (c) {
              if (a.rail.drag && 1 == a.rail.drag.pt) {
                if (d.ischrome && 0 == c.which) return a.onmouseup(c);
                a.cursorfreezed = !0;
                a.hasmoving = !0;
                if (a.rail.drag.hr) {
                  a.scroll.x = a.rail.drag.sx + (c.clientX - a.rail.drag.x);
                  0 > a.scroll.x && (a.scroll.x = 0);
                  var b = a.scrollvaluemaxw;
                  a.scroll.x > b && (a.scroll.x = b);
                } else (a.scroll.y = a.rail.drag.sy + (c.clientY - a.rail.drag.y)), 0 > a.scroll.y && (a.scroll.y = 0), (b = a.scrollvaluemax), a.scroll.y > b && (a.scroll.y = b);
                a.synched('mousemove', function () {
                  a.rail.drag &&
                    1 == a.rail.drag.pt &&
                    (a.showCursor(), a.rail.drag.hr ? a.doScrollLeft(Math.round(a.scroll.x * a.scrollratio.x), a.opt.cursordragspeed) : a.doScrollTop(Math.round(a.scroll.y * a.scrollratio.y), a.opt.cursordragspeed));
                });
                return a.cancelEvent(c);
              }
            };
            if (d.cantouch || a.opt.touchbehavior)
              (a.onpreventclick = function (c) {
                if (a.preventclick) return (a.preventclick.tg.onclick = a.preventclick.click), (a.preventclick = !1), a.cancelEvent(c);
              }),
                a.bind(a.win, 'mousedown', a.ontouchstart),
                (a.onclick = d.isios
                  ? !1
                  : function (c) {
                      return a.lastmouseup ? ((a.lastmouseup = !1), a.cancelEvent(c)) : !0;
                    }),
                a.opt.grabcursorenabled && d.cursorgrabvalue && (a.css(a.ispage ? a.doc : a.win, { cursor: d.cursorgrabvalue }), a.css(a.rail, { cursor: d.cursorgrabvalue }));
            else {
              var p = function (c) {
                if (a.selectiondrag) {
                  if (c) {
                    var b = a.win.outerHeight();
                    c = c.pageY - a.selectiondrag.top;
                    0 < c && c < b && (c = 0);
                    c >= b && (c -= b);
                    a.selectiondrag.df = c;
                  }
                  0 != a.selectiondrag.df &&
                    (a.doScrollBy(2 * -Math.floor(a.selectiondrag.df / 6)),
                    a.debounced(
                      'doselectionscroll',
                      function () {
                        p();
                      },
                      50
                    ));
                }
              };
              a.hasTextSelected =
                'getSelection' in document
                  ? function () {
                      return 0 < document.getSelection().rangeCount;
                    }
                  : 'selection' in document
                  ? function () {
                      return 'None' != document.selection.type;
                    }
                  : function () {
                      return !1;
                    };
              a.onselectionstart = function (c) {
                a.ispage || (a.selectiondrag = a.win.offset());
              };
              a.onselectionend = function (c) {
                a.selectiondrag = !1;
              };
              a.onselectiondrag = function (c) {
                a.selectiondrag &&
                  a.hasTextSelected() &&
                  a.debounced(
                    'selectionscroll',
                    function () {
                      p(c);
                    },
                    250
                  );
              };
            }
            d.hasmstouch &&
              (a.css(a.rail, { '-ms-touch-action': 'none' }),
              a.css(a.cursor, { '-ms-touch-action': 'none' }),
              a.bind(a.win, 'MSPointerDown', a.ontouchstart),
              a.bind(document, 'MSPointerUp', a.ontouchend),
              a.bind(document, 'MSPointerMove', a.ontouchmove),
              a.bind(a.cursor, 'MSGestureHold', function (a) {
                a.preventDefault();
              }),
              a.bind(a.cursor, 'contextmenu', function (a) {
                a.preventDefault();
              }));
            this.istouchcapable && (a.bind(a.win, 'touchstart', a.ontouchstart), a.bind(document, 'touchend', a.ontouchend), a.bind(document, 'touchcancel', a.ontouchend), a.bind(document, 'touchmove', a.ontouchmove));
            a.bind(a.cursor, 'mousedown', a.onmousedown);
            a.bind(a.cursor, 'mouseup', a.onmouseup);
            a.railh &&
              (a.bind(a.cursorh, 'mousedown', function (c) {
                a.onmousedown(c, !0);
              }),
              a.bind(a.cursorh, 'mouseup', a.onmouseup));
            if (a.opt.cursordragontouch || (!d.cantouch && !a.opt.touchbehavior))
              a.rail.css({ cursor: 'default' }),
                a.railh && a.railh.css({ cursor: 'default' }),
                a.jqbind(a.rail, 'mouseenter', function () {
                  if (!a.win.is(':visible')) return !1;
                  a.canshowonmouseevent && a.showCursor();
                  a.rail.active = !0;
                }),
                a.jqbind(a.rail, 'mouseleave', function () {
                  a.rail.active = !1;
                  a.rail.drag || a.hideCursor();
                }),
                a.opt.sensitiverail &&
                  (a.bind(a.rail, 'click', function (c) {
                    a.doRailClick(c, !1, !1);
                  }),
                  a.bind(a.rail, 'dblclick', function (c) {
                    a.doRailClick(c, !0, !1);
                  }),
                  a.bind(a.cursor, 'click', function (c) {
                    a.cancelEvent(c);
                  }),
                  a.bind(a.cursor, 'dblclick', function (c) {
                    a.cancelEvent(c);
                  })),
                a.railh &&
                  (a.jqbind(a.railh, 'mouseenter', function () {
                    if (!a.win.is(':visible')) return !1;
                    a.canshowonmouseevent && a.showCursor();
                    a.rail.active = !0;
                  }),
                  a.jqbind(a.railh, 'mouseleave', function () {
                    a.rail.active = !1;
                    a.rail.drag || a.hideCursor();
                  }),
                  a.opt.sensitiverail &&
                    (a.bind(a.railh, 'click', function (c) {
                      a.doRailClick(c, !1, !0);
                    }),
                    a.bind(a.railh, 'dblclick', function (c) {
                      a.doRailClick(c, !0, !0);
                    }),
                    a.bind(a.cursorh, 'click', function (c) {
                      a.cancelEvent(c);
                    }),
                    a.bind(a.cursorh, 'dblclick', function (c) {
                      a.cancelEvent(c);
                    })));
            !d.cantouch && !a.opt.touchbehavior
              ? (a.bind(d.hasmousecapture ? a.win : document, 'mouseup', a.onmouseup),
                a.bind(document, 'mousemove', a.onmousemove),
                a.onclick && a.bind(document, 'click', a.onclick),
                !a.ispage &&
                  a.opt.enablescrollonselection &&
                  (a.bind(a.win[0], 'mousedown', a.onselectionstart),
                  a.bind(document, 'mouseup', a.onselectionend),
                  a.bind(a.cursor, 'mouseup', a.onselectionend),
                  a.cursorh && a.bind(a.cursorh, 'mouseup', a.onselectionend),
                  a.bind(document, 'mousemove', a.onselectiondrag)),
                a.zoom &&
                  (a.jqbind(a.zoom, 'mouseenter', function () {
                    a.canshowonmouseevent && a.showCursor();
                    a.rail.active = !0;
                  }),
                  a.jqbind(a.zoom, 'mouseleave', function () {
                    a.rail.active = !1;
                    a.rail.drag || a.hideCursor();
                  })))
              : (a.bind(d.hasmousecapture ? a.win : document, 'mouseup', a.ontouchend),
                a.bind(document, 'mousemove', a.ontouchmove),
                a.onclick && a.bind(document, 'click', a.onclick),
                a.opt.cursordragontouch &&
                  (a.bind(a.cursor, 'mousedown', a.onmousedown),
                  a.bind(a.cursor, 'mousemove', a.onmousemove),
                  a.cursorh &&
                    a.bind(a.cursorh, 'mousedown', function (c) {
                      a.onmousedown(c, !0);
                    }),
                  a.cursorh && a.bind(a.cursorh, 'mousemove', a.onmousemove)));
            a.opt.enablemousewheel && (a.isiframe || a.bind(d.isie && a.ispage ? document : a.win, 'mousewheel', a.onmousewheel), a.bind(a.rail, 'mousewheel', a.onmousewheel), a.railh && a.bind(a.railh, 'mousewheel', a.onmousewheelhr));
            !a.ispage &&
              !d.cantouch &&
              !/HTML|^BODY/.test(a.win[0].nodeName) &&
              (a.win.attr('tabindex') || a.win.attr({ tabindex: J++ }),
              a.jqbind(a.win, 'focus', function (c) {
                y = a.getTarget(c).id || !0;
                a.hasfocus = !0;
                a.canshowonmouseevent && a.noticeCursor();
              }),
              a.jqbind(a.win, 'blur', function (c) {
                y = !1;
                a.hasfocus = !1;
              }),
              a.jqbind(a.win, 'mouseenter', function (c) {
                C = a.getTarget(c).id || !0;
                a.hasmousefocus = !0;
                a.canshowonmouseevent && a.noticeCursor();
              }),
              a.jqbind(a.win, 'mouseleave', function () {
                C = !1;
                a.hasmousefocus = !1;
                a.rail.drag || a.hideCursor();
              }));
          }
          a.onkeypress = function (c) {
            if (a.locked && 0 == a.page.maxh) return !0;
            c = c ? c : window.e;
            var b = a.getTarget(c);
            if ((b && /INPUT|TEXTAREA|SELECT|OPTION/.test(b.nodeName) && ((!b.getAttribute('type') && !b.type) || !/submit|button|cancel/i.tp)) || e(b).attr('contenteditable')) return !0;
            if (a.hasfocus || (a.hasmousefocus && !y) || (a.ispage && !y && !C)) {
              b = c.keyCode;
              if (a.locked && 27 != b) return a.cancelEvent(c);
              var f = c.ctrlKey || !1,
                n = c.shiftKey || !1,
                d = !1;
              switch (b) {
                case 38:
                case 63233:
                  a.doScrollBy(72);
                  d = !0;
                  break;
                case 40:
                case 63235:
                  a.doScrollBy(-72);
                  d = !0;
                  break;
                case 37:
                case 63232:
                  a.railh && (f ? a.doScrollLeft(0) : a.doScrollLeftBy(72), (d = !0));
                  break;
                case 39:
                case 63234:
                  a.railh && (f ? a.doScrollLeft(a.page.maxw) : a.doScrollLeftBy(-72), (d = !0));
                  break;
                case 33:
                case 63276:
                  a.doScrollBy(a.view.h);
                  d = !0;
                  break;
                case 34:
                case 63277:
                  a.doScrollBy(-a.view.h);
                  d = !0;
                  break;
                case 36:
                case 63273:
                  a.railh && f ? a.doScrollPos(0, 0) : a.doScrollTo(0);
                  d = !0;
                  break;
                case 35:
                case 63275:
                  a.railh && f ? a.doScrollPos(a.page.maxw, a.page.maxh) : a.doScrollTo(a.page.maxh);
                  d = !0;
                  break;
                case 32:
                  a.opt.spacebarenabled && (n ? a.doScrollBy(a.view.h) : a.doScrollBy(-a.view.h), (d = !0));
                  break;
                case 27:
                  a.zoomactive && (a.doZoom(), (d = !0));
              }
              if (d) return a.cancelEvent(c);
            }
          };
          a.opt.enablekeyboard && a.bind(document, d.isopera && !d.isopera12 ? 'keypress' : 'keydown', a.onkeypress);
          a.bind(document, 'keydown', function (c) {
            c.ctrlKey && (a.wheelprevented = !0);
          });
          a.bind(document, 'keyup', function (c) {
            c.ctrlKey || (a.wheelprevented = !1);
          });
          a.bind(window, 'resize', a.lazyResize);
          a.bind(window, 'orientationchange', a.lazyResize);
          a.bind(window, 'load', a.lazyResize);
          if (d.ischrome && !a.ispage && !a.haswrapper) {
            var r = a.win.attr('style'),
              f = parseFloat(a.win.css('width')) + 1;
            a.win.css('width', f);
            a.synched('chromefix', function () {
              a.win.attr('style', r);
            });
          }
          a.onAttributeChange = function (c) {
            a.lazyResize(250);
          };
          !a.ispage &&
            !a.haswrapper &&
            (!1 !== z
              ? ((a.observer = new z(function (c) {
                  c.forEach(a.onAttributeChange);
                })),
                a.observer.observe(a.win[0], { childList: !0, characterData: !1, attributes: !0, subtree: !1 }),
                (a.observerremover = new z(function (c) {
                  c.forEach(function (c) {
                    if (0 < c.removedNodes.length) for (var b in c.removedNodes) if (c.removedNodes[b] == a.win[0]) return a.remove();
                  });
                })),
                a.observerremover.observe(a.win[0].parentNode, { childList: !0, characterData: !1, attributes: !1, subtree: !1 }))
              : (a.bind(a.win, d.isie && !d.isie9 ? 'propertychange' : 'DOMAttrModified', a.onAttributeChange),
                d.isie9 && a.win[0].attachEvent('onpropertychange', a.onAttributeChange),
                a.bind(a.win, 'DOMNodeRemoved', function (c) {
                  c.target == a.win[0] && a.remove();
                })));
          !a.ispage && a.opt.boxzoom && a.bind(window, 'resize', a.resizeZoom);
          a.istextarea && a.bind(a.win, 'mouseup', a.lazyResize);
          a.lazyResize(30);
        }
        if ('IFRAME' == this.doc[0].nodeName) {
          var I = function (c) {
            a.iframexd = !1;
            try {
              var b = 'contentDocument' in this ? this.contentDocument : this.contentWindow.document;
            } catch (f) {
              (a.iframexd = !0), (b = !1);
            }
            if (a.iframexd) return 'console' in window && console.log('NiceScroll error: policy restriced iframe'), !0;
            a.forcescreen = !0;
            a.isiframe &&
              ((a.iframe = { doc: e(b), html: a.doc.contents().find('html')[0], body: a.doc.contents().find('body')[0] }),
              (a.getContentSize = function () {
                return { w: Math.max(a.iframe.html.scrollWidth, a.iframe.body.scrollWidth), h: Math.max(a.iframe.html.scrollHeight, a.iframe.body.scrollHeight) };
              }),
              (a.docscroll = e(a.iframe.body)));
            !d.isios && a.opt.iframeautoresize && !a.isiframe && (a.win.scrollTop(0), a.doc.height(''), (c = Math.max(b.getElementsByTagName('html')[0].scrollHeight, b.body.scrollHeight)), a.doc.height(c));
            a.lazyResize(30);
            d.isie7 && a.css(e(a.iframe.html), { 'overflow-y': 'hidden' });
            a.css(e(a.iframe.body), { 'overflow-y': 'hidden' });
            d.isios && a.haswrapper && a.css(e(b.body), { '-webkit-transform': 'translate3d(0,0,0)' });
            'contentWindow' in this ? a.bind(this.contentWindow, 'scroll', a.onscroll) : a.bind(b, 'scroll', a.onscroll);
            a.opt.enablemousewheel && a.bind(b, 'mousewheel', a.onmousewheel);
            a.opt.enablekeyboard && a.bind(b, d.isopera ? 'keypress' : 'keydown', a.onkeypress);
            if (d.cantouch || a.opt.touchbehavior)
              a.bind(b, 'mousedown', a.ontouchstart),
                a.bind(b, 'mousemove', function (c) {
                  a.ontouchmove(c, !0);
                }),
                a.opt.grabcursorenabled && d.cursorgrabvalue && a.css(e(b.body), { cursor: d.cursorgrabvalue });
            a.bind(b, 'mouseup', a.ontouchend);
            a.zoom && (a.opt.dblclickzoom && a.bind(b, 'dblclick', a.doZoom), a.ongesturezoom && a.bind(b, 'gestureend', a.ongesturezoom));
          };
          this.doc[0].readyState &&
            'complete' == this.doc[0].readyState &&
            setTimeout(function () {
              I.call(a.doc[0], !1);
            }, 500);
          a.bind(this.doc, 'load', I);
        }
      };
      this.showCursor = function (c, b) {
        a.cursortimeout && (clearTimeout(a.cursortimeout), (a.cursortimeout = 0));
        if (a.rail) {
          a.autohidedom && (a.autohidedom.stop().css({ opacity: a.opt.cursoropacitymax }), (a.cursoractive = !0));
          if (!a.rail.drag || 1 != a.rail.drag.pt) 'undefined' != typeof c && !1 !== c && (a.scroll.y = Math.round((1 * c) / a.scrollratio.y)), 'undefined' != typeof b && (a.scroll.x = Math.round((1 * b) / a.scrollratio.x));
          a.cursor.css({ height: a.cursorheight, top: a.scroll.y });
          a.cursorh && (!a.rail.align && a.rail.visibility ? a.cursorh.css({ width: a.cursorwidth, left: a.scroll.x + a.rail.width }) : a.cursorh.css({ width: a.cursorwidth, left: a.scroll.x }), (a.cursoractive = !0));
          a.zoom && a.zoom.stop().css({ opacity: a.opt.cursoropacitymax });
        }
      };
      this.hideCursor = function (c) {
        !a.cursortimeout &&
          a.rail &&
          a.autohidedom &&
          !(a.hasmousefocus && 'leave' == a.opt.autohidemode) &&
          (a.cursortimeout = setTimeout(function () {
            if (!a.rail.active || !a.showonmouseevent) a.autohidedom.stop().animate({ opacity: a.opt.cursoropacitymin }), a.zoom && a.zoom.stop().animate({ opacity: a.opt.cursoropacitymin }), (a.cursoractive = !1);
            a.cursortimeout = 0;
          }, c || a.opt.hidecursordelay));
      };
      this.noticeCursor = function (c, b, f) {
        a.showCursor(b, f);
        a.rail.active || a.hideCursor(c);
      };
      this.getContentSize = a.ispage
        ? function () {
            return { w: Math.max(document.body.scrollWidth, document.documentElement.scrollWidth), h: Math.max(document.body.scrollHeight, document.documentElement.scrollHeight) };
          }
        : a.haswrapper
        ? function () {
            return { w: a.doc.outerWidth() + parseInt(a.win.css('paddingLeft')) + parseInt(a.win.css('paddingRight')), h: a.doc.outerHeight() + parseInt(a.win.css('paddingTop')) + parseInt(a.win.css('paddingBottom')) };
          }
        : function () {
            return { w: a.docscroll[0].scrollWidth, h: a.docscroll[0].scrollHeight };
          };
      this.onResize = function (c, b) {
        if (!a || !a.win) return !1;
        if (!a.haswrapper && !a.ispage) {
          if ('none' == a.win.css('display')) return a.visibility && a.hideRail().hideRailHr(), !1;
          !a.hidden && !a.visibility && a.showRail().showRailHr();
        }
        var f = a.page.maxh,
          d = a.page.maxw,
          e = a.view.w;
        a.view = { w: a.ispage ? a.win.width() : parseInt(a.win[0].clientWidth), h: a.ispage ? a.win.height() : parseInt(a.win[0].clientHeight) };
        a.page = b ? b : a.getContentSize();
        a.page.maxh = Math.max(0, a.page.h - a.view.h);
        a.page.maxw = Math.max(0, a.page.w - a.view.w);
        if (a.page.maxh == f && a.page.maxw == d && a.view.w == e) {
          if (a.ispage) return a;
          f = a.win.offset();
          if (a.lastposition && ((d = a.lastposition), d.top == f.top && d.left == f.left)) return a;
          a.lastposition = f;
        }
        0 == a.page.maxh ? (a.hideRail(), (a.scrollvaluemax = 0), (a.scroll.y = 0), (a.scrollratio.y = 0), (a.cursorheight = 0), a.setScrollTop(0), (a.rail.scrollable = !1)) : (a.rail.scrollable = !0);
        0 == a.page.maxw ? (a.hideRailHr(), (a.scrollvaluemaxw = 0), (a.scroll.x = 0), (a.scrollratio.x = 0), (a.cursorwidth = 0), a.setScrollLeft(0), (a.railh.scrollable = !1)) : (a.railh.scrollable = !0);
        a.locked = 0 == a.page.maxh && 0 == a.page.maxw;
        if (a.locked) return a.ispage || a.updateScrollBar(a.view), !1;
        !a.hidden && !a.visibility ? a.showRail().showRailHr() : !a.hidden && !a.railh.visibility && a.showRailHr();
        a.istextarea && a.win.css('resize') && 'none' != a.win.css('resize') && (a.view.h -= 20);
        a.cursorheight = Math.min(a.view.h, Math.round(a.view.h * (a.view.h / a.page.h)));
        a.cursorheight = a.opt.cursorfixedheight ? a.opt.cursorfixedheight : Math.max(a.opt.cursorminheight, a.cursorheight);
        a.cursorwidth = Math.min(a.view.w, Math.round(a.view.w * (a.view.w / a.page.w)));
        a.cursorwidth = a.opt.cursorfixedheight ? a.opt.cursorfixedheight : Math.max(a.opt.cursorminheight, a.cursorwidth);
        a.scrollvaluemax = a.view.h - a.cursorheight - a.cursor.hborder;
        a.railh && ((a.railh.width = 0 < a.page.maxh ? a.view.w - a.rail.width : a.view.w), (a.scrollvaluemaxw = a.railh.width - a.cursorwidth - a.cursorh.wborder));
        a.ispage || a.updateScrollBar(a.view);
        a.scrollratio = { x: a.page.maxw / a.scrollvaluemaxw, y: a.page.maxh / a.scrollvaluemax };
        a.getScrollTop() > a.page.maxh
          ? a.doScrollTop(a.page.maxh)
          : ((a.scroll.y = Math.round(a.getScrollTop() * (1 / a.scrollratio.y))), (a.scroll.x = Math.round(a.getScrollLeft() * (1 / a.scrollratio.x))), a.cursoractive && a.noticeCursor());
        a.scroll.y && 0 == a.getScrollTop() && a.doScrollTo(Math.floor(a.scroll.y * a.scrollratio.y));
        return a;
      };
      this.resize = a.onResize;
      this.lazyResize = function (c) {
        c = isNaN(c) ? 30 : c;
        a.delayed('resize', a.resize, c);
        return a;
      };
      this._bind = function (c, b, f, d) {
        a.events.push({ e: c, n: b, f: f, b: d, q: !1 });
        c.addEventListener ? c.addEventListener(b, f, d || !1) : c.attachEvent ? c.attachEvent('on' + b, f) : (c['on' + b] = f);
      };
      this.jqbind = function (c, b, f) {
        a.events.push({ e: c, n: b, f: f, q: !0 });
        e(c).bind(b, f);
      };
      this.bind = function (c, b, f, e) {
        var h = 'jquery' in c ? c[0] : c;
        'mousewheel' == b
          ? 'onwheel' in a.win
            ? a._bind(h, 'wheel', f, e || !1)
            : ((c = 'undefined' != typeof document.onmousewheel ? 'mousewheel' : 'DOMMouseScroll'), l(h, c, f, e || !1), 'DOMMouseScroll' == c && l(h, 'MozMousePixelScroll', f, e || !1))
          : h.addEventListener
          ? (d.cantouch &&
              /mouseup|mousedown|mousemove/.test(b) &&
              a._bind(
                h,
                'mousedown' == b ? 'touchstart' : 'mouseup' == b ? 'touchend' : 'touchmove',
                function (a) {
                  if (a.touches) {
                    if (2 > a.touches.length) {
                      var c = a.touches.length ? a.touches[0] : a;
                      c.original = a;
                      f.call(this, c);
                    }
                  } else a.changedTouches && ((c = a.changedTouches[0]), (c.original = a), f.call(this, c));
                },
                e || !1
              ),
            a._bind(h, b, f, e || !1),
            d.cantouch && 'mouseup' == b && a._bind(h, 'touchcancel', f, e || !1))
          : a._bind(h, b, function (c) {
              if ((c = c || window.event || !1) && c.srcElement) c.target = c.srcElement;
              'pageY' in c || ((c.pageX = c.clientX + document.documentElement.scrollLeft), (c.pageY = c.clientY + document.documentElement.scrollTop));
              return !1 === f.call(h, c) || !1 === e ? a.cancelEvent(c) : !0;
            });
      };
      this._unbind = function (a, b, f, d) {
        a.removeEventListener ? a.removeEventListener(b, f, d) : a.detachEvent ? a.detachEvent('on' + b, f) : (a['on' + b] = !1);
      };
      this.unbindAll = function () {
        for (var c = 0; c < a.events.length; c++) {
          var b = a.events[c];
          b.q ? b.e.unbind(b.n, b.f) : a._unbind(b.e, b.n, b.f, b.b);
        }
      };
      this.cancelEvent = function (a) {
        a = a.original ? a.original : a ? a : window.event || !1;
        if (!a) return !1;
        a.preventDefault && a.preventDefault();
        a.stopPropagation && a.stopPropagation();
        a.preventManipulation && a.preventManipulation();
        a.cancelBubble = !0;
        a.cancel = !0;
        return (a.returnValue = !1);
      };
      this.stopPropagation = function (a) {
        a = a.original ? a.original : a ? a : window.event || !1;
        if (!a) return !1;
        if (a.stopPropagation) return a.stopPropagation();
        a.cancelBubble && (a.cancelBubble = !0);
        return !1;
      };
      this.showRail = function () {
        if (0 != a.page.maxh && (a.ispage || 'none' != a.win.css('display'))) (a.visibility = !0), (a.rail.visibility = !0), a.rail.css('display', 'block');
        return a;
      };
      this.showRailHr = function () {
        if (!a.railh) return a;
        if (0 != a.page.maxw && (a.ispage || 'none' != a.win.css('display'))) (a.railh.visibility = !0), a.railh.css('display', 'block');
        return a;
      };
      this.hideRail = function () {
        a.visibility = !1;
        a.rail.visibility = !1;
        a.rail.css('display', 'none');
        return a;
      };
      this.hideRailHr = function () {
        if (!a.railh) return a;
        a.railh.visibility = !1;
        a.railh.css('display', 'none');
        return a;
      };
      this.show = function () {
        a.hidden = !1;
        a.locked = !1;
        return a.showRail().showRailHr();
      };
      this.hide = function () {
        a.hidden = !0;
        a.locked = !0;
        return a.hideRail().hideRailHr();
      };
      this.toggle = function () {
        return a.hidden ? a.show() : a.hide();
      };
      this.remove = function () {
        a.stop();
        a.cursortimeout && clearTimeout(a.cursortimeout);
        a.doZoomOut();
        a.unbindAll();
        d.isie9 && a.win[0].detachEvent('onpropertychange', a.onAttributeChange);
        !1 !== a.observer && a.observer.disconnect();
        !1 !== a.observerremover && a.observerremover.disconnect();
        a.events = null;
        a.cursor && a.cursor.remove();
        a.cursorh && a.cursorh.remove();
        a.rail && a.rail.remove();
        a.railh && a.railh.remove();
        a.zoom && a.zoom.remove();
        for (var c = 0; c < a.saved.css.length; c++) {
          var b = a.saved.css[c];
          b[0].css(b[1], 'undefined' == typeof b[2] ? '' : b[2]);
        }
        a.saved = !1;
        a.me.data('__nicescroll', '');
        var f = e.nicescroll;
        f.each(function (c) {
          if (this && this.id === a.id) {
            delete f[c];
            for (var b = ++c; b < f.length; b++, c++) f[c] = f[b];
            f.length--;
            f.length && delete f[f.length];
          }
        });
        for (var h in a) (a[h] = null), delete a[h];
        a = null;
      };
      this.scrollstart = function (c) {
        this.onscrollstart = c;
        return a;
      };
      this.scrollend = function (c) {
        this.onscrollend = c;
        return a;
      };
      this.scrollcancel = function (c) {
        this.onscrollcancel = c;
        return a;
      };
      this.zoomin = function (c) {
        this.onzoomin = c;
        return a;
      };
      this.zoomout = function (c) {
        this.onzoomout = c;
        return a;
      };
      this.isScrollable = function (a) {
        a = a.target ? a.target : a;
        if ('OPTION' == a.nodeName) return !0;
        for (; a && 1 == a.nodeType && !/^BODY|HTML/.test(a.nodeName); ) {
          var b = e(a),
            b = b.css('overflowY') || b.css('overflowX') || b.css('overflow') || '';
          if (/scroll|auto/.test(b)) return a.clientHeight != a.scrollHeight;
          a = a.parentNode ? a.parentNode : !1;
        }
        return !1;
      };
      this.getViewport = function (a) {
        for (a = a && a.parentNode ? a.parentNode : !1; a && 1 == a.nodeType && !/^BODY|HTML/.test(a.nodeName); ) {
          var b = e(a);
          if (/fixed|absolute/.test(b.css('position'))) return b;
          var f = b.css('overflowY') || b.css('overflowX') || b.css('overflow') || '';
          if ((/scroll|auto/.test(f) && a.clientHeight != a.scrollHeight) || 0 < b.getNiceScroll().length) return b;
          a = a.parentNode ? a.parentNode : !1;
        }
        return a ? e(a) : !1;
      };
      this.triggerScrollEnd = function () {
        if (a.onscrollend) {
          var c = a.getScrollLeft(),
            b = a.getScrollTop();
          a.onscrollend.call(a, { type: 'scrollend', current: { x: c, y: b }, end: { x: c, y: b } });
        }
      };
      this.onmousewheel = function (c) {
        if (!a.wheelprevented) {
          if (a.locked) return a.debounced('checkunlock', a.resize, 250), !0;
          if (a.rail.drag) return a.cancelEvent(c);
          'auto' == a.opt.oneaxismousemode && 0 != c.deltaX && (a.opt.oneaxismousemode = !1);
          if (a.opt.oneaxismousemode && 0 == c.deltaX && !a.rail.scrollable) return a.railh && a.railh.scrollable ? a.onmousewheelhr(c) : !0;
          var b = +new Date(),
            f = !1;
          a.opt.preservenativescrolling && a.checkarea + 600 < b && ((a.nativescrollingarea = a.isScrollable(c)), (f = !0));
          a.checkarea = b;
          if (a.nativescrollingarea) return !0;
          if ((c = q(c, !1, f))) a.checkarea = 0;
          return c;
        }
      };
      this.onmousewheelhr = function (c) {
        if (!a.wheelprevented) {
          if (a.locked || !a.railh.scrollable) return !0;
          if (a.rail.drag) return a.cancelEvent(c);
          var b = +new Date(),
            f = !1;
          a.opt.preservenativescrolling && a.checkarea + 600 < b && ((a.nativescrollingarea = a.isScrollable(c)), (f = !0));
          a.checkarea = b;
          return a.nativescrollingarea ? !0 : a.locked ? a.cancelEvent(c) : q(c, !0, f);
        }
      };
      this.stop = function () {
        a.cancelScroll();
        a.scrollmon && a.scrollmon.stop();
        a.cursorfreezed = !1;
        a.scroll.y = Math.round(a.getScrollTop() * (1 / a.scrollratio.y));
        a.noticeCursor();
        return a;
      };
      this.getTransitionSpeed = function (b) {
        var d = Math.round(10 * a.opt.scrollspeed);
        b = Math.min(d, Math.round((b / 20) * a.opt.scrollspeed));
        return 20 < b ? b : 0;
      };
      a.opt.smoothscroll
        ? a.ishwscroll && d.hastransition && a.opt.usetransition
          ? ((this.prepareTransition = function (b, e) {
              var f = e ? (20 < b ? b : 0) : a.getTransitionSpeed(b),
                h = f ? d.prefixstyle + 'transform ' + f + 'ms ease-out' : '';
              if (!a.lasttransitionstyle || a.lasttransitionstyle != h) (a.lasttransitionstyle = h), a.doc.css(d.transitionstyle, h);
              return f;
            }),
            (this.doScrollLeft = function (b, d) {
              var f = a.scrollrunning ? a.newscrolly : a.getScrollTop();
              a.doScrollPos(b, f, d);
            }),
            (this.doScrollTop = function (b, d) {
              var f = a.scrollrunning ? a.newscrollx : a.getScrollLeft();
              a.doScrollPos(f, b, d);
            }),
            (this.doScrollPos = function (b, e, f) {
              var h = a.getScrollTop(),
                g = a.getScrollLeft();
              (0 > (a.newscrolly - h) * (e - h) || 0 > (a.newscrollx - g) * (b - g)) && a.cancelScroll();
              !1 == a.opt.bouncescroll && (0 > e ? (e = 0) : e > a.page.maxh && (e = a.page.maxh), 0 > b ? (b = 0) : b > a.page.maxw && (b = a.page.maxw));
              if (a.scrollrunning && b == a.newscrollx && e == a.newscrolly) return !1;
              a.newscrolly = e;
              a.newscrollx = b;
              a.newscrollspeed = f || !1;
              if (a.timer) return !1;
              a.timer = setTimeout(function () {
                var f = a.getScrollTop(),
                  h = a.getScrollLeft(),
                  g,
                  k;
                g = b - h;
                k = e - f;
                g = Math.round(Math.sqrt(Math.pow(g, 2) + Math.pow(k, 2)));
                g = a.newscrollspeed && 1 < a.newscrollspeed ? a.newscrollspeed : a.getTransitionSpeed(g);
                a.newscrollspeed && 1 >= a.newscrollspeed && (g *= a.newscrollspeed);
                a.prepareTransition(g, !0);
                a.timerscroll && a.timerscroll.tm && clearInterval(a.timerscroll.tm);
                0 < g &&
                  (!a.scrollrunning && a.onscrollstart && a.onscrollstart.call(a, { type: 'scrollstart', current: { x: h, y: f }, request: { x: b, y: e }, end: { x: a.newscrollx, y: a.newscrolly }, speed: g }),
                  d.transitionend
                    ? a.scrollendtrapped || ((a.scrollendtrapped = !0), a.bind(a.doc, d.transitionend, a.onScrollTransitionEnd, !1))
                    : (a.scrollendtrapped && clearTimeout(a.scrollendtrapped), (a.scrollendtrapped = setTimeout(a.onScrollTransitionEnd, g))),
                  (a.timerscroll = { bz: new BezierClass(f, a.newscrolly, g, 0, 0, 0.58, 1), bh: new BezierClass(h, a.newscrollx, g, 0, 0, 0.58, 1) }),
                  a.cursorfreezed ||
                    (a.timerscroll.tm = setInterval(function () {
                      a.showCursor(a.getScrollTop(), a.getScrollLeft());
                    }, 60)));
                a.synched('doScroll-set', function () {
                  a.timer = 0;
                  a.scrollendtrapped && (a.scrollrunning = !0);
                  a.setScrollTop(a.newscrolly);
                  a.setScrollLeft(a.newscrollx);
                  if (!a.scrollendtrapped) a.onScrollTransitionEnd();
                });
              }, 50);
            }),
            (this.cancelScroll = function () {
              if (!a.scrollendtrapped) return !0;
              var b = a.getScrollTop(),
                e = a.getScrollLeft();
              a.scrollrunning = !1;
              d.transitionend || clearTimeout(d.transitionend);
              a.scrollendtrapped = !1;
              a._unbind(a.doc, d.transitionend, a.onScrollTransitionEnd);
              a.prepareTransition(0);
              a.setScrollTop(b);
              a.railh && a.setScrollLeft(e);
              a.timerscroll && a.timerscroll.tm && clearInterval(a.timerscroll.tm);
              a.timerscroll = !1;
              a.cursorfreezed = !1;
              a.showCursor(b, e);
              return a;
            }),
            (this.onScrollTransitionEnd = function () {
              a.scrollendtrapped && a._unbind(a.doc, d.transitionend, a.onScrollTransitionEnd);
              a.scrollendtrapped = !1;
              a.prepareTransition(0);
              a.timerscroll && a.timerscroll.tm && clearInterval(a.timerscroll.tm);
              a.timerscroll = !1;
              var b = a.getScrollTop(),
                e = a.getScrollLeft();
              a.setScrollTop(b);
              a.railh && a.setScrollLeft(e);
              a.noticeCursor(!1, b, e);
              a.cursorfreezed = !1;
              0 > b ? (b = 0) : b > a.page.maxh && (b = a.page.maxh);
              0 > e ? (e = 0) : e > a.page.maxw && (e = a.page.maxw);
              if (b != a.newscrolly || e != a.newscrollx) return a.doScrollPos(e, b, a.opt.snapbackspeed);
              a.onscrollend && a.scrollrunning && a.triggerScrollEnd();
              a.scrollrunning = !1;
            }))
          : ((this.doScrollLeft = function (b, d) {
              var f = a.scrollrunning ? a.newscrolly : a.getScrollTop();
              a.doScrollPos(b, f, d);
            }),
            (this.doScrollTop = function (b, d) {
              var f = a.scrollrunning ? a.newscrollx : a.getScrollLeft();
              a.doScrollPos(f, b, d);
            }),
            (this.doScrollPos = function (b, d, f) {
              function e() {
                if (a.cancelAnimationFrame) return !0;
                a.scrollrunning = !0;
                if ((p = 1 - p)) return (a.timer = s(e) || 1);
                var b = 0,
                  c = (sy = a.getScrollTop());
                if (a.dst.ay) {
                  var c = a.bzscroll ? a.dst.py + a.bzscroll.getNow() * a.dst.ay : a.newscrolly,
                    f = c - sy;
                  if ((0 > f && c < a.newscrolly) || (0 < f && c > a.newscrolly)) c = a.newscrolly;
                  a.setScrollTop(c);
                  c == a.newscrolly && (b = 1);
                } else b = 1;
                var d = (sx = a.getScrollLeft());
                if (a.dst.ax) {
                  d = a.bzscroll ? a.dst.px + a.bzscroll.getNow() * a.dst.ax : a.newscrollx;
                  f = d - sx;
                  if ((0 > f && d < a.newscrollx) || (0 < f && d > a.newscrollx)) d = a.newscrollx;
                  a.setScrollLeft(d);
                  d == a.newscrollx && (b += 1);
                } else b += 1;
                2 == b
                  ? ((a.timer = 0),
                    (a.cursorfreezed = !1),
                    (a.bzscroll = !1),
                    (a.scrollrunning = !1),
                    0 > c ? (c = 0) : c > a.page.maxh && (c = a.page.maxh),
                    0 > d ? (d = 0) : d > a.page.maxw && (d = a.page.maxw),
                    d != a.newscrollx || c != a.newscrolly ? a.doScrollPos(d, c) : a.onscrollend && a.triggerScrollEnd())
                  : (a.timer = s(e) || 1);
              }
              d = 'undefined' == typeof d || !1 === d ? a.getScrollTop(!0) : d;
              if (a.timer && a.newscrolly == d && a.newscrollx == b) return !0;
              a.timer && v(a.timer);
              a.timer = 0;
              var h = a.getScrollTop(),
                g = a.getScrollLeft();
              (0 > (a.newscrolly - h) * (d - h) || 0 > (a.newscrollx - g) * (b - g)) && a.cancelScroll();
              a.newscrolly = d;
              a.newscrollx = b;
              if (!a.bouncescroll || !a.rail.visibility) 0 > a.newscrolly ? (a.newscrolly = 0) : a.newscrolly > a.page.maxh && (a.newscrolly = a.page.maxh);
              if (!a.bouncescroll || !a.railh.visibility) 0 > a.newscrollx ? (a.newscrollx = 0) : a.newscrollx > a.page.maxw && (a.newscrollx = a.page.maxw);
              a.dst = {};
              a.dst.x = b - g;
              a.dst.y = d - h;
              a.dst.px = g;
              a.dst.py = h;
              var k = Math.round(Math.sqrt(Math.pow(a.dst.x, 2) + Math.pow(a.dst.y, 2)));
              a.dst.ax = a.dst.x / k;
              a.dst.ay = a.dst.y / k;
              var l = 0,
                q = k;
              0 == a.dst.x ? ((l = h), (q = d), (a.dst.ay = 1), (a.dst.py = 0)) : 0 == a.dst.y && ((l = g), (q = b), (a.dst.ax = 1), (a.dst.px = 0));
              k = a.getTransitionSpeed(k);
              f && 1 >= f && (k *= f);
              a.bzscroll = 0 < k ? (a.bzscroll ? a.bzscroll.update(q, k) : new BezierClass(l, q, k, 0, 1, 0, 1)) : !1;
              if (!a.timer) {
                ((h == a.page.maxh && d >= a.page.maxh) || (g == a.page.maxw && b >= a.page.maxw)) && a.checkContentSize();
                var p = 1;
                a.cancelAnimationFrame = !1;
                a.timer = 1;
                a.onscrollstart && !a.scrollrunning && a.onscrollstart.call(a, { type: 'scrollstart', current: { x: g, y: h }, request: { x: b, y: d }, end: { x: a.newscrollx, y: a.newscrolly }, speed: k });
                e();
                ((h == a.page.maxh && d >= h) || (g == a.page.maxw && b >= g)) && a.checkContentSize();
                a.noticeCursor();
              }
            }),
            (this.cancelScroll = function () {
              a.timer && v(a.timer);
              a.timer = 0;
              a.bzscroll = !1;
              a.scrollrunning = !1;
              return a;
            }))
        : ((this.doScrollLeft = function (b, d) {
            var f = a.getScrollTop();
            a.doScrollPos(b, f, d);
          }),
          (this.doScrollTop = function (b, d) {
            var f = a.getScrollLeft();
            a.doScrollPos(f, b, d);
          }),
          (this.doScrollPos = function (b, d, f) {
            var e = b > a.page.maxw ? a.page.maxw : b;
            0 > e && (e = 0);
            var h = d > a.page.maxh ? a.page.maxh : d;
            0 > h && (h = 0);
            a.synched('scroll', function () {
              a.setScrollTop(h);
              a.setScrollLeft(e);
            });
          }),
          (this.cancelScroll = function () {}));
      this.doScrollBy = function (b, d) {
        var f = 0,
          f = d ? Math.floor((a.scroll.y - b) * a.scrollratio.y) : (a.timer ? a.newscrolly : a.getScrollTop(!0)) - b;
        if (a.bouncescroll) {
          var e = Math.round(a.view.h / 2);
          f < -e ? (f = -e) : f > a.page.maxh + e && (f = a.page.maxh + e);
        }
        a.cursorfreezed = !1;
        py = a.getScrollTop(!0);
        if (0 > f && 0 >= py) return a.noticeCursor();
        if (f > a.page.maxh && py >= a.page.maxh) return a.checkContentSize(), a.noticeCursor();
        a.doScrollTop(f);
      };
      this.doScrollLeftBy = function (b, d) {
        var f = 0,
          f = d ? Math.floor((a.scroll.x - b) * a.scrollratio.x) : (a.timer ? a.newscrollx : a.getScrollLeft(!0)) - b;
        if (a.bouncescroll) {
          var e = Math.round(a.view.w / 2);
          f < -e ? (f = -e) : f > a.page.maxw + e && (f = a.page.maxw + e);
        }
        a.cursorfreezed = !1;
        px = a.getScrollLeft(!0);
        if ((0 > f && 0 >= px) || (f > a.page.maxw && px >= a.page.maxw)) return a.noticeCursor();
        a.doScrollLeft(f);
      };
      this.doScrollTo = function (b, d) {
        d && Math.round(b * a.scrollratio.y);
        a.cursorfreezed = !1;
        a.doScrollTop(b);
      };
      this.checkContentSize = function () {
        var b = a.getContentSize();
        (b.h != a.page.h || b.w != a.page.w) && a.resize(!1, b);
      };
      a.onscroll = function (b) {
        a.rail.drag ||
          a.cursorfreezed ||
          a.synched('scroll', function () {
            a.scroll.y = Math.round(a.getScrollTop() * (1 / a.scrollratio.y));
            a.railh && (a.scroll.x = Math.round(a.getScrollLeft() * (1 / a.scrollratio.x)));
            a.noticeCursor();
          });
      };
      a.bind(a.docscroll, 'scroll', a.onscroll);
      this.doZoomIn = function (b) {
        if (!a.zoomactive) {
          a.zoomactive = !0;
          a.zoomrestore = { style: {} };
          var h = 'position top left zIndex backgroundColor marginTop marginBottom marginLeft marginRight'.split(' '),
            f = a.win[0].style,
            g;
          for (g in h) {
            var k = h[g];
            a.zoomrestore.style[k] = 'undefined' != typeof f[k] ? f[k] : '';
          }
          a.zoomrestore.style.width = a.win.css('width');
          a.zoomrestore.style.height = a.win.css('height');
          a.zoomrestore.padding = { w: a.win.outerWidth() - a.win.width(), h: a.win.outerHeight() - a.win.height() };
          d.isios4 && ((a.zoomrestore.scrollTop = e(window).scrollTop()), e(window).scrollTop(0));
          a.win.css({ position: d.isios4 ? 'absolute' : 'fixed', top: 0, left: 0, 'z-index': x + 100, margin: '0px' });
          h = a.win.css('backgroundColor');
          ('' == h || /transparent|rgba\(0, 0, 0, 0\)|rgba\(0,0,0,0\)/.test(h)) && a.win.css('backgroundColor', '#fff');
          a.rail.css({ 'z-index': x + 101 });
          a.zoom.css({ 'z-index': x + 102 });
          a.zoom.css('backgroundPosition', '0px -18px');
          a.resizeZoom();
          a.onzoomin && a.onzoomin.call(a);
          return a.cancelEvent(b);
        }
      };
      this.doZoomOut = function (b) {
        if (a.zoomactive)
          return (
            (a.zoomactive = !1),
            a.win.css('margin', ''),
            a.win.css(a.zoomrestore.style),
            d.isios4 && e(window).scrollTop(a.zoomrestore.scrollTop),
            a.rail.css({ 'z-index': a.zindex }),
            a.zoom.css({ 'z-index': a.zindex }),
            (a.zoomrestore = !1),
            a.zoom.css('backgroundPosition', '0px 0px'),
            a.onResize(),
            a.onzoomout && a.onzoomout.call(a),
            a.cancelEvent(b)
          );
      };
      this.doZoom = function (b) {
        return a.zoomactive ? a.doZoomOut(b) : a.doZoomIn(b);
      };
      this.resizeZoom = function () {
        if (a.zoomactive) {
          var b = a.getScrollTop();
          a.win.css({ width: e(window).width() - a.zoomrestore.padding.w + 'px', height: e(window).height() - a.zoomrestore.padding.h + 'px' });
          a.onResize();
          a.setScrollTop(Math.min(a.page.maxh, b));
        }
      };
      this.init();
      e.nicescroll.push(this);
    },
    H = function (e) {
      var b = this;
      this.nc = e;
      this.steptime = this.lasttime = this.speedy = this.speedx = this.lasty = this.lastx = 0;
      this.snapy = this.snapx = !1;
      this.demuly = this.demulx = 0;
      this.lastscrolly = this.lastscrollx = -1;
      this.timer = this.chky = this.chkx = 0;
      this.time = function () {
        return +new Date();
      };
      this.reset = function (e, g) {
        b.stop();
        var l = b.time();
        b.steptime = 0;
        b.lasttime = l;
        b.speedx = 0;
        b.speedy = 0;
        b.lastx = e;
        b.lasty = g;
        b.lastscrollx = -1;
        b.lastscrolly = -1;
      };
      this.update = function (e, g) {
        var l = b.time();
        b.steptime = l - b.lasttime;
        b.lasttime = l;
        var l = g - b.lasty,
          q = e - b.lastx,
          a = b.nc.getScrollTop(),
          p = b.nc.getScrollLeft(),
          a = a + l,
          p = p + q;
        b.snapx = 0 > p || p > b.nc.page.maxw;
        b.snapy = 0 > a || a > b.nc.page.maxh;
        b.speedx = q;
        b.speedy = l;
        b.lastx = e;
        b.lasty = g;
      };
      this.stop = function () {
        b.nc.unsynched('domomentum2d');
        b.timer && clearTimeout(b.timer);
        b.timer = 0;
        b.lastscrollx = -1;
        b.lastscrolly = -1;
      };
      this.doSnapy = function (e, g) {
        var l = !1;
        0 > g ? ((g = 0), (l = !0)) : g > b.nc.page.maxh && ((g = b.nc.page.maxh), (l = !0));
        0 > e ? ((e = 0), (l = !0)) : e > b.nc.page.maxw && ((e = b.nc.page.maxw), (l = !0));
        l ? b.nc.doScrollPos(e, g, b.nc.opt.snapbackspeed) : b.nc.triggerScrollEnd();
      };
      this.doMomentum = function (e) {
        var g = b.time(),
          l = e ? g + e : b.lasttime;
        e = b.nc.getScrollLeft();
        var q = b.nc.getScrollTop(),
          a = b.nc.page.maxh,
          p = b.nc.page.maxw;
        b.speedx = 0 < p ? Math.min(60, b.speedx) : 0;
        b.speedy = 0 < a ? Math.min(60, b.speedy) : 0;
        l = l && 60 >= g - l;
        if (0 > q || q > a || 0 > e || e > p) l = !1;
        e = b.speedx && l ? b.speedx : !1;
        if ((b.speedy && l && b.speedy) || e) {
          var d = Math.max(16, b.steptime);
          50 < d && ((e = d / 50), (b.speedx *= e), (b.speedy *= e), (d = 50));
          b.demulxy = 0;
          b.lastscrollx = b.nc.getScrollLeft();
          b.chkx = b.lastscrollx;
          b.lastscrolly = b.nc.getScrollTop();
          b.chky = b.lastscrolly;
          var r = b.lastscrollx,
            t = b.lastscrolly,
            s = function () {
              var c = 600 < b.time() - g ? 0.04 : 0.02;
              if (b.speedx && ((r = Math.floor(b.lastscrollx - b.speedx * (1 - b.demulxy))), (b.lastscrollx = r), 0 > r || r > p)) c = 0.1;
              if (b.speedy && ((t = Math.floor(b.lastscrolly - b.speedy * (1 - b.demulxy))), (b.lastscrolly = t), 0 > t || t > a)) c = 0.1;
              b.demulxy = Math.min(1, b.demulxy + c);
              b.nc.synched('domomentum2d', function () {
                b.speedx && (b.nc.getScrollLeft() != b.chkx && b.stop(), (b.chkx = r), b.nc.setScrollLeft(r));
                b.speedy && (b.nc.getScrollTop() != b.chky && b.stop(), (b.chky = t), b.nc.setScrollTop(t));
                b.timer || (b.nc.hideCursor(), b.doSnapy(r, t));
              });
              1 > b.demulxy ? (b.timer = setTimeout(s, d)) : (b.stop(), b.nc.hideCursor(), b.doSnapy(r, t));
            };
          s();
        } else b.doSnapy(b.nc.getScrollLeft(), b.nc.getScrollTop());
      };
    },
    w = e.fn.scrollTop;
  e.cssHooks.pageYOffset = {
    get: function (g, b, h) {
      return (b = e.data(g, '__nicescroll') || !1) && b.ishwscroll ? b.getScrollTop() : w.call(g);
    },
    set: function (g, b) {
      var h = e.data(g, '__nicescroll') || !1;
      h && h.ishwscroll ? h.setScrollTop(parseInt(b)) : w.call(g, b);
      return this;
    },
  };
  e.fn.scrollTop = function (g) {
    if ('undefined' == typeof g) {
      var b = this[0] ? e.data(this[0], '__nicescroll') || !1 : !1;
      return b && b.ishwscroll ? b.getScrollTop() : w.call(this);
    }
    return this.each(function () {
      var b = e.data(this, '__nicescroll') || !1;
      b && b.ishwscroll ? b.setScrollTop(parseInt(g)) : w.call(e(this), g);
    });
  };
  var A = e.fn.scrollLeft;
  e.cssHooks.pageXOffset = {
    get: function (g, b, h) {
      return (b = e.data(g, '__nicescroll') || !1) && b.ishwscroll ? b.getScrollLeft() : A.call(g);
    },
    set: function (g, b) {
      var h = e.data(g, '__nicescroll') || !1;
      h && h.ishwscroll ? h.setScrollLeft(parseInt(b)) : A.call(g, b);
      return this;
    },
  };
  e.fn.scrollLeft = function (g) {
    if ('undefined' == typeof g) {
      var b = this[0] ? e.data(this[0], '__nicescroll') || !1 : !1;
      return b && b.ishwscroll ? b.getScrollLeft() : A.call(this);
    }
    return this.each(function () {
      var b = e.data(this, '__nicescroll') || !1;
      b && b.ishwscroll ? b.setScrollLeft(parseInt(g)) : A.call(e(this), g);
    });
  };
  var B = function (g) {
    var b = this;
    this.length = 0;
    this.name = 'nicescrollarray';
    this.each = function (e) {
      for (var g = 0, a = 0; g < b.length; g++) e.call(b[g], a++);
      return b;
    };
    this.push = function (e) {
      b[b.length] = e;
      b.length++;
    };
    this.eq = function (e) {
      return b[e];
    };
    if (g)
      for (var h = 0; h < g.length; h++) {
        var k = e.data(g[h], '__nicescroll') || !1;
        k && ((this[this.length] = k), this.length++);
      }
    return this;
  };
  (function (e, b, h) {
    for (var k = 0; k < b.length; k++) h(e, b[k]);
  })(B.prototype, 'show hide toggle onResize resize remove stop doScrollPos'.split(' '), function (e, b) {
    e[b] = function () {
      var e = arguments;
      return this.each(function () {
        this[b].apply(this, e);
      });
    };
  });
  e.fn.getNiceScroll = function (g) {
    return 'undefined' == typeof g ? new B(this) : (this[g] && e.data(this[g], '__nicescroll')) || !1;
  };
  e.extend(e.expr[':'], {
    nicescroll: function (g) {
      return e.data(g, '__nicescroll') ? !0 : !1;
    },
  });
  e.fn.niceScroll = function (g, b) {
    'undefined' == typeof b && 'object' == typeof g && !('jquery' in g) && ((b = g), (g = !1));
    var h = new B();
    'undefined' == typeof b && (b = {});
    g && ((b.doc = e(g)), (b.win = e(this)));
    var k = !('doc' in b);
    !k && !('win' in b) && (b.win = e(this));
    this.each(function () {
      var g = e(this).data('__nicescroll') || !1;
      g || ((b.doc = k ? e(this) : b.doc), (g = new N(b, e(this))), e(this).data('__nicescroll', g));
      h.push(g);
    });
    return 1 == h.length ? h[0] : h;
  };
  window.NiceScroll = {
    getjQuery: function () {
      return e;
    },
  };
  e.nicescroll || ((e.nicescroll = new B()), (e.nicescroll.options = G));
});
