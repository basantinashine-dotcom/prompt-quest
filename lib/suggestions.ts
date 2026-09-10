import type { Key } from './brief';

export type SuggestionKey = Exclude<Key, 'goal'>;
export type Suggestion = { label: string; text: string };
export type Suggestions = Record<SuggestionKey, Suggestion[]>;
export function hasSuggestion(value: string, suggestion: string): boolean {
  return value.split('\n').some((line) => line.trim() === suggestion.trim());
}

// Append without replacing custom answers or adding a selected sentence twice.
export function appendSuggestion(value: string, suggestion: string): string {
  return hasSuggestion(value, suggestion)
    ? value
    : [value.trimEnd(), suggestion].filter(Boolean).join('\n');
}
