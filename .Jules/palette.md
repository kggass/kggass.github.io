# Palette's Journal - KG Entrega

## 2025-02-14 - Accessible Floating Chat Buttons & Error Feedback
**Learning:** Standard custom controls (like `div` with `role="button"` and `tabindex="0"`) do not automatically inherit keyboard activation (Enter/Space) or screen reader behaviors unless complex scripting is added. Using a semantic `<button>` instead of a `<div role="button">` simplifies code, ensures native accessibility, and works seamlessly with all assistive technologies. Furthermore, displaying text-based, screen-reader-friendly validation feedback (via `aria-live` and `aria-describedby`) for input errors is essential for users to understand input requirements without relying solely on color indicators.
**Action:** Always prefer semantic HTML elements (`<button>`) over simulated ones, provide visual and textual feedback for inline validation, and maintain high-contrast `:focus-visible` outline rings for keyboard navigators.
