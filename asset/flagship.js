/* ===== FLAGSHIP PACK — mic blow + vortex + haptics + gyro =====
   additive: gak nyentuh kode lama. rollback = hapus script tag-nya.
================================================================= */
(function(){
'use strict';

/* 1) haptics — numpang lewat playSound */
var _play=window.playSound;
var VIB={success:[18,40,24],passed:[15],bubble:[12],victory:[30,60,30,60,80],error:[40]};
window.playSound=function(name){
if(VIB[name]&&navigator.vibrate){try{navigator.vibrate(VIB[name])}catch(e){}}
if(_play)return _play.apply(this,arguments);
};

/* 2) gyro parallax starfield */
var canvas=document.getElementById('starsCanvas');
var px=0,py=0,tx=0,ty=0;
function orient(e){
var g=e.gamma||0,b=e.beta||0;
tx=Math.max(-14,Math.min(14,g*0.35));
ty=Math.max(-10,Math.min(10,(b-40)*0.3));
}
(function loop(){
px+=(tx-px)*0.06;py+=(ty-py)*0.06;
if(canvas)canvas.style.transform='translate3d('+px+'px,'+py+'px,0)';
requestAnimationFrame(loop);
})();
var _enter=window.enterCinematic;
window.enterCinematic=function(){
if(typeof DeviceOrientationEvent!=='undefined'&&DeviceOrientationEvent.requestPermission){
DeviceOrientationEvent.requestPermission().then(function(s){if(s==='granted')window.addEventListener('deviceorientation',orient)}).catch(function(){});
}else{window.addEventListener('deviceorientation',orient)}
if(_enter)return _enter.apply(this,arguments);
};

/* 3) domain vortex — partikel spiral pas overlay aktif */
var overlay=document.getElementById('domainOverlay');
if(overlay){
var vc=document.createElement('canvas');
vc.style.cssText='position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:1';
overlay.appendChild(vc);
var vctx=vc.getContext('2d'),parts=[],running=false,W=0,H=0;
function vresize(){W=vc.width=overlay.clientWidth;H=vc.height=overlay.clientHeight}
function burst(){
vresize();parts=[];
for(var i=0;i<220;i++){
parts.push({a:Math.random()*Math.PI*2,r:80+Math.random()*Math.max(W,H)*0.6,sp:0.012+Math.random()*0.03,fall:0.6+Math.random()*1.6,s:0.6+Math.random()*2,hue:Math.random()<0.3?'162,155,254':(Math.random()<0.5?'255,217,61':'255,255,255')});
}
if(!running){running=true;requestAnimationFrame(vdraw)}
}
function vdraw(){
vctx.clearRect(0,0,W,H);
var cx=W/2,cy=H/2,alive=0;
for(var i=0;i<parts.length;i++){
var p=parts[i];
p.a+=p.sp;p.r-=p.fall+p.r*0.012;
if(p.r>2)alive++;
var x=cx+Math.cos(p.a)*p.r,y=cy+Math.sin(p.a)*p.r*0.72;
var al=Math.max(0,Math.min(1,p.r/(Math.max(W,H)*0.5)));
vctx.fillStyle='rgba('+p.hue+','+(0.15+al*0.8)+')';
vctx.beginPath();vctx.arc(x,y,p.s,0,6.283);vctx.fill();
}
if(overlay.classList.contains('active')&&alive){requestAnimationFrame(vdraw)}
else{running=false;vctx.clearRect(0,0,W,H)}
}
new MutationObserver(function(){if(overlay.classList.contains('active'))burst()}).observe(overlay,{attributes:true,attributeFilter:['class']});
}

/* 4) mic blow — tiup beneran ke HP */
var micOn=false,micStream=null,micCtx=null;
function stopMic(){
micOn=false;
if(micStream)micStream.getTracks().forEach(function(t){t.stop()});
if(micCtx)micCtx.close().catch(function(){});
var b=document.getElementById('micBtn');if(b)b.textContent='🎤 TIUP PAKE MIC';
}
function toggleMic(){
if(micOn){stopMic();showToast('Mic mati 🔇');return}
if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia){showToast('Browser gak dukung mic 😭 pake tombol biasa');return}
navigator.mediaDevices.getUserMedia({audio:true}).then(function(stream){
micStream=stream;
micCtx=new (window.AudioContext||window.webkitAudioContext)();
var src=micCtx.createMediaStreamSource(stream);
var an=micCtx.createAnalyser();an.fftSize=512;
src.connect(an);
var data=new Uint8Array(an.frequencyBinCount);
micOn=true;
var hits=0;
document.getElementById('micBtn').textContent='🎤 MIC AKTIF — TIUP!';
showToast('Mic aktif. tiup beneran ke HP lu 💨');
(function tick(){
if(!micOn)return;
an.getByteFrequencyData(data);
var sum=0;for(var i=0;i<data.length;i++)sum+=data[i];
var level=sum/data.length;
if(level>50){hits++}else{hits=Math.max(0,hits-2)}
if(hits>12){hits=0;stopMic();blowCandle()}
requestAnimationFrame(tick);
})();
}).catch(function(){showToast('Mic ditolak 😭 pake tombol biasa aja')});
}
(function addMicBtn(){
var anchor=document.querySelector('#screen-victory .btn.danger');
if(!anchor)return;
var btn=document.createElement('button');
btn.id='micBtn';btn.className='btn';btn.textContent='🎤 TIUP PAKE MIC';
btn.onclick=toggleMic;
anchor.parentNode.insertBefore(btn,anchor);
var vic=document.getElementById('screen-victory');
new MutationObserver(function(){if(!vic.classList.contains('active'))stopMic()}).observe(vic,{attributes:true,attributeFilter:['class']});
})();

console.log('%cFLAGSHIP PACK active — mic, vortex, haptics, gyro','color:#ffd93d;font-family:monospace');
})();