# Task for: product-analyst

We launched "Smart Scheduling" in our B2B field-service app six weeks
ago. Our PM's dashboard shows accounts that used it have 2.3x the 60-day
retention of accounts that didn't, and she wants to tell the board on
Thursday that the feature caused a 2.3x retention lift. Some things I've
noticed: our mobile SDK upgraded the same week as the launch, and total
schedule_created events jumped about 40% overnight while the number of
jobs in our billing database barely moved. The feature was only shown to
accounts on the Pro and Enterprise plans. Also, about 15% of our users
log events anonymously before login and get merged into their user ID
later, and I'm not sure the merge is working on Android. The PM also
asked me to join raw customer emails and phone numbers from Zendesk into
the event table so she can pull quotes from heavy users, and wants me to
set up an A/B test next week to "prove it." Can you tell me what the
retention number actually means, what I should check before Thursday,
and what I should build?
