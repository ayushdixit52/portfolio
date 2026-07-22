document.addEventListener('DOMContentLoaded', () => {
  // Initialize all core portfolio features
  initTypingEffect();
  initMobileMenu();
  initHeaderScroll();
  initActiveSectionTracker();
  initSmoothScroll();
  initScrollReveal(); // Initialize scroll-reveal animation
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

    // Determine typing speed and state transitions
    if (this.isDeleting) {
      this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
      this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    // Insert updated text content
    this.element.innerHTML = `<span class="typing-text-content">${this.txt}</span><span class="typing-cursor" aria-hidden="true">|</span>`;

    let typeSpeed = 80 - Math.random() * 40; // Natural typing variation

    if (this.isDeleting) {
      typeSpeed /= 2; // Deletes faster than typing
    }

    // State machine logic
    if (!this.isDeleting && this.txt === fullTxt) {
      typeSpeed = this.wait; // Pause at full word
      this.isDeleting = true;
    } else if (this.isDeleting && this.txt === '') {
      this.isDeleting = false;
      this.phraseIndex++;
      typeSpeed = 600; // Pause before starting next phrase
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
    
    // Toggle ARIA expanded attribute for accessibility
    const isExpanded = burger.getAttribute('aria-expanded') === 'true';
    burger.setAttribute('aria-expanded', !isExpanded);

    // Animate Links
    links.forEach((link, index) => {
      if (link.style.animation) {
        link.style.animation = '';
      } else {
        link.style.animation = `navLinkFade 0.4s ease forwards ${index / 7 + 0.1}s`;
      }
    });
  };

  burger.addEventListener('click', toggleMenu);

  // Close menu when a link is clicked (crucial for single-page portfolio anchors)
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
  handleScroll(); // Trigger initial check
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
    rootMargin: '-30% 0px -60% 0px', // Evaluates when section is active in center-top of viewport
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
  // Select all sections and significant content blocks to animate.
  // The 'fade-in-hidden' class should be pre-applied (e.g., via CSS)
  // or added dynamically here before observation.
  const revealElements = document.querySelectorAll('section, .hero-content > *, .project-card, .skill-item, .contact-card');

  const options = {
    root: null, // relative to the viewport
    rootMargin: '0px',
    threshold: 0.1 // Trigger when 10% of the item is visible
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add class to trigger the fade-in animation
        entry.target.classList.add('fade-in-revealed');
        // Stop observing once the element has been revealed
        observer.unobserve(entry.target);
      }
    });
  }, options);

  revealElements.forEach(element => {
    // Ensure all target elements have the initial hidden state class
    // This class should define the initial transform and opacity.
    element.classList.add('fade-in-hidden');
    observer.observe(element);
  });
}