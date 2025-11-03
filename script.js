(() => {
  const DEFAULT_MAPPING = [
    { code: 'KeyA', label: 'A', id: 'kick',   name: 'Kick',           src: 'assets/drums/kick.mp3' },
    { code: 'KeyS', label: 'S', id: 'snare',  name: 'Snare',          src: 'assets/drums/snare.mp3' },
    { code: 'KeyD', label: 'D', id: 'hihatC', name: 'Hi-hat Closed',  src: 'assets/drums/hihat-closed.mp3' },
    { code: 'KeyF', label: 'F', id: 'hihatO', name: 'Hi-hat Open',    src: 'assets/drums/hihat-open.mp3' },
    { code: 'KeyG', label: 'G', id: 'tomL',   name: 'Tom Low',        src: 'assets/drums/tom-low.mp3' },
    { code: 'KeyH', label: 'H', id: 'tomM',   name: 'Tom Mid',        src: 'assets/drums/tom-mid.mp3' },
    { code: 'KeyJ', label: 'J', id: 'crash',  name: 'Crash',          src: 'assets/drums/crash.mp3' },
  ];
  const SEQ_GAP_MS = 350; 

  let mappings = DEFAULT_MAPPING.map((x) => ({ ...x })); 
  const audioById = new Map();
  const padById = new Map();
  const keyCodeToId = new Map(); 
  const pressedCodes = new Set(); 
  let lockedCode = null; 
  let isAutoPlaying = false;

  function setKeyMapFromMappings() {
    keyCodeToId.clear();
    mappings.forEach((m) => keyCodeToId.set(m.code, m.id));
  }
  setKeyMapFromMappings();

  function createEl(tag, className, text) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text != null) el.textContent = text;
    return el;
  }

  function loadAudios() {
    mappings.forEach((m) => {
      const audio = new Audio();
      audio.src = m.src;
      audio.preload = 'auto';
      audioById.set(m.id, audio);
    });
  }

  function activatePad(id) {
    const pad = padById.get(id);
    if (pad) pad.classList.add('active');
  }
  function deactivatePad(id) {
    const pad = padById.get(id);
    if (pad) pad.classList.remove('active');
  }

  function playSoundOnce(id) {
    const audio = audioById.get(id);
    if (!audio) return Promise.resolve();
    audio.currentTime = 0;
    activatePad(id);
    return new Promise((resolve) => {
      const onEnd = () => {
        audio.removeEventListener('ended', onEnd);
        deactivatePad(id);
        resolve();
      };
      audio.addEventListener('ended', onEnd, { once: true });
      setTimeout(() => audio.play().catch(() => resolve()), 0);
    });
  }

  function isLetterCode(code) {
    return /^Key[A-Z]$/.test(code);
  }

  const root = createEl('div', 'vmk-root');
  const header = createEl('div', 'vmk-header');
  const titleWrap = createEl('div');
  const title = createEl('div', 'vmk-title', 'Virtual Music Kit');
  const sub = createEl(
    'div',
    'vmk-sub',
    'Drum Pads — 7 sounds. Click or press keys. Edit mappings, then try the sequencer.'
  );
  titleWrap.appendChild(title);
  titleWrap.appendChild(sub);

  const editor = createEl('div', 'vmk-editor');
  const editorLabel = createEl('span', 'vmk-hint', 'Change key for:');
  const editorTarget = createEl('strong');
  const editorInput = createEl('input', 'vmk-input');
  editorInput.maxLength = 1;
  editorInput.placeholder = 'A–Z';
  const editorError = createEl('span', 'vmk-error hidden');
  editor.append(editorLabel, editorTarget, editorInput, editorError);

  const grid = createEl('div', 'vmk-grid');

  
  const sequencer = createEl('div', 'vmk-sequencer');
  const seqInput = createEl('input', 'vmk-seq-input');
  const maxLen = mappings.length * 2;
  seqInput.placeholder = `Type a sequence (max ${maxLen} letters)`;
  seqInput.maxLength = maxLen;
  const playBtn = createEl('button', 'vmk-play-btn', 'Play Sequence');
  sequencer.append(seqInput, playBtn);


  const footer = createEl('div', 'vmk-footer');
  

  header.appendChild(titleWrap);
  root.append(header, grid, editor, sequencer, footer);
  document.body.prepend(root);

  function rebuildPads() {
    grid.innerHTML = '';
    mappings.forEach((m) => {
      const pad = createEl('button', 'vmk-pad');
      pad.setAttribute('data-id', m.id);
      pad.setAttribute('aria-label', `${m.name} (${m.label})`);

      const row1 = createEl('div', 'row');
      const key = createEl('div', 'vmk-key-label', m.label);
      const edit = createEl('button', 'vmk-edit-btn', 'Edit');

      edit.addEventListener('click', () => openEditorFor(m.id));

      row1.append(key, edit);
      const row2 = createEl('div', 'row');
      const name = createEl('div', 'vmk-sound-label', m.name);
      row2.append(name);

      pad.append(row1, row2);

      pad.addEventListener('mousedown', () => {
        if (isAutoPlaying) return;
        if (lockedCode) return; 
        lockedCode = 'MOUSE';
        playSoundOnce(m.id).finally(() => {
          lockedCode = null;
        });
      });

      padById.set(m.id, pad);
      grid.appendChild(pad);
    });
  }

  let editingId = null;
  function openEditorFor(id) {
    if (isAutoPlaying) return;
    editingId = id;
    const m = mappings.find((x) => x.id === id);
    editorTarget.textContent = `${m.name}`;
    editorInput.value = m.label;
    editorError.textContent = '';
    editorError.classList.add('hidden');
    editor.classList.add('show');
    editorInput.focus();
    editorInput.select();
  }

  function closeEditor() {
    editor.classList.remove('show');
    editingId = null;
  }

  function tryAssignNewKey(letter) {
    if (!editingId) return;
    const upper = letter.toUpperCase();
    if (!/^[A-Z]$/.test(upper)) {
      editorError.textContent = 'Only English letters A–Z are allowed.';
      editorError.classList.remove('hidden');
      return;
    }
    const newCode = `Key${upper}`;
    if (mappings.some((x) => x.code === newCode && x.id !== editingId)) {
      editorError.textContent = `Key ${upper} is already in use.`;
      editorError.classList.remove('hidden');
      return;
    }
    const m = mappings.find((x) => x.id === editingId);
    m.code = newCode;
    m.label = upper;
    setKeyMapFromMappings();
    rebuildPads();
    closeEditor();
  }

  editorInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      tryAssignNewKey(editorInput.value.trim());
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      closeEditor();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (isAutoPlaying) return;
    if (editingId) return; 
    if (!isLetterCode(e.code)) return;

    if (lockedCode && lockedCode !== e.code) return;

    if (pressedCodes.has(e.code)) return;
    pressedCodes.add(e.code);
    lockedCode = e.code;

    const id = keyCodeToId.get(e.code);
    if (!id) return;

    playSoundOnce(id).finally(() => {
    });
  });

  window.addEventListener('keyup', (e) => {
    if (!isLetterCode(e.code)) return;
    pressedCodes.delete(e.code);
    if (lockedCode === e.code) lockedCode = null;
  });

  function allowedLettersSet() {
    return new Set(mappings.map((m) => m.label));
  }

  seqInput.addEventListener('beforeinput', (e) => {
    if (typeof e.data === 'string' && e.inputType === 'insertText') {
      const ch = e.data.toUpperCase();
      const allowed = allowedLettersSet();
      if (!allowed.has(ch)) {
        e.preventDefault();
        return;
      }
      if (seqInput.value.length >= maxLen) {
        e.preventDefault();
      }
    }
  });

  seqInput.addEventListener('input', () => {
    const allowed = allowedLettersSet();
    const filtered = [...seqInput.value.toUpperCase()]
      .filter((c) => allowed.has(c))
      .slice(0, maxLen)
      .join('');
    if (seqInput.value !== filtered) seqInput.value = filtered;
  });

  async function autoPlaySequence(seq) {
    isAutoPlaying = true;
    root.classList.add('is-disabled');
    editor.classList.remove('show');
    editingId = null;
    seqInput.disabled = true;
    playBtn.disabled = true;
    seqInput.classList.add('is-disabled');
    playBtn.classList.add('is-disabled');

    try {
      for (const ch of seq) {
        const upper = ch.toUpperCase();
        const map = mappings.find((m) => m.label === upper);
        if (!map) continue; 
        await playSoundOnce(map.id);
        await new Promise((r) => setTimeout(r, SEQ_GAP_MS));
      }
    } finally {
      isAutoPlaying = false;
      root.classList.remove('is-disabled');
      seqInput.disabled = false;
      playBtn.disabled = false;
      seqInput.classList.remove('is-disabled');
      playBtn.classList.remove('is-disabled');
    }
  }

  playBtn.addEventListener('click', () => {
    if (isAutoPlaying) return;
    const seq = seqInput.value.trim();
    if (!seq) return;
    autoPlaySequence(seq);
  });

  
  loadAudios();
  rebuildPads();
})();
