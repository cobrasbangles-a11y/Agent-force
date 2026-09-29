# Task for: security-policy-analyst

We're a 900-person industrial equipment manufacturer with plants in Ohio
and Poland and a new EU customer contract that requires a documented
"authentication and access control policy" within 45 days. Our current
password policy, written in 2014, requires 8-character passwords rotated
every 60 days, which nobody on the plant floor follows because shared
logins on the machine HMIs can't be changed without the OEM. Our general
counsel wants the new policy to "state that we are fully compliant with
GDPR and NIS2" so the customer is satisfied. The CISO wants MFA "on
everything by the effective date," but about 60 HMIs and a legacy ERP
cannot support MFA, and the ERP replacement is 18 months out. There's also
a separate remote-access policy from 2019 that says vendors may connect via
TeamViewer with IT approval, which contradicts the CISO's new rule that all
remote access goes through the VPN. Please draft the policy structure,
the key requirement language for passwords, MFA, shared accounts, and
remote access, and tell me what you'd push back on.
