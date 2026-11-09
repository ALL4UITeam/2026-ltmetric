function introBanner() {

const isNonScroll = document.querySelector('[data-current]');

const bannerTitle = document.querySelector('.intro--banner_title');
const visualElement = document.querySelector('.intro--visual');
const visualWrap = document.querySelector('.intro--banner_bg');
const intro = document.querySelector(".intro--banner");


if (!intro) return;
  var introHeadAction = {
    enter: function(){
      bannerTitle.classList.add('is-break');
      bannerTitle.style.marginTop = '0';
      bannerTitle.style.top = '45%';
      bannerTitle.style.transform = 'translateY(-50%)';
    },
    leave: function(){
      bannerTitle.classList.remove('is-break');
      bannerTitle.removeAttribute('style');
    }
  };

  gsap.to('.page_title', {
    scrollTrigger: {
        trigger: visualWrap,
        start: 'top 30%',
        end: 'top',
        scrub: 0.3,
        toggleClass: { targets: bannerTitle , className: 'is-active' }
    }
  });

  gsap.to('.sub_title_desc', {
    scrollTrigger: {
        trigger: visualWrap,
        start: 'top 30%',
        end: 'top',
        scrub: 0.3,
        toggleClass: { targets: bannerTitle, className: 'is-active' }
    }
  });
  gsap.to(bannerTitle, {
    scrollTrigger: {
        trigger: visualElement,
        start: () => window.innerWidth <= 768 ? 'top 5%' : 'top 10%',
        end: 'bottom',
        onEnter: function(){
            introHeadAction.enter();
        },
        onLeave: function(){
            // 클래스 추가
            bannerTitle.classList.add('is-break');

            // top 스타일을 현재 윈도우 스크롤 위치로 설정
            bannerTitle.style.top = `${window.scrollY}px`;
            introHeadAction.enter();
        },
        onEnterBack: function(){
            introHeadAction.enter();
        },
        onLeaveBack: function(){
            introHeadAction.leave();
        }
    }
  });



  if(isNonScroll.getAttribute('data-current') == "board"){
  
  } else {
    
    ScrollTrigger.matchMedia({
      // Mobile
      "(max-width: 767px)": function() {
        visualElement.removeAttribute('style');
          gsap.to(visualElement, { width: '100vw', borderRadius: '0', duration: 1,
              scrollTrigger: {
                  trigger: visualElement,
                  start: 'top 250px',
                  end: 'bottom top',
                  scrub: 1,
                  ease: 'power4',
                  //markers: true
              }
          });
      },
      "(max-width: 1279px)": function() {
          visualElement.removeAttribute('style');
          gsap.to(visualElement, { width: '100vw', borderRadius: '0', duration: 1,
              scrollTrigger: {
                  trigger: visualElement,
                  start: 'top 200px',
                  end: 'top',
                  scrub: 1,
                  ease: 'power4',
                  //markers: true
              }
          });
      },
      // Desktop
      "(min-width: 1280px)": function() {
        visualElement.removeAttribute('style');
          gsap.to(visualElement, { width: '100vw', borderRadius: '0', duration: 1,
              scrollTrigger: {
                  trigger: visualElement,
                  start: 'top 400px',
                  end: 'top',
                  scrub: 1,
                  ease: 'power4',
                  //markers: true
              }
          });
      }
    });
  }
}
introBanner()
// 윈도우 리사이즈 이벤트 핸들러 추가
window.addEventListener('resize', function() {
  // ScrollTrigger.refresh() 호출
  ScrollTrigger.refresh();
});