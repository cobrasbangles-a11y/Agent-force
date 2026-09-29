# Task for: linux-systems-administrator

Since last Tuesday's kernel update, our primary PostgreSQL host (RHEL 9,
64 cores, 512 GB RAM, NVMe RAID10) has shown load averages around 60
during business hours, even though `top` shows CPU only about 35% busy
with `wa` near 40%. Twice this week the OOM killer took out a postgres
backend. A colleague found a blog post and wants to push
`vm.swappiness=0`, `vm.overcommit_memory=2` and `vm.dirty_ratio=80` to all
300 hosts with Ansible on Friday. Separately, a new monitoring agent
fails to start on boot but runs fine by hand, and the vendor's
instructions say to set SELinux to disabled. A developer also wants root
on the database host to "look around" while we debug. Tell me how to
find what's actually wrong on the database host, what you think of the
sysctl plan, how to deal with the agent and SELinux, and how to handle
the root request.
