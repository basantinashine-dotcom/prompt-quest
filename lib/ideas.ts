import type { Brief } from './brief';
import type { Suggestions } from './suggestions';

export type IdeaId = 'birthday' | 'pong' | 'habits' | 'timer' | 'spinner';
export type AppIdea = {
  id: IdeaId;
  title: string;
  description: string;
  goal: string;
  example: Brief;
  suggestions: Suggestions;
};
const choice = (label: string, text: string) => ({ label, text });

export const appIdeas: AppIdea[] = [
  {
    id: 'birthday',
    title: 'Birthday Message Generator',
    description:
      'Make a personal birthday message with a name, tone, and a little detail.',
    goal: 'Create a Birthday Message Generator that helps people write personalized birthday wishes using built-in message templates, without an API or account.',
    example: {
      goal: 'Create a Birthday Message Generator that helps people write personalized birthday wishes using built-in message templates, without an API or account.',
      input:
        'Ask for the recipient’s name, relationship to the sender, and one hobby or shared memory. Let users choose a funny, heartfelt, or playful tone.',
      layout:
        'Use a cheerful yellow and pink page. Put a short form on the left and a large message card on the right, stacking them on a phone.',
      features:
        'Combine the user’s details with built-in message templates. Let users try another variation, edit the message, and copy it.',
      output:
        'A ready-to-copy birthday wish under 60 words that includes the recipient’s name and personal detail. For example: “Happy birthday, Maya! Here’s to another year of hiking adventures.”',
    },
    suggestions: {
      input: [
        choice('Recipient’s name', 'Ask for the birthday person’s name.'),
        choice(
          'Relationship',
          'Ask whether the recipient is a friend, family member, or colleague.',
        ),
        choice('Tone', 'Offer funny, heartfelt, and playful tones.'),
        choice(
          'Personal detail',
          'Ask for one hobby or shared memory to include in the message.',
        ),
      ],
      layout: [
        choice(
          'Form + message card',
          'Place a short form next to a large message card, stacking them on phones.',
        ),
        choice(
          'Celebration colors',
          'Use bright yellow and pink accents with playful headings.',
        ),
      ],
      features: [
        choice(
          'Built-in templates',
          'Generate wishes by combining built-in message templates with the user’s details; no AI service is needed.',
        ),
        choice(
          'Try another',
          'Let users generate a different variation using the same details.',
        ),
        choice(
          'Edit + copy',
          'Let users edit the message and copy it with one button.',
        ),
      ],
      output: [
        choice(
          'Personalized wish',
          'Show a birthday wish with the recipient’s name, selected tone, and personal detail.',
        ),
        choice(
          'Short and shareable',
          'Keep each message under 60 words so it is easy to send in a chat.',
        ),
      ],
    },
  },
  {
    id: 'pong',
    title: 'Ping Pong Game',
    description:
      'Play against the computer in a simple arcade game and keep score.',
    goal: 'Create a Ping Pong Game where one player competes against a computer-controlled paddle, entirely in the browser.',
    example: {
      goal: 'Create a Ping Pong Game where one player competes against a computer-controlled paddle, entirely in the browser.',
      input:
        'Let the player move their paddle with the up and down arrow keys, or drag it on a touchscreen. Include a Start button and an easy or normal difficulty choice.',
      layout:
        'Use a dark arcade court with two bright paddles and a dotted center line. Show both scores above the court and the controls underneath.',
      features:
        'Make the ball bounce off paddles and the court edges. Move the computer paddle automatically, award points, and add pause and restart controls.',
      output:
        'A playable match with a live score. The first side to reach five points wins; show a winner message and a Play again button.',
    },
    suggestions: {
      input: [
        choice(
          'Arrow-key controls',
          'Use the up and down arrow keys to move the player’s paddle.',
        ),
        choice(
          'Touch controls',
          'Allow the player to drag their paddle on a phone.',
        ),
        choice(
          'Difficulty',
          'Offer easy and normal computer difficulty settings.',
        ),
      ],
      layout: [
        choice(
          'Arcade court',
          'Use a dark court with bright paddles, a visible ball, and a dotted center line.',
        ),
        choice(
          'Score above court',
          'Display the player and computer scores above the game, with controls below.',
        ),
      ],
      features: [
        choice(
          'Computer opponent',
          'Move the opponent’s paddle automatically with a limited speed so the game is beatable.',
        ),
        choice(
          'Ball collisions',
          'Bounce the ball off paddles and the top and bottom court edges.',
        ),
        choice('Pause + restart', 'Add pause, resume, and restart controls.'),
      ],
      output: [
        choice('Live score', 'Show the score after each point.'),
        choice(
          'First to five',
          'End the match when a side reaches five points and show the winner with a Play again button.',
        ),
      ],
    },
  },
  {
    id: 'habits',
    title: 'Daily Habit Tracker',
    description: 'Add small daily habits and check them off as you go.',
    goal: 'Create a Daily Habit Tracker that helps people build a routine by recording daily completions, with progress saved in this browser.',
    example: {
      goal: 'Create a Daily Habit Tracker that helps people build a routine by recording daily completions, with progress saved in this browser.',
      input:
        'Let users enter habit names, such as “Read for 10 minutes” or “Take a walk,” and check off each habit for the current day.',
      layout:
        'Use a clean green page with an Add habit field at the top, a checklist below, and a weekly progress grid at the bottom.',
      features:
        'Add and remove habits, mark today complete or incomplete, and save entries and dated completions in browser storage so they survive a refresh.',
      output:
        'A daily completion count and a seven-day grid showing completed habits. Clearly state that progress is stored only in this browser.',
    },
    suggestions: {
      input: [
        choice(
          'Habit names',
          'Let users type habit names such as reading or taking a walk.',
        ),
        choice(
          'Daily check-ins',
          'Let users mark each habit complete or incomplete for today.',
        ),
      ],
      layout: [
        choice(
          'Simple checklist',
          'Place an Add habit field above a list of habits with large checkboxes.',
        ),
        choice(
          'Weekly grid',
          'Show habits as rows and the last seven dates as columns in a weekly grid.',
        ),
      ],
      features: [
        choice('Add + remove habits', 'Allow users to add and remove habits.'),
        choice(
          'Save in this browser',
          'Store habits and dated completions in local browser storage, and restore them after a refresh.',
        ),
        choice(
          'Undo a check-in',
          'Let users uncheck a habit if they marked it complete by mistake.',
        ),
      ],
      output: [
        choice(
          'Daily progress',
          'Show how many habits are complete today out of the total.',
        ),
        choice(
          'Weekly history',
          'Show completion history for the last seven days, with the dates clearly labeled.',
        ),
      ],
    },
  },
  {
    id: 'timer',
    title: 'Focus Timer',
    description:
      'Set work and break durations, then follow a simple countdown.',
    goal: 'Create a Focus Timer that helps people alternate focused work and breaks with an in-page countdown and an alert, without accounts or external services.',
    example: {
      goal: 'Create a Focus Timer that helps people alternate focused work and breaks with an in-page countdown and an alert, without accounts or external services.',
      input:
        'Let users enter work and break durations in minutes, starting with 25 minutes of work and a 5-minute break. Include Start, Pause, and Reset buttons.',
      layout:
        'Put a large countdown in the center of a calm blue page. Show the current session type above it, controls below, and duration settings at the bottom.',
      features:
        'Start, pause, and reset the countdown. Switch to the next session when time is up, show an on-page alert, and optionally play a short sound.',
      output:
        'A minutes-and-seconds countdown, a clear Work or Break label, and the number of completed work sessions. Show “Time for a break!” when work ends.',
    },
    suggestions: {
      input: [
        choice(
          'Work duration',
          'Let users set their work duration in minutes, defaulting to 25.',
        ),
        choice(
          'Break duration',
          'Let users set their break duration in minutes, defaulting to 5.',
        ),
        choice(
          'Sound preference',
          'Let users turn the end-of-session sound on or off.',
        ),
      ],
      layout: [
        choice(
          'Large countdown',
          'Center a large minutes-and-seconds countdown with the session label above it.',
        ),
        choice(
          'Calm blue theme',
          'Use a calm blue page with clear Start, Pause, and Reset controls below the timer.',
        ),
      ],
      features: [
        choice(
          'Start, pause, reset',
          'Support starting, pausing, resuming, and resetting the current countdown.',
        ),
        choice(
          'Session alert',
          'Show an on-page alert and optionally play a short sound when time is up.',
        ),
        choice(
          'Work + break cycles',
          'Switch between work and break sessions and count completed work sessions.',
        ),
      ],
      output: [
        choice(
          'Time remaining',
          'Show the remaining time as minutes and seconds with a Work or Break label.',
        ),
        choice(
          'Session count',
          'Display the number of completed work sessions.',
        ),
        choice(
          'End-of-session message',
          'Show a clear message when a session finishes, such as “Time for a break!”',
        ),
      ],
    },
  },
  {
    id: 'spinner',
    title: 'Decision Spinner',
    description: 'Enter choices and spin a wheel to help you pick one.',
    goal: 'Create a Decision Spinner that randomly picks from the user’s own choices using a colorful wheel, entirely in the browser.',
    example: {
      goal: 'Create a Decision Spinner that randomly picks from the user’s own choices using a colorful wheel, entirely in the browser.',
      input:
        'Let users enter at least two choices, one per line, such as movie titles or weekend activities. Add a Spin button.',
      layout:
        'Place the choices box on the left and a colorful segmented wheel with a fixed pointer on the right. On phones, put the wheel below the choices.',
      features:
        'Create equal wheel segments for the entered choices, animate a spin, and land on the selected result. Let users edit their choices and spin again.',
      output:
        'Display the winning choice prominently below the wheel. The winner label must match the segment under the pointer when the wheel stops.',
    },
    suggestions: {
      input: [
        choice(
          'A list of choices',
          'Accept at least two choices, entered one per line.',
        ),
        choice(
          'Editable options',
          'Let users add, remove, and rename choices before spinning.',
        ),
      ],
      layout: [
        choice(
          'Colorful wheel',
          'Draw a colorful wheel with an equal segment for each choice and a fixed pointer.',
        ),
        choice(
          'Choices beside wheel',
          'Place the editable choices beside the wheel on desktop and above it on phones.',
        ),
      ],
      features: [
        choice(
          'Random selection',
          'Give every entered choice an equal chance of being selected.',
        ),
        choice(
          'Spin animation',
          'Animate the wheel and stop with the winning segment under the pointer.',
        ),
        choice(
          'Spin again',
          'Allow another spin after the current animation finishes.',
        ),
      ],
      output: [
        choice(
          'Show the winner',
          'Display the winning choice prominently below the wheel.',
        ),
        choice(
          'Matching result',
          'Ensure the displayed winner matches the segment indicated by the pointer.',
        ),
      ],
    },
  },
];

export function getIdea(id: unknown): AppIdea | undefined {
  return appIdeas.find((idea) => idea.id === id);
}

export function createIdeaBrief(id: unknown): Brief | undefined {
  const idea = getIdea(id);
  return idea
    ? { goal: idea.goal, input: '', layout: '', features: '', output: '' }
    : undefined;
}
