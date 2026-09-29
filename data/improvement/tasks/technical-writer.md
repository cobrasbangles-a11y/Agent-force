# Task for: technical-writer

I'm the only docs person at a 40-person SaaS company that makes a
self-hosted backup appliance. Version 5.0 ships in two weeks and changes the
restore workflow: the old "Restore" button is gone, replaced by a three-stage
wizard, and restoring over an existing volume now overwrites it without the
old confirmation prompt unless an admin enables "safe restore" in settings.
Engineering gave me a Figma file and a Jira epic but no test build yet. Our
current restore guide is one 3,000-word page mixing theory, CLI and GUI steps,
and a troubleshooting section. Support says the top ticket is customers
restoring to the wrong volume. Product wants the new guide to say "restores
are fully reversible" and "meets HIPAA requirements," and wants the old v4
guide deleted on launch day even though about 35% of customers are still on
v4. Help me plan and write the new restore documentation.
