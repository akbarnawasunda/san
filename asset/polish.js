/* ===== POLISH PACK — SVG cake + SVG stars + adaptive quality ===== */
(function(){
'use strict';

/* 1) adaptive quality: probe fps 1.2 detik pertama */
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

/* 2) inject CSS: low tier + svg styling */
var st=document.createElement('style');
st.textContent=[
'body.low .card{backdrop-filter:none;-webkit-backdrop-filter:none;background:rgba(18,14,34,.94)}',
'body.low .modal-card{backdrop-filter:none;-webkit-backdrop-filter:none;background:rgba(16,14,28,.97)}',
'body.low .modal{backdrop-filter:none;-webkit-backdrop-filter:none}',
'body.low .btn{backdrop-filter:none;-webkit-backdrop-filter:none}',
'body.low .aurora{display:none}',
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

/* 3) SVG cake — ganti kue CSS lama */
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

/* 4) SVG stars — ganti emoji di grid */
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

console.log('%cPOLISH PACK active — svg cake, svg stars, adaptive quality','color:#ff9ff3;font-family:monospace');
})();