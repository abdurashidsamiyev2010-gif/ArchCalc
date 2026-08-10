/* ============================================
   POLE BOOK MODULE
   Utility pole reference data (concrete, steel,
   wood, composite) and a wind/tension load
   calculator.
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

    showCategory: function (category) {
        document.querySelectorAll('.pole-category-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === category);
        });

        const data = this.data[category];
        if (!data) return;

        document.getElementById('poleContentTitle').textContent = data.title;
        document.getElementById('poleContentDesc').textContent = data.desc;

        document.getElementById('poleSpecs').innerHTML = data.specs.map(spec => `
            <div class="pole-spec-card">
                <div class="pole-spec-label">${spec.label}</div>
                <div class="pole-spec-value">${spec.value} <span class="pole-spec-unit">${spec.unit}</span></div>
                <div class="pole-spec-note">${spec.note}</div>
            </div>
        `).join('');

        const thead = document.querySelector('#poleTable thead tr');
        thead.innerHTML = data.columns.map(col => `<th>${col}</th>`).join('');

        document.getElementById('poleTableBody').innerHTML = data.rows.map(row => `
            <tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>
        `).join('');
    },

    /** Filter the currently rendered table by free-text search. */
    search: function () {
        const term = (document.getElementById('poleSearch').value || '').toLowerCase();
        document.querySelectorAll('#poleTableBody tr').forEach(row => {
            row.style.display = row.textContent.toLowerCase().includes(term) ? '' : 'none';
        });
    },

    /**
     * Simplified wind + wire-tension load calculation.
     * Wind load: F = 0.5 * ρ * v² * A * Cd  (ρ=1.225 kg/m³, Cd≈1.2 for a cylinder)
     * This is a preliminary estimate only — final pole selection requires
     * a qualified structural engineer's review against local wind codes.
     */
    calculate: function () {
        const height = res(document.getElementById('poleCalcHeight').value);
        const windSpeed = res(document.getElementById('poleWindSpeed').value);
        const wireTension = res(document.getElementById('poleWireTension').value);

        if (!height || !windSpeed) {
            App.showToast('Please fill in all required fields', 'error');
            return;
        }

        const rho = 1.225;
        const Cd = 1.2;
        const diameter = 0.2 + (height * 0.01); // approximate average diameter
        const area = height * diameter;
        const windLoad = 0.5 * rho * Math.pow(windSpeed, 2) * area * Cd;

        const windMoment = windLoad * (height / 2);
        const tensionMoment = wireTension * height;
        const totalMoment = windMoment + tensionMoment;

        const embedment = height * 0.1 + 0.6;

        const resultHtml = rp('Pole Load Calculation', [
            { l: 'Wind Load', v: windLoad.toFixed(1), u: 'N' },
            { l: 'Wind Moment', v: (windMoment / 1000).toFixed(1), u: 'kN·m' },
            { l: 'Tension Moment', v: (tensionMoment / 1000).toFixed(1), u: 'kN·m' },
            { l: 'Total Moment', v: (totalMoment / 1000).toFixed(1), u: 'kN·m' },
            { l: 'Embedment Depth', v: embedment.toFixed(1), u: 'm' }
        ]);

        document.getElementById('poleCalcResult').innerHTML = resultHtml;
        App.saveToHistory('Pole Load', `H:${height}m V:${windSpeed}m/s`, `${(totalMoment / 1000).toFixed(1)} kN·m`);
    }
};