/* ============================================
   POLE BOOK MODULE
   ============================================ */

const PoleBook = {
    data: {
        concrete: {
            title: 'Concrete Poles',
            desc: 'Standard reinforced concrete utility poles per IEC 60569',
            specs: [
                { label: 'Height Range', value: '6 - 18', unit: 'm', note: 'Standard lengths per IEC 60569' },
                { label: 'Top Diameter', value: '150 - 250', unit: 'mm', note: 'Tapered design' },
                { label: 'Base Diameter', value: '300 - 450', unit: 'mm', note: 'Varies by height' },
                { label: 'Working Load', value: '150 - 350', unit: 'daN', note: 'Ultimate load 2.5x' }
            ],
            columns: ['Height (m)', 'Top Ø (mm)', 'Base Ø (mm)', 'Wall (mm)', 'Weight (kg)', 'Working Load (daN)', 'Embedment (m)'],
            rows: [
                [8, 150, 300, 50, 850, 150, 1.6],
                [9, 160, 330, 55, 1100, 200, 1.8],
                [10, 170, 360, 60, 1400, 200, 2.0],
                [11, 180, 390, 65, 1750, 250, 2.2],
                [12, 190, 420, 70, 2100, 250, 2.4]
            ]
        },
        steel: {
            title: 'Steel Poles',
            desc: 'Galvanized steel tubular poles per EN 40-5',
            specs: [
                { label: 'Height Range', value: '5 - 30', unit: 'm', note: 'Modular sections available' },
                { label: 'Diameter', value: '60 - 300', unit: 'mm', note: 'Constant or tapered' },
                { label: 'Wall Thickness', value: '3 - 8', unit: 'mm', note: 'Hot-dip galvanized' },
                { label: 'Working Load', value: '200 - 500', unit: 'daN', note: 'High strength steel' }
            ],
            columns: ['Height (m)', 'Ø (mm)', 'Wall (mm)', 'Weight (kg)', 'Working Load (daN)', 'Embedment (m)'],
            rows: [
                [6, 76, 3, 45, 200, 1.2],
                [8, 89, 3.5, 78, 250, 1.6],
                [10, 102, 4, 120, 300, 2.0],
                [12, 114, 4.5, 175, 350, 2.4]
            ]
        },
        wood: {
            title: 'Wood Poles',
            desc: 'Pressure-treated wooden utility poles per ANSI O5.1',
            specs: [
                { label: 'Height Range', value: '4.5 - 24', unit: 'm', note: 'Southern Pine / Douglas Fir' },
                { label: 'Top Circumference', value: '30 - 55', unit: 'cm', note: 'Class 1-7' },
                { label: 'Treatment', value: 'CCA / Creosote', unit: '', note: 'Pressure treated' },
                { label: 'Lifespan', value: '25 - 40', unit: 'years', note: 'With maintenance' }
            ],
            columns: ['Height (m)', 'Class', 'Top Circ (cm)', 'Base Circ (cm)', 'Weight (kg)', 'Working Load (daN)'],
            rows: [
                [7.5, '4', 31, 57, 200, 1150],
                [9, '3', 35, 63, 270, 1360],
                [10.5, '2', 39, 69, 360, 1590],
                [12, '1', 43, 75, 460, 1810]
            ]
        },
        composite: {
            title: 'Composite Poles',
            desc: 'FRP fiberglass reinforced polymer poles',
            specs: [
                { label: 'Height Range', value: '6 - 20', unit: 'm', note: 'Lightweight alternative' },
                { label: 'Weight', value: '30 - 150', unit: 'kg', note: '70% lighter than concrete' },
                { label: 'Insulation', value: '100+', unit: 'kV', note: 'Electrical insulation' },
                { label: 'Lifespan', value: '80+', unit: 'years', note: 'Corrosion resistant' }
            ],
            columns: ['Height (m)', 'Ø (mm)', 'Weight (kg)', 'Working Load (daN)', 'Insulation (kV)'],
            rows: [
                [8, 200, 35, 300, 110],
                [10, 220, 55, 350, 110],
                [12, 240, 80, 400, 150],
                [15, 280, 120, 450, 150]
            ]
        },
        spacing: {
            title: 'Span & Spacing Guide',
            desc: 'Recommended pole spacing for different applications',
            specs: [
                { label: 'LV Distribution', value: '40 - 50', unit: 'm', note: 'Low voltage lines' },
                { label: 'MV Distribution', value: '80 - 120', unit: 'm', note: 'Medium voltage 6-35kV' },
                { label: 'HV Transmission', value: '200 - 400', unit: 'm', note: 'High voltage 110kV+' },
                { label: 'Communication', value: '50 - 70', unit: 'm', note: 'Fiber/copper cables' }
            ],
            columns: ['Application', 'Voltage', 'Span (m)', 'Pole Height (m)', 'Min Ground Clearance (m)'],
            rows: [
                ['Residential LV', '0.4 kV', 45, 8, 5.5],
                ['Commercial LV', '0.4 kV', 50, 9, 5.5],
                ['Rural MV', '10 kV', 100, 10, 6.0],
                ['Urban MV', '10 kV', 80, 11, 6.5],
                ['HV Line', '110 kV', 250, 18, 7.0]
            ]
        }
    },

    showCategory: function(category) {
        // Update active button
        document.querySelectorAll('.pole-category-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === category);
        });
        
        const data = this.data[category];
        if (!data) return;
        
        // Update header
        document.getElementById('poleContentTitle').textContent = data.title;
        document.getElementById('poleContentDesc').textContent = data.desc;
        
        // Update specs
        const specsContainer = document.getElementById('poleSpecs');
        specsContainer.innerHTML = data.specs.map(spec => `
            <div class="pole-spec-card">
                <div class="pole-spec-label">${spec.label}</div>
                <div class="pole-spec-value">${spec.value} <span class="pole-spec-unit">${spec.unit}</span></div>
                <div class="pole-spec-note">${spec.note}</div>
            </div>
        `).join('');
        
        // Update table
        const thead = document.querySelector('#poleTable thead tr');
        thead.innerHTML = data.columns.map(col => `<th>${col}</th>`).join('');
        
        const tbody = document.getElementById('poleTableBody');
        tbody.innerHTML = data.rows.map(row => `
            <tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>
        `).join('');
    },

    calculate: function() {
        const height = parseFloat(document.getElementById('poleCalcHeight').value) || 0;
        const windSpeed = parseFloat(document.getElementById('poleWindSpeed').value) || 0;
        const wireTension = parseFloat(document.getElementById('poleWireTension').value) || 0;
        const span = parseFloat(document.getElementById('poleSpan').value) || 0;
        
        if (!height || !windSpeed) {
            App.showToast('Please fill in all required fields', 'error');
            return;
        }
        
        // Wind load calculation (simplified): F = 0.5 * ρ * v² * A * Cd
        // ρ = 1.225 kg/m³, Cd ≈ 1.2 for cylinder
        const rho = 1.225;
        const Cd = 1.2;
        const diameter = 0.2 + (height * 0.01); // Approximate average diameter
        const area = height * diameter;
        const windLoad = 0.5 * rho * Math.pow(windSpeed, 2) * area * Cd;
        
        // Total moment at base
        const windMoment = windLoad * (height / 2);
        const tensionMoment = wireTension * height;
        const totalMoment = windMoment + tensionMoment;
        
        // Embedment depth (rule of thumb: 10% of height + 0.6m)
        const embedment = height * 0.1 + 0.6;
        
        const resultHtml = `
            <div class="result-panel" style="margin-top: var(--space-6);">
                <div class="result-title">Calculation Results</div>
                <div class="result-grid">
                    <div class="result-item">
                        <div class="result-label">Wind Load</div>
                        <div class="result-value">${windLoad.toFixed(1)} <span class="result-unit">N</span></div>
                    </div>
                    <div class="result-item">
                        <div class="result-label">Wind Moment</div>
                        <div class="result-value">${(windMoment/1000).toFixed(1)} <span class="result-unit">kN·m</span></div>
                    </div>
                    <div class="result-item">
                        <div class="result-label">Tension Moment</div>
                        <div class="result-value">${(tensionMoment/1000).toFixed(1)} <span class="result-unit">kN·m</span></div>
                    </div>
                    <div class="result-item">
                        <div class="result-label">Total Moment</div>
                        <div class="result-value">${(totalMoment/1000).toFixed(1)} <span class="result-unit">kN·m</span></div>
                    </div>
                    <div class="result-item">
                        <div class="result-label">Embedment Depth</div>
                        <div class="result-value">${embedment.toFixed(1)} <span class="result-unit">m</span></div>
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('poleCalcResult').innerHTML = resultHtml;
        App.saveToHistory('Pole Load', `H:${height}m V:${windSpeed}m/s`, `${(totalMoment/1000).toFixed(1)} kN·m`);
    }
};
// Pole Book
const pData={
  concrete:{t:'Concrete Poles',d:'Standard reinforced concrete utility poles per IEC 60569',
    sp:[{l:'Height Range',v:'6 - 18',u:'m',n:'Standard lengths per IEC 60569'},{l:'Top Diameter',v:'150 - 250',u:'mm',n:'Tapered design'},{l:'Base Diameter',v:'300 - 450',u:'mm',n:'Varies by height'},{l:'Working Load',v:'150 - 350',u:'daN',n:'Ultimate load 2.5x'}],
    cl:['Height (m)','Top Ø (mm)','Base Ø (mm)','Wall (mm)','Weight (kg)','Working Load (daN)','Embedment (m)'],
    rw:[[8,150,300,50,850,150,1.6],[9,160,330,55,1100,200,1.8],[10,170,360,60,1400,200,2.0],[11,180,390,65,1750,250,2.2],[12,190,420,70,2100,250,2.4]]},
  steel:{t:'Steel Poles',d:'Galvanized steel tubular poles per EN 40-5',
    sp:[{l:'Height Range',v:'5 - 30',u:'m',n:'Modular sections available'},{l:'Diameter',v:'60 - 300',u:'mm',n:'Constant or tapered'},{l:'Wall Thickness',v:'3 - 8',u:'mm',n:'Hot-dip galvanized'},{l:'Working Load',v:'200 - 500',u:'daN',n:'High strength steel'}],
    cl:['Height (m)','Ø (mm)','Wall (mm)','Weight (kg)','Working Load (daN)','Embedment (m)'],
    rw:[[6,76,3,45,200,1.2],[8,89,3.5,78,250,1.6],[10,102,4,120,300,2.0],[12,114,4.5,175,350,2.4]]},
  wood:{t:'Wood Poles',d:'Pressure-treated wooden utility poles per ANSI O5.1',
    sp:[{l:'Height Range',v:'4.5 - 24',u:'m',n:'Southern Pine / Douglas Fir'},{l:'Top Circumference',v:'30 - 55',u:'cm',n:'Class 1-7'},{l:'Treatment',v:'CCA / Creosote',u:'',n:'Pressure treated'},{l:'Lifespan',v:'25 - 40',u:'years',n:'With maintenance'}],
    cl:['Height (m)','Class','Top Circ (cm)','Base Circ (cm)','Weight (kg)','Working Load (daN)'],
    rw:[[7.5,'4',31,57,200,1150],[9,'3',35,63,270,1360],[10.5,'2',39,69,360,1590],[12,'1',43,75,460,1810]]},
  composite:{t:'Composite Poles',d:'FRP fiberglass reinforced polymer poles',
    sp:[{l:'Height Range',v:'6 - 20',u:'m',n:'Lightweight alternative'},{l:'Weight',v:'30 - 150',u:'kg',n:'70% lighter than concrete'},{l:'Insulation',v:'100+',u:'kV',n:'Electrical insulation'},{l:'Lifespan',v:'80+',u:'years',n:'Corrosion resistant'}],
    cl:['Height (m)','Ø (mm)','Weight (kg)','Working Load (daN)','Insulation (kV)'],
    rw:[[8,200,35,300,110],[10,220,55,350,110],[12,240,80,400,150],[15,280,120,450,150]]},
  spacing:{t:'Span & Spacing Guide',d:'Recommended pole spacing for different applications',
    sp:[{l:'LV Distribution',v:'40 - 50',u:'m',n:'Low voltage lines'},{l:'MV Distribution',v:'80 - 120',u:'m',n:'Medium voltage 6-35kV'},{l:'HV Transmission',v:'200 - 400',u:'m',n:'High voltage 110kV+'},{l:'Communication',v:'50 - 70',u:'m',n:'Fiber/copper cables'}],
    cl:['Application','Voltage','Span (m)','Pole Height (m)','Min Ground Clearance (m)'],
    rw:[['Residential LV','0.4 kV',45,8,5.5],['Commercial LV','0.4 kV',50,9,5.5],['Rural MV','10 kV',100,10,6.0],['Urban MV','10 kV',80,11,6.5],['HV Line','110 kV',250,18,7.0]]}
};
function pCat(c){
  document.querySelectorAll('.pcb').forEach(b=>b.classList.toggle('on',b.dataset.c===c));
  const d=pData[c];if(!d)return;
  document.getElementById('p-title').textContent=d.t;
  document.getElementById('p-desc').textContent=d.d;
  document.getElementById('p-specs').innerHTML=d.sp.map(s=>'<div class=\"pstc\"><div class=\"pstl\">'+s.l+'</div><div class=\"pstv\">'+s.v+' <span class=\"pstu\">'+s.u+'</span></div><div class=\"pstn\">'+s.n+'</div></div>').join('');
  document.querySelector('#p-table thead tr').innerHTML=d.cl.map(c=>'<th>'+c+'</th>').join('');
  document.getElementById('p-tbody').innerHTML=d.rw.map(r=>'<tr>'+r.map(c=>'<td>'+c+'</td>').join('')+'</tr>').join('');
}
function pSearch(){
  const t=document.getElementById('ps-in').value.toLowerCase();
  document.querySelectorAll('#p-tbody tr').forEach(r=>r.style.display=r.textContent.toLowerCase().includes(t)?'':'none');
}
function calcPole(){
  const h=res(document.getElementById('pc-h').value),w=res(document.getElementById('pc-w').value),t=res(document.getElementById('pc-t').value),s=res(document.getElementById('pc-s').value);
  if(!h||!w){toast('Fill required fields','e');return}
  const rho=1.225,Cd=1.2,dia=0.2+(h*0.01),a=h*dia,wl=0.5*rho*Math.pow(w,2)*a*Cd,wm=wl*(h/2),tm=t*h+wm,em=h*0.1+0.6;
  document.getElementById('res-pole').innerHTML=rp('Calculation Results',[{'l':'Wind Load','v':wl.toFixed(1),'u':'N'},{'l':'Wind Moment','v':(wm/1000).toFixed(1),'u':'kN·m'},{'l':'Tension Moment','v':(tm/1000).toFixed(1),'u':'kN·m'},{'l':'Embedment','v':em.toFixed(1),'u':'m'}]);
  sav('Pole Load','H:'+h+'m V:'+w+'m/s',(tm/1000).toFixed(1)+' kN·m')
}

// Converters
const cf={len:{m:1,cm:0.01,mm:0.001,km:1000,ft:0.3048,in:0.0254,yd:0.9144},area:{m2:1,cm2:0.0001,mm2:0.000001,km2:1000000,ft2:0.092903,ha:10000,ac:4046.86},vol:{m3:1,l:0.001,cm3:0.000001,ft3:0.0283168,gal:0.00378541},wgt:{kg:1,g:0.001,t:1000,lb:0.453592,oz:0.0283495}};
function cv(v,f,t,ty){const x=cf[ty];if(!x||!x[f]||!x[t])return 0;return v*x[f]/x[t]}
function cLen(){const v=res(document.getElementById('c-l-v').value),f=document.getElementById('c-l-f').value,t=document.getElementById('c-l-t').value;document.getElementById('c-l-r').value=cv(v,f,t,'len').toFixed(dec)}
function cArea(){const v=res(document.getElementById('c-a-v').value),f=document.getElementById('c-a-f').value,t=document.getElementById('c-a-t').value;document.getElementById('c-a-r').value=cv(v,f,t,'area').toFixed(dec)}
function cVol(){const v=res(document.getElementById('c-v-v').value),f=document.getElementById('c-v-f').value,t=document.getElementById('c-v-t').value;document.getElementById('c-v-r').value=cv(v,f,t,'vol').toFixed(dec)}
function cWgt(){const v=res(document.getElementById('c-w-v').value),f=document.getElementById('c-w-f').value,t=document.getElementById('c-w-t').value;document.getElementById('c-w-r').value=cv(v,f,t,'wgt').toFixed(dec)}

// Init
document.addEventListener('DOMContentLoaded',function(){
  const l=localStorage.getItem('ac-lang')||'en',t=localStorage.getItem('ac-theme')||'light',d=localStorage.getItem('ac-dec')||'2',u=localStorage.getItem('ac-unit')||'metric';
  try{hist=JSON.parse(localStorage.getItem('ac-hist'))||[]}catch(e){hist=[]}
  setLang(l);setTheme(t);setDec(d);setUnit(u);renH();upSt();go('dashboard',false);
  cLen();cArea();cVol();cWgt();
});
