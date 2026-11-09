document.addEventListener('DOMContentLoaded', function() {
    const alignces = document.querySelector('.special-links a');
    const aligncesClose = document.querySelector('.alliance--close');

    function Effect() {
      const EffectClassName1 = 'effect-txt';
      const EffectClassName2 = 'effect-txt02';
      const activeClassName = 'active';

      // IntersectionObserver callback function
      const callback = (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add(activeClassName);
          } else {
            //entry.target.classList.remove(activeClassName);
          }
        });
      };

    // Create IntersectionObserver instances
    const observer1 = new IntersectionObserver(callback, { threshold: 0.5 });
    const observer2 = new IntersectionObserver(callback, { threshold: 0.2 });

    // Observe elements with EffectClassName1
    const elements1 = document.querySelectorAll(`.${EffectClassName1}`);
    if (elements1) {
      elements1.forEach(element => {
        observer1.observe(element);
      });
    }

    // Observe elements with EffectClassName2
    const elements2 = document.querySelectorAll(`.${EffectClassName2}`);
    if (elements2) {
      elements2.forEach(element => {
        observer2.observe(element);
      });
    }
  }

  //Effect();
  
    alignces.addEventListener('click', () => {
      const allianceModal = document.querySelector('.alliance');
      allianceModal.classList.add('active');
    });
  
    aligncesClose.addEventListener('click', () => {
      const allianceModal = document.querySelector('.alliance');
      allianceModal.classList.remove('active');
    });
  
    // 모든 버튼 요소를 선택합니다.
    const buttons = document.querySelectorAll('[data-trigger="modal"]');
  
    // 모달 열기 함수
    const openModal = (modal) => {
      modal.classList.add('active');
    };
  
    // 모달 닫기 함수
    const closeModal = (modal) => {
      modal.classList.remove('active');
    };
  
    // 버튼 클릭 이벤트 리스너를 추가합니다.
    buttons.forEach(button => {
      button.addEventListener('click', () => {
        const target = button.getAttribute('data-target');
        const targetVideo = button.getAttribute('data-modal-type');
        const modal = document.querySelector(`[data-modal="${target}"]`);
        const modalBodies = modal.querySelectorAll('.modal__body');
  
        if (modal) {
          openModal(modal);
  
          if (targetVideo) {
            const existingVideo = document.getElementById('dynamicVideo');
            const sourceSrc = button.getAttribute('data-source');
            if (existingVideo) {
              existingVideo.parentNode.removeChild(existingVideo);
            }
  
            const video = document.createElement('video');
            video.id = 'dynamicVideo';
            video.controls = true;
  
            const source = document.createElement('source');
            source.src = sourceSrc;
            source.type = 'video/mp4';
  
            video.appendChild(source);
            document.getElementById('videoContainer').appendChild(video);
  
            video.play();
          }
  
          // 모달 닫기 버튼 이벤트 리스너를 추가합니다.
          const closeButton = modal.querySelector('.modal__close');
          if (closeButton) {
            closeButton.addEventListener('click', () => closeModal(modal));
          }
  
          // 모달 외부 클릭 시 닫기 이벤트 리스너를 추가합니다.
          modal.addEventListener('click', (event) => {
            let clickedOutside = true;
            modalBodies.forEach(modalBody => {
              if (modalBody.contains(event.target)) {
                clickedOutside = false;
              }
            });
  
            if (clickedOutside) {
              closeModal(modal);
            }
          });
  
          window.addEventListener('click', (event) => {
            if (event.target === modal) {
              closeModal(modal);
            }
          });
        }
      });
    });
  
    window.addEventListener('resize', () => {
      if (window.innerWidth < 1240) {
        document.querySelector('.alliance').classList.remove('active');
      }
    });
  });
  
