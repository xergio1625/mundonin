/* Mundonin · comportamiento común del sitio.
   Los datos del negocio llegan en window.MN (los escribe build.mjs). */
(function(){
"use strict";
const MN = window.MN || {};
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const clp = n => "$" + Number(n).toLocaleString("es-CL");
const waLink = t => `https://wa.me/${MN.wa}?text=${encodeURIComponent(t)}`;
const REDUCE = matchMedia("(prefers-reduced-motion: reduce)").matches;
const pageUrl = () => { const c = $('link[rel="canonical"]'); return c ? c.href : location.href.split("#")[0]; };

/* ----- aviso y confeti ----- */
function toast(msg){ const t=$("#toast"); if(!t) return; t.textContent=msg; t.classList.add("on"); clearTimeout(toast.t); toast.t=setTimeout(()=>t.classList.remove("on"),2200); }
function confetti(x,y){
  if(REDUCE) return;
  const bits=["🎉","⭐","🧸","🎈","✨","🎁"];
  for(let i=0;i<18;i++){
    const s=document.createElement("span"); s.className="confetto"; s.textContent=bits[i%bits.length];
    s.style.left=x+"px"; s.style.top=y+"px";
    s.style.setProperty("--dx",(Math.random()*240-120)+"px"); s.style.setProperty("--dy",(Math.random()*-200-40)+"px"); s.style.setProperty("--r",(Math.random()*360)+"deg");
    document.body.appendChild(s); setTimeout(()=>s.remove(),1300);
  }
}
function share(text,u){
  const url = u || pageUrl();
  if(navigator.share){ navigator.share({text,url}).catch(()=>{}); }
  else window.open(`https://wa.me/?text=${encodeURIComponent(text+"\n"+url)}`,"_blank","noopener");
}
$$("[data-share]").forEach(b=>b.addEventListener("click",()=>share(b.dataset.share)));

/* ----- aparecer al hacer scroll ----- */
const io = ("IntersectionObserver" in window) ? new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); } }),{threshold:.12}) : null;
$$(".reveal").forEach(el=> io ? io.observe(el) : el.classList.add("in"));

/* ----- menú ----- */
function closeMenus(keepBurger){
  $$("#menu .dd.open").forEach(li=>{ li.classList.remove("open"); li.firstElementChild.setAttribute("aria-expanded","false"); });
  if(!keepBurger){ const m=$("#menu"), b=$("#burger"); if(m) m.classList.remove("open"); if(b) b.setAttribute("aria-expanded","false"); }
}
const burger = $("#burger");
if(burger) burger.addEventListener("click",()=>{ const o=$("#menu").classList.toggle("open"); burger.setAttribute("aria-expanded",o); });
const menu = $("#menu");
if(menu) menu.addEventListener("click", e=>{
  const b=e.target.closest(".dd-btn");
  if(b){ const li=b.parentElement, was=li.classList.contains("open"); closeMenus(true); li.classList.toggle("open",!was); b.setAttribute("aria-expanded",!was); }
});
document.addEventListener("click", e=>{ if(!e.target.closest("#menu,#burger")) closeMenus(); });
document.addEventListener("keydown", e=>{ if(e.key==="Escape") closeMenus(); });

/* ----- Memorice ----- */
const TINTS = ["#f3e2c9","#dcebd8","#f6d9cc","#e6e0cf","#f9ebb8","#d9e6e3"];
if($("#memgrid")){
  const ANIMALS = ["🐶","🐱","🐄","🐘","🦁","🐸","🐧","🦄","🐢","🦋"];
  let mem = {first:null,lock:false,moves:0,found:0,pairs:6};
  const shuffle = a => { for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
  const memStart = () => {
    const pairs=+$("#memLevel").value;
    mem={first:null,lock:false,moves:0,found:0,pairs};
    const deck = shuffle([...ANIMALS.slice(0,pairs),...ANIMALS.slice(0,pairs)]);
    $("#memgrid").innerHTML = deck.map((a,i)=>`<button class="mcard" data-i="${i}" data-a="${a}" aria-label="Carta ${i+1}" style="--tint2:${TINTS[i%TINTS.length]}"><span class="mi"><span class="mf" aria-hidden="true">❓</span><span class="mb" aria-hidden="true">${a}</span></span></button>`).join("");
    $("#memMoves").textContent="Intentos: 0"; $("#memMsg").textContent="";
  };
  $("#memgrid").addEventListener("click", e=>{
    const c=e.target.closest(".mcard"); if(!c||mem.lock||c.classList.contains("flip")||c.classList.contains("done")) return;
    c.classList.add("flip"); c.setAttribute("aria-label",`Carta ${+c.dataset.i+1}: ${c.dataset.a}`);
    if(!mem.first){ mem.first=c; return; }
    mem.moves++; $("#memMoves").textContent="Intentos: "+mem.moves;
    const a=mem.first, b=c; mem.first=null;
    if(a.dataset.a===b.dataset.a){
      a.classList.replace("flip","done"); b.classList.replace("flip","done"); mem.found++;
      if(mem.found===mem.pairs){
        $("#memMsg").innerHTML = `¡Lo lograste en ${mem.moves} intentos! 🎉 <button class="btn sm" id="memShare">Reta a tu familia</button>`;
        const r=b.getBoundingClientRect(); confetti(r.left+r.width/2,r.top);
        $("#memShare").onclick=()=>share(`Resolví el memorice de Mundonin en ${mem.moves} intentos. ¿Puedes ganarme? 🧠`);
      }
    } else {
      mem.lock=true;
      setTimeout(()=>{ [a,b].forEach(x=>{ x.classList.remove("flip"); x.setAttribute("aria-label",`Carta ${+x.dataset.i+1}`); }); mem.lock=false; }, 800);
    }
  });
  $("#memRestart").onclick = memStart; $("#memLevel").onchange = memStart;
  memStart();
}

/* ----- ¿A qué jugamos hoy? ----- */
if($("#ideaBtn")){
  const IDEAS = [
  {t:"Sonidos y texturas",min:0,max:2,pmin:2,pmax:3,time:"10 min",cat:"Animales",how:"Muestra un sonajero y un peluche suave, cambia el ritmo y la voz. Deja que el bebé los toque y los mire con calma."},
  {t:"Carrera de autos con rampa",min:2,max:7,pmin:2,pmax:5,time:"15 min",cat:"Autos y carritos",how:"Armen una rampa con un libro o una tabla. Cada uno elige un auto y adivina cuál llegará más lejos. Midan la distancia con pasos."},
  {t:"Zoológico en el living",min:2,max:8,pmin:2,pmax:6,time:"20 min",cat:"Animales",how:"Ordenen los animales por tamaño, por dónde viven o por el sonido que hacen. Cada persona imita a uno."},
  {t:"Té de peluches",min:2,max:7,pmin:2,pmax:5,time:"20 min",cat:"Peluches",how:"Preparen una mesa para los peluches. Cada invitado tiene nombre y una historia. Se turnan para servir."},
  {t:"Hospital de peluches",min:3,max:8,pmin:2,pmax:4,time:"20 min",cat:"Peluches",how:"Un peluche se siente mal: ¿qué le pasa? Revísenlo, cuídenlo y cuenten cómo se cuida uno cuando está enfermo."},
  {t:"Cuento en cadena",min:3,max:99,pmin:2,pmax:8,time:"10 min",cat:"Peluches",how:"Elijan tres juguetes y cada persona agrega una frase al cuento. Gana el final más loco."},
  {t:"Detective de animales",min:4,max:9,pmin:2,pmax:6,time:"15 min",cat:"Animales",how:"Una persona esconde un animal y da tres pistas. Los demás preguntan solo con sí o no hasta adivinar."},
  {t:"Mochila exploradora",min:4,max:10,pmin:2,pmax:5,time:"30 min",cat:"Mochilas",how:"Cada uno arma su mochila para una aventura dentro de casa. ¿Qué llevarías a la selva? Después cuentan el viaje."},
  {t:"Ludo en familia",min:5,max:99,pmin:2,pmax:4,time:"25 min",cat:"Juegos de mesa",how:"Pongan una regla de la casa: quien llega primero elige el próximo juego. Perder también es pasar un buen rato."},
  {t:"Dibuja y adivina",min:5,max:99,pmin:3,pmax:8,time:"20 min",cat:"Librería",how:"Un dibujo por turno, sin hablar. Quien adivina dibuja el siguiente. Ideal para estrenar lápices nuevos."},
  {t:"Torneo de dominó",min:6,max:99,pmin:2,pmax:4,time:"30 min",cat:"Juegos de mesa",how:"Un torneo entre generaciones: abuelos, padres e hijos. Anoten los puntos y premien con un abrazo."}
];
  let lastIdea=-1;
  $("#ideaBtn").onclick = () => {
    const age=+$("#iAge").value, pl=+$("#iPlayers").value;
    let pool=IDEAS.filter(i=>age>=i.min&&age<=i.max&&pl>=i.pmin&&pl<=i.pmax);
    if(!pool.length) pool=IDEAS.filter(i=>age>=i.min&&age<=i.max);
    if(!pool.length) pool=IDEAS;
    let idea; do{ idea=pool[Math.floor(Math.random()*pool.length)]; }while(pool.length>1&&IDEAS.indexOf(idea)===lastIdea);
    lastIdea=IDEAS.indexOf(idea);
    const d=$("#dice"); d.classList.remove("spin"); void d.offsetWidth; d.classList.add("spin");
    const catBtn = MN.catalogUrl
      ? `<a class="btn sm" href="${esc(MN.catalogUrl)}" target="_blank" rel="noopener">Ver el catálogo</a>`
      : `<a class="btn sm" href="/avisame/">Avísame cuando haya ${esc(idea.cat)}</a>`;
    $("#ideaOut").innerHTML = `<div class="idea"><h4>${esc(idea.t)}</h4><p>${esc(idea.how)}</p><p class="note">⏱ ${esc(idea.time)} · Con: ${esc(idea.cat)}</p><div class="row" style="margin-top:8px">${catBtn}<button class="btn alt sm" id="ideaShare">Compartir idea</button></div></div>`;
    $("#ideaShare").onclick=()=>share(`Idea para jugar hoy: ${idea.t}. ${idea.how}`);
  };
}

/* ----- Reto de la semana ----- */
if($("#challengeText")){
  const CHALLENGES = [
  "Construyan la torre más alta con lo que haya en casa. ¡Tómenle una foto!",
  "Inventen un cuento de cinco frases usando tres juguetes.",
  "Jueguen 15 minutos sin pantallas. El niño o la niña decide las reglas.",
  "Armen un zoológico y ordenen los animales por tamaño.",
  "Una partida de dominó o ludo entre tres generaciones.",
  "Carrera de autos: ¿cuántos lugares de la casa pueden recorrer?",
  "Dibujen a la familia como animales y adivinen quién es quién.",
  "Enséñale a un niño un juego que tú jugabas a su edad."
];
  const chal = CHALLENGES[Math.floor(Date.now()/(7*864e5)) % CHALLENGES.length];
  $("#challengeText").textContent = chal;
  $("#challengeShare").onclick = () => share("Reto familiar de la semana de Mundonin ⭐: " + chal);
}

/* ----- Avísame de novedades ----- */
/* El mensaje empieza siempre con "Hola Mundonin, quiero recibir novedades": sirve de palabra clave para un chatbot. */
if($("#notifyForm")){
  $("#notifyForm").addEventListener("submit", e=>{
    e.preventDefault();
    const cats=$$("#nCats input:checked").map(i=>i.value);
    const what=$("#nWhat").value.trim(), age=$("#nAge").value.trim(), name=$("#nName").value.trim();
    if(!cats.length && !what){ toast("Elige una categoría o cuéntanos qué buscas"); return; }
    const msg = [
      `Hola Mundonin, quiero recibir novedades${name?` (soy ${name})`:""}.`,
      cats.length ? `Me interesa: ${cats.join(", ")}` : "",
      what ? `Busco: ${what}${age?` (para ${age})`:""}` : (age ? `Edad: ${age}` : "")
    ].filter(Boolean).join("\n");
    window.open(waLink(msg),"_blank","noopener");
    toast("Listo, te avisamos por WhatsApp 🔔"); e.target.reset();
  });
}

/* ----- Club ----- */
if($("#clubForm")){
  $("#clubForm").addEventListener("submit", e=>{
    e.preventDefault();
    if(MN.clubPayUrl){ window.open(MN.clubPayUrl,"_blank","noopener"); return; }
    const msg=`Hola Mundonin, soy ${$("#cName").value.trim()} (${$("#cMail").value.trim()}). Quiero unirme al Club Mundonin (${clp(MN.clubPrice)} al mes) para un niño o niña de ${$("#cAge").value}. ¿Me envían el enlace de pago?`;
    window.open(waLink(msg),"_blank","noopener");
    toast("Listo, te escribimos por WhatsApp ⭐");
  });
  $("#clubCancel").addEventListener("click", e=>{
    e.preventDefault();
    window.open(MN.clubCancelUrl || waLink("Hola Mundonin, quiero darme de baja del Club Mundonin."),"_blank","noopener");
  });
}

/* ----- Filtro de artículos (las tarjetas ya están en el HTML) ----- */
const artChips = $("#artChips");
if(artChips){
  artChips.addEventListener("click", e=>{
    const b=e.target.closest(".chip"); if(!b) return;
    $$("#artChips .chip").forEach(c=>c.setAttribute("aria-pressed", c===b));
    $$("#artGrid [data-tag]").forEach(a=>{ a.hidden = b.dataset.t!=="Todos" && a.dataset.tag!==b.dataset.t; });
  });
}
})();
