/**
 * =====================================================
 * UIVerse - Main JavaScript Module
 * Modern, clean JavaScript architecture
 * =====================================================
 */

class UIVerse {
  constructor() {
    this.init();
  }

  /**
   * Initialize the application
   */
  init() {
    this.setupEventListeners();
    this.initializeTheme();
    this.initializeNavigation();
    this.initializeScrollEffects();
    this.initializeContactForm();
    this.initializeAnimations();
  }

  /**
   * Set up global event listeners
   */
  setupEventListeners() {
    // DOM Content Loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.onDOMContentLoaded();
      });
    } else {
      this.onDOMContentLoaded();
    }

    // Window events
    window.addEventListener('scroll', this.throttle(this.onScroll.bind(this), 16));
    window.addEventListener('resize', this.throttle(this.onResize.bind(this), 100));
  }

  /**
   * Handle DOM content loaded
   */
  onDOMContentLoaded() {
    this.updateCopyright();
    this.initializeAOS();
  }

  /**
   * Handle scroll events
   */
  onScroll() {
    this.updateActiveNavLinks();
    this.revealElements();
  }

  /**
   * Handle resize events
   */
  onResize() {
    this.handleMobileNavigation();
  }

  /**
   * Initialize theme management
   */
  initializeTheme() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;

    // Set initial theme
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    
    this.setTheme(initialTheme);

    // Theme toggle event
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      this.setTheme(newTheme);
    });
  }

  /**
   * Set theme and update UI
   */
  setTheme(theme) {
    const root = document.documentElement;
    const themeToggle = document.getElementById('themeToggle');

    root.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    if (themeToggle) {
      themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
  }

  /**
   * Initialize navigation functionality
   */
  initializeNavigation() {
    this.initializeMobileNav();
    this.initializeNavLinks();
  }

  /**
   * Initialize mobile navigation
   */
  initializeMobileNav() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (!navToggle || !navMenu) return;

    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('open');
    });

    // Close mobile nav when clicking on links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /**
   * Initialize navigation link functionality
   */
  initializeNavLinks() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        
        // Handle smooth scrolling for internal links
        if (href.startsWith('#')) {
          e.preventDefault();
          const target = document.querySelector(href);
          
          if (target) {
            this.smoothScrollTo(target);
          }
        }
      });
    });
  }

  /**
   * Smooth scroll to element
   */
  smoothScrollTo(element) {
    const headerOffset = 80;
    const elementPosition = element.offsetTop;
    const offsetPosition = elementPosition - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }

  /**
   * Update active navigation links based on scroll position
   */
  updateActiveNavLinks() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    let current = '';
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  /**
   * Initialize scroll reveal effects
   */
  initializeScrollEffects() {
    this.observeElements();
  }

  /**
   * Observe elements for scroll animations
   */
  observeElements() {
    const revealElements = document.querySelectorAll('.reveal');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(element => {
      observer.observe(element);
    });
  }

  /**
   * Reveal elements on scroll
   */
  revealElements() {
    const revealElements = document.querySelectorAll('.reveal:not(.in-view)');
    
    revealElements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      
      if (elementTop < windowHeight * 0.8) {
        element.classList.add('in-view');
      }
    });
  }

  /**
   * Initialize contact form
   */
  initializeContactForm() {
    const form = document.getElementById('contactForm');
    const statusEl = document.getElementById('formStatus');

    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleFormSubmission(form, statusEl);
    });
  }

  /**
   * Handle contact form submission
   */
  handleFormSubmission(form, statusEl) {
    // Clear previous status
    if (statusEl) statusEl.textContent = '';

    // Validate form
    const isValid = this.validateForm(form);
    
    if (!isValid) return;

    // Simulate form submission
    this.submitForm(form, statusEl);
  }

  /**
   * Validate form inputs
   */
  validateForm(form) {
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let isValid = true;

    // Clear previous errors
    this.clearFormErrors(form);

    // Validate name
    if (!name) {
      this.setFormError(form, 'name', 'Name is required');
      isValid = false;
    }

    // Validate email
    if (!email) {
      this.setFormError(form, 'email', 'Email is required');
      isValid = false;
    } else if (!emailRegex.test(email)) {
      this.setFormError(form, 'email', 'Please enter a valid email');
      isValid = false;
    }

    // Validate message
    if (!message) {
      this.setFormError(form, 'message', 'Message is required');
      isValid = false;
    }

    return isValid;
  }

  /**
   * Set form error message
   */
  setFormError(form, fieldName, message) {
    const errorElement = form.querySelector(`#${fieldName} ~ .error`);
    if (errorElement) {
      errorElement.textContent = message;
    }
  }

  /**
   * Clear form error messages
   */
  clearFormErrors(form) {
    const errorElements = form.querySelectorAll('.error');
    errorElements.forEach(element => {
      element.textContent = '';
    });
  }

  /**
   * Submit form (simulate)
   */
  submitForm(form, statusEl) {
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
      // Reset button
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;

      // Show success message
      if (statusEl) {
        statusEl.textContent = 'Thank you! Your message has been sent successfully.';
        statusEl.style.color = '#10b981';
      }

      // Reset form
      form.reset();

      // Clear success message after 5 seconds
      setTimeout(() => {
        if (statusEl) statusEl.textContent = '';
      }, 5000);

    }, 1500);
  }

  /**
   * Initialize animations
   */
  initializeAnimations() {
    this.initializeCounterAnimations();
    this.initializeScrollAnimations();
  }

  /**
   * Initialize counter animations
   */
  initializeCounterAnimations() {
    const counters = document.querySelectorAll('[data-count]');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
  }

  /**
   * Animate counter
   */
  animateCounter(element) {
    const target = parseInt(element.dataset.count);
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      element.textContent = Math.floor(current);

      if (current >= target) {
        element.textContent = target;
        clearInterval(timer);
      }
    }, 16);
  }

  /**
   * Initialize scroll-based animations
   */
  initializeScrollAnimations() {
    // Initialize AOS if available
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: true,
        offset: 100
      });
    }
  }

  /**
   * Initialize AOS library
   */
  initializeAOS() {
    if (typeof AOS !== 'undefined') {
      AOS.init();
    }
  }

  /**
   * Update copyright year
   */
  updateCopyright() {
    const yearElement = document.getElementById('year');
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }
  }

  /**
   * Handle mobile navigation responsive behavior
   */
  handleMobileNavigation() {
    const navMenu = document.getElementById('navMenu');
    const navToggle = document.getElementById('navToggle');
    
    if (window.innerWidth > 768) {
      if (navMenu) navMenu.classList.remove('open');
      if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
    }
  }

  /**
   * Throttle function for performance
   */
  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  /**
   * Debounce function for performance
   */
  debounce(func, wait, immediate) {
    let timeout;
    return function() {
      const context = this;
      const args = arguments;
      const later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }
}

/**
 * Utility functions
 */
const Utils = {
  /**
   * Get element by selector
   */
  $(selector) {
    return document.querySelector(selector);
  },

  /**
   * Get all elements by selector
   */
  $$(selector) {
    return document.querySelectorAll(selector);
  },

  /**
   * Add event listener with options
   */
  on(element, event, handler, options = {}) {
    if (typeof element === 'string') {
      element = this.$(element);
    }
    if (element) {
      element.addEventListener(event, handler, options);
    }
  },

  /**
   * Remove event listener
   */
  off(element, event, handler) {
    if (typeof element === 'string') {
      element = this.$(element);
    }
    if (element) {
      element.removeEventListener(event, handler);
    }
  },

  /**
   * Check if element is in viewport
   */
  isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  },

  /**
   * Smooth scroll to element
   */
  scrollTo(element, offset = 0) {
    if (typeof element === 'string') {
      element = this.$(element);
    }
    if (element) {
      const y = element.offsetTop - offset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }
};

// Initialize application
const app = new UIVerse();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { UIVerse, Utils };
}