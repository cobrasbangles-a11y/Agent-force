# Task for: nlp-engineer

We process about 30,000 insurance claim documents a week (adjuster notes,
scanned repair estimates, medical bills) and need to extract claim number,
date of loss, injury type, and total billed amount, and classify each
document into one of 14 types. A vendor LLM prompt gets 91% field-level
accuracy on a 200-document test set our intern built, but costs $0.06 a
document and takes 4 seconds, and we need results inside a 1-second budget
for the triage queue. We have 8,000 documents labeled by three different
contractors with no written guidelines; two of them label "whiplash" as an
injury type and one labels it as a symptom. About 18% of documents are in
Spanish, and the scanned estimates have the billed total in a table that
our PDF-to-text step flattens. Leadership wants to go live in six weeks and
wants us to also auto-deny claims when the extracted injury doesn't match
the policy coverage. What approach would you take, how do we know it's
actually working, and what should we fix first?
