/* ============================================
   CALCULATOR MODULE
   General-purpose unit converters and quick
   construction math (length, area, volume,
   weight, angle, pressure).
   ============================================ */

const Calculator = {

    /* Conversion factors are expressed relative to
       the SI base unit for each quantity (value in
       base units per 1 of the given unit). */
    factors: {
        length: { m: 1, cm: 0.01, mm: 0.001, km: 1000, ft: 0.3048, in: 0.0254, yd: 0.9144, mi: 1609.344 },
        area: { m2: 1, cm2: 0.0001, mm2: 0.000001, km2: 1000000, ft2: 0.092903, in2: 0.00064516, ha: 10000, ac: 4046.86 },
        volume: { m3: 1, l: 0.001, cm3: 0.000001, ft3: 0.0283168, in3: 0.0000163871, gal: 0.00378541 },
        weight: { kg: 1, g: 0.001, t: 1000, lb: 0.453592, oz: 0.0283495 },
        angle: { deg: 1, rad: 57.29578, grad: 0.9 },
        pressure: { pa: 1, kpa: 1000, mpa: 1000000, bar: 100000, psi: 6894.76 }
    },

    convert: function (value, from, to, type) {
        const table = this.factors[type];
        if (!table || !table[from] || !table[to]) return 0;
        return value * table[from] / table[to];
    },

    run: function (valueId, fromId, toId, resultId, type) {
        const v = res(document.getElementById(valueId).value);
        const from = document.getElementById(fromId).value;
        const to = document.getElementById(toId).value;
        const out = this.convert(v, from, to, type);
        document.getElementById(resultId).value = out.toFixed(dec);
        return out;
    },

    percentOf: function (p, v) {
        return (p / 100) * v;
    },

    splitByRatio: function (total, ratioString) {
        const parts = ratioString.split(':').map(n => parseFloat(n) || 0);
        const sum = parts.reduce((a, b) => a + b, 0);
        if (sum === 0) return parts.map(() => 0);
        return parts.map(p => (p / sum) * total);
    },

    refreshAll: function () {
        ['length', 'area', 'volume', 'weight', 'angle', 'pressure'].forEach(type => {
            const valueId = 'c-' + type[0] + '-v';
            const fromId = 'c-' + type[0] + '-f';
            const toId = 'c-' + type[0] + '-t';
            const resultId = 'c-' + type[0] + '-r';
            if (document.getElementById(valueId)) {
                this.run(valueId, fromId, toId, resultId, type);
            }
        });
    }
};

function cLen() { Calculator.run('c-l-v', 'c-l-f', 'c-l-t', 'c-l-r', 'length'); }
function cArea() { Calculator.run('c-a-v', 'c-a-f', 'c-a-t', 'c-a-r', 'area'); }
function cVol() { Calculator.run('c-v-v', 'c-v-f', 'c-v-t', 'c-v-r', 'volume'); }
function cWgt() { Calculator.run('c-w-v', 'c-w-f', 'c-w-t', 'c-w-r', 'weight'); }
function cAng() { Calculator.run('c-g-v', 'c-g-f', 'c-g-t', 'c-g-r', 'angle'); }
function cPrs() { Calculator.run('c-p-v', 'c-p-f', 'c-p-t', 'c-p-r', 'pressure'); }

document.addEventListener('DOMContentLoaded', function () {
    if (document.getElementById('c-l-v')) Calculator.refreshAll();
});