const root=document.documentElement;
const themeToggle=document.getElementById("themeToggle");
const menuBtn=document.getElementById("menuBtn");
const navLinks=document.getElementById("navLinks");
const navbar=document.getElementById("navbar");
const backTop=document.getElementById("backTop");
const progress=document.getElementById("scrollProgress");
const cursorGlow=document.querySelector(".cursor-glow");
const reduceMotion=window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const savedTheme=localStorage.getItem("portfolio-theme");
if(savedTheme==="light"){root.setAttribute("data-theme","light");themeToggle.textContent="☀"}else themeToggle.textContent="☾";

themeToggle.addEventListener("click",()=>{
  const light=root.getAttribute("data-theme")==="light";
  if(light){root.removeAttribute("data-theme");localStorage.setItem("portfolio-theme","dark");themeToggle.textContent="☾"}
  else{root.setAttribute("data-theme","light");localStorage.setItem("portfolio-theme","light");themeToggle.textContent="☀"}
});

menuBtn.addEventListener("click",()=>{
  const open=navLinks.classList.toggle("open");
  menuBtn.textContent=open?"✕":"☰";
  menuBtn.setAttribute("aria-expanded",String(open));
});
document.querySelectorAll(".nav-links a").forEach(a=>a.addEventListener("click",()=>{
  navLinks.classList.remove("open");menuBtn.textContent="☰";menuBtn.setAttribute("aria-expanded","false");
}));

function handleScroll(){
  const y=window.scrollY;
  navbar.classList.toggle("scrolled",y>20);
  backTop.classList.toggle("show",y>500);
  const max=document.documentElement.scrollHeight-window.innerHeight;
  progress.style.width=`${max>0?(y/max)*100:0}%`;
}
window.addEventListener("scroll",handleScroll,{passive:true});handleScroll();
backTop.addEventListener("click",()=>window.scrollTo({top:0,behavior:"smooth"}));

const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add("visible");
      if(entry.target.classList.contains("skill-meters")){
        entry.target.querySelectorAll(".meter-track i").forEach(i=>i.style.setProperty("--level",i.dataset.level));
      }
      if(entry.target.hasAttribute("data-counted"))return;
      entry.target.setAttribute("data-counted","");
      entry.target.querySelectorAll?.("[data-count]").forEach(animateCounter);
    }
  });
},{threshold:.14});
document.querySelectorAll(".reveal,.skill-meters").forEach(el=>observer.observe(el));

function animateCounter(el){
  const target=Number(el.dataset.count),decimals=Number(el.dataset.decimals||0),suffix=el.dataset.suffix||"";
  if(reduceMotion){el.textContent=target.toFixed(decimals)+suffix;return}
  const start=performance.now(),duration=1200;
  function tick(now){
    const p=Math.min((now-start)/duration,1),ease=1-Math.pow(1-p,3);
    el.textContent=(target*ease).toFixed(decimals)+suffix;
    if(p<1)requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

document.querySelectorAll(".section").forEach(section=>{
  section.querySelectorAll("[data-count]").forEach(el=>{
    const observer2=new IntersectionObserver(es=>{
      if(es[0].isIntersecting){animateCounter(el);observer2.disconnect()}
    },{threshold:.6});observer2.observe(el);
  });
});

const phrases=["Data Analyst","Data Enthusiast","Python Developer","Machine Learning Enthusiast"];
const typeEl=document.getElementById("typewriter");
let phraseIndex=0,charIndex=0,deleting=false;
function typeLoop(){
  if(reduceMotion){typeEl.textContent=phrases[0];return}
  const word=phrases[phraseIndex];
  typeEl.textContent=deleting?word.slice(0,--charIndex):word.slice(0,++charIndex);
  let delay=deleting?45:85;
  if(!deleting&&charIndex===word.length){delay=1400;deleting=true}
  else if(deleting&&charIndex===0){deleting=false;phraseIndex=(phraseIndex+1)%phrases.length;delay=350}
  setTimeout(typeLoop,delay);
}
typeLoop();

if(!reduceMotion){
  const count=28,container=document.getElementById("particles");
  for(let i=0;i<count;i++){
    const p=document.createElement("span");p.className="particle";
    p.style.left=Math.random()*100+"%";p.style.bottom=(-10+Math.random()*30)+"%";
    p.style.setProperty("--duration",(10+Math.random()*18)+"s");
    p.style.setProperty("--drift",(-100+Math.random()*200)+"px");
    p.style.animationDelay=(-Math.random()*20)+"s";
    container.appendChild(p);
  }
  document.addEventListener("pointermove",e=>{
    cursorGlow.style.left=e.clientX+"px";cursorGlow.style.top=e.clientY+"px";
  },{passive:true});

  document.querySelectorAll(".tilt-card").forEach(card=>{
    card.addEventListener("pointermove",e=>{
      const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
      card.style.transform=`perspective(900px) rotateX(${y*-5}deg) rotateY(${x*5}deg) translateY(-4px)`;
    });
    card.addEventListener("pointerleave",()=>card.style.transform="");
  });
}

document.querySelectorAll(".magnetic").forEach(btn=>{
  if(reduceMotion)return;
  btn.addEventListener("pointermove",e=>{
    const r=btn.getBoundingClientRect();btn.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.08}px,${(e.clientY-r.top-r.height/2)*.08}px)`;
  });
  btn.addEventListener("pointerleave",()=>btn.style.transform="");
});

const sections=[...document.querySelectorAll("main section[id]")];
const navAnchors=[...document.querySelectorAll(".nav-links a")];
const sectionObserver=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      navAnchors.forEach(a=>a.classList.toggle("active",a.getAttribute("href")==="#"+entry.target.id));
    }
  });
},{rootMargin:"-35% 0px -55% 0px"});
sections.forEach(s=>sectionObserver.observe(s));

document.getElementById("year").textContent=new Date().getFullYear();
