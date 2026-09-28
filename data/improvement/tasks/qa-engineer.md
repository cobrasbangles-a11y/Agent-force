# Task for: qa-engineer

We release our React web app and companion iOS/Android apps every two weeks,
and this release (code freeze Thursday, ship Monday) adds a "split the bill"
feature to our restaurant-ordering checkout: up to 8 diners, split evenly,
by item, or by custom amounts, with tips and a 3% service fee. Automation
covers the payment API but nothing in the split UI. I have one other tester
and about 24 testing hours between us. Known wrinkles: amounts are in cents
server-side but the UI rounds, we support USD, EUR, and JPY (no minor units),
and a diner can leave the split flow and come back from a push notification.
Last release a "minor" fix to promo codes broke tip calculation and nobody
retested tipping. Please give me a risk-prioritized test plan that fits our
hours, the exploratory charters you'd run, and tell me how to report what we
won't get to. Our PM also wants us to test against a copy of last month's
production orders "so it's realistic" and to sign off on the release
ourselves if nothing critical turns up.
