# Task for: data-loss-prevention-analyst

I run security operations at a 2,300-person insurance broker. We turned on
our email and endpoint DLP policies in block mode six weeks ago to satisfy
a client contract clause, and it has gone badly. The "PII - SSN" policy
blocked 4,812 outbound emails last month; we sampled 200 and 171 were
false positives, mostly policy numbers and claim IDs that are nine digits.
Underwriting now routes large files through a personal WeTransfer account
to get around the blocks, and the IT director wants to switch the whole
policy set off until January. Meanwhile, a regional sales manager's
removable-media alert shows 3,900 client records copied to a USB drive the
day after he was passed over for promotion, and his VP has asked me to
"quietly set up extra monitoring on him and pull his last three months of
email". The client's contract audit is in 21 days and needs evidence that
DLP is enforced on client PII. Tell me how to fix the policy set without
losing the contractual control, what to do about the USB event and the
VP's request, and what I can show the auditor.
