/**
 * Plain test script using console.assert (no test framework).
 *
 * Run with: node test.js
 *
 * Note: jsdom is used here only as a dev/test tool to simulate a
 * browser DOM in Node so the real form-wiring code in script.js can
 * be exercised end-to-end. It is NOT part of the shipped app (which
 * remains plain HTML/CSS/vanilla JS with no runtime dependencies).
 */

const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

const {
  validateName,
  validateEmail,
  validateNotification,
} = require("./script.js");

let failures = 0;

function check(condition, message) {
  console.assert(condition, message);
  if (!condition) {
    failures++;
    console.log(`FAIL: ${message}`);
  } else {
    console.log(`PASS: ${message}`);
  }
}

/* ------------------------------------------------------------------
 * Part 1: pure validation function unit tests
 * ---------------------------------------------------------------- */

console.log("\n--- Pure validation function tests ---");

check(validateName("a").valid === false, "validateName: 'a' (1 char) is invalid");
check(
  validateName("a").message === "Name must be at least 2 characters.",
  "validateName: 'a' gives the correct short-name message"
);
check(validateName("Al").valid === true, "validateName: 'Al' (2 chars) is valid");
check(validateName("").valid === false, "validateName: empty string is invalid");
check(validateName("   ").valid === false, "validateName: whitespace-only is invalid");
check(validateName("A".repeat(50)).valid === true, "validateName: 50 chars is valid (boundary)");
check(validateName("A".repeat(51)).valid === false, "validateName: 51 chars is invalid (boundary)");

check(validateEmail("foo").valid === false, "validateEmail: 'foo' is invalid");
check(
  validateEmail("foo").message === "Enter a valid email address.",
  "validateEmail: 'foo' gives the correct message"
);
check(validateEmail("foo@bar.com").valid === true, "validateEmail: 'foo@bar.com' is valid");
check(validateEmail("").valid === false, "validateEmail: empty string is invalid");
check(validateEmail("foo@bar").valid === false, "validateEmail: missing TLD is invalid");

check(validateNotification("All").valid === true, "validateNotification: 'All' is valid");
check(validateNotification("Important only").valid === true, "validateNotification: 'Important only' is valid");
check(validateNotification("None").valid === true, "validateNotification: 'None' is valid");
check(validateNotification("Something else").valid === false, "validateNotification: unknown value is invalid");

/* ------------------------------------------------------------------
 * Part 2: full-form behavior tests, driven through a simulated DOM
 * ---------------------------------------------------------------- */

console.log("\n--- Full form behavior tests (via jsdom) ---");

const html = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");
const scriptSrc = fs.readFileSync(path.join(__dirname, "script.js"), "utf8");

function setupForm() {
  const dom = new JSDOM(html, { runScripts: "outside-only", pretendToBeVisual: true });
  const { window } = dom;

  // Run script.js inside this window (mirrors a <script> tag loading it).
  window.eval(scriptSrc);
  // DOMContentLoaded already fired before our listener attached (jsdom
  // fires it as part of parsing), so call the init function directly.
  window.initSettingsForm();

  return dom;
}

function fireEvent(el, type) {
  const evt = el.ownerDocument.defaultView.document.createEvent("Event");
  evt.initEvent(type, true, true);
  el.dispatchEvent(evt);
}

async function testRadioDefaultsToAll() {
  const dom = setupForm();
  const { document } = dom.window;
  const checked = document.querySelector('input[name="notification"]:checked');
  check(checked !== null && checked.value === "All", "Radio group defaults to 'All' on load");
}

async function testEmptyRequiredFieldsCaught() {
  const dom = setupForm();
  const { document } = dom.window;
  const form = document.getElementById("settings-form");

  // Leave name and email empty, submit the form.
  fireEvent(form, "submit");

  const nameError = document.getElementById("name-error").textContent;
  const emailError = document.getElementById("email-error").textContent;

  check(nameError === "Name is required.", "Empty Name is caught on submit");
  check(emailError === "Email is required.", "Empty Email is caught on submit");
}

async function testShortNameCaught() {
  const dom = setupForm();
  const { document } = dom.window;
  const nameInput = document.getElementById("name");

  nameInput.value = "a";
  fireEvent(nameInput, "blur");

  const nameError = document.getElementById("name-error").textContent;
  check(
    nameError === "Name must be at least 2 characters.",
    "Typing 'a' into Name and blurring shows the short-name error"
  );
}

async function testInvalidEmailCaught() {
  const dom = setupForm();
  const { document } = dom.window;
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const form = document.getElementById("settings-form");

  nameInput.value = "Alice";
  emailInput.value = "foo";
  fireEvent(form, "submit");

  const emailError = document.getElementById("email-error").textContent;
  check(
    emailError === "Enter a valid email address.",
    "Submitting with email 'foo' shows 'Enter a valid email address.'"
  );
}

async function testNoErrorsOnLoad() {
  const dom = setupForm();
  const { document } = dom.window;
  const nameError = document.getElementById("name-error").textContent;
  const emailError = document.getElementById("email-error").textContent;
  check(nameError === "" && emailError === "", "No errors are shown on initial page load");
}

async function testValidSubmitPasses() {
  const dom = setupForm();
  const { document, window } = dom.window;
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const form = document.getElementById("settings-form");
  const submitBtn = document.getElementById("submit-btn");

  nameInput.value = "Alice";
  emailInput.value = "alice@example.com";
  fireEvent(form, "submit");

  // Immediately after submit, button should show the saving state.
  check(submitBtn.disabled === true, "Valid submit disables the Save button immediately");
  check(submitBtn.textContent === "Saving...", "Valid submit shows 'Saving...' text immediately");

  // Wait for the simulated save (600ms) to complete.
  await new Promise((resolve) => window.setTimeout(resolve, 900));

  check(submitBtn.disabled === false, "After save completes, Save button is re-enabled");
  check(submitBtn.textContent === "Save changes", "After save completes, button text is restored");

  const saveStatus = document.getElementById("save-status").textContent;
  check(saveStatus === "Settings saved.", "Valid submit results in a success status message");

  const nameError = document.getElementById("name-error").textContent;
  const emailError = document.getElementById("email-error").textContent;
  check(nameError === "" && emailError === "", "No errors shown after a valid submit");
}

async function testDoubleSubmitPrevented() {
  const dom = setupForm();
  const { document, window } = dom.window;
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const form = document.getElementById("settings-form");
  const submitBtn = document.getElementById("submit-btn");

  nameInput.value = "Bob";
  emailInput.value = "bob@example.com";

  // Fire submit twice, rapidly, before the simulated save resolves.
  fireEvent(form, "submit");
  fireEvent(form, "submit");
  fireEvent(form, "submit");

  check(submitBtn.disabled === true, "Button is disabled after rapid repeated submits");

  await new Promise((resolve) => window.setTimeout(resolve, 900));

  // If double-submit weren't prevented, the save would have been
  // triggered multiple times, but the state should still be clean:
  // one final success message, button re-enabled once.
  check(submitBtn.disabled === false, "Button re-enabled after save completes (single save cycle)");
  const saveStatus = document.getElementById("save-status").textContent;
  check(saveStatus === "Settings saved.", "Only a single successful save message appears");
}

async function testCancelResetsToSavedValues() {
  const dom = setupForm();
  const { document, window } = dom.window;
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const form = document.getElementById("settings-form");
  const cancelBtn = document.getElementById("cancel-btn");

  // Save an initial valid state.
  nameInput.value = "Carol";
  emailInput.value = "carol@example.com";
  fireEvent(form, "submit");
  await new Promise((resolve) => window.setTimeout(resolve, 900));

  // Make further edits without saving them.
  nameInput.value = "Changed Name";
  emailInput.value = "changed@example.com";
  document.getElementById("notify-none").checked = true;

  fireEvent(cancelBtn, "click");

  check(nameInput.value === "Carol", "Cancel restores Name to last saved value");
  check(emailInput.value === "carol@example.com", "Cancel restores Email to last saved value");
  const checked = document.querySelector('input[name="notification"]:checked');
  check(checked.value === "All", "Cancel restores notification preference to last saved value");
}

async function runAll() {
  await testRadioDefaultsToAll();
  await testEmptyRequiredFieldsCaught();
  await testShortNameCaught();
  await testInvalidEmailCaught();
  await testNoErrorsOnLoad();
  await testValidSubmitPasses();
  await testDoubleSubmitPrevented();
  await testCancelResetsToSavedValues();

  console.log(`\n${failures === 0 ? "ALL TESTS PASSED" : failures + " TEST(S) FAILED"}`);
  process.exit(failures === 0 ? 0 : 1);
}

runAll();
