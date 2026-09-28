# Task for: prompt-engineer

We use an LLM to draft replies to customer emails for a consumer bank's
support team (credit cards and savings accounts). Agents review the draft
before sending. Our current prompt is 2,400 words that have grown over a
year, with rules like "NEVER promise a refund" in capital letters in three
places. Last month a draft told a customer their late fee "will be
waived," and the agent sent it. Our eval is 25 emails a PM picked and we
check them by eye. We're also switching to a newer model next month, and on
a quick test the new model follows the output JSON schema (intent, draft,
escalate flag) only about 94% of the time, which breaks our routing. Legal
wants the drafts to include the correct APR disclosure when rates come up,
and the product team wants the prompt to "sound more empathetic." Can you
rewrite the prompt, tell me how to test it properly before the model
switch, and fix the JSON problem? And can you just add the current APR
numbers into the prompt so it always quotes them?
