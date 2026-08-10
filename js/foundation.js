/* ============================================
   FOUNDATION MODULE
   Foundation type reference data and an
   isolated-footing sizing calculator.
   ============================================ */

const Foundation = {

    data: {
        isolated: {
            title: 'Isolated (Pad) Footing',
            desc: 'Individual footing supporting a single column — most common for low-rise buildings',
            specs: [
                { label: 'Typical Depth', value: '1.0 - 1.8', unit: 'm', note: 'Below ground level' },
                { label: 'Bearing Capacity Req.', value: '100+', unit: 'kN/m²', note: 'Soil dependent' },
                { label: 'Typical Use', value: 'Low-rise, isolated columns', unit: '', note: 'Cost-effective' },
                { label: 'Concrete Grade', value: 'M20 - M25', unit: '', note: 'Structural grade' }
            ],
            columns: ['Column Load (kN)', 'Footing Size (m x m)', 'Depth (mm)', 'Main Rebar'],
            rows: [
                [300, '1.2 x 1.2', 300, '10mm @ 150c/c'],
                [500, '1.5 x 1.5', 350, '12mm @ 150c/c'],
                [800, '1.8 x 1.8', 400, '12mm @ 125c/c'],
                [1200, '2.2 x 2.2', 450, '16mm @ 150c/c']
            ]
        },
        combined: {
            title: 'Combined Footing',
            desc: 'Single footing supporting two or more closely spaced columns',
            specs: [
                { label: 'Typical Depth', value: '1.2 - 2.0', unit: 'm', note: 'Below ground level' },
                { label: 'Bearing Capacity Req.', value: '100+', unit: 'kN/m²', note: 'Soil dependent' },
                { label: 'Typical Use', value: 'Adjacent columns, property line', unit: '', note: 'Avoids overlap' },
                { label: 'Concrete Grade', value: 'M25', unit: '', note: 'Structural grade' }
            ],
            columns: ['Combined Load (kN)', 'Footing Size (m x m)', 'Depth (mm)', 'Notes'],
            rows: [
                [800, '3.0 x 1.5', 400, 'Two columns'],
                [1500, '4.5 x 1.8', 500, 'Two columns, heavy load']
            ]
        },
        raft: {
            title: 'Raft (Mat) Foundation',
            desc: 'Single continuous slab covering the entire building footprint',
            specs: [
                { label: 'Typical Depth', value: '0.6 - 1.5', unit: 'm', note: 'Slab thickness' },
                { label: 'Bearing Capacity Req.', value: '< 100', unit: 'kN/m²', note: 'Suits weak soils' },
                { label: 'Typical Use', value: 'High-rise, weak/soft soil', unit: '', note: 'Distributes load widely' },
                { label: 'Concrete Grade', value: 'M30+', unit: '', note: 'Often design mix' }
            ],
            columns: ['Building Height', 'Raft Thickness (mm)', 'Reinforcement', 'Notes'],
            rows: [
                ['Up to 4 storeys', 450, '16mm @ 150c/c both ways', 'Two-way mat'],
                ['5-10 storeys', 600, '20mm @ 150c/c both ways', 'Two-way mat, top+bottom'],
                ['10+ storeys', 900, '25mm @ 125c/c both ways', 'Requires detailed design']
            ]
        },
        pile: {
            title: 'Pile Foundation',
            desc: 'Deep foundation transferring load to competent strata or via skin friction',
            specs: [
                { label: 'Typical Depth', value: '6 - 30+', unit: 'm', note: 'Soil/rock dependent' },
                { label: 'Bearing Capacity Req.', value: 'N/A', unit: '', note: 'Depends on pile type' },
                { label: 'Typical Use', value: 'High-rise, poor surface soil', unit: '', note: 'Bored or driven piles' },
                { label: 'Concrete Grade', value: 'M25 - M35', unit: '', note: 'Depends on pile type' }
            ],
            columns: ['Pile Diameter (mm)', 'Capacity (kN)', 'Typical Length (m)', 'Type'],
            rows: [
                [300, 400, 10, 'Bored cast-in-situ'],
                [450, 900, 15, 'Bored cast-in-situ'],
                [600, 1600, 20, 'Bored cast-in-situ']
            ]
        }
    },

    showCategory: function (category) {
        document.querySelectorAll('.foundation-category-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === category);
        });

        const data = this.data[category];
        if (!data) return;

        document.getElementById('foundationContentTitle').textContent = data.title;
        document.getElementById('foundationContentDesc').textContent = data.desc;

        document.getElementById('foundationSpecs').innerHTML = data.specs.map(spec => `
            <div class="foundation-spec-card">
                <div class="foundation-spec-label">${spec.label}</div>
                <div class="foundation-spec-value">${spec.value} <span class="foundation-spec-unit">${spec.unit}</span></div>
                <div class="foundation-spec-note">${spec.note}</div>
            </div>
        `).join('');

        const thead = document.querySelector('#foundationTable thead tr');
        thead.innerHTML = data.columns.map(col => `<th>${col}</th>`).join('');

        document.getElementById('foundationTableBody').innerHTML = data.rows.map(row => `
            <tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>
        `).join('');
    },

    /**
     * Simple square isolated footing sizing:
     * required area = factored load / allowable soil bearing capacity.
     * This is a preliminary estimate only — final sizing requires a
     * qualified structural/geotechnical engineer's review.
     */
    calculate: function () {
        const load = res(document.getElementById('foundationCalcLoad').value);
        const bearingCapacity = res(document.getElementById('foundationCalcBearing').value);
        const factorOfSafety = res(document.getElementById('foundationCalcFos').value) || 1.0;

        if (!load || !bearingCapacity) {
            App.showToast('Please fill in all required fields', 'error');
            return;
        }

        const factoredLoad = load * factorOfSafety;
        const requiredArea = factoredLoad / bearingCapacity;
        const side = Math.sqrt(requiredArea);
        const roundedSide = Math.ceil(side * 20) / 20;

        const resultHtml = rp('Isolated Footing Estimate', [
            { l: 'Required Area', v: requiredArea.toFixed(dec), u: 'm²' },
            { l: 'Square Footing Side', v: roundedSide.toFixed(2), u: 'm' },
            { l: 'Footing Size', v: `${roundedSide.toFixed(2)} x ${roundedSide.toFixed(2)}`, u: 'm' }
        ]);

        document.getElementById('foundationCalcResult').innerHTML = resultHtml;
        App.saveToHistory('Footing Size', `${load}kN @ ${bearingCapacity}kN/m²`, `${roundedSide.toFixed(2)}m sq.`);
    }
};