import { requestPurchase } from './checkout.js';
import { siteConfig } from './site-config.js';
const steps = [
 { speaker:'Бариста', prompt:'What would you like?', translation:'Що бажаєте?', choices:['I’d like a coffee with milk, please.','I missed my train.','I’m from Ukraine.'], answer:0, good:'Так! Ви ввічливо замовили каву з молоком.', bad:'Зараз потрібно зробити замовлення. Спробуйте фразу з I’d like…' },
 { speaker:'Плани трохи змінилися', prompt:'Sorry, we don’t have any milk.', translation:'Вибачте, у нас немає молока.', choices:['Where is the station?','That’s okay. I’ll have a black coffee.','I booked a room.'], answer:1, good:'Ви знайшли інший варіант і продовжили розмову.', bad:'У цій сцені чорна кава вам підходить. Оберіть нове замовлення.' },
 { speaker:'Бариста', prompt:'To eat in or take away?', translation:'Тут чи із собою?', choices:['See you on Friday.','I was late.','To take away, please.'], answer:2, good:'Готово — кава із собою. Три фрази склалися в розмову.', bad:'Ви поспішаєте й хочете взяти каву із собою. Яка фраза про це?' }
];
let step=0, finished=false, translated=false;
const $=id=>document.getElementById(id);
function renderDemo(){const data=steps[step];$('demo-count').textContent=String(step+1).padStart(2,'0')+' / 03';$('demo-speaker').textContent=data.speaker;$('demo-prompt').textContent=data.prompt;$('demo-prompt').lang='en';$('demo-translation').textContent=data.translation;$('demo-translation').hidden=!translated;$('demo-translate').textContent=translated?'Приховати переклад':'Показати переклад';$('demo-translate').setAttribute('aria-expanded',String(translated));$('demo-options').replaceChildren();data.choices.forEach((label,i)=>{const b=document.createElement('button');b.type='button';b.lang='en';b.textContent=label;b.setAttribute('aria-pressed','false');b.addEventListener('click',()=>{if(finished)return;for(const o of $('demo-options').querySelectorAll('button'))o.setAttribute('aria-pressed',String(o===b));const correct=i===data.answer;$('demo-feedback').textContent=correct?data.good:data.bad;$('demo-feedback').dataset.state=correct?'good':'bad';$('demo-next').hidden=!correct;$('demo-next').textContent=step===2?'Завершити демо':'Наступна репліка';});$('demo-options').append(b)});$('demo-feedback').textContent='';$('demo-next').hidden=true;$('demo-finish').hidden=true;$('demo-options').hidden=false;}
$('demo-translate').onclick=()=>{translated=!translated;$('demo-translation').hidden=!translated;$('demo-translate').textContent=translated?'Приховати переклад':'Показати переклад';$('demo-translate').setAttribute('aria-expanded',String(translated));};
$('demo-next').onclick=()=>{if(step===2){finished=true;$('demo-options').hidden=true;$('demo-next').hidden=true;$('demo-finish').hidden=false;$('demo-finish').querySelector('button').focus();return;}step++;renderDemo();$('demo-options').querySelector('button').focus();};
$('demo-reset').onclick=()=>{step=0;finished=false;renderDemo();$('demo-options').querySelector('button').focus();};
document.addEventListener('click',event=>{const b=event.target.closest('[data-buy]');if(b)requestPurchase(b);});
$('close-purchase').onclick=()=>$('purchase-dialog').close();$('back-to-demo').onclick=()=>{$('purchase-dialog').close();if(finished){step=0;finished=false;renderDemo();}$('demo').scrollIntoView({behavior:'smooth'});$('demo-options').querySelector('button')?.focus();};
renderDemo();
if($('price-value'))$('price-value').textContent=siteConfig.currency==='UAH'?new Intl.NumberFormat('uk-UA').format(siteConfig.price)+' грн':new Intl.NumberFormat('uk-UA',{style:'currency',currency:siteConfig.currency,maximumFractionDigits:0}).format(siteConfig.price);
if(siteConfig.author.name&&$('author-name'))$('author-name').textContent=siteConfig.author.name;
if(siteConfig.author.bio&&$('author-bio'))$('author-bio').textContent=siteConfig.author.bio;

function openLegalAnchor(){const id=location.hash.slice(1);const section=document.getElementById(id);if(section?.classList.contains('legal-document'))section.open=true;}
window.addEventListener('hashchange',openLegalAnchor);
document.querySelectorAll('.legal-nav a').forEach(link=>link.addEventListener('click',()=>{const section=document.getElementById(link.hash.slice(1));if(section)section.open=true;}));
openLegalAnchor();
