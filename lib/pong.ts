import type { Brief } from './brief';
import { appDocument, templateOptions } from './app-template';
import { createPongEngine } from './pong-engine';

export function buildPong(brief: Brief) {
  const opts = templateOptions(brief);
  return appDocument(
    'Ping Pong Game',
    brief,
    `
<section class="panel"><div class="score"><span>You <strong id="player-score">0</strong></span><span>FIRST TO <select id="target" aria-label="Points to win"><option>3</option><option selected>5</option><option>7</option><option>10</option></select></span><span>Computer <strong id="computer-score">0</strong></span></div>
<canvas id="court" width="800" height="450" tabindex="0" aria-label="Ping Pong court. Use up and down arrows or W and S to move. Drag on the court on a touchscreen.">Your browser needs canvas support to play.</canvas>
<p id="status" class="status" role="status">Press Start to play.</p><div class="actions"><button id="start">Start</button><button id="pause" class="secondary" disabled>Pause</button><button id="restart" class="secondary">Restart</button><label>Difficulty <select id="difficulty"><option value="easy">Easy</option><option value="normal" selected>Normal</option></select></label>${opts.sound ? '<label><input id="sound" type="checkbox"> Arcade sounds</label>' : ''}</div>
<p class="note">Move with ↑ / ↓ or W / S while the court is focused, or drag on the court. Space pauses or resumes. Leaving the court pauses the match.</p></section>`,
    `
const createEngine = ${createPongEngine.toString()};
let game=createEngine(Number($('target').value));
const canvas=$('court'), ctx=canvas.getContext('2d');
const keys=new Set();let pointerY=null, dragging=false, previousTime=null;
function update(){const s=game.state;$('player-score').textContent=s.playerScore;$('computer-score').textContent=s.computerScore;$('start').textContent=s.phase==='over'?'Play again':s.phase==='paused'?'Resume':'Start';$('start').disabled=s.phase==='playing';$('pause').disabled=s.phase!=='playing';$('target').disabled=s.phase!=='ready';$('status').textContent=s.phase==='over'?(s.winner==='player'?'You win!':'Computer wins. Try again!'):s.phase==='paused'?'Paused. Press Resume to continue.':s.phase==='ready'?'Press Start to play.':'Match in progress. First to '+$('target').value+' wins.';}
function draw(){const s=game.state;ctx.fillStyle='#101e34';ctx.fillRect(0,0,800,450);ctx.strokeStyle='#52627b';ctx.setLineDash([8,12]);ctx.beginPath();ctx.moveTo(400,12);ctx.lineTo(400,438);ctx.stroke();ctx.setLineDash([]);ctx.shadowBlur=config.glow?18:0;ctx.shadowColor='#54dcee';ctx.fillStyle='#54dcee';ctx.fillRect(28,s.playerY,12,84);ctx.shadowColor='#ff83b9';ctx.fillStyle='#ff83b9';ctx.fillRect(760,s.computerY,12,84);ctx.shadowColor='#fff';ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(s.ball.x,s.ball.y,8,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;if(s.phase!=='playing'){ctx.fillStyle='rgba(10,20,36,.72)';ctx.fillRect(100,165,600,120);ctx.fillStyle='#fff';ctx.font='bold 26px system-ui';ctx.textAlign='center';ctx.fillText(s.phase==='ready'?'Ready to rally?':s.phase==='paused'?'Paused':s.winner==='player'?'You win!':'Computer wins',400,235);}}
function pause(){game.pause();keys.clear();pointerY=null;dragging=false;update();draw();}
function begin(){unlockSound();game.start();update();canvas.focus();}
$('start').onclick=begin;$('pause').onclick=pause;
$('restart').onclick=()=>{game.restart();keys.clear();pointerY=null;clearCelebration();update();draw();};
$('target').onchange=()=>{game=createEngine(Number($('target').value));game.state.difficulty=$('difficulty').value;update();draw();};
$('difficulty').onchange=()=>game.state.difficulty=$('difficulty').value;
canvas.addEventListener('keydown',e=>{if(['ArrowUp','ArrowDown','w','W','s','S',' '].includes(e.key)){e.preventDefault();if(e.key===' '){if(!e.repeat){if(game.state.phase==='playing')pause();else begin();}}else{keys.add(e.key.toLowerCase());pointerY=null;}}});
canvas.addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));canvas.addEventListener('blur',pause);
function point(e){const rect=canvas.getBoundingClientRect();pointerY=(e.clientY-rect.top)*450/rect.height;}
canvas.addEventListener('pointerdown',e=>{canvas.focus();canvas.setPointerCapture(e.pointerId);dragging=true;point(e);});canvas.addEventListener('pointermove',e=>{if(dragging)point(e);});
for(const name of ['pointerup','pointercancel'])canvas.addEventListener(name,()=>{dragging=false;pointerY=null;});
document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();});
function frame(now){const elapsed=previousTime===null?0:(now-previousTime)/1000;previousTime=now;const direction=(keys.has('arrowdown')||keys.has('s')?1:0)-(keys.has('arrowup')||keys.has('w')?1:0);const events=game.step(elapsed,direction,pointerY);if(events.includes('hit'))beep(480);if(events.includes('point')){beep(680);update();}if(events.includes('win')&&game.state.winner==='player')celebrate();draw();requestAnimationFrame(frame);}
update();draw();requestAnimationFrame(frame);`,
    `.score{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:16px}.score strong{font-size:30px;margin-left:8px}.score select{width:auto!important}#court{width:100%;border:2px solid #546784;touch-action:none}.actions label{margin:0}.actions select{width:auto!important}`,
  );
}
