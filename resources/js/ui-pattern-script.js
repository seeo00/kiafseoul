// .all-menu 를 클릭했을 때
// #nav-all 에게 .active 클래스를 추가한다.
$('.all-menu').click(function () {
  $('#nav-all').addClass('active');
});

// #nav-all .close 를 클릭했을 때
// #nav-all 에게 .active 클래스를 제거한다.
$('#nav-all .close').click(function () {
  $('#nav-all').removeClass('active');
});

$('#gnb').mouseenter(function () {
  $('#header').addClass('active');
});

$('#gnb').mouseleave(function () {
  $('#header').removeClass('active');
});

$('.lang__btn').click(function () {
  $('.lang__lst').show();
});

$('.lang__lst li').click(function () {
  $('.lang__lst').hide();
});

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

// gsap.timeline().from('.fixed-txt', { duration: 1, y: '7vw', ease: 'power3.out', onComplete: () => masterTl.play() });

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

// intro 동영상 시작 시점 설정
document.addEventListener('DOMContentLoaded', function () {
  const video = document.getElementById('introVideo');

  video.addEventListener('loadedmetadata', function () {
    video.currentTime = 58; // 원하는 시점으로 설정 (예: 10초부터 시작)
  });
});

//intro 동영상 애니메이션
// document.addEventListener('scroll', function () {
//   const scrollPosition = window.scrollY;
//   const videoBox = document.querySelector('.intro__vid');

//   // 스크롤 범위에 따라 width와 left 위치 조정
//   const newWidth = Math.min(100, 50 + (scrollPosition / window.innerHeight) * 50); // 너비를 50%에서 100%까지 증가
//   const newRight = Math.max(30 - (scrollPosition / window.innerHeight) * 60, 0); // right 값을 줄여서 left 쪽으로 이동

//   videoBox.style.width = `${newWidth}%`;
//   videoBox.style.right = `${newRight}px`;
// });

gsap.registerPlugin(ScrollTrigger);

// 동영상 초기 너비 설정
gsap.set('.intro__vid', { width: '50%', right: '30px' });

// GSAP을 사용하여 스크롤에 따라 너비 조정
gsap.to('.intro__vid', {
  scrollTrigger: {
    trigger: '#wrap',
    start: 'top top',
    scrub: true,
    end: 'bottom top',
    markers: true,
    pin: true,
  },
  width: () => `${document.querySelector('.inner').clientWidth - 60}px`, // left 30px, right 30px 제외
});
