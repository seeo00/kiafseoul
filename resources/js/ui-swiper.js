// var swiper = new Swiper('.slide-intro', {
//   slidesPerView: 1,
//   spaceBetween: 10,
//   loop: true,
//   // autoplay: true,
//   pagination: {
//     el: '.slide-intro .swiper-pagination',
//     clickable: true,
//   },
// });

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
