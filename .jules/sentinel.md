# Sentinel's Journal - KG Entrega

🛡️ Security-focused journal of critical security learnings.

<!-- Keep entries for CRITICAL learnings only using the format below:

## YYYY-MM-DD - [Title]
**Vulnerability:** [What you found]
**Learning:** [Why it existed]
**Prevention:** [How to avoid next time]

-->

## 2025-02-14 - Clickjacking, Spam, and HTML injection
**Vulnerability:** Vulnerable to frame embedding (clickjacking), high-frequency message spam, and possible HTML injection in the WhatsApp messaging widget.
**Learning:** Lacking frame-busting logic allowed standard iframes to embed the site. Absence of rate-limiting allowed automated scripts to spam Leandro's phone. No HTML-tag stripping allowed input injection.
**Prevention:** Implement frame-busting check, restrict messaging rate limits (3 seconds), and sanitize inputs by stripping tags using regular expressions.
