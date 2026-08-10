/* ============================================
   ROOF MODULE
   Roofing material reference data and a
   pitched-roof area / material calculator.
   ============================================ */

const Roof = {

    data: {
        metal_sheet: {
            title: 'Metal Roofing Sheet',
            desc: 'Corrugated or trapezoidal galvanized/coated steel sheeting',
            specs: [
                { label: 'Thickness', value: '0.4 - 0.7', unit: 'mm', note: 'Gauge dependent' },
                { label: 'Coverage Width', value: '900 - 1050', unit: 'mm', note: 'Effective cover width' },
                { label: 'Min Pitch', value: '5', unit: 'degrees', note: 'For adequate drainage' },
                { label: 'Lifespan', value: '25 - 40', unit: 'years', note: 'With proper coating' }
            ],
            columns: ['Sheet Length (m)', 'Coverage (m²)', 'Weight (kg/m²)', 'Fixings / m²'],
            rows: [
                [2.4, 2.28, 4.5, 6],
                [3.0, 2.85, 4.5, 6],
                [3.6, 3.42, 4.5, 6]
            ]
        },
        clay_tile: {
            title: 'Clay Roof Tile',
            desc: 'Traditional fired clay tiles for pitched roofs',
            specs: [
                { label: 'Size', value: '420 x 330', unit: 'mm', note: 'Interlocking tile' },
                { label: 'Weight', value: '40 - 45', unit: 'kg/m²', note: 'Including battens' },
                { label: 'Min Pitch', value: '17.5', unit: 'degrees', note: 'Manufacturer dependent' },
                { label: 'Lifespan', value: '50 - 100', unit: 'years', note: 'Very durable' }
            ],
            columns: ['Pitch (deg)', 'Tiles / m²', 'Batten Gauge (mm)', 'Headlap (mm)'],
            rows: [
                [20, 10.5, 345, 75],
                [30, 10.0, 350, 75],
                [45, 9.5, 355, 75]
            ]
        },
        concrete_tile: {
            title: 'Concrete Roof Tile',
            desc: 'Cast concrete interlocking tiles, heavier and more economical than clay',
            specs: [
                { label: 'Size', value: '420 x 330', unit: 'mm', note: 'Interlocking tile' },
                { label: 'Weight', value: '45 - 50', unit: 'kg/m²', note: 'Including battens' },
                { label: 'Min Pitch', value: '17.5', unit: 'degrees', note: 'Manufacturer dependent' },
                { label: 'Lifespan', value: '30 - 50', unit: 'years', note: 'Requires periodic sealing' }
            ],
            columns: ['Pitch (deg)', 'Tiles / m²', 'Batten Gauge (mm)', 'Headlap (mm)'],
            rows: [
                [20, 10.5, 345, 75],
                [30, 10.0, 350, 75]
            ]
        },
        membrane: {
            title: 'Membrane / Flat Roofing',
            desc: 'Bituminous or single-ply membrane for low-slope and flat roofs',
            specs: [
                { label: 'Thickness', value: '1.2 - 2.0', unit: 'mm', note: 'Single-ply membrane' },
                { label: 'Min Pitch', value: '1 - 2', unit: 'degrees', note: 'For drainage' },
                { label: 'Lifespan', value: '15 - 25', unit: 'years', note: 'System dependent' },
                { label: 'Typical Use', value: 'Flat roofs, terraces', unit: '', note: 'Requires good waterproofing detail' }
            ],
            columns: ['Roll Width (m)', 'Roll Length (m)', 'Coverage (m²)', 'Overlap (mm)'],
            rows: [
                [1.0, 15, 14.4, 100],
                [2.0, 20, 38.0, 100]
            ]
        }
    },

    showCategory: function (category) {
        document.querySelectorAll('.roof-category-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === category);
        });

        const data = this.data[category];
        if (!data) return;

        document.getElementById('roofContentTitle').textContent = data.title;
        document.getElementById('roofContentDesc').textContent = data.desc;

        document.getElementById('roofSpecs').innerHTML = data.specs.map(spec => `
            <div class="roof-spec-card">
                <div class="roof-spec-label">${spec.label}</div>
                <div class="roof-spec-value">${spec.value} <span class="roof-spec-unit">${spec.unit}</span></div>
                <div class="roof-spec-note">${spec.note}</div>
            </div>
        `).join('');

        const thead = document.querySelector('#roofTable thead tr');
        thead.innerHTML = data.columns.map(col => `<th>${col}</th>`).join('');

        document.getElementById('roofTableBody').innerHTML = data.rows.map(row => `
            <tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>
        `).join('');
    },

    /**
     * Sloped roof area = footprint area / cos(pitch).
     * pitchDeg is the roof pitch measured from horizontal.
     */
    slopedArea: function (footprintArea, pitchDeg) {
        const rad = pitchDeg * (Math.PI / 180);
        return footprintArea / Math.cos(rad);
    },

    calculate: function () {
        const length = res(document.getElementById('roofCalcLength').value);
        const width = res(document.getElementById('roofCalcWidth').value);
        const pitch = res(document.getElementById('roofCalcPitch').value);
        const coveragePerUnit = res(document.getElementById('roofCalcCoverage').value) || 1;
        const wastagePct = res(document.getElementById('roofCalcWastage').value) || 10;

        if (!length || !width) {
            App.showToast('Please fill in all required fields', 'error');
            return;
        }

        const footprint = length * width;
        const slopeArea = this.slopedArea(footprint, pitch);
        const areaWithWastage = slopeArea * (1 + wastagePct / 100);
        const unitsNeeded = areaWithWastage / coveragePerUnit;

        const resultHtml = rp('Roof Material Estimate', [
            { l: 'Footprint Area', v: footprint.toFixed(dec), u: 'm²' },
            { l: 'Sloped Roof Area', v: slopeArea.toFixed(dec), u: 'm²' },
            { l: 'With Wastage', v: areaWithWastage.toFixed(dec), u: 'm²' },
            { l: 'Units Needed', v: Math.ceil(unitsNeeded), u: 'pcs/sheets' }
        ]);

        document.getElementById('roofCalcResult').innerHTML = resultHtml;
        App.saveToHistory('Roof Area', `${length}x${width}m @ ${pitch}°`, `${slopeArea.toFixed(1)} m²`);
    }
};