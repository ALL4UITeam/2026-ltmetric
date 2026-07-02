(function () {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  function initHeroAnimation() {
    const hero = document.querySelector('.hero');
    const lines = gsap.utils.toArray('.hero__line > p, .hero__line > h1');

    if (!hero || !lines.length) return;

    const lineTargets = lines.map(function (el) {
      return { el: el, opacity: 1 };
    });

    gsap.set(lines, { y: '110%', opacity: 0 });

    const tl = gsap.timeline({
      delay: 0.35,
      onComplete: function () {
        hero.classList.add('is-revealed');
        lineTargets.forEach(function (item) {
          gsap.set(item.el, { y: 0, opacity: item.opacity });
        });
      },
    });

    tl.to(lines, {
      y: '0%',
      opacity: function (i) {
        return lineTargets[i].opacity;
      },
      duration: 1.1,
      stagger: 0.2,
      ease: 'power4.out',
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
