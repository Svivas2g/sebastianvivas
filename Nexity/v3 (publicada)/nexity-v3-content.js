/* Contenido y marcado compartido por las direcciones tipográficas */
window.NX={};

NX.PLANES=[{n:'Esencial',p:'$ 1.900.000',per:'COP / mes · hasta 15 usuarios',who:'Para equipos que necesitan un tablero único y dejar de consolidar a mano.',f:['Hasta 25 indicadores','3 módulos a elección','Alertas por correo','Implementación en 3 semanas']},{n:'Operación',p:'$ 4.500.000',per:'COP / mes · hasta 60 usuarios',who:'Para empresas con varias áreas reportando y necesidad de trazabilidad.',f:['Indicadores ilimitados','Todos los módulos','Alertas y umbrales por área','Roles y permisos granulares','Acompañamiento mensual'],hi:1},{n:'Corporativo',p:'A medida',per:'Contrato anual · usuarios ilimitados',who:'Para grupos empresariales con múltiples unidades de negocio.',f:['Multi-empresa consolidada','Integraciones con ERP','SSO y auditoría completa','Ambiente dedicado','Equipo asignado']}];

NX.QA=[['Puesta en marcha',[['¿Cuánto tarda la implementación?','Entre 3 y 6 semanas según la cantidad de fuentes. La primera semana levantamos indicadores con cada área y en la segunda ya tienes un tablero navegable con datos reales.'],['¿Tenemos que cambiar nuestros sistemas actuales?','No. Nexity se conecta a lo que ya usas —ERP, hojas de cálculo, bases de datos— y consolida encima. No reemplazamos tus sistemas operativos.'],['¿Quién carga la información?','Las fuentes automáticas se sincronizan solas. Para lo que hoy vive en hojas de cálculo dejamos un cargue guiado con validaciones, para que nadie rompa el formato.']]],['Uso diario',[['¿Necesito un analista para operar la plataforma?','No. El Chart Builder propone la visualización según el tipo de dato y cualquier líder de área puede armar su vista sin escribir una fórmula.'],['¿Qué pasa cuando un indicador se sale de rango?','Se dispara una alerta al responsable con el contexto del indicador y su histórico. La idea es enterarse antes, no en el comité del mes siguiente.']]],['Datos y acceso',[['¿Cómo controlamos quién ve qué?','Con roles por módulo y por indicador. Cada usuario entra con doble factor y queda registro de quién consultó y modificó cada cosa.'],['¿Dónde quedan alojados los datos?','En infraestructura en la nube con cifrado en tránsito y en reposo, y respaldo diario. En el plan corporativo se puede desplegar en un ambiente dedicado.']]]];

NX.FILES=[['ventas_marzo_v3.xlsx','XLS'],['cartera_FINAL_ok.xlsx','XLS'],['nomina_2026.csv','CSV'],['informe_junta.pptx','PPT'],['inventario_bodega2.xlsx','XLS'],['kpis_consolidado.xlsx','XLS'],['recaudo_semana12.csv','CSV'],['reporte_powerbi.pbix','BI'],['metas_2026_v7.xlsx','XLS'],['sla_soporte.xlsx','XLS'],['margen_producto.xlsx','XLS'],['flujo_caja_abr.xlsx','XLS']];
NX.POS=[[-37,-29,-8],[-27,11,6],[-40,27,-4],[-15,-34,7],[-7,31,-8],[10,-27,5],[24,15,-7],[37,-15,8],[30,31,-5],[-31,-7,4],[16,-39,-6],[41,5,7]];

NX.TEAM=[['Jhohan Axelrod','Managing Partner','Benká Group','Lidera la práctica y la relación con las juntas directivas.','JA',''],['Nelson','Dirección de producto','Nexity','Define qué entra al tablero y en qué orden.','N',''],['Melqui','Arquitectura de datos','Nexity','Conecta los sistemas que ya usa el cliente y garantiza que los números cuadren.','M',''],['Sebastián Vivas','Analítica y modelo de datos','Nexity','Traduce la operación de cada empresa a los indicadores que la dirección necesita.','SV','']];
NX.MODS=[['01','Comercial','Pipeline, cumplimiento de meta por asesor y ticket promedio, actualizados cada mañana.','','comercial'],['02','Financiera','Margen, flujo de caja y cartera con la trazabilidad que pide la junta.','b','financiera'],['03','Operaciones','Productividad, costo por unidad y cumplimiento de SLA en un solo lugar.','c','operaciones'],['04','Talento humano','Rotación, ausentismo y costo de nómina por área, sin pedirle el reporte a nadie.','','talento'],['05','Dirección','La vista consolidada del grupo: todas las unidades de negocio comparadas entre sí.','b','direccion']];

NX.MQ=[['Ingresos consolidados','$ 4.812 M','▲ 12,4%',0],['Margen operacional','18,6 %','▲ 1,8 pts',0],['Cartera vencida','$ 612 M','▼ 4,1%',1],['Ticket promedio','$ 2,4 M','▲ 6,0%',0],['Cumplimiento de meta','103,8 %','▲ 3,8 pts',0],['Rotación de personal','7,2 %','▲ estable',0],['Costo por unidad','$ 18.400','▼ 2,2%',1]];

const LOGO=`<svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true"><circle cx="13" cy="13" r="12.1" stroke="currentColor" stroke-opacity=".55" stroke-width="1.2"/><path d="M8.2 18.2V7.8l9.6 10.4V7.8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M8.2 18.2 17.8 7.8" stroke="#2F6BFF" stroke-width="1.8" stroke-linecap="round"/></svg>`;
const BIGLOGO=`<svg viewBox="0 0 26 26" fill="none" aria-hidden="true"><circle data-draw="1" cx="13" cy="13" r="12.1" stroke="currentColor" stroke-opacity=".5" stroke-width=".9"/><path data-draw="2" d="M8.2 18.2V7.8l9.6 10.4V7.8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path data-draw="3" d="M8.2 18.2 17.8 7.8" stroke="#2F6BFF" stroke-width="1.6" stroke-linecap="round"/></svg>`;
const MARK=`<a class="brand" href="#hero" aria-label="Nexity, inicio">${LOGO}Nexity</a>`;
const ARROW=`<span class="ic"><svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M2 6h7M6.5 3 9.5 6l-3 3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg></span>`;
const SPARK=id=>`<div class="spark"><svg viewBox="0 0 300 60" preserveAspectRatio="none" aria-hidden="true"><path d="M0 47 C24 44 30 38 56 40 C82 42 92 28 118 30 C144 32 152 20 180 22 C208 24 214 13 240 11 C266 9 278 6 300 4" stroke="#2F6BFF" stroke-width="1.8" fill="none" stroke-linecap="round"/><path d="M0 47 C24 44 30 38 56 40 C82 42 92 28 118 30 C144 32 152 20 180 22 C208 24 214 13 240 11 C266 9 278 6 300 4 L300 60 L0 60Z" fill="url(#${id})"/><defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2F6BFF" stop-opacity=".28"/><stop offset="1" stop-color="#2F6BFF" stop-opacity="0"/></linearGradient></defs></svg></div>`;
const KPIS=live=>`<div class="kpis">
<div class="kpi"><u>Ingresos del mes</u><v ${live?'data-live="4812" data-fmt="$ {v} M" data-step="7"':''}>$ 4.812 M</v><s>▲ 12,4% vs. junio</s></div>
<div class="kpi"><u>Margen operacional</u><v ${live?'data-live="18.6" data-fmt="{v} %" data-dec="1" data-step=".07"':''}>18,6 %</v><s>▲ 1,8 pts</s></div>
<div class="kpi"><u>Cartera vencida</u><v ${live?'data-live="612" data-fmt="$ {v} M" data-step="3"':''}>$ 612 M</v><s class="dn">▼ 4,1% pendiente</s></div>
<div class="kpi"><u>Rotación de personal</u><v ${live?'data-live="7.2" data-fmt="{v} %" data-dec="1" data-step=".04"':''}>7,2 %</v><s>▲ estable</s></div>
</div>`;

NX.html=`
<div class="pre" id="pre"><div class="pre-mark">${BIGLOGO}<span class="pre-name">Nexity</span></div><div class="pre-bar"><i></i></div></div>
<div class="cur" id="cur" aria-hidden="true"><i></i></div>
<div class="rp" aria-hidden="true"><i id="rpBar"></i></div>
<nav class="sind" id="sind" aria-label="Ir a sección"></nav>

<div class="top"><div class="top-in"><div id="clocks" style="display:flex;gap:24px"></div></div></div>

<header class="nav" id="nav"><div class="nav-bg"></div><div class="nav-in">
${MARK}
<nav class="links" aria-label="Principal"><a href="#soluciones">Soluciones</a><a href="#capacidades">Capacidades</a><span class="more"><a href="#valor">Valor</a><a href="#precios">Precios</a><a href="#preguntas">Preguntas</a><a href="#equipo">Equipo</a></span></nav>
<div class="nav-r">
<a class="enter" href="https://app.nexity.co" target="_blank" rel="noopener">Ingresar<svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true"><path d="M2 9 9 2M9 2H3.8M9 2v5.2" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg></a>
<a class="btn btn-p mag" href="#demo">Solicitar demo</a>
<button class="tgl" id="tgl" aria-pressed="false" aria-label="Cambiar a tema claro"><svg class="sn" width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="8" cy="8" r="3.1" stroke="currentColor" stroke-width="1.3"/><path d="M8 1v1.7M8 13.3V15M1 8h1.7M13.3 8H15M3.1 3.1l1.2 1.2M11.7 11.7l1.2 1.2M12.9 3.1l-1.2 1.2M4.3 11.7l-1.2 1.2" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg><svg class="mn" width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M13.4 9.9A6 6 0 1 1 6.1 2.6a4.7 4.7 0 0 0 7.3 7.3Z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg></button>
<button class="burger" id="burger" aria-label="Abrir menú" aria-expanded="false"><svg width="18" height="12" viewBox="0 0 18 12" fill="none" aria-hidden="true"><path d="M1 1.5h16M1 10.5h16" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg></button>
</div></div></header>

<div class="sheet" id="sheet"><a href="#soluciones">Soluciones</a><a href="#capacidades">Capacidades</a><a href="#valor">Valor</a><a href="#precios">Precios</a><a href="#preguntas">Preguntas</a><a href="#equipo">Equipo</a><a href="https://app.nexity.co" target="_blank" rel="noopener">Ingresar</a><a class="btn btn-p" href="#demo">Solicitar demo${ARROW}</a></div>

<main>
<section class="hero" id="hero" data-screen-label="Inicio">
<div class="hero-bg"><div class="render"></div><div class="render b"></div><div class="grain"></div><div class="veil"></div><div class="hglow" id="hglow" aria-hidden="true"></div></div>
<div class="wrap hero-top">
<h1 class="rv" data-d="70">Toda tu empresa <em id="h1b">en una sola vista</em></h1>
<p class="hero-sub rv" data-d="200">Al día y sin exportar nada. El comité deja de empezar armando el Excel.</p>
<div class="hero-cta rv" data-d="300"><a class="btn btn-p mag" href="#demo">Solicitar demo${ARROW}</a><a class="btn btn-g mag" href="#soluciones">Ver la plataforma</a></div>
<p class="hero-fine rv" data-d="360">30 minutos, con tus propios indicadores.</p>
</div>
<div class="stage" style="min-width:0">
<div class="lap"><div class="lap-lid"><span class="lap-cam"></span><div class="lap-screen">
<div class="car" id="car" tabindex="0" aria-label="Recorrido por la plataforma">

<div class="cslide" data-t="Tablero consolidado"><div class="pan">
<div class="pan-t"><span class="dot"></span><b>Tablero consolidado</b><span class="r">Julio 2026</span></div>
<div class="pan-b">${KPIS(1)}${SPARK('gc1')}</div></div></div>

<div class="cslide" data-t="Chart Builder"><div class="pan">
<div class="pan-t"><span class="dot"></span><b>Chart Builder</b><span class="r">ventas_2026.xlsx</span></div>
<div class="pan-b">
<div class="chips"><span class="chip on">Mes</span><span class="chip on">Ingresos</span><span class="chip">Región</span><span class="chip">Canal</span><span class="chip">Asesor</span></div>
<p style="font-size:13px;color:var(--dim);line-height:1.5">Reconoce el tipo de dato y propone la gráfica que lo explica mejor. Sin fórmulas.</p>
<div class="bars"><i style="height:38%;animation-delay:.05s"></i><i style="height:52%;animation-delay:.11s"></i><i style="height:45%;animation-delay:.17s"></i><i style="height:68%;animation-delay:.23s"></i><i style="height:61%;animation-delay:.29s"></i><i style="height:83%;animation-delay:.35s"></i><i style="height:74%;animation-delay:.41s"></i><i style="height:96%;animation-delay:.47s"></i></div>
</div></div></div>

<div class="cslide" data-t="Alertas por umbral"><div class="pan">
<div class="pan-t"><span class="dot"></span><b>Alertas por umbral</b><span class="r">3 activas</span></div>
<div class="pan-b"><div class="rows">
<div class="row" style="--c:#FF6252"><span class="sev"></span><span>Cartera a 90 días superó el límite</span><span class="m">4 min</span></div>
<div class="row" style="--c:#F5B942"><span class="sev"></span><span>Margen de la línea retail bajó 2,1 pts</span><span class="m">1 h</span></div>
<div class="row" style="--c:#2F6BFF"><span class="sev"></span><span>Meta trimestral regional norte cumplida</span><span class="m">hoy</span></div>
</div>
<p style="font-size:13px;color:var(--dim);line-height:1.5;margin-top:auto">Cada alerta llega al responsable con el histórico y el contexto de la desviación.</p>
</div></div></div>

<div class="cslide" data-t="Un solo acceso"><div class="pan">
<div class="pan-t"><span class="dot"></span><b>Acceso seguro</b><span class="r">Doble factor</span></div>
<div class="pan-b"><div class="otp">
<span class="lbl" style="font-size:10px">Código enviado a j****@empresa.co</span>
<div class="boxes"><i>4</i><i>0</i><i>7</i><i>2</i><i class="f">|</i><i></i></div>
<p>Un solo ingreso para toda la organización, con doble factor y registro de cada consulta.</p>
</div></div></div></div>

</div>
<span class="lap-glare"></span></div></div><div class="lap-base"></div></div>
<div class="prog-line"><i id="carBar"></i></div>
</div>
</section>

<section class="sec stmt over" data-screen-label="Declaración">
<div class="arcs" aria-hidden="true"><i></i><i></i><i></i></div>
<div class="wrap">
<h2 class="rv" data-d="80">Infraestructura para la forma en que decides</h2>
<p class="lede rv" data-d="160" style="margin-top:24px">Dentro y fuera de la operación, Nexity le da a la dirección una manera más silenciosa de saber qué está pasando. Sin pedir reportes, sin esperar el cierre de mes.</p>
<div class="pills rv" data-d="240"><span class="pill">Una sola fuente</span><span class="pill">Sin exportar</span><span class="pill">Trazable</span><span class="pill">En tiempo real</span></div>
</div></section>

<div class="mq" aria-hidden="true"><div class="mq-t" id="mqA"></div><div class="mq-t" id="mqB"></div></div>

<section class="merge" id="merge" data-screen-label="Consolidación"><div class="merge-st">
<div class="ring" id="ring"></div>
<div class="chaos" id="chaos"></div>
<div class="core" id="core"><div class="pan">
<div class="pan-t"><span class="dot"></span><b>Nexity · Tablero corporativo</b><span class="r">12 fuentes · una verdad</span></div>
<div class="pan-b">
<div class="kpis" style="grid-template-columns:repeat(4,1fr)">
<div class="kpi"><u>Comercial</u><v data-live="4812" data-fmt="$ {v} M" data-step="7">$ 4.812 M</v><s>▲ 12,4%</s></div>
<div class="kpi"><u>Financiera</u><v data-live="18.6" data-fmt="{v} %" data-dec="1" data-step=".07">18,6 %</v><s>▲ 1,8 pts</s></div>
<div class="kpi"><u>Operaciones</u><v data-live="96.4" data-fmt="{v} %" data-dec="1" data-step=".09">96,4 %</v><s>▲ 2,0 pts</s></div>
<div class="kpi"><u>Talento</u><v data-live="7.2" data-fmt="{v} %" data-dec="1" data-step=".04">7,2 %</v><s>▲ estable</s></div>
</div>
${SPARK('gc2')}
</div></div></div>
<div class="merge-copy" id="mcopy">
<span class="pill">El problema</span>
<h2 style="margin-top:22px">Doce archivos. Ninguna respuesta.</h2>
<p class="lede">Cada área reporta en su propio formato, con su propia versión de la verdad y con dos semanas de retraso.</p>
</div>
</div></section>

<section class="s4" id="soluciones" data-screen-label="Soluciones"><div class="s4-st">
<div class="wrap s4-grid">
<div class="s4-copy">
<span class="pill">Soluciones</span>
<h2 style="max-width:17ch;margin-top:20px">Cuatro movimientos, una sola pantalla</h2>
<div class="s4-steps" id="s4Steps">
<button class="s4-step on" aria-current="step"><b>01</b><span><em>Los indicadores se encienden</em><i>Cada área entrega su número al mismo tablero. Nadie exporta nada.</i></span></button>
<button class="s4-step"><b>02</b><span><em>Los módulos se abren</em><i>Comercial, financiera, operaciones, talento y dirección con el mismo lenguaje de datos.</i></span></button>
<button class="s4-step"><b>03</b><span><em>La gráfica se dibuja</em><i>Eliges el corte y Nexity propone la visualización. Puedes probarlo aquí mismo.</i></span></button>
<button class="s4-step"><b>04</b><span><em>La alerta se dispara</em><i>Cuando un indicador se sale de rango, el responsable se entera primero.</i></span></button>
</div>
</div>
<div class="dash" id="dash" data-s="0">
<div class="d-side">
<span class="d-side-h">Módulos</span>
<span class="d-mod on"><i></i>Comercial</span>
<span class="d-mod"><i></i>Financiera</span>
<span class="d-mod"><i></i>Operaciones</span>
<span class="d-mod"><i></i>Talento humano</span>
<span class="d-mod"><i></i>Dirección</span>
</div>
<div class="d-main">
<div class="d-top"><span class="dot"></span><b id="dTop">Tablero corporativo</b><span class="r">Julio 2026</span></div>
<div class="d-body">
<div class="d-kpis">
<div class="d-kpi" style="--i:0"><u>Ingresos</u><v>$ 4.812 M</v><s>▲ 12,4%</s></div>
<div class="d-kpi" style="--i:1"><u>Margen</u><v>18,6 %</v><s>▲ 1,8 pts</s></div>
<div class="d-kpi" style="--i:2" data-crit><u>Cartera 90 d</u><v>$ 612 M</v><s class="dn">▼ 4,1%</s></div>
<div class="d-kpi" style="--i:3"><u>Rotación</u><v>7,2 %</v><s>▲ estable</s></div>
</div>
<p class="d-hint">Un solo tablero para toda la operación, con el detalle de cada área a un clic.</p>
<div class="d-chart">
<div class="cb">
<div class="cb-row" id="cbTypes"><button class="cb-b" data-t="bars" aria-pressed="true">Barras</button><button class="cb-b" data-t="line" aria-pressed="false">Líneas</button><button class="cb-b" data-t="area" aria-pressed="false">Área</button></div>
<div class="cb-row" id="cbFields"><button class="cb-b" data-k="mes" aria-pressed="true">Mes</button><button class="cb-b" data-k="region" aria-pressed="false">Región</button><button class="cb-b" data-k="canal" aria-pressed="false">Canal</button><button class="cb-b" data-k="asesor" aria-pressed="false">Asesor</button></div>
</div>
<div class="cb-plot" id="cbPlot"></div>
<div class="cb-x" id="cbX"></div>
<span class="cb-cap" id="cbCap"></span>
</div>
</div>
<div class="d-toast"><span class="sev"></span><span>Cartera a 90 días superó el límite</span><span class="m">4 min</span></div>
</div>
</div>
</div>
</div></section>

<section class="hmod" id="capacidades" data-screen-label="Capacidades"><div class="hmod-st">
<div class="hmod-head">
<div><span class="pill">Capacidades</span><h2 style="max-width:20ch;margin-top:20px">Lo que Nexity reorganiza por ti</h2></div>
<p class="lede" style="max-width:30ch;font-size:15px">Cinco módulos con el mismo lenguaje de datos. Empiezas por uno y sumas los demás sin volver a empezar.</p>
</div>
<div class="hmod-track" id="hmodTrack">
${NX.MODS.map(([n,t,d,v,slug,foto])=>`<a class="mcard${foto?' ph':''}" href="modulos/${slug}.html">${foto?`<img class="mph" src="${foto}" alt="" loading="lazy">`:''}<div class="render ${v}"></div><div class="grain"></div><span class="n">${n}</span><h3>${t}</h3><p>${d}</p><span class="mgo">Ver la página${ARROW}</span></a>`).join('')}
<article class="mcard" style="justify-content:center;align-items:flex-start"><div class="render c"></div><div class="grain"></div><h3 style="max-width:14ch;margin-bottom:14px">¿Necesitas un módulo que no está aquí?</h3><a class="btn btn-p mag" href="#demo">Hablemos${ARROW}</a></article>
</div>
<div class="hmod-prog"><div class="t"><i id="hmodBar"></i></div></div>
</div></section>

<div class="over ink2">
<section class="sec" id="proceso" data-screen-label="Proceso"><div class="wrap">
<span class="pill rv">Cómo funciona</span>
<h2 class="rv" data-d="80" style="max-width:18ch;margin:22px 0 clamp(30px,4vw,52px)">De la primera reunión a la operación</h2>
<div class="tl">
<div class="tl-arc" aria-hidden="true"><svg viewBox="0 0 100 26" preserveAspectRatio="none"><path d="M0,1 C24,1 30,25 50,25 C70,25 76,1 100,1" fill="none" stroke="currentColor" stroke-opacity=".22" stroke-width="1" vector-effect="non-scaling-stroke" stroke-dasharray="3 5"/></svg></div>
<div class="tl-i rv" style="--o:0"><span class="n">01</span><span class="w">Semana 1</span><h3>Levantamiento</h3><p>Definimos con cada área qué se mide, con qué frecuencia y quién responde.</p></div>
<div class="tl-i rv" style="--o:18"><span class="n">02</span><span class="w">Semana 2</span><h3>Configuración</h3><p>Armamos el tablero de cada área con sus indicadores y sus umbrales.</p></div>
<div class="tl-i rv" style="--o:26"><span class="n">03</span><span class="w">Semana 3</span><h3>Carga de datos</h3><p>Conectamos tus fuentes y dejamos el cargue guiado con validaciones.</p></div>
<div class="tl-i rv" style="--o:18"><span class="n">04</span><span class="w">Semana 4</span><h3>Formación</h3><p>Cada líder aprende a leer su tablero y a armar sus propias vistas.</p></div>
<div class="tl-i rv" style="--o:0"><span class="n">05</span><span class="w">Desde la 5</span><h3>En operación</h3><p>Entra con doble factor y recibe alertas. Acompañamos el primer trimestre.</p></div>
</div>
</div></section>

<section class="sec" id="valor" style="padding-top:0" data-screen-label="Valor"><div class="wrap">
<span class="pill rv">Valor</span>
<h2 class="rv" data-d="80" style="max-width:16ch;margin:22px 0 clamp(30px,4vw,52px)">Lo que cambia el primer mes</h2>
<div class="proof">
<div class="proof-i rv rvx"><div class="v"><span data-to="4" data-suf="×">0×</span></div><p class="l">más rápido para cerrar el reporte mensual</p></div>
<div class="proof-i rv rvx r"><div class="v"><span data-to="12" data-suf=" h">0 h</span></div><p class="l">al mes que un analista deja de consolidar a mano</p></div>
<div class="proof-i rv rvx"><div class="v"><span data-to="1">0</span></div><p class="l">sola fuente de verdad para toda la organización</p></div>
<div class="proof-i rv rvx r"><div class="v"><span data-to="4" data-suf=" sem">0 sem</span></div><p class="l">del arranque al primer tablero en uso</p></div>
</div>
<div class="cols3" style="margin-top:clamp(40px,5vw,72px)">
<div class="q rv rvx"><span class="tagph">Texto de muestra</span><blockquote>“Antes discutíamos de qué archivo era el bueno. Ahora discutimos qué hacer con el número.”</blockquote><cite><b>Dirección financiera</b>Grupo empresarial · 400 empleados</cite></div>
<div class="q rv rvx"><span class="tagph">Texto de muestra</span><blockquote>“La junta dejó de pedir anexos. Todo lo que preguntan está en la misma pantalla.”</blockquote><cite><b>Gerencia general</b>Manufactura · 6 plantas</cite></div>
<div class="q rv rvx"><span class="tagph">Texto de muestra</span><blockquote>“La alerta de cartera nos ahorró un trimestre completo de sorpresas.”</blockquote><cite><b>Dirección de operaciones</b>Servicios · 12 sedes</cite></div>
</div>
<div class="cta-band rv" data-d="120"><p>¿Quieres ver estos mismos indicadores con los datos de tu empresa?</p><a class="btn btn-p mag" href="#demo">Solicitar demo${ARROW}</a></div>
</div></section>
</div>

<div class="over">
<section class="sec" id="precios" data-screen-label="Precios"><div class="wrap">
<div style="text-align:center;margin-bottom:clamp(32px,4vw,58px)"><span class="pill rv">Planes</span><h2 class="rv" data-d="80" style="max-width:20ch;margin:22px auto 0">Un plan por tamaño de operación</h2></div>
<div class="plans" id="plans"></div>
<p class="rv" style="text-align:center;font-family:var(--mono);font-size:11px;letter-spacing:.05em;color:var(--dim2);margin-top:28px">Incluye implementación y acompañamiento de Digital LAB · Valores en pesos colombianos, sin IVA</p>
</div></section>

<section class="sec" id="preguntas" style="padding-top:0" data-screen-label="Preguntas"><div class="wrap">
<span class="pill rv">Antes de que preguntes</span>
<h2 class="rv" data-d="80" style="max-width:16ch;margin:22px 0 clamp(28px,4vw,50px)">Lo que suelen preguntarnos</h2>
<div id="faq" style="display:grid;gap:clamp(24px,3vw,44px)"></div>
</div></section>
</div>

<section class="sec" id="equipo" style="padding-top:0" data-screen-label="Equipo"><div class="wrap">
<div class="eq-head">
<div><span class="pill rv">Nuestros partners</span><h2 class="rv" data-d="80" style="max-width:15ch;margin-top:22px">Quién está detrás del tablero</h2></div>
<p class="lede rv" data-d="140" style="max-width:32ch;font-size:15px">Nexity no es un software que compras y te dejan solo. Estas son las personas que levantan tu operación y te acompañan el primer trimestre.</p>
</div>
<div class="eq-grid">
${NX.TEAM.map(([n,cargo,org,d,ini,foto])=>`<article class="pcard rv${foto?' ph':''}" data-d="80"><div class="pav">${foto?`<img src="${foto}" alt="">`:`<span>${ini}</span>`}</div><h3>${n}</h3><span class="pr">${cargo}</span><span class="po">${org}</span><p>${d}</p><span class="ar">${ARROW}</span></article>`).join('')}
</div>
<span class="tagph" style="margin-top:26px">Cargos y fotos de muestra</span>
</div></section>

<section class="sec final over ink2" id="demo" data-screen-label="Demo">
<span class="over-tag">Solicitar demo</span>
<div class="arcs" aria-hidden="true"><i></i><i></i><i></i></div>
<div class="wrap">
<h2 class="rv">Una forma más silenciosa de dirigir</h2>
<p class="lede rv" style="margin:24px auto 0;text-align:center">Cuéntanos de tu operación y te mostramos Nexity con un caso parecido al tuyo.</p>
<form class="form rv" id="form" novalidate>
<div class="field"><label for="f-nombre">Nombre y apellido</label><input id="f-nombre" name="nombre" type="text" autocomplete="name" data-req /><span class="err" aria-live="polite"></span></div>
<div class="field"><label for="f-correo">Correo corporativo</label><input id="f-correo" name="correo" type="email" autocomplete="email" data-req /><span class="err" aria-live="polite"></span></div>
<div class="field"><label for="f-empresa">Empresa</label><input id="f-empresa" name="empresa" type="text" autocomplete="organization" data-req /><span class="err" aria-live="polite"></span></div>
<div class="field"><label for="f-cargo">Cargo</label><input id="f-cargo" name="cargo" type="text" autocomplete="organization-title" /><span class="err"></span></div>
<div class="field f-w"><label for="f-tam">Tamaño de la operación</label><select id="f-tam" name="tamano"><option value="">Selecciona una opción</option><option>Menos de 50 empleados</option><option>50 a 200 empleados</option><option>200 a 1.000 empleados</option><option>Más de 1.000 empleados</option></select><span class="err"></span></div>
<button class="btn btn-l mag" type="submit">Solicitar demo${ARROW}</button>
<p class="f-note">Respondemos en menos de 24 horas hábiles.</p>
</form>
</div></section>
</main>

<footer style="background:var(--ink2)"><div class="wrap">
<div class="f-grid">
<div class="f-col">${MARK}<span style="max-width:32ch;font-size:14px;margin-top:8px">Toda la información de tu empresa en un solo lugar. Un producto de Digital LAB · Benká Group.</span></div>
<div class="f-col"><span class="h">Plataforma</span><a href="#soluciones">Soluciones</a><a href="#capacidades">Capacidades</a><a href="#valor">Valor</a><a href="#precios">Precios</a><a href="#preguntas">Preguntas</a></div>
<div class="f-col"><span class="h">Contacto</span><a href="mailto:hola@nexity.co">hola@nexity.co</a><a href="tel:+5716000000">+57 1 600 0000</a><span>Bogotá · Colombia</span></div>
<div class="f-col"><span class="h">Acceso</span><a href="https://app.nexity.co" target="_blank" rel="noopener">Portal de clientes</a><a href="#demo">Solicitar demo</a></div>
</div>
<div class="f-bot"><span>© 2026 Nexity · Digital LAB · Benká Group</span><span>Términos · Privacidad</span></div>
</div></footer>

<a class="btn btn-p fab mag" id="fab" href="#demo">Solicitar demo${ARROW}</a>`;
