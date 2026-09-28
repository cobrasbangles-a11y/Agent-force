# Task for: model-risk-analyst

I'm on the model risk team at a US consumer lender. The data science team
wants to launch a gradient-boosted credit underwriting model for personal
loans (up to $40K) in six weeks, replacing a logistic scorecard. Their
validation package shows AUC 0.79 vs 0.72 for the scorecard, computed on a
random 20% split of 2021-2023 applications, but only for applicants who
were approved and booked under the old scorecard. It includes 340 features,
among them "device type," "time of day of application," and "email domain."
They've attached SHAP plots and plan to use the top four SHAP features as
adverse action reasons. The business owner wants my sign-off by Friday and
says fair lending testing can happen after launch since they "don't use
race." We don't collect race, so we'd have to estimate it. Can you tell me
what to test, what's missing from their package, and whether this can
launch on time? And can you write the approval memo so I can sign it?
