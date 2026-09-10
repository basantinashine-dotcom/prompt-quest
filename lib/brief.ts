export const keys = ['goal', 'input', 'layout', 'features', 'output'] as const;
export type Key = (typeof keys)[number];
export type Brief = Record<Key, string> & { extras?: string };
export const emptyBrief = (): Brief => ({
  goal: '',
  input: '',
  layout: '',
  features: '',
  output: '',
});

export const definitions: Record<
  Key,
  { title: string; question: string; hint: string }
> = {
  goal: {
    title: 'Goal',
    question: 'What problem will your app solve?',
    hint: 'Explain who the app is for and why they would use it. Focus on the experience or problem you want to help with.',
  },
  input: {
    title: 'Input',
    question: 'What will someone give your app?',
    hint: 'List the information someone gives the app. Mention the text boxes, choices, or uploads they need to get started.',
  },
  layout: {
    title: 'Layout',
    question: 'What should the app look like?',
    hint: 'Describe how the screen should look and where its main parts belong. Colors, mood, and mobile layout all help.',
  },
  features: {
    title: 'Features',
    question: 'What should people be able to do?',
    hint: 'Describe what someone can do in the app. Start with two or three actions, such as editing, previewing, or downloading.',
  },
  output: {
    title: 'Output',
    question: 'What should the app give back?',
    hint: 'Describe what someone gets at the end. Be specific about its content, format, and how they will use or share it.',
  },
};

export const isFilled = (value: string) => {
  const v = value.trim();
  return (
    v.length > 0 &&
    !/^(?:not sure|unsure|unknown|tbd|n\/?a|i don[’']?t know|not specified|\?+|\.{3}|[-–—])\.?$/i.test(
      v,
    )
  );
};

export const isBriefComplete = (brief: Brief) =>
  keys.every((key) => isFilled(brief[key]));

export const birthdayExample: Brief = {
  goal: 'Help people make a thoughtful, personalized birthday card for a friend in a few minutes, even if they are not confident writers or designers.',
  input:
    'Ask for the birthday person’s name, a favorite hobby or shared memory, and the sender’s name. Let the user choose a funny, heartfelt, or playful tone and enter their own birthday message.',
  layout:
    'Use a cheerful design with bright yellow and pink accents, playful headings, and a confetti border. Put the card details on the left and a large card preview on the right; on a phone, place the preview below the form.',
  features:
    'Let users choose from three card themes, edit the birthday message, and see their changes in the preview. Add a button to download the finished card as a PNG image.',
  output:
    'A shareable birthday card image that includes the recipient’s name, the personalized message, and the sender’s name. For example: “Happy birthday, Maya! Here’s to another year of hiking adventures. Love, Sam.”',
};

export function examplesFor(idea: string): Brief {
  const text = idea.toLowerCase();
  if (/birthday|greeting|card maker/.test(text)) return { ...birthdayExample };
  if (/interview|career|job|role/.test(text))
    return {
      goal: 'Help job seekers create an interview preparation plan for their target role.',
      input:
        'Users enter the role they are targeting and how much time they can study each day.',
      layout:
        'A simple page with a role form at the top and three weekly sections underneath.',
      features:
        'Create a plan, mark practice tasks complete, and copy the plan.',
      output:
        'A three-week preparation plan with daily tasks and role-specific practice questions.',
    };
  if (/meal|recipe|ingredient|food|cook/.test(text))
    return {
      goal: 'Help busy people decide what to cook with ingredients they already have.',
      input:
        'Users type a list of ingredients, choose dietary preferences, and enter the time they have to cook.',
      layout:
        'A cheerful green page with the ingredients form on the left and recipe cards on the right.',
      features:
        'Filter by cooking time, save favorite recipes, and copy a shopping list.',
      output:
        'Three recipe cards, each with ingredients, cooking time, and simple numbered instructions.',
    };
  if (/study|learn|quiz|flashcard|notes|school/.test(text))
    return {
      goal: 'Help students check their understanding and study a little every day.',
      input:
        'Users paste study notes and choose how many practice questions they want.',
      layout:
        'A calm blue page with a notes box at the top and one question card below it.',
      features:
        'Reveal answers, move to the next question, and restart a practice session.',
      output:
        'Five practice questions with answers and a short explanation for each one.',
    };
  if (/habit|routine|task|todo|to-do/.test(text))
    return {
      goal: 'Help people build a consistent daily routine by tracking small habits.',
      input:
        'Users enter habit names and mark each habit complete for the day.',
      layout: 'A colorful weekly grid with habits as rows and days as columns.',
      features:
        'Add and remove habits, mark a day complete, and reset the week.',
      output:
        'A weekly progress summary showing completed habits and consistency.',
    };
  return {
    goal: 'Help beginners turn a time-consuming task into a few simple steps.',
    input:
      'Users type what they need into a text box and choose a preferred format.',
    layout:
      'A clean blue page with an input form on the left and result cards on the right.',
    features:
      'Edit the input, copy a result, and clear the form to start again.',
    output: 'A short, clearly labeled result with three practical next steps.',
  };
}

export function buildPrompt(brief: Brief): string {
  return `Help me build my first app. I am a beginner, so explain things in plain language and work one step at a time.\n\nHere are the five building blocks for my app:\n\n${keys.map((key) => `${definitions[key].title.toUpperCase()}\n${isFilled(brief[key]) ? brief[key].trim() : 'Not specified yet — ask me a short question before deciding.'}`).join('\n\n')}${brief.extras?.trim() ? `\n\nOPTIONAL EXTRAS\n${brief.extras.trim()}` : ''}\n\nStart with the smallest useful version that follows these requirements. Add any optional extras after the core interactions work. Ask up to three short questions only if an essential detail is unclear. Then create a responsive, accessible HTML starter with its CSS and JavaScript in one file. Make the basic interactions work, and show me how to save and open it. Clearly label sample results. If the app needs real AI, explain the next integration step and keep service keys out of browser code. After I try it, help me improve one thing at a time.`;
}
