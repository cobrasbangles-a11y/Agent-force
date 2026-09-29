# Task for: networking-protocol-engineer

We make agricultural sensors: about 50,000 devices on cellular (LTE-M and
some 2G fallback) that send 200-byte telemetry every 30 seconds and receive
occasional firmware-config commands. Today they use MQTT over TCP+TLS, and
reconnects after every cell handover are killing battery and our broker. Our
field data shows RTTs from 300ms to 4s, 3-8% loss, and devices changing IP
and port mid-session behind carrier NAT, with NAT bindings expiring in as
little as 30 seconds. We're considering designing our own UDP protocol. In a
pilot, config messages over about 1,300 bytes silently never arrived on one
carrier. Our CTO wants a lightweight home-grown XOR-plus-CRC "encryption"
because TLS is too heavy for the microcontroller, and the server team wants
the server to answer any hello packet with the full 2KB device config so
the first round trip is saved. We need a design proposal for the board
review in three weeks, including whether we should build custom at all.
