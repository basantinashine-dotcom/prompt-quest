import type { Brief } from './brief';
import { appIdeas } from './ideas';
import { buildPong } from './pong';
import { buildBirthday } from './birthday';
import { buildHabits } from './habits';
import { buildTimer } from './timer';
import { buildSpinner } from './spinner';
export { escapeHtml } from './html';

export function appTitle(_idea: string, brief: Brief): string {
  return (
    appIdeas.find((option) => option.goal === brief.goal)?.title ??
    'My First App'
  );
}

export function buildStarter(_idea: string, brief: Brief): string {
  const selected = appIdeas.find((option) => option.goal === brief.goal);
  switch (selected?.id) {
    case 'birthday':
      return buildBirthday(brief);
    case 'pong':
      return buildPong(brief);
    case 'habits':
      return buildHabits(brief);
    case 'timer':
      return buildTimer(brief);
    case 'spinner':
      return buildSpinner(brief);
    default:
      throw new Error(
        'Choose one of the five app ideas before generating HTML.',
      );
  }
}

export function templateSummary(brief: Brief): string {
  const selected = appIdeas.find((option) => option.goal === brief.goal);
  switch (selected?.id) {
    case 'birthday':
      return 'Personalized birthday messages, three tones, new variations, editing, and copy.';
    case 'pong':
      return 'A playable match against the computer, keyboard and touch controls, scoring, difficulty, pause, restart, and a winner screen.';
    case 'habits':
      return 'Add and remove habits, daily check-ins, a seven-day history, and browser storage when available.';
    case 'timer':
      return 'Configurable work and break countdowns, pause and resume, reset, session counts, and optional sound.';
    case 'spinner':
      return 'An editable wheel, equal chances for every choice, repeat spins, and a winner that matches the pointer.';
    default:
      return '';
  }
}
