/**
 * AAA Water Tank Cleaning Services - Production JavaScript
 * High-performance ES6+ logic for mobile menu, tabs, carousel, FAQ, counters, and rain physics.
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
                panel.classList.toggle('hidden', !isMatch);
            });
        });
    });

    // 3.1 Tank Sub-category Filter
    const subBtns = document.querySelectorAll('.tank-sub-btn');
    const subCards = document.querySelectorAll('#water .service-photo-card');
    if (subBtns.length && subCards.length) {
        subBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const sub = btn.getAttribute('data-sub');
                subBtns.forEach(b => {
                    const isActive = b === btn;
                    b.classList.toggle('active', isActive);
                    b.classList.toggle('bg-brand-600', isActive);
                    b.classList.toggle('text-white', isActive);
                    b.classList.toggle('bg-white', !isActive);
                    b.classList.toggle('text-slate-700', !isActive);
                });
                subCards.forEach(card => {
                    const match = sub === 'all' || card.getAttribute('data-subcat') === sub;
                    card.classList.toggle('hidden', !match);
                });
            });
        });
    }

    // 4. Testimonials Slider Carousel
    const slides = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    let slideTimer;

    const goToSlide = (idx) => {
        if (!slides.length) return;
        currentSlide = (idx + slides.length) % slides.length;

        slides.forEach((s, i) => {
            const isCur = i === currentSlide;
            s.classList.toggle('active', isCur);
            s.classList.toggle('hidden', !isCur);
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
        }, { threshold: 0.02, rootMargin: '100px 0px 100px 0px' });
        reveals.forEach(el => observer.observe(el));
        reveals.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight + 300 && rect.bottom > -200) {
                el.classList.add('active');
            }
        });
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

    // 9. Instant WhatsApp Booking & Inquiry Dispatch (Hinglish)
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (contactForm && formStatus) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nameInput = document.getElementById('name');
            const phoneInput = document.getElementById('phone');
            const serviceSelect = document.getElementById('service');
            const messageInput = document.getElementById('message');
            const btn = document.getElementById('whatsappSubmitBtn') || contactForm.querySelector('button[type="submit"]');

            const name = nameInput ? nameInput.value.trim() : '';
            const phone = phoneInput ? phoneInput.value.trim() : '';
            const service = serviceSelect && serviceSelect.selectedIndex > 0 
                ? serviceSelect.options[serviceSelect.selectedIndex].text.replace(/^[^\w\s]+/, '').trim() 
                : 'Water Tank Cleaning';
            const notes = messageInput ? messageInput.value.trim() : '';

            const originalBtn = btn ? btn.innerHTML : '';
            if (btn) {
                btn.disabled = true;
                btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin text-xl mr-2"></i> Opening WhatsApp...';
            }

            // Construct formatted WhatsApp inquiry message in polite Hinglish
            let waText = `Hello AAA Water Tank Cleaning Services,\n\nMujhe aapki website ke through service appointment book karni hai:\n*Name:* ${name}\n*Phone:* ${phone}\n*Service:* ${service}`;
            if (notes) {
                waText += `\n*Address / Tank Capacity:* ${notes}`;
            }
            waText += `\n\nKripya upfront quotation aur available time slots share karein. Thank you!`;

            const waUrl = `https://wa.me/919891044488?text=${encodeURIComponent(waText)}`;

            // Open WhatsApp directly
            window.open(waUrl, '_blank');

            // Success Feedback in Form
            formStatus.className = 'form-status text-center text-xs sm:text-sm font-semibold mt-3 p-3.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200';
            formStatus.innerHTML = `<i class="fa-brands fa-whatsapp text-whatsapp text-lg mr-1.5 align-middle"></i> <strong>Opening WhatsApp...</strong> If your WhatsApp didn't open automatically, <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="underline text-emerald-900 font-bold hover:text-emerald-700">tap here to send your message</a>.`;

            setTimeout(() => {
                if (btn) {
                    btn.disabled = false;
                    btn.innerHTML = '<i class="fa-brands fa-whatsapp text-2xl mr-2"></i> Sent to WhatsApp!';
                }
            }, 1000);

            setTimeout(() => {
                if (btn) btn.innerHTML = originalBtn;
                contactForm.reset();
            }, 4000);
        });
    }

    // 10. Water Particle Physics & Ripple Animation Engine
    const canvas = document.getElementById('waterCanvas');
    if (canvas && canvas.getContext) {
        const ctx = canvas.getContext('2d');
        const heroSection = document.getElementById('home');
        let width = 0;
        let height = 0;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        let animationFrameId = null;
        let isVisible = true;

        const baseWindAngle = 0.21;
        let windAngle = baseWindAngle;

        let mouseX = -1000;
        let mouseY = -1000;
        let lastMouseX = -1000;
        let lastMouseY = -1000;

        if (heroSection) {
            heroSection.addEventListener('mousemove', (e) => {
                const rect = canvas.getBoundingClientRect();
                mouseX = e.clientX - rect.left;
                mouseY = e.clientY - rect.top;
                lastMouseX = mouseX;
                lastMouseY = mouseY;
            }, { passive: true });

            heroSection.addEventListener('mouseleave', () => {
                mouseX = -1000;
                mouseY = -1000;
            }, { passive: true });

            heroSection.addEventListener('click', (e) => {
                const rect = canvas.getBoundingClientRect();
                createSurfaceImpact(e.clientX - rect.left, e.clientY - rect.top, 2, true);
            }, { passive: true });

            heroSection.addEventListener('touchmove', (e) => {
                if (e.touches.length > 0) {
                    const rect = canvas.getBoundingClientRect();
                    mouseX = e.touches[0].clientX - rect.left;
                    mouseY = e.touches[0].clientY - rect.top;
                }
            }, { passive: true });

            heroSection.addEventListener('touchend', () => {
                mouseX = -1000;
                mouseY = -1000;
            }, { passive: true });
        }

        const resizeCanvas = () => {
            const rect = canvas.getBoundingClientRect();
            width = rect.width;
            height = rect.height;
            canvas.width = Math.floor(width * dpr);
            canvas.height = Math.floor(height * dpr);
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.scale(dpr, dpr);
        };

        window.addEventListener('resize', resizeCanvas, { passive: true });
        resizeCanvas();

        class RainDrop {
            constructor(layer, spawnAnywhere = false) {
                this.layer = layer;
                this.reset(spawnAnywhere);
            }

            reset(spawnAnywhere = false) {
                this.x = Math.random() * (width + 200) - 100;
                this.y = spawnAnywhere ? Math.random() * (height + 100) - 100 : -40 - Math.random() * 80;

                if (this.layer === 0) {
                    this.speed = 18 + Math.random() * 8;
                    this.length = 16 + Math.random() * 12;
                    this.width = 0.75 + Math.random() * 0.35;
                    this.opacity = 0.14 + Math.random() * 0.12;
                    this.r = 185; this.g = 215; this.b = 240;
                } else if (this.layer === 1) {
                    this.speed = 30 + Math.random() * 14;
                    this.length = 34 + Math.random() * 20;
                    this.width = 1.2 + Math.random() * 0.5;
                    this.opacity = 0.32 + Math.random() * 0.18;
                    this.r = 210; this.g = 235; this.b = 255;
                } else {
                    this.speed = 48 + Math.random() * 22;
                    this.length = 68 + Math.random() * 38;
                    this.width = 1.8 + Math.random() * 0.8;
                    this.opacity = 0.52 + Math.random() * 0.24;
                    this.r = 245; this.g = 250; this.b = 255;
                }
                this.mass = 0.85 + Math.random() * 0.3;
            }

            update(currentTime, currentWindAngle) {
                const vx = Math.sin(currentWindAngle) * this.speed * this.mass;
                const vy = Math.cos(currentWindAngle) * this.speed * this.mass;

                if (mouseX > 0) {
                    const dx = this.x - mouseX;
                    const dy = this.y - mouseY;
                    const dist = Math.hypot(dx, dy);
                    const pushRadius = 90;
                    if (dist < pushRadius && dist > 1) {
                        this.x += (dx / dist) * ((pushRadius - dist) / pushRadius) * 4.0;
                    }
                }

                this.x += vx;
                this.y += vy;

                const surfaceY = height - 35 + Math.sin(this.x * 0.008 + currentTime * 0.001) * 10;

                if (this.y >= surfaceY) {
                    createSurfaceImpact(this.x, surfaceY, this.layer);
                    this.reset(false);
                }

                if (this.x > width + 100 || this.y > height + 60) {
                    this.reset(false);
                }
            }

            draw() {
                const tailX = this.x - Math.sin(windAngle) * this.length;
                const tailY = this.y - Math.cos(windAngle) * this.length;

                const grad = ctx.createLinearGradient(tailX, tailY, this.x, this.y);
                grad.addColorStop(0, `rgba(${this.r}, ${this.g}, ${this.b}, 0)`);
                grad.addColorStop(0.65, `rgba(${this.r}, ${this.g}, ${this.b}, ${this.opacity * 0.5})`);
                grad.addColorStop(0.92, `rgba(255, 255, 255, ${this.opacity * 0.9})`);
                grad.addColorStop(1, `rgba(255, 255, 255, ${this.opacity})`);

                ctx.strokeStyle = grad;
                ctx.lineWidth = this.width;
                ctx.lineCap = 'round';

                ctx.beginPath();
                ctx.moveTo(tailX, tailY);
                ctx.lineTo(this.x, this.y);
                ctx.stroke();

                if (this.layer === 2) {
                    ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity * 0.95})`;
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.width * 0.55, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }

        const ripples = [];
        const splashBeads = [];
        const microBubbles = [];

        const createSurfaceImpact = (x, y, layer, isForce = false) => {
            if (layer === 0 && !isForce && Math.random() < 0.6) return;

            const maxR = layer === 2 ? 18 + Math.random() * 14 : (layer === 1 ? 12 + Math.random() * 8 : 7 + Math.random() * 5);
            ripples.push({
                x, y, rx: 1.5, ry: 0.5,
                speed: 0.55 + Math.random() * 0.35,
                maxRadius: maxR,
                opacity: layer === 2 ? 0.65 : (layer === 1 ? 0.45 : 0.28),
                lineWidth: layer === 2 ? 1.1 : 0.8
            });

            const beadCount = isForce ? 5 : (layer === 2 ? 2 + Math.floor(Math.random() * 3) : (layer === 1 ? 1 + Math.floor(Math.random() * 2) : 0));
            for (let i = 0; i < beadCount; i++) {
                const sprayAngle = -Math.PI * 0.5 + (Math.random() - 0.5) * 1.5;
                const spraySpeed = 2.0 + Math.random() * 3.6;
                splashBeads.push({
                    x, y: y - 1,
                    vx: Math.cos(sprayAngle) * spraySpeed + Math.sin(windAngle) * 0.8,
                    vy: Math.sin(sprayAngle) * spraySpeed,
                    radius: 0.8 + Math.random() * 1.1,
                    opacity: 0.75,
                    gravity: 0.34
                });
            }

            if ((layer === 2 || isForce) && Math.random() < 0.28) {
                microBubbles.push({
                    x: x + (Math.random() - 0.5) * 8,
                    y: y + (Math.random() - 0.5) * 3,
                    radius: 1.4 + Math.random() * 1.8,
                    life: 1.0,
                    decay: 0.022 + Math.random() * 0.025
                });
            }
        };

        const lensDroplets = [];
        for (let i = 0; i < 8; i++) {
            lensDroplets.push({
                x: Math.random() * (width || 1200),
                y: Math.random() * (height || 800),
                radius: 2.0 + Math.random() * 2.8,
                opacity: 0.25 + Math.random() * 0.3,
                life: 0.5 + Math.random() * 0.5
            });
        }

        const rainDrops = [];
        [75, 55, 30].forEach((count, layerIdx) => {
            for (let i = 0; i < count; i++) {
                rainDrops.push(new RainDrop(layerIdx, true));
            }
        });

        const animate = (currentTime) => {
            if (!isVisible) {
                animationFrameId = requestAnimationFrame(animate);
                return;
            }

            ctx.clearRect(0, 0, width, height);

            const gustVelocity = Math.sin(currentTime * 0.0011) * 0.06 + Math.cos(currentTime * 0.0027) * 0.03;
            windAngle = baseWindAngle + gustVelocity;

            for (let i = ripples.length - 1; i >= 0; i--) {
                const r = ripples[i];
                r.rx += r.speed;
                r.ry = r.rx * 0.32;
                const progress = r.rx / r.maxRadius;
                const currentAlpha = r.opacity * (1 - progress * progress);

                if (progress >= 1 || currentAlpha <= 0) {
                    ripples.splice(i, 1);
                    continue;
                }

                ctx.save();
                ctx.beginPath();
                ctx.ellipse(r.x, r.y, r.rx, r.ry, 0, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(215, 238, 255, ${currentAlpha})`;
                ctx.lineWidth = r.lineWidth * (1 - progress * 0.5);
                ctx.stroke();

                if (r.rx > 5) {
                    ctx.beginPath();
                    ctx.ellipse(r.x, r.y, r.rx * 0.65, r.ry * 0.65, 0, 0, Math.PI * 2);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${currentAlpha * 0.5})`;
                    ctx.lineWidth = r.lineWidth * 0.6;
                    ctx.stroke();
                }
                ctx.restore();
            }

            rainDrops.forEach(drop => {
                drop.update(currentTime, windAngle);
                drop.draw();
            });

            for (let i = splashBeads.length - 1; i >= 0; i--) {
                const b = splashBeads[i];
                b.x += b.vx;
                b.y += b.vy;
                b.vy += b.gravity;
                b.opacity -= 0.032;

                if (b.opacity <= 0) {
                    splashBeads.splice(i, 1);
                    continue;
                }

                ctx.save();
                ctx.beginPath();
                ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(240, 248, 255, ${b.opacity})`;
                ctx.fill();
                ctx.restore();
            }

            for (let i = microBubbles.length - 1; i >= 0; i--) {
                const mb = microBubbles[i];
                mb.life -= mb.decay;

                if (mb.life <= 0) {
                    ripples.push({
                        x: mb.x, y: mb.y,
                        rx: mb.radius, ry: mb.radius * 0.35,
                        speed: 0.4,
                        maxRadius: mb.radius * 3.5,
                        opacity: 0.35,
                        lineWidth: 0.6
                    });
                    microBubbles.splice(i, 1);
                    continue;
                }

                ctx.save();
                ctx.beginPath();
                ctx.arc(mb.x, mb.y, mb.radius, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(255, 255, 255, ${mb.life * 0.6})`;
                ctx.lineWidth = 0.7;
                ctx.stroke();

                ctx.beginPath();
                ctx.arc(mb.x - mb.radius * 0.3, mb.y - mb.radius * 0.3, mb.radius * 0.35, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${mb.life * 0.85})`;
                ctx.fill();
                ctx.restore();
            }

            lensDroplets.forEach(ld => {
                ld.life -= 0.0008;
                if (ld.life <= 0) {
                    ld.x = Math.random() * width;
                    ld.y = Math.random() * height * 0.8;
                    ld.radius = 1.8 + Math.random() * 2.5;
                    ld.opacity = 0.25 + Math.random() * 0.3;
                    ld.life = 0.6 + Math.random() * 0.6;
                }

                ctx.save();
                ctx.translate(ld.x, ld.y);

                const dropGrad = ctx.createRadialGradient(-ld.radius * 0.2, -ld.radius * 0.2, 0.5, 0, 0, ld.radius);
                dropGrad.addColorStop(0, `rgba(255, 255, 255, ${ld.opacity * 0.8})`);
                dropGrad.addColorStop(0.6, `rgba(180, 220, 250, ${ld.opacity * 0.2})`);
                dropGrad.addColorStop(1, `rgba(0, 40, 80, ${ld.opacity * 0.4})`);

                ctx.beginPath();
                ctx.arc(0, 0, ld.radius, 0, Math.PI * 2);
                ctx.fillStyle = dropGrad;
                ctx.fill();

                ctx.beginPath();
                ctx.arc(-ld.radius * 0.3, -ld.radius * 0.3, Math.max(0.6, ld.radius * 0.28), 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${ld.opacity * 0.9})`;
                ctx.fill();

                ctx.restore();
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        if ('IntersectionObserver' in window && heroSection) {
            const heroObserver = new IntersectionObserver((entries) => {
                isVisible = entries[0].isIntersecting;
            }, { threshold: 0.05 });
            heroObserver.observe(heroSection);
        }

        animate(performance.now());
    }
});
