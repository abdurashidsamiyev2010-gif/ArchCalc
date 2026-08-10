/* ============================================
   CONCRETE MODULE
   Grade reference data, nominal mix ratios,
   and volume / material quantity calculator.
   ============================================ */

const Concrete = {

    data: {
        m15: {
            title: 'M15 (1:2:4)',
            desc: 'Low strength concrete for leveling and mass concrete work',
            specs: [
                { label: 'Compressive Strength', value: '15', unit: 'MPa', note: '28-day strength' },
                { label: 'Mix Ratio', value: '1 : 2 : 4', unit: '', note: 'Cement : Sand : Aggregate' },
                { label: 'Water-Cement Ratio', value: '0.5', unit: '', note: 'Approximate' },
                { label: 'Typical Use', value: 'PCC, leveling', unit: '', note: 'Non-structural' }
            ],
            columns: ['Element', 'Min Thickness (mm)', 'Curing (days)', 'Typical Slump (mm)'],
            rows: [
                ['Blinding / PCC', 75, 7, 25],
                ['Pathways', 100, 7, 25]
            ]
        },
        m20: {
            title: 'M20 (1:1.5:3)',
            desc: 'General purpose structural concrete',
            specs: [
                { label: 'Compressive Strength', value: '20', unit: 'MPa', note: '28-day strength' },
                { label: 'Mix Ratio', value: '1 : 1.5 : 3', unit: '', note: 'Cement : Sand : Aggregate' },
                { label: 'Water-Cement Ratio', value: '0.5', unit: '', note: 'Approximate' },
                { label: 'Typical Use', value: 'Slabs, footings', unit: '', note: 'Residential structural' }
            ],
            columns: ['Element', 'Min Thickness (mm)', 'Curing (days)', 'Typical Slump (mm)'],
            rows: [
                ['Slab', 125, 14, 75],
                ['Footing', 300, 14, 50],
                ['Column', 230, 21, 75]
            ]
        },
        m25: {
            title: 'M25 (1:1:2)',
            desc: 'Higher strength structural concrete',
            specs: [
                { label: 'Compressive Strength', value: '25', unit: 'MPa', note: '28-day strength' },
                { label: 'Mix Ratio', value: '1 : 1 : 2', unit: '', note: 'Cement : Sand : Aggregate' },
                { label: 'Water-Cement Ratio', value: '0.45', unit: '', note: 'Approximate' },
                { label: 'Typical Use', value: 'Beams, columns', unit: '', note: 'Multi-storey structural' }
            ],
            columns: ['Element', 'Min Thickness (mm)', 'Curing (days)', 'Typical Slump (mm)'],
            rows: [
                ['Beam', 230, 21, 75],
                ['Column', 300, 21, 75],
                ['Suspended Slab', 150, 14, 75]
            ]
        },
        m30: {
            title: 'M30 (Design Mix)',
            desc: 'Design mix concrete for demanding structural applications',
            specs: [
                { label: 'Compressive Strength', value: '30', unit: 'MPa', note: '28-day strength' },
                { label: 'Mix Ratio', value: 'Design mix', unit: '', note: 'Lab-proportioned' },
                { label: 'Water-Cement Ratio', value: '0.4', unit: '', note: 'Approximate' },
                { label: 'Typical Use', value: 'High-rise, bridges', unit: '', note: 'Requires QC testing' }
            ],
            columns: ['Element', 'Min Thickness (mm)', 'Curing (days)', 'Typical Slump (mm)'],
            rows: [
                ['Column', 300, 28, 100],
                ['Transfer Beam', 450, 28, 100],
                ['Raft Foundation', 600, 28, 75]
            ]
        }
    },

    dryVolumeFactor: 1.54,
    density: { cement: 1440, sand: 1600, aggregate: 1550 },
    bagMass: 50,

    showCategory: function (category) {
        document.querySelectorAll('.concrete-category-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === category);
        });

        const data = this.data[category];
        if (!data) return;

        document.getElementById('concreteContentTitle').textContent = data.title;
        document.getElementById('concreteContentDesc').textContent = data.desc;

        document.getElementById('concreteSpecs').innerHTML = data.specs.map(spec => `
            <div class="concrete-spec-card">
                <div class="concrete-spec-label">${spec.label}</div>
                <div class="concrete-spec-value">${spec.value} <span class="concrete-spec-unit">${spec.unit}</span></div>
                <div class="concrete-spec-note">${spec.note}</div>
            </div>
        `).join('');

        const thead = document.querySelector('#concreteTable thead tr');
        thead.innerHTML = data.columns.map(col => `<th>${col}</th>`).join('');

        document.getElementById('concreteTableBody').innerHTML = data.rows.map(row => `
            <tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>
        `).join('');
    },

    materialsFor: function (wetVolume, ratioString) {
        const parts = ratioString.split(':').map(n => parseFloat(n) || 0);
        const sum = parts.reduce((a, b) => a + b, 0);
        const dryVolume = wetVolume * this.dryVolumeFactor;

        const cementVol = (parts[0] / sum) * dryVolume;
        const sandVol = (parts[1] / sum) * dryVolume;
        const aggVol = (parts[2] / sum) * dryVolume;

        const cementWeight = cementVol * this.density.cement;
        const bags = cementWeight / this.bagMass;

        return {
            cementVol, sandVol, aggVol,
            cementWeight,
            sandWeight: sandVol * this.density.sand,
            aggWeight: aggVol * this.density.aggregate,
            bags
        };
    },

    calculate: function () {
        const length = res(document.getElementById('concreteCalcLength').value);
        const width = res(document.getElementById('concreteCalcWidth').value);
        const thickness = res(document.getElementById('concreteCalcThickness').value);
        const ratio = document.getElementById('concreteCalcRatio').value || '1:2:4';
        const wastagePct = res(document.getElementById('concreteCalcWastage').value) || 5;

        if (!length || !width || !thickness) {
            App.showToast('Please fill in all required fields', 'error');
            return;
        }

        const wetVolume = length * width * thickness * (1 + wastagePct / 100);
        const m = this.materialsFor(wetVolume, ratio);

        const resultHtml = rp('Concrete Quantity Estimate', [
            { l: 'Wet Volume', v: wetVolume.toFixed(dec), u: 'm³' },
            { l: 'Cement', v: m.bags.toFixed(1), u: 'bags' },
            { l: 'Cement Weight', v: (m.cementWeight / 1000).toFixed(2), u: 't' },
            { l: 'Sand', v: m.sandVol.toFixed(2), u: 'm³' },
            { l: 'Aggregate', v: m.aggVol.toFixed(2), u: 'm³' }
        ]);

        document.getElementById('concreteCalcResult').innerHTML = resultHtml;
        App.saveToHistory('Concrete Volume', `${length}x${width}x${thickness}m (${ratio})`, `${wetVolume.toFixed(2)} m³ / ${m.bags.toFixed(0)} bags`);
    }
};