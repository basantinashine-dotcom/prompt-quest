import { definitions, keys, type Brief } from './brief';
import { escapeHtml } from './html';
import { optionEnabled } from './option-intent';

export function templateOptions(brief: Brief) {
  const extra = `${brief.features} ${brief.extras ?? ''}`.toLowerCase();
  const layout = brief.layout.toLowerCase();
  return {
    confetti: optionEnabled(extra, /confetti|gentle celebration/),
    glow: optionEnabled(extra, /glow/),
    sound: optionEnabled(extra, /sound/),
    colors: optionEnabled(extra, /color|palette/),
    copyCelebration: optionEnabled(extra, /ready to send|copy celebration/),
    allDone: optionEnabled(extra, /every habit|all.done|you did it/),
    ring: optionEnabled(extra, /circular|progress ring/),
    themes: optionEnabled(extra, /theme|light and dark/),
    history: optionEnabled(extra, /recent|last five/),
    dark: optionEnabled(layout, /dark|night|black/),
    retro: optionEnabled(layout, /retro|pixel|arcade/),
    accent: optionEnabled(layout, /green/)
      ? '#23804c'
      : optionEnabled(layout, /purple/)
        ? '#7045bb'
        : optionEnabled(layout, /pink/)
          ? '#c03977'
          : '#245fbb',
  };
}

export function appDocument(
  title: string,
  brief: Brief,
  body: string,
  script: string,
  css = '',
) {
  const config = templateOptions(brief);
  const serialized = JSON.stringify(config).replace(/</g, '\\u003c');
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escapeHtml(title)}</title>
<style>
:root { color-scheme: ${config.dark ? 'dark' : 'light'}; --bg:${config.dark ? '#142238' : '#edf4fc'}; --panel:${config.dark ? '#20324a' : '#fff'}; --ink:${config.dark ? '#f1f6ff' : '#17304d'}; --muted:${config.dark ? '#bdcce0' : '#4d6682'}; --accent:${config.accent}; --line:${config.dark ? '#57718c' : '#c5d5e6'}; }
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.6 ${config.retro ? '"Courier New",monospace' : 'system-ui,sans-serif'}}main{max-width:960px;margin:auto;padding:30px 20px}h1{font-size:clamp(26px,5vw,40px);line-height:1.2;margin:8px 0 14px}h2{font-size:22px}p{overflow-wrap:anywhere}label{display:block;font-weight:650;margin:12px 0 5px}input,select,textarea,button{font:inherit}input:not([type=checkbox]):not([type=color]),select,textarea{width:100%;padding:10px;border:1px solid var(--line);border-radius:6px;background:var(--bg);color:var(--ink)}textarea{min-height:120px;resize:vertical}button{padding:10px 17px;border:2px solid transparent;border-radius:6px;background:var(--accent);color:#fff;font-weight:650;cursor:pointer}button:disabled{opacity:.5;cursor:not-allowed}.secondary{background:var(--panel);color:var(--ink);border-color:var(--line)}button:focus-visible,input:focus-visible,select:focus-visible,textarea:focus-visible,canvas:focus-visible,summary:focus-visible{outline:3px solid var(--accent);outline-offset:4px}.panel,details{background:var(--panel);border:1px solid var(--line);border-radius:${config.retro ? '0' : '14px'};padding:22px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:20px}.actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:16px;align-items:center}.note{font-size:14px;color:var(--muted)}.status{min-height:26px;font-weight:650}.large{font-size:clamp(40px,12vw,80px);font-weight:750;line-height:1.2;font-variant-numeric:tabular-nums}.center{text-align:center}details{margin-top:24px}summary{cursor:pointer;font-weight:650}dt{font-weight:700;margin-top:12px}dd{margin:4px 0;white-space:pre-wrap;overflow-wrap:anywhere}canvas{display:block;max-width:100%;height:auto}.confetti{position:fixed;inset:0;pointer-events:none;overflow:hidden;z-index:10}.confetti span{position:absolute;top:30%;left:50%;width:9px;height:12px;animation:fall 1.1s ease-out forwards}@keyframes fall{to{transform:translate(var(--x),60vh) rotate(var(--r));opacity:0}}[hidden]{display:none!important}@media(max-width:660px){.grid{grid-template-columns:1fr}main{padding:22px 12px}.panel{padding:16px}}@media(prefers-reduced-motion:reduce){.confetti{display:none}}
${css}</style></head><body><main><header><p class="note">MADE WITH PROMPT QUEST · WORKS OFFLINE</p><h1>${escapeHtml(title)}</h1></header>${body}
<details><summary>Your brief and further customizations</summary><p class="note">This is a working template for ${escapeHtml(title)}. It includes the app’s core controls and supported extras. Other custom descriptions below are saved for your next ChatGPT iteration; they are not automatically converted into code.</p><dl>${keys.map((k) => `<dt>${definitions[k].title}</dt><dd>${escapeHtml(brief[k])}</dd>`).join('')}${brief.extras?.trim() ? `<dt>Optional extras</dt><dd>${escapeHtml(brief.extras)}</dd>` : ''}</dl></details></main><script>
const config = ${serialized};
const $ = id => document.getElementById(id);
let celebrationTimer;
function clearCelebration(){clearTimeout(celebrationTimer);$('confetti')?.remove();}
function celebrate(){clearCelebration();if(!config.confetti || matchMedia('(prefers-reduced-motion: reduce)').matches)return;const layer=document.createElement('div');layer.id='confetti';layer.className='confetti';layer.setAttribute('aria-hidden','true');for(let i=0;i<30;i++){const p=document.createElement('span');p.style.background=['#ed4f8a','#ffd34d','#48a9e6','#48bf79'][i%4];p.style.setProperty('--x',(Math.random()*80-40)+'vw');p.style.setProperty('--r',(Math.random()*720-360)+'deg');layer.appendChild(p);}document.body.appendChild(layer);celebrationTimer=setTimeout(clearCelebration,1150);}
let audio;
function unlockSound(){try{audio ??= new (window.AudioContext || window.webkitAudioContext)();if(audio.state==='suspended')audio.resume().catch(()=>{});}catch{}}
function beep(frequency=440){if(!$('sound')?.checked)return;try{if(!audio || audio.state!=='running')return;const o=audio.createOscillator(),g=audio.createGain();o.frequency.value=frequency;g.gain.setValueAtTime(.07,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+.12);o.connect(g);g.connect(audio.destination);o.start();o.stop(audio.currentTime+.13);}catch{}}
${script}
</script></body></html>`;
}
