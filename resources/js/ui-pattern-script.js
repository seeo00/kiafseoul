// intro 텍스트 애니메이션
gsap.registerPlugin(TextPlugin);

const words = ['Future', 'Artists', 'Creativity', 'Innovation', 'Inspiration'];

let cursor = gsap.to('.cursor', {
  opacity: 0,
  repeat: -1,
  yoyo: true,
  duration: 0.01,
  repeatDelay: 0.5,
});
let masterTl = gsap.timeline({ repeat: -1 }).pause();

gsap.timeline().from('.fixed-txt span', {
  duration: 0.4,
  y: '100%',
  ease: 'power2.out',
  //opacity: 0,
  stagger: {
    amount: 1,
    from: 'start',
    each: 0.1,
  },
  onComplete: () => masterTl.play(),
});

words.forEach((word) => {
  let tl = gsap.timeline({ repeat: 1, yoyo: true, repeatDelay: 1 });
  tl.to('.text', { duration: 1, text: word });
  masterTl.add(tl);
});

//intro 동영상 애니메이션
gsap.registerPlugin(ScrollTrigger);

const mediaQuery = window.matchMedia('(min-width: 1024px)');

// GSAP 애니메이션 초기화 함수
function initVideoAnimation() {
  // ScrollTrigger 플러그인 등록
  gsap.registerPlugin(ScrollTrigger);

  // 비디오 애니메이션 생성 함수
  function createVideoAnimation() {
    // 동영상 초기 너비 설정
    gsap.set('.intro__vid', {
      width: 'calc((100% - 60px) / 2)',
      right: '30px',
    });

    // 스크롤에 따른 너비 조정 애니메이션
    gsap.to('.intro__vid', {
      scrollTrigger: {
        trigger: '.intro',
        //scroller: document.body,
        start: 'top top',
        scrub: 0.3,
        end: 'bottom top',
        //markers: true,
        pin: true,
      },
      width: 'calc(100% - 60px)',
      ease: 'power2.inOut',
    });
  }

  // 애니메이션 클린업 함수
  function cleanupVideoAnimation() {
    // ScrollTrigger 인스턴스 제거
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

    // GSAP 애니메이션 제거
    gsap.killTweensOf('.intro__vid');

    // 비디오 요소의 스타일 초기화
    gsap.set('.intro__vid', {
      clearProps: 'all', // 모든 GSAP 속성 초기화
    });
  }

  // 미디어쿼리 변경 감지 핸들러
  function handleMediaQueryChange(e) {
    cleanupVideoAnimation(); // 변경이 발생할 때마다 먼저 정리

    if (e.matches) {
      // 데스크톱 사이즈일 때 애니메이션 실행
      createVideoAnimation();
    } else {
      // 태블릿/모바일 사이즈일 때 애니메이션 제거 후 기본 스타일 적용
      const videoElement = document.querySelector('.intro__vid');
      if (videoElement) {
        videoElement.style.width = '100%';
        videoElement.style.right = '0';
      }
    }
  }

  // 초기 실행 및 리사이즈 이벤트 리스너 등록
  handleMediaQueryChange(mediaQuery); // 초기 실행
  mediaQuery.addEventListener('change', handleMediaQueryChange);

  // 추가: 리사이즈 이벤트에서 애니메이션 상태 동기화
  window.addEventListener('resize', () => {
    // 화면 크기 변경 시 애니메이션과 트리거 새로고침
    handleMediaQueryChange(mediaQuery);
    ScrollTrigger.refresh();
  });
}

// DOM이 로드된 후 초기화
document.addEventListener('DOMContentLoaded', initVideoAnimation);

// 스크롤 테스트
// gsap.registerPlugin(ScrollTrigger);

// // Lenis 초기화
// const lenis = new Lenis({
//   duration: 1.2, // 부드러운 스크롤 지속 시간
//   smooth: true, // 부드러운 스크롤 활성화
// });

// // Lenis 스크롤을 계속 업데이트하는 애니메이션 루프 설정
// function raf(time) {
//   lenis.raf(time); // Lenis 업데이트
//   ScrollTrigger.update(); // ScrollTrigger 업데이트
//   requestAnimationFrame(raf);
// }
// requestAnimationFrame(raf);

// // ScrollTrigger가 Lenis의 스크롤을 인식하도록 설정
// ScrollTrigger.scrollerProxy(document.body, {
//   scrollTop(value) {
//     return arguments.length ? lenis.scrollTo(value) : lenis.scroll;
//   },
//   getBoundingClientRect() {
//     return {
//       top: 0,
//       left: 0,
//       width: window.innerWidth,
//       height: window.innerHeight,
//     };
//   },
//   pinType: document.body.style.transform ? 'transform' : 'fixed',
// });

// // Lenis 스크롤 이벤트 감지
// lenis.on('scroll', ScrollTrigger.update);

// intro 텍스트 애니메이션
// intro 텍스트 애니메이션
// intro 텍스트 애니메이션
// const words = ['Future', 'Artists', 'Creativity', 'Innovation', 'Inspiration'];

// let cursor = gsap.to('.cursor', {
//   opacity: 0,
//   repeat: -1,
//   yoyo: true,
//   duration: 0.01,
//   repeatDelay: 0.5,
// });
// let masterTl = gsap.timeline({ repeat: -1 }).pause();

// gsap.timeline().from('.fixed-txt span', {
//   duration: 0.4,
//   y: '100%',
//   ease: 'power2.out',
//   stagger: {
//     amount: 1,
//     from: 'start',
//     each: 0.1,
//   },
//   onComplete: () => masterTl.play(),
// });

// words.forEach((word) => {
//   let tl = gsap.timeline({ repeat: 1, yoyo: true, repeatDelay: 1 });
//   tl.to('.text', { duration: 1, text: word });
//   masterTl.add(tl);
// });

// // ScrollTrigger 및 Lenis 초기화
// const mediaQuery = window.matchMedia('(min-width: 1024px)');

// gsap.registerPlugin(ScrollTrigger, TextPlugin);

// // GSAP 애니메이션 초기화 함수
// function initVideoAnimation() {
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
//         scroller: document.body,
//         start: 'top top',
//         scrub: 0.3,
//         end: 'bottom top',
//         pin: true,
//         onRefresh: () => ScrollTrigger.update(), // 새로고침 시 동기화 문제 해결
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
//       ScrollTrigger.refresh(); // 새로 고침으로 상태 동기화
//     } else {
//       // 태블릿/모바일 사이즈일 때 기본 스타일 적용
//       const videoElement = document.querySelector('.intro__vid');
//       if (videoElement) {
//         videoElement.style.width = '100%';
//         videoElement.style.right = '0';
//       }
//     }
//   }

//   // 초기 실행 및 리사이즈 이벤트 리스너 등록
//   window.addEventListener('load', () => handleMediaQueryChange(mediaQuery)); // 초기 실행을 load 이벤트로 변경하여 모든 리소스 로드 후 실행
//   mediaQuery.addEventListener('change', handleMediaQueryChange);

//   // 추가: 리사이즈 이벤트에서 애니메이션 상태 동기화
//   window.addEventListener('resize', () => {
//     handleMediaQueryChange(mediaQuery);
//     ScrollTrigger.refresh();
//   });
// }

// // Lenis 초기화 및 ScrollTrigger 설정
// const lenis = new Lenis({
//   duration: 1.2, // 부드러운 스크롤 지속 시간
//   smooth: true, // 부드러운 스크롤 활성화
// });

// // Lenis 스크롤을 계속 업데이트하는 애니메이션 루프 설정
// function raf(time) {
//   lenis.raf(time); // Lenis 업데이트
//   if (lenis.isScrolling) {
//     ScrollTrigger.update(); // Lenis가 스크롤 중일 때만 ScrollTrigger 업데이트
//   }
//   requestAnimationFrame(raf);
// }

// // ScrollTrigger가 Lenis의 스크롤을 인식하도록 설정
// ScrollTrigger.scrollerProxy(document.body, {
//   scrollTop(value) {
//     return arguments.length ? lenis.scrollTo(value) : lenis.scroll;
//   },
//   getBoundingClientRect() {
//     return {
//       top: 0,
//       left: 0,
//       width: window.innerWidth,
//       height: window.innerHeight,
//     };
//   },
//   pinType: document.body.style.transform ? 'transform' : 'fixed',
// });

// // Lenis 스크롤 이벤트 감지
// lenis.on('scroll', ScrollTrigger.update);

// // DOM이 로드된 후 초기화
// document.addEventListener('DOMContentLoaded', () => {
//   window.scrollTo(0, 0); // 새로고침 시 초기 화면으로 이동
//   initVideoAnimation(); // 애니메이션 초기화
//   requestAnimationFrame(() => {
//     raf(); // Lenis 애니메이션 루프 시작
//     setTimeout(() => {
//       ScrollTrigger.refresh(); // 스크롤 트리거 새로 고침
//     }, 200); // 모든 요소 로드 후 스크롤 트리거 새로 고침
//   });
// });
