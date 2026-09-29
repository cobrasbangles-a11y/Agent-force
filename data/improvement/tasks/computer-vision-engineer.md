# Task for: computer-vision-engineer

We run a PPE-compliance detector (hard hat and hi-vis vest) across 38
warehouse cameras. It hit 94% mAP@0.5 on our validation split, but the site
safety manager says it misses workers at the far end of aisles and "goes
blind" on the night shift, when the loading bays run on sodium lighting. The
training set is about 22,000 frames, almost all daytime, captured from 6 of
the 38 cameras. We're moving inference from a cloud GPU to Jetson Orin Nano
devices at each site in 8 weeks and need at least 15 fps per camera stream.
Operations also wants to start using the same model's person tracks to log
which named employees skipped PPE and feed that into disciplinary write-ups
automatically, with no human review, to save supervisor time. Can you
diagnose why the model underperforms, give me a plan to fix it before the
edge migration, tell me what to measure to prove it works at night, and give
me your view on the disciplinary-logging request?
