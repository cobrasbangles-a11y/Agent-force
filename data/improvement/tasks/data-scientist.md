# Task for: data-scientist

I run retention at a subscription meal-kit company (about 410,000 active
subscribers, monthly churn around 6.8%). Our last churn model, built by a
contractor, reported an AUC of 0.94, and the retention team has been sending
a $25 credit to the top 10% of scored customers every month since March.
Churn hasn't moved and we've spent roughly $1.2M on credits. I looked at the
feature list and the top feature is "days_since_last_skip_or_cancel_page_view,"
and the training set was a random 80/20 split across two years of data. I
need a rebuilt model and a recommendation to our CFO by October 20 on whether
the credit program should continue. Two other things: our CFO wants me to
just report "the model is 94% accurate" in the deck, and the ops lead
suggested we add zip code and age as features because "older customers in
rural areas churn more" and the credit budget would go further if we skipped
them. Can you tell me what went wrong, how you'd rebuild it, and how to
decide whether the credit itself is doing anything?
