/* ===== SVG PACK — full svg, zero emoji, adaptive quality ===== */
(function(){
'use strict';

/* adaptive quality probe */
(function(){
var n=0,t0=performance.now();
function f(){
n++;
var dt=performance.now()-t0;
if(dt<1200){requestAnimationFrame(f)}
else{if(n/(dt/1000)<45)document.body.classList.add('low')}
}
requestAnimationFrame(f);
})();

/* inject css */
var st=document.createElement('style');
st.textContent=[
'body.low .card{backdrop-filter:none;-webkit-backdrop-filter:none;background:rgba(18,14,34,.94)}',
'body.low .modal-card{backdrop-filter:none;-webkit-backdrop-filter:none;background:rgba(16,14,28,.97)}',
'body.low .modal{backdrop-filter:none;-webkit-backdrop-filter:none}',
'body.low .btn{backdrop-filter:none;-webkit-backdrop-filter:none}',
'body.low .aurora{display:none}',
'.btn svg{width:15px;height:15px;flex:none}',
'.hollow-btn{display:inline-flex;align-items:center;gap:8px;justify-content:center}',
'.hollow-btn svg{width:16px;height:16px;flex:none}',
'.cake-svg{width:min(280px,82%);margin:26px auto 10px;display:block;cursor:pointer;filter:drop-shadow(0 24px 36px rgba(0,0,0,.34))}',
'#flame{transform-box:fill-box;transform-origin:50% 90%;animation:flick2 .35s infinite alternate}',
'@keyframes flick2{from{transform:scale(1) rotate(-2deg)}to{transform:scale(1.12) rotate(2deg)}}',
'#flame.out{animation:none;opacity:0;transform:scale(.1);transition:all .5s ease}',
'#smoke{opacity:0}',
'#smoke.show{animation:smk 1.6s ease-out forwards}',
'@keyframes smk{from{opacity:.9;transform:translateY(0) scale(.7)}to{opacity:0;transform:translateY(-46px) scale(1.5)}}',
'.star svg{width:70%;height:70%}',
'.star.done svg{filter:drop-shadow(0 0 8px rgba(255,215,0,.65))}'
].join('');
document.head.appendChild(st);

/* icon helper */
function ic(n){
var S='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">';
var F='<svg viewBox="0 0 24 24" fill="currentColor" stroke="none">';
var m={
play:[F,'<path d="M8 5v14l11-7z"/>'],
bolt:[F,'<path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z"/>'],
spark:[F,'<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/>'],
ff:[F,'<path d="M13 19l9-7-9-7v14z"/><path d="M2 19l9-7-9-7v14z"/>'],
flame:[F,'<path d="M12 2s5 4.6 5 9a5 5 0 0 1-10 0c0-1.5.5-3 1.5-4.5 0 0 .5 2 2 2.5C10 6.5 12 2 12 2z"/>'],
star:[F,'<path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.7-6.2 3.7 1.6-7L2 9.2l7.1-.6z"/>'],
expand:[S,'<path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3"/>'],
music:[S,'<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>'],
mic:[S,'<path d="M12 2a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/><path d="M19 10v1a7 7 0 0 1-14 0v-1"/><path d="M12 18v4"/>'],
rotate:[S,'<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>'],
sword:[S,'<path d="M14.5 17.5L3 6V3h3l11.5 11.5"/><path d="M13 19l6-6"/><path d="M16 16l4 4"/><path d="M19 21l2-2"/>'],
clap:[S,'<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 8h20"/><path d="M7 4l3 4"/><path d="M12 4l3 4"/>'],
x:[S,'<path d="M18 6L6 18M6 6l12 12"/>']
};
var e=m[n];return e[0]+e[1]+'</svg>';
}
function setBtn(sel,name,label){
document.querySelectorAll(sel).forEach(function(b){b.innerHTML=ic(name)+'<span>'+label+'</span>'});
}
setBtn('[onclick="enterCinematic()"]','clap','MULAI OPENING');
setBtn('[onclick="startDomain()"]','sword','UNLEASH DOMAIN (START)');
setBtn('[onclick="toggleFullscreen()"]','expand','FULLSCREEN');
setBtn('[onclick="toggleMusic()"]','music','PLAY MUSIC');
setBtn('[onclick="openSecret()"]','spark','HOLLOW PURPLE: SECRET MEMORY');
setBtn('[onclick="continueDomain()"]','bolt','CONTINUE DOMAIN');
setBtn('[onclick="skipChallenges()"]','ff','SKIP');
setBtn('#screen-victory .btn.danger','flame','TIUP LILIN SEKARANG (KLIK SINI)');
setBtn('[onclick="showPositive()"]','star','PESAN POSITIF SIFTA');
setBtn('[onclick="resetAll()"]','rotate','PLAY AGAIN');
setBtn('[onclick="nextSecret()"]','rotate','GANTI MEMORY');
setBtn('[onclick="closeSecret()"]','x','');
setBtn('[onclick="closeChallenge()"]','x','');
var mb=document.getElementById('micBtn');
if(mb)mb.innerHTML=ic('mic')+'<span>TIUP PAKE MIC</span>';

/* svg cake */
var cake=document.querySelector('.cake');
if(cake){
cake.outerHTML=
'<svg class="cake-svg" viewBox="0 0 260 270" aria-label="kue ulang tahun">'+
'<defs>'+
'<linearGradient id="cb" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff9ff3"/><stop offset="1" stop-color="#f368e0"/></linearGradient>'+
'<linearGradient id="cm" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffeaa7"/><stop offset="1" stop-color="#fdcb6e"/></linearGradient>'+
'<linearGradient id="ct" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#a29bfe"/><stop offset="1" stop-color="#6c5ce7"/></linearGradient>'+
'<linearGradient id="cf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff7ae"/><stop offset=".55" stop-color="#ffb142"/><stop offset="1" stop-color="#ff6b6b"/></linearGradient>'+
'<radialGradient id="cg"><stop offset="0" stop-color="rgba(255,180,80,.3)"/><stop offset="1" stop-color="rgba(255,180,80,0)"/></radialGradient>'+
'</defs>'+
'<circle cx="130" cy="100" r="85" fill="url(#cg)"/>'+
'<ellipse cx="130" cy="246" rx="116" ry="15" fill="rgba(255,255,255,.13)"/>'+
'<rect x="20" y="168" width="220" height="72" rx="20" fill="url(#cb)"/>'+
'<path d="M20 168h220v6q-22 16-44 0q-22 16-44 0q-22 16-44 0q-22 16-44 0q-22 16-44 0z" fill="#ffe3f3"/>'+
'<rect x="45" y="112" width="170" height="62" rx="18" fill="url(#cm)"/>'+
'<path d="M45 112h170v5q-17 13-34 0q-17 13-34 0q-17 13-34 0q-17 13-34 0q-17 13-34 0z" fill="#fff3d6"/>'+
'<rect x="70" y="62" width="120" height="56" rx="16" fill="url(#ct)"/>'+
'<path d="M70 62h120v5q-15 12-30 0q-15 12-30 0q-15 12-30 0q-15 12-30 0z" fill="#e6e2ff"/>'+
'<path d="M130 96c-6-8-16-4-16 3c0 6 8 10 16 15c8-5 16-9 16-15c0-7-10-11-16-3z" fill="#ff6b81"/>'+
'<rect x="123" y="20" width="14" height="46" rx="5" fill="#fff"/>'+
'<rect x="123" y="28" width="14" height="6" rx="3" fill="#ff6b6b"/>'+
'<rect x="123" y="40" width="14" height="6" rx="3" fill="#ff6b6b"/>'+
'<rect x="123" y="52" width="14" height="6" rx="3" fill="#ff6b6b"/>'+
'<rect x="128.5" y="12" width="3" height="8" rx="1.5" fill="#444"/>'+
'<g id="flame"><path d="M130 0C123 9 120 13 120 18a10 10 0 0 0 20 0C140 13 137 9 130 0Z" fill="url(#cf)"/><circle cx="130" cy="16" r="4" fill="#fff7ae" opacity=".9"/></g>'+
'<g id="smoke"><circle cx="130" cy="12" r="5" fill="#fff"/><circle cx="134" cy="4" r="3.5" fill="#fff" opacity=".7"/><circle cx="126" cy="2" r="2.5" fill="#fff" opacity=".5"/></g>'+
'</svg>';
document.querySelector('.cake-svg').addEventListener('click',function(){blowCandle()});
}

/* svg stars */
var P='M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.7-6.2 3.7 1.6-7L2 9.2l7.1-.6z';
function svgStar(done){
return '<svg viewBox="0 0 24 24"><path d="'+P+'" fill="'+(done?'#ffd93d':'rgba(255,255,255,.22)')+'" stroke="'+(done?'#ffb142':'rgba(255,255,255,.35)')+'" stroke-width="1.2"/></svg>';
}
var grid=document.getElementById('starGrid');
function swap(){
grid.querySelectorAll('.star').forEach(function(b){
var done=b.classList.contains('done');
var key=done?'1':'0';
if(b.dataset.svg===key)return;
b.dataset.svg=key;
b.innerHTML=svgStar(done);
});
}
if(grid){
new MutationObserver(swap).observe(grid,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
swap();
}

/* svg confetti (override) */
window.confetti=function(count){
var cols=['#ffd93d','#ff9ff3','#a29bfe','#4dd0e1','#ff6b6b','#ffffff'];
var reduced=window.innerWidth<600?0.6:1;
var n=Math.floor((count||120)*reduced);
for(var i=0;i<n;i++){
var el=document.createElement('div');
el.className='confetti-piece';
var s=8+Math.random()*14;
var c=cols[Math.floor(Math.random()*cols.length)];
var t=Math.random();
el.innerHTML=t<0.4?'<svg viewBox="0 0 10 10" width="'+s+'" height="'+s+'"><rect width="10" height="6" y="2" fill="'+c+'"/></svg>'
:(t<0.7?'<svg viewBox="0 0 10 10" width="'+s+'" height="'+s+'"><circle cx="5" cy="5" r="4" fill="'+c+'"/></svg>'
:'<svg viewBox="0 0 24 24" width="'+s+'" height="'+s+'"><path d="'+P+'" fill="'+c+'"/></svg>');
el.style.left=Math.random()*100+'vw';
el.style.animationDuration=(2.8+Math.random()*3.5)+'s';
el.style.animationDelay=(Math.random()*0.8)+'s';
document.body.appendChild(el);
setTimeout(function(e){return function(){e.remove()}}(el),7000);
}
};

/* emoji purge — walker + observer */
var EMO=/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{2190}-\u{21FF}\u{2460}-\u{24FF}\u{FE0F}\u{200D}\u{20E3}\u{2764}\u{2765}\u{00A9}\u{00AE}\u{2122}\u{2139}]/gu;
function purgeNode(n){
var v=n.nodeValue.replace(EMO,'');
if(v!==n.nodeValue)n.nodeValue=v;
}
function purgeEl(root){
if(root.nodeType===3){purgeNode(root);return}
var w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
var t;while(t=w.nextNode())purgeNode(t);
}
purgeEl(document.body);
new MutationObserver(function(muts){
muts.forEach(function(m){
if(m.type==='characterData'){purgeNode(m.target)}
else{m.addedNodes.forEach(function(x){purgeEl(x)})}
});
}).observe(document.body,{subtree:true,childList:true,characterData:true});

/* title + favicon */
document.title='Domain Expansion — Sifta Ainun Nafisa & Akbar';
var fav=document.querySelector('link[rel="icon"]');
if(!fav){fav=document.createElement('link');fav.rel='icon';document.head.appendChild(fav)}
fav.href='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22><path fill=%22%23ffd93d%22 d=%22M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.7-6.2 3.7 1.6-7L2 9.2l7.1-.6z%22/></svg>';

console.log('%cSVG PACK active — zero emoji','color:#4dd0e1;font-family:monospace');
})();