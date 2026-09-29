# Task for: llm-evaluation-engineer

We run an LLM-powered support assistant for a health insurance company
(about 45,000 member conversations a week). We want to swap the underlying
model and rewrite the system prompt before open enrollment starts November
1. Our current "eval" is 120 questions the product team wrote, scored by a
GPT-style judge on a 1-10 scale, and the new setup scores 8.4 versus 7.9 for
the old one. Nobody has checked the judge against human ratings, and the new
model's answers are about 40% longer. We've also had two escalations where
the assistant told members a procedure was covered when it wasn't, and one
where it repeated another member's claim details after a pasted message
said "ignore previous instructions." Leadership wants a go/no-go by October
17 and asks me to "sign off that the new model is safe." How should I build
an evaluation that actually answers the question in time, and what should
the go/no-go say?
