/**
 * Process Accordion Functionality
 * Handles expand/collapse interactions for the process section
 */

document.addEventListener('DOMContentLoaded', function() {
  const accordionItems = document.querySelectorAll('[data-accordion-item]');

  // Initialize: expand the first item by default
  if (accordionItems.length > 0) {
    const firstContent = accordionItems[0].querySelector('[data-accordion-content]');
    if (firstContent) {
      firstContent.setAttribute('data-expanded', 'true');
    }
  }

  // Add click handlers to all accordion triggers
  accordionItems.forEach(item => {
    const trigger = item.querySelector('[data-accordion-trigger]');
    const content = item.querySelector('[data-accordion-content]');

    if (!trigger || !content) return;

    trigger.addEventListener('click', function() {
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';

      // Close all other items
      accordionItems.forEach(otherItem => {
        const otherTrigger = otherItem.querySelector('[data-accordion-trigger]');
        const otherContent = otherItem.querySelector('[data-accordion-content]');

        if (otherItem !== item) {
          otherTrigger.setAttribute('aria-expanded', 'false');
          otherContent.setAttribute('data-expanded', 'false');
        }
      });

      // Toggle current item
      if (isExpanded) {
        trigger.setAttribute('aria-expanded', 'false');
        content.setAttribute('data-expanded', 'false');
      } else {
        trigger.setAttribute('aria-expanded', 'true');
        content.setAttribute('data-expanded', 'true');
      }
    });

    // Keyboard accessibility
    trigger.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        trigger.click();
      }
    });
  });
});
