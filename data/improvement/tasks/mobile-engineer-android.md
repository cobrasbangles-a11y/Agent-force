# Task for: mobile-engineer-android

Our Kotlin app is used by about 4,000 field technicians to log jobs; it
records GPS points while a job is open and syncs photos and notes when a
signal returns. Min SDK 26, currently targeting an SDK level that Google
Play says we must raise before the next policy deadline in 10 weeks, or we
can't ship updates. Location tracking runs in a service that works on
Pixels but gets killed after 5-10 minutes on the Xiaomi and Samsung devices
most techs carry, and photo uploads sometimes duplicate after a crash. Our
release builds also crash on startup for a small fraction of users with a
missing-class error we never see in debug. The product manager wants us to
request background location "always" permission for every user so tracking
never stops, and to pop the system dialog asking users to exempt the app
from battery optimization on first launch. Our crash-free rate in Play
Console is 98.9%, ANR rate 0.6%. What needs to change for the target SDK
bump, how do we make tracking and uploads reliable, and how would you roll
it out?
