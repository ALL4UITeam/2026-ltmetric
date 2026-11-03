(function () {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

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
        gsap.to(window, {
          duration: 0.9,
          scrollTo: { y: '#bizSlide', offsetY: 0 },
          ease: 'power2.inOut',
        });
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
    var autoDelay = 5000;

    if (!viewport || !track || !cards.length) return;

    function metrics() {
      var view = viewport.clientWidth || window.innerWidth;
      if (view < 768) {
        return {
          activeW: Math.max(260, view - 72),
          smallW: 64,
          activeH: 420,
          smallH: 420,
          gap: 12,
        };
      }
      if (view < 1200) {
        return {
          activeW: Math.min(720, Math.round(view * 0.68)),
          smallW: 168,
          activeH: 440,
          smallH: 300,
          gap: 16,
        };
      }
      return {
        activeW: 1000,
        smallW: 380,
        activeH: 530,
        smallH: 380,
        gap: 20,
      };
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
      if (hoverPaused || hiddenPaused || busy) return;
      timer = setTimeout(function () {
        slideBy(1);
      }, autoDelay);
    }

    function place(activeEl, animate) {
      syncCards();
      var size = metrics();
      var widths = widthsFor(activeEl, size);
      var targetX = layoutX(cards, activeEl, widths, size.gap);
      var duration = animate ? 1 : 0;
      track.style.gap = size.gap + 'px';
      viewport.style.height = size.activeH + 'px';

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
          ease: 'power2.inOut',
        }, 0);
      });
      tween.to(track, {
        x: targetX,
        duration: duration,
        ease: 'power2.inOut',
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

    function slideBy(dir) {
      if (busy) return;
      syncCards();
      var active = track.querySelector('.biz-slide__card.is-active') || cards[0];
      var next = cards[cards.indexOf(active) + dir];
      if (!next) return;
      place(next, true);
    }

    function slideTo(target) {
      if (busy || !target) return;
      var active = track.querySelector('.biz-slide__card.is-active');
      if (target === active) return;
      place(target, true);
    }

    if (prev) prev.addEventListener('click', function () { slideBy(-1); });
    if (next) next.addEventListener('click', function () { slideBy(1); });

    cards.forEach(function (card) {
      card.addEventListener('click', function (event) {
        if (drag && drag.moved) {
          event.preventDefault();
          return;
        }
        if (card.classList.contains('is-active')) return;
        event.preventDefault();
        slideTo(card);
      });
    });

    viewport.addEventListener('pointerdown', function (event) {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      drag = {
        id: event.pointerId,
        x: event.clientX,
        y: event.clientY,
        dx: 0,
        lock: null,
        moved: false,
      };
    });

    viewport.addEventListener('pointermove', function (event) {
      if (!drag || drag.id !== event.pointerId) return;
      var dx = event.clientX - drag.x;
      var dy = event.clientY - drag.y;
      if (!drag.lock && Math.hypot(dx, dy) > 8) {
        drag.lock = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
        if (drag.lock === 'x') viewport.classList.add('is-dragging');
      }
      if (drag.lock !== 'x') return;
      drag.dx = dx;
      drag.moved = Math.abs(dx) > 12;
      event.preventDefault();
    });

    function endDrag(event) {
      if (!drag || (event && drag.id !== event.pointerId)) return;
      var dx = drag.dx;
      var horizontal = drag.lock === 'x';
      viewport.classList.remove('is-dragging');
      if (horizontal && Math.abs(dx) > 48) slideBy(dx < 0 ? 1 : -1);
      window.setTimeout(function () {
        if (drag) drag.moved = false;
        drag = null;
      }, 40);
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

    gsap.set('#mainAbout .end-move-thumb', { y: '50%', opacity: 0 });
    gsap.set('#mainAbout .end-titles-inner', { y: '30%', opacity: 0 });

    var tl = gsap.timeline({
      scrollTrigger: {
        id: 'about_sticky',
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.5,
        pin: pinTarget,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    tl.addLabel('time01')
      .to('#mainAbout .end-move-thumb--01', { y: 0, opacity: 1, duration: 1, delay: 0.5 }, 'time01')
      .to('#mainAbout .end-move-thumb--02', { y: 0, opacity: 1, duration: 1, delay: 1 }, 'time01')
      .to('#mainAbout .end-move-thumb--03', { y: 0, opacity: 1, duration: 1, delay: 1.5 }, 'time01')

      .addLabel('time02')
      .to('#mainAbout .end-move-thumb--01', { y: '-50%', opacity: 0, duration: 1, delay: 0.5 }, 'time02')
      .to('#mainAbout .end-move-thumb--02', { y: '-50%', opacity: 0, duration: 1, delay: 1 }, 'time02')
      .to('#mainAbout .end-move-thumb--03', { y: '-50%', opacity: 0, duration: 1, delay: 1.5 }, 'time02')

      .addLabel('time03')
      .to('#mainAbout .tit_wraps', { opacity: 0, y: '-100%', height: '0%', duration: 1 }, 'time03')
      .to('#mainAbout .end-thumbs-wrapper .wraps', {
        maxWidth: '100%',
        duration: 1,
        borderTopRightRadius: 0,
        borderTopLeftRadius: 0,
      }, 'time03')
      .to('#mainAbout .end-thumbs-wrapper', { height: '100vh', duration: 1 }, 'time03')
      .to('#mainAbout .end-titles-inner', { y: '0%', opacity: 1, duration: 1, delay: 0.4 }, 'time03');

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

  function initHomeScroll() {
    initHeroAnimation();
    initBizSlide();
    initCarbonScroll();
    initSection04();
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
