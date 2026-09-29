const header=document.getElementById("siteHeader");
const menuToggle=document.getElementById("menuToggle");
const navPanel=document.getElementById("navPanel");
const themeBtn=document.getElementById("themeBtn");
const topBtn=document.getElementById("topBtn");

window.addEventListener("scroll",()=>{
  header.classList.toggle("scrolled",window.scrollY>30);
  topBtn.classList.toggle("show",window.scrollY>500);
},{passive:true});

menuToggle.addEventListener("click",()=>{
  const open=navPanel.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded",open);
});
document.querySelectorAll(".nav-panel a").forEach(a=>a.addEventListener("click",()=>navPanel.classList.remove("open")));

const savedTheme=localStorage.getItem("melana-theme");
if(savedTheme==="dark") document.body.classList.add("dark");
function updateThemeIcon(){themeBtn.textContent=document.body.classList.contains("dark")?"☀":"☼"}
updateThemeIcon();
themeBtn.addEventListener("click",()=>{
  document.body.classList.toggle("dark");
  localStorage.setItem("melana-theme",document.body.classList.contains("dark")?"dark":"light");
  updateThemeIcon();
});

topBtn.addEventListener("click",()=>window.scrollTo({top:0,behavior:"smooth"}));

const items=[...document.querySelectorAll(".gallery-item")];
const lightbox=document.getElementById("lightbox");
const lbImg=document.getElementById("lightboxImg");
const lbCaption=document.getElementById("lightboxCaption");
let current=0;

function showImage(i){
  current=(i+items.length)%items.length;
  const item=items[current];
  lbImg.src=item.dataset.src;
  lbImg.alt=item.querySelector("img").alt;
  lbCaption.textContent=item.dataset.title||"";
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden","false");
  document.body.style.overflow="hidden";
}
function closeLightbox(){
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden","true");
  document.body.style.overflow="";
}
items.forEach((item,i)=>item.addEventListener("click",()=>showImage(i)));
document.getElementById("lightboxClose").addEventListener("click",closeLightbox);
document.getElementById("lightboxPrev").addEventListener("click",()=>showImage(current-1));
document.getElementById("lightboxNext").addEventListener("click",()=>showImage(current+1));
lightbox.addEventListener("click",e=>{if(e.target===lightbox)closeLightbox()});
document.addEventListener("keydown",e=>{
  if(!lightbox.classList.contains("open")) return;
  if(e.key==="Escape") closeLightbox();
  if(e.key==="ArrowLeft") showImage(current-1);
  if(e.key==="ArrowRight") showImage(current+1);
});
