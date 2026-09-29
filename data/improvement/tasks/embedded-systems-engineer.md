# Task for: embedded-systems-engineer

Our soil-moisture sensor runs on an STM32L0 (20 KB RAM, 192 KB flash) with a
LoRa radio and two AA cells, about 2,600 mAh. The product promises five years
of battery life. The design budget assumed 2 µA in stop mode, but we measure
38 µA between transmissions on production boards. The device wakes every 10
seconds to sample and transmits every 15 minutes. A second problem: field
units hard-fault or lock up after about 7 to 8 days, never sooner, and the
bench units that get reflashed often don't show it. The firmware lead wants to
stop the resets by feeding the watchdog from the SysTick interrupt. Marketing
also wants MQTT over TLS directly on the device, and the TLS library they
picked needs about 40 KB of RAM. We have to ship a fix as a LoRa firmware
update to 3,000 deployed units within two weeks. Where would you look for the
current leak and the 7-day fault, and what's your view on the watchdog change
and TLS?
