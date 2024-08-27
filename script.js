'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');

//  Tabbed component
const tabs = document.querySelectorAll('.operations__tab');
const tabContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

///////////////////////////////////////
// Modal window
const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(el => el.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

////////////////////////////////
// Button scrolling
btnScrollTo.addEventListener('click', e => {
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);

  console.log(e.target.getBoundingClientRect());

  console.log('Current scroll (X/Y)', window.scrollX, window.scrollY);

  console.log(
    'height/width viewport',
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );

  // Scrolling
  window.scrollTo(
    s1coords.left + window.scrollX,
    s1coords.top + window.scrollY
  );

  // Old way
  window.scrollTo({
    left: s1coords.left + window.scrollX,
    top: s1coords.top + window.scrollY,
    behavior: 'smooth',
  });

  // Modern way: this will calculate it automatically
  section1.scrollIntoView({ behavior: 'smooth' });
});

//////////////////////////////
// Event Delegation: Implementing Page Navigation
// Page Navigation

// document.querySelectorAll('.nav__link').forEach(el =>
//   el.addEventListener('click', e => {
//     e.preventDefault();
//     const id = e.target.getAttribute('href');
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   })
// );

// Event Delegation:
// a) Add event listener to common parent element
// b) Determine what element originated the event

document.querySelector('.nav__links').addEventListener('click', e => {
  e.preventDefault(); // prevent window reload

  // Matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href'); // get the element anchor/ href
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' }); // for smooth scrolling
  }
});

tabContainer.addEventListener('click', e => {
  const clicked = e.target.closest('.operations__tab');
  // Guard  clause
  if (!clicked) return;

  // Remove active class
  tabs.forEach(t => t.classList.remove('operations__tab--active')); // remove all active class
  tabsContent.forEach(content =>
    content.classList.remove('operations__content--active')
  ); // remove all active class

  // Active tab
  clicked.classList.add('operations__tab--active'); // activate

  // Activate content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active'); // activate
});

// Menu fade Animation
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

nav.addEventListener('mouseover', handleHover.bind(0.5));

nav.addEventListener('mouseout', handleHover.bind(1));

// Sticky Navigation
// const initialCoord = section1.getBoundingClientRect();
// window.addEventListener('scroll', () => {
//   window.scrollY > initialCoord.top
//     ? nav.classList.add('sticky')
//     : nav.classList.remove('sticky');
// });

// Better way of creating a sticky navigation as page is scroll(The Intersection Observer API)

// const obsCallback = (entries, observer) => {
//   entries.forEach(entry => {
//     console.log(entry);
//   });
// };

// const obsOptions = {
//   root: null,
//   threshold: [0, 0.2],
// };

// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height; // getting navHeight dynamically

const stickyNav = entries => {
  const [entry] = entries;
  !entry.isIntersecting
    ? nav.classList.add('sticky')
    : nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

// Reveal Section
const allSections = document.querySelectorAll('.section');
const revealSection = (entries, observer) => {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(section => {
  sectionObserver.observe(section);
  // section.classList.add('section--hidden');
});

// Lazy loading images
const imageTargets = document.querySelectorAll('img[data-src]'); // selecting img with data-src(CSS)
const loading = (entries, observer) => {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  // Replace src with data src
  entry.target.src = entry.target.dataset.src;

  // remove the blur effect after the normal image as loaded
  entry.target.addEventListener('load', () =>
    entry.target.classList.remove('lazy-img')
  );

  //stop observing
  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loading, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});
imageTargets.forEach(img => imgObserver.observe(img));

// Slider Component
const slider = () => {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length - 1;

  // Functions
  const createDots = () => {
    slides.forEach((_, i) => {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class='dots__dot' data-slide='${i}'></button>`
      );
    });
  };

  const activateDot = slide => {
    // remove dots__active
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    // add active to current dot clicked
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = slide =>
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );

  // Next slide
  const nextSlide = () => {
    curSlide === maxSlide ? (curSlide = 0) : curSlide++;
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  // Previous slide
  const prevSlide = () => {
    curSlide === 0 ? (curSlide = maxSlide) : curSlide--;
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  // initialize function
  const init = () => {
    goToSlide(0);
    createDots();
    activateDot(0);
  };
  init();

  // Event handler
  btnRight.addEventListener('click', nextSlide); // -100%, 0%, 100%, 200%
  btnLeft.addEventListener('click', prevSlide); // 200%, 1000%, 0, -100%

  // key pressed
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', e => {
    e.preventDefault();
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();
//////////////////////////////////////////////
//////////////////////////////////////////////
//////////////////////////////////////////////

/*
///////////////////////////////////////
// Selecting, Creating, and Deleting Elements

// Selecting elements
console.log(document.documentElement);
console.log(document.head);
console.log(document.body);

const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section');
console.log(allSections);

document.getElementById('section--1');
const allButtons = document.getElementsByTagName('button');
console.log(allButtons);

console.log(document.getElementsByClassName('btn'));

// Creating and inserting elements
const message = document.createElement('div');
message.classList.add('cookie-message');
// message.textContent = 'We use cookied for improved functionality and analytics.';
message.innerHTML =
  'We use cookied for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';


// header.prepend(message);
header.append(message);
// header.append(message.cloneNode(true));

// header.before(message);
// header.after(message);

// Delete elements
document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    // message.remove();
    message.parentElement.removeChild(message);
  });

  
///////////////////////////////////////
// Styles, Attributes and Classes
  
// Styles
message.style.backgroundColor = '#37383d';
message.style.width = '120%';

console.log(message.style.color);
console.log(message.style.backgroundColor);

console.log(getComputedStyle(message).color);
console.log(getComputedStyle(message).height);

message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';

document.documentElement.style.setProperty('--color-primary', 'orangered');


// Attributes
const logo = document.querySelector('.nav__logo');
console.log(logo.alt);
console.log(logo.className);

logo.alt = 'Beautiful minimalist logo';

// Non-standard
console.log(logo.designer);
console.log(logo.getAttribute('designer'));
logo.setAttribute('company', 'Bankist');



console.log(logo.src);
console.log(logo.getAttribute('src'));

const link = document.querySelector('.nav__link--btn');
console.log(link.href);
console.log(link.getAttribute('href'));


// Data attributes
const logo = document.querySelector('.nav__logo');
console.log(logo.dataset.versionNumber);


// Classes
logo.classList.add('c', 'j');
logo.classList.remove('c', 'j');
logo.classList.toggle('c');
logo.classList.contains('c'); // not includes

// Don't use
logo.clasName = 'jonas'; // only allow setting of a className and it replace any existing class name


///////////////////////////////////////
// Types of Events and Event Handlers
const h1 = document.querySelector('h1');

const alertH1 = function (e) {
  alert('addEventListener: Great! You are reading the heading :D');
};

h1.addEventListener('mouseenter', alertH1);

setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 3000); // removing event listener

// h1.onmouseenter = function (e) {
//   alert('onmouseenter: Great! You are reading the heading :D');
// };


//////////////////////////////////
// Event Propagation: Bubbling and Capturing: it is events propagating from one place to another. capturing is from top to bottom while bubbling is from bottom to top

// rgb(255,255,255)
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);
const randomColor = () =>
  `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

// DOM for nav__link
document.querySelector('.nav__link').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('LINK', e.target, e.currentTarget);
  console.log(e.currentTarget === this); // both target the element attached to the event handler

  // Stop propagation: not best practice to use, only for complex projects with several handlers
  // e.stopPropagation();
});

// DOM for nav__links
document.querySelector('.nav__links').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('CONTAINER', e.target, e.currentTarget);
  console.log(e.currentTarget === this); // both target the element attached to the event handler

  // Stop propagation: not best practice to use, only for complex projects with several handlers
  // e.stopPropagation();
});

// DOM for nav
document.querySelector('.nav').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('NAV', e.target, e.currentTarget);
  console.log(e.currentTarget === this); // both target the element attached to the event handler

  // Stop propagation: not best practice to use, only for complex projects with several handlers
  // e.stopPropagation();
});

// setting it to true will make event listener follow capturing event propagation


///////////////////////////////////
// DOM Traversing

const h1 = document.querySelector('h1');

// Going downwards: selecting child element
console.log(h1.querySelectorAll('.highlight'));
console.log(h1.childNodes); // not advisable to use
console.log(h1.children);
h1.firstElementChild.style.color = 'red'; // first child in the element
h1.lastElementChild.style.color = 'red'; // last child in the element

// Going upwards: selecting parents
console.log(h1.parentNode); // direct parent for the element. can be anything
console.log(h1.parentElement); // direct parent for the element. we use this

h1.closest('.header').style.background = 'var(--gradient-secondary)'; // Searching/finding parent element for a specific element using the closest method no matter how far they are in the DOM tree

h1.closest('h1').style.background = 'var(--gradient-primary)';

// Going sideways: Selecting siblings, we can only access direct siblings which is the previous and the next one
console.log(h1.previousElementSibling); // element before it in the same parent
console.log(h1.nextElementSibling); // element directly next to it in the same parent

console.log(h1.previousSibling);
console.log(h1.nextSibling);

console.log(h1.parentElement.children); // Getting all the siblings

[...h1.parentElement.children].forEach(el => {
  if (el !== h1) el.style.transform = 'scale(0.5)';
});

*/

document.addEventListener('DOMContentLoaded', e =>
  console.log('HTML parsed and DOM tree built', e)
);

window.addEventListener('load', e => console.log('Page fully loaded', e));

// use case, when leaving page
// window.addEventListener('beforeunload', e => {
//   e.preventDefault();
//   console.log(e);
//   e.returnValue = '';
// });

///////////////////////////////////////////
// Different ways of loading script in HTML(DEFER and ASYNC script loading)
