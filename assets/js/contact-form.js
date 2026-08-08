/**
 * Handles the Formspree contact form submission on contact.html.
 * Replaces the original PHP-based handler (forms/contact.php), which
 * cannot run on Render's static site hosting.
 */
(function () {
  "use strict";

  const form = document.getElementById('contact-form');
  if (!form) return;

  const loading = form.querySelector('.loading');
  const errorMessage = form.querySelector('.error-message');
  const sentMessage = form.querySelector('.sent-message');

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    loading.classList.add('d-block');
    errorMessage.classList.remove('d-block');
    sentMessage.classList.remove('d-block');

    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    })
      .then((response) => {
        loading.classList.remove('d-block');
        if (response.ok) {
          sentMessage.classList.add('d-block');
          form.reset();
        } else {
          return response.json().then((data) => {
            const message = data && data.errors
              ? data.errors.map((e) => e.message).join(', ')
              : 'Form submission failed. Please try again or email me directly.';
            throw new Error(message);
          });
        }
      })
      .catch((error) => {
        loading.classList.remove('d-block');
        errorMessage.textContent = error.message || 'Oops! Something went wrong. Please try again.';
        errorMessage.classList.add('d-block');
      });
  });
})();
