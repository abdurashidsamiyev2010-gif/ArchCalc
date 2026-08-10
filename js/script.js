/* ============================================
   CORE APPLICATION SCRIPT
   Shared utilities used by every calculator
   module (pole-book, concrete, brick, steel,
   foundation, roof, stairs, calculator).
   ============================================ */

/* ============================================
   SAFE STORAGE
   Wraps localStorage so the app keeps working
   even when localStorage is unavailable/blocked
   (private mode, sandboxed iframe, etc). Falls
   back to an in-memory object — settings and
   history simply won't survive a page reload.
   ============================================ */
const Storage = (function () {
    let available = false;
    try {
        const testKey = '__ac_test__';
        window.localStorage.setItem(testKey, '1');
        window.localStorage.removeItem(testKey);
        available = true;
    } catch (e) {
        available = false;
        console.warn('localStorage is not available — falling back to in-memory storage. Settings and history will not persist across reloads.');
    }

    const memory = {};

    return {
        isAvailable: available,
        getItem: function (key) {
            if (available) {
                try { return window.localStorage.getItem(key); }
                catch (e) { return memory.hasOwnProperty(key) ? memory[key] : null; }
            }
            return memory.hasOwnProperty(key) ? memory[key] : null;
        },
        setItem: function (key, value) {
            if (available) {
                try { window.localStorage.setItem(key, value); return; }
                catch (e) { /* fall through to memory */ }
            }
            memory[key] = value;
        },
        removeItem: function (key) {
            if (available) {
                try { window.localStorage.removeItem(key); return; }
                catch (e) { /* fall through to memory */ }
            }
            delete memory[key];
        }
    };
})();

/* Global settings (persisted via Storage) */
let lang = 'en';
let theme = 'light';
let dec = 2;          // decimal places used by result formatting
let unit = 'metric';  // 'metric' | 'imperial'
let hist = [];         // calculation history: {feature, params, result, time}

const App = {
    showToast: function (message, type) {
        toast(message, type);
    },

    saveToHistory: function (feature, params, result) {
        sav(feature, params, result);
    },

navigate: function (page) {
    go(page);
},

    init: function () {
        const savedLang = Storage.getItem('ac-lang') || 'en';
        const savedTheme = Storage.getItem('ac-theme') || 'light';
        const savedDec = Storage.getItem('ac-dec') || '2';
        const savedUnit = Storage.getItem('ac-unit') || 'metric';

        try {
            hist = JSON.parse(Storage.getItem('ac-hist')) || [];
        } catch (e) {
            hist = [];
        }

        setLang(savedLang);
        setTheme(savedTheme);
        setDec(savedDec);
        setUnit(savedUnit);
        renH();
        upSt();
        go('dashboard', false);
    }
};

function toast(message, type) {
    type = type || 'info';
    const container = document.getElementById('toastContainer') || (function () {
        const c = document.createElement('div');
        c.id = 'toastContainer';
        c.className = 'toast-container';
        document.body.appendChild(c);
        return c;
    })();

    const el = document.createElement('div');
    el.className = 'toast toast-' + type;
    el.textContent = message;
    container.appendChild(el);

    requestAnimationFrame(() => el.classList.add('show'));

    setTimeout(() => {
        el.classList.remove('show');
        setTimeout(() => el.remove(), 300);
    }, 3000);
}

function res(v) {
    const n = parseFloat(v);
    return isNaN(n) ? 0 : n;
}

function rp(title, items) {
    const rows = items.map(item => `
        <div class="result-item">
            <div class="result-label">${item.l}</div>
            <div class="result-value">${item.v} <span class="result-unit">${item.u}</span></div>
        </div>
    `).join('');

    return `
        <div class="result-panel" style="margin-top: var(--space-6);">
            <div class="result-title">${title}</div>
            <div class="result-grid">${rows}</div>
        </div>
    `;
}

function sav(feature, params, result) {
    hist.unshift({
        feature: feature,
        params: params,
        result: result,
        time: new Date().toISOString()
    });

    if (hist.length > 200) hist = hist.slice(0, 200);

    try {
        Storage.setItem('ac-hist', JSON.stringify(hist));
    } catch (e) {
        console.warn('Could not persist history:', e);
    }

    renH();
    upSt();
    toast(feature + ' saved to history', 'success');
}

function renH() {
    const list = document.getElementById('historyList');
    if (!list) return;

    if (hist.length === 0) {
        list.innerHTML = '<div class="empty-state">No calculations yet</div>';
        return;
    }

    list.innerHTML = hist.map((h, i) => `
        <div class="history-item" data-index="${i}">
            <div class="history-feature">${h.feature}</div>
            <div class="history-params">${h.params}</div>
            <div class="history-result">${h.result}</div>
            <div class="history-time">${new Date(h.time).toLocaleString()}</div>
        </div>
    `).join('');
}

function clearHistory() {
    hist = [];
    Storage.removeItem('ac-hist');
    renH();
    upSt();
    toast('History cleared', 'info');
}

function upSt() {
    const countEl = document.getElementById('statCalcCount');
    if (countEl) countEl.textContent = hist.length;

    const lastEl = document.getElementById('statLastCalc');
    if (lastEl) lastEl.textContent = hist.length ? hist[0].feature : '—';
}

function setLang(l) {
    lang = l;
    Storage.setItem('ac-lang', l);
    document.documentElement.setAttribute('lang', l);
    document.querySelectorAll('[data-lang-btn]').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.langBtn === l);
    });
}

function setTheme(t) {
    theme = t;
    Storage.setItem('ac-theme', t);
    document.documentElement.setAttribute('data-theme', t);
    document.querySelectorAll('[data-theme-btn]').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.themeBtn === t);
    });
}

function setDec(d) {
    dec = parseInt(d, 10) || 2;
    Storage.setItem('ac-dec', String(dec));
}

function setUnit(u) {
    unit = u;
    Storage.setItem('ac-unit', u);
    document.querySelectorAll('[data-unit-btn]').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.unitBtn === u);
    });
}

function go(page, pushHistory) {
    if (pushHistory === undefined) pushHistory = true;

    document.querySelectorAll('[data-page]').forEach(el => {
        el.classList.toggle('active', el.dataset.page === page);
    });
    document.querySelectorAll('[data-goto]').forEach(el => {
        el.classList.toggle('active', el.dataset.goto === page);
    });

    if (pushHistory && window.history && window.history.pushState) {
        window.history.pushState({ page: page }, '', '#' + page);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    App.init();

    document.querySelectorAll('[data-goto]').forEach(el => {
        el.addEventListener('click', () => go(el.dataset.goto));
    });
    document.querySelectorAll('[data-lang-btn]').forEach(el => {
        el.addEventListener('click', () => setLang(el.dataset.langBtn));
    });
    document.querySelectorAll('[data-theme-btn]').forEach(el => {
        el.addEventListener('click', () => setTheme(el.dataset.themeBtn));
    });
    document.querySelectorAll('[data-unit-btn]').forEach(el => {
        el.addEventListener('click', () => setUnit(el.dataset.unitBtn));
    });

    const clearBtn = document.getElementById('clearHistoryBtn');
    if (clearBtn) clearBtn.addEventListener('click', clearHistory);
});

window.addEventListener('popstate', (e) => {
    if (e.state && e.state.page) go(e.state.page, false);
});