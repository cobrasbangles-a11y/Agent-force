# Task for: configuration-management-engineer

We manage about 1,800 hosts with Ansible, a mix of RHEL 8 and RHEL 9, and
our auditors need SSH hardened before our SOC 2 fieldwork starts in 16
days: password authentication disabled, root login disabled, and only
approved ciphers and MACs. Our current site playbook runs against the whole
inventory at once with no serial setting. We know some hosts don't have
keys deployed for every admin, and there's a set of about 40 hosts where
someone hand-edited sshd_config during an outage in the spring and we don't
know what they changed. We also just noticed the ansible-vault password
file has been committed in the repo for about a year. On top of that, the
database team owns roughly 200 of these hosts and my director says to "just
include them, they'll be fine." Last time we tried a cipher change on RHEL 9
it seemed to have no effect at all. How should we roll this out, and what
do we need to deal with first?
