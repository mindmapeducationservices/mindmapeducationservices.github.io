/* ============================================================
   Mind Map Services — script.js
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     Mobile navigation toggle
  ---------------------------------------------------------- */
  var toggle = document.getElementById('navToggle');
  var nav    = document.getElementById('primaryNav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close when any nav link is activated
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!nav.contains(e.target) && !toggle.contains(e.target)) {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }


  /* ----------------------------------------------------------
     Contact form — Web3Forms submission
     Uses textContent exclusively; never sets innerHTML with
     user-supplied data, preventing XSS injection.
  ---------------------------------------------------------- */
  var form      = document.getElementById('contactForm');
  var submitBtn = document.getElementById('submitBtn');
  var formMsg   = document.getElementById('formMsg');

  if (form && submitBtn && formMsg) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var nameVal    = document.getElementById('name').value.trim();
      var emailVal   = document.getElementById('email').value.trim();
      var messageVal = document.getElementById('message').value.trim();

      // Client-side validation
      if (!nameVal || !emailVal || !messageVal) {
        showMsg('Please fill in all fields before submitting.', 'error');
        return;
      }

      var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      if (!emailPattern.test(emailVal)) {
        showMsg('Please enter a valid email address.', 'error');
        return;
      }

      submitBtn.textContent = 'Sending\u2026';
      submitBtn.disabled = true;
      hideMsg();

      var formData = new FormData(form);
      // Build a safe subject line from the validated name field
      formData.set('subject', 'New Enquiry \u2014 ' + nameVal);

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      })
        .then(function (response) { return response.json(); })
        .then(function (data) {
          if (data.success) {
            showMsg(
              'Thank you! Your message has been sent. We will get back to you within 1\u20132 business days.',
              'success'
            );
            submitBtn.textContent = 'Message Sent \u2713';
            form.reset();
          } else {
            throw new Error('Submission rejected');
          }
        })
        .catch(function () {
          showMsg(
            'Something went wrong. Please email us directly at mindmapeducationservices@gmail.com',
            'error'
          );
          submitBtn.textContent = 'Send Message';
          submitBtn.disabled = false;
        });
    });
  }

  function showMsg(text, type) {
    if (!formMsg) return;
    formMsg.textContent = text;           // safe — textContent only, no HTML injection
    formMsg.className = 'form-msg ' + type;
    formMsg.hidden = false;
  }

  function hideMsg() {
    if (!formMsg) return;
    formMsg.hidden = true;
    formMsg.textContent = '';
    formMsg.className = 'form-msg';
  }

})();
