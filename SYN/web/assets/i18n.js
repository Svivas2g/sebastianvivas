/* ═══════════════════════════════════════════════════════════════════
   SYN · Diccionario ES -> EN
   ───────────────────────────────────────────────────────────────────
   Indexado por la cadena española LITERAL normalizada: espacios en
   blanco colapsados a uno y extremos recortados. Se respetan tildes,
   ñ, ·, º, —, –, comillas tipográficas, ¿ ¡ y mayúsculas.

   Convención de rótulos: Nº00X  ->  No.00X   (Nº001 / Servicios -> No.001 / Services)
   No se traducen: "SYN", "Smart Your Needs", "smart your needs",
   nombres propios de las maquetas (NORDTEX, Casa Verde, Rama, Faro,
   Venom, Clínica Lumen -> ver notas, Nova, Aluminios GM, Casa Nube,
   Patio Roble, Nave Sur), cifras, horas, códigos y monedas.

   Las cadenas que ya son idénticas en inglés NO están aquí a
   propósito (Total, Subtotal, Pipeline, Checklist, Scrap, Pallets,
   Backorder, No-show, POD, Marketing, Q1–Q4, BBVA, Santander,
   Stripe, shopify, sql, Est. 2009 — Monterrey, MX, 402 km total,
   Op. J. Márquez, vs Q2, + WhatsApp, NO · 6%, h, 4.2 °C, 2–8 °C,
   SYN /, SYN / 2026, ...).

   El runtime está al final de este mismo archivo.

   Detalle crítico para el runtime: varias claves son fragmentos de
   una frase partida por <em> o <br>. Al sustituir hay que CONSERVAR
   los espacios de los extremos del nodo original, o "Tu negocio
   merece su propio software" queda pegado.
   ═══════════════════════════════════════════════════════════════════ */
var DICT_EN = {

  /* ── 01 · HEADER ────────────────────────────────────────────────── */
  "Servicios": "Services",
  "Proyectos": "Projects",
  "Proceso": "Process",
  "Contacto": "Contact",
  "Hablemos": "Let's talk",

  /* ── Menú móvil (Nº001..Nº004 también los usa el gantt) ─────────── */
  "Nº001": "No.001",
  "Nº002": "No.002",
  "Nº003": "No.003",
  "Nº004": "No.004",

  /* ── 02 · HERO (lienzo de interferencia, assets/hero.js) ────────────
     El titular es "SMART YOUR NEEDS" partido letra a letra en <span
     data-ch>: marca, no se traduce. El resto del hero es canvas ASCII
     sin texto de idioma. Solo hay una cadena traducible.             */
  "Desliza para entrar al departamento": "Scroll to enter the department",

  /* ── 03 · FRANJA DE BIENVENIDA ──────────────────────────────────── */
  "v.01 ———————— Bienvenido a SYN ———————— //": "v.01 ———————— Welcome to SYN ———————— //",
  "Somos el equipo técnico de las empresas que no quieren frenarse. Entendemos tu operación, diseñamos la solución y la construimos: desde un CRM completo hasta la automatización de un proceso puntual. Software que se adapta a cómo trabajas, no al revés.": "We are the technical team behind companies that refuse to slow down. We learn how you operate, design the solution and build it: from a full CRM to automating a single process. Software that adapts to how you work, not the other way around.",

  /* ── 05 · Nº001 SERVICIOS ───────────────────────────────────────── */
  "Nº001 / Servicios": "No.001 / Services",
  "Soluciones que": "Solutions that",                            /* h2, fragmento 1 */
  "realmente": "actually",                                       /* h2, <em> */
  "funcionan": "work",                                           /* h2, fragmento 3 */
  "No vendemos licencias ni suscripciones a software ajeno. Construimos la herramienta exacta que tu negocio necesita y el código queda siendo tuyo.": "We do not resell licences or subscriptions to somebody else's software. We build the exact tool your business needs and the code stays yours.",
  "Tus áreas ya saben lo que necesitan. Lo que falta es el puente que lo convierte en software funcionando. SYN se coloca en medio de tu empresa: conecta ventas, operaciones, finanzas y soporte, y cada solicitud regresa convertida en algo medible.": "Your teams already know what they need. What is missing is the bridge that turns it into working software. SYN sits in the middle of your company: it connects sales, operations, finance and support, and every request comes back as something measurable.",

  /* Mapa radial · barra superior */
  "TU": "YOU",
  "Tu empresa · áreas": "Your company · areas",
  "Archivos": "Files",
  "Buscar": "Search",

  /* Mapa radial · las ocho áreas (radial.js usa los mismos literales) */
  "Ventas": "Sales",
  "Finanzas": "Finance",
  "Operaciones": "Operations",
  "Logística": "Logistics",
  "Atención": "Support",
  "Talento": "People",
  "Dirección": "Leadership",
  "El puente": "The bridge",
  "8 áreas conectadas · 1 tablero compartido": "8 areas connected · 1 shared dashboard",

  /* Mapa radial · panel derecho */
  "Inicio": "Home",
  "Áreas": "Areas",
  "Solicitudes": "Requests",
  "Impacto": "Impact",
  "Ventas y finanzas capturaban la misma cotización dos veces. Conecté ambos sistemas y dejé una sola fuente de verdad.": "Sales and finance were keying the same quote twice. I connected both systems and left a single source of truth.",
  "La cotización que tardaba dos días ahora cierra la misma mañana.": "The quote that used to take two days now closes the same morning.",
  "Cotizador conectado al ERP": "Quoting tool wired into the ERP",
  "En curso": "In progress",
  "Facturación sin captura manual": "Invoicing with no manual entry",
  "En vivo": "Live",
  "¿Operaciones puede ver esos datos sin pedírnoslos?": "Can Operations see that data without asking us?",
  "Sí — un tablero, un contexto. Cada área lee lo que necesita y nadie persigue a nadie por correo.": "Yes — one dashboard, one context. Each area reads what it needs and nobody chases anybody by email.",
  "Nada sale en vivo sin tu aprobación.": "Nothing goes live without your approval.",
  "Antes": "Before",
  "Con SYN": "With SYN",
  "Cuéntale a SYN qué frena a tu equipo…": "Tell SYN what is slowing your team down…",
  "Haz clic en un área para ver qué cambia": "Click an area to see what changes",

  /* Servicios · los tres remates */
  "Conectamos lo que ya existe —": "We connect what you already have —",
  "tu CRM, tu ERP, tus hojas de cálculo. SYN une las áreas que venían trabajando por separado.": "your CRM, your ERP, your spreadsheets. SYN joins the areas that had been working apart.",
  "Tú decides, nosotros ejecutamos —": "You decide, we execute —",
  "tú marcas la prioridad, nada llega a producción sin tu visto bueno y el avance se ve cada pocos días.": "you set the priority, nothing reaches production without your sign-off and progress is visible every few days.",
  "Mejora medible —": "Measurable gains —",
  "horas ahorradas, errores eliminados, cierres más rápidos. Cada solicitud se mide por lo que cambia en la operación.": "hours saved, errors removed, faster closes. Every request is measured by what it changes in the operation.",

  /* ── 06 · Nº002 PROYECTOS ───────────────────────────────────────── */
  "Nº002 / Proyectos": "No.002 / Projects",
  "Lo que hemos": "What we have",                                /* h2, fragmento 1 */
  "construido": "built",                                         /* h2, <em> */
  "Cada uno nació de un problema distinto y se construyó desde cero. Ninguno salió de una plantilla.": "Each one started from a different problem and was built from scratch. None came out of a template.",

  /* Proyectos · fichas de la leyenda */
  "01 / Manufactura · ERP": "01 / Manufacturing · ERP",
  "Piso de producción en vivo": "Live production floor",
  "02 / Finanzas · Tablero": "02 / Finance · Dashboard",
  "Tesorería y conciliación": "Treasury and reconciliation",
  "03 / E-commerce · Automatización": "03 / E-commerce · Automation",
  "Del pedido a la guía, sin tocar nada": "From order to label, hands off",
  "04 / Arquitectura · Web": "04 / Architecture · Web",
  "Sitio editorial y captación": "Editorial site and lead capture",
  "05 / Entretenimiento · CRM": "05 / Entertainment · CRM",
  "Faro · gestión comercial": "Faro · sales management",
  "06 / Hospitalidad · POS": "06 / Hospitality · POS",
  "Barra, comanda y cobro": "Bar, orders and payment",
  "07 / Servicios · App de campo": "07 / Services · Field app",
  "Órdenes de trabajo en sitio": "Work orders on site",
  "08 / Salud · Agenda": "08 / Health · Scheduling",
  "Consultas y expediente": "Appointments and charts",
  "09 / Logística · Portal": "09 / Logistics · Portal",
  "Rastreo y evidencia de entrega": "Tracking and proof of delivery",
  "Quiero algo así": "I want one of these",

  /* Proyectos · cierre de sección */
  "Cotizar mi proyecto": "Quote my project",
  "Ver cómo trabajamos": "See how we work",
  "Arrastra o toca una tarjeta": "Drag or tap a card",
  "· o usa ← →": "· or use ← →",

  /* ═════════════════════════════════════════════════════════════════
     NIVEL "MAQUETA" — texto dentro de las nueve pantallas simuladas
     del abanico. No es copy de SYN: es relleno de producto. Se traduce
     igual para que la maqueta no delate el idioma.
     ═════════════════════════════════════════════════════════════════ */

  /* maqueta 01 · ERP de manufactura (NORDTEX) */
  "Planta Saltillo": "Saltillo Plant",
  "Turno B": "Shift B",
  "EN VIVO": "LIVE",
  "OEE de planta": "Plant OEE",
  "Disponib.": "Avail.",
  "Rendim.": "Perf.",
  "Calidad": "Quality",
  "Corrida por línea": "Run by line",
  "Alertas": "Alerts",
  "PARO · L-03": "STOP · L-03",
  "Cambio de rollo · 12 min": "Roll change · 12 min",
  "14:08 · op. M. Sáenz": "14:08 · op. M. Sáenz",
  "MANTTO · L-02": "MAINT · L-02",
  "Programado 19:00": "Scheduled 19:00",
  "preventivo · 45 min": "preventive · 45 min",
  "Orden": "Order",
  "OT-4412": "WO-4412",
  "/ 12,480 pz": "/ 12,480 pcs",
  "74% COMPLETA": "74% COMPLETE",
  "Merma": "Waste",
  "Piezas/h": "Pieces/h",
  "96 pz": "96 pcs",

  /* maqueta 02 · Tablero financiero (Casa Verde) */
  "Casa Verde — flujo neto acumulado": "Casa Verde — cumulative net cash flow",
  "meta 3.6M": "target 3.6M",
  "ene": "jan",
  "feb": "feb",
  "mar": "mar",
  "abr": "apr",
  "may": "may",
  "jun": "jun",
  "jul": "jul",
  "ago": "aug",
  "Cobrado": "Collected",
  "Proyectado": "Forecast",
  "Conciliación bancaria": "Bank reconciliation",
  "Cartera vencida": "Overdue receivables",
  "por cobrar": "receivable",
  "Cerrar periodo": "Close period",
  "42 movimientos sin clasificar": "42 unclassified entries",

  /* maqueta 03 · Motor de automatizaciones */
  "pedido-a-guía": "order-to-label",
  "corriendo": "running",
  "DISPARADOR": "TRIGGER",
  "Pedido en tienda": "Store order",
  "ACCIÓN": "ACTION",
  "Verificar stock en ERP": "Check stock in ERP",
  "¿HAY STOCK?": "IN STOCK?",
  "SÍ · 94%": "YES · 94%",
  "Guía DHL": "DHL label",
  "+ aviso al cliente": "+ customer notice",
  "Últimas corridas": "Recent runs",
  "1 reintento": "1 retry",
  "Éxito 30 d": "Success 30 d",

  /* maqueta 04 · Sitio y landing (Rama) */
  "rama.mx / proyectos": "rama.mx / projects",
  "Estudio": "Studio",
  "Obra": "Work",
  "Diario": "Journal",
  "Cotizar": "Get a quote",          /* botón CTA de la maqueta del sitio Rama */
  "Cotizaciones": "Quotes",          /* menú lateral de Faro. En el marcado decía
                                        "Cotizar", igual que el botón de Rama: al
                                        indexar por la cadena española los dos
                                        colapsaban en una sola traducción. Se
                                        desambiguó cambiando el español, que además
                                        describe mejor una cola de cotizaciones. */
  "Arquitectura": "Architecture",    /* línea 1 del titular partido por <br> */
  "que se": "made to be",            /* línea 2 */
  "habita": "lived in",              /* línea 3, dentro de <em> */
  "Obra residencial y adaptación de patrimonio. Trabajamos el proyecto completo: anteproyecto, ejecutivo y dirección de obra.": "Residential work and heritage adaptation. We take the whole project: concept, construction documents and site supervision.",
  "Ver obra ↗": "See work ↗",
  "12 obras": "12 buildings",
  "entregadas": "delivered",
  "01 · RESIDENCIAL": "01 · RESIDENTIAL",
  "02 · PATRIMONIO": "02 · HERITAGE",
  "03 · CORPORATIVO": "03 · CORPORATE",
  "+312% leads / 6 meses": "+312% leads / 6 months",

  /* maqueta 05 · Faro, CRM de gestión comercial */
  "Comercial": "Sales",
  "Resumen": "Overview",
  "Clientes": "Clients",
  "Operación": "Operations",
  "Proveedores": "Vendors",
  "Reportes": "Reports",
  "Buscar cliente, cotización, folio…": "Search client, quote, ref…",
  "Este mes ▾": "This month ▾",
  "+ Cotización": "+ Quote",
  "05 · CRM a la medida": "05 · Custom CRM",
  "Resumen comercial": "Sales overview",
  "vs. mes previo": "vs. prior month",
  "Cierres": "Closed",
  "Ticket": "Avg. deal",
  "estable": "flat",
  "Ciclo": "Cycle",
  "Embudo por etapa": "Funnel by stage",
  "86 oportunidades": "86 opportunities",
  "Propuesta": "Proposal",
  "Negociación": "Negotiation",
  "Ganado": "Won",
  "Meta del trimestre": "Quarter target",
  "Actividad": "Activity",
  "Cotización #1182": "Quote #1182",
  "enviada · 14:02": "sent · 14:02",
  "Contrato · Nova": "Contract · Nova",
  "firmado · $86k": "signed · $86k",
  "Alta de proveedor": "New vendor",
  "Seguimiento hoy": "Follow-ups today",
  "llamadas pendientes": "calls pending",

  /* maqueta 06 · Punto de venta de coctelería (Venom) */
  "Coctelería": "Cocktail bar",
  "Mesa 14": "Table 14",
  "Caja 02 · R. Ponce": "Register 02 · R. Ponce",
  "Clásicos": "Classics",
  "De la casa": "House",
  "Sin alcohol": "Zero proof",
  "AGOTADO": "SOLD OUT",
  "Comanda": "Order",
  "+ naranja deshidratada": "+ dried orange",
  "sal de gusano": "worm salt",
  "Agua mineral": "Sparkling water",
  "Propina 10%": "Tip 10%",
  "Efectivo": "Cash",
  "Tarjeta": "Card",
  "Dividir": "Split",
  "Cobrar $654": "Charge $654",
  "Turno 18:00–02:00": "Shift 18:00–02:00",
  "Venta del día": "Day's sales",
  "6 mesas abiertas": "6 tables open",

  /* maqueta 07 · App de campo para técnicos */
  "SIN RED": "NO SIGNAL",
  "Orden de trabajo": "Work order",
  "OT-2291": "WO-2291",
  "Mantenimiento": "Refrigeration",      /* titular partido por <br>: se invierte el orden, ver notas */
  "de refrigeración": "maintenance",
  "Luis Ramírez · téc. 04": "Luis Ramírez · tech 04",
  "Planta Norte · 4.2 km": "North Plant · 4.2 km",
  "En sitio": "On site",
  "Refacciones": "Parts",
  "Presión de línea": "Line pressure",
  "Prueba de fugas": "Leak test",
  "Cambio de filtros": "Filter change",
  "Firma del cliente": "Customer signature",
  "Evidencia": "Evidence",
  "Firma": "Signature",
  "Modo sin conexión · 3 cambios en cola": "Offline mode · 3 changes queued",
  "Se sincroniza solo": "Syncs by itself",
  "Pausar": "Pause",
  "Cerrar orden": "Close order",

  /* maqueta 08 · Agenda clínica (Lumen) */
  "Clínica Lumen": "Lumen Clinic",
  "Mié 12 ago": "Wed Aug 12",
  "Dra. Rivas": "Dr. Rivas",
  "Consultorio 3": "Room 3",
  "+ Cita": "+ Appt",
  "Agenda del día · 8 citas": "Today's schedule · 8 appts",
  "ahora 10:12": "now 10:12",
  "control": "follow-up",
  "1ª vez": "first visit",
  "Libre": "Open",
  "sin confirmar": "unconfirmed",
  "Expediente · 04821": "Chart · 04821",
  "34 A · M · 78 kg": "34 y · M · 78 kg",
  "TA": "BP",
  "FC": "HR",
  "⚠ Alergia: penicilina": "⚠ Allergy: penicillin",
  "Motivo: dolor lumbar de 3 semanas. Última visita 04/2026.": "Reason: low back pain, 3 weeks. Last visit 04/2026.",
  "Abrir nota": "Open note",
  "Receta": "Rx",
  "Ocupación": "Occupancy",
  "38 recordatorios enviados": "38 reminders sent",

  /* maqueta 09 · Portal de logística */
  "Ruta MX-402": "Route MX-402",
  "En tránsito · 62%": "In transit · 62%",
  "Llega en": "Arrives in",
  "a tiempo": "on time",
  "248 km recorridos": "248 km driven",
  "Almacén Querétaro": "Querétaro warehouse",
  "Cruce Toluca": "Toluca junction",
  "Caseta Lerma · demora 18 min": "Lerma toll · 18 min delay",
  "CDMX · Centro de distribución": "CDMX · Distribution centre",
  "Cadena de frío": "Cold chain",
  "Peso": "Weight",
  "Sello": "Seal",
  "Ver evidencia": "View evidence",
  "A tiempo": "On time",
  "Excursiones": "Excursions",
  "Incidencias": "Incidents",

  /* ── 07 · Nº003 PROCESO ─────────────────────────────────────────── */
  "Nº003 / Proceso": "No.003 / Process",
  "De la idea a": "From idea to",                                /* h2, fragmento 1 */
  "producto real": "real product",                               /* h2, <em> */
  "Detrás de cada ventana encendida hay alguien construyendo. Así es como pasamos de una conversación a un sistema en producción.": "Behind every lit window there is someone building. This is how we go from a conversation to a system in production.",

  /* HUD del lienzo de la ciudad */
  "Operando": "Running",
  "Torre": "Tower",
  "Piso 23": "Floor 23",

  /* Gantt */
  "Fase": "Phase",
  "S1": "W1",
  "S2": "W2",
  "S3": "W3",
  "S4": "W4",
  "S5": "W5",
  "S6": "W6",
  "· 1 semana": "· 1 week",
  "Entendemos tu negocio": "We learn your business",
  "Nos sentamos contigo a entender el problema, los usuarios y qué solución tiene más impacto. Nada de suposiciones.": "We sit down with you to understand the problem, the users and which solution moves the needle. No assumptions.",
  "1 sem": "1 wk",
  "· 2 semanas": "· 2 weeks",
  "Diseñamos la solución": "We design the solution",
  "Creamos wireframes y prototipos para que veas cómo va a quedar antes de escribir una sola línea de código.": "We build wireframes and prototypes so you see how it will look before a single line of code is written.",
  "2 sem": "2 wks",
  "· 3 semanas": "· 3 weeks",
  "Desarrollamos y probamos": "We build and test",
  "Construimos con tecnologías modernas, probando cada detalle para que todo funcione perfecto desde el día uno.": "We build on modern tooling and test every detail so it works from day one.",
  "3 sem": "3 wks",
  "· continuo": "· ongoing",
  "Entregamos y acompañamos": "We deliver and stay on",
  "Hacemos el lanzamiento contigo y seguimos apoyándote con mejoras, soporte y nuevas funciones.": "We launch alongside you and keep supporting it with improvements, support and new features.",
  "Continuo": "Ongoing",
  "Semana 6 —": "Week 6 —",
  "tu software en producción": "your software in production",

  /* ── 08 · Nº004 CONTACTO / PASE ─────────────────────────────────── */
  "Nº004 / Contacto": "No.004 / Contact",
  "¿Tienes un proyecto en mente?": "Have a project in mind?",
  "Cuéntanos qué necesitas y te decimos cómo lo hacemos realidad. La primera conversación no cuesta nada y sales con claridad sobre el alcance.": "Tell us what you need and we will tell you how we make it happen. The first conversation costs nothing and you leave with a clear scope.",
  "Mueve el cursor sobre el pase": "Move your cursor over the pass",
  "Pase 001 · SYN": "Pass 001 · SYN",
  "3 cupos en agosto": "3 slots in August",      /* pase.js lo sobrescribe en cada carga — ver notas */
  "Acceso · departamento de tecnología": "Access · technology department",
  "¿Quieres dejar de perder dinero en procesos manuales?": "Want to stop losing money on manual processes?",
  "Presiona el botón.": "Press the button.",
  "> ¿Sigues operando como en 2009?": "> Still running things like it is 2009?",
  "> ¿Cuánto te cuesta cada hora manual?": "> What does every manual hour cost you?",
  "> El 41% de tu operación es automatizable.": "> 41% of your operation can be automated.",
  "Presiona para activar ↗": "Press to activate ↗",
  "Sin permanencia": "No lock-in",
  "cancelas cuando quieras": "cancel whenever you want",
  "Pase de acceso": "Access pass",
  "Activado": "Activated",
  "Acceso concedido.": "Access granted.",
  "Desde hoy, SYN es tu departamento de tecnología.": "From today, SYN is your technology department.",
  "Titular": "Holder",
  "Tu empresa": "Your company",
  "Emitido": "Issued",
  "Validez": "Valid",
  "Ilimitada": "Unlimited",
  "Nº de pase": "Pass No.",
  "Usarlo ↗": "Use it ↗",
  "Girar el pase": "Flip the pass",

  /* ── 09 · FOOTER ────────────────────────────────────────────────── */
  "Soluciones tecnológicas personalizadas": "Custom technology solutions",

  /* ── ATRIBUTOS TRADUCIBLES (alt / aria-label / title / placeholder) ─ */
  "SYN — inicio": "SYN — home",                    /* aria-label del logotipo */
  "Idioma": "Language",                            /* aria-label del conmutador ES/EN */
  "Toda América": "The Americas",                  /* HUD del lienzo de la ciudad */
  "Proyectos en toda América": "Projects across the Americas",   /* footer */
  "Principal": "Main",                             /* aria-label de <nav> del header */
  "Abrir menú": "Open menu",                       /* aria-label del botón hamburguesa */
  "Cerrar menú": "Close menu",                     /* lo pone el JS inline al abrir */
  "Pie de página": "Footer",                       /* aria-label de <nav> del footer */
  "Sistemas construidos": "Systems we have built", /* aria-label del listbox del abanico */
  "ERP de manufactura": "Manufacturing ERP",
  "Tablero financiero": "Financial dashboard",
  "Motor de automatizaciones": "Automation engine",
  "Sitio y landing page": "Website and landing page",
  "Faro, CRM de gestión comercial": "Faro, sales management CRM",
  "Punto de venta de coctelería": "Cocktail bar point of sale",
  "App de campo para técnicos": "Field app for technicians",
  "Agenda clínica": "Clinic scheduling",
  "Portal de logística": "Logistics portal",

  /* ═════════════════════════════════════════════════════════════════
     ASSETS/*.JS — cadenas que estos scripts escriben en el DOM con
     textContent. Son literales que existen en el fuente; el runtime
     solo las alcanza si observa mutaciones (ver i18n-notas.md).
     ═════════════════════════════════════════════════════════════════ */

  /* radial.js · qué cambia en cada área */
  "Cotizaciones en Excel, dos días de ida y vuelta": "Quotes in Excel, two days back and forth",
  "Cotizador conectado al ERP, aprobación el mismo día": "Quoting tool wired into the ERP, same-day approval",
  "−70% tiempo": "−70% time",
  "por cotización": "per quote",
  "Facturas capturadas a mano, errores al cierre": "Invoices keyed by hand, errors at close",
  "Facturación automática y conciliación diaria": "Automatic invoicing and daily reconciliation",
  "−90% captura": "−90% data entry",
  "cierre mensual": "monthly close",
  "Cada área con su propio archivo y su verdad": "Every area with its own file and its own truth",
  "Un tablero con datos en vivo para toda la operación": "One dashboard with live data for the whole operation",
  "1 fuente": "1 source",
  "de verdad": "of truth",
  "Seguimiento por WhatsApp y llamadas": "Tracking over WhatsApp and phone calls",
  "Rastreo en línea con alertas automáticas": "Online tracking with automatic alerts",
  "−40% llamadas": "−40% calls",
  "a soporte": "to support",
  "Tickets perdidos entre correos": "Tickets lost in email threads",
  "Bandeja única con prioridad y tiempos de respuesta": "One inbox with priority and response times",
  "2h respuesta": "2h response",
  "promedio": "average",
  "Altas y accesos gestionados a mano": "Onboarding and access handled by hand",
  "Alta, accesos y equipo listos en un solo flujo": "Onboarding, access and hardware ready in one flow",
  "−3 días": "−3 days",
  "por ingreso": "per new hire",
  "Campañas sin datos de venta reales": "Campaigns with no real sales data",
  "Atribución conectada al cierre de cada trato": "Attribution wired to every closed deal",
  "retorno visible": "visible return",
  "Reportes armados a fin de mes": "Reports assembled at month end",
  "Tablero de indicadores actualizado cada día": "KPI dashboard refreshed every day",
  "Tiempo real": "Real time",
  "sin esperar reportes": "no waiting on reports",
  "Impacto · esta semana": "Impact · this week",
  "Ocho áreas trabajando en archivos separados": "Eight areas working in separate files",
  "Un solo puente técnico entre todas ellas": "A single technical bridge between all of them",
  "−18h/semana": "−18h/week",
  "trabajo manual": "manual work",

  /* pase.js · meses del contador de cupos */
  "enero": "January",
  "febrero": "February",
  "marzo": "March",
  "abril": "April",
  "mayo": "May",
  "junio": "June",
  "julio": "July",
  "agosto": "August",
  "septiembre": "September",
  "octubre": "October",
  "noviembre": "November",
  "diciembre": "December",

  /* ciudad.js · KPI de la capa flotante */
  "Ingresos del mes": "Revenue this month",
  "Tickets resueltos": "Tickets resolved",
  "Costo por lead": "Cost per lead",
  "Tiempo de respuesta": "Response time",

  /* ciudad.js · barras de progreso */
  "Migración de datos": "Data migration",
  "Onboarding · Acme": "Onboarding · Acme",
  "3 de 7 pasos": "3 of 7 steps",
  "Cierre contable": "Accounting close",
  "Revisión final": "Final review",
  "Índice de documentos": "Document indexing",
  "18k archivos": "18k files",

  /* ciudad.js · feed de automatizaciones */
  "Automatización · Ventas": "Automation · Sales",
  "12 correos de seguimiento listos para enviar.": "12 follow-up emails ready to send.",
  "hace 2 min": "2 min ago",
  "Automatización · Datos": "Automation · Data",
  "El tablero de ingresos ya está actualizado.": "The revenue dashboard is up to date.",
  "hace 6 min": "6 min ago",
  "Automatización · Soporte": "Automation · Support",
  "Ticket #4821 escalado a ingeniería.": "Ticket #4821 escalated to engineering.",
  "hace 9 min": "9 min ago",
  "Automatización · Finanzas": "Automation · Finance",
  "Conciliación lista para tu aprobación.": "Reconciliation ready for your approval.",
  "hace 14 min": "14 min ago",

  /* ciudad.js · chips */
  "12 tareas en curso": "12 tasks running",
  "4 procesos automatizados": "4 automated processes",
  "98.2% uptime": "98.2% uptime",
  "Sincronizado hace 40 s": "Synced 40 s ago",
  "3 aprobaciones pendientes": "3 approvals pending",
  "2 flujos programados": "2 scheduled flows",
  "Backup completado": "Backup complete",
  "1 alerta de costos": "1 cost alert",

  /* ciudad.js · tiras de métricas */
  "Activos": "Active",
  "En cola": "Queued",
  "Hoy": "Today",
  "Leads": "Leads",
  "Demos": "Demos",

  /* ciudad.js · pila de tareas */
  "Completado": "Done",
  "Reporte de cierre enviado": "Close report sent",
  "En ejecución": "Running",
  "Sincronizando CRM": "Syncing CRM",
  "Tablero de ventas publicado": "Sales dashboard published",
  "Requiere aprobación": "Needs approval",
  "Pago a proveedor": "Vendor payment",
  "Compilando": "Building",
  "Onboarding de 3 clientes": "Onboarding 3 clients",
  "Junta de operaciones": "Operations meeting",
  "Ticket escalado a soporte": "Ticket escalated to support",
  "Campaña de correo enviada": "Email campaign sent"
};

/* ═══════════════════════════════════════════════════════════════════
   Metadatos del <head>. NO los alcanza el recorrido de nodos de texto:
   hay que escribirlos a mano al cambiar de idioma.
   ═══════════════════════════════════════════════════════════════════ */
var HEAD_EN = {
  title: "SYN · Smart Your Needs — Custom technology solutions",
  description: "We build CRMs, custom software, websites and automation for companies that need their own solution, not a generic one. Across the Americas.",
  ogTitle: "SYN · Custom technology solutions",
  ogDescription: "Your business deserves its own software. CRMs, custom systems, websites and automation.",

  /* Extras que también viven en el <head> y hoy están en español */
  ogLocale: "en_US",                         /* hoy: es_LA */
  ogSiteName: "SYN · Smart Your Needs",      /* no cambia */
  htmlLang: "en",                            /* atributo lang de <html>, hoy "es" */
  jsonLdDescription: "Custom software development, CRMs, websites and process automation."
  /* No existen meta twitter:title ni twitter:description en el archivo:
     solo <meta name="twitter:card" content="summary_large_image">, que no
     se traduce. Twitter cae de vuelta en og:title / og:description. */
};

/* ═══════════════════════════════════════════════════════════════════
   Cadenas que NINGÚN fuente contiene literalmente: las compone
   radial.js en tiempo de ejecución ('Impacto · ' + nombre del área,
   línea 96) y pase.js (número + ' cupos en ' + mes, línea 81).
   Se dejan resueltas aquí para que el mecanismo elija: o parchea el
   script, o fusiona este objeto dentro de DICT_EN.
   ═══════════════════════════════════════════════════════════════════ */
var EXTRA_EN = {
  "Impacto · Ventas": "Impact · Sales",
  "Impacto · Finanzas": "Impact · Finance",
  "Impacto · Operaciones": "Impact · Operations",
  "Impacto · Logística": "Impact · Logistics",
  "Impacto · Atención": "Impact · Support",
  "Impacto · Talento": "Impact · People",
  "Impacto · Marketing": "Impact · Marketing",
  "Impacto · Dirección": "Impact · Leadership"
  /* pase.js compone "N cupos en <mes>": son 36 combinaciones (3 números
     x 12 meses) y no se enumeran aquí. Lo resuelve PATRONES, más abajo,
     sin tocar pase.js. */
};

/* Se vuelcan en el diccionario principal: para el runtime son cadenas
   como cualquier otra, solo que nadie las escribió a mano en un fuente. */
for (var claveExtra in EXTRA_EN) {
  if (Object.prototype.hasOwnProperty.call(EXTRA_EN, claveExtra)) {
    DICT_EN[claveExtra] = EXTRA_EN[claveExtra];
  }
}

/* ═══════════════════════════════════════════════════════════════════
   Mensajes de los enlaces de WhatsApp. No son nodos de texto: viajan
   URL-encoded dentro del `href`, así que el recorrido del DOM no los ve
   y hay que reescribir el enlace entero.
   ═══════════════════════════════════════════════════════════════════ */
var WA_EN = {
  "Hola SYN, quiero cotizar un proyecto.":
    "Hi SYN, I'd like a quote for a project.",
  "Hola SYN, quiero activar mi pase.":
    "Hi SYN, I'd like to activate my pass.",
  "Hola SYN, vi el ERP de manufactura en su portafolio y quiero algo así para mi empresa.":
    "Hi SYN, I saw the manufacturing ERP in your portfolio and I want something like it for my company.",
  "Hola SYN, vi el tablero financiero en su portafolio y quiero algo así para mi empresa.":
    "Hi SYN, I saw the financial dashboard in your portfolio and I want something like it for my company.",
  "Hola SYN, vi el motor de automatizaciones en su portafolio y quiero algo así para mi empresa.":
    "Hi SYN, I saw the automation engine in your portfolio and I want something like it for my company.",
  "Hola SYN, vi el sitio y la landing page en su portafolio y quiero algo así para mi empresa.":
    "Hi SYN, I saw the website and landing page in your portfolio and I want something like it for my company.",
  "Hola SYN, vi Faro, el CRM de gestión comercial en su portafolio y quiero algo así para mi empresa.":
    "Hi SYN, I saw Faro, the sales management CRM, in your portfolio and I want something like it for my company.",
  "Hola SYN, vi el punto de venta de coctelería en su portafolio y quiero algo así para mi empresa.":
    "Hi SYN, I saw the cocktail bar point of sale in your portfolio and I want something like it for my company.",
  "Hola SYN, vi la app de campo para técnicos en su portafolio y quiero algo así para mi empresa.":
    "Hi SYN, I saw the field app for technicians in your portfolio and I want something like it for my company.",
  "Hola SYN, vi la agenda clínica en su portafolio y quiero algo así para mi empresa.":
    "Hi SYN, I saw the clinic scheduling app in your portfolio and I want something like it for my company.",
  "Hola SYN, vi el portal de logística en su portafolio y quiero algo así para mi empresa.":
    "Hi SYN, I saw the logistics portal in your portfolio and I want something like it for my company."
};


/* ═══════════════════════════════════════════════════════════════════
   RUNTIME · Conmutador ES/EN

   Cómo traduce: recorriendo los NODOS DE TEXTO del DOM y buscando cada
   cadena española literal en DICT_EN. No hay ni un `data-i18n` en el
   marcado, y es a propósito: index.html tiene nueve maquetas de app con
   cientos de <span> de estilo en línea, y sembrarlos de atributos lo
   volvería ilegible. El precio de esta decisión son dos cosas de las
   que hay que estar pendiente:

     · Dos cadenas españolas idénticas comparten traducción. Las que
       necesitaban inglés distinto se resolvieron cambiando el español
       en el marcado (ver "Cotizaciones" en la maqueta de Faro).
     · Lo que un script reescriba después del recorrido vuelve al
       español. Por eso hay un MutationObserver: ciudad.js repinta su
       capa con siete temporizadores cada 3-7 s, radial.js en cada clic
       y pase.js en cada carga.

   Lo que NO alcanza el recorrido y se escribe aparte: los metadatos del
   <head>, el atributo lang, los aria-label y los mensajes dentro de los
   href de WhatsApp.
   ═══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var GUARDADO = 'syn-idioma';
  var raiz = document.documentElement;

  /* Cadenas que ningún diccionario puede enumerar porque las compone un
     script en tiempo de ejecución. pase.js escribe "N cupos en <mes>":
     son 36 combinaciones, así que se traduce el patrón, no el literal. */
  var MESES_EN = {
    'enero': 'January', 'febrero': 'February', 'marzo': 'March',
    'abril': 'April', 'mayo': 'May', 'junio': 'June',
    'julio': 'July', 'agosto': 'August', 'septiembre': 'September',
    'octubre': 'October', 'noviembre': 'November', 'diciembre': 'December'
  };

  var PATRONES = [
    /* pase.js — "3 cupos en agosto" */
    { re: /^(\d+) cupos en ([a-záéíóúñ]+)$/i, en: function (m) {
        var mes = MESES_EN[m[2].toLowerCase()];
        return mes ? m[1] + ' slots in ' + mes : null;
      } },
    /* ciudad.js — "hace 14 min" (los cuatro literales fijos ya están en
       el diccionario; esto cubre cualquier otro que aparezca) */
    { re: /^hace (\d+) min$/, en: function (m) { return m[1] + ' min ago'; } }
  ];

  /* ── Búsqueda ────────────────────────────────────────────────────── */

  function normalizar(txt) { return txt.replace(/\s+/g, ' ').trim(); }

  function aIngles(claveEs) {
    if (Object.prototype.hasOwnProperty.call(DICT_EN, claveEs)) return DICT_EN[claveEs];
    for (var i = 0; i < PATRONES.length; i++) {
      var m = claveEs.match(PATRONES[i].re);
      if (m) {
        var traducida = PATRONES[i].en(m);
        if (traducida) return traducida;
      }
    }
    return null;
  }

  /* ── Registro de lo tocado ───────────────────────────────────────────
     Se guarda el español original de cada cosa que se cambia para poder
     volver exactamente al punto de partida. Ningún valor inglés del
     diccionario es a su vez clave española (está verificado), así que
     traducir dos veces no encadena traducciones.                     */
  var textos = [], atributos = [], enlaces = [], cabecera = null;
  var idioma = 'es';
  var observador = null;

  /* ── Recorrido ───────────────────────────────────────────────────── */

  var SALTAR = { SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, CANVAS: 1, TEXTAREA: 1 };
  var ATRIBUTOS = ['aria-label', 'title', 'placeholder', 'alt'];

  function vetado(el) {
    return SALTAR[el.nodeName] === 1 ||
           (el.hasAttribute && el.hasAttribute('data-sin-traducir'));
  }

  function traducirTexto(nodo) {
    var crudo = nodo.nodeValue;
    if (!crudo || !crudo.trim()) return;
    var en = aIngles(normalizar(crudo));
    if (en === null) return;
    /* Se conservan los espacios de los extremos: varios titulares están
       partidos por <em> o <br> y sin ellos las palabras se pegan. */
    var izq = /^\s*/.exec(crudo)[0];
    var der = /\s*$/.exec(crudo)[0];
    textos.push({ nodo: nodo, es: crudo });
    nodo.nodeValue = izq + en + der;
  }

  function traducirAtributos(el) {
    for (var i = 0; i < ATRIBUTOS.length; i++) {
      var nombre = ATRIBUTOS[i];
      if (!el.hasAttribute(nombre)) continue;
      var valor = el.getAttribute(nombre);
      /* El alt="" del logotipo está vacío a propósito (imagen
         decorativa): no se toca. */
      if (!valor || !valor.trim()) continue;
      var en = aIngles(normalizar(valor));
      if (en === null) continue;
      atributos.push({ el: el, attr: nombre, es: valor });
      el.setAttribute(nombre, en);
    }
  }

  function traducirEnlace(el) {
    if (el.nodeName !== 'A') return;
    var href = el.getAttribute('href');
    if (!href || href.indexOf('wa.me/') < 0) return;
    var m = /[?&]text=([^&]*)/.exec(href);
    if (!m) return;
    var mensaje;
    try { mensaje = decodeURIComponent(m[1].replace(/\+/g, ' ')); } catch (e) { return; }
    var en = WA_EN[mensaje];
    if (!en) return;
    enlaces.push({ el: el, es: href });
    el.setAttribute('href',
      href.slice(0, m.index) + m[0].charAt(0) + 'text=' + encodeURIComponent(en) +
      href.slice(m.index + m[0].length));
  }

  function traducirRama(nodo) {
    if (nodo.nodeType === 3) { traducirTexto(nodo); return; }
    if (nodo.nodeType !== 1 || vetado(nodo)) return;
    traducirAtributos(nodo);
    traducirEnlace(nodo);
    for (var hijo = nodo.firstChild; hijo; hijo = hijo.nextSibling) traducirRama(hijo);
  }

  /* ── Vuelta al español ───────────────────────────────────────────── */

  /* Se recorre de la anotación más vieja a la más nueva, no al revés: si
     algo se tradujo dos veces —el aria-label de la hamburguesa cambia de
     "Abrir menú" a "Cerrar menú" cada vez que se abre el menú— hay que
     dejar el español VIGENTE, que es el último anotado, no el que tenía
     la página al cargar. Con el orden inverso, cambiar a español con el
     menú abierto dejaba el botón diciendo "Abrir menú". */
  function restaurar() {
    var i;
    for (i = 0; i < textos.length; i++) textos[i].nodo.nodeValue = textos[i].es;
    for (i = 0; i < atributos.length; i++) atributos[i].el.setAttribute(atributos[i].attr, atributos[i].es);
    for (i = 0; i < enlaces.length; i++) enlaces[i].el.setAttribute('href', enlaces[i].es);
    textos = []; atributos = []; enlaces = [];
  }

  /* ── Metadatos del <head> ────────────────────────────────────────── */

  function meta(clave, valor) {
    return document.querySelector('meta[' + clave + '="' + valor + '"]');
  }

  function leerCabecera() {
    var og = { titulo: meta('property', 'og:title'), desc: meta('property', 'og:description'), loc: meta('property', 'og:locale') };
    var desc = meta('name', 'description');
    var ld = document.querySelector('script[type="application/ld+json"]');
    return {
      lang: raiz.getAttribute('lang'),
      title: document.title,
      description: desc ? desc.getAttribute('content') : null,
      ogTitle: og.titulo ? og.titulo.getAttribute('content') : null,
      ogDescription: og.desc ? og.desc.getAttribute('content') : null,
      ogLocale: og.loc ? og.loc.getAttribute('content') : null,
      jsonLd: ld ? ld.textContent : null
    };
  }

  function escribirCabecera(d) {
    var desc = meta('name', 'description');
    var ogT = meta('property', 'og:title');
    var ogD = meta('property', 'og:description');
    var ogL = meta('property', 'og:locale');
    var ld  = document.querySelector('script[type="application/ld+json"]');

    raiz.setAttribute('lang', d.lang);
    document.title = d.title;
    if (desc && d.description !== null) desc.setAttribute('content', d.description);
    if (ogT && d.ogTitle !== null) ogT.setAttribute('content', d.ogTitle);
    if (ogD && d.ogDescription !== null) ogD.setAttribute('content', d.ogDescription);
    if (ogL && d.ogLocale !== null) ogL.setAttribute('content', d.ogLocale);
    if (ld && d.jsonLd !== null) ld.textContent = d.jsonLd;
  }

  function cabeceraEn(original) {
    var ld = original.jsonLd;
    if (ld) {
      /* Se reescribe solo el campo `description`; el resto del JSON-LD
         (areaServed, contactPoint) no tiene idioma. */
      try {
        var datos = JSON.parse(ld);
        datos.description = HEAD_EN.jsonLdDescription;
        ld = JSON.stringify(datos, null, 2);
      } catch (e) { /* si no parsea, se deja como está */ }
    }
    return {
      lang: HEAD_EN.htmlLang,
      title: HEAD_EN.title,
      description: HEAD_EN.description,
      ogTitle: HEAD_EN.ogTitle,
      ogDescription: HEAD_EN.ogDescription,
      ogLocale: HEAD_EN.ogLocale,
      jsonLd: ld
    };
  }

  /* ── Observador ──────────────────────────────────────────────────────
     ciudad.js repinta su capa con siete temporizadores permanentes,
     radial.js en cada clic y pase.js al cargar. Sin esto, a los pocos
     segundos de pasar a inglés esas tres zonas vuelven al español.
     Se desconecta mientras escribimos para no reaccionar a lo nuestro:
     `disconnect()` vacía la cola de registros pendientes.            */

  function conectar() {
    observador.observe(document.body, {
      childList: true, subtree: true, characterData: true,
      attributes: true, attributeFilter: ATRIBUTOS
    });
  }

  function enPausa(tarea) {
    if (!observador) { tarea(); return; }
    observador.disconnect();
    tarea();
    conectar();
  }

  function arrancarObservador() {
    if (!('MutationObserver' in window)) return;
    observador = new MutationObserver(function (mutaciones) {
      if (idioma !== 'en') return;
      enPausa(function () {
        for (var i = 0; i < mutaciones.length; i++) {
          var m = mutaciones[i];
          if (m.type === 'characterData') traducirTexto(m.target);
          else if (m.type === 'attributes') traducirAtributos(m.target);
          else for (var j = 0; j < m.addedNodes.length; j++) traducirRama(m.addedNodes[j]);
        }
      });
    });
    conectar();
  }

  /* ── Cambio de idioma ────────────────────────────────────────────── */

  function marcarBotones() {
    var botones = document.querySelectorAll('[data-idioma]');
    for (var i = 0; i < botones.length; i++) {
      var suyo = botones[i].getAttribute('data-idioma');
      botones[i].setAttribute('aria-pressed', String(suyo === idioma));
    }
  }

  function fijar(nuevo, recordar) {
    if (nuevo !== 'en' && nuevo !== 'es') return;
    if (nuevo === idioma) { marcarBotones(); return; }

    enPausa(function () {
      if (nuevo === 'en') {
        cabecera = leerCabecera();
        escribirCabecera(cabeceraEn(cabecera));
        idioma = 'en';
        traducirRama(document.body);
      } else {
        restaurar();
        if (cabecera) escribirCabecera(cabecera);
        idioma = 'es';
      }
    });

    marcarBotones();
    if (recordar) {
      try { window.localStorage.setItem(GUARDADO, idioma); } catch (e) { /* modo privado */ }
    }
  }

  /* ── Arranque ────────────────────────────────────────────────────────
     Manda lo que el visitante haya elegido antes. Si nunca eligió, se
     mira el idioma del navegador: la marca trabaja en toda América y a
     un navegador en inglés le corresponde ver el sitio en inglés. Para
     que el sitio abra SIEMPRE en español, basta con quitar la segunda
     mitad de esta expresión.                                        */
  function idiomaInicial() {
    var guardado = null;
    try { guardado = window.localStorage.getItem(GUARDADO); } catch (e) { /* modo privado */ }
    if (guardado === 'en' || guardado === 'es') return guardado;
    var nav = (navigator.language || navigator.userLanguage || 'es').toLowerCase();
    return nav.indexOf('en') === 0 ? 'en' : 'es';
  }

  function iniciar() {
    arrancarObservador();

    var botones = document.querySelectorAll('[data-idioma]');
    for (var i = 0; i < botones.length; i++) {
      botones[i].addEventListener('click', function (e) {
        fijar(this.getAttribute('data-idioma'), true);
        e.preventDefault();
      });
    }

    fijar(idiomaInicial(), false);
    marcarBotones();
  }

  /* Este script va el último de los `defer`, así que su DOMContentLoaded
     corre después del de ciudad.js, pase.js, radial.js y abanico.js: lo
     que esos scripts pintan al arrancar ya está en el DOM cuando se
     traduce. Lo que pinten más tarde lo recoge el observador. */
  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', iniciar)
    : iniciar();

})();
