/* ------------------------------------------------------------------
 * Pure validation functions.
 * These have no DOM dependencies so they can be unit tested directly
 * (see test.js) as well as used by the form-wiring code below.
 * ---------------------------------------------------------------- */

function validateName(value) {
  const v = (value || "").trim();
  if (v.length === 0) {
    return { valid: false, message: "Name is required." };
  }
  if (v.length < 2) {
    return { valid: false, message: "Name must be at least 2 characters." };
  }
  if (v.length > 50) {
    return { valid: false, message: "Name must be at most 50 characters." };
  }
  return { valid: true, message: "" };
}

function validateEmail(value) {
  const v = (value || "").trim();
  if (v.length === 0) {
    return { valid: false, message: "Email is required." };
  }
  // Simple, practical email check: something@something.something
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(v)) {
    return { valid: false, message: "Enter a valid email address." };
  }
  return { valid: true, message: "" };
}

function validateNotification(value) {
  const allowed = ["All", "Important only", "None"];
  if (!allowed.includes(value)) {
    return { valid: false, message: "Select a notification preference." };
  }
  return { valid: true, message: "" };
}

/* ------------------------------------------------------------------
 * DOM wiring. Only runs in a browser context (skipped when this file
 * is `require`-d from Node for testing purposes).
 * ---------------------------------------------------------------- */

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", initSettingsForm);
}

function initSettingsForm() {
  const form = document.getElementById("settings-form");
  if (!form) return; // safety guard, in case script loads on the wrong page

  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const notificationRadios = form.querySelectorAll('input[name="notification"]');

  const nameError = document.getElementById("name-error");
  const emailError = document.getElementById("email-error");
  const notificationError = document.getElementById("notification-error");

  const submitBtn = document.getElementById("submit-btn");
  const cancelBtn = document.getElementById("cancel-btn");
  const saveStatus = document.getElementById("save-status");

  // Tracks which fields the user has interacted with, so errors only
  // appear after a blur/interaction rather than on initial page load.
  const touched = { name: false, email: false, notification: false };

  // Tracks whether a save is currently "in flight", to guard against
  // double-submission if the button is clicked twice quickly.
  let isSubmitting = false;

  // The last successfully saved values. Cancel restores the form to this.
  let savedValues = getFormValues();

  function getFormValues() {
    const notification = form.querySelector('input[name="notification"]:checked');
    return {
      name: nameInput.value,
      email: emailInput.value,
      notification: notification ? notification.value : "",
    };
  }

  function setFieldError(errorEl, inputEl, message) {
    errorEl.textContent = message;
    if (inputEl) {
      inputEl.classList.toggle("invalid", Boolean(message));
    }
  }

  function clearFieldError(errorEl, inputEl) {
    errorEl.textContent = "";
    if (inputEl) {
      inputEl.classList.remove("invalid");
    }
  }

  function runNameValidation(showIfInvalid) {
    const result = validateName(nameInput.value);
    if (showIfInvalid && !result.valid) {
      setFieldError(nameError, nameInput, result.message);
    } else {
      clearFieldError(nameError, nameInput);
    }
    return result.valid;
  }

  function runEmailValidation(showIfInvalid) {
    const result = validateEmail(emailInput.value);
    if (showIfInvalid && !result.valid) {
      setFieldError(emailError, emailInput, result.message);
    } else {
      clearFieldError(emailError, emailInput);
    }
    return result.valid;
  }

  function runNotificationValidation(showIfInvalid) {
    const checked = form.querySelector('input[name="notification"]:checked');
    const result = validateNotification(checked ? checked.value : "");
    if (showIfInvalid && !result.valid) {
      setFieldError(notificationError, null, result.message);
    } else {
      clearFieldError(notificationError, null);
    }
    return result.valid;
  }

  // --- Blur handlers: validate one field, only show its error once
  // the user has interacted with (touched) that field. ---

  nameInput.addEventListener("blur", () => {
    touched.name = true;
    runNameValidation(touched.name);
  });

  emailInput.addEventListener("blur", () => {
    touched.email = true;
    runEmailValidation(touched.email);
  });

  notificationRadios.forEach((radio) => {
    radio.addEventListener("blur", () => {
      touched.notification = true;
      runNotificationValidation(touched.notification);
    });
    // A change also counts as interaction, in case the user never
    // blurs the radio group (e.g. picks a value with a single click).
    radio.addEventListener("change", () => {
      touched.notification = true;
      runNotificationValidation(touched.notification);
    });
  });

  // While typing, clear an already-shown error as soon as the field
  // becomes valid again, for faster feedback (still gated by touched).
  nameInput.addEventListener("input", () => {
    if (touched.name) runNameValidation(true);
  });
  emailInput.addEventListener("input", () => {
    if (touched.email) runEmailValidation(true);
  });

  // --- Submit handler ---

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (isSubmitting) {
      // Ignore rapid double-clicks / repeated submit events.
      return;
    }

    // Re-validate the whole form and mark every field as touched so
    // all relevant errors become visible.
    touched.name = true;
    touched.email = true;
    touched.notification = true;

    const nameValid = runNameValidation(true);
    const emailValid = runEmailValidation(true);
    const notificationValid = runNotificationValidation(true);

    if (!nameValid || !emailValid || !notificationValid) {
      saveStatus.textContent = "Please fix the errors above.";
      saveStatus.classList.remove("success");
      return;
    }

    isSubmitting = true;
    submitBtn.disabled = true;
    submitBtn.textContent = "Saving...";
    saveStatus.textContent = "";
    saveStatus.classList.remove("success");

    // Simulated async save.
    setTimeout(() => {
      savedValues = getFormValues();

      isSubmitting = false;
      submitBtn.disabled = false;
      submitBtn.textContent = "Save changes";

      saveStatus.textContent = "Settings saved.";
      saveStatus.classList.add("success");
    }, 600);
  });

  // --- Cancel handler: reset fields to last saved values ---

  cancelBtn.addEventListener("click", () => {
    nameInput.value = savedValues.name;
    emailInput.value = savedValues.email;

    notificationRadios.forEach((radio) => {
      radio.checked = radio.value === savedValues.notification;
    });

    touched.name = false;
    touched.email = false;
    touched.notification = false;

    clearFieldError(nameError, nameInput);
    clearFieldError(emailError, emailInput);
    clearFieldError(notificationError, null);

    saveStatus.textContent = "";
    saveStatus.classList.remove("success");
  });
}

/* ------------------------------------------------------------------
 * Export pure functions for testing under Node (test.js).
 * This block is a no-op in the browser.
 * ---------------------------------------------------------------- */
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    validateName,
    validateEmail,
    validateNotification,
    initSettingsForm,
  };
}
