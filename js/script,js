/* ============================================
   CHIZMACHI v2.0 — Premium Logic
   ============================================ */

// ========== MA'LUMOTLAR ==========
const materials = {
  fired: {
    name: "g'isht",
    size: [0.25, 0.12, 0.065],
    perM3: 400,
    thicknesses: [
      {value: 0.12, label: "0.5 g'isht (12 sm)"},
      {value: 0.25, label: "1 g'isht (25 sm)"},
      {value: 0.38, label: "1.5 g'isht (38 sm)"},
      {value: 0.51, label: "2 g'isht (51 sm)"}
    ]
  },
  hollow: {
    name: "g'isht",
    size: [0.25, 0.12, 0.088],
    perM3: 300,
    thicknesses: [
      {value: 0.12, label: "0.5 g'isht (12 sm)"},
      {value: 0.25, label: "1 g'isht (25 sm)"},
      {value: 0.38, label: "1.5 g'isht (38 sm)"},
      {value: 0.51, label: "2 g'isht (51 sm)"}
    ]
  },
  aac: {
    name: "blok",
    size: [0.60, 0.30, 0.20],
    perM3: 28,
    thicknesses: [
      {value: 0.10, label: "10 sm"},
      {value: 0.15, label: "15 sm"},
      {value: 0.20, label: "20 sm"},
      {value: 0.25, label: "25 sm"},
      {value: 0.30, label: "30 sm"},
      {value: 0.35, label: "35 sm"},
      {value: 0.40, label: "40 sm"}
    ]
  },
  foam: {
    name: "blok",
    size: [0.60, 0.30, 0.20],
    perM3: 28,
    thicknesses: [
      {value: 0.10, label: "10 sm"},
      {value: 0.15, label: "15 sm"},
      {value: 0.20, label: "20 sm"},
      {value: 0.25, label: "25 sm"},
      {value: 0.30, label: "30 sm"},
      {value: 0.35, label: "35 sm"},
      {value: 0.40, label: "40 sm"}
    ]
  },
  block: {
    name: "blok",
    size: [0.39, 0.19, 0.19],
    perM3: 65,
    thicknesses: [
      {value: 0.19, label: "19 sm"},
      {value: 0.39, label: "39 sm"}
    ]
  }
};

// ========== STATE ==========
let scaleMode = 'toreal';
let soundEnabled = true;
let currentPanel = 'p1';

// ========== AUDIO SYSTEM ==========
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;

function initAudio() {
  if (!audioCtx) audioCtx = new AudioCtx();
}

function playTone(freq, duration, type = 'sine', vol = 0.08) {
  if (!soundEnabled) return;
  try {
    initAudio();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(vol, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {}
}

function playClick() { playTone(800, 0.08, 'sine', 0.06); }
function playSuccess() { 
  playTone(600, 0.1, 'sine', 0.05); 
  setTimeout(() => playTone(900, 0.15, 'sine', 0.05), 80);
}
function playError() { playTone(200, 0.25, 'triangle', 0.06); }
function playSwitch() { playTone(450, 0.1, 'sine', 0.04); }

// ========== FORMATTERS ==========
function formatNumber(num, decimals = 2) {
  if (isNaN(num) || !isFinite(num)) return '0';
  return num.toLocaleString('uz-UZ', {
    minimumFractionDigits: num % 1 === 0 ? 0 : decimals,
    maximumFractionDigits: decimals
  });
}

function formatMoney(num) {
  if (isNaN(num) || !isFinite(num)) return '0';
  return num.toLocaleString('uz-UZ') + ' so'm';
}

// ========== TOAST ==========
function showToast(msg, type = 'info') {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.style.background = type === 'error' ? 'var(--error)' : 'var(--accent)';
  toast.style.color = type === 'error' ? '#fff' : 'var(--bg)';
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2200);
}

// ========== VALIDATION ==========
function validateInput(input) {
  const val = parseFloat(input.value);
  const field = input.closest('.field');
  const errorEl = field?.querySelector('.error-msg');
  const row = input.closest('.inputrow');

  if (input.value && (isNaN(val) || val < 0)) {
    row?.classList.add('error');
    if (errorEl) errorEl.style.display = 'block';
    return false;
  } else {
    row?.classList.remove('error');
    if (errorEl) errorEl.style.display = 'none';
    return true;
  }
}

// ========== PANEL SWITCHING ==========
function showPanel(id, btn) {
  currentPanel = id;
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tabs button').forEach(b => b.classList.remove('active'));

  document.getElementById(id).classList.add('active');
  btn.classList.add('active');
  btn.focus();
  playSwitch();
  saveToStorage();
}

// ========== AREA / VOLUME ==========
function calcArea() {
  const l = parseFloat(document.getElementById('a-l').value) || 0;
  const w = parseFloat(document.getElementById('a-w').value) || 0;
  const h = parseFloat(document.getElementById('a-h').value) || 0;

  validateInput(document.getElementById('a-l'));
  validateInput(document.getElementById('a-w'));
  validateInput(document.getElementById('a-h'));

  const area = l * w;
  const vol = h > 0 ? area * h : null;

  document.getElementById('a-area').textContent = formatNumber(area, 2);
  document.getElementById('a-vol').textContent = vol !== null ? formatNumber(vol, 2) : '—';
  document.getElementById('a-dim').textContent = 
    h > 0 
      ? `${formatNumber(l,2)} m × ${formatNumber(w,2)} m × ${formatNumber(h,2)} m = ${formatNumber(vol,2)} m³` 
      : `${formatNumber(l,2)} m × ${formatNumber(w,2)} m = ${formatNumber(area,2)} m²`;

  saveToStorage();
}

// ========== MATERIALS ==========
function setMatMode(mode, btn) {
  document.querySelectorAll('#p2 .radiogroup button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  document.getElementById('mat-brick').style.display = mode === 'brick' ? 'block' : 'none';
  document.getElementById('mat-concrete').style.display = mode === 'concrete' ? 'block' : 'none';

  playClick();
  saveToStorage();
}

function updateBrickThickness() {
  const type = document.getElementById('b-type').value;
  const select = document.getElementById('b-thick');
  const mat = materials[type];

  select.innerHTML = '';
  mat.thicknesses.forEach(t => {
    const opt = document.createElement('option');
    opt.value = t.value;
    opt.textContent = t.label;
    select.appendChild(opt);
  });

  document.getElementById('b-label').textContent = `Kerakli ${mat.name} (zaxira bilan +5%)`;

  const dimText = {
    fired: "Standart g'isht: 25×12×6.5 sm, devor hajmiga qarab hisoblanadi",
    hollow: "Teshikli g'isht: 25×12×8.8 sm, devor hajmiga qarab hisoblanadi",
    aac: "Gazoblok: 60×30×20 sm, yopishgich bilan o'rnatiladi",
    foam: "Penoblok: 60×30×20 sm, yopishgich bilan o'rnatiladi",
    block: "Beton blok: 39×19×19 sm, aralashma bilan o'rnatiladi"
  };
  document.getElementById('b-dim').textContent = dimText[type] || '';

  calcBrick();
}

function calcBrick() {
  const type = document.getElementById('b-type').value;
  const l = parseFloat(document.getElementById('b-l').value) || 0;
  const h = parseFloat(document.getElementById('b-h').value) || 0;
  const t = parseFloat(document.getElementById('b-thick').value) || 0;
  const price = parseFloat(document.getElementById('b-price').value) || 0;

  validateInput(document.getElementById('b-l'));
  validateInput(document.getElementById('b-h'));
  validateInput(document.getElementById('b-price'));

  if (l <= 0 || h <= 0 || t <= 0) {
    document.getElementById('b-bricks').textContent = '0';
    document.getElementById('b-total').textContent = '0 so'm';
    return;
  }

  const mat = materials[type];
  const wallVolume = l * h * t;
  const pieces = Math.ceil(wallVolume * mat.perM3 * 1.05);
  const total = pieces * price;

  document.getElementById('b-bricks').textContent = formatNumber(pieces, 0);
  document.getElementById('b-total').textContent = price > 0 ? formatMoney(total) : '0 so'm';

  if (price > 0) playSuccess();
  saveToStorage();
}

function calcConcrete() {
  const l = parseFloat(document.getElementById('c-l').value) || 0;
  const w = parseFloat(document.getElementById('c-w').value) || 0;
  const t = parseFloat(document.getElementById('c-t').value) || 0;
  const priceCement = parseFloat(document.getElementById('c-price-cement').value) || 0;
  const priceSand = parseFloat(document.getElementById('c-price-sand').value) || 0;
  const priceGravel = parseFloat(document.getElementById('c-price-gravel').value) || 0;

  validateInput(document.getElementById('c-l'));
  validateInput(document.getElementById('c-w'));
  validateInput(document.getElementById('c-t'));

  const vol = l * w * t;
  const cementBags = vol > 0 ? Math.ceil(vol * 6.5) : 0;
  const sand = vol * 0.42;
  const gravel = vol * 0.84;

  const totalCement = cementBags * priceCement;
  const totalSand = sand * priceSand;
  const totalGravel = gravel * priceGravel;
  const totalAll = totalCement + totalSand + totalGravel;

  document.getElementById('c-cement').textContent = formatNumber(cementBags, 0);
  document.getElementById('c-sand').textContent = formatNumber(sand, 2);
  document.getElementById('c-gravel').textContent = formatNumber(gravel, 2);
  document.getElementById('c-vol').textContent = formatNumber(vol, 2);

  document.getElementById('c-total-cement').textContent = priceCement > 0 ? formatMoney(totalCement) : '—';
  document.getElementById('c-total-sand').textContent = priceSand > 0 ? formatMoney(totalSand) : '—';
  document.getElementById('c-total-gravel').textContent = priceGravel > 0 ? formatMoney(totalGravel) : '—';
  document.getElementById('c-total-all').textContent = (priceCement + priceSand + priceGravel) > 0 ? formatMoney(totalAll) : '0 so'm';

  if ((priceCement + priceSand + priceGravel) > 0 && vol > 0) playSuccess();
  saveToStorage();
}

// ========== SCALE ==========
function setScaleMode(mode, btn) {
  scaleMode = mode;
  document.querySelectorAll('#p3 .radiogroup button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  const inLabel = document.getElementById('s-inlabel');
  const inUnit = document.getElementById('s-inunit');
  const outLabel = document.getElementById('s-outlabel');
  const outUnit = document.getElementById('s-outunit');
  const dim = document.getElementById('s-dim');

  if (mode === 'toreal') {
    inLabel.textContent = 'Chizmadagi o'lcham';
    inUnit.textContent = 'sm';
    outLabel.textContent = 'Haqiqiy o'lcham';
    outUnit.textContent = 'm';
    dim.textContent = '1:100 masshtabda 1 sm chizmada = 1 m haqiqiy o'lchamga teng';
  } else {
    inLabel.textContent = 'Haqiqiy o'lcham';
    inUnit.textContent = 'm';
    outLabel.textContent = 'Chizmadagi o'lcham';
    outUnit.textContent = 'sm';
    dim.textContent = '1:100 masshtabda 1 m haqiqiy = 1 sm chizmada';
  }

  playClick();
  calcScale();
}

function calcScale() {
  const val = parseFloat(document.getElementById('s-val').value) || 0;
  const ratio = parseFloat(document.getElementById('s-ratio').value) || 1;

  validateInput(document.getElementById('s-val'));
  validateInput(document.getElementById('s-ratio'));

  if (val <= 0 || ratio <= 0) {
    document.getElementById('s-out').textContent = '0';
    return;
  }

  let result, unit;

  if (scaleMode === 'toreal') {
    const realCm = val * ratio;
    if (realCm >= 100) { result = formatNumber(realCm/100, 2); unit = 'm'; }
    else { result = formatNumber(realCm, 1); unit = 'sm'; }
  } else {
    const drawingCm = (val * 100) / ratio;
    if (drawingCm < 1) { result = formatNumber(drawingCm*10, 2); unit = 'mm'; }
    else { result = formatNumber(drawingCm, 2); unit = 'sm'; }
  }

  document.getElementById('s-out').textContent = result;
  document.getElementById('s-outunit').textContent = unit;

  const ratioVal = document.getElementById('s-ratio').value || 100;
  const inVal = document.getElementById('s-val').value || 0;
  const inUnitText = scaleMode === 'toreal' ? 'sm' : 'm';
  document.getElementById('s-dim').textContent = `1:${ratioVal} masshtabda ${inVal} ${inUnitText} = ${result} ${unit}`;

  saveToStorage();
}

// ========== COPY / RESET ==========
async function copyResult(id, unit) {
  const val = document.getElementById(id).textContent;
  const text = `${val} ${unit}`.trim();
  try {
    await navigator.clipboard.writeText(text);
    showToast('Nusxalandi: ' + text);
    playSuccess();
  } catch (e) {
    showToast('Nusxalandi');
  }
}

function resetPanel(panelId) {
  const panel = document.getElementById(panelId);
  panel.querySelectorAll('input[type="number"]').forEach(input => input.value = '');

  if (panelId === 'p1') {
    document.getElementById('a-area').textContent = '0';
    document.getElementById('a-vol').textContent = '—';
    document.getElementById('a-dim').textContent = 'Uzunlik × kenglik = maydon';
  } else if (panelId === 'p2') {
    document.getElementById('b-bricks').textContent = '0';
    document.getElementById('b-total').textContent = '0 so'm';
    document.getElementById('c-cement').textContent = '0';
    document.getElementById('c-sand').textContent = '0';
    document.getElementById('c-gravel').textContent = '0';
    document.getElementById('c-vol').textContent = '0';
    document.getElementById('c-total-cement').textContent = '—';
    document.getElementById('c-total-sand').textContent = '—';
    document.getElementById('c-total-gravel').textContent = '—';
    document.getElementById('c-total-all').textContent = '0 so'm';
    updateBrickThickness();
  } else if (panelId === 'p3') {
    document.getElementById('s-out').textContent = '0';
    document.getElementById('s-dim').textContent = scaleMode === 'toreal' 
      ? '1:100 masshtabda 1 sm chizmada = 1 m haqiqiy o'lchamga teng'
      : '1:100 masshtabda 1 m haqiqiy = 1 sm chizmada';
  }

  playClick();
  showToast('Tozalandi');
  saveToStorage();
}

// ========== THEME ==========
function toggleTheme() {
  const html = document.documentElement;
  const btn = document.getElementById('theme-btn');
  const isDark = html.getAttribute('data-theme') !== 'light';

  if (isDark) {
    html.setAttribute('data-theme', 'light');
    btn.textContent = '🌙';
    btn.title = 'Qorong'u rejim';
  } else {
    html.removeAttribute('data-theme');
    btn.textContent = '☀️';
    btn.title = 'Yorug' rejim';
  }

  localStorage.setItem('chizmachi_theme', isDark ? 'light' : 'dark');
  playClick();
}

function loadTheme() {
  const saved = localStorage.getItem('chizmachi_theme');
  const btn = document.getElementById('theme-btn');
  if (saved === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    btn.textContent = '🌙';
    btn.title = 'Qorong'u rejim';
  } else {
    btn.textContent = '☀️';
    btn.title = 'Yorug' rejim';
  }
}

// ========== SOUND TOGGLE ==========
function toggleSound() {
  soundEnabled = !soundEnabled;
  const btn = document.getElementById('sound-btn');
  btn.textContent = soundEnabled ? '🔊' : '🔇';
  btn.classList.toggle('muted', !soundEnabled);
  btn.title = soundEnabled ? 'Ovozni o'chirish' : 'Ovozni yoqish';
  localStorage.setItem('chizmachi_sound', soundEnabled ? 'on' : 'off');
}

function loadSound() {
  const saved = localStorage.getItem('chizmachi_sound');
  if (saved === 'off') {
    soundEnabled = false;
    const btn = document.getElementById('sound-btn');
    btn.textContent = '🔇';
    btn.classList.add('muted');
    btn.title = 'Ovozni yoqish';
  }
}

// ========== KEYBOARD NAVIGATION ==========
document.addEventListener('keydown', (e) => {
  // Ctrl/Cmd + 1/2/3 for tabs
  if ((e.ctrlKey || e.metaKey) && e.key >= '1' && e.key <= '3') {
    e.preventDefault();
    const idx = parseInt(e.key) - 1;
    const tabs = document.querySelectorAll('.tabs button');
    if (tabs[idx]) tabs[idx].click();
    return;
  }

  // Escape to reset current panel
  if (e.key === 'Escape') {
    resetPanel(currentPanel);
    return;
  }

  // Enter on input triggers calculation
  if (e.key === 'Enter' && e.target.tagName === 'INPUT') {
    e.preventDefault();
    // Find next input or calculate
    const inputs = Array.from(document.querySelectorAll('.panel.active input, .panel.active select'));
    const idx = inputs.indexOf(e.target);
    if (idx >= 0 && idx < inputs.length - 1) {
      inputs[idx + 1].focus();
    } else {
      // Trigger appropriate calc
      if (currentPanel === 'p1') calcArea();
      else if (currentPanel === 'p2') {
        if (document.getElementById('mat-brick').style.display !== 'none') calcBrick();
        else calcConcrete();
      }
      else if (currentPanel === 'p3') calcScale();
    }
  }
});

// ========== LOCALSTORAGE ==========
function saveToStorage() {
  const data = {
    p1: {
      l: document.getElementById('a-l').value,
      w: document.getElementById('a-w').value,
      h: document.getElementById('a-h').value
    },
    p2: {
      mode: document.getElementById('mat-brick').style.display !== 'none' ? 'brick' : 'concrete',
      brick: {
        l: document.getElementById('b-l').value,
        h: document.getElementById('b-h').value,
        type: document.getElementById('b-type').value,
        thick: document.getElementById('b-thick').value,
        price: document.getElementById('b-price').value
      },
      concrete: {
        l: document.getElementById('c-l').value,
        w: document.getElementById('c-w').value,
        t: document.getElementById('c-t').value,
        priceCement: document.getElementById('c-price-cement').value,
        priceSand: document.getElementById('c-price-sand').value,
        priceGravel: document.getElementById('c-price-gravel').value
      }
    },
    p3: {
      mode: scaleMode,
      val: document.getElementById('s-val').value,
      ratio: document.getElementById('s-ratio').value
    },
    activeTab: currentPanel
  };
  localStorage.setItem('chizmachi_data', JSON.stringify(data));
}

function loadFromStorage() {
  try {
    const data = JSON.parse(localStorage.getItem('chizmachi_data'));
    if (!data) return;

    if (data.activeTab) {
      const btn = document.querySelector(`button[data-panel="${data.activeTab}"]`);
      if (btn) showPanel(data.activeTab, btn);
    }

    if (data.p1) {
      document.getElementById('a-l').value = data.p1.l || '';
      document.getElementById('a-w').value = data.p1.w || '';
      document.getElementById('a-h').value = data.p1.h || '';
      calcArea();
    }

    if (data.p2) {
      if (data.p2.mode === 'concrete') {
        const btn = document.querySelector('#p2 .radiogroup button:nth-child(2)');
        if (btn) setMatMode('concrete', btn);
      }
      if (data.p2.brick) {
        document.getElementById('b-l').value = data.p2.brick.l || '';
        document.getElementById('b-h').value = data.p2.brick.h || '';
        document.getElementById('b-price').value = data.p2.brick.price || '';
        if (data.p2.brick.type) {
          document.getElementById('b-type').value = data.p2.brick.type;
          updateBrickThickness();
        }
        if (data.p2.brick.thick) {
          document.getElementById('b-thick').value = data.p2.brick.thick;
        }
        calcBrick();
      }
      if (data.p2.concrete) {
        document.getElementById('c-l').value = data.p2.concrete.l || '';
        document.getElementById('c-w').value = data.p2.concrete.w || '';
        document.getElementById('c-t').value = data.p2.concrete.t || '';
        document.getElementById('c-price-cement').value = data.p2.concrete.priceCement || '';
        document.getElementById('c-price-sand').value = data.p2.concrete.priceSand || '';
        document.getElementById('c-price-gravel').value = data.p2.concrete.priceGravel || '';
        calcConcrete();
      }
    }

    if (data.p3) {
      if (data.p3.mode === 'todrawing') {
        const btn = document.querySelector('#p3 .radiogroup button:nth-child(2)');
        if (btn) setScaleMode('todrawing', btn);
      }
      document.getElementById('s-val').value = data.p3.val || '';
      document.getElementById('s-ratio').value = data.p3.ratio || '100';
      calcScale();
    }
  } catch (e) {
    console.error('Storage load error:', e);
  }
}

// ========== INIT ==========
document.addEventListener('DOMContentLoaded', () => {
  loadTheme();
  loadSound();
  updateBrickThickness();

  // Add reset buttons
  document.querySelectorAll('.panel').forEach(panel => {
    const card = panel.querySelector('.card');
    if (!card) return;
    const resetBtn = document.createElement('button');
    resetBtn.type = 'button';
    resetBtn.className = 'reset-btn';
    resetBtn.textContent = 'Tozalash (Esc)';
    resetBtn.onclick = () => resetPanel(panel.id);
    card.appendChild(resetBtn);
  });

  loadFromStorage();

  // First interaction init audio
  document.body.addEventListener('click', initAudio, { once: true });
  document.body.addEventListener('keydown', initAudio, { once: true });
});