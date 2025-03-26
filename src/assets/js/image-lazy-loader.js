/**
 * Image Optimization Helper
 * Handles lazy loading images and applies fade-in animations
 */

(function() {
  'use strict';
  
  // Check if native lazy loading is supported
  const supportsLazyLoading = 'loading' in HTMLImageElement.prototype;
  
  /**
   * Initialize IntersectionObserver for older browsers
   * that don't support native lazy loading
   */
  function initLazyLoadingFallback() {
    if ('IntersectionObserver' in window) {
      const lazyImageObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            let lazyImage = entry.target;
            
            // Set the src attribute to load the image
            if (lazyImage.dataset.src) {
              lazyImage.src = lazyImage.dataset.src;
              lazyImage.removeAttribute('data-src');
            }
            
            // Set srcset if it exists
            if (lazyImage.dataset.srcset) {
              lazyImage.srcset = lazyImage.dataset.srcset;
              lazyImage.removeAttribute('data-srcset');
            }
            
            // Set sizes if it exists
            if (lazyImage.dataset.sizes) {
              lazyImage.sizes = lazyImage.dataset.sizes;
              lazyImage.removeAttribute('data-sizes');
            }
            
            // Add loaded class for CSS transitions
            lazyImage.classList.add('loaded');
            
            // Stop observing this image
            observer.unobserve(lazyImage);
          }
        });
      }, {
        // Start loading when image is 200px from viewport
        rootMargin: '200px 0px',
        threshold: 0.01
      });
      
      // Find all images that need lazy loading
      document.querySelectorAll('img[data-src]').forEach(function(img) {
        lazyImageObserver.observe(img);
      });
    } else {
      // Fallback for browsers that don't support IntersectionObserver
      // Just load all images immediately
      document.querySelectorAll('img[data-src]').forEach(function(img) {
        img.src = img.dataset.src;
        img.srcset = img.dataset.srcset || '';
        img.sizes = img.dataset.sizes || '';
        img.classList.add('loaded');
      });
    }
  }
  
  /**
   * Setup the loaded class for transition effects
   * even with native lazy loading
   */
  function setupImageLoadEvents() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    images.forEach(function(img) {
      // If image is already loaded, add loaded class
      if (img.complete) {
        img.classList.add('loaded');
      } else {
        // Otherwise add loaded class when it loads
        img.addEventListener('load', function() {
          this.classList.add('loaded');
        });
      }
    });
  }
  
  /**
   * Initialize everything when DOM is ready
   */
  function init() {
    // For browsers that don't support native lazy loading
    if (!supportsLazyLoading) {
      initLazyLoadingFallback();
    }
    
    // Setup transition effects
    setupImageLoadEvents();
  }
  
  // Run when the DOM is fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})(); 