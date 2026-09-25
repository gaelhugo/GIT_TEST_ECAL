// Adaptation animée de Five Pointed Star with Color Bands (1992)
// Dessin Canvas : étoiles concentriques, croissance et rotation en spirale.

'use strict';
const canvas=document.querySelector('#art'),ctx=canvas.getContext('2d');
const toggle=document.querySelector('#toggle'),speed=document.querySelector('#speed'),twist=document.querySelector('#twist');
const colors=['#248fc0','#e44948','#1e2b43','#a89950','#d84e4e','#235a78','#e17a39','#a9a9a2'];
const ratio=.43, growth=1.28;
let phase=0,rotation=0,running=!matchMedia('(prefers-reduced-motion: reduce)').matches,last=0;
if(!running)toggle.textContent='Lecture';
function star(cx,cy,outer,turn){
  ctx.beginPath();
  for(let i=0;i<10;i++){
    const angle=-Math.PI/2+i*Math.PI/5+turn;
    const radius=outer*(i%2?ratio:1);
    const x=cx+Math.cos(angle)*radius,y=cy+Math.sin(angle)*radius;
    if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
  }
  ctx.closePath();
}
function draw(){
  const box=canvas.getBoundingClientRect();if(!box.width||!box.height)return;
  const dpr=Math.min(devicePixelRatio||1,2),w=box.width,h=box.height;
  if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){
    canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);
  }
  ctx.setTransform(dpr,0,0,dpr,0,0);
  ctx.fillStyle='#1e2b43';ctx.fillRect(0,0,w,h);
  const step=Math.floor(phase),fraction=phase-step;
  const base=Math.min(w,h)*.022;
  const count=Math.ceil(Math.log(Math.max(w,h)*4/base)/Math.log(growth))+1;
  for(let i=count;i>=0;i--){
    const r=base*Math.pow(growth,i+fraction);
    // Chaque étoile prend un peu d'avance sur la précédente : les bandes forment une spirale.
    // (i + fraction) maintient la continuité lorsqu'une nouvelle étoile naît au centre.
    star(w/2,h/2,r,rotation+(i+fraction)*Number(twist.value));
    // Le décalage des couleurs garde la continuité quand une nouvelle étoile apparaît.
    const colorIndex=((i-step)%colors.length+colors.length)%colors.length;
    ctx.fillStyle=colors[colorIndex];ctx.fill();
  }
}
function tick(time){
  if(last&&running){
    const delta=Math.min(time-last,80)/1000,rate=Number(speed.value);
    phase+=delta*rate/2.8;
    rotation+=delta*rate*.28;
  }
  last=time;draw();requestAnimationFrame(tick);
}
toggle.addEventListener('click',()=>{running=!running;toggle.textContent=running?'Pause':'Lecture'});
document.querySelector('#restart').addEventListener('click',()=>{phase=0;rotation=0;draw()});
twist.addEventListener('input',draw);
requestAnimationFrame(tick);
