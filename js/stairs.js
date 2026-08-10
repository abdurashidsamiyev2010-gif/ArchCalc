/* ============================================
   STAIRS MODULE
   Staircase design reference data and a
   rise/run/step-count calculator.
   ============================================ */

const Stairs = {

    data: {
        residential: {
            title: 'Residential Straight Stair',
            desc: 'Standard internal staircase for houses and apartments',
            specs: [
                { label: 'Riser Height', value: '150 - 190', unit: 'mm', note: 'Comfort range' },
                { label: 'Tread Depth', value: '250 - 300', unit: 'mm', note: 'Comfort range' },
                { label: 'Min Headroom', value: '2.0', unit: 'm', note: 'Clear vertical height' },
                { label: 'Min Width', value: '900', unit: 'mm', note: 'Building code minimum' }
            ],
            columns: ['Floor to Floor (mm)', 'Steps', 'Riser (mm)', 'Tread (mm)', 'Total Run (mm)'],
            rows: [
                [2700, 16, 168.75, 275, 4125],
                [3000, 17, 176.5, 270, 4320],
                [3300, 19, 173.7, 270, 4860]
            ]
        },
        commercial: {
            title: 'Commercial / Public Stair',
            desc: 'Staircase for offices, schools and public buildings with stricter code requirements',
            specs: [
                { label: 'Riser Height', value: '150 - 175', unit: 'mm', note: 'Lower for public use' },
                { label: 'Tread Depth', value: '280 - 320', unit: 'mm', note: 'Wider for safety' },
                { label: 'Min Headroom', value: '2.1', unit: 'm', note: 'Clear vertical height' },
                { label: 'Min Width', value: '1200', unit: 'mm', note: 'Egress code minimum' }
            ],
            columns: ['Floor to Floor (mm)', 'Steps', 'Riser (mm)', 'Tread (mm)', 'Total Run (mm)'],
            rows: [
                [3000, 18, 166.7, 300, 5100],
                [3600, 21, 171.4, 300, 6000]
            ]
        },
        spiral: {
            title: 'Spiral Stair',
            desc: 'Compact circular staircase, often used where floor space is limited',
            specs: [
                { label: 'Riser Height', value: '180 - 240', unit: 'mm', note: 'Often steeper' },
                { label: 'Diameter', value: '1200 - 2000', unit: 'mm', note: 'Minimum for comfortable use' },
                { label: 'Min Headroom', value: '2.0', unit: 'm', note: 'Clear vertical height' },
                { label: 'Rotation', value: '270 - 450', unit: 'degrees', note: 'Per full flight' }
            ],
            columns: ['Floor to Floor (mm)', 'Steps', 'Riser (mm)', 'Diameter (mm)'],
            rows: [
                [2700, 14, 192.9, 1500],
                [3000, 15, 200.0, 1800]
            ]
        }
    },

    /* Comfort/code constraints used for validation */
    limits: {
        minRiser: 150, maxRiser: 200,
        minTread: 230, maxTread: 320
    },

    showCategory: function (category) {
        document.querySelectorAll('.stairs-category-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === category);
        });

        const data = this.data[category];
        if (!data) return;

        document.getElementById('stairsContentTitle').textContent = data.title;
        document.getElementById('stairsContentDesc').textContent = data.desc;

        document.getElementById('stairsSpecs').innerHTML = data.specs.map(spec => `
            <div class="stairs-spec-card">
                <div class="stairs-spec-label">${spec.label}</div>
                <div class="stairs-spec-value">${spec.value} <span class="stairs-spec-unit">${spec.unit}</span></div>
                <div class="stairs-spec-note">${spec.note}</div>
            </div>
        `).join('');

        const thead = document.querySelector('#stairsTable thead tr');
        thead.innerHTML = data.columns.map(col => `<th>${col}</th>`).join('');

        document.getElementById('stairsTableBody').innerHTML = data.rows.map(row => `
            <tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>
        `).join('');
    },

    /**
     * Given a floor-to-floor height and a target riser height, compute
     * the actual number of steps (rounded) and the resulting exact
     * riser height so the flight divides evenly.
     */
    calculate: function () {
        const floorToFloor = res(document.getElementById('stairsCalcHeight').value);
        const targetRiser = res(document.getElementById('stairsCalcRiser').value) || 175;
        const treadDepth = res(document.getElementById('stairsCalcTread').value) || 280;

        if (!floorToFloor) {
            App.showToast('Please fill in all required fields', 'error');
            return;
        }

        const steps = Math.round(floorToFloor / targetRiser);
        const actualRiser = floorToFloor / steps;
        const totalRun = (steps - 1) * treadDepth; // one fewer tread than risers

        // Comfort formula check: 2*riser + tread should be 600-640mm
        const comfortValue = (2 * actualRiser) + treadDepth;
        const withinComfort = comfortValue >= 600 && comfortValue <= 640;

        const resultHtml = rp('Staircase Layout', [
            { l: 'Number of Steps', v: steps, u: 'risers' },
            { l: 'Actual Riser Height', v: actualRiser.toFixed(1), u: 'mm' },
            { l: 'Tread Depth', v: treadDepth, u: 'mm' },
            { l: 'Total Run', v: (totalRun / 1000).toFixed(2), u: 'm' },
            { l: 'Comfort Check (2R+T)', v: comfortValue.toFixed(0) + (withinComfort ? ' ✓' : ' ⚠'), u: 'mm' }
        ]);

        document.getElementById('stairsCalcResult').innerHTML = resultHtml;

        if (!withinComfort) {
            App.showToast('Riser/tread combination is outside the comfortable 600-640mm rule (2R+T)', 'warning');
        }

        App.saveToHistory('Staircase', `${floorToFloor}mm height`, `${steps} steps @ ${actualRiser.toFixed(0)}mm`);
    }
};