/* ═══════════════════════════════════════════════════════════
   PRELOADER
═══════════════════════════════════════════════════════════ */
document.body.style.overflow = 'hidden';
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('preloader').classList.add('hidden');
        document.body.style.overflow = '';
    }, 1950);
});

/* ═══════════════════════════════════════════════════════════
   GLOBAL CANVAS PARTICLES (covers entire page)
═══════════════════════════════════════════════════════════ */
(function initCanvas() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];
    const mouse = { x: -9999, y: -9999 };

    const resize = () => {
        W = canvas.width  = window.innerWidth;
        H = canvas.height = window.innerHeight;
        buildParticles();
    };

    const buildParticles = () => {
        const count = Math.min(Math.floor(W * H / 14000), 90);
        particles = Array.from({ length: count }, () => ({
            x:  Math.random() * W,
            y:  Math.random() * H,
            vx: (Math.random() - .5) * .35,
            vy: (Math.random() - .5) * .35,
            r:  Math.random() * 1.8 + .5,
            a:  Math.random() * .35 + .1,
        }));
    };

    const connect = () => {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const d  = Math.hypot(dx, dy);
                if (d < 140) {
                    ctx.strokeStyle = `rgba(0,255,238,${(1 - d / 140) * .18})`;
                    ctx.lineWidth = .8;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    };

    const tick = () => {
        ctx.clearRect(0, 0, W, H);
        particles.forEach(p => {
            // repel from mouse
            const dx = p.x - mouse.x, dy = p.y - mouse.y;
            const d  = Math.hypot(dx, dy);
            if (d < 110) { p.x += (dx / d) * 1.6; p.y += (dy / d) * 1.6; }

            p.x += p.vx; p.y += p.vy;
            if (p.x < 0 || p.x > W) p.vx *= -1;
            if (p.y < 0 || p.y > H) p.vy *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0,255,238,${p.a})`;
            ctx.fill();
        });
        connect();
        requestAnimationFrame(tick);
    };

    document.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
    document.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });
    window.addEventListener('resize', resize);
    resize();
    tick();
})();

/* ═══════════════════════════════════════════════════════════
   CUSTOM CURSOR
═══════════════════════════════════════════════════════════ */
(function initCursor() {
    const dot  = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');
    if (!dot || !ring) return;

    let mx = 0, my = 0, rx = 0, ry = 0;
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

    (function loop() {
        rx += (mx - rx) * .13; ry += (my - ry) * .13;
        dot.style.cssText  = `left:${mx}px;top:${my}px`;
        ring.style.cssText = `left:${rx}px;top:${ry}px`;
        requestAnimationFrame(loop);
    })();

    document.querySelectorAll('a,button,.tilt-card,.badge,.service-box,.exp-tab')
        .forEach(el => {
            el.addEventListener('mouseenter', () => ring.classList.add('hovering'));
            el.addEventListener('mouseleave', () => ring.classList.remove('hovering'));
        });
})();

/* ═══════════════════════════════════════════════════════════
   SCROLL PROGRESS BAR
═══════════════════════════════════════════════════════════ */
const scrollBar = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.documentElement.scrollHeight - innerHeight) * 100;
    scrollBar.style.width = pct + '%';
}, { passive: true });

/* ═══════════════════════════════════════════════════════════
   HEADER SHRINK
═══════════════════════════════════════════════════════════ */
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ═══════════════════════════════════════════════════════════
   ACTIVE NAV + SIDE DOTS
═══════════════════════════════════════════════════════════ */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('header nav a');
const sideDots = document.querySelectorAll('.side-dot');

window.addEventListener('scroll', () => {
    const top = window.scrollY + 180;
    sections.forEach(sec => {
        if (top >= sec.offsetTop && top < sec.offsetTop + sec.offsetHeight) {
            const id = '#' + sec.id;
            navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === id));
            sideDots.forEach(d => d.classList.toggle('active', d.getAttribute('href') === id));
        }
    });
}, { passive: true });

/* ═══════════════════════════════════════════════════════════
   MOBILE MENU
═══════════════════════════════════════════════════════════ */
const menuIcon = document.getElementById('menu-icon');
const navbar   = document.querySelector('.navbar');
menuIcon.addEventListener('click', () => {
    menuIcon.classList.toggle('bx-x');
    navbar.classList.toggle('active');
});
navLinks.forEach(l => l.addEventListener('click', () => {
    navbar.classList.remove('active');
    menuIcon.classList.remove('bx-x');
}));

/* ═══════════════════════════════════════════════════════════
   EXPERIENCE / EDUCATION TABS
═══════════════════════════════════════════════════════════ */
document.querySelectorAll('.exp-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.exp-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const target = tab.dataset.tab;
        document.getElementById('tab-work').classList.toggle('hidden', target !== 'work');
        document.getElementById('tab-edu').classList.toggle('hidden', target !== 'edu');
        // re-trigger animations for newly visible items
        document.querySelectorAll('#tab-' + target + ' [data-animate]').forEach(el => {
            el.classList.remove('visible');
            setTimeout(() => el.classList.add('visible'), 80);
        });
    });
});

/* ═══════════════════════════════════════════════════════════
   SCROLL ANIMATIONS
═══════════════════════════════════════════════════════════ */
const appearObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); appearObs.unobserve(e.target); }
    });
}, { threshold: 0.1 });
document.querySelectorAll('[data-animate]').forEach(el => appearObs.observe(el));

/* ═══════════════════════════════════════════════════════════
   BACK TO TOP
═══════════════════════════════════════════════════════════ */
const btt = document.getElementById('back-to-top');
window.addEventListener('scroll', () => btt.classList.toggle('visible', window.scrollY > 400), { passive: true });
btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ═══════════════════════════════════════════════════════════
   COUNTER ANIMATION
═══════════════════════════════════════════════════════════ */
const counterObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target, target = +el.dataset.target, dur = 1800, start = performance.now();
        const tick = now => {
            const p = Math.min((now - start) / dur, 1);
            el.textContent = Math.floor((1 - Math.pow(1 - p, 3)) * target);
            if (p < 1) requestAnimationFrame(tick); else el.textContent = target;
        };
        requestAnimationFrame(tick);
        counterObs.unobserve(el);
    });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-number').forEach(c => counterObs.observe(c));

/* ═══════════════════════════════════════════════════════════
   SKILL BARS
═══════════════════════════════════════════════════════════ */
const skillObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.style.width = e.target.dataset.target + '%';
            skillObs.unobserve(e.target);
        }
    });
}, { threshold: 0.4 });
document.querySelectorAll('.skill-fill').forEach(f => skillObs.observe(f));

/* ═══════════════════════════════════════════════════════════
   3D CARD TILT
═══════════════════════════════════════════════════════════ */
const isMobile = () => window.innerWidth <= 768;
document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
        if (isMobile()) return;
        const r = card.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width  - .5) * 18;
        const y = ((e.clientY - r.top)  / r.height - .5) * -18;
        card.style.cssText += `transform:perspective(900px) rotateY(${x}deg) rotateX(${y}deg) scale(1.03);transition:transform .1s;`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.cssText += `transform:perspective(900px) rotateY(0) rotateX(0) scale(1);transition:transform .5s;`;
    });
});

/* ═══════════════════════════════════════════════════════════
   SERVICE BOX GLOW TRACKING
═══════════════════════════════════════════════════════════ */
document.querySelectorAll('.service-box').forEach(box => {
    box.addEventListener('mousemove', e => {
        const r = box.getBoundingClientRect();
        box.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
        box.style.setProperty('--my', ((e.clientY - r.top)  / r.height * 100).toFixed(1) + '%');
    });
});

/* ═══════════════════════════════════════════════════════════
   MAGNETIC BUTTONS
═══════════════════════════════════════════════════════════ */
document.querySelectorAll('.magnetic-btn').forEach(btn => {
    btn.addEventListener('mousemove', e => {
        if (isMobile()) return;
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width  / 2) * .32;
        const y = (e.clientY - r.top  - r.height / 2) * .32;
        btn.style.transform = `translate(${x}px,${y}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
});

/* ═══════════════════════════════════════════════════════════
   TESTIMONIALS CAROUSEL
═══════════════════════════════════════════════════════════ */
(function initCarousel() {
    const track     = document.getElementById('slider-track');
    const dotsWrap  = document.getElementById('slider-dots');
    const prevBtn   = document.querySelector('.slider-prev');
    const nextBtn   = document.querySelector('.slider-next');
    if (!track) return;

    const cards = Array.from(track.querySelectorAll('.testimonial-card'));
    let current = 0, autoTimer = null;

    const visible = () => {
        if (window.innerWidth > 1280) return 3;
        if (window.innerWidth > 768)  return 2;
        return 1;
    };
    const maxIdx  = () => Math.max(0, cards.length - visible());

    // Build dots
    const buildDots = () => {
        dotsWrap.innerHTML = '';
        const total = maxIdx() + 1;
        for (let i = 0; i < total; i++) {
            const d = document.createElement('button');
            d.className = 'slider-dot' + (i === current ? ' active' : '');
            d.setAttribute('aria-label', `Slide ${i + 1}`);
            d.addEventListener('click', () => goTo(i));
            dotsWrap.appendChild(d);
        }
    };

    const goTo = n => {
        current = Math.max(0, Math.min(n, maxIdx()));
        const cardW = cards[0].getBoundingClientRect().width;
        const gap   = 25; // 2.5rem at 10px base
        track.style.transform = `translateX(-${current * (cardW + gap)}px)`;
        dotsWrap.querySelectorAll('.slider-dot').forEach((d, i) => d.classList.toggle('active', i === current));
        resetAuto();
    };

    const next = () => goTo(current >= maxIdx() ? 0 : current + 1);
    const prev = () => goTo(current <= 0 ? maxIdx() : current - 1);

    const resetAuto = () => { clearInterval(autoTimer); autoTimer = setInterval(next, 4500); };

    prevBtn.addEventListener('click', prev);
    nextBtn.addEventListener('click', next);

    // Swipe
    let touchX = 0;
    track.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend',   e => {
        const dx = touchX - e.changedTouches[0].clientX;
        if (Math.abs(dx) > 40) dx > 0 ? next() : prev();
    });

    // Pause on hover
    track.addEventListener('mouseenter', () => clearInterval(autoTimer));
    track.addEventListener('mouseleave', resetAuto);

    window.addEventListener('resize', () => { buildDots(); goTo(Math.min(current, maxIdx())); });

    buildDots();
    resetAuto();
})();

/* ═══════════════════════════════════════════════════════════
   CONTACT FORM (Formspree)
═══════════════════════════════════════════════════════════ */
const form      = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');
const feedback  = document.getElementById('form-feedback');

if (form) {
    form.addEventListener('submit', async e => {
        e.preventDefault();
        const email = form.querySelector('input[type="email"]').value;
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            feedback.textContent = '✗ Please enter a valid email.';
            feedback.className = 'form-feedback error';
            return;
        }
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Sending... <i class="bx bx-loader-alt bx-spin"></i>';
        feedback.textContent = ''; feedback.className = 'form-feedback';
        try {
            const res = await fetch(form.action, {
                method: 'POST', body: new FormData(form),
                headers: { Accept: 'application/json' }
            });
            if (res.ok) {
                feedback.textContent = '✓ Message sent! I\'ll get back to you soon.';
                feedback.className = 'form-feedback success';
                form.reset();
            } else throw new Error();
        } catch {
            feedback.textContent = '✗ Something went wrong. Please try via LinkedIn.';
            feedback.className = 'form-feedback error';
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Send Message <i class="bx bx-send"></i>';
        }
    });
}
