# Task for: data-labeling-operations-lead

We're labeling 150,000 customer support chat transcripts for a 12-class
intent model, and the ML team needs a first 60,000 by November 15. We have
25 contract annotators through a vendor. On the pilot of 2,000 items, raw
agreement was 81%, which the vendor calls "excellent," but 58% of the pilot
items are "billing question," and when I split out the rare classes
("cancellation intent," "legal threat," "self-harm mention"), the annotators
barely agree. The guideline is two pages with one example per class. The
transcripts contain customer names, emails, and sometimes card numbers,
which the vendor's annotators work on from home on personal laptops. The ML
lead wants to skip the guideline revision and just have three annotators
label every item and take the majority vote, and the vendor has proposed
paying per item with no session limits to speed things up. Can you give me a
plan that hits the date, tell me whether the majority-vote idea works, and
flag anything I'm missing?
