var swiper = new Swiper('.slide-studio', {
  slidesPerView: 'auto',
  //slidesPerView: 1,
  spaceBetween: 20,
  //slidesOffsetAfter: 150,
  loop: true,
  pagination: {
    el: '.slide-studio .swiper-pagination',
    clickable: true,
  },
  breakpoints: {
    600: {
      slidesPerView: 'auto',
      //slidesPerView: 2,
      spaceBetween: 20,
      //slidesOffsetAfter: 10,
    },
    1024: {
      slidesPerView: 'auto',
      spaceBetween: 20,
      slidesOffsetAfter: 30,
    },
  },
});

var swiper = new Swiper('.story-swiper', {
  slidesPerView: 1,
  spaceBetween: 20,

  pagination: {
    el: '.story-swiper .swiper-pagination',
    clickable: true,
  },
  breakpoints: {
    600: {
      slidesPerView: '2',
      spaceBetween: 30,
    },
    1024: {
      slidesPerView: '3',
      spaceBetween: 30,
    },
  },
});
