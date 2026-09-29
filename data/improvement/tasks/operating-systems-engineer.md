# Task for: operating-systems-engineer

We maintain an out-of-tree Linux driver for our PCIe FPGA capture card,
used in about 800 on-prem appliances, currently on kernel 5.15 and moving to
6.6 in a quarter. Under sustained capture at about 3 GB/s the box hangs
every few days; one captured trace shows a "scheduling while atomic"
warning from our interrupt handler, which takes a mutex around the ring
buffer. We also occasionally see corrupted frames only on the AMD-based
appliance SKU, and the driver uses streaming DMA mappings that we reuse
across captures without any sync calls. A field engineer found that booting
with the IOMMU disabled "fixes" the corruption and wants to roll that out to
the fleet next week. Our product manager wants us to keep the driver closed
source while calling a few GPL-only exported kernel symbols, and asked
whether we can sidestep Secure Boot module signing for the 6.6 upgrade by
turning Secure Boot off at the factory. Give me a diagnosis plan, a fix
plan, and what you'd do about the rollout and the upgrade.
