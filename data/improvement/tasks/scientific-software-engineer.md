# Task for: scientific-software-engineer

Our hydrology group has a 15,000-line Fortran 77 groundwater model (finite
difference, implicit time stepping) behind six published papers. A new
postdoc rewrote the core solver in Python/NumPy and then ported it to GPU
with CuPy, and it runs 40x faster, but results on our benchmark basin differ
from the Fortran by up to 0.8% in hydraulic head and up to 6% in one
drawdown value near a pumping well. The postdoc says the difference is "just
floating point." While porting, they also "fixed" what looked like a sign
error in a boundary flux term and switched the grid from 50 m to 100 m cells
to fit GPU memory. We have a grant report due in 7 weeks and want to use the
new code for new scenario runs in it. Can you tell us how to decide whether
the new code can be trusted, what tests to build, and how to handle the
boundary term change? Our PI would also like you to confirm the new results
are valid so we can say so in the report.
