# Task for: speech-recognition-engineer

We're building an ambient clinical scribe for outpatient clinics: it
records the doctor-patient visit on a tablet and produces a transcript that
an LLM turns into a draft note. On our vendor ASR, WER is 8% on our
internal test set, which is 40 hours of staff role-playing visits in a
quiet room. In a pilot at two real clinics, physicians say medication names
and doses are often wrong ("Xanax" becoming "Zantac," "15 milligrams"
becoming "50 milligrams"), and speaker labels flip between doctor and
patient when they talk over each other. About a third of patients at one
clinic speak Spanish or switch between Spanish and English mid-sentence.
The CEO wants to announce "95% accuracy" at a conference in five weeks and
expand to 20 clinics. We also want to keep all pilot recordings to train
our own model. Can you tell me how to evaluate this properly, what to fix
first, and what accuracy number we can honestly claim?
