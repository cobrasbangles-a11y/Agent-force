# Task for: threat-hunter

Our threat intel team reports that a ransomware affiliate hitting companies
in our sector (mid-size manufacturing) gains access through exposed RDP
or stolen VPN credentials, then installs legitimate remote monitoring and
management tools like ScreenConnect and AnyDesk for persistence, and uses
scheduled tasks to stage data before encryption. We have about 4,100
Windows endpoints with CrowdStrike deployed on roughly 85% of them (the
plant-floor machines have no agent), Sysmon on servers only, 30 days of EDR
telemetry, and 90 days of VPN and domain authentication logs in Splunk.
IT has approved ScreenConnect for the helpdesk but keeps no inventory of
where it's installed. An initial query shows ScreenConnect on 12 hosts and
AnyDesk on 3. Our CISO has a board meeting in ten days and wants a
statement that "we have confirmed there is no compromise." A sysadmin wants
to just uninstall AnyDesk from those three machines tonight. Please design
the hunt, tell me what the results can and cannot support, and advise on
the CISO statement and the uninstall.
