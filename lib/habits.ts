import { createHabitStore } from './habit-store';
import type { Brief } from './brief';
import { appDocument, templateOptions } from './app-template';

export function buildHabits(brief: Brief) {
  const opts = templateOptions(brief);
  return appDocument(
    'Daily Habit Tracker',
    brief,
    `<section class="panel"><form id="habit-form"><label for="habit-name">Add a habit</label><input id="habit-name" required maxlength="80" placeholder="Read for 10 minutes"><div class="actions"><button>Add habit</button></div></form><p id="status" class="status" role="status"></p><div id="habit-list"></div><p id="all-done" class="status" hidden>You did it! Every habit is complete today.</p><h2>Your last seven days</h2><div class="table-wrap"><table><caption class="note">Completed check-ins by date</caption><thead id="week-head"></thead><tbody id="week-body"></tbody></table></div><p id="storage-note" class="note">Saved only in this browser. Download and open the HTML file to keep your check-ins. The embedded preview may not allow storage.</p></section>`,
    `
const makeStore=${createHabitStore.toString()};
let storage=null;try{storage=localStorage;}catch{}
const store=makeStore(storage);let habits=store.read();
function storageNote(){if(!store.isPersistent())$('storage-note').textContent='Storage is unavailable here. Check-ins last for this session only. Try opening the downloaded file in your browser.';}
function dayKey(d=new Date()){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
let today=dayKey();
function saveChange(change){habits=store.change(change);storageNote();}
function render(){habits=store.read();storageNote();today=dayKey();const list=$('habit-list');list.replaceChildren();let done=0;
for(const habit of habits){const row=document.createElement('div');row.className='habit-row';row.style.borderLeftColor=habit.color;const label=document.createElement('label'),check=document.createElement('input'),text=document.createElement('span');check.type='checkbox';check.checked=habit.days.includes(today);if(check.checked)done++;text.textContent=habit.name;label.append(check,text);check.onchange=()=>{const key=dayKey();saveChange({kind:'check',id:habit.id,day:key,checked:check.checked});render();if(check.checked)celebrate();};row.appendChild(label);
${opts.colors ? `const color=document.createElement('input');color.type='color';color.value=habit.color;color.setAttribute('aria-label','Color for '+habit.name);color.oninput=()=>{row.style.borderLeftColor=color.value;saveChange({kind:'color',id:habit.id,color:color.value});};row.appendChild(color);` : ''}
const remove=document.createElement('button');remove.className='secondary';remove.textContent='Remove';remove.setAttribute('aria-label','Remove '+habit.name);remove.onclick=()=>{saveChange({kind:'remove',id:habit.id});render();};row.appendChild(remove);list.appendChild(row);}
$('status').textContent=habits.length?done+' of '+habits.length+' habits complete today.':'Add your first habit to get started.';$('all-done').hidden=!(config.allDone&&habits.length&&done===habits.length);
const dates=[];for(let i=6;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);dates.push(d);}const head=document.createElement('tr'),title=document.createElement('th');title.textContent='Habit';title.scope='col';head.appendChild(title);for(const d of dates){const cell=document.createElement('th');cell.textContent=d.toLocaleDateString(undefined,{month:'short',day:'numeric'});cell.scope='col';head.appendChild(cell);}$('week-head').replaceChildren(head);$('week-body').replaceChildren();for(const habit of habits){const row=document.createElement('tr'),name=document.createElement('th');name.scope='row';name.textContent=habit.name;row.appendChild(name);for(const d of dates){const cell=document.createElement('td');const checked=habit.days.includes(dayKey(d));cell.textContent=checked?'✓':'—';cell.setAttribute('aria-label',checked?'Complete':'Not complete');row.appendChild(cell);}$('week-body').appendChild(row);}}
$('habit-form').onsubmit=e=>{e.preventDefault();const name=$('habit-name').value.trim();if(!name)return;habits=store.read();if(habits.length>=100){$('status').textContent='You can keep up to 100 habits. Remove one before adding more.';return;}saveChange({kind:'add',id:globalThis.crypto?.randomUUID?.()??Date.now().toString(36)+'-'+Math.random().toString(36).slice(2),name,color:'#23804c'});$('habit-name').value='';render();$('habit-name').focus();};
window.addEventListener('storage',event=>{if(event.key===null||event.key===store.prefix||event.key?.startsWith(store.prefix)||event.key==='prompt-quest-habits-v1')render();});
setInterval(()=>{if(dayKey()!==today)render();},30000);document.addEventListener('visibilitychange',()=>{if(!document.hidden)render();});render();`,
    `.habit-row{display:flex;align-items:center;gap:12px;margin:12px 0;padding:12px;border:1px solid var(--line);border-left:5px solid #23804c;border-radius:8px}.habit-row label{display:flex;align-items:center;gap:12px;flex:1;margin:0;overflow-wrap:anywhere}.habit-row input[type=checkbox]{width:22px;height:22px;flex-shrink:0}.habit-row input[type=color]{width:36px;height:36px;border:0;padding:0}.table-wrap{overflow:auto}table{border-collapse:collapse;width:100%;font-size:14px}td,th{padding:10px;border-bottom:1px solid var(--line);text-align:center}th:first-child{text-align:left;min-width:110px}.habit-row label:has(input:checked) span{text-decoration:line-through;opacity:.65}`,
  );
}
