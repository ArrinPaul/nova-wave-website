/*
  NovaWave - Apple-Inspired Interactions
  Features: Dark Mode Toggle, Smooth Animations, Counter Animations, Glass Effects
*/

(function() {
  'use strict';

  // ===== DOM Elements =====
  const themeToggle = document.getElementById('themeToggle');
  const navbar = document.querySelector('.navbar');
  const billingToggle = document.getElementById('billingToggle');
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  // ===== Theme Management =====
  function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    
    // Force set the theme
    document.documentElement.setAttribute('data-theme', initialTheme);
    
    // Update the toggle button
    updateThemeToggle(initialTheme);
    
    // Debug log
    console.log(`Theme initialized: ${initialTheme}`);
  }

  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    // Add transition class for smooth animation
    document.documentElement.classList.add('theme-transition');
    
    // Set new theme
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeToggle(newTheme);
    
    // Remove transition class after animation completes
    setTimeout(() => {
      document.documentElement.classList.remove('theme-transition');
    }, 300);
    
    // Debug log
    console.log(`Theme switched to: ${newTheme}`);
  }

  function updateThemeToggle(theme) {
    if (themeToggle) {
      themeToggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
      
      // Ensure icons are properly displayed
      const lightIcon = themeToggle.querySelector('.light-icon');
      const darkIcon = themeToggle.querySelector('.dark-icon');
      
      if (lightIcon && darkIcon) {
        if (theme === 'dark') {
          lightIcon.style.display = 'none';
          darkIcon.style.display = 'block';
        } else {
          lightIcon.style.display = 'block';
          darkIcon.style.display = 'none';
        }
      }
    }
  }

  // ===== Navbar Scroll Effect =====
  function handleNavbarScroll() {
    const scrolled = window.scrollY > 50;
    navbar?.classList.toggle('scrolled', scrolled);
  }

  // ===== Smooth Scrolling =====
  function smoothScroll(target) {
    const element = document.querySelector(target);
    if (element) {
      const navHeight = navbar?.offsetHeight || 0;
      const targetPosition = element.offsetTop - navHeight - 20;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  }

  // ===== Counter Animation =====
  function animateCounter(element, target, suffix = '') {
    const duration = 2000;
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    function updateCounter() {
      current += increment;
      if (current < target) {
        if (suffix === '%' || suffix === '★') {
          element.textContent = current.toFixed(1) + suffix;
        } else {
          element.textContent = Math.floor(current).toLocaleString() + suffix;
        }
        requestAnimationFrame(updateCounter);
      } else {
        if (suffix === '%' || suffix === '★') {
          element.textContent = target.toFixed(1) + suffix;
        } else {
          element.textContent = target.toLocaleString() + suffix;
        }
      }
    }
    
    updateCounter();
  }

  // ===== Intersection Observer for Animations =====
  function initIntersectionObserver() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
          
          // Animate counters when stats section comes into view
          if (entry.target.classList.contains('stats')) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
              if (!stat.dataset.animated) {
                stat.dataset.animated = 'true';
                const target = parseInt(stat.dataset.target);
                const text = stat.textContent;
                
                if (text.includes('%')) {
                  animateCounter(stat, target, '%');
                } else if (text.includes('★')) {
                  animateCounter(stat, target, '★');
                } else if (target >= 1000000) {
                  animateCounter(stat, target / 1000000, 'M+');
                } else if (target >= 1000) {
                  animateCounter(stat, target / 1000, 'K+');
                } else {
                  animateCounter(stat, target);
                }
              }
            });
          }
          
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe elements for animation
    const elementsToObserve = document.querySelectorAll('.glass-card, .stats');
    elementsToObserve.forEach(el => observer.observe(el));
  }

  // ===== Billing Toggle =====
  function initPricingToggle() {
    if (!billingToggle) {
      console.log('Billing toggle not found - pricing toggle functionality disabled');
      return;
    }

    const monthlyPrices = document.querySelectorAll('.monthly-price');
    const annualPrices = document.querySelectorAll('.annual-price');
    const pricingCards = document.querySelectorAll('.pricing-card');
    
    if (monthlyPrices.length === 0 || annualPrices.length === 0) {
      console.warn('Pricing elements not found - check HTML structure');
      return;
    }
    
    // Initialize - show monthly prices by default
    annualPrices.forEach(price => {
      price.classList.add('hidden');
    });
    
    function switchPricing(isAnnual) {
      // Add transition effect to pricing cards
      pricingCards.forEach(card => {
        card.style.transform = 'scale(0.95)';
        card.style.transition = 'transform 0.2s ease';
      });
      
      // Switch prices with slight delay for smooth effect
      setTimeout(() => {
        monthlyPrices.forEach(price => {
          price.classList.toggle('hidden', isAnnual);
        });
        annualPrices.forEach(price => {
          price.classList.toggle('hidden', !isAnnual);
        });
        
        // Reset card scale
        pricingCards.forEach(card => {
          card.style.transform = 'scale(1)';
        });
        
        // Update aria-label for accessibility
        billingToggle.setAttribute('aria-label', 
          isAnnual ? 'Switch to monthly billing' : 'Switch to annual billing'
        );
      }, 100);
      
      // Remove transition after animation
      setTimeout(() => {
        pricingCards.forEach(card => {
          card.style.transition = '';
        });
      }, 300);
    }

    billingToggle.addEventListener('change', function() {
      switchPricing(this.checked);
    });
    
    // Keyboard support for toggle
    billingToggle.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.checked = !this.checked;
        switchPricing(this.checked);
      }
    });
  }

  // ===== Mobile Navigation =====
  function initMobileNav() {
    if (!navToggle || !navLinks) return;

    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('active');
      navToggle.classList.toggle('active', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen);
      
      // Prevent body scroll when menu is open
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close mobile menu when clicking on a link
    const mobileLinks = navLinks.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // ===== Parallax Effect for Hero Background =====
  function initParallax() {
    const orbs = document.querySelectorAll('.gradient-orb');
    
    function updateParallax() {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      
      orbs.forEach((orb, index) => {
        const speed = 0.5 + (index * 0.2);
        const yPos = -(scrollY * speed);
        orb.style.transform = `translate3d(0, ${yPos}px, 0)`;
      });
    }

    let ticking = false;
    function requestParallaxUpdate() {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
        setTimeout(() => ticking = false, 16);
      }
    }

    window.addEventListener('scroll', requestParallaxUpdate, { passive: true });
  }

  // ===== Button Hover Effects =====
  function initButtonEffects() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
      button.addEventListener('mouseenter', () => {
        button.style.transform = 'translateY(-2px)';
      });
      
      button.addEventListener('mouseleave', () => {
        button.style.transform = 'translateY(0)';
      });
    });
  }

  // ===== Glass Card Hover Effects =====
  function initGlassEffects() {
    const glassCards = document.querySelectorAll('.glass-card');
    
    glassCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-8px)';
        card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = '';
      });
    });
  }

  // ===== Keyboard Navigation =====
  function initKeyboardNav() {
    document.addEventListener('keydown', (e) => {
      // Toggle theme with Ctrl/Cmd + Shift + T
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
        e.preventDefault();
        toggleTheme();
      }
      
      // Escape key closes mobile menu
      if (e.key === 'Escape' && navLinks?.classList.contains('active')) {
        navLinks.classList.remove('active');
        navToggle?.classList.remove('active');
        navToggle?.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  // ===== Form Interactions =====
  function initFormInteractions() {
    const ctaButtons = document.querySelectorAll('a[href="#pricing"], .btn-primary');
    
    ctaButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        if (button.href && button.href.includes('#')) {
          e.preventDefault();
          const target = button.getAttribute('href');
          smoothScroll(target);
        }
      });
    });
  }

  // ===== Loading Animation =====
  function initLoadingAnimation() {
    window.addEventListener('load', () => {
      document.body.classList.add('loaded');
      
      // Stagger animation of hero elements
      const heroElements = document.querySelectorAll('.hero-badge, .hero-title, .hero-description, .hero-actions');
      heroElements.forEach((el, index) => {
        setTimeout(() => {
          el.classList.add('fade-in');
        }, index * 100);
      });
    });
  }

  // ===== Reduce Motion Support =====
  function initReducedMotion() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches) {
      document.documentElement.style.scrollBehavior = 'auto';
      
      // Disable animations for users who prefer reduced motion
      const style = document.createElement('style');
      style.textContent = `
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      `;
      document.head.appendChild(style);
    }
  }

  // ===== Initialize Everything =====
  function init() {
    // Set current year
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }

    // Initialize all features
    initTheme();
    initIntersectionObserver();
    initPricingToggle();
    initMobileNav();
    initParallax();
    initButtonEffects();
    initGlassEffects();
    initKeyboardNav();
    initFormInteractions();
    initLoadingAnimation();
    initReducedMotion();

    // Event listeners
    if (themeToggle) {
      themeToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        toggleTheme();
      });
    }
    window.addEventListener('scroll', handleNavbarScroll, { passive: true });

    // Handle hash navigation
    if (window.location.hash) {
      setTimeout(() => {
        smoothScroll(window.location.hash);
      }, 100);
    }

    // System theme change detection
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        const newTheme = e.matches ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        updateThemeToggle(newTheme);
      }
    });
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

  // Advanced Cursor Effects
  function initCursorEffects() {
    // Custom cursor for interactive elements
    let cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    let cursorFollower = document.createElement('div');
    cursorFollower.className = 'cursor-follower';
    document.body.appendChild(cursorFollower);

    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', function(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      cursor.style.left = mouseX + 'px';
      cursor.style.top = mouseY + 'px';
    });

    // Smooth follower animation
    function animateFollower() {
      followerX += (mouseX - followerX) * 0.1;
      followerY += (mouseY - followerY) * 0.1;
      
      cursorFollower.style.left = followerX + 'px';
      cursorFollower.style.top = followerY + 'px';
      
      requestAnimationFrame(animateFollower);
    }
    animateFollower();

    // Interactive elements
    const interactiveElements = document.querySelectorAll('button, a, .glass-card');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('active');
        cursorFollower.classList.add('active');
      });
      
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('active');
        cursorFollower.classList.remove('active');
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
    
    // Only init cursor effects on non-touch devices
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      initCursorEffects();
    }
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