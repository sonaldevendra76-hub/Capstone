\# WORKFLOW.md



\## Setup

Feature: a settings form with Name, Email, and Notification Preference

(radio: All / Important only / None), with Save and Cancel buttons.

Round 1: a single one-sentence prompt ("build a settings form"), fresh

session, no follow-up, output accepted as-is.

Round 2: a precise prompt with explicit stack constraints (plain HTML/

CSS/JS, no frameworks), field requirements, example behavior, and a

verification step ("write it, then write tests, then run them"), in a

separate fresh session using an explore-plan-code-verify loop.



\## Correctness

Round 1 produced a React `.jsx` component — despite this being a plain

HTML/CSS/JS project with no build tooling installed. It cannot run in

this repo at all. Beyond that, it has zero validation logic: `handleSave()`

sets `saved = true` unconditionally regardless of field contents. An

empty Name or an email like "foo" saves successfully with no error.

Round 2 implemented real validation (name length, email regex format)

and I confirmed it myself by running `node test.js` — 32/32 tests passed,

covering valid submits, empty fields, invalid email, and boundary cases

(50 vs 51 characters).



\## Accessibility

Round 1's text inputs used a proper wrapping `<label>`, but every toggle

control (used for notifications, privacy, appearance) was a custom

`<button role="switch">` with no formal label association — just nearby

text, which is not reliably announced by screen readers. Round 2 has

explicit `<label for="id">` pairs on every input and error text linked

via `aria-describedby` with `role="alert"`, which I asked for directly

in the prompt and Round 2's own tests confirm errors appear/disappear

correctly on blur.



\## Edge cases

Round 1 has no double-submit protection — the Save button can be clicked

repeatedly with no disabled or loading state. It also silently invented

scope I never asked for: a tabbed panel (Profile/Notifications/Privacy/

Appearance), a fabricated user ("Alex Morgan", alex@northline.co), a

"Delete account" button, and a theme picker — while skipping the one

thing I actually named ("with validation"). Round 2 stayed within the

scope I specified and its own generated test suite explicitly caught

double-submit prevention, which I verified by running the tests myself

rather than trusting the transcript.



\## Review effort / time

Round 1: under 10 minutes to prompt and accept, but the output is

unusable in this project without adding an entire React build pipeline

— a decision I didn't make and don't want.

Round 2: 20-40 minutes including reading its plan before approving,

and reviewing 32 lines of test output — but zero minutes of after-the-fact

bug hunting, because the verification step surfaced the real issues

before I even opened a browser. End-to-end, Round 2 was slower to

prompt but faster to trust and ship.



\## AI mistake I caught

The vague prompt in Round 1 produced a form with no validation logic

whatsoever, despite the word "settings form" implying data integrity

matters — `handleSave()` accepts and "saves" any input, including an

empty name field or the string "foo" as an email, with zero error

handling written anywhere in the component.



\## Takeaway

A vague prompt didn't just produce a "worse" version of the same thing

— it produced a differently-scoped, wrong-stack artifact that looked

polished (styled UI, fake realistic data) but had zero functional

validation, the one property that actually mattered. Specifying stack,

constraints, and a verification step didn't just improve quality, it

changed what got built and forced the model to prove it worked before

I had to.

