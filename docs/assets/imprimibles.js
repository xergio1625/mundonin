/* Mundonin · imprimibles. Cada página tiene solo una hoja; cada sección se activa si su hoja está presente. */
(function(){
"use strict";
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const rnd = n => Math.floor(Math.random()*n);
document.querySelectorAll("[data-print]").forEach(b=>b.onclick=()=>window.print());

if(document.getElementById("mazeBox")){
/* ---- laberinto ---- */
let maze=null;
function genMaze(c,r){
  const g=[...Array(r)].map(()=>[...Array(c)].map(()=>({n:true,s:true,e:true,w:true,v:false})));
  const st=[[0,0]]; g[0][0].v=true;
  while(st.length){
    const [x,y]=st[st.length-1], o=[];
    if(y>0&&!g[y-1][x].v) o.push(["n","s",x,y-1]);
    if(y<r-1&&!g[y+1][x].v) o.push(["s","n",x,y+1]);
    if(x>0&&!g[y][x-1].v) o.push(["w","e",x-1,y]);
    if(x<c-1&&!g[y][x+1].v) o.push(["e","w",x+1,y]);
    if(!o.length){ st.pop(); continue; }
    const [a,b,nx,ny]=o[rnd(o.length)];
    g[y][x][a]=false; g[ny][nx][b]=false; g[ny][nx].v=true; st.push([nx,ny]);
  }
  g[0][0].n=false; g[r-1][c-1].s=false;
  return g;
}
function solveMaze(g,c,r){
  const prev=new Map(), q=[[0,0]]; prev.set("0,0",null);
  while(q.length){
    const [x,y]=q.shift(); if(x===c-1&&y===r-1) break;
    const cell=g[y][x], nb=[];
    if(!cell.n&&y>0) nb.push([x,y-1]); if(!cell.s&&y<r-1) nb.push([x,y+1]);
    if(!cell.w&&x>0) nb.push([x-1,y]); if(!cell.e&&x<c-1) nb.push([x+1,y]);
    nb.forEach(([a,b])=>{ const k=a+","+b; if(!prev.has(k)){ prev.set(k,[x,y]); q.push([a,b]); } });
  }
  const path=[]; let cur=[c-1,r-1];
  while(cur){ path.push(cur); cur=prev.get(cur[0]+","+cur[1]); }
  return path.reverse();
}
function drawMaze(){
  const [c,r]=$("#mLevel").value.split("x").map(Number);
  if(!maze||maze.c!==c||maze.r!==r) maze={c,r,g:genMaze(c,r)};
  const g=maze.g; let lines="";
  for(let y=0;y<r;y++) for(let x=0;x<c;x++){
    const k=g[y][x];
    if(k.n) lines+=`M${x} ${y}h1`;
    if(k.w) lines+=`M${x} ${y}v1`;
    if(x===c-1&&k.e) lines+=`M${x+1} ${y}v1`;
    if(y===r-1&&k.s) lines+=`M${x} ${y+1}h1`;
  }
  let sol="";
  if($("#mSol").checked){ sol=`<polyline fill="none" stroke="#e07a3a" stroke-width=".28" stroke-linecap="round" stroke-linejoin="round" points="${solveMaze(g,c,r).map(([x,y])=>`${x+.5},${y+.5}`).join(" ")}"/>`; }
  $("#mazeBox").innerHTML = `<svg class="big" viewBox="-1 -1.4 ${c+2} ${r+2.8}" role="img" aria-label="Laberinto">
    <path d="${lines}" fill="none" stroke="#111" stroke-width=".12" stroke-linecap="round"/>${sol}
    <text x=".5" y="-.5" font-size="1.1" text-anchor="middle">🧸</text>
    <text x="${c-.5}" y="${r+1.1}" font-size="1.1" text-anchor="middle">🍯</text></svg>`;
}
$("#mNew").onclick=()=>{ maze=null; drawMaze(); };
$("#mLevel").onchange=()=>{ maze=null; drawMaze(); };
$("#mSol").onchange=drawMaze;
drawMaze();
}

if(document.getElementById("wsGrid")){
/* ---- sopa de letras ---- */
const WORDS=["GATO","PERRO","VACA","ELEFANTE","LEON","RANA","PINGUINO","MARIPOSA","TORTUGA","CABALLO","OSO","JIRAFA","PATO","DELFIN","CONEJO","MONO"];
let ws=null;
function genSearch(size,words,diag){
  const dirs=[[1,0],[0,1]]; if(diag) dirs.push([1,1]);
  for(let attempt=0;attempt<40;attempt++){
    const grid=[...Array(size)].map(()=>Array(size).fill("")), cells=[]; let ok=true;
    for(const w of [...words].sort((a,b)=>b.length-a.length)){
      let placed=false;
      for(let t=0;t<300&&!placed;t++){
        const [dx,dy]=dirs[rnd(dirs.length)], x=rnd(size), y=rnd(size);
        const ex=x+dx*(w.length-1), ey=y+dy*(w.length-1);
        if(ex>=size||ey>=size) continue;
        let fits=true; for(let i=0;i<w.length;i++){ const ch=grid[y+dy*i][x+dx*i]; if(ch&&ch!==w[i]){ fits=false; break; } }
        if(!fits) continue;
        for(let i=0;i<w.length;i++){ grid[y+dy*i][x+dx*i]=w[i]; cells.push((y+dy*i)*size+(x+dx*i)); }
        placed=true;
      }
      if(!placed){ ok=false; break; }
    }
    if(ok){
      const L="ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      for(let y=0;y<size;y++) for(let x=0;x<size;x++) if(!grid[y][x]) grid[y][x]=L[rnd(26)];
      return {grid,cells:new Set(cells),size,words};
    }
  }
  return null;
}
function newSearch(){
  const pick=[...WORDS].sort(()=>Math.random()-.5).slice(0,8);
  ws=genSearch(12,pick,$("#wLevel").value==="1") || genSearch(12,pick.slice(0,6),false);
  drawSearch();
}
function drawSearch(){
  const g=$("#wsGrid"); g.style.gridTemplateColumns=`repeat(${ws.size},1fr)`;
  const hit=$("#wSol").checked;
  g.innerHTML = ws.grid.flat().map((ch,i)=>`<div class="${hit&&ws.cells.has(i)?"hit":""}">${ch}</div>`).join("");
  $("#wsWords").innerHTML = ws.words.map(w=>`<li>${esc(w)}</li>`).join("");
}
$("#wNew").onclick=newSearch; $("#wLevel").onchange=newSearch; $("#wSol").onchange=drawSearch;
newSearch();
}

if(document.getElementById("cBox")){
/* ---- láminas para colorear ---- */
const ART = {
  oso:{title:"El osito", svg:`<svg class="big" viewBox="0 0 400 520" fill="none" stroke="#111" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" role="img" aria-label="Osito para colorear">
    <circle cx="125" cy="105" r="40"/><circle cx="125" cy="105" r="20"/><circle cx="275" cy="105" r="40"/><circle cx="275" cy="105" r="20"/>
    <circle cx="200" cy="190" r="95"/>
    <circle cx="165" cy="165" r="9" fill="#111"/><circle cx="235" cy="165" r="9" fill="#111"/>
    <ellipse cx="200" cy="222" rx="45" ry="34"/><ellipse cx="200" cy="208" rx="14" ry="10" fill="#111"/>
    <path d="M200 218v14M180 238q20 16 40 0"/>
    <ellipse cx="200" cy="395" rx="105" ry="110"/><ellipse cx="200" cy="410" rx="60" ry="70"/>
    <ellipse cx="80" cy="350" rx="38" ry="62" transform="rotate(25 80 350)"/><ellipse cx="320" cy="350" rx="38" ry="62" transform="rotate(-25 320 350)"/>
    <ellipse cx="135" cy="498" rx="50" ry="26"/><ellipse cx="265" cy="498" rx="50" ry="26"/>
    <circle cx="135" cy="498" r="12"/><circle cx="265" cy="498" r="12"/>
    <path d="M330 60l8 18 20 2-15 13 5 19-18-10-18 10 5-19-15-13 20-2z"/></svg>`},
  auto:{title:"El auto", svg:`<svg class="big" viewBox="0 0 400 520" fill="none" stroke="#111" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" role="img" aria-label="Auto para colorear">
    <circle cx="320" cy="90" r="34"/><path d="M320 38v-22M320 142v22M268 90h-22M372 90h22M283 53l-15-15M357 127l15 15M357 53l15-15M283 127l-15 15"/>
    <path d="M40 130q10-26 45-26 30 0 40 22 30-6 40 14-70 6-110 0-14 0-15-10z"/>
    <path d="M40 410v-80q0-30 30-30h260q30 0 30 30v80z"/>
    <path d="M95 300l45-90q8-16 26-16h110q18 0 26 16l45 90z"/>
    <path d="M120 292l30-62h50v62zM215 292v-62h42l30 62z"/>
    <circle cx="352" cy="338" r="14"/><circle cx="58" cy="338" r="14"/><path d="M190 340h20"/>
    <circle cx="125" cy="415" r="46" fill="#fff"/><circle cx="125" cy="415" r="20"/>
    <circle cx="285" cy="415" r="46" fill="#fff"/><circle cx="285" cy="415" r="20"/>
    <path d="M20 470h360M60 495h90M230 495h110"/></svg>`}
};
function drawArt(){ const a=ART[$("#cPick").value]; $("#cTitle").textContent=a.title; $("#cBox").innerHTML=a.svg; }
$("#cPick").onchange=drawArt;
drawArt();
}

if(document.getElementById("dipName")){
/* ---- diploma ---- */
function drawDip(){
  $("#dipName").textContent = $("#dName").value.trim() || " ";
  $("#dipWhy").textContent = $("#dWhy").value;
  $("#dipDate").textContent = "Ovalle, " + new Date().toLocaleDateString("es-CL",{day:"numeric",month:"long",year:"numeric"});
}
$("#dName").oninput=drawDip; $("#dWhy").onchange=drawDip;
drawDip();
}

if(document.getElementById("kCal")){
/* ---- calendario de retos ---- */
const RETOS=[
  "Construyan la torre más alta con lo que haya en casa. ¡Tómenle una foto!",
  "Inventen un cuento de cinco frases usando tres juguetes.",
  "Jueguen 15 minutos sin pantallas. El niño o la niña decide las reglas.",
  "Armen un zoológico y ordenen los animales por tamaño.",
  "Una partida de dominó o ludo entre tres generaciones.",
  "Carrera de autos: ¿cuántos lugares de la casa pueden recorrer?",
  "Dibujen a la familia como animales y adivinen quién es quién.",
  "Enséñale a un niño un juego que tú jugabas a su edad."
];
const MESES=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
(function(){
  const d=new Date(); let opts="";
  for(let i=0;i<3;i++){ const x=new Date(d.getFullYear(),d.getMonth()+i,1); opts+=`<option value="${x.getFullYear()}-${x.getMonth()+1}">${MESES[x.getMonth()]} ${x.getFullYear()}</option>`; }
  $("#kMonth").innerHTML=opts;
})();
function drawCal(){
  const [y,m]=$("#kMonth").value.split("-").map(Number);
  const days=new Date(y,m,0).getDate(), offset=(new Date(y,m-1,1).getDay()+6)%7;
  const cells=[...Array(offset).fill(0),...Array.from({length:days},(_,i)=>i+1)]; while(cells.length%7) cells.push(0);
  const weeks=cells.length/7; let html="<thead><tr>"+["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"].map(n=>`<th>${n}</th>`).join("")+"</tr></thead><tbody>";
  for(let w=0;w<weeks;w++){ html+="<tr>"+cells.slice(w*7,w*7+7).map(c=>c?`<td>${c}</td>`:`<td class="e"></td>`).join("")+"</tr>"; }
  $("#kCal").innerHTML=html+"</tbody>";
  $("#kTitle").textContent="Retos de "+MESES[m-1];
  $("#kRetos").innerHTML=Array.from({length:weeks},(_,w)=>`<li>☐ <b>Semana ${w+1}:</b> ${esc(RETOS[(m+w)%RETOS.length])}</li>`).join("");
}
$("#kMonth").onchange=drawCal;
drawCal();
}
})();
