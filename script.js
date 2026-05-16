// ─── NAVIGATION ─────────────────────────────────────────────
const menuIcon = document.querySelector('#menu-icon');
const navbar = document.querySelector('.navbar');
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('header nav a');

window.addEventListener('scroll', () => {
    const top = window.scrollY;
    sections.forEach(sec => {
        const offset = sec.offsetTop - 150;
        const height = sec.offsetHeight;
        const id = sec.getAttribute('id');
        if (top >= offset && top < offset + height) {
            navLinks.forEach(link => link.classList.remove('active'));
            const activeLink = document.querySelector('header nav a[href="#' + id + '"]');
            if (activeLink) activeLink.classList.add('active');
        }
    });
});

menuIcon.addEventListener('click', () => {
    menuIcon.classList.toggle('bx-x');
    navbar.classList.toggle('active');
});

// ─── SCROLL ANIMATIONS (Intersection Observer) ───────────────
const animatedEls = document.querySelectorAll('[data-animate]');

const appearObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            appearObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

animatedEls.forEach(el => appearObserver.observe(el));

// ─── SKILL BARS ──────────────────────────────────────────────
const skillFills = document.querySelectorAll('.skill-fill');

const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const fill = entry.target;
            const target = fill.getAttribute('data-target');
            fill.style.width = target + '%';
            skillObserver.unobserve(fill);
        }
    });
}, { threshold: 0.3 });

skillFills.forEach(fill => skillObserver.observe(fill));

// ─── CONTACT FORM (Formspree) ────────────────────────────────
const form = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');
const feedback = document.getElementById('form-feedback');

if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = form.querySelector('input[type="email"]').value;
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            feedback.textContent = 'Por favor, insira um e-mail válido.';
            feedback.className = 'form-feedback error';
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        feedback.textContent = '';
        feedback.className = 'form-feedback';

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                feedback.textContent = '✓ Mensagem enviada com sucesso! Em breve entrarei em contato.';
                feedback.className = 'form-feedback success';
                form.reset();
            } else {
                throw new Error('Erro no envio');
            }
        } catch {
            feedback.textContent = '✗ Erro ao enviar. Tente novamente ou entre em contato pelo LinkedIn.';
            feedback.className = 'form-feedback error';
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';
        }
    });
}
