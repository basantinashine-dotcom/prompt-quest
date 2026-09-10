import type { Brief } from './brief';
import { appDocument, templateOptions } from './app-template';

export function buildTimer(brief: Brief) {
  const opts = templateOptions(brief);
  return appDocument(
    'Focus Timer',
    brief,
    `<section class="panel center"><h2 id="session">Work</h2><div id="timer-ring"><p id="countdown" class="large" role="timer" aria-live="off">25:00</p></div><p id="status" class="status" role="status">Ready for a focused session.</p><div class="actions centered"><button id="start">Start</button><button id="pause" class="secondary" disabled>Pause</button><button id="reset" class="secondary">Reset</button></div><p>Completed work sessions: <strong id="completed">0</strong></p><div class="grid settings"><div><label for="work">Work minutes</label><input id="work" required type="number" min="1" max="180" step="1" value="25"></div><div><label for="break">Break minutes</label><input id="break" required type="number" min="1" max="60" step="1" value="5"></div></div><p class="note">Duration changes apply when you reset or begin the next session. Each session waits for you to press Start.</p><label><input type="checkbox" id="sound"> Play a sound when a session ends</label>${opts.themes ? '<button id="theme" class="secondary" aria-pressed="false">Switch theme</button>' : ''}</section>`,
    `
let mode='work',running=false,remaining=25*60*1000,total=remaining,deadline=0,completed=0;
function duration(){const input=$(mode);return Number(input.value)*60*1000;}
function valid(){for(const id of ['work','break']){const input=$(id),value=Number(input.value),maximum=id==='work'?180:60;const invalid=!input.value.trim()||!Number.isInteger(value)||value<1||value>maximum;input.setCustomValidity(invalid?'Enter a whole number from 1 to '+maximum+'.':'');if(invalid){input.reportValidity();return false;}}return true;}
function draw(){const seconds=Math.max(0,Math.ceil(remaining/1000));$('countdown').textContent=String(Math.floor(seconds/60)).padStart(2,'0')+':'+String(seconds%60).padStart(2,'0');$('session').textContent=mode==='work'?'Work':'Break';$('completed').textContent=completed;$('start').disabled=running;$('pause').disabled=!running;$('work').disabled=running;$('break').disabled=running;$('start').textContent=remaining<total?'Resume':'Start';if(config.ring)$('timer-ring').style.background='conic-gradient(var(--accent) '+(Math.max(0,remaining/total)*100)+'%, var(--line) 0)';}
function finish(){running=false;if(mode==='work')completed++;const wasWork=mode==='work';mode=wasWork?'break':'work';total=remaining=duration();$('status').textContent=wasWork?'Time for a break! Press Start when you’re ready.':'Break finished. Ready for another focused session?';beep(660);celebrate();draw();}
function tick(){if(running){remaining=Math.max(0,deadline-Date.now());if(remaining<=0){finish();return;}draw();}}
$('start').onclick=()=>{if(!valid())return;unlockSound();if(remaining===total)total=remaining=duration();deadline=Date.now()+remaining;running=true;$('status').textContent=mode==='work'?'Focus time. One thing at a time.':'Take a little breathing room.';draw();};
$('pause').onclick=()=>{tick();if(!running)return;remaining=Math.max(0,deadline-Date.now());running=false;$('status').textContent='Paused. Your remaining time is saved.';draw();};
$('reset').onclick=()=>{if(!valid())return;running=false;mode='work';completed=0;total=remaining=duration();clearCelebration();$('status').textContent='Timer reset. Ready for a fresh session.';draw();};
for(const id of ['work','break'])$(id).oninput=()=>$(id).setCustomValidity('');
for(const id of ['work','break'])$(id).onchange=()=>{if(!running&&remaining===total&&valid()){total=remaining=duration();draw();}};
if($('theme'))$('theme').onclick=()=>{config.dark=!config.dark;const s=document.documentElement.style;s.setProperty('--bg',config.dark?'#142238':'#edf4fc');s.setProperty('--panel',config.dark?'#20324a':'#fff');s.setProperty('--ink',config.dark?'#f1f6ff':'#17304d');s.setProperty('--muted',config.dark?'#bdcce0':'#4d6682');document.documentElement.style.colorScheme=config.dark?'dark':'light';$('theme').setAttribute('aria-pressed',String(config.dark));};
setInterval(tick,100);document.addEventListener('visibilitychange',tick);draw();`,
    `.centered{justify-content:center}.settings{max-width:480px;margin:24px auto 0;text-align:left}#timer-ring{max-width:330px;margin:auto;padding:10px;border-radius:50%}#countdown{background:var(--panel);border-radius:50%;padding:65px 10px;margin:0}#theme{margin-top:16px}`,
  );
}
