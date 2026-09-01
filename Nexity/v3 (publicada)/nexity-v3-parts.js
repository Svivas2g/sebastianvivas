/* ═══ v3 partes: tablero de 4 estados, Chart Builder, tema, detalles ═══ */
(()=>{
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
const COARSE=matchMedia('(pointer:coarse)').matches;

/* ── tema ── */
const root=document.documentElement,tgl=$('#tgl');
const setTheme=t=>{root.dataset.theme=t;try{localStorage.setItem('nexity-theme',t)}catch(e){}
if(tgl){tgl.setAttribute('aria-pressed',t==='light');tgl.setAttribute('aria-label',t==='light'?'Cambiar a tema oscuro':'Cambiar a tema claro')}};
setTheme(root.dataset.theme==='light'?'light':'dark');
tgl&&tgl.addEventListener('click',()=>setTheme(root.dataset.theme==='light'?'dark':'light'));

/* ── Chart Builder ── */
const CB={mes:{l:'Ingresos por mes',x:['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago'],v:[38,52,45,68,61,83,74,96]},
region:{l:'Ingresos por región',x:['Norte','Centro','Sur','Caribe','Oriente'],v:[92,74,48,61,35]},
canal:{l:'Ingresos por canal',x:['Directo','Aliados','Digital','Licitación'],v:[86,58,71,42]},
asesor:{l:'Ingresos por asesor',x:['A. Ríos','M. Peña','J. Soto','L. Cruz','D. Vega','P. Mora'],v:[78,64,91,52,69,44]}};
const plot=$('#cbPlot'),xax=$('#cbX'),cap=$('#cbCap');
let cbType='bars',cbKey='mes';
const smooth=(pts)=>{let d=`M${pts[0][0]},${pts[0][1]}`;for(let i=1;i<pts.length;i++){const[x0,y0]=pts[i-1],[x1,y1]=pts[i],mx=(x0+x1)/2;d+=` C${mx},${y0} ${mx},${y1} ${x1},${y1}`}return d};
function draw(){if(!plot)return;const d=CB[cbKey],n=d.v.length;
if(cbType==='bars'){plot.innerHTML=`<div class="cb-bars">${d.v.map((v,i)=>`<i style="height:${v}%;animation-delay:${(i*.055).toFixed(3)}s"></i>`).join('')}</div>`}
else{const pts=d.v.map((v,i)=>[n===1?0:i/(n-1)*100,100-v]);const path=smooth(pts);
plot.innerHTML=`<svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${cbType==='area'?`<defs><linearGradient id="cbg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2F6BFF" stop-opacity=".34"/><stop offset="1" stop-color="#2F6BFF" stop-opacity="0"/></linearGradient></defs><path d="${path} L100,100 L0,100Z" fill="url(#cbg)"/>`:''}<path d="${path}" fill="none" stroke="#2F6BFF" stroke-width="2" vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round"/>${pts.map(([x,y])=>`<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="3" fill="var(--ink3)" stroke="#2F6BFF" stroke-width="1.6" vector-effect="non-scaling-stroke"/>`).join('')}</svg>`}
xax.innerHTML=d.x.map(l=>`<span>${l}</span>`).join('');
cap.textContent=d.l+' · '+n+' valores · '+({bars:'barras',line:'líneas',area:'área'})[cbType];
$$('#cbTypes .cb-b').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.t===cbType)));
$$('#cbFields .cb-b').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.k===cbKey)))}
$$('#cbTypes .cb-b').forEach(b=>b.addEventListener('click',()=>{cbType=b.dataset.t;draw()}));
$$('#cbFields .cb-b').forEach(b=>b.addEventListener('click',()=>{cbKey=b.dataset.k;draw()}));
draw();

/* ── tablero de 4 estados ── */
const s4=$('#soluciones'),dash=$('#dash'),steps=$$('#s4Steps .s4-step');
const TITLES=['Tablero corporativo','Módulos activos','Chart Builder','Alerta por umbral'];
const dTop=$('#dTop');
let sState=-1;
const setState=i=>{if(i===sState)return;sState=i;dash.dataset.s=i;dTop.textContent=TITLES[i]||TITLES[0];steps.forEach((b,k)=>{b.classList.toggle('on',k===i);b.setAttribute('aria-current',k===i?'step':'false')})};
setState(0);
const STATES=4;
function s4Size(){if(!s4)return;if(innerWidth<=900){s4.style.height='';return}s4.style.height=(innerHeight+innerHeight*.62*(STATES-1))+'px'}
function s4Scroll(){if(!s4||innerWidth<=900)return;const r=s4.getBoundingClientRect(),h=Math.max(1,s4.offsetHeight-innerHeight);const p=Math.min(1,Math.max(0,-r.top/h));setState(Math.min(STATES-1,Math.floor(p*STATES*.999)))}
s4Size();
new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)dash.classList.add('live')}),{threshold:.12}).observe(dash);
steps.forEach((b,i)=>b.addEventListener('click',()=>{if(innerWidth<=900){setState(i);return}const h=s4.offsetHeight-innerHeight;scrollTo({top:s4.offsetTop+h*((i+.5)/STATES),behavior:RM?'auto':'smooth'})}));

/* ── barra de progreso de lectura ── */
const rp=$('#rpBar');
/* ── indicador de sección ── */
const sind=$('#sind');
const secs=$$('main section[id]').map(s=>({el:s,id:s.id,l:s.dataset.screenLabel||s.id}));
sind.innerHTML=secs.map(s=>`<a class="si" href="#${s.id}" data-i="${s.id}"><span class="si-l">${s.l}</span><em></em></a>`).join('');
const sils=$$('.si',sind);
let lastId='';
function chrome(){const doc=document.documentElement,h=Math.max(1,(doc.scrollHeight||document.body.scrollHeight)-innerHeight),y=scrollY||doc.scrollTop||0;
if(rp)rp.style.width=Math.min(100,Math.max(0,y/h*100)).toFixed(2)+'%';
sind.classList.toggle('on',y>innerHeight*.7);
let cur='';for(const s of secs){const r=s.el.getBoundingClientRect();if(r.top<=innerHeight*.45&&r.bottom>innerHeight*.3){cur=s.id;break}}
if(cur&&cur!==lastId){lastId=cur;sils.forEach(a=>a.classList.toggle('on',a.dataset.i===cur))}}

/* ── glow que sigue el cursor ── */
const hero=$('#hero'),glow=$('#hglow');
if(!COARSE&&!RM&&hero&&glow)hero.addEventListener('pointermove',e=>{const r=hero.getBoundingClientRect();glow.style.setProperty('--gx',((e.clientX-r.left)/r.width*100).toFixed(1)+'%');glow.style.setProperty('--gy',((e.clientY-r.top)/r.height*100).toFixed(1)+'%')},{passive:true});

/* ── bucle propio (rAF + respaldo por eventos) ── */
let ly=-1;
function upd(){const y=scrollY||document.documentElement.scrollTop||0;if(y!==ly){ly=y;s4Scroll();chrome()}}
function frame(){upd();requestAnimationFrame(frame)}
requestAnimationFrame(frame);
addEventListener('scroll',upd,{passive:true});
addEventListener('resize',()=>{ly=-1;s4Size();upd()});
chrome();s4Scroll();
})();
