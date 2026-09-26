/* Progressive enhancement: every page and link works before this script runs. */
(() => {
  'use strict';
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let toastTimer;
  function notify(message) {
    const toast = $('.toast');
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 4200);
  }
  async function copy(text, message) {
    try {
      await navigator.clipboard.writeText(text);
      notify(message);
    } catch {
      const field = document.createElement('textarea');
      field.value = text;
      field.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
      document.body.append(field);
      field.select();
      const copied = document.execCommand('copy');
      field.remove();
      notify(copied ? message : 'Copy unavailable. Please select and copy the displayed text.');
    }
  }
  const menuButton = $('.menu-toggle');
  const menu = $('#mobile-menu');
  function closeMenu(restoreFocus = false) {
    menu.hidden = true;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation');
    document.body.classList.remove('menu-open');
    $('#main').inert = false;
    $('.footer').inert = false;
    $('.contact-band')?.removeAttribute('inert');
    if (restoreFocus) menuButton.focus();
  }
  menuButton.addEventListener('click', () => {
    if (!menu.hidden) return closeMenu(true);
    menu.hidden = false;
    menuButton.setAttribute('aria-expanded', 'true');
    menuButton.setAttribute('aria-label', 'Close navigation');
    document.body.classList.add('menu-open');
    $('#main').inert = true;
    $('.footer').inert = true;
    $('.contact-band')?.setAttribute('inert', '');
    $('a', menu).focus();
  });
  $$('a', menu).forEach(link => link.addEventListener('click', () => closeMenu()));
  document.addEventListener('keydown', event => {
    if (menu.hidden) return;
    if (event.key === 'Escape') closeMenu(true);
    if (event.key === 'Tab') {
      const focusable = [menuButton, ...$$('a', menu)];
      const index = focusable.indexOf(document.activeElement);
      if (event.shiftKey && index === 0) { event.preventDefault(); focusable.at(-1).focus(); }
      else if (!event.shiftKey && index === focusable.length - 1) { event.preventDefault(); menuButton.focus(); }
    }
  });
  window.matchMedia('(min-width: 801px)').addEventListener('change', event => { if (event.matches) closeMenu(); });

  const dialog = $('.lightbox');
  let imageTrigger = null;
  $$('[data-image]').forEach(button => button.addEventListener('click', () => {
    imageTrigger = button;
    $('img', dialog).src = button.dataset.image;
    $('img', dialog).alt = button.dataset.caption || $('img', button)?.alt || 'Project image';
    $('p', dialog).textContent = button.dataset.caption || '';
    dialog.showModal();
    document.body.classList.add('dialog-open');
  }));
  $('.lightbox-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('dialog-open');
    imageTrigger?.focus();
  });

  const projectCards = $$('.archive-grid .work-card');
  const filterButtons = $$('[data-filter]');
  const search = $('#project-search');
  if (search) {
    const initial = new URLSearchParams(location.search).get('filter');
    let filter = ['design', 'development', 'branding'].includes(initial) ? initial : 'all';
    function updateProjects() {
      const term = search.value.trim().toLowerCase();
      let count = 0;
      projectCards.forEach(card => {
        card.hidden = !(filter === 'all' || card.dataset.category.split(' ').includes(filter)) || !card.dataset.search.includes(term);
        if (!card.hidden) { count++; card.classList.add('is-visible'); }
      });
      filterButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === filter)));
      $('#filter-status').textContent = `Showing ${count} ${count === 1 ? 'project' : 'projects'}`;
      $('.empty-state').hidden = count !== 0;
    }
    filterButtons.forEach(button => button.addEventListener('click', () => { filter = button.dataset.filter; updateProjects(); }));
    search.addEventListener('input', updateProjects);
    $('#reset-filters').addEventListener('click', () => { search.value = ''; filter = 'all'; updateProjects(); search.focus(); });
    updateProjects();
  }

  $$('[data-copy-email]').forEach(button => button.addEventListener('click', () => copy('daniszaidan@gmail.com', 'Email copied. Say hello!')));
  const form = $('#brief-form');
  if (form) {
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const name = data.get('name').trim();
      const message = data.get('message').trim();
      if (!name || message.length < 10) { notify('Please add your name and a little more about your project.'); return; }
      const text = `Hi Danis,\n\n${message}\n\nProject details\nServices: ${data.getAll('service').join(', ') || 'Let’s discuss'}\nCompany / website: ${data.get('company').trim() || 'Not specified'}\nBudget: ${data.get('budget')}\nTimeline: ${data.get('timeline')}\n\nFrom: ${name}\nEmail: ${data.get('email').trim()}\n\nLooking forward to connecting!`;
      const url = 'mailto:daniszaidan@gmail.com?subject=' + encodeURIComponent('Project enquiry from ' + name) + '&body=' + encodeURIComponent(text);
      $('#brief-preview').value = text;
      $('#open-draft').href = url;
      $('#brief-result').hidden = false;
      $('#brief-result').scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth', block: 'nearest' });
      $('#open-draft').click();
    });
    $('#copy-brief').addEventListener('click', () => copy($('#brief-preview').value, 'Project brief copied.'));
  }
  function updateTime() {
    const time = new Intl.DateTimeFormat('en-GB', {timeZone:'Asia/Jakarta',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date());
    $$('[data-time]').forEach(el => { el.textContent = `Indonesia · ${time} WIB`; });
  }
  updateTime(); setInterval(updateTime, 60000);
  $$('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
  const printButton = $('#print-cv');
  if (printButton) {
    let previouslyOpen = [];
    window.addEventListener('beforeprint', () => { previouslyOpen = $$('details').map(el => el.open); $$('details').forEach(el => {el.open = true;}); });
    window.addEventListener('afterprint', () => { $$('details').forEach((el,i) => {el.open = previouslyOpen[i];}); });
    printButton.addEventListener('click', () => window.print());
  }

  if (!reducedMotion.matches && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('motion-ready');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } });
    }, {threshold:0.06,rootMargin:'0px 0px 30px 0px'});
    $$('.work-card, .section-head, .about-home-copy, .process-item, .interest-grid article, .expertise-block, .certificate-card').forEach(el => {el.classList.add('reveal');observer.observe(el);});
    $('.hero-heading, .page-heading, .case-heading')?.classList.add('enter');
  }

  const canvas = $('#art-canvas');
  if (canvas) {
    const context = canvas.getContext('2d');
    const complexity = $('#complexity');
    const twist = $('#twist');
    const motionButton = $('#art-motion');
    let colour = '#c5f277';
    let paused = reducedMotion.matches;
    let angle = 0;
    let lastFrame = 0;
    let frameId = null;
    let inView = true;
    const updateButton = () => { motionButton.textContent = paused ? 'Play motion ▷' : 'Pause motion Ⅱ'; motionButton.setAttribute('aria-pressed', String(paused)); };
    function draw() {
      const w = canvas.width, h = canvas.height;
      context.clearRect(0,0,w,h);
      context.fillStyle = '#22281b'; context.fillRect(0,0,w,h);
      context.save(); context.translate(w/2,h/2);
      const count = Number(complexity.value), warp = Number(twist.value)/100;
      for (let i=0;i<count;i++) {
        const t=i/count;
        context.save();
        context.rotate(t*Math.PI*warp*2+angle);
        context.beginPath();
        context.ellipse(Math.sin(t*Math.PI*2)*warp*24,0,82+t*230,220-t*140,0,0,Math.PI*2);
        context.strokeStyle=colour;context.globalAlpha=.35+.55*Math.sin(t*Math.PI);context.lineWidth=1.15;
        context.stroke();context.restore();
      }
      context.restore();
    }
    function tick(timestamp) {
      frameId = null;
      if (paused || document.hidden || !inView) return;
      if (timestamp-lastFrame >= 32) { angle += .003; draw(); lastFrame=timestamp; }
      frameId=requestAnimationFrame(tick);
    }
    function start() { if (frameId===null && !paused && !document.hidden && inView) frameId=requestAnimationFrame(tick); }
    function stop() { if(frameId!==null)cancelAnimationFrame(frameId);frameId=null; }
    [complexity,twist].forEach(input=>input.addEventListener('input',()=>{$('#'+input.id+'-value').textContent=input.value;draw();}));
    $$('.swatches button').forEach(button=>button.addEventListener('click',()=>{colour=button.dataset.color;$$('.swatches button').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));draw();}));
    motionButton.addEventListener('click',()=>{paused=!paused;updateButton();if(paused)stop();else start();});
    $('#art-reset').addEventListener('click',()=>{
      complexity.value=36;twist.value=48;angle=0;colour='#c5f277';
      $('#complexity-value').textContent='36';$('#twist-value').textContent='48';
      $$('.swatches button').forEach((b,i)=>b.setAttribute('aria-pressed',String(i===0)));draw();
    });
    $('#art-save').addEventListener('click',()=>{
      canvas.toBlob(blob=>{if(!blob)return;const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download='danis-order-and-chaos.png';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);notify('Your frame is ready to save.');},'image/png');
    });
    document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();else start();});
    reducedMotion.addEventListener('change',event=>{if(event.matches){paused=true;updateButton();stop();draw();}});
    if('IntersectionObserver' in window)new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;if(inView)start();else stop();}).observe(canvas);
    updateButton();draw();start();
  }
  if ($('#type-input')) {
    $('#type-input').addEventListener('input',event=>{$('#type-preview').textContent=event.target.value||'Your words.';});
    $('#tracking').addEventListener('input',event=>{$('#type-preview').style.letterSpacing=Number(event.target.value)/100+'em';$('#tracking-value').textContent=event.target.value;});
    $('#type-toggle').addEventListener('click',event=>{const serif=$('#type-preview').classList.toggle('serif');event.currentTarget.setAttribute('aria-pressed',String(serif));event.currentTarget.textContent=serif?'Try a sans ↗':'Try a serif ↗';});
  }
})();
