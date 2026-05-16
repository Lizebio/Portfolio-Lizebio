/* ═══════════════════════════════════════════════════════════
   PRELOADER
═══════════════════════════════════════════════════════════ */
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('preloader').classList.add('hidden');
        document.body.style.overflow = 'auto';
    }, 1900);
});
document.body.style.overflow = 'hidden';

/* ═══════════════════════════════════════════════════════════
   CUSTOM CURSOR
═══════════════════════════════════════════════════════════ */
const dot  = document.querySelector('.cursor-dot');
const ring = document.querySelector('.cursor-ring');

if (dot && ring) {
    let mouseX = 0, mouseY = 0;
    let ringX  = 0, ringY  = 0;

    document.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.left = mouseX + 'px';
        dot.style.top  = mouseY + 'px';
    });

    (function animateRing() {
        ringX += (mouseX - ringX) * 0.14;
        ringY += (mouseY - ringY) * 0.14;
        ring.style.left = ringX + 'px';
        ring.style.top  = ringY + 'px';
        requestAnimationFrame(animateRing);
    })();

    const hoverEls = document.querySelectorAll('a, button, .tilt-card, .badge, .service-box');
    hoverEls.forEach(el => {
        el.addEventListener('mouseenter', () => ring.classList.add('hovering'));
        el.addEventListener('mouseleave', () => ring.classList.remove('hovering'));
    });
}

/* ═══════════════════════════════════════════════════════════
   SCROLL PROGRESS BAR
═══════════════════════════════════════════════════════════ */
const progressBar = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const total    = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = ((scrolled / total) * 100) + '%';
}, { passive: true });

/* ═══════════════════════════════════════════════════════════
   HEADER SHRINK ON SCROLL
═══════════════════════════════════════════════════════════ */
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

/* ═══════════════════════════════════════════════════════════
   ACTIVE NAV & SIDE DOTS
═══════════════════════════════════════════════════════════ */
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('header nav a');
const sideDots  = document.querySelectorAll('.side-dot');

window.addEventListener('scroll', () => {
    const top = window.scrollY + 160;
    sections.forEach(sec => {
        if (top >= sec.offsetTop && top < sec.offsetTop + sec.offsetHeight) {
            const id = sec.getAttribute('id');
            navLinks.forEach(l => {
                l.classList.toggle('active', l.getAttribute('href') === '#' + id);
            });
            sideDots.forEach(d => {
                d.classList.toggle('active', d.getAttribute('href') === '#' + id);
            });
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
   SCROLL ANIMATIONS (Intersection Observer)
═══════════════════════════════════════════════════════════ */
const animatedEls = document.querySelectorAll('[data-animate]');
const appearObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('visible');
            appearObs.unobserve(e.target);
        }
    });
}, { threshold: 0.12 });
animatedEls.forEach(el => appearObs.observe(el));

/* ═══════════════════════════════════════════════════════════
   BACK TO TOP
═══════════════════════════════════════════════════════════ */
const backToTop = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ═══════════════════════════════════════════════════════════
   COUNTER ANIMATION
═══════════════════════════════════════════════════════════ */
const counters = document.querySelectorAll('.stat-number');
const counterObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el     = e.target;
        const target = +el.dataset.target;
        const dur    = 1800;
        const start  = performance.now();
        const tick   = now => {
            const progress = Math.min((now - start) / dur, 1);
            const ease     = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(ease * target);
            if (progress < 1) requestAnimationFrame(tick);
            else el.textContent = target;
        };
        requestAnimationFrame(tick);
        counterObs.unobserve(el);
    });
}, { threshold: 0.5 });
counters.forEach(c => counterObs.observe(c));

/* ═══════════════════════════════════════════════════════════
   SKILL BARS
═══════════════════════════════════════════════════════════ */
const skillFills = document.querySelectorAll('.skill-fill');
const skillObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.style.width = e.target.dataset.target + '%';
            skillObs.unobserve(e.target);
        }
    });
}, { threshold: 0.4 });
skillFills.forEach(f => skillObs.observe(f));

/* ═══════════════════════════════════════════════════════════
   3D CARD TILT
═══════════════════════════════════════════════════════════ */
const isMobile = () => window.innerWidth <= 768;

document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
        if (isMobile()) return;
        const r = card.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width  - 0.5) * 16;
        const y = ((e.clientY - r.top)  / r.height - 0.5) * -16;
        card.style.transform = `perspective(900px) rotateY(${x}deg) rotateX(${y}deg) scale(1.02)`;
        card.style.transition = 'transform .1s ease';
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(900px) rotateY(0) rotateX(0) scale(1)';
        card.style.transition = 'transform .5s ease';
    });
});

/* ═══════════════════════════════════════════════════════════
   SERVICE BOX GLOW (mouse track)
═══════════════════════════════════════════════════════════ */
document.querySelectorAll('.service-box').forEach(box => {
    box.addEventListener('mousemove', e => {
        const r = box.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width  * 100).toFixed(1);
        const y = ((e.clientY - r.top)  / r.height * 100).toFixed(1);
        box.style.setProperty('--mx', x + '%');
        box.style.setProperty('--my', y + '%');
    });
});

/* ═══════════════════════════════════════════════════════════
   MAGNETIC BUTTONS
═══════════════════════════════════════════════════════════ */
document.querySelectorAll('.magnetic-btn').forEach(btn => {
    btn.addEventListener('mousemove', e => {
        if (isMobile()) return;
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width  / 2) * 0.35;
        const y = (e.clientY - r.top  - r.height / 2) * 0.35;
        btn.style.transform = `translate(${x}px, ${y}px)`;
    });
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
    });
});

/* ═══════════════════════════════════════════════════════════
   PARTICLE SYSTEM
═══════════════════════════════════════════════════════════ */
const canvas = document.getElementById('particles-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null };

    const resize = () => {
        canvas.width  = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', () => { resize(); initParticles(); });

    canvas.closest('section').addEventListener('mousemove', e => {
        const r = canvas.getBoundingClientRect();
        mouse.x = e.clientX - r.left;
        mouse.y = e.clientY - r.top;
    });
    canvas.closest('section').addEventListener('mouseleave', () => { mouse.x = null; });

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x  = Math.random() * canvas.width;
            this.y  = Math.random() * canvas.height;
            this.vx = (Math.random() - .5) * .4;
            this.vy = (Math.random() - .5) * .4;
            this.r  = Math.random() * 2 + .5;
            this.a  = Math.random() * .4 + .15;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > canvas.width)  this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height)  this.vy *= -1;
            if (mouse.x !== null) {
                const dx = this.x - mouse.x, dy = this.y - mouse.y;
                const d  = Math.sqrt(dx*dx + dy*dy);
                if (d < 100) {
                    this.x += (dx / d) * 1.5;
                    this.y += (dy / d) * 1.5;
                }
            }
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0,255,238,${this.a})`;
            ctx.fill();
        }
    }

    const initParticles = () => {
        const count = Math.min(Math.floor(canvas.width * canvas.height / 12000), 80);
        particles = Array.from({ length: count }, () => new Particle());
    };
    initParticles();

    const connectParticles = () => {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const d  = Math.sqrt(dx*dx + dy*dy);
                if (d < 130) {
                    ctx.strokeStyle = `rgba(0,255,238,${(1 - d/130) * .2})`;
                    ctx.lineWidth   = .8;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    };

    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        connectParticles();
        requestAnimationFrame(animate);
    };
    animate();
}

/* ═══════════════════════════════════════════════════════════
   CONTACT FORM (Formspree)
═══════════════════════════════════════════════════════════ */
const form     = document.getElementById('contact-form');
const submitBtn= document.getElementById('submit-btn');
const feedback = document.getElementById('form-feedback');

if (form) {
    form.addEventListener('submit', async e => {
        e.preventDefault();

        const email = form.querySelector('input[type="email"]').value;
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            feedback.textContent = '✗ Por favor, insira um e-mail válido.';
            feedback.className = 'form-feedback error';
            return;
        }

        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Sending... <i class="bx bx-loader-alt bx-spin"></i>';
        feedback.textContent = '';
        feedback.className = 'form-feedback';

        try {
            const res = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: { Accept: 'application/json' }
            });
            if (res.ok) {
                feedback.textContent = '✓ Mensagem enviada! Em breve entrarei em contato.';
                feedback.className = 'form-feedback success';
                form.reset();
            } else {
                throw new Error();
            }
        } catch {
            feedback.textContent = '✗ Erro ao enviar. Tente pelo LinkedIn.';
            feedback.className = 'form-feedback error';
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Send Message <i class="bx bx-send"></i>';
        }
    });
}
