// LENIS 초기화
const lenis = new Lenis();
// GSAP의 ScrollTrigger 업데이트와 LENIS의 스크롤 동기화
lenis.on('scroll', ScrollTrigger.update);
// GSAP 타이커에 LENIS의 프레임을 추가
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
// GSAP의 lagSmoothing 비활성화 (부드러운 스크롤을 위해)
gsap.ticker.lagSmoothing(0);

//
// intro 텍스트 애니메이션
gsap.registerPlugin(TextPlugin);

const words = ['Future', 'Artists', 'Innovation', 'People', 'Inspiration'];

gsap.set('.cursor', { opacity: 0 });
let cursor = gsap.to('.cursor', {
  delay: 1,
  opacity: 1,
  repeat: -1,
  yoyo: true,
  duration: 0.01,
  repeatDelay: 0.5,
});
let masterTl = gsap.timeline({ repeat: -1 }).pause();

gsap.set('.fixed-txt span', { y: '100%', opacity: 0 });

gsap.fromTo(
  '.fixed-txt span',
  { y: '100%', opacity: 1 },
  {
    delay: 2,
    y: '0%',
    opacity: 1,
    duration: 0.4,
    ease: 'power2.out',
    stagger: { amount: 1, each: 0.1 },
    onComplete: () => masterTl.play(),
  }
);

// gsap.timeline().from('.fixed-txt span', {
//   delay: 2,
//   duration: 0.4,
//   y: '100%',
//   ease: 'power2.out',
//   opacity: 1,
//   stagger: {
//     amount: 1,
//     from: 'start',
//     each: 0.1,
//   },
//   onComplete: () => masterTl.play(),
// });

words.forEach((word) => {
  let tl = gsap.timeline({ repeat: 1, yoyo: true, repeatDelay: 1 });
  tl.to('.text', { duration: 1, text: word });
  masterTl.add(tl);
});

//intro 동영상 애니메이션

// const mediaQuery = window.matchMedia('(min-width: 1024px)');

// // GSAP 애니메이션 초기화 함수
// function initVideoAnimation() {
//   // ScrollTrigger 플러그인 등록
//   gsap.registerPlugin(ScrollTrigger);

//   // 비디오 애니메이션 생성 함수
//   function createVideoAnimation() {
//     // 동영상 초기 너비 설정
//     gsap.set('.intro__vid', {
//       width: 'calc((100% - 60px) / 2)',
//       right: '30px',
//     });

//     // 스크롤에 따른 너비 조정 애니메이션

//     gsap.to('.intro__vid', {
//       scrollTrigger: {
//         trigger: '.intro',
//         //scroller: document.body,
//         start: 'top top',
//         scrub: 0.3,
//         end: 'bottom top',
//         markers: true,
//         pin: true,
//       },
//       width: 'calc(100% - 60px)',
//       ease: 'power2.inOut',
//     });
//   }

//   // 애니메이션 클린업 함수
//   function cleanupVideoAnimation() {
//     // ScrollTrigger 인스턴스 제거
//     ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

//     // GSAP 애니메이션 제거
//     gsap.killTweensOf('.intro__vid');

//     // 비디오 요소의 스타일 초기화
//     gsap.set('.intro__vid', {
//       clearProps: 'all', // 모든 GSAP 속성 초기화
//     });
//   }

//   // 미디어쿼리 변경 감지 핸들러
//   function handleMediaQueryChange(e) {
//     cleanupVideoAnimation(); // 변경이 발생할 때마다 먼저 정리

//     if (e.matches) {
//       // 데스크톱 사이즈일 때 애니메이션 실행
//       createVideoAnimation();
//     } else {
//       // 태블릿/모바일 사이즈일 때 애니메이션 제거 후 기본 스타일 적용
//       const videoElement = document.querySelector('.intro__vid');
//       if (videoElement) {
//         videoElement.style.width = '100%';
//         videoElement.style.right = '0';
//       }
//     }
//   }

//   // 초기 실행 및 리사이즈 이벤트 리스너 등록
//   handleMediaQueryChange(mediaQuery); // 초기 실행
//   mediaQuery.addEventListener('change', handleMediaQueryChange);

//   // 추가: 리사이즈 이벤트에서 애니메이션 상태 동기화
//   window.addEventListener('resize', () => {
//     // 화면 크기 변경 시 애니메이션과 트리거 새로고침
//     handleMediaQueryChange(mediaQuery);
//     ScrollTrigger.refresh();
//   });
// }

// // DOM이 로드된 후 초기화
// document.addEventListener('DOMContentLoaded', initVideoAnimation);

gsap.registerPlugin(ScrollTrigger);

const mediaQuery = window.matchMedia('(min-width: 1024px)');
let animationInitialized = false; // 애니메이션 상태 플래그

// GSAP 애니메이션 초기화 함수
function initVideoAnimation() {
  // 비디오 애니메이션 생성 함수 (1024px 이상에서만 생성)
  function createVideoAnimation() {
    if (!animationInitialized && mediaQuery.matches) {
      // 1024px 이상일 때만 애니메이션 생성

      gsap.set('.intro__vid', {
        width: 'calc((100% - 60px) / 2)',
        right: '30px',
      });

      gsap.to('.intro__vid', {
        scrollTrigger: {
          id: 'introTrigger', // 트리거에 고유 ID 설정
          trigger: '.intro ',
          start: 'top top',
          scrub: 0.3,
          end: 'bottom top',
          //markers: true,

          pin: true,
          pinSpacing: true,
          refreshPriority: 1,
        },
        width: 'calc(100% - 60px)',
        ease: 'power2.inOut',
      });

      animationInitialized = true; // 애니메이션이 초기화되었음을 설정
    }
  }

  // 애니메이션 클린업 함수 (1024px 미만으로 전환될 때 호출)
  function cleanupVideoAnimation() {
    const introTrigger = ScrollTrigger.getById('introTrigger');
    if (introTrigger) {
      introTrigger.kill(); // ScrollTrigger 인스턴스 제거
    }

    gsap.killTweensOf('.intro__vid');
    gsap.set('.intro__vid', {
      clearProps: 'all', // 모든 GSAP 속성 초기화
    });

    animationInitialized = false; // 애니메이션이 클린업되었음을 설정
  }

  // 미디어쿼리 변경 감지 핸들러
  function handleMediaQueryChange(e) {
    if (e.matches) {
      // 1024px 이상으로 전환될 때 애니메이션 생성
      cleanupVideoAnimation(); // 기존 상태를 먼저 정리하고 다시 생성
      createVideoAnimation();
      ScrollTrigger.refresh(); // 전체 ScrollTrigger 새로고침
    } else {
      // 1024px 미만으로 전환될 때 애니메이션 정리
      cleanupVideoAnimation();

      // 기본 스타일 적용
      const videoElement = document.querySelector('.intro__vid');
      if (videoElement) {
        videoElement.style.width = '100%';
        videoElement.style.right = '0';
      }
    }
  }

  // 초기 실행 및 미디어쿼리 변경 이벤트 등록
  handleMediaQueryChange(mediaQuery); // 초기 실행
  mediaQuery.addEventListener('change', handleMediaQueryChange);

  // 리사이즈 이벤트에서 ScrollTrigger 새로고침만 수행 (애니메이션 상태 변경 없음)
  let resizeTimeout;
  window.addEventListener('resize', () => {
    if (resizeTimeout) {
      clearTimeout(resizeTimeout);
    }
    resizeTimeout = setTimeout(() => {
      // 모든 ScrollTrigger 새로고침 (다른 섹션의 스크롤 트리거 유지)
      ScrollTrigger.refresh();

      // 1024px 이상으로 전환될 때 초기 설정 강제 적용
      if (mediaQuery.matches && animationInitialized) {
        gsap.set('.intro__vid', {
          width: 'calc((100% - 60px) / 2)',
          right: '30px',
        });
      }
    }, 250);
  });
}

// DOM이 로드된 후 초기화
document.addEventListener('DOMContentLoaded', initVideoAnimation);

// sec-about
// gsap.registerPlugin(ScrollTrigger);

// const splitTypes = document.querySelectorAll('.sec-about__txt');
// splitTypes.forEach((char, i) => {
//   const text = new SplitType(char, { types: ['chars', 'words'] });
//   gsap.from(text.chars, {
//     scrollTrigger: {
//       trigger: char,
//       start: 'top 80%',
//       end: 'top 20%',
//       scrub: true,
//     },
//     opacity: 0.2,
//     stagger: 0.1,
//   });
// });

// gsap.registerPlugin(ScrollTrigger);

// const splitTypes = document.querySelectorAll('.sec-about .txt');
// splitTypes.forEach((char) => {
//   // SplitType으로 텍스트를 글자 단위로 나누기
//   const text = new SplitType(char, { types: ['chars', 'words'] });

//   // 각 문자에 대한 스크롤 애니메이션 설정
//   gsap.from(text.chars, {
//     scrollTrigger: {
//       trigger: char,
//       start: 'top 80%',
//       end: 'top 30%',
//       scrub: true,
//       //markers: true,
//     },
//     opacity: 0.2,
//     stagger: 0.1,
//   });

//   // 하이라이트 요소의 애니메이션 추가
//   const highlights = char.querySelectorAll('.highlight');
//   highlights.forEach((highlight) => {
//     gsap.to(highlight, {
//       scrollTrigger: {
//         trigger: char,
//         start: 'top 80%',
//         end: 'top 30%',
//         scrub: true,
//         onUpdate: (self) => {
//           // 스크롤 진행률에 따라 하이라이트 너비를 계산합니다.
//           const progress = self.progress; // 스크롤 진행률 (0 ~ 1 사이 값)
//           const maxWidth = 148; // 최대 너비를 150px로 제한
//           const newWidth = progress * maxWidth; // 진행률에 따른 너비 계산
//           highlight.style.setProperty('--highlight-width', `${newWidth}px`);
//         },
//       },
//     });
//   });
// });

// ScrollTrigger 플러그인을 등록합니다.
// gsap.registerPlugin(ScrollTrigger);

// // 텍스트가 위로 올라오는 애니메이션
// gsap.from('.txt', {
//   scrollTrigger: {
//     trigger: '.txt',
//     start: 'top 80%',
//     end: 'top 50%', // 스크롤 끝나는 위치 추가
//     toggleActions: 'play none none reverse', // 애니메이션이 끝나고 뒤로 돌아갈 때 초기화
//     onEnter: () => {
//       // 첫 번째 애니메이션 (배경 하이라이트 추가)
//       setTimeout(() => {
//         document.querySelector('.bg-highlight').classList.add('bg-highlight-active');
//       }, 500); // 0.5초 딜레이

//       // 두 번째 애니메이션 (밑줄 추가)
//       setTimeout(() => {
//         document.querySelector('.line-highlight').classList.add('line-highlight-active');
//       }, 1500); // 배경 하이라이트 후 추가로 1초 딜레이
//     },
//     onLeaveBack: () => {
//       // 스크롤이 위로 올라가면 클래스를 제거해 초기화
//       document.querySelector('.bg-highlight').classList.remove('bg-highlight-active');
//       document.querySelector('.line-highlight').classList.remove('line-highlight-active');
//     },
//   },
//   y: 50,
//   opacity: 0,
//   duration: 1,
//   ease: 'power3.out',
// });

gsap.registerPlugin(ScrollTrigger);

// SplitType으로 텍스트를 한 글자씩 분리합니다.
const splitText = new SplitType('.bg-highlight', { types: 'chars' });

gsap.fromTo(
  '.bottom-text-box__text',
  {
    y: '100%', // 시작 위치: 화면 아래
  },
  {
    scrollTrigger: {
      trigger: '.bottom-text-box__text',
      start: 'top 90%',
      end: 'top 50%',
      toggleActions: 'play none none reverse',
      //markers: true, // 마커 확인용

      onEnter: () => {
        // 첫 번째 애니메이션 (배경 하이라이트 추가)
        setTimeout(() => {
          document.querySelector('.bg-highlight').classList.add('bg-highlight-active');

          // SplitType으로 분리된 각 글자의 색상을 변경
          const highlightChars = document.querySelectorAll('.bg-highlight .char');
          gsap.to(highlightChars, {
            color: 'white',
            stagger: 0.05, // 각 글자마다 순차적으로 색상 변경
            duration: 0.5,
          });
        }, 500); // 0.5초 딜레이

        // 두 번째 애니메이션 (밑줄 추가)
        setTimeout(() => {
          document.querySelector('.line-highlight').classList.add('line-highlight-active');
        }, 1000); // 배경 하이라이트 후 추가로 1초 딜레이
      },
      onLeaveBack: () => {
        // 스크롤이 위로 올라가면 클래스를 제거해 초기화
        document.querySelector('.bg-highlight').classList.remove('bg-highlight-active');
        document.querySelector('.line-highlight').classList.remove('line-highlight-active');

        // SplitType으로 분리된 각 글자의 색상을 원래대로 복구
        const highlightChars = document.querySelectorAll('.bg-highlight .char');
        gsap.to(highlightChars, {
          color: 'black',
          stagger: 0.05,
          duration: 0.5,
        });
      },
    },
    y: 0,
    //y: 50,
    //opacity: 0,
    duration: 1,
    ease: 'power3.out',
  }
);

gsap.fromTo(
  '.stepinto',
  {
    y: '100%', // 시작 위치: 화면 아래
  },
  {
    y: '0%', // 끝 위치: 제자리
    duration: 0.6,
    ease: 'power1.out',
    scrollTrigger: {
      trigger: '.stepinto',
      start: 'top 70%',
      end: 'bottom 80%',
      toggleActions: 'play none none reverse',
      //markers: true, // 마커 확인용
    },
  }
);

gsap.from('.arrow-box__arrow', {
  scale: 0,
  duration: 0.6,
  scrollTrigger: {
    trigger: '.arrow-box__arrow',
    start: 'top 70%',
    end: 'bottom 80%',
    toggleActions: 'play none none reverse',
    //markers: true,
  },
});
