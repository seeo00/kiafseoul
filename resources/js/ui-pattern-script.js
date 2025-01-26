// header
const menuTimeline = gsap.timeline({ paused: true, reversed: true });

menuTimeline
  // 첫 번째 선 애니메이션 (아래로 이동, 45도 회전)
  .to('.line1', {
    y: 9, // 아래로 이동
    scaleX: Math.sqrt(2),
    rotation: 45, // 45도 회전
    duration: 0.3,
    transformOrigin: 'center center', // 회전 기준점 설정
  })
  // 두 번째 선 애니메이션 (사라짐)
  .to(
    '.line2',
    {
      opacity: 0, // 사라짐
      duration: 0.3,
    },
    '<' // 이전 애니메이션과 동시에 실행
  )
  // 세 번째 선 애니메이션 (위로 이동, -45도 회전)
  .to(
    '.line3',
    {
      y: -9, // 위로 이동
      scaleX: Math.sqrt(2),
      rotation: -45, // -45도 회전
      duration: 0.3,
      transformOrigin: 'center center', // 회전 기준점 설정
    },
    '<'
  );

// Lenis 초기화
const lenis = new Lenis();

// 메뉴 토글 함수
function toggleMenu() {
  // 애니메이션 실행
  menuTimeline.reversed() ? menuTimeline.play() : menuTimeline.reverse();

  // #nav-all 요소에 .active 클래스 토글
  const navElement = document.querySelector('#nav-all');
  if (navElement) {
    // active 클래스 토글
    const isActive = navElement.classList.toggle('active');

    if (isActive) {
      lenis.stop(); // Lenis 스크롤 비활성화
    } else {
      lenis.start(); // Lenis 스크롤 활성화
    }
  }
}

// 버튼에 클릭 이벤트 리스너 추가
const button = document.querySelector('.all-menu');
if (button) {
  button.addEventListener('click', toggleMenu);
} else {
  console.error('.all-menu 버튼을 찾을 수 없습니다.');
}

// Lenis와 GSAP ScrollTrigger 동기화
lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0); // GSAP lagSmoothing 비활성화

// intro 텍스트 애니메이션
gsap.registerPlugin(TextPlugin);

const words = ['Future', 'Artists', 'Diversity', 'Ideas', 'Inspiration'];

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

gsap.set('.fixed-txt .word', { y: '100%', opacity: 0 });

gsap.fromTo(
  '.fixed-txt .word',
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

words.forEach((word) => {
  let tl = gsap.timeline({ repeat: 1, yoyo: true, repeatDelay: 1 });
  tl.to('.ani-txt .text', { duration: 1, text: word });
  masterTl.add(tl);
});

// intro 동영상 애니메이션
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

// sec-leadin 텍스트 애니메이션
gsap.registerPlugin(ScrollTrigger);

// SplitType으로 텍스트를 한 글자씩 분리
const splitText = new SplitType('.bg-highlight', { types: 'chars' });

gsap.fromTo(
  '.txt-box__bottom',
  {
    y: '100%', // 시작 위치: 화면 아래
  },
  {
    scrollTrigger: {
      trigger: '.txt-box__bottom',
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
    duration: 1,
    ease: 'power3.out',
  }
);

// 타임라인 생성
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: '.stepinto', // 타임라인 트리거 기준
    start: 'top 80%',
    end: 'bottom 80%',
    toggleActions: 'play none none reverse',
    //markers: true, // 디버깅용 마커
  },
});
// 1. .stepinto 애니메이션 추가
tl.fromTo(
  '.stepinto',
  { y: '100%' }, // 시작 위치
  { y: '0%', duration: 0.6, ease: 'power1.out' } // 끝 위치
);

// 2. .arrow-box__arrow 애니메이션 추가
tl.from(
  '.arrow-box__arrow',
  { scale: 0, duration: 0.6 },
  '-=0.3' // 이전 애니메이션이 끝나기 0.3초 전에 시작
);

// 아코디언
// 모든 카드 요소 선택
// .wrapper-accordion 내부의 모든 .desktop .card__item 요소 선택
const cards = document.querySelectorAll('.wrapper-accordion .desktop .card__item');

// 각 카드에 마우스 오버/아웃 이벤트 리스너 추가
cards.forEach((card, index) => {
  card.addEventListener('mouseenter', () => {
    if (index === 0) {
      // 첫 번째 카드에 마우스 오버 시
      cards[1].style.height = '20%'; // 두 번째 카드 높이 줄임
      cards[2].style.height = '10%'; // 세 번째 카드 높이 줄임
      const secondCardText = cards[1].querySelector('.top-box');
      const ThirdCardText = cards[2].querySelector('.top-box');
      secondCardText.style.opacity = '0';
      ThirdCardText.style.opacity = '0';
    } else if (index === 1) {
      // 두 번째 카드에 마우스 오버 시
      card.style.height = '90%'; // 두 번째 카드 높이 확대
      cards[2].style.height = '10%'; // 세 번째 카드 높이 줄임

      // 첫 번째 카드의 텍스트 숨김
      const firstCardText = cards[0].querySelector('.top-box');
      firstCardText.style.opacity = '0';
      const ThirdCardText = cards[2].querySelector('.top-box');
      ThirdCardText.style.opacity = '0';
    } else if (index === 2) {
      // 세 번째 카드에 마우스 오버 시
      card.style.height = '80%'; // 세 번째 카드 높이 확대
      cards[1].style.height = '90%'; // 두 번째 카드 높이 확대

      // 첫 번째와 두 번째 카드의 텍스트 숨김
      const firstCardText = cards[0].querySelector('.top-box');
      const secondCardText = cards[1].querySelector('.top-box');
      firstCardText.style.opacity = '0';
      secondCardText.style.opacity = '0';
    }
  });

  // 마우스가 카드에서 벗어났을 때 모든 카드의 높이와 텍스트 opacity를 원래 값으로 되돌림
  card.addEventListener('mouseleave', () => {
    cards.forEach((c) => {
      c.style.height = ''; // 원래 높이로 되돌리기

      // 모든 카드 텍스트의 opacity를 다시 1로 설정
      const cardText = c.querySelector('.top-box');
      cardText.style.opacity = '1';
    });
  });
});

// sec-tag 텍스트 무한 루프
document.addEventListener('DOMContentLoaded', () => {
  const secTagText = document.querySelector('.sec-tag__text'); // 부모 컨테이너
  const textBox = secTagText.querySelector('.text-box'); // 원본 텍스트 박스
  const repeatCount = 6; // 반복하고 싶은 개수 (원본 포함)

  for (let i = 1; i < repeatCount; i++) {
    const clone = textBox.cloneNode(true); // .text-box 복사
    secTagText.appendChild(clone); // 부모 컨테이너에 추가
  }
});

// sec-tag matter js
(function () {
  const wallThickness = 80; // 벽의 두께 변수
  const matterContainer = document.querySelector('.sec-tag__cont');
  const matterCanvas = document.querySelector('.sec-tag__canvas');

  // 초기 셋팅
  let Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    World = Matter.World,
    Composite = Matter.Composite;

  let engine, render, runner;
  let domBodies = document.querySelectorAll('.tag__item');
  let matterBodies = {};
  let leftWall, rightWall, ground;

  function init() {
    if (render) return; // 이미 초기화된 경우 중복 실행 방지

    engine = Engine.create();
    render = Render.create({
      element: matterCanvas,
      engine: engine,
      background: 'transparent',
      options: {
        width: matterContainer.offsetWidth,
        height: matterContainer.offsetHeight,
        wireframes: false,
      },
    });

    createBounds();
    Composite.add(engine.world, [leftWall, rightWall, ground]);

    Render.run(render);
    runner = Runner.create();
    Runner.run(runner, engine);

    createMatterBodies();
    World.add(engine.world, Object.values(matterBodies));

    window.requestAnimationFrame(updateElementPositions);
  }

  function destroy() {
    if (!render) return; // 초기화되지 않은 상태에서 호출 방지

    Matter.Render.stop(render);
    Matter.World.clear(engine.world, false);
    Matter.Engine.clear(engine);

    render.canvas.remove();
    render = null; // render를 명시적으로 null로 설정
  }

  function createBounds() {
    ground = Bodies.rectangle(
      matterContainer.offsetWidth / 2,
      matterContainer.offsetHeight + wallThickness / 2,
      matterContainer.offsetWidth,
      wallThickness,
      { isStatic: true }
    );

    leftWall = Bodies.rectangle(
      0 - wallThickness / 2,
      matterContainer.offsetHeight / 2,
      wallThickness,
      matterContainer.offsetHeight * 5,
      { isStatic: true }
    );

    rightWall = Bodies.rectangle(
      matterContainer.offsetWidth + wallThickness / 2,
      matterContainer.offsetHeight / 2,
      wallThickness,
      matterContainer.offsetHeight * 5,
      { isStatic: true }
    );
  }

  function createMatterBodies() {
    domBodies = document.querySelectorAll('.tag__item');
    matterBodies = {};

    domBodies.forEach(function (domBody) {
      const matterBody = Bodies.rectangle(
        matterContainer.offsetWidth / 2,
        -matterContainer.offsetHeight,
        domBody.offsetWidth,
        domBody.offsetHeight,
        {
          chamfer: { radius: domBody.offsetHeight / 2 },
          restitution: 0.05,
          density: Math.random() * 5 + 1,
          angle: Math.random() * 10,
          friction: 1,
          frictionAir: Math.random() / 150,
        }
      );

      matterBody.sleepThreshold = Infinity; // 슬립 비활성화
      domBody.id = matterBody.id;
      matterBodies[matterBody.id] = matterBody;
    });
  }

  function updateElementPositions() {
    domBodies.forEach((domBody) => {
      const matterBody = matterBodies[domBody.id];
      if (matterBody) {
        domBody.style.transform =
          `translate( ${-domBody.offsetWidth + matterBody.position.x + domBody.offsetWidth / 2}px, ` +
          `${-domBody.offsetHeight + matterBody.position.y + domBody.offsetHeight / 2}px )` +
          ` rotate(${matterBody.angle}rad)`;
      }
    });

    window.requestAnimationFrame(updateElementPositions);
  }

  function handleResize() {
    if (!render || !render.canvas) return; // render 또는 canvas가 없으면 종료

    render.canvas.width = matterContainer.offsetWidth;
    render.canvas.height = matterContainer.offsetHeight;

    Matter.Render.setPixelRatio(render, window.devicePixelRatio);

    World.clear(engine.world, false);
    Composite.clear(engine.world, false);

    createBounds();
    Composite.add(engine.world, [leftWall, rightWall, ground]);

    createMatterBodies();
    World.add(engine.world, Object.values(matterBodies));
  }

  ScrollTrigger.create({
    trigger: '.sec-tag__cont',
    start: 'top 90%',
    end: 'bottom 10%',
    onEnter: () => init(),
    onLeave: () => destroy(),
    onEnterBack: () => init(),
    onLeaveBack: () => destroy(),
    //markers: true,
  });

  window.addEventListener('resize', () => {
    if (render) {
      handleResize();
      ScrollTrigger.refresh();
    }
  });
})();

// sec-card 페이드인 스크롤트리거
let isActive = false;

ScrollTrigger.create({
  trigger: '.sec-card',
  start: 'top 75%',
  end: 'top 20%',
  //markers: true,
  onEnter: () => {
    if (!isActive) {
      isActive = true;
      gsap.to('.sec-card', { opacity: 1, y: 0, duration: 1, ease: 'power2.out' });
    }
  },
  onLeaveBack: () => {
    if (isActive) {
      isActive = false;
      gsap.to('.sec-card', { opacity: 0, y: 50, duration: 1, ease: 'power2.out' });
    }
  },
});

gsap.registerPlugin(ScrollTrigger);

ScrollTrigger.matchMedia({
  // 600px 이하에서만 동작
  '(max-width: 600px)': function () {
    gsap.utils.toArray('.btn-text').forEach((element) => {
      // 각 .btn-text의 부모 .card__item을 트리거로 설정
      let triggerElement = element.closest('.card__item');

      let isActive = false; // 상태 플래그

      gsap.fromTo(
        element, // 애니메이션 대상: .btn-text
        { opacity: 0 }, // 초기 상태
        {
          opacity: 1,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: triggerElement, // 트리거는 부모 .card__item
            start: 'top 60%', // 트리거 시작 지점
            end: 'top 60%', // 트리거 종료 지점
            //markers: true, // 디버깅 마커

            onEnter: () => {
              if (!isActive) {
                isActive = true;

                gsap.to(element, {
                  opacity: 1, // .btn-text를 보여줌
                  duration: 0.3,
                  ease: 'linear',
                });
              }
            },

            onLeaveBack: () => {
              if (isActive) {
                isActive = false;

                gsap.to(element, {
                  opacity: 0, // .btn-text를 다시 숨김
                  duration: 0.3,
                  ease: 'linear',
                });
              }
            },
          },
        }
      );
    });
  },
});
