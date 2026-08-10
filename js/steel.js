/* ============================================
   STEEL MODULE
   Structural section reference data and
   weight / rebar quantity calculator.
   ============================================ */

const Steel = {

    data: {
        ibeam: {
            title: 'I-Beams (ISMB / W-Shapes)',
            desc: 'Hot-rolled structural I-sections for beams and columns',
            specs: [
                { label: 'Standard', value: 'IS 808 / AISC', unit: '', note: 'Regional equivalents vary' },
                { label: 'Yield Strength', value: '250 - 350', unit: 'MPa', note: 'Grade dependent' },
                { label: 'Depth Range', value: '100 - 600', unit: 'mm', note: 'ISMB100 to ISMB600' },
                { label: 'Typical Use', value: 'Beams, columns', unit: '', note: 'Primary structural framing' }
            ],
            columns: ['Section', 'Depth (mm)', 'Width (mm)', 'Web (mm)', 'Weight (kg/m)'],
            rows: [
                ['ISMB150', 150, 80, 4.8, 14.9],
                ['ISMB200', 200, 100, 5.7, 25.4],
                ['ISMB250', 250, 125, 6.9, 37.3],
                ['ISMB300', 300, 140, 7.5, 44.2],
                ['ISMB400', 400, 140, 8.9, 61.6]
            ]
        },
        channel: {
            title: 'Channels (ISMC)',
            desc: 'C-shaped structural sections for purlins and light framing',
            specs: [
                { label: 'Standard', value: 'IS 808', unit: '', note: 'Indian standard channel' },
                { label: 'Yield Strength', value: '250', unit: 'MPa', note: 'Standard grade' },
                { label: 'Depth Range', value: '75 - 400', unit: 'mm', note: 'ISMC75 to ISMC400' },
                { label: 'Typical Use', value: 'Purlins, bracing', unit: '', note: 'Secondary framing' }
            ],
            columns: ['Section', 'Depth (mm)', 'Width (mm)', 'Web (mm)', 'Weight (kg/m)'],
            rows: [
                ['ISMC100', 100, 50, 4.7, 9.6],
                ['ISMC150', 150, 75, 5.7, 16.4],
                ['ISMC200', 200, 75, 6.2, 22.3],
                ['ISMC250', 250, 80, 7.2, 30.4]
            ]
        },
        rebar: {
            title: 'Reinforcement Bar (Rebar)',
            desc: 'Deformed steel bars for reinforced concrete',
            specs: [
                { label: 'Grade', value: 'Fe415 / Fe500', unit: '', note: 'Yield strength grade' },
                { label: 'Diameter Range', value: '6 - 32', unit: 'mm', note: 'Common sizes' },
                { label: 'Density', value: '7850', unit: 'kg/m³', note: 'Standard steel density' },
                { label: 'Elongation', value: '14.5+', unit: '%', note: 'Fe415 minimum' }
            ],
            columns: ['Diameter (mm)', 'Weight (kg/m)', 'Cross Section (mm²)', 'Typical Use'],
            rows: [
                [8, 0.395, 50.3, 'Stirrups, ties'],
                [10, 0.617, 78.5, 'Slab reinforcement'],
                [12, 0.888, 113.1, 'Slab / beam reinforcement'],
                [16, 1.578, 201.1, 'Beam / column main bars'],
                [20, 2.466, 314.2, 'Column main bars'],
                [25, 3.853, 490.9, 'Heavy column / foundation']
            ]
        },
        pipe: {
            title: 'Structural Steel Pipe',
            desc: 'Hollow circular sections for columns and light poles',
            specs: [
                { label: 'Standard', value: 'ASTM A53 / EN 10219', unit: '', note: 'Regional equivalents vary' },
                { label: 'Yield Strength', value: '235 - 355', unit: 'MPa', note: 'Grade dependent' },
                { label: 'Diameter Range', value: '20 - 500', unit: 'mm', note: 'Nominal bore' },
                { label: 'Typical Use', value: 'Columns, railings', unit: '', note: 'Also used for poles' }
            ],
            columns: ['NB (mm)', 'OD (mm)', 'Wall (mm)', 'Weight (kg/m)'],
            rows: [
                [50, 60.3, 3.2, 4.5],
                [100, 114.3, 4.0, 10.9],
                [150, 168.3, 4.5, 18.2],
                [200, 219.1, 6.0, 31.5]
            ]
        }
    },

    /* kg per m3 for weight-from-volume calculations */
    density: 7850,

    showCategory: function (category) {
        document.querySelectorAll('.steel-category-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === category);
        });

        const data = this.data[category];
        if (!data) return;

        document.getElementById('steelContentTitle').textContent = data.title;
        document.getElementById('steelContentDesc').textContent = data.desc;

        document.getElementById('steelSpecs').innerHTML = data.specs.map(spec => `
            <div class="steel-spec-card">
                <div class="steel-spec-label">${spec.label}</div>
                <div class="steel-spec-value">${spec.value} <span class="steel-spec-unit">${spec.unit}</span></div>
                <div class="steel-spec-note">${spec.note}</div>
            </div>
        `).join('');

        const thead = document.querySelector('#steelTable thead tr');
        thead.innerHTML = data.columns.map(col => `<th>${col}</th>`).join('');

        document.getElementById('steelTableBody').innerHTML = data.rows.map(row => `
            <tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>
        `).join('');
    },

    /** Weight of a rebar run: diameter (mm) determines kg/m via d²/162. */
    rebarWeightPerM: function (diameterMm) {
        return (diameterMm * diameterMm) / 162;
    },

    /** Total rebar weight for a given diameter, bar count and length. */
    calculate: function () {
        const diameter = res(document.getElementById('steelCalcDiameter').value);
        const length = res(document.getElementById('steelCalcLength').value);
        const count = res(document.getElementById('steelCalcCount').value) || 1;
        const wastagePct = res(document.getElementById('steelCalcWastage').value) || 3;

        if (!diameter || !length) {
            App.showToast('Please fill in all required fields', 'error');
            return;
        }

        const perM = this.rebarWeightPerM(diameter);
        const totalLength = length * count * (1 + wastagePct / 100);
        const totalWeight = perM * totalLength;

        const resultHtml = rp('Rebar Quantity Estimate', [
            { l: 'Weight per Meter', v: perM.toFixed(3), u: 'kg/m' },
            { l: 'Total Length', v: totalLength.toFixed(1), u: 'm' },
            { l: 'Total Weight', v: totalWeight.toFixed(1), u: 'kg' },
            { l: 'Total Weight', v: (totalWeight / 1000).toFixed(3), u: 't' }
        ]);

        document.getElementById('steelCalcResult').innerHTML = resultHtml;
        App.saveToHistory('Steel Rebar', `Ø${diameter}mm x${count} x ${length}m`, `${totalWeight.toFixed(1)} kg`);
    }
};