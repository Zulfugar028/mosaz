/* ============================================================
   MOS — app.js  (düzəldilmiş versiyon)
   ============================================================ */

'use strict';

// ── Utilities ──────────────────────────────────────────────
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ============================================================
   1. CUSTOM CURSOR
   ============================================================ */
(function initCursor() {
    const cursor = $('#cursor');
    const ring = $('#cursor-ring');
    if (!cursor || !ring) return;

    if (window.matchMedia('(hover: none)').matches) {
        cursor.style.display = 'none';
        ring.style.display = 'none';
        return;
    }

    let mx = -100, my = -100;
    let cursorScale = 1;
    let ringScale = 1;

    function applyCursor() {
        cursor.style.transform = `translate3d(${mx - 6}px, ${my - 6}px, 0) scale(${cursorScale})`;
        ring.style.transform = `translate3d(${mx - 18}px, ${my - 18}px, 0) scale(${ringScale})`;
    }

    document.addEventListener('mousemove', e => {
        mx = e.clientX;
        my = e.clientY;
        applyCursor();
    });

    function attachHoverEffect(elements) {
        elements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorScale = 2;
                ringScale = 1.5;
                ring.style.borderColor = 'rgba(0,212,255,0.8)';
                applyCursor();
            });
            el.addEventListener('mouseleave', () => {
                cursorScale = 1;
                ringScale = 1;
                ring.style.borderColor = 'rgba(0,212,255,0.4)';
                applyCursor();
            });
        });
    }

    const hoverTargets = $$('a, button, .service-card, .nav-cta, .submit-btn');
    attachHoverEffect(hoverTargets);
})();


/* ============================================================
   2. RADAR SECTOR SWEEP
   ============================================================ */
(function initSectorSweep() {
    const sweepDuration = 6000;
    const sectors = [
        { id: 'sector-1', from: 0, to: 90 },
        { id: 'sector-2', from: 90, to: 180 },
        { id: 'sector-3', from: 180, to: 270 },
        { id: 'sector-4', from: 270, to: 360 },
    ];

    const sectorEls = sectors.map(s => ({
        el: document.getElementById(s.id),
        from: s.from,
        to: s.to,
    })).filter(s => s.el);

    let lastActive = -1;

    function tick() {
        const angle = (Date.now() % sweepDuration) / sweepDuration * 360;
        const activeIdx = sectorEls.findIndex(s => angle >= s.from && angle < s.to - 10);

        if (activeIdx !== lastActive) {
            sectorEls.forEach((s, i) => s.el.classList.toggle('active', i === activeIdx));
            lastActive = activeIdx;
        }

        requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
})();


/* ============================================================
   3. INTERSECTION OBSERVER
   ============================================================ */
(function initScrollReveal() {
    const selector = '.service-card, .video-section, .contact-section';

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.1 });

    $$(selector).forEach(el => {
        el.classList.add('will-reveal');
        observer.observe(el);
    });
})();


/* ============================================================
   4. SERVICES DATA
   ============================================================ */
function getServices() {
    return [
        {
            num: '01',
            title: gettext('Perimeter Protection'),
            desc: gettext('Advanced sensor networks and smart barriers secure your perimeter against unauthorized access around the clock. Our layered approach combines radar, ground sensors, and AI-driven alerting.'),
            image: '/static/img/perimeter-protection.webp',
            icon: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                 <circle cx="24" cy="24" r="10" stroke="#00d4ff" stroke-width="1.5"/>
                 <circle cx="24" cy="24" r="20" stroke="#00d4ff" stroke-width="1" stroke-dasharray="3 3"/>
                 <line x1="24" y1="4" x2="24" y2="14" stroke="#00d4ff" stroke-width="1.5"/>
                 <line x1="24" y1="34" x2="24" y2="44" stroke="#00d4ff" stroke-width="1.5"/>
                 <line x1="4" y1="24" x2="14" y2="24" stroke="#00d4ff" stroke-width="1.5"/>
                 <line x1="34" y1="24" x2="44" y2="24" stroke="#00d4ff" stroke-width="1.5"/>
                 <circle cx="24" cy="24" r="3" fill="#00d4ff"/>
               </svg>`,
            features: [
                gettext('Ground vibration sensors'),
                gettext('Radar & lidar perimeter scan'),
                gettext('Smart barrier integration'),
                gettext('Instant breach alerting')
            ],
            tag: gettext('PERIMETER · CASPIAN REGION'),
        },
        {
            num: '02',
            title: gettext('Access Control'),
            desc: gettext('Biometric and credential-based access management for restricted facilities, vessels, and critical zones. Full audit trails and remote revocation keep your access layer airtight.'),
            image: '/static/img/access-control.webp',
            icon: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                 <rect x="8" y="8" width="32" height="24" rx="2" stroke="#00d4ff" stroke-width="1.5"/>
                 <path d="M16 38h16M24 32v6" stroke="#00d4ff" stroke-width="1.5"/>
                 <circle cx="24" cy="20" r="5" stroke="#00d4ff" stroke-width="1.5"/>
               </svg>`,
            features: [
                gettext('Fingerprint & iris readers'),
                gettext('RFID / smart-card support'),
                gettext('Remote access revocation'),
                gettext('Full audit log & reporting')
            ],
            tag: gettext('ACCESS CONTROL · OFFSHORE'),
        },
        {
            num: '03',
            title: gettext('Fire & Hazard Detection'),
            desc: gettext('Multi-sensor early warning systems for fire, gas leaks, and environmental hazards on oil and marine platforms. Integrated suppression triggers minimize response time.'),
            image: '/static/img/fire-detection.webp',
            icon: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                 <path d="M24 4L4 16v16l20 12 20-12V16L24 4z" stroke="#00d4ff" stroke-width="1.5"/>
                 <path d="M24 16v16M14 22l10 10 10-10" stroke="#00d4ff" stroke-width="1.5"/>
               </svg>`,
            features: [
                gettext('Multi-gas leak detection'),
                gettext('Thermal & flame sensors'),
                gettext('Automated suppression trigger'),
                gettext('Platform-wide PA integration')
            ],
            tag: gettext('HAZARD DETECTION · OFFSHORE'),
        },
        {
            num: '04',
            title: gettext('AI Video Analytics'),
            desc: gettext('Machine learning-powered video analysis detects threats, tracks movement, and generates real-time alerts \u2014 before incidents escalate into emergencies.'),
            image: '/static/img/ai-video-analytics.webp',
            icon: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                 <path d="M8 36l8-16 8 8 8-20 8 12" stroke="#00d4ff" stroke-width="1.5" stroke-linecap="round"/>
                 <rect x="4" y="4" width="40" height="40" rx="2" stroke="#00d4ff" stroke-width="1.5" stroke-dasharray="4 2"/>
               </svg>`,
            features: [
                gettext('Real-time object detection'),
                gettext('Behavioural anomaly alerts'),
                gettext('License plate recognition'),
                gettext('Edge & cloud deployment')
            ],
            tag: gettext('AI ANALYTICS · REAL-TIME'),
        },
        {
            num: '05',
            title: gettext('24/7 Monitoring'),
            desc: gettext('Round-the-clock remote surveillance and rapid response coordination from our Baku operations centre. Every alert is triaged by trained analysts, not just automated rules.'),
            image: '/static/img/webcloud.png',
            icon: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                 <path d="M24 8C15.2 8 8 15.2 8 24s7.2 16 16 16 16-7.2 16-16S32.8 8 24 8z" stroke="#00d4ff" stroke-width="1.5"/>
                 <path d="M24 18v8l5 3" stroke="#00d4ff" stroke-width="1.5" stroke-linecap="round"/>
               </svg>`,
            features: [
                gettext('24 / 7 analyst coverage'),
                gettext('Sub-60s alert response SLA'),
                gettext('Baku operations centre'),
                gettext('Escalation & reporting')
            ],
            tag: gettext('24/7 MONITORING · BAKU OPS'),
        },
        {
            num: '06',
            title: gettext('Warehouse Security'),
            desc: gettext('Integrated physical and digital security solutions for oil storage, equipment depots, and marine logistics hubs. From CCTV to inventory tamper-detection.'),
            image: '/static/img/warehouse-security.webp',
            icon: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                 <rect x="6" y="20" width="36" height="24" rx="2" stroke="#00d4ff" stroke-width="1.5"/>
                 <path d="M16 20v-6a8 8 0 0116 0v6" stroke="#00d4ff" stroke-width="1.5"/>
                 <circle cx="24" cy="31" r="3" fill="#00d4ff"/>
                 <line x1="24" y1="34" x2="24" y2="38" stroke="#00d4ff" stroke-width="1.5"/>
               </svg>`,
            features: [
                gettext('CCTV & perimeter sensors'),
                gettext('Inventory tamper detection'),
                gettext('Visitor management'),
                gettext('Fire & flood safeguards')
            ],
            tag: gettext('WAREHOUSE · LOGISTICS'),
        },
    ];
}


/* ============================================================
   5. MODAL
   ============================================================ */
(function initModal() {
    const overlay = $('#modal-overlay');
    const modal = $('#modal');
    const modalNum = $('#modal-num');
    const modalTitle = $('#modal-title');
    const modalIcon = $('#modal-icon');
    const modalDesc = $('#modal-desc');
    const modalFeatures = $('#modal-features');
    const modalTag = $('#modal-tag');
    const closeBtn = $('#modal-close');

    if (!overlay || !modal) return;

    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'modal-title');

    const FOCUSABLE = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';
    let previousFocus = null;

    function trapFocus(e) {
        const focusable = $$(FOCUSABLE, modal);
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.key === 'Tab') {
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    }

    function openModal(service) {
        previousFocus = document.activeElement;

        modalNum.textContent = service.num;
        modalTitle.textContent = service.title;
        modalDesc.textContent = service.desc;
        modalTag.textContent = service.tag;

        modalIcon.innerHTML = service.icon;

        const imgWrap = document.getElementById('modal-image-wrap');
        const imgEl = document.getElementById('modal-image');
        if (imgEl) {
            if (service.image) {
                imgEl.src = service.image;
                imgEl.alt = service.title;
                imgEl.style.display = 'block';
                if (imgWrap) imgWrap.style.display = 'block';
            } else {
                imgEl.src = '';
                if (imgWrap) imgWrap.style.display = 'none';
            }
        }

        modalFeatures.innerHTML = '';
        const fragment = document.createDocumentFragment();
        service.features.forEach(f => {
            const div = document.createElement('div');
            div.className = 'modal-feature';
            div.textContent = f;
            fragment.appendChild(div);
        });
        modalFeatures.appendChild(fragment);

        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', handleKeydown);

        requestAnimationFrame(() => closeBtn && closeBtn.focus());
    }

    function closeModal() {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleKeydown);
        previousFocus && previousFocus.focus();
    }

    function handleKeydown(e) {
        if (e.key === 'Escape') { closeModal(); return; }
        trapFocus(e);
    }

    closeBtn && closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });

    $$('.service-card').forEach((card, idx) => {
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `${getServices()[idx]?.title ?? ''} haqqinda`);

        function trigger() {
            const service = getServices()[Number(card.dataset.service)];
            if (service) openModal(service);
        }

        card.addEventListener('click', trigger);
        card.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); trigger(); }
        });
    });
})();


/* ============================================================
   6. SMOOTH SCROLL
   ============================================================ */
(function initSmoothScroll() {
    $$('a[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
            const id = link.getAttribute('href').slice(1);
            const target = document.getElementById(id);
            if (!target) return;
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
})();


const sweepEl = document.querySelector('.radar-sweep');
const sweepFillEl = document.querySelector('.radar-sweep-fill');
const DURATION = 10000;

const sectors = {
    'sector-1': { start: 315, end: 45 },
    'sector-2': { start: 45, end: 135 },
    'sector-3': { start: 135, end: 225 },
    'sector-4': { start: 225, end: 315 },
};

function isAngleInSector(angle, start, end) {
    if (start > end) return angle >= start || angle < end;
    return angle >= start && angle < end;
}

let startTime = null;

function animate(timestamp) {
    if (!startTime) startTime = timestamp;

    const elapsed = (timestamp - startTime) % DURATION;
    const rawAngle = (elapsed / DURATION) * 360;
    const angle = (rawAngle + 90) % 360;

    sweepEl.style.transform = `rotate(${rawAngle}deg)`;
    if (sweepFillEl) {
        sweepFillEl.style.transform = `rotate(${rawAngle}deg)`;
    }

    for (const [id, range] of Object.entries(sectors)) {
        const el = document.getElementById(id);
        if (!el) continue;

        if (isAngleInSector(angle, range.start, range.end)) {
            el.classList.add('active');
        } else {
            el.classList.remove('active');
        }
    }

    requestAnimationFrame(animate);
}

requestAnimationFrame(animate);


const counters = document.querySelectorAll('.stat-num[data-target]');

function startCounter(counter) {
    const target = parseFloat(counter.getAttribute('data-target'));
    const isDecimal = target % 1 !== 0;
    const duration = 2000;
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = target / steps;

    let current = 0;

    const timer = setInterval(() => {
        current += increment;

        if (current >= target) {
            current = target;
            clearInterval(timer);
        }

        if (isDecimal) {
            counter.innerText = current.toFixed(1) + "%";
        } else {
            counter.innerText = Math.floor(current) + "+";
        }

    }, stepTime);
}

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {

        if (entry.isIntersecting) {

            const counter = entry.target;
            startCounter(counter);

            observer.unobserve(counter);
        }

    });
}, { threshold: 0.6 });

counters.forEach(counter => {
    observer.observe(counter);
});