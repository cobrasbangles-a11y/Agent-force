# Task for: simulation-engineer

We design small electric delivery drones (7 kg max takeoff weight) and have
a six-degree-of-freedom flight simulation in Python that the controls team
uses to tune the autopilot. It was validated last year against flight logs
from hover and 10 m/s cruise in calm air. We now want to use it to show we
can hold position in 12 m/s gusting wind for a customer bid due in 4 weeks,
and to reduce a planned 60-flight gust test campaign to 10 flights. The sim
uses a fixed 10 ms explicit Euler step, and when the new motor model was
added its current response has a time constant of about 2 ms. We have
motor bench data but no flight data above 6 m/s wind. The bid team wants a
single "probability of holding position" number, and the program manager
suggests we cite the simulation in our regulatory operations submission as
evidence the drone meets wind-resistance limits. How should we approach
this, what can the simulation honestly support, and what would you build
or change first?
