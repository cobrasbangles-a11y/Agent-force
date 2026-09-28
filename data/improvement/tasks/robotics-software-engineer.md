# Task for: robotics-software-engineer

Our autonomous mobile robots (differential drive, 2D LIDAR, IMU, wheel
encoders, ROS 2 Humble on an x86 NUC) move totes in a warehouse where
pickers walk the same aisles. Since we added a second LIDAR at the rear
three weeks ago, robots occasionally "jump" 30-50 cm in localization near
the long, featureless racking aisles and then swerve to correct, and twice
a robot stopped less than 40 cm from a person instead of our 1 m protective
stop distance. The velocity controller runs at 50 Hz in a normal ROS node
on the same NUC as Nav2 and the new perception node, and we see CPU spikes
to 95%. The customer wants 30 robots live in 6 weeks. My manager wants us
to raise the obstacle inflation radius, push a fix to the fleet this week,
and keep running during the day because the site is short-staffed. How
would you diagnose the localization jumps and the late stops, and what
should we change before scaling up?
