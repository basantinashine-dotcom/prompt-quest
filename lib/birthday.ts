import type { Brief } from './brief';
import { appDocument, templateOptions } from './app-template';

export function buildBirthday(brief: Brief) {
  const opts = templateOptions(brief);
  return appDocument(
    'Birthday Message Generator',
    brief,
    `
<div class="grid"><form id="birthday-form" class="panel"><label for="name">Birthday person’s name</label><input id="name" required maxlength="40" placeholder="Maya"><label for="relationship">Your relationship</label><select id="relationship"><option>friend</option><option>sister</option><option>brother</option><option>parent</option><option>partner</option><option>colleague</option></select><label for="detail">A hobby or shared memory (optional)</label><input id="detail" maxlength="90" placeholder="our hiking adventures"><label for="tone">Tone</label><select id="tone"><option value="heartfelt">Heartfelt</option><option value="funny">Funny</option><option value="playful">Playful</option></select><div class="actions"><button>Generate message</button><button id="reset" type="button" class="secondary">Reset</button></div></form>
<section class="panel message-card" id="card"><h2>Your birthday wish</h2><label for="message">Edit your message</label><textarea id="message" rows="8" placeholder="Your birthday message will appear here."></textarea>${opts.colors ? '<label for="card-color">Card color</label><select id="card-color"><option value="#fff5bb">Sunshine</option><option value="#ffe1ec">Pink</option><option value="#ddf4ff">Sky</option></select>' : ''}<div class="actions"><button id="another" class="secondary" disabled>Try another</button><button id="copy" disabled>Copy message</button></div><p id="status" class="status" role="status"></p><p class="note">Uses built-in messages and your details. No AI service or account needed.</p></section></div>`,
    `
let variant=0, lastInputs='', generated=false;
function makeMessage(){const name=$('name').value.trim();if(!name){$('name').setCustomValidity('Enter a name.');$('name').reportValidity();return;}const detail=$('detail').value.trim().split(/\\s+/).slice(0,12).join(' '), relationship=$('relationship').value,tone=$('tone').value;const inputKey=JSON.stringify([name,detail,relationship,tone]);if(inputKey!==lastInputs)variant=0;else variant++;lastInputs=inputKey;
const lines={heartfelt:['Wishing you a day filled with love and a year full of wonderful moments.','Life is brighter with you in it. Wishing you joy today and always.','Here’s to a year of small joys, big dreams, and good company.'],funny:['Another year wiser—or at least better at pretending! Save me some cake.','You’re not getting older; you’re collecting excellent stories. Cake is mandatory.','May your cake be enormous and your responsibilities take the day off.'],playful:['Cue the cake, turn up the music, and let the birthday adventures begin!','Today’s mission: smile big, eat cake, and make a little happy chaos!','Sending a birthday-sized burst of good vibes and a very loud hooray!']};
let message='Happy birthday, '+name+'! '+lines[tone][variant%3]+' So glad you’re my '+relationship+'.';if(detail)message+=' Here’s to more of what makes you smile: '+detail+'.';const words=message.trim().split(/\\s+/);if(words.length>59)message=words.slice(0,59).join(' ').replace(/[.,;:!?]+$/,'')+'…';$('message').value=message;generated=true;$('copy').disabled=false;$('another').disabled=false;$('status').textContent='Your message is ready. Edit it to make it yours.';celebrate();}
$('name').oninput=()=>$('name').setCustomValidity('');$('birthday-form').onsubmit=e=>{e.preventDefault();makeMessage();};$('another').onclick=()=>{if($('birthday-form').reportValidity())makeMessage();};$('message').oninput=()=>$('copy').disabled=!$('message').value.trim();
$('copy').onclick=async()=>{try{await navigator.clipboard.writeText($('message').value);$('status').textContent=config.copyCelebration?'Ready to send!':'Message copied.';}catch{$('message').focus();$('message').select();$('status').textContent='Press Ctrl+C or Command+C to copy the selected message.';}};
$('reset').onclick=()=>{$('birthday-form').reset();$('name').setCustomValidity('');$('message').value='';$('status').textContent='';$('copy').disabled=$('another').disabled=true;variant=0;lastInputs='';generated=false;clearCelebration();$('name').focus();};
if($('card-color')){const color=()=>{$('card').style.background=$('card-color').value;$('card').style.color='#19304b';};$('card-color').onchange=color;color();}
`,
    `.message-card{background:#fff5bb;color:#17304d}.message-card textarea{background:#fff;color:#17304d;min-height:240px}.message-card .note{color:#465c73}`,
  );
}
