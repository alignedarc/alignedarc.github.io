/* ===================================
   FORM HANDLER - Aligned Arc
   Formspree integration with validation and user feedback
   =================================== */

(function() {
  'use strict';

  // Get form element
  const form = document.getElementById('contact-form');

  if (!form) {
    return;
  }

  // Get form fields
  const submitButton = form.querySelector('button[type="submit"]');
  const formFields = {
    name: form.querySelector('#name'),
    email: form.querySelector('#email'),
    role: form.querySelector('#role'),
    teamSize: form.querySelector('#team-size'),
    challenge: form.querySelector('#challenge'),
    timeline: form.querySelector('#timeline')
  };

  /**
   * Create and display message element
   * @param {string} type - 'success' or 'error'
   * @param {string} message - Message text to display
   */
  function showMessage(type, message) {
    // Remove existing message if any
    const existingMessage = form.querySelector('.form-message');
    if (existingMessage) {
      existingMessage.remove();
    }

    // Create new message element
    const messageEl = document.createElement('div');
    messageEl.className = `form-message form-message--${type}`;
    messageEl.textContent = message;
    messageEl.setAttribute('role', 'alert');

    // Insert at top of form
    form.insertBefore(messageEl, form.firstChild);

    // Scroll message into view
    messageEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Auto-remove success messages after 8 seconds
    if (type === 'success') {
      setTimeout(() => {
        if (messageEl.parentNode) {
          messageEl.remove();
        }
      }, 8000);
    }
  }

  /**
   * Validate email format
   * @param {string} email - Email address to validate
   * @returns {boolean} - True if valid email format
   */
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate form fields
   * @returns {Object} - { valid: boolean, errors: Array }
   */
  function validateForm() {
    const errors = [];

    // Validate name
    if (!formFields.name.value.trim()) {
      errors.push('Name is required');
      formFields.name.setAttribute('aria-invalid', 'true');
    } else {
      formFields.name.setAttribute('aria-invalid', 'false');
    }

    // Validate email
    if (!formFields.email.value.trim()) {
      errors.push('Email is required');
      formFields.email.setAttribute('aria-invalid', 'true');
    } else if (!isValidEmail(formFields.email.value.trim())) {
      errors.push('Please enter a valid email address');
      formFields.email.setAttribute('aria-invalid', 'true');
    } else {
      formFields.email.setAttribute('aria-invalid', 'false');
    }

    // Validate message
    if (!formFields.challenge.value.trim()) {
      errors.push('Please tell us what\'s stuck');
      formFields.challenge.setAttribute('aria-invalid', 'true');
    } else {
      formFields.challenge.setAttribute('aria-invalid', 'false');
    }

    return {
      valid: errors.length === 0,
      errors: errors
    };
  }

  /**
   * Set button loading state
   * @param {boolean} loading - True to show loading, false to reset
   */
  function setButtonLoading(loading) {
    if (!submitButton) return;

    if (loading) {
      submitButton.disabled = true;
      submitButton.dataset.originalText = submitButton.textContent;
      submitButton.textContent = 'Sending...';
      submitButton.style.opacity = '0.7';
    } else {
      submitButton.disabled = false;
      submitButton.textContent = submitButton.dataset.originalText || 'Send Message';
      submitButton.style.opacity = '1';
    }
  }

  /**
   * Reset form to initial state
   */
  function resetForm() {
    form.reset();

    // Remove aria-invalid attributes
    Object.values(formFields).forEach(field => {
      if (field) {
        field.removeAttribute('aria-invalid');
      }
    });
  }

  /**
   * Handle form submission
   * @param {Event} e - Submit event
   */
  async function handleSubmit(e) {
    e.preventDefault();

    // Validate form
    const validation = validateForm();

    if (!validation.valid) {
      showMessage('error', validation.errors[0]);
      return;
    }

    // Set loading state
    setButtonLoading(true);

    try {
      // Get form data
      const formData = new FormData(form);

      // Submit to Formspree
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        // Success
        showMessage('success', 'Thank you for reaching out! We\'ll get back to you within 24 hours.');
        resetForm();

        // Optional: Track form submission (Google Analytics, etc.)
        if (typeof gtag !== 'undefined') {
          gtag('event', 'form_submission', {
            'event_category': 'Contact',
            'event_label': 'Contact Form'
          });
        }

      } else {
        // Formspree returned an error
        const data = await response.json();

        if (data.errors) {
          // Show specific field errors from Formspree
          const errorMessage = data.errors.map(error => error.message).join(', ');
          showMessage('error', errorMessage);
        } else {
          showMessage('error', 'Oops! There was a problem submitting your form. Please try again.');
        }
      }

    } catch (error) {
      // Network error or other exception
      console.error('Form submission error:', error);
      showMessage('error', 'Network error. Please check your connection and try again.');
    } finally {
      // Reset button state
      setButtonLoading(false);
    }
  }

  /**
   * Add real-time validation feedback
   * @param {HTMLElement} field - Form field element
   */
  function addFieldValidation(field) {
    if (!field) return;

    field.addEventListener('blur', () => {
      // Only validate if field has been touched
      if (field.value.trim()) {
        if (field === formFields.email) {
          if (!isValidEmail(field.value.trim())) {
            field.setAttribute('aria-invalid', 'true');
          } else {
            field.setAttribute('aria-invalid', 'false');
          }
        } else {
          field.setAttribute('aria-invalid', 'false');
        }
      }
    });

    // Remove error state on input
    field.addEventListener('input', () => {
      field.removeAttribute('aria-invalid');
    });
  }

  /**
   * Initialize form handler
   */
  function init() {
    // Add submit handler
    form.addEventListener('submit', handleSubmit);

    // Add real-time validation to required fields
    Object.values(formFields).forEach(field => {
      addFieldValidation(field);
    });

    // Prevent multiple submissions
    form.addEventListener('submit', (e) => {
      if (submitButton && submitButton.disabled) {
        e.preventDefault();
      }
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
