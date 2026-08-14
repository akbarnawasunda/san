/* ===== CINEMA PACK — typography + cinematic layers ===== */
(function(){
'use strict';

/* fonts */
var pre=document.createElement('link');pre.rel='preconnect';pre.href='https://fonts.googleapis.com';document.head.appendChild(pre);
var pre2=document.createElement('link');pre2.rel='preconnect';pre2.href='https://fonts.gstatic.com';pre2.crossOrigin='';document.head.appendChild(pre2);
var fl=document.createElement('link');fl.rel='stylesheet';
fl.href='https://fonts.googleapis.com/css2?family=Unbounded:wght@500;700;900&family=Space+Grotesk:wght@400;500;700&family=Noto+Serif+JP:wght@500;700&family=Caveat:wght@600;700&display=swap';
document.head.appendChild(fl);

var st=document.createElement('style');
st.textContent=[
"body{font-family:'Space Grotesk',system-ui,sans-serif}",
".title{font-family:'Unbounded',sans-serif;font-size:clamp(1.6rem,5.2vw,3.6rem);font-weight:700}",
".title.small{font-size:clamp(1.2rem,3.6vw,2.2rem)}",
".subtitle{font-family:'Unbounded',sans-serif;font-weight:500}",
".domain-title{font-family:'Unbounded',sans-serif}",
".intro-line.date{font-family:'Unbounded',sans-serif;font-weight:700}",
".jp{font-family:'Noto Serif JP',serif}",
".sign{font-family:'Caveat',cursive;font-size:1.5em;font-weight:600}",
".grain{position:fixed;inset:0;z-index:1700;pointer-events:none;opacity:.05;background-image:url(\"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='120' height='120' filter='url(%23n)' opacity='0.6'/></svg>\");animation:grain .9s steps(2) infinite}",
"@keyframes grain{0%{background-position:0 0}25%{background-position:40px 60px}50%{background-position:-30px 20px}75%{background-position:60px -40px}100%{background-position:0 0}}",
".kanji-side{position:fixed;top:50%;transform:translateY(-50%);writing-mode:vertical-rl;font-family:'Noto Serif JP',serif;font-size:clamp(1.6rem,5vh,3rem);color:rgba(255,255,255,.05);letter-spacing:.4em;z-index:0;pointer-events:none;user-select:none}",
".kanji-side.left{left:14px}.kanji-side.right{right:14px}",
".sigil{position:absolute;left:50%;top:50%;width:min(430px,92%);transform:translate(-50%,-50%);color:#a29bfe;opacity:.07;animation:spin 60s linear infinite;pointer-events:none}",
".rays{position:absolute;left:50%;top:58%;width:520px;height:520px;transform:translate(-50%,-50%);background:repeating-conic-gradient(rgba(255,217,61,.10) 0 5deg,transparent 5deg 10deg);border-radius:50%;-webkit-mask:radial-gradient(circle,#000 0%,transparent 65%);mask:radial-gradient(circle,#000 0%,transparent 65%);animation:spin 40s linear infinite;pointer-events:none}",
".hanko{display:inline-block;background:#c0392b;color:#fff;font-family:'Noto Serif JP',serif;padding:.15em .35em;border-radius:6px;transform:rotate(-6deg);margin-left:10px;animation:stamp .5s .5s both;box-shadow:0 4px 14px rgba(192,57,43,.4)}",
"@keyframes stamp{from{opacity:0;transform:rotate(-6deg) scale(2.2)}to{opacity:1;transform:rotate(-6deg) scale(1)}}",
".message p:first-child::first-letter{font-size:2.4em;font-family:'Unbounded',sans-serif;color:#ffd93d;float:left;line-height:1;margin-right:8px}",
".corner{position:absolute;width:34px;height:34px;border:0 solid rgba(255,217,61,.55);pointer-events:none}",
".corner.tl{top:12px;left:12px;border-top-width:2px;border-left-width:2px;border-top-left-radius:12px}",
".corner.tr{top:12px;right:12px;border-top-width:2px;border-right-width:2px;border-top-right-radius:12px}",
".corner.bl{bottom:12px;left:12px;border-bottom-width:2px;border-left-width:2px;border-bottom-left-radius:12px}",
".corner.br{bottom:12px;right:12px;border-bottom-width:2px;border-right-width:2px;border-bottom-right-radius:12px}",
".stab{display:flex;justify-content:space-between;max-width:560px;margin:14px auto 6px;font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.15em;color:rgba(255,255,255,.6)}",
"body.low .grain,body.low .rays{display:none}",
"@media(max-width:700px){.kanji-side{display:none}}"
].join('');
document.head.appendChild(st);

/* grain + kanji */
var g=document.createElement('div');g.className='grain';document.body.appendChild(g);
var kl=document.createElement('div');kl.className='kanji-side left';kl.textContent='領域展開';document.body.appendChild(kl);
var kr=document.createElement('div');kr.className='kanji-side right';kr.textContent='無量空処';document.body.appendChild(kr);

/* sigil di kartu start */
var card=document.querySelector('#screen-start .card');
if(card&&!card.querySelector('.sigil')){
card.insertAdjacentHTML('afterbegin','<svg class="sigil" viewBox="0 0 200 200"><circle cx="100" cy="100" r="96" fill="none" stroke="currentColor"/><circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" stroke-dasharray="4 6"/><polygon points="100,12 176,144 24,144" fill="none" stroke="currentColor"/><polygon points="100,188 24,56 176,56" fill="none" stroke="currentColor"/><circle cx="100" cy="100" r="30" fill="none" stroke="currentColor"/></svg>');
}

/* rays di victory */
var vc=document.querySelector('#screen-victory .card');
if(vc&&!vc.querySelector('.rays')){vc.insertAdjacentHTML('afterbegin','<div class="rays"></div>')}

/* hanko di intro */
var date=document.querySelector('.intro-line.date');
if(date&&!date.querySelector('.hanko')){date.insertAdjacentHTML('beforeend','<span class="hanko">寿</span>')}

/* corner frame di message */
var mc=document.querySelector('#screen-message .card');
if(mc&&!mc.querySelector('.corner')){
mc.insertAdjacentHTML('afterbegin','<div class="corner tl"></div><div class="corner tr"></div><div class="corner bl"></div><div class="corner br"></div>');
}

/* domain stability label */
var prog=document.querySelector('#screen-domain .progress');
if(prog&&!document.querySelector('.stab')){
prog.insertAdjacentHTML('beforebegin','<div class="stab"><span>DOMAIN STABILITY</span><b id="stabPct">0%</b></div>');
setInterval(function(){
var f=document.getElementById('progressFill');
var p=document.getElementById('stabPct');
if(f&&p)p.textContent=f.style.width||'0%';
},500);
}

console.log('%cCINEMA PACK active','color:#ffd93d;font-family:monospace');
})();