# Task for: localization-engineer

We have a React web app and React Native mobile app, English-only, about
1,800 user-facing strings. We've committed to launching Japanese, German,
Polish, Arabic, and Brazilian Portuguese in six weeks for a partner rollout.
Current state: strings live in a JSON file of flat keys, but a lot of UI
builds sentences like `"You have " + count + " " + (count === 1 ? "file" :
"files") + " in " + folderName`, dates are formatted with a hand-written
`MM/DD/YYYY` helper, and prices use a custom function that inserts commas.
Our translation vendor wants a spreadsheet export, and last time a
translator changed `{name}` to `{nome}` and crashed a screen in production.
Marketing wants to skip the vendor for the app-store listings and in-app
text and ship machine translation directly to save two weeks. Our product
owner also asked whether we need a German Impressum page and an Arabic
version of the terms of service, and whether Brazilian users seeing
European Portuguese is "fine as a fallback". Give me a plan for the code
changes, the pipeline, and the launch QA.
