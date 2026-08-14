/* ===== WARM PACK — svg accents biar gak kering ===== */
(function(){
'use strict';
function wic(n,c){
var S='<svg class="wi" style="color:'+c+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">';
var F='<svg class="wi" style="color:'+c+'" viewBox="0 0 24 24" fill="currentColor" stroke="none">';
var m={
trophy:[S,'<path d="M8 21h8"/><path d="M12 17v4"/><path d="M7 4h10v4a5 5 0 0 1-10 0z"/><path d="M7 5H4a2 2 0 0 0 2 4h1"/><path d="M17 5h3a2 2 0 0 1-2 4h-1"/>'],
bolt:[F,'<path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z"/>'],
moon:[F,'<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>'],
heart:[F,'<path d="M12 21s-8-5.3-8-11a4.6 4.6 0 0 1 8-3.1A4.6 4.6 0 0 1 20 10c0 5.7-8 11-8 11z"/>'],
coffee:[S,'<path d="M17 8h1a4 4 0 0 1 0 8h-1"/><path d="M3 8h14v6a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4z"/><path d="M7 2v2"/><path d="M11 2v2"/>'],
spark:[F,'<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/>'],
flower:[F,'<circle cx="12" cy="6" r="3"/><circle cx="6.5" cy="10" r="3"/><circle cx="8.5" cy="16.5" r="3"/><circle cx="15.5" cy="16.5" r="3"/><circle cx="17.5" cy="10" r="3"/><circle cx="12" cy="11.5" r="2.2" fill="#ffd93d"/>'],
star:[F,'<path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.7-6.2 3.7 1.6-7L2 9.2l7.1-.6z"/>']
};
var e=m[n];return e[0]+e[1]+'</svg>';
}
var st=document.createElement('style');
st.textContent='.wi{width:1.05em;height:1.05em;vertical-align:-.15em;margin:0 .18em}';
document.head.appendChild(st);
function put(sel,html,pre){
document.querySelectorAll(sel).forEach(function(el){
if(el.dataset.warm)return;el.dataset.warm='1';
var t=el.textContent.trim();
el.innerHTML=pre?html+'<span>'+t+'</span>':'<span>'+t+'</span>'+html;
});
}
put('#screen-start .badge',wic('trophy','#ffd93d'),true);
put('#screen-domain .topbar .badge:first-child',wic('bolt','#4dd0e1'),true);
put('#screen-victory .title',wic('trophy','#ffd93d'),false);
put('.make-wish',wic('moon','#a29bfe'),true);
put('#screen-message .title',wic('flower','#ff9ff3'),false);
put('.joke',wic('coffee','#ffd93d'),false);
put('.sign',wic('heart','#ff6b81'),true);
put('#secretModal h3',wic('spark','#a29bfe'),true);

/* positive box: ikutin showPositive */
var _sp=window.showPositive;
window.showPositive=function(){
var r=_sp.apply(this,arguments);
var box=document.getElementById('positiveBox');
if(box&&!box.querySelector('.wi')){box.innerHTML=wic('spark','#ffd93d')+'<span>'+box.textContent+'</span>'}
return r;
};

/* toast: icon ngikutin konteks */
var _t=window.showToast;
window.showToast=function(msg){
var r=_t.apply(this,arguments);
var t=document.getElementById('toast');
if(t&&!t.querySelector('.wi')){
var n='spark',c='#a29bfe';
if(/kopi/i.test(msg)){n='coffee';c='#ffd93d'}
else if(/bintang|star/i.test(msg)){n='star';c='#ffd93d'}
else if(/lilin|ultah|birthday/i.test(msg)){n='heart';c='#ff6b81'}
t.innerHTML=wic(n,c)+'<span>'+msg+'</span>';
}
return r;
};
console.log('%cWARM PACK active','color:#ff9ff3;font-family:monospace');
})();