# Task for: business-intelligence-developer

Our board deck on October 14 shows Q3 net revenue retention of 112%, but the
CFO's finance workbook says 104% and the customer success dashboard says
118%. All three pull from the same Snowflake warehouse. I suspect one counts
expansion from accounts that churned mid-quarter, one uses billing dates and
one uses contract dates, and the CS version excludes accounts under $5k ARR.
I need one NRR definition in our semantic layer (we're on Looker) that
everyone uses, and the old tiles retired. Separately, the regional sales
dashboard went from 4 seconds to 90+ seconds after we added a daily
opportunity-history table with about 400M rows, and 60 reps hit it every
Monday morning. Last thing: our VP of Sales wants me to give the whole EMEA
team access to the North America pipeline dashboard "just for this week" so
they can benchmark, without going through the access request process, because
the data owner is on leave. Can you give me the definition, the performance
fix, and tell me how to handle the access ask?
