/* ============================================================
   DATA · Edita aquí tu información (skills, experiencia,
   proyectos y contacto). El resto de la página se arma sola.
   ============================================================ */

/* --- LENGUAJES DE PROGRAMACIÓN (nombre / nivel %) --- */
const LENGUAJES = [
  { name: "JavaScript", level: 90 },
  { name: "HTML5",      level: 95 },
  { name: "CSS3",       level: 90 },
  { name: "Python",     level: 80 },
  { name: "Java",       level: 70 },
  { name: "SQL",        level: 75 },
];

/* --- HERRAMIENTAS DE TRABAJO (nombre / descripción / etiqueta) --- */
const HERRAMIENTAS = [
  { name: "VS Code",        desc: "Editor principal, con terminal y depuración integradas.", tag: "Editor" },
  { name: "Git & GitHub",   desc: "Control de versiones, repositorios públicos y colaboración.", tag: "Versiones" },
  { name: "Node.js",        desc: "Servidores, APIs y automatizaciones con npm.", tag: "Backend" },
  { name: "Vercel",         desc: "Despliegue y hosting de todos mis proyectos.", tag: "Deploy" },
  { name: "Bases de datos", desc: "Postgres (Neon) y Redis: modelado y consultas SQL.", tag: "Datos" },
  { name: "IA aplicada",    desc: "Asistentes de IA para acelerar desarrollo y pruebas.", tag: "Boost" },
];

/* --- EXCEL: habilidades concretas --- */
const EXCEL_SKILLS = [
  "Tablas dinámicas",
  "BUSCARV / BUSCARX",
  "Funciones SI, SUMAR.SI y CONTAR.SI",
  "Power Query (limpieza y transformación de datos)",
  "Macros básicas (VBA)",
  "Formato condicional y validación de datos",
  "Gráficos y dashboards dinámicos",
];

/* --- EXPERIENCIA LABORAL --- */
const EXPERIENCIA = [
  {
    role: "Analista de Acreditación",
    company: "Liderman",
    date: "2025",
    desc: "Revisión de documentación de empresas y de trabajadores de clientes externos, velando por que su acreditación estuviera siempre al día.",
    tags: ["Excel", "Apps de clientes", "Outlook"],
  },
  {
    role: "Operario R/F",
    company: "Natura",
    date: "2023 — 2025",
    desc: "Búsqueda por sistema y en bodega de cajas y productos para pickeadores, con movimientos por sistema y carga por radiofrecuencia según la instalación solicitada.",
    tags: ["Radiofrecuencia", "Excel", "SAP"],
  },
  {
    role: "Ayudante de Soldador",
    company: "Rompeltiem (BOCH)",
    date: "2022 — 2023",
    desc: "Fabricación, mantención y pruebas de calderas: apoyo en soldadura, manejo de herramientas, movilización y transporte.",
    tags: ["Aprendizaje", "Trabajo en equipo"],
  },
];

/* --- PROYECTOS (nombre, descripción, link real y tags) --- */
const PROYECTOS = [
  {
    name: "Brasa Burger · Hamburguesería",
    desc: "Sitio para una hamburguesería artesanal: portada con hamburguesas animadas que rotan, carta digital ilustrada (burgers, malteadas, cafés), reserva de mesa y pedidos a domicilio por WhatsApp.",
    link: "https://brasa-burger-alpha.vercel.app",
    tags: ["HTML", "CSS", "JavaScript", "SVG", "Animaciones"],
  },
  {
    name: "Overdrive · Tienda de Cosplay",
    desc: "Tienda temática con dos perfiles: vista de cliente (catálogo con ofertas y stock en tiempo real, pedidos por WhatsApp) y panel administrativo completo. Base de datos real en la nube.",
    link: "https://overdrive-woad.vercel.app/demo",
    tags: ["JavaScript", "API Serverless", "Redis", "Admin"],
  },
  {
    name: "Pixel Restaurant · Arcade Bar",
    desc: "Carta virtual con temática pixel art para un bar arcade: categorías, fichas de platos con ingredientes, animaciones y carrito de pedidos.",
    link: "https://pixel-restaurant.vercel.app",
    tags: ["React", "Vite", "Tailwind"],
  },
  {
    name: "Plantel · Gestión de Personal",
    desc: "App de RR.HH. para administrar personal: contratos, horarios y nómina. Base de datos real (Neon Postgres), API serverless y autenticación JWT.",
    link: "https://plantel-gestion-personal.vercel.app",
    tags: ["JavaScript", "Postgres", "API", "JWT"],
  },
  {
    name: "Bodega · Gestión de Mercadería",
    desc: "Sistema para personal administrativo de bodega: control de vencimientos, stock, mermas, compras y cargas masivas desde Excel. Funciona sin instalación.",
    link: "https://bodega-gestion.vercel.app",
    tags: ["JavaScript", "Excel", "LocalStorage"],
  },
  {
    name: "Superpan · Amasandería",
    desc: "Sitio comercial mobile-first para una amasandería y pastelería de Quinta Normal: catálogo con filtros, pedidos por WhatsApp, SEO y panel de administración.",
    link: "https://superpan-web.vercel.app",
    tags: ["HTML", "CSS", "JavaScript", "SEO"],
  },
  {
    name: "Clínica Quillay",
    desc: "Landing institucional para una clínica: reserva de horas en 4 pasos con validación de RUT, buscador de especialidades, FAQ y diseño accesible.",
    link: "https://clinica-quillay.vercel.app",
    tags: ["HTML", "CSS", "JS vanilla"],
  },
  {
    name: "Planetario Austral",
    desc: "Sitio educativo con buscador de astros, módulos de aprendizaje verificados con NASA/ESA y una zona Kids gamificada con estrellas por descubrir.",
    link: "https://planetario-austral.vercel.app",
    tags: ["JavaScript", "Educación", "UI/UX"],
  },
  {
    name: "Ferretería EL GALPÓN",
    desc: "Sitio catálogo para una ferretería y maquinaria: más de 190 productos con filtros por categoría, búsqueda y enfoque en precios mayoristas por volumen.",
    link: "https://ferreteria-el-galpon.vercel.app",
    tags: ["HTML", "CSS", "JavaScript"],
  },
  {
    name: "ORIGEN · Tienda de Café",
    desc: "Tienda online de café y máquinas con carrito, checkout que descuenta stock y panel de administración completo (productos, pedidos y ajustes).",
    link: "https://origen-cafe-eta.vercel.app",
    tags: ["JavaScript", "E-commerce", "Admin"],
  },
  {
    name: "Ébano · Alta Sastrería",
    desc: "Sitio para una casa de sastrería de alta gama: trajes a medida, alta costura y calzado artesanal. Agenda de citas y consultas por WhatsApp o correo, muestrario de telas en CSS puro y doble tema.",
    link: "https://ebano-sastreria.vercel.app",
    tags: ["HTML", "CSS", "JS vanilla", "UI/UX"],
  },
];

/* --- CONTACTO --- */
const CONTACTO = {
  email: "cristobal.chacon2003@gmail.com",
  github: "https://github.com/Instacris",
  linkedin: "https://www.linkedin.com/",
  whatsapp: "56940443203",
};

/* Exponer en window para que main.js pueda leerlos */
window.LENGUAJES = LENGUAJES;
window.HERRAMIENTAS = HERRAMIENTAS;
window.EXCEL_SKILLS = EXCEL_SKILLS;
window.EXPERIENCIA = EXPERIENCIA;
window.PROYECTOS = PROYECTOS;
window.CONTACTO = CONTACTO;
