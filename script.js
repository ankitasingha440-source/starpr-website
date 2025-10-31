
// Basic editing and save functionality
const CREATOR_CODE = 'starpradmin123';
const LS_KEY = 'starpr_site_v1';

document.addEventListener('DOMContentLoaded', ()=>{
  document.getElementById('year').textContent = new Date().getFullYear();
  loadFromStorage();
  document.getElementById('editToggle').addEventListener('click', toggleEdit);
  document.getElementById('saveBtn').addEventListener('click', saveHtmlSnapshot);
  // wire up nav smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', e=>{
      const id = a.getAttribute('href');
      if(id.length>1){
        e.preventDefault();
        document.querySelector(id).scrollIntoView({behavior:'smooth',block:'start'});
      }
    });
  });
});

function toggleEdit(){
  const btn = document.getElementById('editToggle');
  const isEditing = btn.classList.toggle('active');
  if(isEditing){
    // prompt for code
    const code = prompt('Enter creator code to enable editing:');
    if(code !== CREATOR_CODE){
      alert('Incorrect code');
      btn.classList.remove('active');
      return;
    }
    enableEditing(true);
    btn.textContent = '🔒 Editing ON';
  } else {
    enableEditing(false);
    btn.textContent = '✏️ Edit Mode';
  }
}

function enableEditing(on){
  // make contenteditable for many elements
  const editableSelectors = ['#hero-title','#hero-sub','#about-text',
    '#services .card h4','#services .card p',
    '#team .team-card strong', '#team .team-card .muted',
    '#phoneLink','#emailLink','#telegramLink'];
  // for selectors like multiple nodes
  editableSelectors.forEach(sel=>{
    const nodes = document.querySelectorAll(sel);
    nodes.forEach(n=>{
      if(n.tagName === 'A'){
        // anchor - allow editing href via prompt on click
        if(on){
          n.addEventListener('click', anchorEditHandler);
          n.style.outline = '1px dashed rgba(255,255,255,0.06)';
        } else {
          n.removeEventListener('click', anchorEditHandler);
          n.style.outline = 'none';
        }
      } else {
        n.contentEditable = on;
        n.style.outline = on ? '1px dashed rgba(255,255,255,0.06)' : 'none';
      }
    });
  });

  // enable avatar replacement via click
  document.querySelectorAll('.team-card .avatar img').forEach(img=>{
    if(on){
      img.addEventListener('click', avatarReplaceHandler);
      img.style.cursor = 'pointer';
    } else {
      img.removeEventListener('click', avatarReplaceHandler);
      img.style.cursor = 'default';
    }
  });
}

function anchorEditHandler(e){
  e.preventDefault();
  const a = e.currentTarget;
  const newHref = prompt('Enter full URL (or leave blank to unset)', a.href==='#' ? '' : a.href);
  if(newHref !== null){
    if(newHref.trim()===''){
      a.textContent = '(not set)';
      a.href = '#';
      a.removeAttribute('target');
    } else {
      a.href = newHref;
      a.textContent = newHref.includes('t.me') ? 'Message on Telegram' : newHref;
      a.target = '_blank';
    }
  }
}

function avatarReplaceHandler(e){
  const img = e.currentTarget;
  const url = prompt('Enter image URL (public) for avatar (or leave blank to use placeholder):', img.src);
  if(url === null) return;
  if(url.trim()===''){
    // keep existing
    return;
  }
  img.src = url;
}

// Save a snapshot of current HTML as a downloadable file
function saveHtmlSnapshot(){
  const html = `<!doctype html>\n${document.documentElement.outerHTML}`;
  const blob = new Blob([html], {type:'text/html'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'starpr_saved.html';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// Load settings or persisted edits (not full WYSIWYG storage for simplicity)
function loadFromStorage(){
  // could implement loading of saved edits from localStorage if wanted
}
