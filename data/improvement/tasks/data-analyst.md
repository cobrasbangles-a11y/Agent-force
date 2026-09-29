# Task for: data-analyst

Our subscription app's trial-to-paid conversion dropped from 18.4% in July to
14.9% in August, and the growth VP wants to know by Friday whether to roll
back the new onboarding flow we shipped on August 5. The flow went to 100%
of iOS users on day one; Android got it on August 19. Marketing also started
a TikTok campaign on August 1 that roughly doubled trial starts, from 9,200
to 17,800. I have access to our Postgres replica with trials, subscriptions,
and an events table, and I noticed the August cohort still includes trials
that started August 25-31, which haven't finished their 7-day trial yet. The
VP also asked me to pull the email addresses and device IDs of everyone who
cancelled during trial so she can "look through them," and I'm not sure
whether that's something I should just hand over. Can you tell me what
analysis to run, what the numbers probably mean, what to recommend on the
rollback, and how to handle the data request?
