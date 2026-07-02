window.addEventListener("load", () => {
  const Loaders = document.querySelector("#Loader");
  if (Loaders) {
    Loaders.remove();
  }
});
document.addEventListener("DOMContentLoaded", function() {
  var imgContainers = document.querySelectorAll(".business__imgs");
  if (!imgContainers.length) {
    return;
  }
  imgContainers.forEach(function(imgContainer) {
    var imgElements = imgContainer.querySelectorAll("img[data-src]");
    var showLoader = function showLoader2(img) {
      var loader = document.createElement("div");
      loader.classList.add("loader");
      loader.innerText = "Loading...";
      img.parentNode.appendChild(loader);
    };
    var hideLoader = function hideLoader2(img) {
      var loader = img.parentNode.querySelector(".loader");
      if (loader) loader.remove();
    };
    var onImageLoad = function onImageLoad2(event) {
      var img = event.target;
      hideLoader(img);
    };
    var onImageError = function onImageError2(event) {
      var img = event.target;
      hideLoader(img);
      img.alt = "";
    };
    imgElements.forEach(function(img) {
      var dataSrc = img.getAttribute("data-src");
      if (dataSrc) {
        var newSrc = !document.querySelector(".solution") ? "/assets/images/business/".concat(dataSrc) : "/assets/images/solution/".concat(dataSrc);
        showLoader(img);
        img.addEventListener("load", onImageLoad);
        img.addEventListener("error", onImageError);
        img.setAttribute("src", newSrc);
        gsap.fromTo(img, {
          opacity: 0,
          scale: 1.2
        }, {
          opacity: 1,
          scale: 1,
          duration: 1,
          scrollTrigger: {
            trigger: img,
            start: "top bottom-=200",
            //end : 'bottom bottom',
            scrub: false
          }
        });
      }
    });
  });
});
document.addEventListener("DOMContentLoaded", function() {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
  var cardsWrap = document.querySelector(".cards__wrap");
  if (!cardsWrap) return;
  var cardsItem = document.querySelectorAll(".cards__figure");
  gsap.set(".cards__wrap", {
    clearProps: "all"
  });
  gsap.set(cardsWrap, {
    height: cardsWrap.scrollHeight
  });
  var totalItems = cardsItem.length;
  var progressArray = new Array(totalItems).fill(0);
  function updateProgressBar() {
    var totalProgress = progressArray.reduce(function(sum, progress) {
      return sum + progress;
    }, 0) / totalItems;
    var progressPercentage = totalProgress * 100;
    document.querySelector(".progress__bar--gage").style.width = "".concat(progressPercentage, "%");
  }
  cardsItem.forEach(function(image, idx) {
    set_scroll_image(image, idx);
  });
  function set_scroll_image(image, imageNo) {
    gsap.to(image, {
      y: -240,
      scrollTrigger: {
        id: "st-promotion-image-".concat(imageNo),
        trigger: image,
        start: "top bottom",
        end: "bottom center",
        scrub: 0.5,
        onUpdate: function onUpdate(self) {
          progressArray[imageNo] = self.progress;
          updateProgressBar();
        },
        onLeave: function onLeave(self) {
          progressArray[imageNo] = 1;
          updateProgressBar();
        },
        onLeaveBack: function onLeaveBack(self) {
          progressArray[imageNo] = 0;
          updateProgressBar();
        },
        onEnterBack: function onEnterBack(self) {
          progressArray[imageNo] = self.progress;
          updateProgressBar();
        }
      }
    });
  }
});
var body = document.body;
var header = document.getElementById("header");
var btnMobile = document.getElementById("btnMobile");
var gnbItems = document.querySelectorAll("#gnb > li");
var mobileMenuUL = document.querySelector("ul.mobile-menu");
var mobileMenus = document.querySelectorAll("ul.mobile-menu .menuitem");
var dropdownButtons = document.querySelectorAll(".dropdownButton");
var handleMobileButtonClick = function handleMobileButtonClick2() {
  btnMobile.classList.toggle("active");
  body.classList.toggle("mobile-active");
};
mobileMenuUL.addEventListener("click", function(event) {
  if (event.target && event.target.classList.contains("menuitem")) {
    event.preventDefault();
    var parentLi = event.target.parentElement;
    var siblings = parentLi.parentElement.children;
    Array.prototype.forEach.call(siblings, function(sibling) {
      if (sibling !== parentLi) {
        sibling.classList.remove("active");
      }
    });
    parentLi.classList.toggle("active");
  }
});
var handleGnbItemMouseOver = function handleGnbItemMouseOver2() {
  header.classList.add("open");
};
var handleGnbItemMouseOut = function handleGnbItemMouseOut2() {
  header.classList.remove("open");
};
var handleDropdownButtonClick = function handleDropdownButtonClick2(button, dropdownMenu, menuItems) {
  var isOpen = false;
  var toggleDropdown = function toggleDropdown2() {
    isOpen = !isOpen;
    button.setAttribute("aria-expanded", isOpen);
  };
  button.addEventListener("click", function(event) {
    event.stopPropagation();
    toggleDropdown();
  });
  button.addEventListener("keydown", function(event) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!isOpen) toggleDropdown();
      menuItems[0].focus();
    }
  });
  menuItems.forEach(function(item, index) {
    item.addEventListener("keydown", function(event) {
      var _handleKeyDown$event$;
      var handleKeyDown = {
        ArrowDown: function ArrowDown() {
          event.preventDefault();
          menuItems[(index + 1) % menuItems.length].focus();
        },
        ArrowUp: function ArrowUp() {
          event.preventDefault();
          menuItems[(index - 1 + menuItems.length) % menuItems.length].focus();
        },
        Escape: function Escape() {
          toggleDropdown();
          button.focus();
        }
      };
      (_handleKeyDown$event$ = handleKeyDown[event.key]) === null || _handleKeyDown$event$ === void 0 || _handleKeyDown$event$.call(handleKeyDown);
    });
    item.addEventListener("click", function() {
      button.textContent = item.textContent;
      toggleDropdown();
    });
  });
  document.addEventListener("click", function(event) {
    if (!button.contains(event.target) && !dropdownMenu.contains(event.target)) {
      if (isOpen) {
        toggleDropdown();
      }
    }
  });
};
function headers() {
  var header2 = document.querySelector(".header");
  var breadcrumb = document.querySelector(".breadcrumb");
  var breadcrumbTop = header2.offsetHeight;
  var lastScrollY = window.pageYOffset || document.documentElement.scrollTop;
  function updateScrollDirection() {
    var currentScrollY = window.pageYOffset || document.documentElement.scrollTop;
    var isScrollingDown = currentScrollY > lastScrollY;
    if (header2.classList.contains("_sub") && breadcrumb) {
      if (currentScrollY >= breadcrumbTop) {
        if (isScrollingDown) {
          header2.classList.add("hide");
          header2.classList.remove("up");
        } else {
          header2.classList.remove("hide");
          if (currentScrollY > 0) {
            header2.classList.add("up");
          } else {
            header2.classList.remove("up");
          }
        }
      } else {
        header2.classList.remove("hide", "up");
      }
    } else {
      if (isScrollingDown) {
        header2.classList.add("hide");
        header2.classList.remove("up");
      } else {
        header2.classList.remove("hide");
        if (currentScrollY > 0) {
          header2.classList.add("up");
        } else {
          header2.classList.remove("up");
        }
      }
    }
    lastScrollY = currentScrollY;
  }
  document.addEventListener("DOMContentLoaded", function() {
    lastScrollY = window.pageYOffset || document.documentElement.scrollTop;
    if (header2.classList.contains("_sub") && breadcrumb) {
      var _breadcrumbTop = breadcrumb.getBoundingClientRect().top + window.scrollY;
      if (lastScrollY >= _breadcrumbTop) {
        header2.classList.add("up hide");
      } else {
        header2.classList.remove("up hide");
      }
    } else {
      if (lastScrollY > 50) {
        header2.classList.add("up hide");
      } else {
        header2.classList.remove("up hide");
      }
    }
  });
  window.addEventListener("scroll", updateScrollDirection);
}
function updateMobileMenu() {
  var gnbUl = document.getElementById("gnb");
  var mobileMenuUl = document.querySelector("ul.mobile-menu");
  if (!mobileMenuUl) return;
  var gnbChildren = gnbUl.innerHTML;
  mobileMenuUl.innerHTML = gnbChildren;
  var gnbLiElements = document.querySelectorAll("#gnb .gnb--li1");
  var firstListUl = document.querySelector("ul.first-list");
  if (firstListUl == null) return;
  gnbLiElements.forEach(function(gnbLi) {
    var firstATag = gnbLi.querySelector("a");
    if (firstATag) {
      var newLi = document.createElement("li");
      newLi.appendChild(firstATag.cloneNode(true));
      firstListUl.appendChild(newLi);
    }
  });
}
(function pageTitles() {
  var ulElement = document.querySelector("[data-page-title]");
  if (!ulElement) return;
  var liElements = ulElement.querySelectorAll("li");
  var pageTitle = ulElement.getAttribute("data-page-title");
  liElements.forEach(function(li) {
    if (li.textContent.trim() === pageTitle) {
      li.classList.add("_current");
    }
  });
  var introTitleElement = document.querySelector(".page_title");
  introTitleElement.textContent = pageTitle;
  var pageConentWrap = document.querySelector("[data-layout]");
  var pageConentTitle = pageConentWrap.getAttribute("data-current");
  var introBgElement = document.querySelector(".intro--banner_bg");
  introBgElement.classList.add("_" + pageConentTitle);
})();
var breadCrumbDrop = function breadCrumbDrop2() {
  var breadCrumbButton = document.querySelector(".breadcrumb--menu_drop .trigger");
  var breadCrumbButton2 = document.querySelector(".breadcrumb--sub_list button");
  var breadCrumbMenu = document.querySelector(".first-list");
  if (breadCrumbMenu == null) return;
  breadCrumbButton.addEventListener("click", function() {
    breadCrumbButton.classList.toggle("_open");
  });
  breadCrumbButton2.addEventListener("click", function() {
    breadCrumbButton2.classList.toggle("_open");
  });
};
var smoothscroll = {
  passive: function passive() {
    var supportsPassive = false;
    try {
      document.addEventListener("test", null, {
        get passive() {
          supportsPassive = true;
        }
      });
    } catch (e) {
    }
    return supportsPassive;
  },
  init: function init() {
    var userAgent = navigator.userAgent.toLowerCase();
    var isMobile = /iphone|ipod|android|blackberry|mini|windows\sce|palm/i.test(userAgent);
    var isMac = /macintosh|mac os x/i.test(userAgent);
    if (isMobile || isMac) return;
    if (this.passive()) {
      window.addEventListener("wheel", this.scrolling, {
        passive: false
      });
    } else {
      window.addEventListener("mousewheel", this.scrolling);
      window.addEventListener("DOMMouseScroll", this.scrolling);
    }
  },
  destroy: function destroy() {
    if (this.passive()) {
      window.removeEventListener("wheel", this.scrolling);
    } else {
      window.removeEventListener("mousewheel", this.scrolling);
      window.removeEventListener("DOMMouseScroll", this.scrolling);
    }
    gsap.killTweensOf(window, {
      scrollTo: true
    });
  },
  scrolling: function scrolling(event) {
    event.preventDefault();
    var scrollTime = 1;
    var distanceOffset = 4.5;
    var scrollDistance = window.innerHeight / distanceOffset;
    var delta = 0;
    if (smoothscroll.passive()) {
      delta = event.wheelDelta / 120 || -event.deltaY / 4;
    } else {
      if (typeof event.originalEvent.deltaY != "undefined") {
        delta = -event.originalEvent.deltaY / 120;
      } else {
        delta = event.originalEvent.wheelDelta / 120 || -event.originalEvent.detail / 3;
      }
    }
    var scrollTop = document.documentElement.scrollTop;
    var finalScroll = scrollTop - parseInt(delta * scrollDistance);
    gsap.to(window, {
      duration: scrollTime,
      scrollTo: {
        y: finalScroll,
        autoKill: true
      },
      ease: "power3.out",
      overwrite: 5
    });
  }
};
var init2 = function init3() {
  smoothscroll.init();
  breadCrumbDrop();
  headers();
  updateMobileMenu();
  document.getElementById("btnTop").addEventListener("click", function() {
    gsap.to(window, {
      duration: 1,
      scrollTo: {
        y: 0,
        autoKill: true
      }
    });
  });
  btnMobile.addEventListener("click", handleMobileButtonClick);
  mobileMenus.forEach(function(menu) {
    menu.addEventListener("click", handleMobileMenuClick);
  });
  gnbItems.forEach(function(item) {
    item.addEventListener("mouseover", handleGnbItemMouseOver);
    item.addEventListener("mouseout", handleGnbItemMouseOut);
  });
  dropdownButtons.forEach(function(button) {
    var dropdownMenu = document.getElementById(button.getAttribute("aria-controls"));
    var menuItems = dropdownMenu.querySelectorAll('[role="menuitem"]');
    handleDropdownButtonClick(button, dropdownMenu, menuItems);
  });
};
document.addEventListener("DOMContentLoaded", init2);
document.addEventListener("DOMContentLoaded", function() {
  if (window.location.href === "https://www.ltmetric.com/outsider/" || window.location.href === "https://www.ltmetric.com/outsider") {
    var links = document.querySelectorAll("#header a");
    links.forEach(function(link) {
      link.removeAttribute("href");
    });
  }
});
function introBanner() {
  document.querySelector("[data-current]");
  var bannerTitle = document.querySelector(".intro--banner_title");
  var visualElement = document.querySelector(".intro--visual");
  var visualWrap = document.querySelector(".intro--banner_bg");
  var intro = document.querySelector(".intro--banner");
  if (!intro) return;
  var introHeadAction = {
    enter: function enter() {
      bannerTitle.classList.add("is-break");
      bannerTitle.style.marginTop = "0";
      bannerTitle.style.top = "45%";
      bannerTitle.style.transform = "translateY(-50%)";
    },
    leave: function leave() {
      bannerTitle.classList.remove("is-break");
      bannerTitle.removeAttribute("style");
    }
  };
  gsap.to(".page_title", {
    scrollTrigger: {
      trigger: visualWrap,
      start: "top 30%",
      end: "top",
      scrub: 0.3,
      toggleClass: {
        targets: bannerTitle,
        className: "is-active"
      }
    }
  });
  gsap.to(".sub_title_desc", {
    scrollTrigger: {
      trigger: visualWrap,
      start: "top 30%",
      end: "top",
      scrub: 0.3,
      toggleClass: {
        targets: bannerTitle,
        className: "is-active"
      }
    }
  });
  gsap.to(bannerTitle, {
    scrollTrigger: {
      trigger: visualElement,
      start: function start() {
        return window.innerWidth <= 768 ? "top 5%" : "top 10%";
      },
      end: "bottom",
      onEnter: function onEnter() {
        introHeadAction.enter();
      },
      onLeave: function onLeave() {
        bannerTitle.classList.add("is-break");
        bannerTitle.style.top = "".concat(window.scrollY, "px");
        introHeadAction.enter();
      },
      onEnterBack: function onEnterBack() {
        introHeadAction.enter();
      },
      onLeaveBack: function onLeaveBack() {
        introHeadAction.leave();
      }
    }
  });
}
introBanner();
window.addEventListener("resize", function() {
  ScrollTrigger.refresh();
});
document.addEventListener("DOMContentLoaded", function() {
  var alignces = document.querySelector(".special-links a");
  var aligncesClose = document.querySelector(".alliance--close");
  alignces.addEventListener("click", function() {
    var allianceModal = document.querySelector(".alliance");
    allianceModal.classList.add("active");
  });
  aligncesClose.addEventListener("click", function() {
    var allianceModal = document.querySelector(".alliance");
    allianceModal.classList.remove("active");
  });
  var buttons = document.querySelectorAll('[data-trigger="modal"]');
  var openModal = function openModal2(modal) {
    modal.classList.add("active");
  };
  var closeModal = function closeModal2(modal) {
    modal.classList.remove("active");
  };
  buttons.forEach(function(button) {
    button.addEventListener("click", function() {
      var target = button.getAttribute("data-target");
      var targetVideo = button.getAttribute("data-modal-type");
      var modal = document.querySelector('[data-modal="'.concat(target, '"]'));
      var modalBodies = modal.querySelectorAll(".modal__body");
      if (modal) {
        openModal(modal);
        if (targetVideo) {
          var existingVideo = document.getElementById("dynamicVideo");
          var sourceSrc = button.getAttribute("data-source");
          if (existingVideo) {
            existingVideo.parentNode.removeChild(existingVideo);
          }
          var video = document.createElement("video");
          video.id = "dynamicVideo";
          video.controls = true;
          var source = document.createElement("source");
          source.src = sourceSrc;
          source.type = "video/mp4";
          video.appendChild(source);
          document.getElementById("videoContainer").appendChild(video);
          video.play();
        }
        var closeButton = modal.querySelector(".modal__close");
        if (closeButton) {
          closeButton.addEventListener("click", function() {
            return closeModal(modal);
          });
        }
        modal.addEventListener("click", function(event) {
          var clickedOutside = true;
          modalBodies.forEach(function(modalBody) {
            if (modalBody.contains(event.target)) {
              clickedOutside = false;
            }
          });
          if (clickedOutside) {
            closeModal(modal);
          }
        });
        window.addEventListener("click", function(event) {
          if (event.target === modal) {
            closeModal(modal);
          }
        });
      }
    });
  });
  window.addEventListener("resize", function() {
    if (window.innerWidth < 1240) {
      document.querySelector(".alliance").classList.remove("active");
    }
  });
});
var isSolution = document.querySelector('[data-current="business"]') ? true : false;
if (!isSolution) ;
else {
  document.querySelector(".bar");
  document.addEventListener("DOMContentLoaded", function() {
    var insertBar = document.querySelector(".breadcrumb");
    var contents = document.getElementById("contents");
    var progressBar = document.createElement("div");
    progressBar.classList.add("bar");
    insertBar.appendChild(progressBar);
    function updateProgressBar() {
      var contentHeight = contents.scrollHeight;
      var windowHeight = window.innerHeight;
      var scrollY = window.scrollY;
      var scrollPercent = scrollY / (contentHeight - windowHeight) * 100;
      progressBar.style.width = Math.min(scrollPercent, 100) + "%";
    }
    function onResize() {
      updateProgressBar();
    }
    window.addEventListener("scroll", updateProgressBar);
    window.addEventListener("resize", onResize);
    updateProgressBar();
  });
}
