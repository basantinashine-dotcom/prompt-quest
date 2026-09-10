import type { Brief } from './brief';
import { appDocument, templateOptions } from './app-template';

export function buildSpinner(brief: Brief) {
  const opts = templateOptions(brief);
  return appDocument(
    'Decision Spinner',
    brief,
    `<div class="grid"><section class="panel"><label for="choices">Choices, one per line</label><textarea id="choices" rows="8" maxlength="1600">Movie night
Take a walk
Board game</textarea><p class="note">Enter 2–20 different choices, up to 60 characters each. Every choice gets an equal chance.</p>${opts.colors ? '<label for="palette">Wheel colors</label><select id="palette"><option value="bright">Bright</option><option value="ocean">Ocean</option><option value="berry">Berry</option></select>' : ''}<div class="actions"><button id="spin">Spin</button></div><p id="status" class="status" role="status"></p></section><section class="panel center"><div class="wheel-wrap"><span class="pointer" aria-hidden="true">▼</span><canvas id="wheel" width="500" height="500" aria-label="Decision wheel. The selected choice is also shown below."></canvas></div><h2 id="winner" aria-live="polite">What will it be?</h2>${opts.history ? '<h3>Recent winners</h3><ol id="history"></ol>' : ''}</section></div>`,
    `
const canvas=$('wheel'),ctx=canvas.getContext('2d'),tau=Math.PI*2;let angle=0,spinning=false,choices=[],history=[];
function read(){const list=$('choices').value.split(/\\n/).map(s=>s.trim()).filter(Boolean);if(list.length<2||list.length>20||list.some(s=>s.length>60)||new Set(list).size!==list.length){$('status').textContent='Enter 2–20 different choices, each no more than 60 characters.';return null;}$('status').textContent='';return list;}
function colors(){const palettes={bright:['#f7c65c','#f38bab','#87c9ee','#9bd5a9'],ocean:['#b9eff0','#86cae7','#acdafa','#88cabe'],berry:['#f6b2c8','#d5b5ef','#e8c3e7','#f6c2ac']};return palettes[$('palette')?.value||'bright'];}
function draw(){ctx.clearRect(0,0,500,500);if(!choices.length)return;const slice=tau/choices.length,palette=colors();choices.forEach((choice,i)=>{const start=angle+i*slice;ctx.beginPath();ctx.moveTo(250,250);ctx.arc(250,250,226,start,start+slice);ctx.closePath();ctx.fillStyle=palette[i%palette.length];ctx.fill();ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.stroke();ctx.save();ctx.translate(250,250);ctx.rotate(start+slice/2);ctx.textAlign='right';ctx.fillStyle='#142238';ctx.font='bold '+(choices.length>12?12:15)+'px system-ui';ctx.fillText(choice.length>18?choice.slice(0,16)+'…':choice,212,5);ctx.restore();});ctx.beginPath();ctx.arc(250,250,18,0,tau);ctx.fillStyle='#142238';ctx.fill();}
function refresh(){const next=read();if(!next){choices=[];draw();$('winner').textContent='Add valid choices to begin.';return;}choices=next;angle=0;draw();$('winner').textContent='What will it be?';}
function pick(n){if(globalThis.crypto?.getRandomValues){const a=new Uint32Array(1),limit=Math.floor(4294967296/n)*n;do{crypto.getRandomValues(a);}while(a[0]>=limit);return a[0]%n;}return Math.floor(Math.random()*n);}
function winnerAt(rotation,n){const normalized=((-Math.PI/2-rotation)%tau+tau)%tau;return Math.floor(normalized/(tau/n))%n;}
$('spin').onclick=()=>{if(spinning)return;const next=read();if(!next)return;choices=next;spinning=true;$('spin').disabled=true;$('choices').disabled=true;if($('palette'))$('palette').disabled=true;$('winner').textContent='Spinning…';const winner=pick(choices.length),slice=tau/choices.length,startAngle=angle,desired=-Math.PI/2-(winner+.5)*slice,normalized=((desired-angle)%tau+tau)%tau,target=angle+tau*5+normalized,start=performance.now(),duration=matchMedia('(prefers-reduced-motion: reduce)').matches?0:2600;
function frame(now){const progress=duration?Math.min(1,(now-start)/duration):1;angle=startAngle+(target-startAngle)*(1-Math.pow(1-progress,4));draw();if(progress<1){requestAnimationFrame(frame);return;}angle=((target%tau)+tau)%tau;draw();const actual=winnerAt(angle,choices.length);$('winner').textContent=choices[actual];$('status').textContent='Selected: '+choices[actual]+'. Spin again or edit your choices.';history.unshift(choices[actual]);history=history.slice(0,5);if($('history')){$('history').replaceChildren();for(const text of history){const item=document.createElement('li');item.textContent=text;$('history').appendChild(item);}}spinning=false;$('spin').disabled=false;$('choices').disabled=false;if($('palette'))$('palette').disabled=false;celebrate();}requestAnimationFrame(frame);};
$('choices').oninput=refresh;if($('palette'))$('palette').onchange=draw;refresh();`,
    `.wheel-wrap{position:relative;padding-top:14px}.pointer{position:absolute;top:0;left:50%;transform:translateX(-50%);color:var(--ink);font-size:34px;line-height:1;z-index:1}#wheel{width:100%}#history{text-align:left}#winner{overflow-wrap:anywhere}`,
  );
}
