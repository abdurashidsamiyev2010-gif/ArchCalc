/* ============================================
   BRICK / MASONRY MODULE
   Brick type reference data and wall material
   quantity calculator (bricks + mortar).
   ============================================ */

const Brick = {

    data: {
        common: {
            title: 'Common Clay Brick',
            desc: 'Standard fired clay brick for general construction',
            specs: [
                { label: 'Size', value: '230 x 110 x 75', unit: 'mm', note: 'Modular standard' },
                { label: 'Compressive Strength', value: '3.5 - 10', unit: 'MPa', note: 'Class dependent' },
                { label: 'Water Absorption', value: '< 20', unit: '%', note: 'Per IS 1077' },
                { label: 'Weight', value: '2.9 - 3.2', unit: 'kg/unit', note: 'Approximate' }
            ],
            columns: ['Wall Thickness', 'Bricks / m²', 'Mortar / m² (m³)', 'Typical Use'],
            rows: [
                ['Half brick (115mm)', 65, 0.02, 'Partition wall'],
                ['One brick (230mm)', 128, 0.04, 'Load bearing wall'],
                ['One-and-half (345mm)', 192, 0.06, 'External load bearing']
            ]
        },
        engineering: {
            title: 'Engineering Brick',
            desc: 'High-strength, low-porosity brick for damp-proof courses and load-bearing work',
            specs: [
                { label: 'Size', value: '215 x 102.5 x 65', unit: 'mm', note: 'UK standard' },
                { label: 'Compressive Strength', value: '48.5 - 125', unit: 'MPa', note: 'Class A / B' },
                { label: 'Water Absorption', value: '< 4.5', unit: '%', note: 'Class A' },
                { label: 'Weight', value: '3.1 - 3.4', unit: 'kg/unit', note: 'Approximate' }
            ],
            columns: ['Wall Thickness', 'Bricks / m²', 'Mortar / m² (m³)', 'Typical Use'],
            rows: [
                ['Half brick (102.5mm)', 60, 0.02, 'DPC course'],
                ['One brick (215mm)', 120, 0.038, 'Retaining wall / manholes']
            ]
        },
        fly_ash: {
            title: 'Fly Ash Brick',
            desc: 'Eco-friendly brick made from fly ash, lime and gypsum',
            specs: [
                { label: 'Size', value: '230 x 110 x 75', unit: 'mm', note: 'Modular standard' },
                { label: 'Compressive Strength', value: '7.5 - 12', unit: 'MPa', note: 'Higher than common clay' },
                { label: 'Water Absorption', value: '< 12', unit: '%', note: 'Lower than clay brick' },
                { label: 'Weight', value: '2.8 - 3.0', unit: 'kg/unit', note: 'Approximate' }
            ],
            columns: ['Wall Thickness', 'Bricks / m²', 'Mortar / m² (m³)', 'Typical Use'],
            rows: [
                ['Half brick (115mm)', 65, 0.018, 'Partition wall'],
                ['One brick (230mm)', 128, 0.035, 'Load bearing wall']
            ]
        },
        aac_block: {
            title: 'AAC Block',
            desc: 'Autoclaved aerated concrete block — lightweight and thermally insulating',
            specs: [
                { label: 'Size', value: '600 x 200 x 100-200', unit: 'mm', note: 'Varies by manufacturer' },
                { label: 'Compressive Strength', value: '3 - 4.5', unit: 'MPa', note: 'Grade dependent' },
                { label: 'Density', value: '550 - 650', unit: 'kg/m³', note: 'Roughly 1/3 of clay brick' },
                { label: 'Thermal Conductivity', value: '0.16 - 0.18', unit: 'W/mK', note: 'Good insulation' }
            ],
            columns: ['Wall Thickness', 'Blocks / m²', 'Mortar / m² (m³)', 'Typical Use'],
            rows: [
                ['100mm', 8.3, 0.01, 'Partition wall'],
                ['200mm', 8.3, 0.015, 'External load bearing']
            ]
        }
    },

    /* Standard mortar mix ratios by application (cement : sand) */
    mortarRatios: {
        partition: '1:6',
        load_bearing: '1:4',
        dpc: '1:3'
    },

    showCategory: function (category) {
        document.querySelectorAll('.brick-category-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === category);
        });

        const data = this.data[category];
        if (!data) return;

        document.getElementById('brickContentTitle').textContent = data.title;
        document.getElementById('brickContentDesc').textContent = data.desc;

        document.getElementById('brickSpecs').innerHTML = data.specs.map(spec => `
            <div class="brick-spec-card">
                <div class="brick-spec-label">${spec.label}</div>
                <div class="brick-spec-value">${spec.value} <span class="brick-spec-unit">${spec.unit}</span></div>
                <div class="brick-spec-note">${spec.note}</div>
            </div>
        `).join('');

        const thead = document.querySelector('#brickTable thead tr');
        thead.innerHTML = data.columns.map(col => `<th>${col}</th>`).join('');

        document.getElementById('brickTableBody').innerHTML = data.rows.map(row => `
            <tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>
        `).join('');
    },

    /**
     * Estimate bricks and mortar needed for a wall.
     * @param {number} length  wall length (m)
     * @param {number} height  wall height (m)
     * @param {number} openingsArea total door/window area to subtract (m²)
     * @param {number} bricksPerM2
     * @param {number} mortarPerM2 (m³)
     * @param {number} wastagePct
     */
    estimate: function (length, height, openingsArea, bricksPerM2, mortarPerM2, wastagePct) {
        const grossArea = length * height;
        const netArea = Math.max(grossArea - openingsArea, 0);
        const factor = 1 + (wastagePct / 100);

        const bricks = netArea * bricksPerM2 * factor;
        const mortarVol = netArea * mortarPerM2 * factor;

        return { grossArea, netArea, bricks, mortarVol };
    },

    calculate: function () {
        const length = res(document.getElementById('brickCalcLength').value);
        const height = res(document.getElementById('brickCalcHeight').value);
        const openings = res(document.getElementById('brickCalcOpenings').value);
        const bricksPerM2 = res(document.getElementById('brickCalcDensity').value) || 128;
        const mortarPerM2 = res(document.getElementById('brickCalcMortar').value) || 0.04;
        const wastagePct = res(document.getElementById('brickCalcWastage').value) || 5;

        if (!length || !height) {
            App.showToast('Please fill in all required fields', 'error');
            return;
        }

        const r = this.estimate(length, height, openings, bricksPerM2, mortarPerM2, wastagePct);

        const resultHtml = rp('Brickwork Estimate', [
            { l: 'Net Wall Area', v: r.netArea.toFixed(dec), u: 'm²' },
            { l: 'Bricks Required', v: Math.ceil(r.bricks), u: 'units' },
            { l: 'Mortar Volume', v: r.mortarVol.toFixed(3), u: 'm³' }
        ]);

        document.getElementById('brickCalcResult').innerHTML = resultHtml;
        App.saveToHistory('Brick Wall', `${length}x${height}m, ${openings}m² openings`, `${Math.ceil(r.bricks)} bricks`);
    }
};