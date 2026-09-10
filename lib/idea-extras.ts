import type { IdeaId } from './ideas';
import type { Suggestion } from './suggestions';

type IdeaExtras = {
  suggestions: Suggestion[];
  faq: { bug: string; prompt: string; iterate: string };
};
const extra = (label: string, text: string): Suggestion => ({ label, text });

export const ideaExtras: Record<IdeaId, IdeaExtras> = {
  birthday: {
    suggestions: [
      extra(
        'Birthday confetti',
        'Show a short confetti celebration when a birthday message is generated, respecting reduced-motion preferences.',
      ),
      extra(
        'Colorful message cards',
        'Let users choose a background color for the message card.',
      ),
      extra(
        'Copy celebration',
        'Show a cheerful “Ready to send!” message after the birthday wish is copied.',
      ),
    ],
    faq: {
      bug: 'I enter Maya as the recipient, select Heartfelt, and click Generate message. I expect a birthday wish with Maya’s name, but the message stays blank. Here is my latest code: [paste code]. Please fix the cause and give me steps to check that it works.',
      prompt:
        'Make a heartfelt birthday wish for my friend Maya, who loves hiking. Keep it under 40 words, include one hiking reference, and display it on a bright yellow message card with a pink border.',
      iterate:
        'The birthday messages work. Next, add a Try another button that picks a different built-in message template while keeping the name, tone, and personal detail. Keep Copy working. Explain what changed and how to test it.',
    },
  },
  pong: {
    suggestions: [
      extra(
        'Victory confetti',
        'Show a short confetti celebration when the player wins, respecting reduced-motion preferences.',
      ),
      extra(
        'Paddle glow',
        'Add a subtle colored glow around the paddles and ball.',
      ),
      extra(
        'Optional arcade sounds',
        'Add short sounds for paddle hits and scoring, with a mute control.',
      ),
    ],
    faq: {
      bug: 'I start a match and press the up arrow. I expect my paddle to move up, but the page scrolls and the paddle stays still. Here is my latest code: [paste code]. Please fix the controls and tell me how to test keyboard and touch input.',
      prompt:
        'Style the Ping Pong Game like a neon arcade. Use a dark navy court, a cyan player paddle, a pink computer paddle, and a white ball. Keep both scores above the court and put Pause and Restart underneath.',
      iterate:
        'The game works. Next, add an Easy difficulty that limits the computer paddle’s speed so a beginner can win. Keep the current Normal setting. Explain the change and how to test both difficulty levels.',
    },
  },
  habits: {
    suggestions: [
      extra(
        'Confetti on completion',
        'Show a brief confetti burst when a habit is checked complete. Do not celebrate when it is unchecked, and respect reduced-motion preferences.',
      ),
      extra(
        'All-done celebration',
        'Show a cheerful “You did it!” banner when every habit for today is complete.',
      ),
      extra(
        'Habit colors',
        'Let users pick a color for each habit to make their weekly grid easier to scan.',
      ),
    ],
    faq: {
      bug: 'I add “Read for 10 minutes,” mark it complete, and refresh the page. I expect the habit and today’s check-in to stay, but they disappear. Here is my latest code: [paste code]. Please fix the browser storage and give me a test that includes refreshing.',
      prompt:
        'Make the habit tracker cheerful and easy to scan. Use green accents, large checkboxes, and a seven-day grid with dates as columns. Show “3 of 5 habits complete” above the list and a small confetti burst when I check a habit.',
      iterate:
        'Adding and checking habits works. Next, let me rename a habit while preserving its completion history. Explain what changed and give me steps to verify the renamed habit after a refresh.',
    },
  },
  timer: {
    suggestions: [
      extra(
        'Session celebration',
        'Show a gentle celebration when a work session finishes, with a static message for reduced-motion users.',
      ),
      extra(
        'Progress ring',
        'Add a circular progress indicator around the countdown that decreases as time passes.',
      ),
      extra(
        'Theme switcher',
        'Offer light and dark color themes while keeping the countdown easy to read.',
      ),
    ],
    faq: {
      bug: 'I set a one-minute work session, start it, and click Pause after ten seconds. I expect the remaining time to stop changing, but it keeps counting down. Here is my latest code: [paste code]. Please fix pause and resume and explain how to test them.',
      prompt:
        'Use a calm blue theme with a large countdown in the center. Put the Work or Break label above it, Start, Pause, and Reset below it, and the work and break duration settings at the bottom. Keep the text readable on a phone.',
      iterate:
        'The countdown works. Next, add a sound toggle so I can mute the end-of-session alert. Always keep the on-page completion message visible. Explain the change and how to test a session with sound on and off.',
    },
  },
  spinner: {
    suggestions: [
      extra(
        'Winner confetti',
        'Show a short confetti burst when the wheel stops on a winner, respecting reduced-motion preferences.',
      ),
      extra(
        'Wheel color themes',
        'Offer a few color palettes for the wheel while keeping each choice label readable.',
      ),
      extra(
        'Recent winners',
        'Display the last five winning choices below the wheel for this session.',
      ),
    ],
    faq: {
      bug: 'I enter Movie, Walk, and Board game, then click Spin. The pointer stops on Walk, but the winner label says Movie. Here is my latest code: [paste code]. Please make the displayed winner match the segment under the pointer and explain how to test repeated spins.',
      prompt:
        'Create a colorful wheel with an equal segment for each choice and a fixed pointer at the top. Put the choices box on the left and a large Spin button below the wheel. Show the winning choice in bold text after the wheel stops.',
      iterate:
        'Spinning and showing the winner works. Next, show the last five winners below the wheel. Keep all entered choices equally likely on every spin. Explain what changed and how I can test the history list.',
    },
  },
};
