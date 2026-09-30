/**
 * AAA Water Tank Cleaning Services - Production JavaScript
 * High-performance ES6+ logic for mobile menu, tabs, carousel, FAQ, and counters.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Drawer Toggle
    const mobileToggle = document.getElementById('mobileToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    if (mobileToggle && mobileMenu) {
        const toggleMenu = (open) => {
            const isHidden = typeof open === 'boolean' ? !open : !mobileMenu.classList.contains('hidden');
            mobileMenu.classList.toggle('hidden', isHidden);
            mobileMenu.classList.toggle('flex', !isHidden);
            mobileToggle.setAttribute('aria-expanded', String(!isHidden));
            const icon = mobileToggle.querySelector('i');
            if (icon) {
                icon.className = isHidden ? 'fa-solid fa-bars text-xl' : 'fa-solid fa-xmark text-xl';
            }
        };

        mobileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });

        mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggleMenu(false)));
        document.addEventListener('click', (e) => {
            if (!mobileMenu.contains(e.target) && !mobileToggle.contains(e.target)) toggleMenu(false);
        });
    }

    // 2. Sticky Header Elevation Shadow on Scroll
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('shadow-md', window.scrollY > 30);
        }, { passive: true });
    }

    // 3. Service Category Tabs
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-tab');

            tabBtns.forEach(b => {
                const isActive = b === btn;
                b.classList.toggle('active', isActive);
                b.classList.toggle('bg-brand-600', isActive);
                b.classList.toggle('text-white', isActive);
                b.classList.toggle('bg-white', !isActive);
                b.classList.toggle('text-slate-700', !isActive);
                b.setAttribute('aria-selected', String(isActive));
            });

            tabPanels.forEach(panel => {
                const isMatch = panel.id === targetId;
                panel.classList.toggle('active', isMatch);
                panel.style.display = isMatch ? 'block' : 'none';
            });
        });
    });

    // 4. Testimonials Slider Carousel
    const slides = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    let slideTimer;

    const goToSlide = (idx) => {
        if (!slides.length) return;
        currentSlide = (idx + slides.length) % slides.length;

        slides.forEach((s, i) => {
            s.classList.toggle('active', i === currentSlide);
            s.style.display = i === currentSlide ? 'block' : 'none';
        });

        dots.forEach((d, i) => {
            const isCur = i === currentSlide;
            d.classList.toggle('active', isCur);
            d.classList.toggle('bg-brand-600', isCur);
            d.classList.toggle('scale-125', isCur);
            d.classList.toggle('bg-slate-300', !isCur);
        });
    };

    if (slides.length > 0) {
        goToSlide(0);
        dots.forEach(d => {
            d.addEventListener('click', () => {
                goToSlide(parseInt(d.dataset.index, 10));
                clearInterval(slideTimer);
                slideTimer = setInterval(() => goToSlide(currentSlide + 1), 6000);
            });
        });
        slideTimer = setInterval(() => goToSlide(currentSlide + 1), 6000);
    }

    // 5. Accessible FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        if (questionBtn) {
            questionBtn.addEventListener('click', () => {
                const willOpen = !item.classList.contains('active');
                faqItems.forEach(other => {
                    other.classList.remove('active');
                    const otherBtn = other.querySelector('.faq-question');
                    if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
                });
                item.classList.toggle('active', willOpen);
                questionBtn.setAttribute('aria-expanded', String(willOpen));
            });
        }
    });

    // 6. Floating Back to Top Button
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            const show = window.scrollY > 400;
            backToTop.classList.toggle('opacity-100', show);
            backToTop.classList.toggle('opacity-0', !show);
            backToTop.classList.toggle('pointer-events-none', !show);
        }, { passive: true });

        backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    // 7. Scroll Reveal Animation
    const reveals = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && reveals.length) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
        reveals.forEach(el => observer.observe(el));
    } else {
        reveals.forEach(el => el.classList.add('active'));
    }

    // 8. Animated Number Counters
    const statsBar = document.querySelector('.stats-bar');
    if (statsBar && 'IntersectionObserver' in window) {
        let hasCounted = false;
        const countObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !hasCounted) {
                hasCounted = true;
                document.querySelectorAll('.counter').forEach(c => {
                    const target = +c.dataset.target || 0;
                    const duration = 1600;
                    const start = performance.now();
                    const tick = (now) => {
                        const progress = Math.min((now - start) / duration, 1);
                        c.innerText = Math.floor((1 - (1 - progress) ** 2) * target).toLocaleString('en-IN');
                        if (progress < 1) requestAnimationFrame(tick);
                        else c.innerText = target.toLocaleString('en-IN');
                    };
                    requestAnimationFrame(tick);
                });

                document.querySelectorAll('.counter-float').forEach(cf => {
                    const target = parseFloat(cf.dataset.target) || 5.0;
                    const duration = 1400;
                    const start = performance.now();
                    const tick = (now) => {
                        const progress = Math.min((now - start) / duration, 1);
                        cf.innerText = ((1 - (1 - progress) ** 2) * target).toFixed(1);
                        if (progress < 1) requestAnimationFrame(tick);
                        else cf.innerText = target.toFixed(1);
                    };
                    requestAnimationFrame(tick);
                });
            }
        }, { threshold: 0.25 });
        countObserver.observe(statsBar);
    }

    // 9. Booking Form Submission Feedback
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (contactForm && formStatus) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button[type="submit"]');
            const original = btn.innerHTML;

            btn.disabled = true;
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Submitting...';

            setTimeout(() => {
                btn.disabled = false;
                btn.innerHTML = '<i class="fa-solid fa-check mr-2"></i> Sent!';
                formStatus.className = 'form-status text-center text-xs sm:text-sm font-semibold mt-3 p-3 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200';
                formStatus.innerHTML = '<i class="fa-solid fa-circle-check text-emerald-600 mr-1.5"></i> Thank you! Your request has been received. Our Delhi team will call you within 15 minutes.';
                contactForm.reset();

                setTimeout(() => { btn.innerHTML = original; }, 3000);
                setTimeout(() => {
                    formStatus.innerHTML = '';
                    formStatus.className = 'form-status text-center text-xs sm:text-sm font-semibold mt-3 min-h-[20px]';
                }, 8000);
            }, 1200);
        });
    }
});