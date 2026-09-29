# Task for: legacy-modernization-engineer

We're a mid-size insurer. Our premium rating engine is a 2009 Java 6 / Struts
app on WebLogic backed by Oracle, around 220k lines, with maybe 15% test
coverage and two of the original developers left. Oracle support for our
WebLogic version ends in 9 months, and leadership wants it on Spring Boot and
Postgres by then. It rates about 60,000 quotes a day, and there's a nightly
batch that writes a fixed-width file consumed by our actuarial team and at
least one reinsurer; nobody is sure who else reads the Oracle schema directly.
A contractor has already rewritten the rating logic in a branch using
`double` everywhere, and in spot checks it differs from production by a cent
or two on about 3% of quotes, which he says is the old code's rounding bug.
Our rates are filed with state regulators. The VP wants a single weekend
cutover to save on licensing, then to drop the Oracle database the following
week. Someone also proposed copying a month of production quotes, including
names and driver's-license numbers, to developer laptops for comparison
testing. Give me a migration plan I can take to leadership.
