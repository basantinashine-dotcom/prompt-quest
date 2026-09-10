// Recognize explicit on/off requests for supported template options.
// This is deliberately bounded keyword handling, not arbitrary prompt parsing.
export function optionEnabled(text: string, feature: RegExp): boolean {
  let enabled = false;
  const clauses = text
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .split(/[.!?;\n]|\b(?:but|however|instead)\b/);
  for (const clause of clauses) {
    const matches = Array.from(
      clause.matchAll(new RegExp(feature.source, 'g')),
    );
    for (const match of matches) {
      const before = clause.slice(0, match.index);
      const after = clause.slice((match.index ?? 0) + match[0].length);
      let negative = false;
      const intents = before.matchAll(
        /\b(?:do\s+not|don't|never|no|not|without|avoid|disable|remove|exclude|add|enable|show|use|include|allow)\b/g,
      );
      for (const intent of intents) {
        if (
          /^(?:do\s+not|don't|never|no|not|without|avoid|disable|remove|exclude)$/.test(
            intent[0],
          )
        )
          negative = true;
        else if (
          !negative ||
          /(?:,|\band|\bthen)\s*$/.test(before.slice(0, intent.index))
        )
          negative = false;
      }
      // Also accept “confetti off” or “dark mode is not wanted”.
      const negativeAfter =
        /^\s*(?:(?:mode|theme|effects?|sounds?)\s+)?(?:(?:is|are|should be|must be)\s+)?(?:off|disabled|not\s+(?:needed|wanted|enabled|allowed))\b/.test(
          after,
        );
      enabled = !negative && !negativeAfter;
    }
  }
  return enabled;
}
