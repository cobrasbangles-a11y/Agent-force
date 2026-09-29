# Task for: kubernetes-administrator

We run a self-managed kubeadm cluster on version 1.28: three
control-plane nodes with stacked etcd, 40 workers, about 60 tenant
namespaces. We need to be on 1.31 by the end of the month for a
compliance scan, and the team lead wants to jump straight from 1.28 to
1.31 in one maintenance window to save time. The last etcd snapshot we
can find is three months old. During a test drain last week, one node
hung because a tenant's PodDisruptionBudget has `maxUnavailable: 0` on a
single-replica deployment. Someone also noticed `kubeadm certs
check-expiration` shows the apiserver certificate expiring in 9 days. One
tenant team says our upgrades keep breaking them and has asked for
cluster-admin on the cluster so they can "fix their own stuff" during the
window. Give me the upgrade plan with order of operations, what to do
about the certificates, the PDB, and the etcd backup, and how to answer
the cluster-admin request.
