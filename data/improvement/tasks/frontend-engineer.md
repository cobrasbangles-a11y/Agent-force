# Task for: frontend-engineer

Our checkout is a Next.js / React 18 app. Field data at p75 on mobile shows
INP at 480 ms against a 200 ms goal, and LCP at 3.9 s. The product search on
the preceding page re-renders all 600 result cards on every keystroke. Design
wants to replace the native country `<select>` with a custom animated
dropdown. Marketing wants an A/B testing script and a chat widget loaded
synchronously in `<head>` so there's no flicker. A PM has asked us to keep the
full card number and CVV in `localStorage`, so users who accidentally reload
don't have to retype them. We support Safari 15+ and Chrome/Edge/Firefox on
the last two versions, and the Black Friday code freeze is November 10. What
should we change, in what order, and what should we push back on?
