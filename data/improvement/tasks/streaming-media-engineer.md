# Task for: streaming-media-engineer

We stream live college sports (about 400 events a season, peaks of 120K
concurrent viewers) and host the replays as VOD. Our ladder is a fixed
six-rendition H.264 ladder from 1080p at 8 Mbps down to 360p at 800 kbps
with 6-second HLS segments, and end-to-end latency is about 35 seconds.
Viewers watching on phones complain that the betting-partner app's score
alerts arrive 30 seconds before the play, and our rebuffer ratio on mobile
networks is 2.9% versus 0.6% on broadband. We're adding Android TV and a
web player that needs DASH with Widevine, while iOS stays on FairPlay. CDN
bills are up 40% year over year. Season starts in 8 weeks. The sports
director wants latency under 5 seconds for every viewer, and our sales team
asked whether we can turn off geo-blocking for the regional conference
games "since the rights situation is murky." What changes would you make
and in what order?
