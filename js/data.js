/* ============================================================
   DATA · Edita aquí tu información (skills, experiencia,
   proyectos y contacto). El resto de la página se arma sola.
   ============================================================ */

/* --- MI EDUCACIÓN (state: "en curso" o "listo") --- */
const EDUCACION = [
  {
    title: "Ingeniería en Ejecución de Sistemas",
    place: "Educación superior",
    detail: "Continuación de la formación técnica hacia el grado de ingeniería: arquitectura de sistemas, gestión de proyectos y desarrollo avanzado.",
    state: "en curso",
  },
  {
    title: "Analista de Sistemas · Programador",
    place: "Carrera técnica",
    detail: "Análisis y diseño de sistemas, programación y bases de datos. Es la base de todo lo que construyo hoy.",
    state: "listo",
  },
  {
    title: "Enseñanza media completa",
    place: "4º medio",
    detail: "Educación media finalizada.",
    state: "listo",
  },
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
    date: "2023-2025",
    desc: "Búsqueda por sistema y en bodega de cajas y productos para pickeadores, con movimientos por sistema y carga por radiofrecuencia según la instalación solicitada.",
    tags: ["Radiofrecuencia", "Excel", "SAP"],
  },
  {
    role: "Ayudante de Soldador",
    company: "Rompeltiem (BOCH)",
    date: "2022-2023",
    desc: "Fabricación, mantención y pruebas de calderas: apoyo en soldadura, manejo de herramientas, movilización y transporte.",
    tags: ["Aprendizaje", "Trabajo en equipo"],
  },
];

/* --- PROYECTOS (nombre, descripción, link real y tags) --- */
const PROYECTOS = [
  {
    name: "Brasa Burger · Hamburguesería",
    img: "img/proyectos/brasa-burger.jpg",
    desc: "Sitio para una hamburguesería artesanal: portada con hamburguesas animadas que rotan, carta digital ilustrada (burgers, malteadas, cafés), reserva de mesa y pedidos a domicilio por WhatsApp.",
    link: "https://brasa-burger-alpha.vercel.app",
    tags: ["HTML", "CSS", "JavaScript", "SVG", "Animaciones"],
  },
  {
    name: "Overdrive · Tienda de Cosplay",
    img: "img/proyectos/overdrive.png",
    desc: "Tienda temática con dos perfiles: vista de cliente (catálogo con ofertas y stock en tiempo real, pedidos por WhatsApp) y panel administrativo completo. Base de datos real en la nube. Proyecto en producción, en uso por el cliente.",
    link: "https://overdrive-woad.vercel.app",
    tags: ["JavaScript", "API Serverless", "Redis", "Admin"],
  },
  {
    name: "Pixel Restaurant · Arcade Bar",
    img: "img/proyectos/pixel-restaurant.png",
    desc: "Carta virtual con temática pixel art para un bar arcade: categorías, fichas de platos con ingredientes, animaciones y carrito de pedidos.",
    link: "https://pixel-restaurant.vercel.app",
    tags: ["React", "Vite", "Tailwind"],
  },
  {
    name: "Plantel · Gestión de Personal",
    img: "img/proyectos/plantel.png",
    desc: "App de RR.HH. para administrar personal: contratos, horarios y nómina. Base de datos real (Neon Postgres), API serverless y autenticación JWT.",
    link: "https://plantel-gestion-personal.vercel.app",
    tags: ["JavaScript", "Postgres", "API", "JWT"],
  },
  {
    name: "Bodega · Gestión de Mercadería",
    img: "img/proyectos/bodega.png",
    desc: "Sistema para personal administrativo de bodega: control de vencimientos, stock, mermas, compras y cargas masivas desde Excel. Funciona sin instalación.",
    link: "https://bodega-gestion.vercel.app",
    tags: ["JavaScript", "Excel", "LocalStorage"],
  },
  {
    name: "Planetario Austral",
    img: "img/proyectos/planetario.png",
    desc: "Sitio educativo con buscador de astros, módulos de aprendizaje verificados con NASA/ESA y una zona Kids gamificada con estrellas por descubrir.",
    link: "https://planetario-austral.vercel.app",
    tags: ["JavaScript", "Educación", "UI/UX"],
  },
  {
    name: "Ferretería EL GALPÓN",
    img: "img/proyectos/ferreteria.png",
    desc: "Sitio catálogo para una ferretería y maquinaria: más de 190 productos con filtros por categoría, búsqueda y enfoque en precios mayoristas por volumen.",
    link: "https://ferreteria-el-galpon.vercel.app",
    tags: ["HTML", "CSS", "JavaScript"],
  },
  {
    name: "Café Aurora · Cafetería de Especialidad",
    img: "img/proyectos/cafe-aurora.jpg",
    desc: "Sitio para una cafetería de especialidad con robot 3D interactivo en la portada sobre un degradado animado por shader. Carta filtrable por tipo de bebida, botones de vidrio con agua simulada que se sacude al pasar el cursor, y sección de delivery con una carretera de luces en WebGL.",
    link: "https://cafe-aurora-theta.vercel.app",
    tags: ["JavaScript", "WebGL", "Three.js", "Spline 3D", "Canvas"],
  },
];

/* --- FRASES DE LA PORTADA (efecto máquina de escribir) --- */
const FRASES = [
  "Desarrollador web",
  "Analista de sistemas",
  "Estudiante de ingeniería",
  "Lector de fantasía",
];

/* --- PASATIEMPOS --- */
const PASATIEMPOS = [
  {
    icon: "libro",
    title: "Fantasía y terror",
    desc: "El Señor de los Anillos y todo el Cosmere de Sanderson: Mistborn y El Archivo de las Tormentas. Del otro lado, Stephen King con It y Misery. Mundos con reglas propias y finales que se sostienen.",
  },
  {
    icon: "pantalla",
    title: "Series",
    desc: "Crimen e investigación con El Mentalista y Dr. House; humor con The Big Bang Theory y Rick y Morty. Me quedo con las que resuelven bien el rompecabezas.",
  },
  {
    icon: "engranaje",
    title: "Estudiar y construir",
    desc: "Ingeniería informática, trabajo de medio tiempo para costear la carrera y desarrollo de páginas web para clientes. Los tres a la vez, y el código es el que más me entretiene.",
  },
];

/* --- FOTOS QUE VIAJAN POR LA PÁGINA ---
   Para que aparezcan, guarda tus 3 fotos en la carpeta img/
   con EXACTAMENTE estos nombres de archivo. --- */
const FOTOS = [
  { key: "hermano",    file: "img/hermano.jpg",    alt: "Cristóbal junto a su hermano menor", caption: "Lám. I: Fuera del teclado" },
  { key: "traje",      file: "img/traje.jpg",      alt: "Cristóbal de traje",                 caption: "Lám. II: El profesional" },
  { key: "escritorio", file: "img/escritorio.jpg", alt: "Cristóbal programando en su escritorio", caption: "Lám. III: En el taller" },
];

/* Qué foto se muestra en cada sección al hacer scroll */
const RIEL_SECCIONES = {
  portada: "portada",
  perfil: "mazo",
  conocimientos: "mazo",
  pasatiempos: "pasatiempos",
  experiencia: "experiencia",
  proyectos: "proyectos",
  servicios: "mazo",
  contacto: "mazo",
};

/* --- STACK PARA LA CINTA INFINITA (LogoLoop) --- */
const STACK = [
  { name: "JavaScript", icon: "js" },
  { name: "HTML5",      icon: "html" },
  { name: "CSS3",       icon: "css" },
  { name: "Python",     icon: "python" },
  { name: "Java",       icon: "java" },
  { name: "SQL",        icon: "sql" },
  { name: "React",      icon: "react" },
  { name: "Node.js",    icon: "node" },
  { name: "Git",        icon: "git" },
  { name: "Vercel",     icon: "vercel" },
  { name: "Excel",      icon: "excel" },
];

/* --- CONTACTO --- */
const CONTACTO = {
  email: "cristobal.chacon2003@gmail.com",
  github: "https://github.com/Instacris",
  linkedin: "https://www.linkedin.com/",
  whatsapp: "56940443203",
};

/* Exponer en window para que main.js pueda leerlos */
window.EDUCACION = EDUCACION;
window.HERRAMIENTAS = HERRAMIENTAS;
window.EXCEL_SKILLS = EXCEL_SKILLS;
window.EXPERIENCIA = EXPERIENCIA;
window.PROYECTOS = PROYECTOS;
window.CONTACTO = CONTACTO;
window.FRASES = FRASES;
window.PASATIEMPOS = PASATIEMPOS;
window.FOTOS = FOTOS;
window.RIEL_SECCIONES = RIEL_SECCIONES;
window.STACK = STACK;
