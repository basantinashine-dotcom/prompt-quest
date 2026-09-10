import { buildPrompt, isBriefComplete, type Brief } from './brief';
import { appTitle, buildStarter, templateSummary } from './starter';

export function generateOutputs(brief: Brief, revision: number) {
  if (!isBriefComplete(brief))
    throw new Error('Complete all five blocks first.');
  const snapshot = { ...brief };
  return {
    revision,
    brief: snapshot,
    prompt: buildPrompt(snapshot),
    html: buildStarter(snapshot.goal, snapshot),
    included: templateSummary(snapshot),
    filename:
      (appTitle(snapshot.goal, snapshot)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') || 'my-first-app') + '.html',
  };
}

export type GeneratedOutputs = ReturnType<typeof generateOutputs>;
