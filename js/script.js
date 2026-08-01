
function showPanel(id, btn){
  document.querySelectorAll('.panel').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('nav.tabs button').forEach(b=>b.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  btn.classList.add('active');
}

function fmt(n){
  if(!isFinite(n)) return '0';
  return (Math.round(n*100)/100).toLocaleString('uz-UZ');
}

// Panel 1: Area / volume
function calcArea(){
  const l = parseFloat(document.getElementById('a-l').value) || 0;
  const w = parseFloat(document.getElementById('a-w').value) || 0;
  const h = parseFloat(document.getElementById('a-h').value) || 0;
  const area = l * w;
  document.getElementById('a-area').textContent = fmt(area);
  document.getElementById('a-vol').textContent = h > 0 ? fmt(area*h) : '—';
  document.getElementById('a-dim').textContent = h > 0
    ? `${fmt(l)} × ${fmt(w)} × ${fmt(h)} = ${fmt(area*h)} m³`
    : `${fmt(l)} × ${fmt(w)} = ${fmt(area)} m²`;
}

// Panel 2: Materials
const brickData = {
  fired: {
    name: "Oddiy pishiq g'isht",
    perM3: 394,
    thickness: [
      { name: "Yarim g'isht (12 sm)", value: 0.12 },
      { name: "1 g'isht (25 sm)", value: 0.25 },
      { name: "1.5 g'isht (38 sm)", value: 0.38 },
      { name: "2 g'isht (51 sm)", value: 0.51 }
    ]
  },

  hollow: {
    name: "Teshikli g'isht",
    perM3: 296,
    thickness: [
      { name: "Yarim g'isht (12 sm)", value: 0.12 },
      { name: "1 g'isht (25 sm)", value: 0.25 },
      { name: "1.5 g'isht (38 sm)", value: 0.38 },
      { name: "2 g'isht (51 sm)", value: 0.51 }
    ]
  },

  aac: {
    name: "Gazoblok",
    perM3: 28,
    thickness: [
      { name: "100 mm", value: 0.10 },
      { name: "200 mm", value: 0.20 },
      { name: "300 mm", value: 0.30 },
      { name: "400 mm", value: 0.40 }
    ]
  },

  foam: {
    name: "Penoblok",
    perM3: 28,
    thickness: [
      { name: "100 mm", value: 0.10 },
      { name: "200 mm", value: 0.20 },
      { name: "300 mm", value: 0.30 },
      { name: "400 mm", value: 0.40 }
    ]
  },

  block: {
    name: "Beton blok",
    perM3: 71,
    thickness: [
      { name: "190 mm", value: 0.19 },
      { name: "390 mm", value: 0.39 }
    ]
  }
};
function updateBrickThickness() {
  const type = document.getElementById("b-type").value;
  const select = document.getElementById("b-thick");

  select.innerHTML = "";

  brickData[type].thickness.forEach(item => {
    const option = document.createElement("option");
    option.value = item.value;
    option.textContent = item.name;
    select.appendChild(option);
  });

  calcBrick();
}
function setMatMode(mode, btn){
  document.querySelectorAll('#p2 .radiogroup button').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('mat-brick').style.display = mode==='brick' ? 'block' : 'none';
  document.getElementById('mat-concrete').style.display = mode==='concrete' ? 'block' : 'none';
}

function calcBrick(){

  const type = document.getElementById('b-type').value;
const brick = brickData[type];

  const l = parseFloat(document.getElementById('b-l').value) || 0;
  const h = parseFloat(document.getElementById('b-h').value) || 0;
  const thickMult = parseFloat(document.getElementById('b-thick').value) || 1;

const area = l * h;
const wallVolume = area * (0.12 * thickMult);
const bricks = wallVolume * brick.perM3 * 1.05;

  document.getElementById('b-bricks').textContent = fmt(Math.ceil(bricks));
}

function calcConcrete(){
  const l = parseFloat(document.getElementById('c-l').value) || 0;
  const w = parseFloat(document.getElementById('c-w').value) || 0;
  const t = parseFloat(document.getElementById('c-t').value) || 0;
  const vol = l * w * t;
  // ratio 1:2:4 -> total parts 7
  const cementVol = vol * (1/7);
  const sandVol = vol * (2/7);
  const gravelVol = vol * (4/7);
  // cement density ~1440 kg/m3, bag = 50kg
  const cementBags = (cementVol * 1440) / 50;
  document.getElementById('c-cement').textContent = fmt(Math.ceil(cementBags));
  document.getElementById('c-sand').textContent = fmt(sandVol);
  document.getElementById('c-gravel').textContent = fmt(gravelVol);
  document.getElementById('c-vol').textContent = fmt(vol);
}

// Panel 3: Scale
function setScaleMode(mode, btn){
  document.querySelectorAll('#p3 .radiogroup button').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('s-inlabel').textContent = mode==='toreal' ? 'Chizmadagi o\'lcham' : 'Haqiqiy o\'lcham';
  document.getElementById('s-inunit').textContent = mode==='toreal' ? 'sm' : 'm';
  document.getElementById('s-outlabel').textContent = mode==='toreal' ? 'Haqiqiy o\'lcham' : 'Chizmadagi o\'lcham';
  document.getElementById('s-outunit').textContent = mode==='toreal' ? 'm' : 'sm';
  scaleMode = mode;
  calcScale();
}

let scaleMode = 'toreal';
function calcScale(){
  const val = parseFloat(document.getElementById('s-val').value) || 0;
  const ratio = parseFloat(document.getElementById('s-ratio').value) || 1;
  let out;
  if(scaleMode === 'toreal'){
    out = (val * ratio) / 100; // cm -> m
  } else {
    out = (val * 100) / ratio; // m -> cm
  }
  document.getElementById('s-out').textContent = fmt(out);
  document.getElementById('s-dim').textContent = `1:${fmt(ratio)} masshtabda 1 sm chizmada = ${fmt(ratio/100)} m haqiqiy o'lchamga teng`;
}

calcArea();
updateBrickThickness();
calcConcrete();
calcScale();