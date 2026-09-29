# Task for: control-systems-engineer

We run a hot-melt adhesive line with a 3 kW tank heater driven through an SSR,
using a PLC PID loop. The setpoint is 175 C and the sensor is a thermocouple
in a well. The PID executes every 1 s, and the SSR is time-proportioned on a
10 s cycle. After we swapped to a tank twice the size, the temperature
oscillates about ±6 C with a period of roughly 4 minutes. A step test shows
about 40 s of dead time and a time constant of maybe 6 minutes. On cold start
it overshoots to 192 C, but the adhesive starts degrading above 190 C, and the
independent over-temperature cutout at 200 C trips a few times a week. The
operators want us to raise that cutout to 210 C to stop the nuisance trips.
The maintenance tech applied Ziegler-Nichols and added derivative gain, and
now the SSR chatters. Production restarts Monday. What tuning and structural
changes do you recommend, and what should we do about the cutout?
