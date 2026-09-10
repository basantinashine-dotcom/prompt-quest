'use client';
import Image from 'next/image';

import { useEffect, useRef, useState, type SyntheticEvent } from 'react';
import {
  ArrowRight,
  Check,
  Code2,
  Copy,
  Download,
  ExternalLink,
  Eye,
  Flag,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { appIdeas, getIdea, createIdeaBrief, type IdeaId } from '@/lib/ideas';
import { ideaExtras } from '@/lib/idea-extras';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import {
  definitions,
  emptyBrief,
  isFilled,
  isBriefComplete,
  keys,
  type Brief,
} from '@/lib/brief';
import { generateOutputs, type GeneratedOutputs } from '@/lib/generation';
import {
  appendSuggestion,
  hasSuggestion,
  type SuggestionKey,
} from '@/lib/suggestions';

export default function Home() {
  const [brief, setBrief] = useState<Brief>(emptyBrief);
  const [selectedId, setSelectedId] = useState<IdeaId | ''>('');
  const drafts = useRef<Partial<Record<IdeaId, Brief>>>({});
  const selectedIdea = getIdea(selectedId);
  const extras = selectedIdea ? ideaExtras[selectedIdea.id] : undefined;
  const [celebration, setCelebration] = useState(0);
  useEffect(() => {
    if (!celebration) return;
    const timer = setTimeout(() => setCelebration(0), 4800);
    return () => clearTimeout(timer);
  }, [celebration]);
  const [result, setResult] = useState<GeneratedOutputs | null>(null);
  const [feedback, setFeedback] = useState('');
  const [copied, setCopied] = useState('');
  const [submittedGoal, setSubmittedGoal] = useState('');
  const inputSuggestionsRef = useRef<HTMLElement>(null);
  const promptRef = useRef<HTMLElement>(null);
  const builderRef = useRef<HTMLFormElement>(null);
  const count = keys.filter((k) => isFilled(brief[k])).length;
  const complete =
    !!selectedIdea &&
    brief.goal === selectedIdea.goal &&
    isBriefComplete(brief);
  const ready = result !== null;
  const pendingChanges =
    ready && JSON.stringify(result.brief) !== JSON.stringify(brief);
  const missing = keys.filter((k) => !isFilled(brief[k]));
  const examples = selectedIdea?.example;
  const suggestions = selectedIdea?.suggestions;
  const suggestionsCurrent =
    !!selectedIdea && submittedGoal === selectedIdea.id;
  const prompt = result?.prompt ?? '';
  const html = result?.html ?? '';

  function generate(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!complete) return;
    setResult(generateOutputs(brief, (result?.revision ?? 0) + 1));
    setCelebration((previous) => previous + 1);
    setCopied('');
    setFeedback(
      'Your prompt, HTML code, and preview have been refreshed with your latest blocks.',
    );
    requestAnimationFrame(() => {
      promptRef.current?.scrollIntoView({ block: 'start' });
      promptRef.current?.focus({ preventScroll: true });
    });
  }
  function changeBlock(key: SuggestionKey | 'extras', value: string) {
    setBrief((prev) => ({ ...prev, [key]: value }));
    setCopied('');
    setFeedback('');
  }
  function chooseIdea(value: unknown) {
    const next = getIdea(value);
    if (!next || next.id === selectedId) return;
    if (selectedId) drafts.current[selectedId] = { ...brief };
    setSelectedId(next.id);
    setBrief(drafts.current[next.id] ?? createIdeaBrief(next.id)!);
    setSubmittedGoal('');
    setResult(null);
    setCelebration(0);
    setCopied('');
    setFeedback('');
  }
  function submitGoal() {
    if (!selectedIdea) return;
    setSubmittedGoal(selectedIdea.id);
    setFeedback(
      'Suggestions are ready beneath the examples in Input, Layout, Features, and Output. Select the ones you want to add.',
    );
    requestAnimationFrame(() => {
      inputSuggestionsRef.current?.scrollIntoView({ block: 'center' });
      inputSuggestionsRef.current?.focus({ preventScroll: true });
    });
  }
  function resetBuilder() {
    drafts.current = {};
    setBrief(emptyBrief());
    setSelectedId('');
    setSubmittedGoal('');
    setResult(null);
    setCelebration(0);
    setCopied('');
    setFeedback(
      'Reset complete. All idea drafts and generated results have been cleared. Choose an app to start again.',
    );
    requestAnimationFrame(() => {
      builderRef.current?.scrollIntoView({ block: 'start' });
      builderRef.current?.focus({ preventScroll: true });
    });
  }
  function addSuggestion(key: SuggestionKey, text: string) {
    if (appendSuggestion(brief[key], text).length > 1500) {
      setFeedback(
        'Your ' +
          definitions[key].title.toLowerCase() +
          ' answer is full. Shorten it before adding another suggestion.',
      );
      return;
    }
    setBrief((prev) => ({ ...prev, [key]: appendSuggestion(prev[key], text) }));
    setCopied('');
    setFeedback(
      'Added to ' +
        definitions[key].title.toLowerCase() +
        '. You can edit it in the box above.',
    );
  }
  async function copy(text: string, label: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      setFeedback(label + ' copied.');
    } catch {
      setFeedback(
        'Copy isn’t available in this browser. Select the text below and use Ctrl+C or Command+C.',
      );
    }
  }
  function download() {
    if (!result || pendingChanges) return;
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = result.filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setFeedback(
      'Your HTML download has started. Open the file in a browser to try your starter.',
    );
  }

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to app builder
      </a>
      <header className="topbar">
        <a className="brand" href="#main" aria-label="Prompt Quest home">
          <span className="brand-mark">P</span>
          <span>
            PROMPT QUEST
            <span className="brand-sub">YOUR FIRST APP STARTS HERE</span>
          </span>
        </a>
        <span className="header-note">
          <span className="status-dot" /> BEGINNER FRIENDLY
        </span>
      </header>
      <main id="main" className="main-shell">
        <div className="intro">
          <span className="eyebrow">
            <span className="tiny-block">1</span> WORLD 1 · YOUR FIRST APP
          </span>
          <h1>
            Generate your ChatGPT prompt
            <br />
            <span>and HTML code.</span>
          </h1>
          <p className="intro-tagline">
            Build your app with ChatGPT—start with five simple inputs.
          </p>
          <p>
            Building your first app doesn’t have to feel overwhelming.
            <br className="desktop-break" /> Choose one of five simple apps. Get
            suggestions, fill your blocks, and build it one small step at a
            time.
          </p>
        </div>

        <div className="workspace direct-workspace">
          <form
            ref={builderRef}
            tabIndex={-1}
            id="brief-form"
            className="panel blocks-form"
            onSubmit={generate}
            aria-labelledby="blocks-heading"
          >
            <div className="form-heading">
              <Button
                type="button"
                variant="outline"
                className="reset-builder"
                onClick={resetBuilder}
                disabled={!selectedIdea && !ready}
              >
                <RotateCcw size={16} aria-hidden="true" /> Reset / start over
              </Button>
              <span className="step-label">01 / YOUR FIVE BUILDING BLOCKS</span>
              <h2 id="blocks-heading">Choose your first app.</h2>
              <p className="muted">
                Pick one of the five ideas below, then choose or write the
                details for its Input, Layout, Features, and Output.
              </p>
              <div className="example-intro">
                <Sparkles size={19} aria-hidden="true" />
                <p>
                  <strong>
                    Five small apps. Plenty of room to make one yours.
                  </strong>{' '}
                  Each idea can run in a browser without an account or API. Your
                  choice supplies the goal; you decide the details.
                </p>
              </div>
            </div>
            {keys.map((key, index) => {
              if (key === 'goal')
                return (
                  <div
                    className={
                      'direct-field goal-picker ' +
                      (selectedIdea ? 'filled' : '')
                    }
                    key={key}
                  >
                    <div className="direct-field-heading">
                      <span className="tiny-block" aria-hidden="true">
                        1
                      </span>
                      <h3 id="goal-label">Goal</h3>
                      <span
                        className={
                          'field-status ' + (selectedIdea ? 'found' : 'missing')
                        }
                      >
                        {selectedIdea ? 'Selected' : 'Choose one'}
                      </span>
                    </div>
                    <p className="field-question">
                      Which app would you like to create?
                    </p>
                    <RadioGroup
                      value={selectedId}
                      onValueChange={chooseIdea}
                      aria-labelledby="goal-label"
                      className="idea-choices"
                    >
                      {appIdeas.map((idea) => (
                        <label
                          className={
                            'idea-choice ' +
                            (selectedId === idea.id ? 'idea-selected' : '')
                          }
                          htmlFor={'idea-' + idea.id}
                          key={idea.id}
                        >
                          <RadioGroupItem
                            id={'idea-' + idea.id}
                            value={idea.id}
                          />
                          <span>
                            <strong>{idea.title}</strong>
                            <span className="idea-description">
                              {idea.description}
                            </span>
                          </span>
                        </label>
                      ))}
                    </RadioGroup>
                    {selectedIdea && (
                      <div className="chosen-goal">
                        <strong>Your goal</strong>
                        <p>{selectedIdea.goal}</p>
                      </div>
                    )}
                    <div className="goal-submit">
                      <Button
                        type="button"
                        className="arcade-button yellow-button"
                        disabled={!selectedIdea}
                        onClick={submitGoal}
                      >
                        Use this idea{' '}
                        <ArrowRight size={17} aria-hidden="true" />
                      </Button>
                      <p>
                        {selectedIdea
                          ? 'Get suggestions for this app in the next four blocks. Your edits are kept separately for each idea while this page stays open.'
                          : 'Choose one of the five ideas to get started.'}
                      </p>
                    </div>
                  </div>
                );
              if (!selectedIdea || !examples) return null;
              const filled = isFilled(brief[key]);
              return (
                <div
                  className={'direct-field ' + (filled ? 'filled' : '')}
                  key={key}
                >
                  <div className="direct-field-heading">
                    <span className="tiny-block" aria-hidden="true">
                      {index + 1}
                    </span>
                    <label htmlFor={'block-' + key}>
                      {definitions[key].title}
                    </label>
                    <span
                      className={
                        'field-status ' + (filled ? 'found' : 'missing')
                      }
                    >
                      {filled ? 'Added' : 'To add'}
                    </span>
                  </div>
                  <p className="field-question" id={'question-' + key}>
                    {definitions[key].question}
                  </p>
                  <p className="field-explanation" id={'hint-' + key}>
                    {definitions[key].hint}
                  </p>
                  <Textarea
                    id={'block-' + key}
                    value={brief[key]}
                    onChange={(e) => changeBlock(key, e.target.value)}
                    maxLength={1500}
                    required
                    placeholder={
                      'Describe your app’s ' +
                      definitions[key].title.toLowerCase() +
                      '…'
                    }
                    aria-describedby={
                      'question-' + key + ' hint-' + key + ' example-' + key
                    }
                  />
                  <div className="example-help">
                    <span id={'example-' + key}>
                      <strong>{selectedIdea.title} example:</strong>{' '}
                      {examples[key]}
                    </span>
                    {!filled && (
                      <Button
                        variant="ghost"
                        type="button"
                        className="use-example"
                        onClick={() => changeBlock(key, examples[key])}
                      >
                        Use example <ArrowRight size={14} aria-hidden="true" />
                      </Button>
                    )}
                  </div>
                  {suggestionsCurrent && suggestions && (
                    <section
                      className="goal-suggestions"
                      aria-labelledby={'suggestions-' + key}
                      ref={key === 'input' ? inputSuggestionsRef : undefined}
                      tabIndex={-1}
                    >
                      <h3 id={'suggestions-' + key}>
                        <span className="suggestions-label">
                          <Sparkles size={15} aria-hidden="true" /> Suggestions
                          for you
                        </span>
                      </h3>
                      <p>
                        Choose what fits your goal. Each pill adds a detail to
                        your {definitions[key].title.toLowerCase()} answer.
                      </p>
                      <div className="suggestion-pills">
                        {suggestions[key].map((suggestion) => {
                          const added = hasSuggestion(
                            brief[key],
                            suggestion.text,
                          );
                          return (
                            <Button
                              key={suggestion.label}
                              type="button"
                              variant="outline"
                              className={
                                'suggestion-pill ' +
                                (added ? 'suggestion-added' : '')
                              }
                              disabled={added}
                              onClick={() =>
                                addSuggestion(key, suggestion.text)
                              }
                              aria-label={
                                (added
                                  ? 'Added: '
                                  : 'Add to ' +
                                    definitions[key].title.toLowerCase() +
                                    ': ') + suggestion.text
                              }
                            >
                              {added ? (
                                <Check size={14} aria-hidden="true" />
                              ) : (
                                <span aria-hidden="true">+</span>
                              )}
                              {suggestion.label}
                              {added && (
                                <span className="pill-added-label">Added</span>
                              )}
                            </Button>
                          );
                        })}
                      </div>
                    </section>
                  )}
                </div>
              );
            })}
            {selectedIdea && extras && (
              <div className="direct-field optional-extras">
                <div className="direct-field-heading">
                  <span className="tiny-block" aria-hidden="true">
                    6
                  </span>
                  <label htmlFor="block-extras">Make it fancy</label>
                  <span className="field-status optional-status">Optional</span>
                </div>
                <p className="field-question" id="extras-question">
                  What extra touches would make your app feel special?
                </p>
                <p className="field-explanation" id="extras-hint">
                  Add a celebration, a theme, or a small delight. Describe when
                  it should happen and what the user should see. You can skip
                  this block.
                </p>
                <Textarea
                  id="block-extras"
                  value={brief.extras ?? ''}
                  onChange={(event) =>
                    changeBlock('extras', event.target.value)
                  }
                  maxLength={1500}
                  placeholder="Add an extra touch, or leave this blank…"
                  aria-describedby="extras-question extras-hint extras-example"
                />
                <div className="example-help" id="extras-example">
                  <span>
                    <strong>{selectedIdea.title} example:</strong>{' '}
                    {extras.suggestions[0].text}
                  </span>
                </div>
                <section
                  className="goal-suggestions"
                  aria-labelledby="extras-suggestions"
                >
                  <h3 id="extras-suggestions">
                    <span className="suggestions-label">
                      <Sparkles size={15} aria-hidden="true" /> Suggestions for
                      you
                    </span>
                  </h3>
                  <p>
                    Pick a little extra, then edit the details above to make it
                    yours.
                  </p>
                  <div className="suggestion-pills">
                    {extras.suggestions.map((suggestion) => {
                      const added = hasSuggestion(
                        brief.extras ?? '',
                        suggestion.text,
                      );
                      return (
                        <Button
                          key={suggestion.label}
                          type="button"
                          variant="outline"
                          className={
                            'suggestion-pill ' +
                            (added ? 'suggestion-added' : '')
                          }
                          disabled={added}
                          aria-label={
                            (added ? 'Added: ' : 'Add optional extra: ') +
                            suggestion.text
                          }
                          onClick={() => {
                            const next = appendSuggestion(
                              brief.extras ?? '',
                              suggestion.text,
                            );
                            if (next.length > 1500) {
                              setFeedback(
                                'Your optional extras are full. Shorten them before adding another suggestion.',
                              );
                              return;
                            }
                            changeBlock('extras', next);
                            setFeedback(
                              'Added to optional extras. You can edit it in the box above.',
                            );
                          }}
                        >
                          {added ? (
                            <Check size={14} aria-hidden="true" />
                          ) : (
                            <span aria-hidden="true">+</span>
                          )}
                          {suggestion.label}
                          {added && (
                            <span className="pill-added-label">Added</span>
                          )}
                        </Button>
                      );
                    })}
                  </div>
                </section>
              </div>
            )}
            <div className="form-submit">
              <Button
                type="submit"
                className="arcade-button primary-action"
                disabled={!complete}
              >
                Generate my prompt <ArrowRight aria-hidden="true" />
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={resetBuilder}
                disabled={!selectedIdea && !ready}
              >
                <RotateCcw size={16} aria-hidden="true" /> Reset / start over
              </Button>
              <p>
                {complete
                  ? 'Your five blocks are ready. Let’s put them together.'
                  : 'Fill in all five blocks to generate your prompt. “None” is okay when a block doesn’t apply.'}{' '}
                Reset clears all idea drafts and generated results.
              </p>
            </div>
          </form>

          <aside
            className="quest-panel direct-quest"
            aria-label="Your progress"
          >
            <div className="quest-top">
              <span className="eyebrow">YOUR MINI QUEST</span>
              <Flag size={20} aria-hidden="true" />
            </div>
            <h2>
              {complete ? (
                <>
                  All blocks.
                  <br />
                  Collected!
                </>
              ) : (
                <>
                  5 blocks.
                  <br />1 great prompt.
                </>
              )}
            </h2>
            <p>
              {complete
                ? 'You have a solid starting point. Ready for the next level?'
                : 'Your idea, in your own words. One small answer at a time.'}
            </p>
            <div className="block-path">
              {keys.map((key, index) => (
                <div key={key}>
                  <span
                    className={
                      'question-block ' +
                      (isFilled(brief[key]) ? 'collected' : '')
                    }
                    aria-label={
                      definitions[key].title +
                      ': ' +
                      (isFilled(brief[key]) ? 'added' : 'to add')
                    }
                  >
                    {isFilled(brief[key]) ? (
                      <Check strokeWidth={4} size={24} aria-hidden="true" />
                    ) : (
                      '?'
                    )}
                  </span>
                  <span>{definitions[key].title}</span>
                  <small>0{index + 1}</small>
                </div>
              ))}
            </div>
            <div className="quest-progress">
              <div>
                <span>Blocks collected</span>
                <strong>{count} / 5</strong>
              </div>
              <Progress
                value={count * 20}
                aria-label="Building blocks completed"
              />
            </div>
            <div className="quest-tip">
              <Sparkles size={19} aria-hidden="true" />
              <span>
                {complete
                  ? 'Your prompt includes all five answers. You can keep improving them as you go.'
                  : 'Choose an app, then use its examples and suggestions to build your prompt.'}
              </span>
            </div>
            <Button
              type="submit"
              form="brief-form"
              className="arcade-button yellow-button quest-generate"
              disabled={!complete}
            >
              Generate my prompt <ArrowRight aria-hidden="true" />
            </Button>
            {!complete && (
              <p className="remaining-blocks">
                Still to add:{' '}
                {missing
                  .map((key) => definitions[key].title.toLowerCase())
                  .join(', ')}
                .
              </p>
            )}
          </aside>
        </div>

        <section
          className="flow-section"
          ref={promptRef}
          tabIndex={-1}
          aria-labelledby="prompt-heading"
        >
          <div className="section-heading">
            <div>
              <span className="step-label">02 / READY FOR CHATGPT</span>
              <h2 id="prompt-heading">Your words, with a little direction.</h2>
            </div>
            <span className="section-icon">
              <Copy size={23} aria-hidden="true" />
            </span>
          </div>
          {ready && celebration > 0 && (
            <div className="prompt-celebration" key={celebration}>
              <Image
                unoptimized
                className="dancing-mushroom"
                src="/mushroom.png"
                width={104}
                height={104}
                alt=""
                aria-hidden="true"
              />
              <div>
                <strong>Prompt unlocked!</strong>
                <p>A little happy dance for your next big step.</p>
              </div>
            </div>
          )}
          <div className="panel prompt-panel">
            <div className="prompt-instructions">
              <span className="tiny-block" aria-hidden="true">
                →
              </span>
              <p>
                Copy this prompt into a new ChatGPT conversation. Answer its
                questions, try the first version, and ask for one improvement at
                a time.
              </p>
            </div>
            {ready ? (
              <>
                <p className="prompt-state">
                  {pendingChanges
                    ? 'CHANGES PENDING · GENERATE AGAIN TO UPDATE BOTH RESULTS'
                    : `YOUR STARTING PROMPT · GENERATION ${result.revision}`}
                </p>
                <Textarea
                  className="prompt-text"
                  readOnly
                  value={prompt}
                  aria-label="Your generated ChatGPT prompt"
                  spellCheck={false}
                />
                <div className="prompt-actions">
                  <Button
                    type="button"
                    className="arcade-button yellow-button"
                    onClick={() => copy(prompt, 'Prompt')}
                    disabled={pendingChanges}
                  >
                    {copied === 'Prompt' ? (
                      <Check size={18} />
                    ) : (
                      <Copy size={18} />
                    )}
                    {copied === 'Prompt' ? 'Prompt copied' : 'Copy my prompt'}
                  </Button>
                  <a
                    className="text-link"
                    href="https://chatgpt.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open ChatGPT <ExternalLink size={15} aria-hidden="true" />
                  </a>
                  <span className="auto-note">
                    Generate again after editing to update your prompt and HTML
                    together.
                  </span>
                </div>
              </>
            ) : (
              <p className="empty-copy">
                Fill in all five blocks, then select “Generate my prompt” to see
                your copy-ready prompt here.
              </p>
            )}
          </div>
        </section>

        <section className="flow-section" aria-labelledby="html-heading">
          <div className="section-heading">
            <div>
              <span className="step-label">03 / YOUR FIRST PIECE OF CODE</span>
              <h2 id="html-heading">Hey, that’s your app taking shape.</h2>
            </div>
            <span className="section-icon">
              <Code2 size={25} aria-hidden="true" />
            </span>
          </div>
          <p className="section-description">
            Download a working HTML app for your selected idea. This uses a
            built-in app template, with the suggested extras and basic theme
            options. It runs without an API key.
          </p>
          <div className="template-scope panel">
            <strong>
              {ready ? 'Included in your HTML' : 'What gets built?'}
            </strong>
            <p>
              {ready
                ? result.included
                : 'Each of the five ideas has its own working app template.'}
            </p>
            <p className="muted">
              The suggestions in “Make it fancy” are supported. Other custom
              descriptions are included in your ChatGPT prompt and saved brief;
              they aren’t automatically implemented in the HTML. Use ChatGPT to
              build those next.
            </p>
          </div>
          <div className="code-window">
            <div className="code-window-bar">
              <span className="file-name">
                <Code2 size={17} aria-hidden="true" /> my-first-app.html
              </span>
              <span className="file-status">
                {ready
                  ? `GENERATION ${result.revision}`
                  : 'WAITING FOR YOUR BLOCKS'}
              </span>
            </div>
            {pendingChanges && (
              <p className="html-update-note">
                Your blocks have changed. Select “Generate my prompt” again to
                refresh the code, preview, and download.
              </p>
            )}
            {ready ? (
              <Tabs defaultValue="code" className="code-tabs">
                <div className="code-toolbar">
                  <TabsList aria-label="Starter views">
                    <TabsTrigger value="code">
                      <Code2 size={16} aria-hidden="true" /> HTML code
                    </TabsTrigger>
                    <TabsTrigger value="preview">
                      <Eye size={16} aria-hidden="true" /> Preview
                    </TabsTrigger>
                  </TabsList>
                  <Button
                    type="button"
                    variant="ghost"
                    className="copy-code"
                    onClick={() => copy(html, 'HTML')}
                    disabled={pendingChanges}
                  >
                    {copied === 'HTML' ? (
                      <Check size={16} />
                    ) : (
                      <Copy size={16} />
                    )}
                    {copied === 'HTML' ? 'Copied' : 'Copy code'}
                  </Button>
                </div>
                <TabsContent value="code">
                  <Textarea
                    key={'code-' + result.revision}
                    className="code-source"
                    readOnly
                    value={html}
                    aria-label="Generated HTML code"
                    spellCheck={false}
                    wrap="off"
                  />
                </TabsContent>
                <TabsContent value="preview">
                  <iframe
                    key={'preview-' + result.revision}
                    className="starter-preview"
                    title="Your generated HTML starter preview"
                    srcDoc={html}
                    sandbox="allow-scripts allow-downloads"
                    referrerPolicy="no-referrer"
                  />
                </TabsContent>
              </Tabs>
            ) : (
              <div className="empty-code">
                <Code2 size={30} aria-hidden="true" />
                <p>Five building blocks. Your first lines of code.</p>
                <span>
                  Complete your five blocks and generate your prompt to create
                  an HTML starter.
                </span>
              </div>
            )}
            <div className="download-bar">
              <div>
                <strong>
                  {ready
                    ? 'A real file. A real first step.'
                    : 'One file. Ready for your browser.'}
                </strong>
                <p>
                  A working app in one HTML file. Open the download in your
                  browser to use it offline.
                </p>
              </div>
              <Button
                type="button"
                className="arcade-button yellow-button"
                onClick={download}
                disabled={!ready || pendingChanges}
              >
                <Download size={18} aria-hidden="true" /> Download HTML
              </Button>
            </div>
          </div>
          {ready && (
            <div className="starter-note">
              <Check size={17} aria-hidden="true" />
              <p>
                After editing, generate again to refresh your prompt, HTML code,
                and preview, then download the new file. It runs locally; your
                work on this page isn’t saved after a refresh.
              </p>
            </div>
          )}
        </section>
        <section
          className="flow-section faq-section"
          aria-labelledby="faq-heading"
        >
          <div className="section-heading">
            <div>
              <span className="step-label">
                04 / A LITTLE HELP ALONG THE WAY
              </span>
              <h2 id="faq-heading">Questions? You’ve got this.</h2>
            </div>
            <span className="tiny-block" aria-hidden="true">
              ?
            </span>
          </div>
          <p className="section-description">
            Your first version is just the beginning. Here’s how to keep
            building with ChatGPT.
          </p>
          <Accordion
            className="panel faq-list"
            multiple
            defaultValue={['bug', 'prompts', 'iterate']}
          >
            <AccordionItem value="bug">
              <AccordionTrigger>
                <span>
                  <span className="faq-number">01</span> Found a bug. What
                  should I tell ChatGPT?
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <p>
                  Tell ChatGPT what you tried, what you expected, and what
                  actually happened. Include the steps to reproduce it and the
                  exact error message, if there is one. Share your latest code
                  or a screenshot when it helps show the problem.
                </p>
                <p className="faq-example-label">
                  {selectedIdea
                    ? `For example, in your ${selectedIdea.title}:`
                    : 'Choose an app above to see a matching example.'}
                </p>
                {extras && <blockquote>“{extras.faq.bug}”</blockquote>}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="prompts">
              <AccordionTrigger>
                <span>
                  <span className="faq-number">02</span> How can I write better
                  prompts?
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <p>
                  Be specific about the result you want. Details such as the
                  audience, tone, colors, placement, and file format give
                  ChatGPT a clearer target. Include a concrete example when you
                  can.
                </p>
                <p>
                  Think of Goal, Input, Layout, Features, and Output as a
                  toolkit. This builder uses all five to get you started; in
                  follow-up prompts, draw on only the blocks you need. A color
                  change may need just Layout, while a new download option uses
                  Features and Output.
                </p>
                <p className="faq-example-label">
                  {selectedIdea
                    ? `A specific request for your ${selectedIdea.title}:`
                    : 'Choose an app above to see a matching example.'}
                </p>
                {extras && <blockquote>“{extras.faq.prompt}”</blockquote>}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="iterate">
              <AccordionTrigger>
                <span>
                  <span className="faq-number">03</span> How do I iterate,
                  improve, and troubleshoot?
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <p>
                  Keep working in the same ChatGPT conversation. Try the app,
                  describe one improvement, and ask for that change. Test the
                  updated version before moving on. If you edited the code
                  elsewhere, share the latest version so ChatGPT has the right
                  context.
                </p>
                <p>
                  Save a working copy before larger changes. If a change causes
                  a problem, describe what changed and what broke, then ask
                  ChatGPT to help troubleshoot it.
                </p>
                <p className="faq-example-label">
                  {selectedIdea
                    ? `An improvement for your ${selectedIdea.title}:`
                    : 'Choose an app above to see a matching example.'}
                </p>
                {extras && <blockquote>“{extras.faq.iterate}”</blockquote>}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
        <output className="action-feedback" aria-live="polite">
          {feedback}
        </output>
      </main>
      <footer>
        <span>PROMPT QUEST</span>
        <p>Every great app starts with “what if?”</p>
        <span>ONE BLOCK AT A TIME.</span>
      </footer>
    </>
  );
}
