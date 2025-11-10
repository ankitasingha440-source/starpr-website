/* Advanced inline editor + animations for StarPR site
   Features:
   - Toggle protected edit mode (creator code)
   - Inline WYSIWYG toolbar (bold/italic/link/h2)
   - Avatar upload (click or drag & drop), stores as dataURL in localStorage
   - Auto-save & manual export/import (JSON)
   - Download HTML snapshot
   - Simple undo stack
   - Smooth animations on reveal (IntersectionObserver + Web Animations API)
   - Keyboard shortcuts: Ctrl/Cmd+S (save snapshot), Ctrl/Cmd+Z (undo)
*/

(() => {
  const CREATOR_CODE = 'starpradmin123';
  const STORAGE_KEY = 'starpr_edits_v2';
  const UNDO_LIMIT = 30;

  // Selectors editable in safe list
  const EDITABLE_SELECTORS = [
    '#hero-title', '#hero-sub', '#about-text',
    '#services .card h4', '#services .card p',
    '#team .team-card .name', '#team .team-card .role',
    '#phoneLink', '#emailLink', '#telegramLink'
  ];

  // Keep references to DOM controls (create if not present)
  const editToggle = document.getElementById('editToggle') || createControlButton('editToggle', '✏️ Edit Mode');
  const saveBtn = document.getElementById('saveBtn') || createControlButton('saveBtn', '💾 Save HTML');
  const exportBtn = createControlButton('exportBtn', '⬇️ Export Edits');
  const importBtn = createControlButton('importBtn', '⬆️ Import Edits');
  const snapshotBtn = saveBtn;
  const toast = createToast();

  // Undo stack
  let undoStack = [];
  function pushUndo() {
    const snap = snapshotEdits();
    undoStack.push(JSON.stringify(snap));
    if (undoStack.length > UNDO_LIMIT) undoStack.shift();
  }
  function undo() {
    if (undoStack.length < 2) return toastShow('Nothing to undo');
    undoStack.pop(); // current
    const last = undoStack.pop(); // previous
    if (!last) return;
    importEdits(JSON.parse(last));
    toastShow('Undo applied');
  }

  // On DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    // insert control buttons to top-right if not in markup
    ensureControlPanel();

    // fill year if any
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // wire events
    editToggle.addEventListener('click', toggleEditMode);
    saveBtn.addEventListener('click', downloadHtmlSnapshot);
    exportBtn.addEventListener('click', () => downloadJson(snapshotEdits()));
    importBtn.addEventListener('click', importFromFile);

    // keyboard shortcuts
    window.addEventListener('keydown', (e) => {
      const cmd = e.ctrlKey || e.metaKey;
      if (cmd && e.key.toLowerCase() === 's') {
        e.preventDefault();
        downloadHtmlSnapshot();
      }
      if (cmd && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        undo();
      }
    });

    // Smooth nav scrolling
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', (ev) => {
        const id = a.getAttribute('href');
        if (id && id.length > 1) {
          ev.preventDefault();
          const target = document.querySelector(id);
          if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    // Animations: reveal on scroll
    initRevealAnimations();

    // Load saved edits if present
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const obj = JSON.parse(saved);
        importEdits(obj);
        toastShow('Loaded saved edits from localStorage');
      } catch (err) {
        console.warn('Failed to parse saved edits', err);
      }
    }

    // prepare avatar handlers for team card images
    prepareAvatarHandlers();

    // seed undo stack with current state
    pushUndo();

    // autosave every 10s (edits snapshot)
    setInterval(() => {
      // do not auto-save if not in edit mode
      if (!editToggle.classList.contains('active')) return;
      const snap = snapshotEdits();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(snap));
      // keep undo for auto-saves too
      pushUndo();
    }, 10000);
  });

  /* -------------------------
     EDIT MODE TOGGLE + WYSIWYG
     ------------------------- */
  function toggleEditMode() {
    const isActive = editToggle.classList.contains('active');
    if (!isActive) {
      // enable -> prompt creator code
      const code = prompt('Enter creator code to enable editing:');
      if (code !== CREATOR_CODE) {
        toastShow('Incorrect code', true);
        return;
      }
      editToggle.classList.add('active');
      editToggle.textContent = '🔒 Editing ON';
      enableEditing(true);
      toastShow('Edit mode enabled');
    } else {
      editToggle.classList.remove('active');
      editToggle.textContent = '✏️ Edit Mode';
      enableEditing(false);
      toastShow('Edit mode disabled');
    }
  }

  function enableEditing(on) {
    // contenteditable for allowed selectors
    EDITABLE_SELECTORS.forEach(sel => {
      const nodes = document.querySelectorAll(sel);
      nodes.forEach(node => {
        if (node.tagName === 'A') {
          // anchors: click to edit URL
          if (on) {
            node.addEventListener('click', anchorEditHandler);
            node.style.outline = '1px dashed rgba(255,255,255,0.06)';
          } else {
            node.removeEventListener('click', anchorEditHandler);
            node.style.outline = 'none';
          }
        } else {
          node.contentEditable = on;
          node.style.outline = on ? '1px dashed rgba(255,255,255,0.06)' : 'none';
          // attach input events to push to undo stack
          if (on) node.addEventListener('input', pushUndoDebounced);
          else node.removeEventListener('input', pushUndoDebounced);
        }
      });
    });

    // Add WYSIWYG toolbar for inline formatting if enabling
    if (on) attachInlineToolbar();
    else detachInlineToolbar();

    // avatar handlers
    document.querySelectorAll('.team-card .avatar img').forEach(img => {
      if (on) {
        img.addEventListener('click', avatarUploadHandler);
        img.addEventListener('dragover', preventDefault);
        img.addEventListener('drop', avatarDropHandler);
        img.style.cursor = 'pointer';
      } else {
        img.removeEventListener('click', avatarUploadHandler);
        img.removeEventListener('dragover', preventDefault);
        img.removeEventListener('drop', avatarDropHandler);
        img.style.cursor = 'default';
      }
    });
  }

  function anchorEditHandler(e) {
    e.preventDefault();
    const a = e.currentTarget;
    const newHref = prompt('Enter full URL (or leave blank to unset)', a.getAttribute('href') || '');
    if (newHref === null) return;
    if (newHref.trim() === '') {
      a.href = '#';
      a.textContent = '(not set)';
      a.removeAttribute('target');
    } else {
      a.href = newHref;
      a.textContent = newHref.includes('t.me') ? 'Message on Telegram' : newHref;
      a.target = '_blank';
    }
    pushUndo();
  }

  /* -------------------------
     Inline toolbar (WYSIWYG)
     ------------------------- */
  let toolbar = null;
  function attachInlineToolbar() {
    if (toolbar) return;
    toolbar = document.createElement('div');
    toolbar.id = 'inline-toolbar';
    toolbar.innerHTML = `
      <button data-cmd="bold" title="Bold"><b>B</b></button>
      <button data-cmd="italic" title="Italic"><i>I</i></button>
      <button data-cmd="h2" title="Heading">H2</button>
      <button data-cmd="link" title="Make Link">🔗</button>
    `;
    document.body.appendChild(toolbar);
    toolbar.style.position = 'absolute';
    toolbar.style.zIndex = 9999;
    toolbar.style.display = 'none';
    toolbar.style.background = 'rgba(10,10,20,0.9)';
    toolbar.style.border = '1px solid rgba(255,255,255,0.04)';
    toolbar.style.padding = '6px 8px';
    toolbar.style.borderRadius = '8px';
    toolbar.style.backdropFilter = 'blur(6px)';
    toolbar.style.boxShadow = '0 10px 30px rgba(0,0,0,0.6)';
    toolbar.style.gap = '6px';
    toolbar.style.display = 'flex';

    toolbar.querySelectorAll('button[data-cmd]').forEach(btn => {
      btn.style.color = '#fff';
      btn.style.background = 'transparent';
      btn.style.border = 'none';
      btn.style.cursor = 'pointer';
      btn.addEventListener('click', () => {
        const cmd = btn.getAttribute('data-cmd');
        applyToolbarCommand(cmd);
      });
    });

    document.addEventListener('selectionchange', onSelectionChange);
    document.addEventListener('click', (ev) => {
      if (!toolbar.contains(ev.target)) {
        // hide toolbar if clicked outside editable nodes
        const sel = document.getSelection();
        if (!sel || sel.isCollapsed) {
          hideToolbar();
        }
      }
    });
  }

  function detachInlineToolbar() {
    if (!toolbar) return;
    document.removeEventListener('selectionchange', onSelectionChange);
    toolbar.remove();
    toolbar = null;
  }

  function onSelectionChange() {
    const sel = document.getSelection();
    if (!sel || sel.isCollapsed) {
      hideToolbar();
      return;
    }
    const range = sel.getRangeAt(0);
    if (!range) { hideToolbar(); return; }
    // only show when selection is inside an editable node
    let node = range.commonAncestorContainer;
    while (node && node.nodeType !== 1) node = node.parentElement;
    if (!node) { hideToolbar(); return; }
    if (node.isContentEditable) {
      showToolbarAt(range);
    } else {
      hideToolbar();
    }
  }

  function showToolbarAt(range) {
    if (!toolbar) return;
    const rect = range.getBoundingClientRect();
    toolbar.style.left = (rect.left + window.scrollX) + 'px';
    toolbar.style.top = (rect.top + window.scrollY - 46) + 'px';
    toolbar.style.display = 'flex';
  }
  function hideToolbar() {
    if (!toolbar) return;
    toolbar.style.display = 'none';
  }

  function applyToolbarCommand(cmd) {
    const sel = document.getSelection();
    if (!sel || sel.isCollapsed) return;
    if (cmd === 'bold') document.execCommand('bold');
    if (cmd === 'italic') document.execCommand('italic');
    if (cmd === 'h2') document.execCommand('formatBlock', false, 'h2');
    if (cmd === 'link') {
      const url = prompt('Enter URL (https://...)');
      if (url) document.execCommand('createLink', false, url);
    }
    pushUndo();
  }

  /* -------------------------
     Avatar upload & drag-drop
     ------------------------- */
  function prepareAvatarHandlers() {
    // create hidden file input
    let fileInput = document.getElementById('avatarFileInput');
    if (!fileInput) {
      fileInput = document.createElement('input');
      fileInput.id = 'avatarFileInput';
      fileInput.type = 'file';
      fileInput.accept = 'image/*';
      fileInput.style.display = 'none';
      document.body.appendChild(fileInput);
    }
    fileInput.addEventListener('change', (ev) => {
      const f = ev.target.files && ev.target.files[0];
      if (!f) return;
      const imgEl = fileInput._targetImg;
      if (!imgEl) return;
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarData(imgEl, reader.result);
        fileInput.value = '';
      };
      reader.readAsDataURL(f);
    });

    // attach to team images if edit mode on later
    document.querySelectorAll('.team-card .avatar img').forEach(img => {
      img.addEventListener('click', () => {
        // open file input and associate
        fileInput._targetImg = img;
        fileInput.click();
      });
    });
  }

  function avatarUploadHandler(e) {
    // simply forward to hidden input handler
    const img = e.currentTarget;
    const fileInput = document.getElementById('avatarFileInput');
    fileInput._targetImg = img;
    fileInput.click();
  }

  function preventDefault(e) { e.preventDefault(); e.stopPropagation(); }
  function avatarDropHandler(e) {
    e.preventDefault();
    const dt = e.dataTransfer;
    if (!dt || !dt.files || !dt.files[0]) return;
    const f = dt.files[0];
    if (!f.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = e.currentTarget;
      setAvatarData(img, reader.result);
    };
    reader.readAsDataURL(f);
  }

  function setAvatarData(imgEl, dataUrl) {
    imgEl.src = dataUrl;
    // Store mapping in localStorage keyed by image alt (or name)
    const key = 'avatar:' + (imgEl.alt || imgEl.getAttribute('data-id') || imgEl.src);
    // Save to edits snapshot too
    pushUndo();
    const snapshot = snapshotEdits();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
    toastShow('Avatar updated');
  }

  /* -------------------------
     Snapshot / Export / Import
     ------------------------- */
  function snapshotEdits() {
    const obj = { text: {}, avatars: {} };
    // store innerHTML/text for editable selectors
    EDITABLE_SELECTORS.forEach(sel => {
      const nodes = document.querySelectorAll(sel);
      if (!nodes || nodes.length === 0) return;
      nodes.forEach((n, idx) => {
        const key = `${sel}::${idx}`;
        obj.text[key] = n.innerHTML;
      });
    });
    // store team avatars
    document.querySelectorAll('.team-card .avatar img').forEach((img, idx) => {
      obj.avatars[`avatar_${idx}`] = img.src;
    });
    return obj;
  }

  function importEdits(obj) {
    if (!obj) return;
    // apply text
    EDITABLE_SELECTORS.forEach(sel => {
      const nodes = document.querySelectorAll(sel);
      nodes.forEach((n, idx) => {
        const key = `${sel}::${idx}`;
        if (obj.text && obj.text[key] !== undefined) {
          n.innerHTML = obj.text[key];
        }
      });
    });
    // apply avatars
    document.querySelectorAll('.team-card .avatar img').forEach((img, idx) => {
      const key = `avatar_${idx}`;
      if (obj.avatars && obj.avatars[key]) {
        img.src = obj.avatars[key];
      }
    });
    // persist
    localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
    pushUndo();
  }

  function downloadJson(obj) {
    const blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'starpr_edits.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    toastShow('Exported edits JSON');
  }

  function importFromFile() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.addEventListener('change', (ev) => {
      const f = ev.target.files && ev.target.files[0];
      if (!f) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const obj = JSON.parse(reader.result);
          importEdits(obj);
          toastShow('Imported edits JSON');
        } catch (err) {
          toastShow('Invalid JSON file', true);
        }
      };
      reader.readAsText(f);
    });
    input.click();
  }

  /* -------------------------
     Download HTML snapshot
     ------------------------- */
  function downloadHtmlSnapshot() {
    // create a clean copy of document for snapshot: remove control UI
    const clone = document.documentElement.cloneNode(true);
    // remove editor controls (by id)
    ['editToggle', 'saveBtn', 'exportBtn', 'importBtn', 'inline-toolbar'].forEach(id => {
      const el = clone.querySelector(`#${id}`);
      if (el) el.remove();
    });
    const html = '<!doctype html>\n' + clone.outerHTML;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'starpr_saved.html';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    toastShow('HTML snapshot downloaded');
  }

  /* -------------------------
     Small UI helpers
     ------------------------- */
  function createControlButton(id, text) {
    const btn = document.createElement('button');
    btn.id = id;
    btn.type = 'button';
    btn.textContent = text;
    btn.style.margin = '4px';
    btn.style.padding = '8px 12px';
    btn.style.borderRadius = '8px';
    btn.style.border = '1px solid rgba(255,255,255,0.06)';
    btn.style.background = 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))';
    btn.style.color = 'white';
    btn.style.cursor = 'pointer';
    btn.style.fontWeight = '600';
    return btn;
  }

  function ensureControlPanel() {
    let panel = document.getElementById('editorControlPanel');
    if (!panel) {
      panel = document.createElement('div');
      panel.id = 'editorControlPanel';
      panel.style.position = 'fixed';
      panel.style.top = '12px';
      panel.style.right = '12px';
      panel.style.zIndex = 99999;
      panel.style.display = 'flex';
      panel.style.flexDirection = 'row';
      panel.style.gap = '8px';
      document.body.appendChild(panel);
    }
    // append buttons if not present
    [editToggle, saveBtn, exportBtn, importBtn].forEach(b => {
      if (!panel.contains(b)) panel.appendChild(b);
    });
  }

  function toastShow(msg, isError = false) {
    toast.textContent = msg;
    toast.style.background = isError ? 'rgba(180,30,30,0.9)' : 'rgba(20,120,200,0.95)';
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(12px)';
    }, 2500);
  }

  function createToast() {
    const t = document.createElement('div');
    t.id = 'editorToast';
    t.style.position = 'fixed';
    t.style.right = '12px';
    t.style.bottom = '18px';
    t.style.padding = '10px 14px';
    t.style.borderRadius = '10px';
    t.style.color = '#fff';
    t.style.fontWeight = '600';
    t.style.zIndex = 100000;
    t.style.opacity = '0';
    t.style.transform = 'translateY(12px)';
    t.style.transition = 'all .28s ease';
    document.body.appendChild(t);
    return t;
  }

  /* -------------------------
     Animations: reveal on scroll
     ------------------------- */
  function initRevealAnimations() {
    const els = document.querySelectorAll('.reveal-on-scroll, .team-card, .services .card, .hero');
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          animateReveal(en.target);
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12 });
    els.forEach(el => io.observe(el));
  }

  function animateReveal(el) {
    // subtle upward fade in
    try {
      el.animate([
        { opacity: 0, transform: 'translateY(12px) scale(.995)' },
        { opacity: 1, transform: 'translateY(0) scale(1)' }
      ], { duration: 700, easing: 'cubic-bezier(.2,.9,.2,1)', fill: 'forwards' });
    } catch (err) {
      // fallback
      el.style.opacity = '1';
      el.style.transform = 'none';
    }
  }

  /* -------------------------
     Debounce helpers
     ------------------------- */
  let pushUndoTimer = null;
  function pushUndoDebounced() {
    if (pushUndoTimer) clearTimeout(pushUndoTimer);
    pushUndoTimer = setTimeout(() => {
      pushUndo();
    }, 500);
  }

})();

