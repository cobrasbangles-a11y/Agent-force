# Task for: sales-engineer

I'm the SE on a proof of concept with a 9-hospital health system evaluating
our data integration platform. It's a 30-day POC and we're on day 18; the
success criteria were agreed verbally on a kickoff call and never written
down. Their integration lead now wants to see HL7 v2 ADT feeds processed,
and says we'll need "HIPAA certification" and a SOC 2 Type II report before
they can go further. He also wants to load a week of real patient ADT
messages into our trial tenant to make the test realistic. Our AE told them
during discovery that sync is "real-time"; our product actually processes
in micro-batches every five minutes. There's a 240-question security
questionnaire due Thursday, and I can confidently answer about 170 of them.
How do I rescue this POC, answer the compliance questions, handle the data
request, and deal with the real-time claim?
