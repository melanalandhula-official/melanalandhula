import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './supabase-config.js';

const $=id=>document.getElementById(id);
const configured=SUPABASE_URL.startsWith('https://') && !SUPABASE_URL.includes('PASTE_') && !SUPABASE_ANON_KEY.includes('PASTE_');
function setMsg(id,text,error=false){$(id).innerHTML=text?`<div class="msg ${error?'error':''}">${text}</div>`:''}
function esc(s){return String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function safeName(name){return name.replace(/[^a-zA-Z0-9._-]/g,'_')}
if(!configured){$('loginMsg').innerHTML='<div class="msg error">Supabase is not configured yet. Complete SUPABASE_SETUP.md and add your public config to supabase-config.js.</div>';$('loginBtn').disabled=true;}
else{
 const supabase=createClient(SUPABASE_URL,SUPABASE_ANON_KEY);
 const setProgress=(id,p)=>{$(id).classList.remove('hidden');$(id).firstElementChild.style.width=`${p}%`};
 const upload=async(file,folder,progressId)=>{
   if(file.size>50*1024*1024) throw new Error('Please choose a file smaller than 50 MB.');
   const path=`${folder}/${Date.now()}-${safeName(file.name)}`;
   const {error}=await supabase.storage.from('Gallery').upload(path,file,{cacheControl:'3600',upsert:false,contentType:file.type});
   if(error) throw error;
   setProgress(progressId,100);
   const {data}=supabase.storage.from('Gallery').getPublicUrl(path);
   return {path,url:data.publicUrl};
 };
 $('loginBtn').onclick=async()=>{try{const {error}=await supabase.auth.signInWithPassword({email:$('loginEmail').value.trim(),password:$('loginPassword').value});if(error)throw error;setMsg('loginMsg','')}catch(e){setMsg('loginMsg',e.message,true)}};
 $('logoutBtn').onclick=()=>supabase.auth.signOut();
 supabase.auth.onAuthStateChange((_event,session)=>{const logged=!!session;$('loginCard').classList.toggle('hidden',logged);$('dashboard').classList.toggle('hidden',!logged);$('logoutBtn').classList.toggle('hidden',!logged);if(logged){loadAnnouncements();loadGallery()}});
 $('publishAnn').onclick=async()=>{
   const title=$('annTitle').value.trim(),message=$('annMessage').value.trim(),date=$('annDate').value||new Date().toISOString().slice(0,10);
   if(!title||!message){setMsg('annMsg','Title and message are required.',true);return}
   try{let image_url='',storage_path='';const file=$('annImage').files[0];if(file){const r=await upload(file,'announcements','annProgress');image_url=r.url;storage_path=r.path}const {error}=await supabase.from('announcements').insert({title,content:message,image_url});if(error)throw error;$('annTitle').value='';$('annMessage').value='';$('annDate').value='';$('annImage').value='';setMsg('annMsg','Announcement published successfully.')}catch(e){setMsg('annMsg',e.message,true)}};
 $('uploadPhoto').onclick=async()=>{const file=$('photoFile').files[0],title=$('photoTitle').value.trim()||'Melanalandhula';if(!file){setMsg('photoMsg','Choose a photo first.',true);return}try{const r=await upload(file,'gallery','photoProgress');const {error}=await supabase.from('gallery').insert({title,url:r.url,storage_path:r.path});if(error)throw error;$('photoFile').value='';$('photoTitle').value='';setMsg('photoMsg','Photo uploaded successfully.')}catch(e){setMsg('photoMsg',e.message,true)}};
 async function loadAnnouncements(){const {data,error}=await supabase.from('announcements').select('*').order('created_at',{ascending:false});if(error){$('annList').innerHTML=`<p class="muted">${esc(error.message)}</p>`;return}$('annList').innerHTML=data.length?data.map(x=>`<div class="item"><div>${x.image_url?`<img src="${esc(x.image_url)}" alt="">`:''}<strong>${esc(x.title)}</strong><div class="muted">${esc(x.date||'')}</div><p>${esc(x.content)}</p></div><button class="btn danger" data-del-ann="${x.id}" data-path="${esc(x.storage_path||'')}">Delete</button></div>`).join(''):'<p class="muted">No announcements yet.</p>';document.querySelectorAll('[data-del-ann]').forEach(b=>b.onclick=()=>removeItem('announcements',b.dataset.delAnn,b.dataset.path));}
 async function loadGallery(){const {data,error}=await supabase.from('gallery').select('*').order('created_at',{ascending:false});if(error){$('galleryList').innerHTML=`<p class="muted">${esc(error.message)}</p>`;return}$('galleryList').innerHTML=data.length?data.map(x=>`<div class="item"><div class="row"><img src="${esc(x.url)}" alt=""><div><strong>${esc(x.title||'')}</strong><div class="muted">Uploaded photo</div></div></div><button class="btn danger" data-del-photo="${x.id}" data-path="${esc(x.storage_path||'')}">Delete</button></div>`).join(''):'<p class="muted">No uploaded photos yet.</p>';document.querySelectorAll('[data-del-photo]').forEach(b=>b.onclick=()=>removeItem('gallery',b.dataset.delPhoto,b.dataset.path));}
 async function removeItem(table,id,path){if(!confirm('Delete this item?'))return;try{const {error}=await supabase.from(table).delete().eq('id',id);if(error)throw error;if(path)await supabase.storage.from('Gallery').remove([path]);loadAnnouncements();loadGallery()}catch(e){alert(e.message)}}
}
