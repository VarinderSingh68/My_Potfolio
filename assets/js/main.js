(function() {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Hero typed effect
   */
  const typed = document.querySelector('.typed');
  if (typed) {
    let typed_strings = typed.getAttribute('data-typed-items');
    typed_strings = typed_strings.split(',');
    new Typed('.typed', {
      strings: typed_strings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000
    });
  }

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  mobileNavToggleBtn.addEventListener('click', mobileNavToogle);

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  document.addEventListener('DOMContentLoaded', () => {
    /**
     * GSAP Animations
     */
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);

      // Hero Section Animation
      const heroSection = document.querySelector('#hero');
      if (heroSection) {
        gsap.from('.hero h2', { duration: 1, y: 50, opacity: 0, ease: 'power2.out', delay: 0.2 });
        gsap.from('.hero p', { duration: 1, y: 50, opacity: 0, ease: 'power2.out', delay: 0.4 });
        gsap.from('.hero .btn-get-started', { duration: 1, y: 50, opacity: 0, ease: 'power2.out', delay: 0.6 });
      }

      // Skills Section Animation
      const skillsSection = document.querySelector('#skills');
      if (skillsSection) {
        gsap.utils.toArray('.skills-content .progress').forEach(progressEl => {
          const bar = progressEl.querySelector('.progress-bar');
          const valueEl = progressEl.querySelector('.val');
          const targetWidth = bar.getAttribute('aria-valuenow');
          const proxy = { value: 0 };

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: progressEl,
              start: 'top 90%',
              toggleActions: 'play none none none',
            }
          });

          tl.to(bar, {
            width: `${targetWidth}%`,
            duration: 1.5,
            ease: 'power2.inOut'
          })
          .to(proxy, {
            value: targetWidth,
            duration: 1.5,
            ease: 'power2.inOut',
            onUpdate: () => {
              valueEl.textContent = `${Math.round(proxy.value)}%`;
            }
          }, "-=1.5"); // Start at the same time as the bar animation
        });
      }

      // Particles animation on hero section
      const particlesContainer = document.querySelector('#tsparticles');
      if (particlesContainer && typeof tsParticles !== 'undefined') {
        tsParticles.load('tsparticles', {
          interactivity: {
            events: {
              onHover: {
                enable: true,
                mode: 'grab' // Changed from 'bubble' to 'grab'
              },
              resize: true
            },
            modes: {
              grab: {
                distance: 150,
                links: {
                  opacity: 0.5
                }
              },
              bubble: {
                distance: 40,
                duration: 2,
                opacity: 1,
                size: 3
              }
            }
          },
          particles: {
            color: {
              value: '#3ddcff' // Using the primary glow color
            },
            links: {
              color: '#ffffff',
              distance: 150,
              enable: true, // Enabled links
              opacity: 0.1,
              width: 1
            },
            move: {
              direction: 'none',
              enable: true,
              outModes: 'out',
              random: false, // Set to false for more uniform movement
              speed: 0.5, // Slowed down for a calmer effect
              straight: false
            },
            number: {
              density: {
                enable: true,
                area: 800
              },
              value: 80 // Reduced particle count for a cleaner look
            },
            opacity: {
              value: {
                min: 0.1,
                max: 0.5 // Adjusted max opacity
              },
              animation: {
                enable: true,
                speed: 1,
                sync: false
              }
            },
            shape: {
              type: 'circle'
            },
            size: {
              value: {
                min: 1,
                max: 3
              },
              animation: {
                enable: false, // Disabled size animation for consistency
                speed: 2,
                sync: false
              }
            }
          },
          detectRetina: true
        });
      }
    }
  });

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
      filters.addEventListener('click', function() {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });

  });

})();