import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './supabase-config.js';

const configured = SUPABASE_URL.startsWith('https://') && !SUPABASE_URL.includes('PASTE_') && !SUPABASE_ANON_KEY.includes('PASTE_');
const esc=s=>String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const annEl=document.getElementById('announcementList');
const galEl=document.getElementById('liveGallery');
if(!configured){
  annEl.innerHTML='<div class="live-empty">New announcements will appear after the free Supabase setup is completed.</div>';
  galEl.innerHTML='<div class="live-empty">New community photos will appear after the free Supabase setup is completed.</div>';
}else{
  const supabase=createClient(SUPABASE_URL,SUPABASE_ANON_KEY);
  async function load(){
    const {data:anns,error:ae}=await supabase.from('announcements').select('*').order('created_at',{ascending:false}).limit(12);
    if(ae){annEl.innerHTML='<div class="live-empty">Announcements are temporarily unavailable.</div>'}else if(!anns?.length){annEl.innerHTML='<div class="live-empty">No new announcements yet.</div>'}else{
      annEl.innerHTML=anns.map(x=>`<article class="announcement-card">${x.image_url?`<img src="${esc(x.image_url)}" alt="">`:''}<div class="announcement-body"><div class="announcement-date">${esc(x.date||'Latest update')}</div><h3>${esc(x.title)}</h3><p>${esc(x.content)}</p></div></article>`).join('');
    }
    const {data:photos,error:pe}=await supabase.from('gallery').select('*').order('created_at',{ascending:false}).limit(24);
    if(pe){galEl.innerHTML='<div class="live-empty">New photos are temporarily unavailable.</div>'}else if(!photos?.length){galEl.innerHTML='<div class="live-empty">No new community photos yet.</div>'}else{
      galEl.innerHTML=photos.map(x=>`<button class="live-photo" type="button" data-src="${esc(x.url)}" data-title="${esc(x.title||'Melanalandhula')}"><img src="${esc(x.url)}" alt="${esc(x.title||'Melanalandhula photo')}" loading="lazy"><span>${esc(x.title||'Melanalandhula')}</span></button>`).join('');
      galEl.querySelectorAll('.live-photo').forEach(btn=>btn.addEventListener('click',()=>{
        const img=document.getElementById('lightboxImg'),cap=document.getElementById('lightboxCaption'),box=document.getElementById('lightbox');
        img.src=btn.dataset.src;img.alt=btn.dataset.title;cap.textContent=btn.dataset.title;box.classList.add('open');box.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';
      }));
    }
  }
  load();
}
