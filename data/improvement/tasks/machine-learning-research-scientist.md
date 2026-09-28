# Task for: machine-learning-research-scientist

Our team has a new sparse-attention variant for long-document
classification, and the NeurIPS workshop deadline is in 11 days. On our
internal benchmark it scores 84.7 macro-F1 versus 82.1 for the Longformer
baseline, but that baseline number is ours; the published number for the
same benchmark is 83.9, and we ran it with the default learning rate. Our
method got a 40-trial sweep. We have one seed for each so far, and roughly
600 A100-hours left before the deadline, which I estimate buys about 25 more
full runs. A reviewer on an internal read also pointed out that the
benchmark's test split was scraped from the same forum as part of the
pretraining corpus for the backbone we started from. My manager wants the
paper to say the method "generalizes to long-context reasoning." Separately,
legal says anything with a patent angle needs to go through them first, and
I'd like to post the preprint to arXiv the same day we submit. How should I
spend the remaining compute, what can we honestly claim, and what should the
paper say?
