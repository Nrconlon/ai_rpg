# Agent Notes

- Prefer explicit exceptions over silent fallbacks. If an operation cannot proceed, raise or propagate a clear error instead of returning a placeholder result.
- If instructions are unclear, ask for clarification before implementing.
- Do not read or edit the docs folder. Do not update documentation unless explicitly asked.
- Before writing code, ascertain any potential "gotchas" that might arise from following the user's instructions (maybe something will break or something important is being missed). If there are any, list them and then stop and ask for confirmation or changes before continuing. Make any lists of gotchas or questions for me numbered so I can easily be clear which responses corresponed to which question. If an answer can be reasonably inferred from context or these instructions, assume that; don't performatively ask questions. (For instance, if I've answered "yes" to an almost identical "are you sure" question recently, assume yes; also, assume "yes" for "should I update the docs to reflect this change"). If you're less than 80% certain of my answer from context, put your best guess default in parenthesis after the question "(default: yes)" and if I don't answer it, assume I'm good with the defaults. If I just say "go" or "do it" or something, assume all the defaults are correct.
- Avoid adding "fallback" or "best effort" flows unless the user has explicitly asked for them.
- When creating a new prompt, don't specify <maxTokens/>; just allow it to use the default.
- Game object properties and global variables should generally be persisted in saves unless there's a good reason not to.
- When in doubt, fail loudly so the issue surfaces during development rather than being hidden.
- At the start of a coding session, inform the user that you have seen this file.
- Do not add clamping of any numeric values unless specifically asked.
- Use VS code's internal functions when possible.
- Always prefer updating scss files over css files. If no corresponding scss file exists, create one.
- Whenever you modify any scss file, compile the corresponding css output before finishing the task.
- Playwright run commands:
  - `npm run test:e2e:headless` (default)
  - `./playwright_scripts/run_on_existing_x_session.sh npm run test:e2e:headed` (preferred for headed runs when an existing X session is available for the same user)
  - `npm run test:e2e:headed` (when a display/X server is available)
  - `npm run test:e2e:headed:xvfb` (for headful runs in headless Linux environments with xvfb installed)
- Store testing artifacts in `./tmp`.
- Store temporary CLI config override YAML files in `./tmp`.
- Store Playwright scripts in `./playwright_scripts` (do not put them in `./tmp`).
- Don't do anything with git unless specifically asked (if it's necessary, ask permission first).
- Lint/syntax check any files you alter, if applicable.
- Be aware of things in Globals.js to avoid reinventing the wheel to get the current player, location, region, etc.
- Make sure all new prompts are logged via LLMClient.logPrompt()

