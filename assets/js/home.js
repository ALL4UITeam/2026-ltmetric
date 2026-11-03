(function () {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);
  if (typeof ScrollToPlugin !== 'undefined') gsap.registerPlugin(ScrollToPlugin);

  var sectionAnimating = false;

  function animateToSection(target, duration, ease) {
    sectionAnimating = true;
    return gsap.to(window, {
      duration: duration,
      scrollTo: { y: target, autoKill: false },
      ease: ease || 'power3.out',
      overwrite: 'auto',
      onComplete: function () {
        sectionAnimating = false;
      },
    });
  }

  function initHeroAnimation() {
    var hero = document.querySelector('.hero');
    var lines = gsap.utils.toArray('.hero__line > span');
    var down = hero && hero.querySelector('.hero__down');
    var timeline = hero && hero.querySelector('.hero__timeline');
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!hero || !lines.length) return;

    gsap.set(lines, { y: '110%', opacity: 0 });
    if (down) gsap.set(down, { opacity: 0, y: 16 });
    if (timeline) gsap.set(timeline, { opacity: 0 });
    initHeroTimeline(hero);

    var tl = gsap.timeline({
      delay: reduceMotion ? 0 : 0.2,
      onComplete: function () {
        hero.classList.add('is-revealed');
        gsap.set(lines, { y: 0, opacity: 1 });
        if (timeline) gsap.set(timeline, { opacity: 1 });
        if (down) {
          gsap.to(down, {
            y: 10,
            duration: 1.15,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          });
        }
      },
    });

    tl.to(lines, {
      y: '0%',
      opacity: 1,
      duration: reduceMotion ? 0.01 : 1.05,
      stagger: reduceMotion ? 0 : 0.16,
      ease: 'power4.out',
    }, 0.35);

    if (timeline) {
      tl.to(timeline, {
        opacity: 1,
        duration: reduceMotion ? 0.01 : 0.8,
        ease: 'power2.out',
      }, 0.9);
    }

    if (down) {
      tl.to(down, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power3.out',
      }, 0.85);

      down.addEventListener('click', function (event) {
        event.preventDefault();
        animateToSection('#bizSlide', 0.45);
      });
    }
  }

  function initHeroTimeline(hero) {
    var video = hero.querySelector('.hero__video');
    var bar = hero.querySelector('.hero__timeline-bar');

    if (!video || !bar) return;

    function paint() {
      var duration = video.duration;
      var progress = duration > 0 ? video.currentTime / duration : 0;

      if (!isFinite(progress)) progress = 0;
      bar.style.transform = 'scaleX(' + Math.min(1, Math.max(0, progress)) + ')';
      requestAnimationFrame(paint);
    }

    requestAnimationFrame(paint);
  }

  function initBizSlide() {
    var root = document.querySelector('.biz-slide');
    if (!root || typeof gsap === 'undefined') return;

    var viewport = root.querySelector('.biz-slide__viewport');
    var track = root.querySelector('.biz-slide__track');
    var cards = Array.prototype.slice.call(root.querySelectorAll('.biz-slide__card'));
    var prev = root.querySelector('.biz-dial__btn--prev');
    var next = root.querySelector('.biz-dial__btn--next');
    var busy = false;
    var tween = null;
    var drag = null;
    var timer = null;
    var hoverPaused = false;
    var hiddenPaused = false;
    var dragPaused = false;
    var autoDelay = 5000;

    if (!viewport || !track || !cards.length) return;

    function metrics() {
      var view = viewport.clientWidth || window.innerWidth;
      var room = viewport.clientHeight || 0;
      var size;

      if (view < 768) {
        size = {
          activeW: Math.max(260, view - 72),
          smallW: 64,
          activeH: 420,
          smallH: 420,
          gap: 12,
        };
      } else if (view < 1200) {
        size = {
          activeW: Math.min(720, Math.round(view * 0.68)),
          smallW: 168,
          activeH: 440,
          smallH: 300,
          gap: 16,
        };
      } else {
        size = {
          activeW: 1000,
          smallW: 380,
          activeH: 530,
          smallH: 380,
          gap: 20,
        };
      }

      if (room >= 220 && room < size.activeH) {
        var ratio = room / size.activeH;
        size.smallH = Math.max(120, Math.round(size.smallH * ratio));
        size.activeH = room;
      }

      return size;
    }

    function syncCards() {
      cards = Array.prototype.slice.call(track.querySelectorAll('.biz-slide__card'));
    }

    function layoutX(order, activeEl, widths, gap) {
      var offset = 0;
      var center = 0;
      order.forEach(function (card, i) {
        if (card === activeEl) center = offset + widths[i] / 2;
        offset += widths[i] + gap;
      });
      return viewport.clientWidth / 2 - center;
    }

    function widthsFor(activeEl, size) {
      return cards.map(function (card) {
        return card === activeEl ? size.activeW : size.smallW;
      });
    }

    function queue() {
      clearTimeout(timer);
      if (hoverPaused || hiddenPaused || busy || dragPaused) return;
      timer = setTimeout(function () {
        slideBy(1);
      }, autoDelay);
    }

    function place(activeEl, animate, options) {
      syncCards();
      options = options || {};
      var size = metrics();
      var widths = widthsFor(activeEl, size);
      var targetX = layoutX(cards, activeEl, widths, size.gap);
      var duration = animate ? (options.duration || 1) : 0;
      var ease = options.ease || 'power2.inOut';
      track.style.gap = size.gap + 'px';

      root.classList.add('is-moving');
      cards.forEach(function (card) {
        card.classList.remove('is-settled');
        card.classList.toggle('is-active', card === activeEl);
      });

      if (tween) tween.kill();

      if (!animate) {
        cards.forEach(function (card, i) {
          gsap.set(card, {
            width: widths[i],
            height: card === activeEl ? size.activeH : size.smallH,
          });
        });
        gsap.set(track, { x: targetX });
        if (activeEl) activeEl.classList.add('is-settled');
        window.requestAnimationFrame(function () {
          root.classList.remove('is-moving');
        });
        return;
      }

      busy = true;
      clearTimeout(timer);
      tween = gsap.timeline({
        onComplete: function () {
          busy = false;
          normalize(activeEl);
          root.classList.remove('is-moving');
          window.requestAnimationFrame(function () {
            if (activeEl) activeEl.classList.add('is-settled');
          });
          queue();
        },
      });

      cards.forEach(function (card, i) {
        tween.to(card, {
          width: widths[i],
          height: card === activeEl ? size.activeH : size.smallH,
          duration: duration,
          ease: ease,
        }, 0);
      });
      tween.to(track, {
        x: targetX,
        duration: duration,
        ease: ease,
      }, 0);
    }

    function normalize(activeEl) {
      syncCards();
      var size = metrics();
      var guard = 0;

      while (cards.indexOf(activeEl) > 2 && guard < cards.length) {
        var first = cards[0];
        var shift = (first === activeEl ? size.activeW : size.smallW) + size.gap;
        track.appendChild(first);
        gsap.set(track, { x: '+=' + shift });
        syncCards();
        guard += 1;
      }

      while (cards.indexOf(activeEl) < 2 && guard < cards.length * 2) {
        var last = cards[cards.length - 1];
        var shiftBack = (last === activeEl ? size.activeW : size.smallW) + size.gap;
        track.insertBefore(last, track.firstChild);
        gsap.set(track, { x: '-=' + shiftBack });
        syncCards();
        guard += 1;
      }
    }

    function slideBy(dir, options) {
      if (busy) return;
      syncCards();
      var active = track.querySelector('.biz-slide__card.is-active') || cards[0];
      var next = cards[cards.indexOf(active) + dir];
      if (!next) return;
      place(next, true, options);
    }

    function slideTo(target) {
      if (busy || !target) return;
      var active = track.querySelector('.biz-slide__card.is-active');
      if (target === active) return;
      place(target, true);
    }

    if (prev) prev.addEventListener('click', function () { slideBy(-1); });
    if (next) next.addEventListener('click', function () { slideBy(1); });

    var blockClick = false;

    root.querySelectorAll('a, img').forEach(function (el) {
      el.setAttribute('draggable', 'false');
      el.addEventListener('dragstart', function (event) {
        event.preventDefault();
      });
    });

    cards.forEach(function (card) {
      card.addEventListener('click', function (event) {
        if (blockClick || (drag && drag.moved)) {
          event.preventDefault();
          blockClick = false;
          return;
        }
        if (card.classList.contains('is-active')) return;
        event.preventDefault();
        slideTo(card);
      });
    });

    viewport.addEventListener('pointerdown', function (event) {
      if (busy) return;
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      clearTimeout(timer);
      dragPaused = true;
      drag = {
        id: event.pointerId,
        x: event.clientX,
        y: event.clientY,
        dx: 0,
        lock: null,
        moved: false,
        originX: parseFloat(gsap.getProperty(track, 'x')) || 0,
        lastX: event.clientX,
        lastT: window.performance.now(),
        velocity: 0,
      };
    });

    viewport.addEventListener('pointermove', function (event) {
      if (!drag || drag.id !== event.pointerId) return;
      var dx = event.clientX - drag.x;
      var dy = event.clientY - drag.y;
      if (!drag.lock && Math.hypot(dx, dy) > 8) {
        drag.lock = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
        if (drag.lock === 'x') {
          viewport.classList.add('is-dragging');
          root.classList.add('is-moving');
          if (viewport.setPointerCapture) {
            try { viewport.setPointerCapture(event.pointerId); } catch (err) {}
          }
        }
      }
      if (drag.lock !== 'x') return;
      var now = window.performance.now();
      drag.velocity = (event.clientX - drag.lastX) / Math.max(1, now - drag.lastT);
      drag.lastX = event.clientX;
      drag.lastT = now;
      drag.dx = dx;
      drag.moved = Math.abs(dx) > 12;
      gsap.set(track, { x: drag.originX + dx });
      event.preventDefault();
    });

    function endDrag(event) {
      if (!drag || (event && drag.id !== event.pointerId)) return;
      var dx = drag.dx;
      var originX = drag.originX;
      var velocity = drag.velocity;
      var horizontal = drag.lock === 'x';
      viewport.classList.remove('is-dragging');
      if (event && viewport.releasePointerCapture) {
        try { viewport.releasePointerCapture(event.pointerId); } catch (err) {}
      }
      if (horizontal && Math.abs(dx) > 12) blockClick = true;
      window.setTimeout(function () {
        if (drag) drag.moved = false;
        drag = null;
      }, 40);
      dragPaused = false;

      if (!horizontal) return;

      var size = metrics();
      var step = Math.abs(size.activeW - size.smallW) * 0.55 + size.gap;
      var dir = 0;
      if (velocity < -0.45) dir = 1;
      else if (velocity > 0.45) dir = -1;
      else if (dx < -step * 0.2) dir = 1;
      else if (dx > step * 0.2) dir = -1;

      if (dir) {
        slideBy(dir, { duration: 0.6, ease: 'power2.out' });
        return;
      }

      gsap.to(track, {
        x: originX,
        duration: 0.45,
        ease: 'power3.out',
        overwrite: 'auto',
        onComplete: function () {
          root.classList.remove('is-moving');
          queue();
        },
      });
    }

    viewport.addEventListener('pointerup', endDrag);
    viewport.addEventListener('pointercancel', endDrag);

    viewport.addEventListener('mouseenter', function () {
      hoverPaused = true;
      clearTimeout(timer);
    });
    viewport.addEventListener('mouseleave', function () {
      hoverPaused = false;
      queue();
    });
    document.addEventListener('visibilitychange', function () {
      hiddenPaused = document.hidden;
      if (hiddenPaused) clearTimeout(timer);
      else queue();
    });

    window.addEventListener('resize', function () {
      if (tween) tween.kill();
      busy = false;
      var active = track.querySelector('.biz-slide__card.is-active') || cards[0];
      place(active, false);
      normalize(active);
      queue();
    });

    if (typeof ScrollTrigger !== 'undefined') {
      gsap.from(root.querySelector('.biz-slide__head'), {
        y: 36,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: root,
          start: 'top 78%',
        },
      });
    }

    place(cards[0], false);
    normalize(cards[0]);
    queue();
    window.addEventListener('load', function () {
      if (busy) return;
      var active = track.querySelector('.biz-slide__card.is-active') || cards[0];
      place(active, false);
      normalize(active);
    });
  }

  function initCarbonCardHover(cards) {
    cards.forEach(function (card) {
      var media = card.querySelector('.carbon__card-media');

      card.addEventListener('mouseenter', function () {
        card.classList.add('is-hover');

        gsap.to(media, {
          y: -8,
          duration: 0.5,
          ease: 'power2.out',
        });
      });

      card.addEventListener('mouseleave', function () {
        card.classList.remove('is-hover');

        gsap.to(media, {
          y: 0,
          duration: 0.5,
          ease: 'power2.out',
        });
      });
    });
  }

  function getNeededTravel(col, viewport) {
    var footerClearance = 160;
    return Math.max(0, col.scrollHeight - viewport.clientHeight + footerClearance);
  }

  function initCarbonScroll() {
    var section = document.querySelector('.carbon');
    var pinWrap = section && section.querySelector('.carbon__pin');
    var bgPhoto = section && section.querySelector('.carbon__bg-photo');
    var bgGradient = section && section.querySelector('.carbon__bg-gradient');
    var bubble = section && section.querySelector('.carbon__bubbles');
    var viewport = section && section.querySelector('.carbon__viewport');
    var leftCol = section && section.querySelector('.carbon__col--left');
    var rightCol = section && section.querySelector('.carbon__col--right');
    var header = section && section.querySelector('.carbon__header');
    var cards = gsap.utils.toArray('.carbon__card');

    if (!section || !pinWrap || !viewport || !leftCol || !rightCol || !cards.length) return;

    var mm = gsap.matchMedia();

    mm.add('(min-width: 1024px)', function () {
      initCarbonCardHover(cards);

      function getScrollEnd() {
        var leftTravel = getNeededTravel(leftCol, viewport);
        var rightTravel = getNeededTravel(rightCol, viewport);
        return Math.max(leftTravel, rightTravel) + 80;
      }

      var tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: function () {
            return '+=' + getScrollEnd();
          },
          pin: pinWrap,
          scrub: 1.4,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: function (self) {
            var progress = self.progress;
            var bgProgress = gsap.utils.clamp(0, 1, progress / 0.22);
            var headerOpacity = gsap.utils.clamp(0, 1, 1 - Math.max(0, progress - 0.04) / 0.18);

            if (header) {
              gsap.to(header, {
                opacity: headerOpacity,
                duration: 0.25,
                overwrite: 'auto',
              });
            }

            gsap.to(bgPhoto, {
              opacity: 1 - bgProgress,
              scale: 1.05 + bgProgress * 0.04,
              duration: 0.3,
              overwrite: 'auto',
            });

            gsap.to(bgGradient, {
              opacity: bgProgress,
              duration: 0.3,
              overwrite: 'auto',
            });

            if (bubble) {
              gsap.to(bubble, {
                opacity: bgProgress,
                duration: 0.3,
                overwrite: 'auto',
              });
            }
          },
        },
      });

      tl.to(
        leftCol,
        {
          y: function () {
            return -getNeededTravel(leftCol, viewport);
          },
          ease: 'none',
        },
        0,
      );

      tl.to(
        rightCol,
        {
          y: function () {
            return -getNeededTravel(rightCol, viewport);
          },
          ease: 'none',
        },
        0,
      );

      cards.forEach(function (card, index) {
        var drift = [0, 40, 80, 120, 160][index] || 0;
        var driftEnd = index % 2 === 0 ? drift * 1.2 : drift * 2;

        tl.fromTo(
          card,
          { y: drift },
          {
            y: -driftEnd,
            ease: 'none',
          },
          0,
        );
      });

      return function () {
        if (tl.scrollTrigger) tl.scrollTrigger.kill();
        tl.kill();
        cards.forEach(function (card) {
          card.classList.remove('is-hover');
        });
        gsap.set([leftCol, rightCol, bgPhoto, bgGradient, bubble, header].concat(cards), { clearProps: 'all' });
      };
    });

    mm.add('(max-width: 1023px)', function () {
      gsap.set(bgPhoto, { opacity: 0 });
      gsap.set(bgGradient, { opacity: 1 });
      if (bubble) gsap.set(bubble, { opacity: 1 });
    });
  }

  function initSection04() {
    var section = document.querySelector('#mainAbout');
    var pinTarget = section && section.querySelector('.about-wraps');

    if (!section || !pinTarget) return;

    gsap.set('#mainAbout .end-move-thumb', { y: 36, opacity: 0 });
    gsap.set('#mainAbout .end-titles-inner', { y: 20, opacity: 0 });

    var tl = gsap.timeline({
      scrollTrigger: {
        id: 'about_sticky',
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.35,
        pin: pinTarget,
        anticipatePin: 0,
        invalidateOnRefresh: true,
      },
    });

    tl.to('#mainAbout .end-move-thumb--01', { y: 0, opacity: 1, duration: 0.7, ease: 'none' }, 0.05)
      .to('#mainAbout .end-move-thumb--02', { y: 0, opacity: 1, duration: 0.7, ease: 'none' }, 0.22)
      .to('#mainAbout .end-move-thumb--03', { y: 0, opacity: 1, duration: 0.7, ease: 'none' }, 0.39)
      .to('#mainAbout .end-move-thumb--01', { y: -28, opacity: 0, duration: 0.55, ease: 'none' }, 1.85)
      .to('#mainAbout .end-move-thumb--02', { y: -28, opacity: 0, duration: 0.55, ease: 'none' }, 2.02)
      .to('#mainAbout .end-move-thumb--03', { y: -28, opacity: 0, duration: 0.55, ease: 'none' }, 2.19)
      .to('#mainAbout .tit_wraps', { opacity: 0, y: -24, duration: 0.85, ease: 'none' }, 2.75)
      .to('#mainAbout .end-thumbs-wrapper', {
        height: function () {
          var inner = section.querySelector('.about-inner');
          return inner ? inner.offsetHeight : window.innerHeight;
        },
        duration: 1.2,
        ease: 'none',
      }, 2.75)
      .to('#mainAbout .end-thumbs-wrapper .wraps', {
        maxWidth: '100%',
        borderTopRightRadius: 0,
        borderTopLeftRadius: 0,
        duration: 1.2,
        ease: 'none',
      }, 2.75)
      .to('#mainAbout .end-titles-inner', { y: 0, opacity: 1, duration: 0.7, ease: 'none' }, 3.35);

    return function () {
      if (tl.scrollTrigger) tl.scrollTrigger.kill();
      tl.kill();
      gsap.set([
        '#mainAbout .end-move-thumb',
        '#mainAbout .end-titles-inner',
        '#mainAbout .tit_wraps',
        '#mainAbout .end-thumbs-wrapper',
        '#mainAbout .end-thumbs-wrapper .wraps',
      ], { clearProps: 'all' });
    };
  }

  function initSectionSnap() {
    var hero = document.querySelector('.hero');
    var biz = document.querySelector('.biz-slide');
    var about = document.querySelector('#mainAbout');
    if (!hero || !biz || !about) return;

    var timer = null;
    var origin = window.scrollY || window.pageYOffset || 0;
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function settle() {
      if (sectionAnimating) return;

      var y = window.scrollY || window.pageYOffset || 0;
      var from = origin;
      var aboutTop = about.offsetTop;
      var list = [hero.offsetTop, biz.offsetTop, aboutTop];

      if (y > aboutTop + 40) {
        origin = y;
        return;
      }

      var goingDown = y >= from;
      var target = goingDown ? list[list.length - 1] : list[0];
      var index;

      if (goingDown) {
        for (index = 0; index < list.length; index += 1) {
          if (y < list[index] - 8) {
            var prev = list[Math.max(0, index - 1)];
            var span = Math.max(1, list[index] - prev);
            target = (y - prev) > span * 0.18 ? list[index] : prev;
            break;
          }
          target = list[index];
        }
      } else {
        for (index = list.length - 1; index >= 0; index -= 1) {
          if (y > list[index] + 8) {
            var next = list[Math.min(list.length - 1, index + 1)];
            var spanUp = Math.max(1, next - list[index]);
            target = (next - y) > spanUp * 0.18 ? list[index] : next;
            break;
          }
          target = list[index];
        }
      }

      origin = target;
      if (Math.abs(y - target) < 8) return;
      var toBiz = target === biz.offsetTop && from < biz.offsetTop;
      animateToSection(target, reduceMotion ? 0.01 : (toBiz ? 0.45 : 0.7));
    }

    window.addEventListener('scroll', function () {
      if (sectionAnimating) return;
      var y = window.scrollY || window.pageYOffset || 0;
      var bizTop = biz.offsetTop;
      if (origin < bizTop - 8 && y > hero.offsetHeight * 0.18 && y < bizTop - 8) {
        window.clearTimeout(timer);
        timer = null;
        origin = bizTop;
        animateToSection(bizTop, reduceMotion ? 0.01 : 0.45);
        return;
      }
      window.clearTimeout(timer);
      timer = window.setTimeout(function () {
        timer = null;
        settle();
      }, 160);
    }, { passive: true });
  }

  function initHomeScroll() {
    initHeroAnimation();
    initBizSlide();
    initCarbonScroll();
    initSection04();
    initSectionSnap();
    ScrollTrigger.refresh();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHomeScroll);
  } else {
    initHomeScroll();
  }

  window.addEventListener('load', function () {
    ScrollTrigger.refresh();
  });
})();
