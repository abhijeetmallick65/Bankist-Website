'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(e => e.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// page navigation
/*
// unoptimized
const nav__link = document.querySelectorAll('.nav__link');
// console.log(nav__link);
document.querySelectorAll('.nav__link').forEach(function (el) {
  el.addEventListener('click', function (e) {
    e.preventDefault();
    console.log(this);
    const id = this.getAttribute('href');
    // console.log(id);
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  });
});
*/
// optimized;
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  if (
    !e.target.classList.contains('nav__link') ||
    e.target.classList.contains('btn--show-modal')
  )
    return;
  // console.log(e.target);
  const id = e.target.getAttribute('href');
  // console.log(id);
  document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
});

// tabbed components
const tabContainer = document.querySelector('.operations__tab-container');
const tab = document.querySelectorAll('.operations__tab');
const content = document.querySelectorAll('.operations__content');

tabContainer.addEventListener('click', function (e) {
  const curtab = e.target.closest('.operations__tab');
  // console.log(curtab);
  // guard clause
  if (!curtab) return;

  // remove classes
  tab.forEach(e => e.classList.remove('operations__tab--active'));
  content.forEach(e => e.classList.remove('operations__content--active'));

  // adding active classes
  curtab.classList.add('operations__tab--active');
  document
    .querySelector(`.operations__content--${curtab.dataset.tab}`)
    .classList.add('operations__content--active');
});

// fade on hover
const Handler = function (e) {
  // console.log(this);
  if (!e.target.classList.contains('nav__link')) return;
  const link = e.target;
  const siblings = link.closest('.nav').querySelectorAll('.nav__link');
  const logo = link.closest('.nav').querySelector('img');
  siblings.forEach(e => {
    if (e !== link) e.style.opacity = this;
  });
  logo.style.opacity = this;
};

const nav = document.querySelector('.nav');
nav.addEventListener('mouseover', Handler.bind(0.5));
nav.addEventListener('mouseout', Handler.bind(1));
/*
nav.addEventListener('mouseover', function (e) {
  Handler(e, 0.5);
});
nav.addEventListener('mouseout', function (e) {
  Handler(e, 1);
});
*/

// sticky navigation
const section1 = document.querySelector('#section--1');
/*
// unoptimized
const initialcoords = section1.getBoundingClientRect();
window.addEventListener('scroll', function () {
  // console.log(initialcoords);
  if (window.scrollY > initialcoords.top) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
});
*/
// optimized
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
const headcallback = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};
const headoptions = {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
};
const head = new IntersectionObserver(headcallback, headoptions);
head.observe(header);

// observe sections
const allSections = document.querySelectorAll('.section');
// console.log(allSections);
const sectioncallback = function (entries, observer) {
  // console.log(entries);
  const [entry] = entries;
  // console.log(entry);
  // if (!entry.isIntersecting) entry.target.classList.add('section--hidden');
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};
const sectionoptions = {
  root: null,
  threshold: 0.15,
};
// sectionObserver is the "observer"
const sectionObserver = new IntersectionObserver(
  sectioncallback,
  sectionoptions
);
allSections.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

// Lazy loading images
const allImages = document.querySelectorAll('img[data-src]');

const imageCallback = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;

  // replace original image
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};

const imageObserver = new IntersectionObserver(imageCallback, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

allImages.forEach(img => {
  imageObserver.observe(img);
});

// slideshow
const slider = function () {
  // elements
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dots = document.querySelector('.dots');
  let curslide = 0;
  let maxSlide = slides.length - 1;

  // functions
  // creating dots
  const createDots = function () {
    slides.forEach((_, i) => {
      const markup = `
    <button class = "dots__dot" data-slide = "${i}"></button>
    `;
      dots.insertAdjacentHTML('beforeend', markup);
    });
  };

  // add dots active class
  const dotActive = function (slide) {
    const allDots = document.querySelectorAll('.dots__dot');
    allDots.forEach(e => e.classList.remove('dots__dot--active'));
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  // previous slide
  const prevSlide = function () {
    if (curslide === 0) {
      curslide = maxSlide;
    } else {
      curslide--;
    }
    gotoSlide(curslide);
    dotActive(curslide);
  };

  // next slide
  const nextSlide = function () {
    if (curslide === maxSlide) {
      curslide = 0;
    } else {
      curslide++;
    }
    gotoSlide(curslide);
    dotActive(curslide);
  };

  // goto a slide and transform all others in the process
  const gotoSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${(i - slide) * 100}%)`)
    );
  };

  // initialization function
  const init = function () {
    gotoSlide(0);
    createDots();
    dotActive(0);
  };
  init();

  // event Handlers
  // right button
  btnRight.addEventListener('click', nextSlide);
  // left button
  btnLeft.addEventListener('click', prevSlide);
  // left and right arrows
  document.addEventListener('keydown', function (e) {
    // console.log(e);
    if (e.key === 'ArrowRight') nextSlide();
    e.key === 'ArrowLeft' && prevSlide();
  });
  // clicking on dots
  dots.addEventListener('click', function (e) {
    if (!e.target.classList.contains('dots__dot')) return;
    // const slide = e.target.dataset.slide;
    const { slide } = e.target.dataset;
    gotoSlide(slide);
    dotActive(slide);
  });
};
slider();
/* 
// Test
console.log(document.documentElement);
const live = document.getElementsByTagName('button');
console.log(live);
const msg = document.createElement('div');
msg.classList.add('cookie-message');

msg.innerHTML =
  'we use cookie. <button class = "btn btn--close-cookie">Got it !</button>';

const header = document.querySelector('.header');
header.append(msg);
header.after(msg);
header.before(msg);
header.prepend(msg);

msg.remove();
console.log(msg.className);
console.log(getComputedStyle(msg).height);
// document.documentElement.style.setProperty('--color-primary', 'orange');
const logo = document.querySelector('.nav__logo');
console.log(logo);
console.log(logo.getAttribute('src'));
logo.setAttribute('company', 'bankist');
console.log(logo.dataset.versionNumber);

// scrolling
const btnscroll = document.querySelector('.btn--scroll-to');
const section = document.querySelector('#section--1');
const header = document.querySelector('.header');
const SectionHeader = document.querySelector('.section__header');
btnscroll.addEventListener('click', function (e) {
  const sec1coords = section.getBoundingClientRect();
  console.log('header', header.getBoundingClientRect());

  // scrolling -> old school

  window.scrollTo({
    left: sec1coords.left + window.pageXOffset,
    top: sec1coords.top + window.pageYOffset,
    behavior: 'smooth',
  });

  // scrolling -> MODERN METHOD
  section.scrollIntoView({ behavior: 'smooth' });
});


// event propagation -> bubbling and capturing
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
const randColor = () =>
  `rgb(${randInt(0, 255)},${randInt(0, 255)},${randInt(0, 255)})`;

// console.log(randColor());

document.querySelector('.nav__link').addEventListener('click', function (e) {
  this.style.backgroundColor = randColor();
  console.log('LINK', e.target, e.currentTarget);
  // e.stopPropagation();
});
document.querySelector('.nav__links').addEventListener('click', function (e) {
  this.style.backgroundColor = randColor();
  console.log('LINKS', e.target, e.currentTarget);
});
// document.querySelector('.nav').addEventListener('click', function (e) {
//   this.style.backgroundColor = randColor();
//   console.log('NAV', e.target, e.currentTarget);
// },true);
document.querySelector('.nav').addEventListener(
  'click',
  function (e) {
    this.style.backgroundColor = randColor();
    console.log('NAV', e.target, e.currentTarget);
  },
  true
);

// intersection observer api
const observerCallback = function (entries, observer) {
  console.log(entries);
  entries.forEach(e => console.log(e));
};
const observerOptions = {
  root: null,
  threshold: [0, 0.2],
};
const observer = new IntersectionObserver(observerCallback, observerOptions);
observer.observe(section1);

// slides 
const gotoSlide = function (slide) {
  slides.forEach(
    (current, index) =>
      (current.style.transform = `translateX(${(index - slide) * 100}%)`)
  );
};
const nextSlide = function () {
  if (curslide === maxSlide) curslide = 0;
  else curslide++;
  console.log(curslide);
  gotoSlide(curslide);
};
const prevSlide = function () {
  if (curslide === 0) curslide = maxSlide;
  else curslide--;
  console.log(curslide);
  gotoSlide(curslide);
};
*/
