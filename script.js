document.addEventListener('DOMContentLoaded', () => {
  // Initialize all core portfolio features
  initTypingEffect();
  initMobileMenu();
  initHeaderScroll();
  initActiveSectionTracker();
  initSmoothScroll();
  initScrollReveal();
  initProjectFilters();
});

/**
 * Robust Typewriter Effect for the Hero Tagline
 */
class TypeWriter {
  constructor(element, phrases, wait = 2000) {
    this.element = element;
    this.phrases = phrases;
    this.txt = '';
    this.phraseIndex = 0;
    this.wait = parseInt(wait, 10);
    this.isDeleting = false;
    this.tick();
  }

  tick() {
    const current = this.phraseIndex % this.phrases.length;
    const fullTxt = this.phrases[current];

    if (this.isDeleting) {
      this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
      this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    this.element.innerHTML = `<span class="typing-text-content">${this.txt}</span><span class="typing-cursor" aria-hidden="true">|</span>`;

    let typeSpeed = 80 - Math.random() * 40;

    if (this.isDeleting) {
      typeSpeed /= 2;
    }

    if (!this.isDeleting && this.txt === fullTxt) {
      typeSpeed = this.wait;
      this.isDeleting = true;
    } else if (this.isDeleting && this.txt === '') {
      this.isDeleting = false;
      this.phraseIndex++;
      typeSpeed = 600;
    }

    setTimeout(() => this.tick(), typeSpeed);
  }
}

function initTypingEffect() {
  const typingElement = document.querySelector('[data-typing-effect]');
  if (!typingElement) return;

  const phrases = [
    'Full-Stack Developer',
    'Agentic AI Architect',
    'SaaS Product Builder',
    'System Design Enthusiast',
    'Automation Specialist'
  ];
  
  const delay = typingElement.getAttribute('data-wait') || 2500;
  new TypeWriter(typingElement, phrases, delay);
}

/**
 * Mobile Navigation Menu Handler
 */
function initMobileMenu() {
  const burger = document.querySelector('.mobile-menu-toggle');
  const nav = document.querySelector('.nav-links');
  const links = document.querySelectorAll('.nav-links li');

  if (!burger || !nav) return;

  const toggleMenu = () => {
    nav.classList.toggle('nav-active');
    burger.classList.toggle('toggle-active');
    
    const isExpanded = burger.getAttribute('aria-expanded') === 'true';
    burger.setAttribute('aria-expanded', !isExpanded);

    links.forEach((link, index) => {
      if (link.style.animation) {
        link.style.animation = '';
      } else {
        link.style.animation = `navLinkFade 0.4s ease forwards ${index / 7 + 0.1}s`;
      }
    });
  };

  burger.addEventListener('click', toggleMenu);

  links.forEach(link => {
    link.addEventListener('click', () => {
      if (nav.classList.contains('nav-active')) {
        toggleMenu();
      }
    });
  });
}

/**
 * Header dynamic background and styling on scroll
 */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/**
 * Smooth internal anchor routing with offset compensation for fixed header
 */
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');
  const headerHeight = document.querySelector('.site-header')?.offsetHeight || 70;

  links.forEach(link => {
    link.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/**
 * Active Navigation Link Highlighter based on current viewport section
 */
function initActiveSectionTracker() {
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-links a');
  
  if (!sections.length || !navItems.length) return;

  const options = {
    root: null,
    rootMargin: '-30% 0px -60% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        
        navItems.forEach(item => {
          item.classList.remove('active-nav-link');
          if (item.getAttribute('href') === `#${id}`) {
            item.classList.add('active-nav-link');
          }
        });
      }
    });
  }, options);

  sections.forEach(section => observer.observe(section));
}

/**
 * Scroll-reveal animation for sections: fade in from bottom
 * Elements with 'fade-in-hidden' class will animate when entering the viewport.
 */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('section, .hero-content > *, .project-card, .skill-item, .contact-card');

  const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in-revealed');
        observer.unobserve(entry.target);
      }
    });
  }, options);

  revealElements.forEach(element => {
    element.classList.add('fade-in-hidden');
    observer.observe(element);
  });
}

/**
 * Project Filtering System
 * Filters project cards based on selected category.
 */
function initProjectFilters() {
  const filterButtons = document.querySelectorAll('.project-filter-button');
  const projectCards = document.querySelectorAll('.project-card');

  if (!filterButtons.length || !projectCards.length) {
    console.warn('Project filter buttons or cards not found. Filtering will not be initialized.');
    return;
  }

  const applyFilter = (selectedCategory) => {
    projectCards.forEach(card => {
      const cardCategories = card.dataset.category ? card.dataset.category.split(' ') : [];

      if (selectedCategory === 'all' || cardCategories.includes(selectedCategory)) {
        card.classList.remove('project-card--hidden');
      } else {
        card.classList.add('project-card--hidden');
      }
    });
  };

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(btn => btn.classList.remove('active-filter-button'));
      button.classList.add('active-filter-button');

      const filterCategory = button.dataset.filter;
      applyFilter(filterCategory);
    });
  });

  const initialFilterButton = document.querySelector('.project-filter-button[data-filter="all"]');
  if (initialFilterButton) {
    initialFilterButton.classList.add('active-filter-button');
  }
  applyFilter('all');
}