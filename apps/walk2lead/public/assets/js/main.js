document.getElementById('yr').textContent = new Date().getFullYear();
// nav — scrolls away inside the hero; becomes a fixed hide/show bar past it
const nav=document.getElementById('nav');
const heroEl=document.querySelector('.hero');
let lastY=scrollY;
function updateNav(){
  const y=scrollY;
  const heroEnd=heroEl.offsetHeight;
  if(y<heroEnd-80){
    nav.classList.remove('nav-fixed');
    nav.classList.remove('nav-hidden');
    nav.classList.remove('scrolled');
  }else{
    nav.classList.add('nav-fixed');
    nav.classList.toggle('scrolled',y>10);
    if(y>lastY){
      nav.classList.add('nav-hidden');
    }else if(y<lastY){
      nav.classList.remove('nav-hidden');
    }
  }
  lastY=y;
}
addEventListener('scroll',updateNav,{passive:true});
updateNav();
// reveal on scroll
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
// counters (integer or fixed-decimal)
const cio=new IntersectionObserver(es=>es.forEach(e=>{
  if(!e.isIntersecting)return;cio.unobserve(e.target);
  const el=e.target,end=+el.dataset.count,suf=el.dataset.suffix||'',dec=+(el.dataset.decimals||0),t0=performance.now(),dur=1400;
  const step=t=>{const p=Math.min((t-t0)/dur,1),v=end*(1-Math.pow(1-p,3));
    el.innerHTML=(dec?v.toFixed(dec):Math.round(v).toLocaleString('en-IN'))+(suf?'<sup>'+suf+'</sup>':'');
    if(p<1)requestAnimationFrame(step)};
  requestAnimationFrame(step);
}),{threshold:.5});
document.querySelectorAll('[data-count]').forEach(el=>cio.observe(el));
// draggable scatter photos (desktop only, decorative — resets on refresh)
document.querySelectorAll('.scatter-photo').forEach(el=>{
  let dragging=false,offX=0,offY=0;
  const parent=el.parentElement;
  el.addEventListener('pointerdown',e=>{
    dragging=true;
    el.classList.add('dragging');
    el.setPointerCapture(e.pointerId);
    const r=el.getBoundingClientRect();
    offX=e.clientX-r.left;
    offY=e.clientY-r.top;
    el.style.zIndex=1000;
  });
  el.addEventListener('pointermove',e=>{
    if(!dragging)return;
    const pr=parent.getBoundingClientRect();
    let nx=e.clientX-pr.left-offX;
    let ny=e.clientY-pr.top-offY;
    nx=Math.max(-40,Math.min(nx,pr.width-60));
    ny=Math.max(-20,Math.min(ny,pr.height-60));
    el.style.left=nx+'px';
    el.style.top=ny+'px';
  });
  el.addEventListener('pointerup',e=>{dragging=false;el.classList.remove('dragging');el.releasePointerCapture(e.pointerId)});
});
// horizontal sliders (testimonials, projects) — looped forward only, never jumps back
function initInfiniteSlider(trackId,prevId,nextId,itemSel,autoMs){
  const track=document.getElementById(trackId);
  if(!track)return;
  const baseItems=Array.from(track.children).map(ch=>{
    const c=ch.cloneNode(true);
    c.classList.remove('reveal');
    return c;
  });
  const appendSet=()=>baseItems.forEach(ch=>track.appendChild(ch.cloneNode(true)));
  appendSet();
  const ensureBuffer=()=>{
    const card=track.querySelector(itemSel);
    if(!card)return;
    const gap=parseFloat(getComputedStyle(track).columnGap||22);
    const remaining=track.scrollWidth-(track.scrollLeft+track.clientWidth);
    if(remaining<(card.offsetWidth+gap)*3)appendSet();
  };
  const step=dir=>{
    const card=track.querySelector(itemSel);
    const gap=parseFloat(getComputedStyle(track).columnGap||22);
    track.scrollBy({left:dir*(card.offsetWidth+gap),behavior:'smooth'});
    setTimeout(ensureBuffer,450);
  };
  document.getElementById(prevId)?.addEventListener('click',()=>step(-1));
  document.getElementById(nextId)?.addEventListener('click',()=>step(1));
  let paused=false;
  track.addEventListener('mouseenter',()=>paused=true);
  track.addEventListener('mouseleave',()=>paused=false);
  track.addEventListener('touchstart',()=>paused=true,{passive:true});
  setInterval(()=>{if(!paused)step(1)},autoMs);
}
initInfiniteSlider('quote-track','quote-prev','quote-next','.quote',4800);
initInfiniteSlider('proj-track','proj-prev','proj-next','.pcard',4200);
// lightbox
const lb=document.getElementById('lightbox'),lbi=document.getElementById('lightbox-img');
function wireLightboxImg(im){im.addEventListener('click',()=>{lbi.src=im.src;lbi.alt=im.alt||'';lb.classList.add('open')})}
document.querySelectorAll('.gallery-grid img').forEach(wireLightboxImg);
lb.addEventListener('click',()=>lb.classList.remove('open'));
// gallery "Load more" — mirrors the wide-position rhythm in S15_gallery.tsx
(function(){
  const btn=document.getElementById('gallery-load-more'),grid=document.getElementById('gallery-grid');
  if(!btn||!grid)return;
  const WIDE=[0,7];
  btn.addEventListener('click',()=>{
    const offset=Number(btn.dataset.offset||'0');
    btn.disabled=true;btn.textContent='Loading…';
    fetch('/api/gallery?offset='+offset).then(r=>r.json()).then(data=>{
      (data.items||[]).forEach((item,i)=>{
        const slot=(offset+i)%8;
        const cell=document.createElement('div');
        if(WIDE.indexOf(slot)!==-1)cell.className='wide';
        const img=document.createElement('img');
        img.src=item.url;img.alt=item.alt||'';img.loading='lazy';
        cell.appendChild(img);
        grid.appendChild(cell);
        wireLightboxImg(img);
      });
      btn.dataset.offset=String(offset+(data.items?data.items.length:0));
      if(data.hasMore){btn.disabled=false;btn.textContent='Load more photos';}
      else{btn.remove();}
    }).catch(()=>{btn.disabled=false;btn.textContent='Load more photos';});
  });
})();
// Press strip — drag to scroll + click to open in lightbox
(function(){
  const wrap=document.querySelector('.press-scroll-wrap');
  const track=document.querySelector('.press-track');
  if(!track||!wrap)return;
  const DUR=216;
  let dragging=false,hovering=false,wasDrag=false,startX=0,baseOffset=0,dragDist=0;
  const hw=()=>track.scrollWidth/2;
  const getOffset=()=>new DOMMatrix(window.getComputedStyle(track).transform).m41;
  function resumeFrom(px){
    const h=hw();
    let off=px%-h;
    if(off>0)off-=h;
    const frac=Math.abs(off)/h;
    track.style.transform='';
    track.style.animation=`press-scroll ${DUR}s ${-(frac*DUR).toFixed(1)}s linear infinite`;
  }
  function onStart(e){
    dragging=true;dragDist=0;
    startX=e.touches?e.touches[0].clientX:e.clientX;
    baseOffset=getOffset();
    track.style.animation='none';
    track.style.transform=`translateX(${baseOffset}px)`;
  }
  function onMove(e){
    if(!dragging)return;
    const x=e.touches?e.touches[0].clientX:e.clientX;
    const dx=x-startX;
    dragDist=Math.abs(dx);
    if(dragDist>4&&e.cancelable)e.preventDefault();
    track.style.transform=`translateX(${baseOffset+dx}px)`;
  }
  function onEnd(){
    if(!dragging)return;
    dragging=false;
    wasDrag=dragDist>5;
    resumeFrom(getOffset());
    if(hovering)track.style.animationPlayState='paused';
  }
  // Prevent browser native image drag from hijacking pointer events
  track.addEventListener('dragstart',e=>e.preventDefault());
  track.querySelectorAll('img').forEach(img=>img.setAttribute('draggable','false'));
  wrap.addEventListener('mouseenter',()=>{hovering=true;if(!dragging)track.style.animationPlayState='paused';});
  wrap.addEventListener('mouseleave',()=>{hovering=false;track.style.animationPlayState='running';});
  track.addEventListener('mousedown',onStart);
  document.addEventListener('mousemove',onMove);
  document.addEventListener('mouseup',onEnd);
  track.addEventListener('touchstart',onStart,{passive:true});
  track.addEventListener('touchmove',onMove,{passive:false});
  track.addEventListener('touchend',onEnd);
  track.addEventListener('click',e=>{
    if(wasDrag){wasDrag=false;return;}
    const card=e.target.closest('.press-card:not([aria-hidden])');
    if(!card)return;
    const img=card.querySelector('img');
    if(img){lbi.src=img.src;lb.classList.add('open');}
  });
})();
const SHEET_URL='https://script.google.com/macros/s/AKfycbwYma3uMa_PMnFGLypPPEMW3zbgITnFjeE2Ex_eF-Y02QtoFGDGpQvxXsSyOiFd1UkP/exec';
document.getElementById('csr-form').addEventListener('submit',e=>{
  e.preventDefault();
  const form=e.target;
  const fd=new FormData(form);
  const d={name:fd.get('name'),company:fd.get('company'),email:fd.get('email'),phone:fd.get('phone')||'',message:fd.get('message')||''};
  form.classList.add('is-loading');
  fetch(SHEET_URL,{method:'POST',body:JSON.stringify(d),mode:'no-cors'})
    .then(()=>{
      form.classList.remove('is-loading');
      form.classList.add('is-success');
    })
    .catch(()=>{
      const body=encodeURIComponent(`Name: ${d.name}\nCompany: ${d.company}\nEmail: ${d.email}\nPhone: ${d.phone||'-'}\n\n${d.message||''}`);
      location.href=`mailto:info@deleadint.com?subject=${encodeURIComponent('CSR Partnership Enquiry from '+d.company)}&body=${body}`;
    });
});

// Hero group-photo slideshow
(function(){
  const wrap=document.querySelector('.b-photo-group');
  if(!wrap) return;
  const slides=Array.from(wrap.querySelectorAll('.hero-slide'));
  if(slides.length<2) return;
  const DUR=1600; // ms transition duration
  let cur=0, paused=false;
  // Stack all slides at position 0; first on top
  slides.forEach((s,i)=>{s.style.zIndex=i===0?'1':'0';});
  function go(){
    const prev=cur;
    cur=(cur+1)%slides.length;
    // Place incoming slide off-screen right instantly (no transition)
    const next=slides[cur];
    next.style.transition='none';
    next.style.transform='translateX(100%)';
    next.style.zIndex='2';
    // Force reflow so the instant reset registers before animation starts
    next.offsetHeight;
    // Slide in slowly
    next.style.transition='transform '+DUR+'ms cubic-bezier(0.76,0,0.24,1)';
    next.style.transform='translateX(0%)';
    slides[prev].style.zIndex='1';
    // After transition settle z-indexes
    setTimeout(()=>{
      slides.forEach((s,i)=>{s.style.transition='none';s.style.zIndex=i===cur?'1':'0';});
    },DUR+50);
  }
  let timer=setInterval(()=>{if(!paused)go();},5000);
  wrap.addEventListener('mouseenter',()=>paused=true);
  wrap.addEventListener('mouseleave',()=>paused=false);
  wrap.addEventListener('touchstart',()=>paused=true,{passive:true});
  wrap.addEventListener('touchend',()=>paused=false,{passive:true});
})();
