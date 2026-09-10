# Prompt Quest

Build your app with ChatGPT—start with five simple inputs.

[Try Prompt Quest](https://prompt-quest-first-app.basanti-nashine.chatgpt.site/)

Prompt Quest helps beginners describe an app using **Goal, Input, Layout, Features, and Output**. Each step includes examples and suggestions. An optional sixth block adds supported finishing touches, such as confetti or color themes.

## What it does

- Builds a ready-to-copy ChatGPT prompt from the completed brief.
- Generates a working, self-contained HTML app from one of five templates:
  - Birthday Message Generator
  - Ping Pong Game
  - Daily Habit Tracker
  - Focus Timer
  - Decision Spinner
- Shows the generated code and a sandboxed preview; downloads the same HTML file.
- Provides idea-specific troubleshooting examples and a reset button.

**No AI service or API key is used by the generator.** The HTML apps use predefined templates and supported options. Custom descriptions beyond those options are preserved in the prompt and brief for a later ChatGPT iteration, rather than automatically implemented.

The downloaded HTML apps run locally without an account. Habit data is stored in the browser when available; storage may be unavailable inside the sandboxed preview. Builder drafts are session-only and disappear when the page is refreshed.

## Development

Requires Node.js **22.13 or newer** and npm. This repository retains the original Sites/Vinext dependencies and hosting configuration; installing packages requires access to the package registry that provides those dependencies.

```sh
npm ci
npm run dev
```

Use the local address printed by the development server.

```sh
npx tsc --noEmit
npm run build
```

The production build targets Cloudflare Workers through Vinext and the Sites plugin. It is not a GitHub Pages static-site bundle. `.openai/hosting.json` identifies the existing Sites project; publishing requires authorized access to that project. Creating a repository or pushing code does not redeploy the live site.

## Source guide

- `app/page.tsx`: five-block builder, generated results, previews, and FAQ.
- `app/globals.css`: retro visual theme.
- `lib/ideas.ts`: the five app ideas, examples, and suggested requirements.
- `lib/generation.ts`: creates matching prompt and HTML results.
- `lib/starter.ts`: routes each idea to its working HTML template.
- `lib/birthday.ts`, `lib/pong.ts`, `lib/habits.ts`, `lib/timer.ts`, `lib/spinner.ts`: downloadable apps.
- `lib/pong-engine.ts`: game physics.
- `lib/habit-store.ts`: browser storage and synchronization between tabs.
- `lib/option-intent.ts`: bounded recognition of enabled and disabled template options.

The unpublished feedback-email draft and email-delivery settings are not included. No service credentials are required for the published app templates.
