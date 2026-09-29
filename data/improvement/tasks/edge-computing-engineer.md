# Task for: edge-computing-engineer

We run shelf-monitoring inference at 2,300 grocery stores. Each store has a
small x86 box running k3s with two containers: a camera inference service
and a sync agent that ships out-of-stock events to our cloud. Stores are on
broadband with an LTE failover whose plan is capped at 5 GB per month per
store; overages are billed per GB. Our last OS and agent update bricked
the network config on 40 stores and needed truck rolls at about $450 each.
We now need to ship a new OS base, a new model that's 1.8 GB, and a sync
agent change, ideally within six weeks. The data science team also wants
every store to upload raw camera footage nightly so they can retrain the
model; the cameras see shoppers' faces. During backhaul outages today the
sync agent just drops events. Lay out how you'd roll this out, what the
update mechanism should look like, and what you'd say to the data science
request.
