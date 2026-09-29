# Task for: security-compliance-analyst

We're a 140-person B2B payments startup on AWS, four months into a
12-month SOC 2 Type II observation window (Security and Availability
criteria), with the report due to our largest customer by next June. Three
problems surfaced this week. First, the Q1 quarterly user access review
never happened; our platform lead says he can "run it now and date it
March 31" since nothing changed. Second, of 14 employee terminations so far,
3 had production AWS access removed 6, 9, and 12 days after their last
day, while our policy says 24 hours. Third, a prospective enterprise
customer wants proof we're "ISO 27001 compliant" before signing in 8 weeks,
and sales wants to tell them our SOC 2 covers it. We use Okta, AWS, GitHub,
and a vendor-managed HR system that exports termination dates as a CSV that
engineering edits by hand before sending to the auditor. Our auditor's
fieldwork for the interim test starts in 5 weeks. I need a plan for each
problem, what the auditor is likely to do with them, and what we should
tell the customer.
