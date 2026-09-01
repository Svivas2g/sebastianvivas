/* Interacciones — requiere nexity-v3-content.js */
document.getElementById('app').innerHTML=NX.html;
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
const COARSE=matchMedia('(pointer:coarse)').matches;
const nf=(v,d)=>v.toLocaleString('es-CO',{minimumFractionDigits:d,maximumFractionDigits:d});

/* ── precarga: el logo se dibuja ── */
const pre=$('#pre');
$$('#pre [data-draw]').forEach(el=>{const l=el.getTotalLength?el.getTotalLength():120;el.style.setProperty('--l',l.toFixed(1))});
const hidePre=()=>{pre.classList.add('done');setTimeout(()=>pre.remove(),900)};
if(RM)hidePre();else setTimeout(hidePre,1750);

/* ── relojes ── */
const CITIES=[['BOG','America/Bogota'],['CDMX','America/Mexico_City'],['MAD','Europe/Madrid'],['NYC','America/New_York']];
const ch=$('#clocks');
ch.innerHTML=CITIES.map(([c])=>`<div class="clock"><b>${c}</b><span data-c="${c}">--:--:--</span></div>`).join('');
const tick=()=>{const d=new Date();CITIES.forEach(([c,tz])=>{const el=ch.querySelector(`[data-c="${c}"]`);if(el)el.textContent=d.toLocaleTimeString('es-CO',{timeZone:tz,hour12:false,hour:'2-digit',minute:'2-digit',second:'2-digit'})})};
tick();setInterval(tick,1000);

/* ── marquesina, planes, preguntas, archivos ── */
const mqHtml=NX.MQ.map(([l,v,d,dn])=>`<span class="mq-i">${l}<b>${v}</b><em${dn?' class="dn"':''}>${d}</em></span>`).join('');
$('#mqA').innerHTML=mqHtml;$('#mqB').innerHTML=mqHtml;
$('#plans').innerHTML=NX.PLANES.map(p=>`<div class="plan rv${p.hi?' hi':''}"><div class="hd"><h3>${p.n}</h3>${p.hi?'<span class="tagph">Recomendado</span>':''}</div><div><div class="price">${p.p}</div><div class="per">${p.per}</div></div><p class="who">${p.who}</p><ul>${p.f.map(f=>`<li><i><svg width="9" height="9" viewBox="0 0 10 10" fill="none" aria-hidden="true"><path d="M1.6 5.2 3.9 7.4 8.4 2.6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg></i><span>${f}</span></li>`).join('')}</ul><a class="btn mag ${p.hi?'btn-p':'btn-g'}" href="#demo">${p.hi?'Solicitar demo':'Hablar con ventas'}</a></div>`).join('');
$('#faq').innerHTML=NX.QA.map(([cat,items])=>`<div class="faq-g rv"><div class="faq-cat">${cat}</div><div class="faq">${items.map(([q,a])=>`<details><summary>${q}</summary><p>${a}</p></details>`).join('')}</div></div>`).join('');
const chaos=$('#chaos');
chaos.innerHTML=NX.FILES.map((f,i)=>{const[x,y,r]=NX.POS[i]||[0,0,0];return `<div class="fcard" style="--x:${x}vw;--y:${y}vh;--rt:${r}deg"><i>${f[1]}</i><b>${f[0]}</b></div>`}).join('');

/* ── reveals ── */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{rootMargin:'0px 0px -8%'});
const mount=()=>$$('.rv:not(.in)').forEach((el,i)=>{el.style.transitionDelay=(el.dataset.d||Math.min(i%6*60,300))+'ms';io.observe(el)});
mount();
const forceIn=()=>$$('.rv:not(.in)').forEach(el=>{if(el.getBoundingClientRect().top<innerHeight*1.1)el.classList.add('in')});
setTimeout(forceIn,1100);addEventListener('load',forceIn);document.addEventListener('visibilitychange',()=>{if(!document.hidden)forceIn()});
addEventListener('beforeprint',()=>$$('.rv').forEach(el=>el.classList.add('in')));

/* ── nav y menú ── */
const nav=$('#nav'),sheet=$('#sheet'),burger=$('#burger');
/* la nav expandida se habilita midiendo el ancho que realmente pide la fila */
function navFit(){if(innerWidth<=900||!$('.nav-in')){nav.classList.remove('narrow','tight');return}
nav.classList.remove('narrow','tight');
const inn=$('.nav-in'),links=$('.links'),more=$('.links .more'),nr=$('.nav-r'),brand=$('.brand'),bgEl=$('.nav-bg');
const cs=getComputedStyle(inn),gap=parseFloat(cs.columnGap)||0,pad=parseFloat(cs.paddingLeft)+parseFloat(cs.paddingRight),w=el=>el.getBoundingClientRect().width;
const pm=more.style.cssText;
more.style.cssText='transition:none;max-width:none;opacity:1';
const base=pad+gap*2+parseFloat(getComputedStyle(links).marginLeft)+w(brand)+w(nr);
const needFull=base+w(links),wMore=w(more)+gap;
more.style.cssText=pm;
const avail=w(bgEl)-8;
if(needFull<=avail)return;
nav.classList.add('narrow');
if(needFull-wMore+w(burger)+gap>avail)nav.classList.add('tight')}
navFit();if(document.fonts&&document.fonts.ready)document.fonts.ready.then(navFit);
burger.addEventListener('click',()=>{const o=sheet.classList.toggle('open');burger.setAttribute('aria-expanded',o);document.body.style.overflow=o?'hidden':''});
$$('#sheet a').forEach(a=>a.addEventListener('click',()=>{sheet.classList.remove('open');burger.setAttribute('aria-expanded','false');document.body.style.overflow=''}));

/* ── carrusel ── */
const car=$('#car'),slides=$$('.cslide',car),bar=$('#carBar'),lbl=$('#carLbl');
let ci=0,auto;
const goto=i=>{ci=(i+slides.length)%slides.length;car.scrollTo({left:slides[ci].offsetLeft-slides[0].offsetLeft,behavior:RM?'auto':'smooth'})};
const sync=()=>{if(slides.length<2)return;const step=slides[1].offsetLeft-slides[0].offsetLeft||1;ci=Math.max(0,Math.min(slides.length-1,Math.round(car.scrollLeft/step)));if(bar){bar.style.width=(100/slides.length)+'%';bar.style.transform=`translateX(${ci*100}%)`}if(lbl)lbl.textContent=String(ci+1).padStart(2,'0')+' / '+String(slides.length).padStart(2,'0')+' · '+(slides[ci].dataset.t||'')};
const start=()=>{if(RM)return;clearInterval(auto);auto=setInterval(()=>goto(ci+1),5400)};
['pointerdown','wheel','focusin'].forEach(e=>car.addEventListener(e,()=>clearInterval(auto),{passive:true}));
car.addEventListener('pointerenter',()=>clearInterval(auto));car.addEventListener('pointerleave',start);
$('#carPrev')?.addEventListener('click',()=>{clearInterval(auto);goto(ci-1)});
$('#carNext')?.addEventListener('click',()=>{clearInterval(auto);goto(ci+1)});
sync();start();

/* ── escena de consolidación ── */
const merge=$('#merge'),core=$('#core'),ring=$('#ring'),mcopy=$('#mcopy');
const easeOut=t=>1-Math.pow(1-t,2.2);
function mergeScroll(){const r=merge.getBoundingClientRect(),h=Math.max(1,merge.offsetHeight-innerHeight);const p=Math.min(1,Math.max(0,-r.top/h));const e=easeOut(Math.min(1,p/.72));const p2=Math.min(1,Math.max(0,(p-.34)/.36));chaos.style.setProperty('--q',String(1-e));chaos.style.setProperty('--p',e.toFixed(3));core.style.setProperty('--p2',p2.toFixed(3));ring.style.setProperty('--p2',p2.toFixed(3));mcopy.style.opacity=String(1-Math.min(1,Math.max(0,(p-.2)/.2)))}
chaos.style.setProperty('--q','1');chaos.style.setProperty('--p','0');core.style.setProperty('--p2','0');ring.style.setProperty('--p2','0');

/* ── tablero 3D en el hero ── */
const hero=$('#hero'),stageCar=$('.stage .lap');
function tilt(){if(RM)return;const p=Math.min(1,Math.max(0,-hero.getBoundingClientRect().top/Math.max(1,innerHeight*.85)));stageCar.style.transform=`rotateX(${(9-9*p).toFixed(2)}deg) scale(${(1-p*.04).toFixed(3)})`}

/* ── módulos en scroll horizontal ── */
const hmod=$('#capacidades'),track=$('#hmodTrack'),hbar=$('#hmodBar');
let hRange=0;
function hmodSize(){if(innerWidth<=900){hmod.style.height='';track.style.transform='';return}const pad=parseFloat(getComputedStyle(track).paddingLeft)||0;hRange=Math.max(0,track.scrollWidth-innerWidth+pad);hmod.style.height=(innerHeight+hRange*1.15)+'px'}
function hmodScroll(){if(innerWidth<=900)return;const r=hmod.getBoundingClientRect(),h=Math.max(1,hmod.offsetHeight-innerHeight);const p=Math.min(1,Math.max(0,-r.top/h));track.style.transform=`translate3d(${-(p*hRange).toFixed(1)}px,0,0)`;hbar.style.transform=`translateX(${(p*(100/0.22-100)).toFixed(2)}%)`}
hmodSize();

/* ── bucle + respaldo por eventos ── */
let lastY=-1,lastCL=-1;
function upd(){const y=scrollY||document.documentElement.scrollTop||0;if(y!==lastY){lastY=y;nav.classList.toggle('stuck',y>70);mergeScroll();tilt();hmodScroll()}const cl=car.scrollLeft;if(cl!==lastCL){lastCL=cl;sync()}}
function frame(){upd();requestAnimationFrame(frame)}
requestAnimationFrame(frame);
addEventListener('scroll',upd,{passive:true});
car.addEventListener('scroll',upd,{passive:true});
addEventListener('resize',()=>{lastY=-1;lastCL=-1;navFit();hmodSize();upd()});
upd();

/* ── contadores de resultados ── */
const cio=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;cio.unobserve(e.target);const el=e.target,to=+el.dataset.to,suf=el.dataset.suf||'',t0=performance.now(),dur=RM?0:1100;const f=n=>{const k=Math.min(1,(n-t0)/dur||1),v=Math.round(to*(1-Math.pow(1-k,3)));el.textContent=v.toLocaleString('es-CO')+suf;if(k<1)requestAnimationFrame(f)};requestAnimationFrame(f)}),{threshold:.6});
$$('[data-to]').forEach(el=>cio.observe(el));

/* ── indicadores en vivo ── */
const lives=$$('[data-live]').map(el=>({el,v:parseFloat(el.dataset.live),dec:+(el.dataset.dec||0),step:parseFloat(el.dataset.step||'1'),fmt:el.dataset.fmt||'{v}'}));
function liveTick(){if(RM)return;lives.forEach(o=>{const d=(Math.random()-.42)*o.step*2;o.v=Math.max(0,o.v+d);o.el.textContent=o.fmt.replace('{v}',nf(o.v,o.dec));o.el.classList.add('flash');setTimeout(()=>o.el.classList.remove('flash'),640)})}
setInterval(liveTick,2800);

/* ── cursor magnético ── */
if(!COARSE&&!RM){const cur=$('#cur');let cx=innerWidth/2,cy=innerHeight/2,tx=cx,ty=cy;
addEventListener('pointermove',e=>{tx=e.clientX;ty=e.clientY;cur.classList.add('vis')},{passive:true});
addEventListener('pointerleave',()=>cur.classList.remove('vis'));
(function loop(){cx+=(tx-cx)*.18;cy+=(ty-cy)*.18;cur.style.transform=`translate(${cx.toFixed(1)}px,${cy.toFixed(1)}px) translate(-50%,-50%)`;requestAnimationFrame(loop)})();
const HOT='a,button,summary,.mcard,.kpi,input,select';
document.addEventListener('pointerover',e=>{if(e.target.closest(HOT))cur.classList.add('on')});
document.addEventListener('pointerout',e=>{if(e.target.closest(HOT)&&!(e.relatedTarget&&e.relatedTarget.closest&&e.relatedTarget.closest(HOT)))cur.classList.remove('on')});
$$('.mag').forEach(b=>{b.addEventListener('pointermove',e=>{const r=b.getBoundingClientRect();const dx=(e.clientX-(r.left+r.width/2))/(r.width/2),dy=(e.clientY-(r.top+r.height/2))/(r.height/2);b.style.transform=`translate(${(dx*7).toFixed(1)}px,${(dy*5-2).toFixed(1)}px)`});b.addEventListener('pointerleave',()=>{b.style.transform=''})})}

/* ── formulario ── */
const form=$('#form');
form.addEventListener('submit',e=>{e.preventDefault();let ok=true;$$('[data-req]',form).forEach(i=>{const box=i.closest('.field').querySelector('.err');let msg='';if(!i.value.trim())msg='Campo obligatorio';else if(i.type==='email'&&!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(i.value))msg='Correo no válido';box.textContent=msg;i.setAttribute('aria-invalid',msg?'true':'false');if(msg){if(ok)i.focus();ok=false}});
if(!ok)return;const n=$('#f-nombre').value.trim().split(' ')[0];form.innerHTML=`<div class="ok" role="status"><b>Solicitud recibida</b><p>Gracias${n?', '+n:''}. Un especialista te escribe en menos de 24 horas hábiles para coordinar la demo.</p></div>`});

/* ── CTA flotante ── */
const fab=$('#fab'),demo=$('#demo');
new IntersectionObserver(es=>es.forEach(e=>fab.classList.toggle('on',!e.isIntersecting)),{threshold:.08}).observe(hero);
new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)fab.classList.remove('on')}),{threshold:.1}).observe(demo);

/* ── titular y link activo ── */
setTimeout(()=>$('#h1b')?.classList.add('on'),RM?0:1900);
const spy=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)$$('.links a').forEach(a=>a.classList.toggle('on',a.getAttribute('href')==='#'+e.target.id))}),{rootMargin:'-45% 0px -50%'});
$$('main section[id]').forEach(s=>spy.observe(s));
