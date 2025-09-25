/**
 * NovaWave - Production-Ready JavaScript
 * Features: Theme Management, Navigation, Error Handling, Performance Optimizations
 */

(function() {
  'use strict';

  /**
   * Theme Manager Class - Production Ready
   */
  class ThemeManager {
    constructor() {
      this.currentTheme = null;
      this.themeToggle = null;
      this.prefersDarkQuery = null;
      this.storageKey = 'novawave-theme';
      
      this.init();
    }

    init() {
      try {
        this.themeToggle = document.getElementById('themeToggle');
        this.prefersDarkQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        if (!this.themeToggle) {
          console.warn('Theme toggle button not found');
          this.fallbackToSystemTheme();
          return;
        }

        this.loadSavedTheme();
        this.bindEvents();
        this.updateUI();
        
      } catch (error) {
        console.error('ThemeManager initialization failed:', error);
        this.fallbackToSystemTheme();
      }
    }

    loadSavedTheme() {
      try {
        const savedTheme = localStorage.getItem(this.storageKey);
        const systemPrefersDark = this.prefersDarkQuery?.matches || false;
        
        this.currentTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
        this.applyTheme(this.currentTheme);
        
      } catch (error) {
        console.error('Failed to load saved theme:', error);
        this.currentTheme = 'light';
        this.applyTheme('light');
      }
    }

    applyTheme(theme) {
      if (!['light', 'dark'].includes(theme)) {
        console.warn(`Invalid theme: ${theme}. Falling back to light theme.`);
        theme = 'light';
      }

      try {
        document.documentElement.classList.add('theme-transition');
        document.documentElement.setAttribute('data-theme', theme);
        this.currentTheme = theme;
        
        setTimeout(() => {
          document.documentElement.classList.remove('theme-transition');
        }, 300);
        
      } catch (error) {
        console.error('Failed to apply theme:', error);
      }
    }

    toggleTheme() {
      try {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(newTheme);
        this.saveTheme(newTheme);
        this.updateUI();
        this.dispatchThemeChangeEvent(newTheme);
        
      } catch (error) {
        console.error('Failed to toggle theme:', error);
      }
    }

    saveTheme(theme) {
      try {
        localStorage.setItem(this.storageKey, theme);
      } catch (error) {
        console.error('Failed to save theme preference:', error);
      }
    }

    updateUI() {
      if (!this.themeToggle) return;

      try {
        const lightIcon = this.themeToggle.querySelector('.light-icon');
        const darkIcon = this.themeToggle.querySelector('.dark-icon');
        
        if (lightIcon && darkIcon) {
          if (this.currentTheme === 'dark') {
            lightIcon.style.display = 'block';
            darkIcon.style.display = 'none';
          } else {
            lightIcon.style.display = 'none';
            darkIcon.style.display = 'block';
          }
        }
        
        this.themeToggle.setAttribute('aria-label', 
          `Switch to ${this.currentTheme === 'dark' ? 'light' : 'dark'} theme`
        );
        
      } catch (error) {
        console.error('Failed to update theme UI:', error);
      }
    }

    bindEvents() {
      try {
        if (this.themeToggle) {
          this.themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        if (this.prefersDarkQuery) {
          this.prefersDarkQuery.addEventListener('change', (e) => {
            if (!localStorage.getItem(this.storageKey)) {
              this.applyTheme(e.matches ? 'dark' : 'light');
              this.updateUI();
            }
          });
        }

        document.addEventListener('keydown', (e) => {
          if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
            e.preventDefault();
            this.toggleTheme();
          }
        });
        
      } catch (error) {
        console.error('Failed to bind theme events:', error);
      }
    }

    dispatchThemeChangeEvent(theme) {
      try {
        const event = new CustomEvent('themechange', {
          detail: { theme, timestamp: Date.now() }
        });
        document.dispatchEvent(event);
      } catch (error) {
        console.error('Failed to dispatch theme change event:', error);
      }
    }

    fallbackToSystemTheme() {
      try {
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        this.currentTheme = systemPrefersDark ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.currentTheme);
      } catch (error) {
        console.error('Fallback theme failed:', error);
        document.documentElement.setAttribute('data-theme', 'light');
      }
    }

    getCurrentTheme() {
      return this.currentTheme;
    }
  }

  /**
   * Navigation Manager Class
   */
  class NavigationManager {
    constructor() {
      this.navbar = null;
      this.navToggle = null;
      this.navLinks = null;
      this.scrollThreshold = 50;
      this.isScrolled = false;
      
      this.init();
    }

    init() {
      try {
        this.navbar = document.querySelector('.navbar');
        this.navToggle = document.querySelector('.nav-toggle');
        this.navLinks = document.querySelector('.nav-links');
        
        this.bindEvents();
        this.handleInitialScroll();
        
      } catch (error) {
        console.error('NavigationManager initialization failed:', error);
      }
    }

    bindEvents() {
      try {
        // Mobile menu toggle
        if (this.navToggle) {
          this.navToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.toggleMobileMenu();
          });
        }

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
          if (this.navLinks && this.navLinks.classList.contains('active')) {
            if (!this.navbar.contains(e.target)) {
              this.closeMobileMenu();
            }
          }
        });

        // Close mobile menu on escape key
        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape' && this.navLinks && this.navLinks.classList.contains('active')) {
            this.closeMobileMenu();
          }
        });

        // Scroll effect with throttling
        let scrollTimeout;
        window.addEventListener('scroll', () => {
          if (scrollTimeout) {
            clearTimeout(scrollTimeout);
          }
          scrollTimeout = setTimeout(() => this.handleScroll(), 10);
        }, { passive: true });
        
      } catch (error) {
        console.error('Failed to bind navigation events:', error);
      }
    }

    toggleMobileMenu() {
      try {
        if (!this.navLinks || !this.navToggle) return;

        const isActive = this.navLinks.classList.contains('active');
        
        if (isActive) {
          this.closeMobileMenu();
        } else {
          this.openMobileMenu();
        }
      } catch (error) {
        console.error('Failed to toggle mobile menu:', error);
      }
    }

    openMobileMenu() {
      try {
        if (this.navLinks && this.navToggle) {
          this.navLinks.classList.add('active');
          this.navToggle.classList.add('active');
          this.navToggle.setAttribute('aria-expanded', 'true');
          document.body.style.overflow = 'hidden';
        }
      } catch (error) {
        console.error('Failed to open mobile menu:', error);
      }
    }

    closeMobileMenu() {
      try {
        if (this.navLinks && this.navToggle) {
          this.navLinks.classList.remove('active');
          this.navToggle.classList.remove('active');
          this.navToggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        }
      } catch (error) {
        console.error('Failed to close mobile menu:', error);
      }
    }

    handleScroll() {
      try {
        if (!this.navbar) return;

        const scrollY = window.scrollY;
        const shouldBeScrolled = scrollY > this.scrollThreshold;

        if (shouldBeScrolled !== this.isScrolled) {
          this.isScrolled = shouldBeScrolled;
          
          if (this.isScrolled) {
            this.navbar.classList.add('scrolled');
          } else {
            this.navbar.classList.remove('scrolled');
          }
        }
      } catch (error) {
        console.error('Failed to handle scroll:', error);
      }
    }

    handleInitialScroll() {
      this.handleScroll();
    }
  }

  // ===== Counter Animation Manager =====
  class CounterManager {
    constructor() {
      this.animatedCounters = new Set();
      this.observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      };
      this.defaultDuration = 2000;
      this.init();
    }

    init() {
      try {
        this.setupIntersectionObserver();
        this.observeElements();
      } catch (error) {
        console.error('Failed to initialize CounterManager:', error);
      }
    }

    setupIntersectionObserver() {
      try {
        this.observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              this.handleElementIntersection(entry.target);
              this.observer.unobserve(entry.target);
            }
          });
        }, this.observerOptions);
      } catch (error) {
        console.error('Failed to setup intersection observer:', error);
      }
    }

    handleElementIntersection(element) {
      try {
        element.classList.add('fade-in');
        
        if (element.classList.contains('stats')) {
          this.animateStatsSection(element);
        }
      } catch (error) {
        console.error('Failed to handle element intersection:', error);
      }
    }

    animateStatsSection(statsSection) {
      try {
        const statNumbers = statsSection.querySelectorAll('.stat-number');
        statNumbers.forEach(stat => {
          if (!this.animatedCounters.has(stat)) {
            this.animatedCounters.add(stat);
            this.animateCounter(stat);
          }
        });
      } catch (error) {
        console.error('Failed to animate stats section:', error);
      }
    }

    animateCounter(element) {
      try {
        const target = this.parseTargetValue(element);
        const suffix = this.determineSuffix(element, target);
        const formattedTarget = this.formatTarget(target, suffix);
        
        this.runCounterAnimation(element, formattedTarget.value, formattedTarget.suffix);
      } catch (error) {
        console.error('Failed to animate counter:', error);
      }
    }

    parseTargetValue(element) {
      try {
        const targetAttr = element.dataset.target;
        if (targetAttr) {
          return parseInt(targetAttr);
        }
        
        const textContent = element.textContent.replace(/[^\d.]/g, '');
        return parseFloat(textContent) || 0;
      } catch (error) {
        console.error('Failed to parse target value:', error);
        return 0;
      }
    }

    determineSuffix(element, target) {
      const text = element.textContent;
      
      if (text.includes('%')) return '%';
      if (text.includes('★')) return '★';
      if (text.includes('+')) return '+';
      if (target >= 1000000) return 'M+';
      if (target >= 1000) return 'K+';
      
      return '';
    }

    formatTarget(target, suffix) {
      switch (suffix) {
        case 'M+':
          return { value: target / 1000000, suffix: 'M+' };
        case 'K+':
          return { value: target / 1000, suffix: 'K+' };
        default:
          return { value: target, suffix };
      }
    }

    runCounterAnimation(element, target, suffix) {
      try {
        const duration = this.defaultDuration;
        const startTime = performance.now();
        const startValue = 0;

        const animate = (currentTime) => {
          try {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easedProgress = this.easeOutQuart(progress);
            const currentValue = startValue + (target - startValue) * easedProgress;
            
            this.updateElementText(element, currentValue, suffix, target);
            
            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          } catch (error) {
            console.error('Error in counter animation frame:', error);
          }
        };

        requestAnimationFrame(animate);
      } catch (error) {
        console.error('Failed to run counter animation:', error);
      }
    }

    updateElementText(element, currentValue, suffix, targetValue) {
      try {
        let displayValue;
        
        if (suffix === '%' || suffix === '★') {
          displayValue = currentValue.toFixed(1);
        } else if (suffix.includes('M') || suffix.includes('K')) {
          displayValue = currentValue.toFixed(1);
        } else {
          displayValue = Math.floor(currentValue).toLocaleString();
        }
        
        element.textContent = displayValue + suffix;
        
        // Announce to screen readers when animation completes
        if (currentValue >= targetValue && !element.hasAttribute('aria-live')) {
          element.setAttribute('aria-live', 'polite');
          element.setAttribute('aria-label', `${displayValue}${suffix}`);
        }
      } catch (error) {
        console.error('Failed to update element text:', error);
      }
    }

    easeOutQuart(t) {
      return 1 - Math.pow(1 - t, 4);
    }

    observeElements() {
      try {
        const elementsToObserve = document.querySelectorAll('.glass-card, .stats');
        elementsToObserve.forEach(el => {
          if (this.observer) {
            this.observer.observe(el);
          }
        });
      } catch (error) {
        console.error('Failed to observe elements:', error);
      }
    }

    destroy() {
      try {
        if (this.observer) {
          this.observer.disconnect();
        }
        this.animatedCounters.clear();
      } catch (error) {
        console.error('Failed to destroy CounterManager:', error);
      }
    }
  }

  // ===== Smooth Scrolling Manager =====
  class SmoothScrollManager {
    constructor() {
      this.init();
    }

    init() {
      try {
        this.setupSmoothScrolling();
      } catch (error) {
        console.error('Failed to initialize SmoothScrollManager:', error);
      }
    }

    setupSmoothScrolling() {
      try {
        const links = document.querySelectorAll('a[href^="#"]');
        links.forEach(link => {
          link.addEventListener('click', (e) => this.handleSmoothScroll(e));
        });
      } catch (error) {
        console.error('Failed to setup smooth scrolling:', error);
      }
    }

    handleSmoothScroll(event) {
      try {
        const target = event.currentTarget.getAttribute('href');
        if (target && target !== '#') {
          event.preventDefault();
          this.smoothScrollTo(target);
        }
      } catch (error) {
        console.error('Failed to handle smooth scroll:', error);
      }
    }

    smoothScrollTo(target) {
      try {
        const element = document.querySelector(target);
        if (!element) return;

        const navbar = document.querySelector('.navbar');
        const navHeight = navbar ? navbar.offsetHeight : 0;
        const targetPosition = element.offsetTop - navHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Update focus for accessibility
        element.focus({ preventScroll: true });
      } catch (error) {
        console.error('Failed to smooth scroll to target:', error);
      }
    }
  }

  // ===== Pricing Manager =====
  class PricingManager {
    constructor() {
      // Support multiple ID patterns and input types
      this.billingToggle = document.querySelector('#pricingToggle, #billingToggle, #billing-toggle, .billing-toggle, .toggle-input');
      this.monthlyPrices = document.querySelectorAll('.monthly-price, .price-amount.monthly-price');
      this.annualPrices = document.querySelectorAll('.annual-price, .price-amount.annual-price');
      this.pricingCards = document.querySelectorAll('.pricing-card');
      this.isAnnual = false;
      this.animationDuration = 300;
      
      this.init();
    }

    init() {
      try {
        if (!this.validateElements()) {
          console.log('Pricing toggle elements not found - functionality disabled');
          return;
        }

        this.setupInitialState();
        this.bindEvents();
      } catch (error) {
        console.error('Failed to initialize PricingManager:', error);
      }
    }

    validateElements() {
      if (!this.billingToggle) {
        console.log('Billing toggle not found');
        return false;
      }

      if (this.monthlyPrices.length === 0 || this.annualPrices.length === 0) {
        console.warn('Pricing elements not found - check HTML structure');
        return false;
      }

      return true;
    }

    setupInitialState() {
      try {
        // Initialize - show monthly prices by default
        this.annualPrices.forEach(price => {
          price.classList.add('hidden');
          price.setAttribute('aria-hidden', 'true');
        });

        this.monthlyPrices.forEach(price => {
          price.classList.remove('hidden');
          price.setAttribute('aria-hidden', 'false');
        });

        // Set initial accessibility attributes
        this.billingToggle.setAttribute('aria-label', 'Switch to annual billing');
        this.billingToggle.setAttribute('role', 'switch');
        this.billingToggle.setAttribute('aria-checked', 'false');
      } catch (error) {
        console.error('Failed to setup initial state:', error);
      }
    }

    bindEvents() {
      try {
        this.billingToggle.addEventListener('change', (e) => {
          this.handleToggleChange(e.target.checked);
        });

        // Enhanced keyboard support
        this.billingToggle.addEventListener('keydown', (e) => {
          this.handleKeydown(e);
        });

        // Add focus management
        this.billingToggle.addEventListener('focus', () => {
          this.billingToggle.style.outline = '2px solid var(--primary-gradient-start)';
        });

        this.billingToggle.addEventListener('blur', () => {
          this.billingToggle.style.outline = '';
        });
      } catch (error) {
        console.error('Failed to bind events:', error);
      }
    }

    handleToggleChange(isAnnual) {
      try {
        this.isAnnual = isAnnual;
        this.switchPricing(isAnnual);
        this.updateAccessibilityAttributes(isAnnual);
        this.announceChange(isAnnual);
      } catch (error) {
        console.error('Failed to handle toggle change:', error);
      }
    }

    handleKeydown(event) {
      try {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          this.billingToggle.checked = !this.billingToggle.checked;
          this.handleToggleChange(this.billingToggle.checked);
        }
      } catch (error) {
        console.error('Failed to handle keydown:', error);
      }
    }

    switchPricing(isAnnual) {
      try {
        // Add loading state
        this.billingToggle.disabled = true;
        
        // Animate pricing cards
        this.animatePricingCards();
        
        // Switch prices with delay for smooth effect
        setTimeout(() => {
          this.togglePriceVisibility(isAnnual);
          this.resetCardAnimation();
          this.billingToggle.disabled = false;
        }, 100);
      } catch (error) {
        console.error('Failed to switch pricing:', error);
        this.billingToggle.disabled = false;
      }
    }

    animatePricingCards() {
      try {
        this.pricingCards.forEach(card => {
          card.style.transform = 'scale(0.95)';
          card.style.transition = `transform ${this.animationDuration / 3}ms ease`;
          card.style.opacity = '0.7';
        });
      } catch (error) {
        console.error('Failed to animate pricing cards:', error);
      }
    }

    togglePriceVisibility(isAnnual) {
      try {
        this.monthlyPrices.forEach(price => {
          const shouldHide = isAnnual;
          price.classList.toggle('hidden', shouldHide);
          price.setAttribute('aria-hidden', shouldHide.toString());
        });

        this.annualPrices.forEach(price => {
          const shouldHide = !isAnnual;
          price.classList.toggle('hidden', shouldHide);
          price.setAttribute('aria-hidden', shouldHide.toString());
        });
      } catch (error) {
        console.error('Failed to toggle price visibility:', error);
      }
    }

    resetCardAnimation() {
      try {
        this.pricingCards.forEach(card => {
          card.style.transform = 'scale(1)';
          card.style.opacity = '1';
        });

        // Clean up transition styles after animation
        setTimeout(() => {
          this.pricingCards.forEach(card => {
            card.style.transition = '';
          });
        }, this.animationDuration);
      } catch (error) {
        console.error('Failed to reset card animation:', error);
      }
    }

    updateAccessibilityAttributes(isAnnual) {
      try {
        this.billingToggle.setAttribute('aria-checked', isAnnual.toString());
        this.billingToggle.setAttribute('aria-label', 
          isAnnual ? 'Switch to monthly billing' : 'Switch to annual billing'
        );
      } catch (error) {
        console.error('Failed to update accessibility attributes:', error);
      }
    }

    announceChange(isAnnual) {
      try {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = `Switched to ${isAnnual ? 'annual' : 'monthly'} billing`;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
          document.body.removeChild(announcement);
        }, 1000);
      } catch (error) {
        console.error('Failed to announce change:', error);
      }
    }

    getCurrentBillingType() {
      return this.isAnnual ? 'annual' : 'monthly';
    }

    destroy() {
      try {
        if (this.billingToggle) {
          this.billingToggle.removeEventListener('change', this.handleToggleChange);
          this.billingToggle.removeEventListener('keydown', this.handleKeydown);
        }
      } catch (error) {
        console.error('Failed to destroy PricingManager:', error);
      }
    }
  }

  // ===== Performance Manager =====
  class PerformanceManager {
    constructor() {
      this.observerOptions = {
        threshold: 0.1,
        rootMargin: '50px'
      };
      this.lazyElements = new Set();
      this.init();
    }

    init() {
      try {
        this.setupLazyLoading();
        this.setupParallaxEffects();
        this.setupHoverEffects();
        this.setupKeyboardNavigation();
        this.preloadCriticalAssets();
      } catch (error) {
        console.error('Failed to initialize PerformanceManager:', error);
      }
    }

    setupLazyLoading() {
      try {
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
          const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                this.loadImage(entry.target);
                imageObserver.unobserve(entry.target);
              }
            });
          }, this.observerOptions);

          lazyImages.forEach(img => imageObserver.observe(img));
        } else {
          // Fallback for older browsers
          lazyImages.forEach(img => this.loadImage(img));
        }
      } catch (error) {
        console.error('Failed to setup lazy loading:', error);
      }
    }

    loadImage(img) {
      try {
        img.src = img.dataset.src;
        img.classList.add('loaded');
        img.removeAttribute('data-src');
      } catch (error) {
        console.error('Failed to load image:', error);
      }
    }

    setupParallaxEffects() {
      try {
        const orbs = document.querySelectorAll('.gradient-orb');
        if (orbs.length === 0) return;

        let ticking = false;
        
        const updateParallax = () => {
          try {
            const scrollY = window.scrollY;
            
            orbs.forEach((orb, index) => {
              const speed = 0.5 + (index * 0.2);
              const yPos = -(scrollY * speed);
              orb.style.transform = `translate3d(0, ${yPos}px, 0)`;
            });
            
            ticking = false;
          } catch (error) {
            console.error('Error in parallax update:', error);
            ticking = false;
          }
        };

        const requestParallaxUpdate = () => {
          if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
          }
        };

        // Only enable parallax on devices that can handle it smoothly
        if (!this.isReducedMotion()) {
          window.addEventListener('scroll', requestParallaxUpdate, { passive: true });
        }
      } catch (error) {
        console.error('Failed to setup parallax effects:', error);
      }
    }

    setupHoverEffects() {
      try {
        // Button hover effects
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(button => {
          button.addEventListener('mouseenter', () => {
            if (!this.isReducedMotion()) {
              button.style.transform = 'translateY(-2px)';
              button.style.transition = 'transform 0.2s ease';
            }
          });
          
          button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0)';
          });
        });

        // Glass card hover effects
        const glassCards = document.querySelectorAll('.glass-card');
        glassCards.forEach(card => {
          card.addEventListener('mouseenter', () => {
            if (!this.isReducedMotion()) {
              card.style.transform = 'translateY(-8px)';
              card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
              card.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
            }
          });
          
          card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '';
          });
        });
      } catch (error) {
        console.error('Failed to setup hover effects:', error);
      }
    }

    setupKeyboardNavigation() {
      try {
        document.addEventListener('keydown', (e) => {
          try {
            // Toggle theme with Ctrl/Cmd + Shift + T
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
              e.preventDefault();
              if (window.themeManager) {
                window.themeManager.toggleTheme();
              }
            }
            
            // Escape key closes mobile menu
            if (e.key === 'Escape') {
              this.handleEscapeKey();
            }

            // Tab navigation improvements
            if (e.key === 'Tab') {
              this.handleTabNavigation(e);
            }
          } catch (error) {
            console.error('Error in keyboard navigation:', error);
          }
        });
      } catch (error) {
        console.error('Failed to setup keyboard navigation:', error);
      }
    }

    handleEscapeKey() {
      try {
        // Close mobile menu if open
        if (window.navigationManager) {
          window.navigationManager.closeMobileMenu();
        }

        // Close any open modals or dropdowns
        const openElements = document.querySelectorAll('.active, .open');
        openElements.forEach(element => {
          element.classList.remove('active', 'open');
        });
      } catch (error) {
        console.error('Failed to handle escape key:', error);
      }
    }

    handleTabNavigation(event) {
      try {
        // Trap focus within modal if one is open
        const modal = document.querySelector('.modal.active');
        if (modal) {
          this.trapFocus(modal, event);
        }
      } catch (error) {
        console.error('Failed to handle tab navigation:', error);
      }
    }

    trapFocus(container, event) {
      try {
        const focusableElements = container.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      } catch (error) {
        console.error('Failed to trap focus:', error);
      }
    }

    preloadCriticalAssets() {
      try {
        // Preload critical fonts
        const criticalFonts = [
          '/assets/fonts/main-font.woff2',
          '/assets/fonts/heading-font.woff2'
        ];

        criticalFonts.forEach(font => {
          const link = document.createElement('link');
          link.rel = 'preload';
          link.as = 'font';
          link.type = 'font/woff2';
          link.crossOrigin = 'anonymous';
          link.href = font;
          document.head.appendChild(link);
        });
      } catch (error) {
        console.error('Failed to preload critical assets:', error);
      }
    }

    isReducedMotion() {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    debounce(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    }

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
  }

  // ===== Form Validator =====
  class FormValidator {
    constructor() {
      this.forms = document.querySelectorAll('form');
      this.validationRules = {
        email: {
          pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          message: 'Please enter a valid email address'
        },
        required: {
          pattern: /.+/,
          message: 'This field is required'
        },
        phone: {
          pattern: /^[\+]?[1-9][\d]{0,15}$/,
          message: 'Please enter a valid phone number'
        },
        name: {
          pattern: /^[a-zA-Z\s]{2,50}$/,
          message: 'Name must be 2-50 characters and contain only letters'
        }
      };
      this.init();
    }

    init() {
      try {
        this.setupFormValidation();
        this.setupRealTimeValidation();
        this.setupAccessibility();
      } catch (error) {
        console.error('Failed to initialize FormValidator:', error);
      }
    }

    setupFormValidation() {
      try {
        this.forms.forEach(form => {
          form.addEventListener('submit', (e) => this.handleFormSubmit(e));
          form.noValidate = true; // Disable browser validation
        });
      } catch (error) {
        console.error('Failed to setup form validation:', error);
      }
    }

    setupRealTimeValidation() {
      try {
        const inputs = document.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
          input.addEventListener('blur', () => this.validateField(input));
          input.addEventListener('input', () => this.clearFieldError(input));
        });
      } catch (error) {
        console.error('Failed to setup real-time validation:', error);
      }
    }

    setupAccessibility() {
      try {
        const inputs = document.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
          // Add aria-describedby for error messages
          const errorId = `${input.id || input.name}-error`;
          input.setAttribute('aria-describedby', errorId);
        });
      } catch (error) {
        console.error('Failed to setup accessibility:', error);
      }
    }

    handleFormSubmit(event) {
      try {
        event.preventDefault();
        const form = event.target;
        const isValid = this.validateForm(form);

        if (isValid) {
          this.submitForm(form);
        } else {
          // Focus first invalid field
          const firstError = form.querySelector('.error');
          if (firstError) {
            firstError.focus();
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      } catch (error) {
        console.error('Failed to handle form submit:', error);
      }
    }

    validateForm(form) {
      try {
        const inputs = form.querySelectorAll('input, textarea, select');
        let isValid = true;

        inputs.forEach(input => {
          if (!this.validateField(input)) {
            isValid = false;
          }
        });

        return isValid;
      } catch (error) {
        console.error('Failed to validate form:', error);
        return false;
      }
    }

    validateField(input) {
      try {
        const value = input.value.trim();
        const rules = this.getFieldRules(input);
        let isValid = true;
        let errorMessage = '';

        // Check required fields
        if (input.hasAttribute('required') && !value) {
          isValid = false;
          errorMessage = 'This field is required';
        }

        // Check specific validation rules
        if (value && rules.length > 0) {
          for (const rule of rules) {
            if (!rule.pattern.test(value)) {
              isValid = false;
              errorMessage = rule.message;
              break;
            }
          }
        }

        if (isValid) {
          this.clearFieldError(input);
        } else {
          this.showFieldError(input, errorMessage);
        }

        return isValid;
      } catch (error) {
        console.error('Failed to validate field:', error);
        return false;
      }
    }

    getFieldRules(input) {
      try {
        const rules = [];
        const type = input.type || input.getAttribute('data-type');
        const inputName = input.name || input.id;

        // Type-based validation
        if (type === 'email' || inputName.includes('email')) {
          rules.push(this.validationRules.email);
        }

        if (type === 'tel' || inputName.includes('phone')) {
          rules.push(this.validationRules.phone);
        }

        if (inputName.includes('name')) {
          rules.push(this.validationRules.name);
        }

        // Custom validation pattern
        const pattern = input.getAttribute('pattern');
        if (pattern) {
          rules.push({
            pattern: new RegExp(pattern),
            message: input.getAttribute('data-error-message') || 'Invalid format'
          });
        }

        return rules;
      } catch (error) {
        console.error('Failed to get field rules:', error);
        return [];
      }
    }

    showFieldError(input, message) {
      try {
        input.classList.add('error');
        input.setAttribute('aria-invalid', 'true');

        const errorId = `${input.id || input.name}-error`;
        let errorElement = document.getElementById(errorId);

        if (!errorElement) {
          errorElement = document.createElement('div');
          errorElement.id = errorId;
          errorElement.className = 'field-error';
          errorElement.setAttribute('role', 'alert');
          input.parentNode.appendChild(errorElement);
        }

        errorElement.textContent = message;
        errorElement.style.display = 'block';
      } catch (error) {
        console.error('Failed to show field error:', error);
      }
    }

    clearFieldError(input) {
      try {
        input.classList.remove('error');
        input.setAttribute('aria-invalid', 'false');

        const errorId = `${input.id || input.name}-error`;
        const errorElement = document.getElementById(errorId);

        if (errorElement) {
          errorElement.style.display = 'none';
          errorElement.textContent = '';
        }
      } catch (error) {
        console.error('Failed to clear field error:', error);
      }
    }

    async submitForm(form) {
      try {
        const submitButton = form.querySelector('button[type="submit"], input[type="submit"]');
        const originalText = submitButton ? submitButton.textContent : '';

        // Show loading state
        if (submitButton) {
          submitButton.disabled = true;
          submitButton.textContent = 'Sending...';
          submitButton.classList.add('loading');
        }

        // Simulate form submission (replace with actual endpoint)
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Example: Send to your backend
        // const response = await fetch('/api/contact', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(data)
        // });

        // Simulate successful submission
        await new Promise(resolve => setTimeout(resolve, 1000));

        this.showSuccessMessage(form);
        form.reset();

        // Reset button state
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = originalText;
          submitButton.classList.remove('loading');
        }
      } catch (error) {
        console.error('Failed to submit form:', error);
        this.showErrorMessage(form, 'Failed to send message. Please try again.');
      }
    }

    showSuccessMessage(form) {
      try {
        const message = document.createElement('div');
        message.className = 'form-message success';
        message.setAttribute('role', 'status');
        message.textContent = 'Thank you! Your message has been sent successfully.';
        
        form.parentNode.insertBefore(message, form);
        
        setTimeout(() => {
          message.remove();
        }, 5000);
      } catch (error) {
        console.error('Failed to show success message:', error);
      }
    }

    showErrorMessage(form, errorText) {
      try {
        const message = document.createElement('div');
        message.className = 'form-message error';
        message.setAttribute('role', 'alert');
        message.textContent = errorText;
        
        form.parentNode.insertBefore(message, form);
        
        setTimeout(() => {
          message.remove();
        }, 5000);
      } catch (error) {
        console.error('Failed to show error message:', error);
      }
    }
  }

  // ===== Loading Animation Manager =====
  class LoadingManager {
    constructor() {
      this.init();
    }

    init() {
      try {
        this.setupLoadingAnimation();
        this.setupReducedMotionSupport();
      } catch (error) {
        console.error('Failed to initialize LoadingManager:', error);
      }
    }

    setupLoadingAnimation() {
      try {
        window.addEventListener('load', () => {
          document.body.classList.add('loaded');
          this.animateHeroElements();
        });
      } catch (error) {
        console.error('Failed to setup loading animation:', error);
      }
    }

    animateHeroElements() {
      try {
        const heroElements = document.querySelectorAll('.hero-badge, .hero-title, .hero-description, .hero-actions');
        heroElements.forEach((el, index) => {
          setTimeout(() => {
            el.classList.add('fade-in');
          }, index * 100);
        });
      } catch (error) {
        console.error('Failed to animate hero elements:', error);
      }
    }

    setupReducedMotionSupport() {
      try {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        if (prefersReducedMotion.matches) {
          this.applyReducedMotion();
        }

        prefersReducedMotion.addEventListener('change', (e) => {
          if (e.matches) {
            this.applyReducedMotion();
          } else {
            this.removeReducedMotion();
          }
        });
      } catch (error) {
        console.error('Failed to setup reduced motion support:', error);
      }
    }

    applyReducedMotion() {
      try {
        document.documentElement.style.scrollBehavior = 'auto';
        
        const style = document.createElement('style');
        style.id = 'reduced-motion-styles';
        style.textContent = `
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        `;
        document.head.appendChild(style);
      } catch (error) {
        console.error('Failed to apply reduced motion:', error);
      }
    }

    removeReducedMotion() {
      try {
        document.documentElement.style.scrollBehavior = '';
        const style = document.getElementById('reduced-motion-styles');
        if (style) {
          style.remove();
        }
      } catch (error) {
        console.error('Failed to remove reduced motion:', error);
      }
    }
  }

  // ===== Initialize Everything =====
  function init() {
    // Set current year
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }

    // Initialize all production-ready managers
    try {
      // Core managers
      window.themeManager = new ThemeManager();
      window.navigationManager = new NavigationManager();
      window.counterManager = new CounterManager();
      window.smoothScrollManager = new SmoothScrollManager();
      window.pricingManager = new PricingManager();
      window.formValidator = new FormValidator();
      window.performanceManager = new PerformanceManager();
      window.loadingManager = new LoadingManager();

      console.log('NovaWave: All managers initialized successfully');
    } catch (error) {
      console.error('NovaWave: Failed to initialize managers:', error);
    }

    // Handle hash navigation
    if (window.location.hash) {
      setTimeout(() => {
        if (window.smoothScrollManager) {
          window.smoothScrollManager.smoothScrollTo(window.location.hash);
        }
      }, 100);
    }
  }

  // ===== Error Handling =====
  window.addEventListener('error', (e) => {
    console.error('NovaWave JS Error:', e.error);
  });

  // ===== Enhanced UX Features =====
  
  // Scroll to Top Button
  function initScrollToTop() {
    // Create scroll to top button
    const scrollButton = document.createElement('button');
    scrollButton.className = 'scroll-to-top';
    scrollButton.innerHTML = '<i class="bi bi-arrow-up"></i>';
    scrollButton.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(scrollButton);

    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
      if (window.scrollY > 300) {
        scrollButton.classList.add('visible');
      } else {
        scrollButton.classList.remove('visible');
      }
    });

    // Smooth scroll to top
    scrollButton.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Notification System
  function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px;">
        <i class="bi bi-${type === 'success' ? 'check-circle-fill' : 'exclamation-triangle-fill'}"></i>
        <span>${message}</span>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Auto hide after 4 seconds
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 4000);
  }

  // Enhanced Button Loading States
  function initButtonEnhancements() {
    document.addEventListener('click', function(e) {
      if (e.target.matches('.btn') && !e.target.disabled) {
        const btn = e.target;
        const originalText = btn.innerHTML;
        
        // Add loading state for buttons that navigate
        if (btn.getAttribute('href') && btn.getAttribute('href') !== '#') {
          btn.classList.add('loading');
          
          // Remove loading after short delay (simulating navigation)
          setTimeout(() => {
            btn.classList.remove('loading');
          }, 800);
        }
      }
    });
  }

  // Form Enhancement with Better Feedback
  function enhanceFormFeedback() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
      form.addEventListener('submit', function(e) {
        const submitBtn = form.querySelector('button[type="submit"]');
        
        if (submitBtn && !submitBtn.disabled) {
          // Show loading state
          submitBtn.classList.add('loading');
          
          // Simulate form processing
          setTimeout(() => {
            submitBtn.classList.remove('loading');
            submitBtn.classList.add('success');
            showNotification('Form submitted successfully!', 'success');
            
            // Reset after delay
            setTimeout(() => {
              submitBtn.classList.remove('success');
              form.reset();
            }, 2000);
          }, 1500);
        }
      });
    });
  }

  // Advanced Scroll Reveal Animations
  function initScrollReveal() {
    const observerOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0) scale(1)';
          entry.target.classList.add('revealed');
        }
      });
    }, observerOptions);

    // Observe cards and sections with different animation types
    const elementsToReveal = document.querySelectorAll('.glass-card, .feature-item, .pricing-card, .hero-content');
    elementsToReveal.forEach((el, index) => {
      // Set initial state with random slight variations
      const randomDelay = Math.random() * 0.2;
      const randomOffset = 20 + Math.random() * 20;
      
      el.style.opacity = '0';
      el.style.transform = `translateY(${randomOffset}px) scale(0.95)`;
      el.style.transition = `all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${(index * 0.1) + randomDelay}s`;
      
      observer.observe(el);
    });
  }

  // Parallax Effect for Background Elements
  function initParallaxEffect() {
    const parallaxElements = document.querySelectorAll('.gradient-orb');
    
    window.addEventListener('scroll', function() {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;
      
      parallaxElements.forEach((el, index) => {
        const speed = 0.2 + (index * 0.1);
        el.style.transform = `translateY(${scrolled * speed}px)`;
      });
    });
  }

  // Initialize Enhanced Features
  function initEnhancedFeatures() {
    initScrollToTop();
    initButtonEnhancements();
    enhanceFormFeedback();
    initScrollReveal();
    initParallaxEffect();
    
    // Custom cursor removed for better user experience
  }

  // ===== Performance Monitoring =====
  function initPerformanceMonitoring() {
    // Log page load time
    window.addEventListener('load', function() {
      const loadTime = performance.now();
      console.log(`NovaWave loaded in ${Math.round(loadTime)}ms`);
      
      // Log performance metrics
      if (performance.getEntriesByType) {
        const navigationEntries = performance.getEntriesByType('navigation');
        if (navigationEntries.length > 0) {
          const nav = navigationEntries[0];
          console.log('Performance Metrics:', {
            domContentLoaded: Math.round(nav.domContentLoadedEventEnd - nav.navigationStart),
            loadComplete: Math.round(nav.loadEventEnd - nav.navigationStart),
            firstPaint: Math.round(nav.loadEventEnd - nav.fetchStart)
          });
        }
      }
    });

    // Monitor long tasks
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.duration > 50) {
              console.warn(`Long task detected: ${Math.round(entry.duration)}ms`);
            }
          }
        });
        observer.observe({entryTypes: ['longtask']});
      } catch (e) {
        // PerformanceObserver not fully supported
      }
    }
  }

  // Enhanced Error Handling
  function initErrorHandling() {
    window.addEventListener('error', function(e) {
      console.error('NovaWave Error:', {
        message: e.message,
        filename: e.filename,
        line: e.lineno,
        column: e.colno
      });
      
      // Optional: Send to analytics service
      // analytics.track('error', { message: e.message });
    });

    window.addEventListener('unhandledrejection', function(e) {
      console.error('NovaWave Unhandled Promise Rejection:', e.reason);
      
      // Optional: Send to analytics service
      // analytics.track('promise_rejection', { reason: e.reason });
    });
  }

  // Progressive Web App Features
  function initPWAFeatures() {
    // Register Service Worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(registration => {
            console.log('NovaWave: Service Worker registered successfully', registration);
            
            // Check for updates
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing;
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New content is available, show update notification
                  showNotification('New version available! Refresh to update.', 'info');
                }
              });
            });
          })
          .catch(error => {
            console.log('NovaWave: Service Worker registration failed', error);
          });
      });
    }

    // PWA Install Prompt
    let deferredPrompt;
    
    window.addEventListener('beforeinstallprompt', (e) => {
      console.log('NovaWave: Install prompt available');
      e.preventDefault();
      deferredPrompt = e;
      
      // Show custom install button or banner
      showInstallBanner();
    });

    // Handle successful app installation
    window.addEventListener('appinstalled', (evt) => {
      console.log('NovaWave: App was installed successfully');
      showNotification('NovaWave installed successfully!', 'success');
      hideInstallBanner();
    });
  }

  // Show PWA install banner
  function showInstallBanner() {
    const installBanner = document.createElement('div');
    installBanner.className = 'install-banner';
    installBanner.innerHTML = `
      <div class="install-content">
        <div class="install-icon">
          <i class="bi bi-download"></i>
        </div>
        <div class="install-text">
          <strong>Install NovaWave</strong>
          <p>Get the full app experience</p>
        </div>
        <div class="install-actions">
          <button class="btn btn-primary btn-small" id="installBtn">Install</button>
          <button class="btn btn-secondary btn-small" id="dismissBtn">Later</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(installBanner);
    
    // Show banner with animation
    setTimeout(() => installBanner.classList.add('show'), 100);
    
    // Install button click
    document.getElementById('installBtn').addEventListener('click', () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            console.log('NovaWave: User accepted the install prompt');
          }
          deferredPrompt = null;
          hideInstallBanner();
        });
      }
    });
    
    // Dismiss button click
    document.getElementById('dismissBtn').addEventListener('click', () => {
      hideInstallBanner();
    });
  }

  // Hide PWA install banner
  function hideInstallBanner() {
    const banner = document.querySelector('.install-banner');
    if (banner) {
      banner.classList.remove('show');
      setTimeout(() => banner.remove(), 300);
    }
  }

  // ===== Start the application =====
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      init();
      initEnhancedFeatures();
      initPerformanceMonitoring();
      initErrorHandling();
      initPWAFeatures();
    });
  } else {
    init();
    initEnhancedFeatures();
    initPerformanceMonitoring();
    initErrorHandling();
    initPWAFeatures();
  }

})();