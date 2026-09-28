# Client request

We got a demand letter last month citing ADA/WCAG issues on our patient
portal, and legal wants a remediation plan before they respond. The portal
is a React SPA with a custom date-picker for appointment booking, a modal
for canceling appointments, and a "your results are ready" banner that
appears asynchronously without a page reload. Our QA team ran axe on every
page and says we're "98% clean," but nobody has actually tried booking an
appointment with a screen reader. We need to know what's actually broken,
how bad it is, and what to fix first before our response to counsel is due
in two weeks.
