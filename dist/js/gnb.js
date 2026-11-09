//import * as validate from './validation.js';

const mediaScreen = {
  sm: 576,
  md: 768,
  lg: 1000,
  xl: 1440,
  xxl: 1660
};

const body = document.body;
const header = document.getElementById('header');
const btnMobile = document.getElementById('btnMobile');
const gnbItems = document.querySelectorAll('#gnb > li');
const mobileMenuUL = document.querySelector('ul.mobile-menu');
const mobileMenus = document.querySelectorAll('ul.mobile-menu .menuitem');
const dropdownButtons = document.querySelectorAll(".dropdownButton");


const handleMobileButtonClick = () => {
  btnMobile.classList.toggle('active');
  body.classList.toggle('mobile-active');
};


mobileMenuUL.addEventListener('click', function(event) {
  if (event.target && event.target.classList.contains('menuitem')) {
    event.preventDefault();
    const parentLi = event.target.parentElement;
    const siblings = parentLi.parentElement.children;
    Array.prototype.forEach.call(siblings, sibling => {
      if (sibling !== parentLi) {
        sibling.classList.remove('active');
      }
    });
    parentLi.classList.toggle('active');
  }
});

const handleGnbItemMouseOver = () => {
  header.classList.add('open');
};

const handleGnbItemMouseOut = () => {
  header.classList.remove('open');
};

const handleDropdownButtonClick = (button, dropdownMenu, menuItems) => {
  let isOpen = false;

  const toggleDropdown = () => {
    isOpen = !isOpen;
    button.setAttribute("aria-expanded", isOpen);
    //dropdownMenu.style.display = isOpen ? "block" : "none";
  };

  button.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleDropdown();
  });

  button.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!isOpen) toggleDropdown();
      menuItems[0].focus();
    }
  });

  menuItems.forEach((item, index) => {
    item.addEventListener("keydown", (event) => {
      const handleKeyDown = {
        ArrowDown: () => {
          event.preventDefault();
          menuItems[(index + 1) % menuItems.length].focus();
        },
        ArrowUp: () => {
          event.preventDefault();
          menuItems[(index - 1 + menuItems.length) % menuItems.length].focus();
        },
        Escape: () => {
          toggleDropdown();
          button.focus();
        }
      };
      handleKeyDown[event.key]?.();
    });

    item.addEventListener("click", () => {
      button.textContent = item.textContent;
      toggleDropdown();
    });
  });

  document.addEventListener("click", (event) => {
    if (!button.contains(event.target) && !dropdownMenu.contains(event.target)) {
      if (isOpen) {
        toggleDropdown();
      }
    }
  });
};

// 헤더 스크롤 이벤트
function headers() {
  const header = document.querySelector('.header');
  const breadcrumb = document.querySelector('.breadcrumb');
  const breadcrumbTop = header.offsetHeight;
  let lastScrollY = window.pageYOffset || document.documentElement.scrollTop;

  function updateScrollDirection() {
      const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;
      const isScrollingDown = currentScrollY > lastScrollY;

      if (header.classList.contains('_sub') && breadcrumb) {
          if (currentScrollY >= breadcrumbTop) {
              if (isScrollingDown) {
                  header.classList.add('hide');
                  header.classList.remove('up');
              } else {
                  header.classList.remove('hide');
                  if (currentScrollY > 0) {
                      header.classList.add('up');
                  } else {
                      header.classList.remove('up');
                  }
              }
          } else {
              header.classList.remove('hide', 'up');
          }
      } else {
          if (isScrollingDown) {
              header.classList.add('hide');
              header.classList.remove('up');
          } else {
              header.classList.remove('hide');
              if (currentScrollY > 0) {
                  header.classList.add('up');
              } else {
                  header.classList.remove('up');
              }
          }
      }
      lastScrollY = currentScrollY;
  }

  // 초기 스크롤 상태 반영
  document.addEventListener('DOMContentLoaded', () => {
      lastScrollY = window.pageYOffset || document.documentElement.scrollTop;
      // 초기 스크롤 상태 반영
      if (header.classList.contains('_sub') && breadcrumb) {
          const breadcrumbTop = breadcrumb.getBoundingClientRect().top + window.scrollY;

          if (lastScrollY >= breadcrumbTop) {
              header.classList.add('up hide');
          } else {
              header.classList.remove('up hide');
          }
      } else {
          if (lastScrollY > 50) {
              header.classList.add('up hide');
          } else {
              header.classList.remove('up hide');
          }
      }
  });

  // 스크롤 이벤트 리스너 추가
  window.addEventListener('scroll', updateScrollDirection);
}


// gnb copy => mobile paste
function updateMobileMenu(){
    // gnb 아이디를 가진 ul 태그를 선택
  const gnbUl = document.getElementById('gnb');
  // mobile-menu 클래스를 가진 ul 태그를 선택
  const mobileMenuUl = document.querySelector('ul.mobile-menu');
  if (!mobileMenuUl) return;
  // gnbUl의 자식 요소들을 모두 가져오기
  const gnbChildren = gnbUl.innerHTML;
  // mobileMenuUl에 gnbUl의 자식 요소들을 추가
  mobileMenuUl.innerHTML = gnbChildren;

  // gnb--li1 클래스를 가진 모든 li 요소 선택
  const gnbLiElements = document.querySelectorAll('#gnb .gnb--li1');
  const firstListUl = document.querySelector('ul.first-list');

  
  if(firstListUl == null) return;
  gnbLiElements.forEach(gnbLi => {
    const firstATag = gnbLi.querySelector('a'); // 첫 번째 a 태그 선택
    if (firstATag) {
      const newLi = document.createElement('li'); // 새로운 li 요소 생성
      newLi.appendChild(firstATag.cloneNode(true)); // a 태그를 복사하여 li에 추가
      firstListUl.appendChild(newLi); // 새로운 ul에 li 추가
    }
  });
}
// 서브 페이지 맨처음 intro 및 메뉴 active 설정
(function pageTitles(){
  const ulElement = document.querySelector('[data-page-title]');

  if (!ulElement) return;

  const liElements = ulElement.querySelectorAll('li');
  const pageTitle = ulElement.getAttribute('data-page-title');

  liElements.forEach(li => {
    if (li.textContent.trim() === pageTitle) {
      li.classList.add('_current');
    }
  });

  const introTitleElement = document.querySelector('.page_title');
  introTitleElement.textContent = pageTitle;

  // current
  const pageConentWrap = document.querySelector('[data-layout]');
  const pageConentTitle = pageConentWrap.getAttribute('data-current');

  const introBgElement = document.querySelector('.intro--banner_bg');

  introBgElement.classList.add('_'+pageConentTitle)
})()

const breadCrumbDrop = () => {
  const breadCrumbButton = document.querySelector('.breadcrumb--menu_drop .trigger');
  const breadCrumbButton2 = document.querySelector('.breadcrumb--sub_list button');
  const breadCrumbMenu = document.querySelector('.first-list');
  
  
  if(breadCrumbMenu == null) return;

  breadCrumbButton.addEventListener('click', () => {
    breadCrumbButton.classList.toggle('_open');
  })
  breadCrumbButton2.addEventListener('click', () => {
    breadCrumbButton2.classList.toggle('_open');
  })
}
const smoothscroll = {
  passive: function() {
      let supportsPassive = false;
      try {
          document.addEventListener('test', null, { get passive() { supportsPassive = true } });
      } catch (e) {}
      return supportsPassive;
  },
  init: function() {

      const userAgent = navigator.userAgent.toLowerCase();

      const isMobile = /iphone|ipod|android|blackberry|mini|windows\sce|palm/i.test(userAgent);
      const isMac = /macintosh|mac os x/i.test(userAgent);
      const isWindows = /windows/i.test(userAgent);
      const isLinux = /linux/i.test(userAgent);

      if(isMobile || isMac) return;
      
      //if (document.documentElement.classList.contains('mobile') || document.documentElement.classList.contains('mac')) return;

      if (this.passive()) {
          window.addEventListener('wheel', this.scrolling, { passive: false });
      } else {
          window.addEventListener('mousewheel', this.scrolling);
          window.addEventListener('DOMMouseScroll', this.scrolling);
      }
  },
  destroy: function() {
      if (this.passive()) {
          window.removeEventListener('wheel', this.scrolling);
      } else {
          window.removeEventListener('mousewheel', this.scrolling);
          window.removeEventListener('DOMMouseScroll', this.scrolling);
      }
      gsap.killTweensOf(window, { scrollTo: true });
  },
  scrolling: function(event) {
      event.preventDefault();

      let scrollTime = 1;
      let distanceOffset = 3.5;
      let scrollDistance = (window.innerHeight / distanceOffset);
      let delta = 0;

      if (smoothscroll.passive()) {
          delta = (event.wheelDelta / 120) || (-event.deltaY / 3);
      } else {
          if (typeof event.originalEvent.deltaY != 'undefined') {
              delta = (-event.originalEvent.deltaY / 120);
          } else {
              delta = (event.originalEvent.wheelDelta / 120) || (-event.originalEvent.detail / 3);
          }
      }

      let scrollTop = document.documentElement.scrollTop;
      let finalScroll = scrollTop - parseInt(delta * scrollDistance);

      gsap.to(window, {
          duration: scrollTime,
          scrollTo: { y: finalScroll, autoKill: true },
          ease: 'power3.out',
          overwrite: 5
      });
  }
};

const init = () => {
  
  
  smoothscroll.init();
  breadCrumbDrop()
  headers();
  updateMobileMenu()

  document.getElementById('btnTop').addEventListener('click', function() {
    gsap.to(window, {duration: 1, scrollTo: {y: 0, autoKill: true}});
  });
  btnMobile.addEventListener('click', handleMobileButtonClick);
  mobileMenus.forEach(menu => {
    menu.addEventListener('click', handleMobileMenuClick);
  });

  gnbItems.forEach(item => {
    item.addEventListener('mouseover', handleGnbItemMouseOver);
    item.addEventListener('mouseout', handleGnbItemMouseOut);
  });

  dropdownButtons.forEach(button => {
    const dropdownMenu = document.getElementById(button.getAttribute("aria-controls"));
    const menuItems = dropdownMenu.querySelectorAll('[role="menuitem"]');
    handleDropdownButtonClick(button, dropdownMenu, menuItems);
  });
};
document.addEventListener("DOMContentLoaded", init);

document.addEventListener("DOMContentLoaded", function() {
  // 현재 주소가 특정 URL인지 확인
  if (window.location.href === "https://all4land.com/outsider/" || window.location.href === "https://all4land.com/outsider") {
    // #header 안에 있는 모든 a 태그 선택
    var links = document.querySelectorAll("#header a");

    // 각 a 태그의 href 속성을 빈 문자열로 설정
    links.forEach(function(link) {
      link.removeAttribute("href");
    });
  }
});