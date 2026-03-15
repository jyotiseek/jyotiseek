document.addEventListener('DOMContentLoaded', () => {
    
    // 1. MOBILE MENU
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const closeBtn = document.getElementById('close-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    function toggleMenu(show) {
        if (!mobileMenu) return;
        if (show) {
            mobileMenu.classList.remove('opacity-0', 'pointer-events-none');
            mobileMenu.classList.add('opacity-100', 'pointer-events-auto');
        } else {
            mobileMenu.classList.remove('opacity-100', 'pointer-events-auto');
            mobileMenu.classList.add('opacity-0', 'pointer-events-none');
        }
    }

    if(mobileBtn) mobileBtn.addEventListener('click', () => toggleMenu(true));
    if(closeBtn) closeBtn.addEventListener('click', () => toggleMenu(false));
    mobileLinks.forEach(link => link.addEventListener('click', () => toggleMenu(false)));

    // 2. FORM SUBMISSION
    const form = document.getElementById('consultation-form');
    if(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button');
            const originalText = btn.innerText;
            btn.innerText = "Request Sent";
            btn.classList.add('bg-primary', 'text-white');
            setTimeout(() => {
                alert("Request received.");
                btn.innerText = originalText;
                btn.classList.remove('bg-primary', 'text-white');
                form.reset();
            }, 1000);
        });
    }

    // 3. ANIMATIONS (GSAP + LENIS)
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && typeof Lenis !== 'undefined') {
        
        gsap.registerPlugin(ScrollTrigger);

        const lenis = new Lenis();
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => { lenis.raf(time * 1000); });
        gsap.ticker.lagSmoothing(0);

        // Motion Image
        gsap.set('.image-motion', {
            transformPerspective: 1000,
            rotationX: 90,
        });

        gsap.to('.image-motion', {
            rotationX: 0,
            scrollTrigger: {
                trigger: '.section2',
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
                markers: false,
            },
        });

        // Text Animations
        gsap.fromTo('.title', 
            { opacity: 0, y: 50 }, 
            {
                opacity: 1, y: 0, duration: 1, ease: 'power3.out',
                scrollTrigger: { trigger: '.section3', start: 'top 80%', end: 'bottom 20%', toggleActions: 'play none none reverse' }
            }
        );

        gsap.fromTo('.subtitle', 
            { opacity: 0, y: 30 }, 
            {
                opacity: 1, y: 0, duration: 0.8, delay: 0.3, ease: 'power3.out',
                scrollTrigger: { trigger: '.section3', start: 'top 80%', end: 'bottom 20%', toggleActions: 'play none none reverse' }
            }
        );

        const textElements = document.querySelectorAll('.text-content .text');
        gsap.fromTo(textElements, 
            { opacity: 0, y: 30 }, 
            {
                opacity: 1, y: 0, stagger: 0.2, duration: 0.8, ease: 'power3.out',
                scrollTrigger: { trigger: '.text-content', start: 'top 80%', end: 'bottom 20%', toggleActions: 'play none none reverse' }
            }
        );

        gsap.fromTo('.feature', 
            { opacity: 0, y: 50, scale: 0.9 }, 
            {
                opacity: 1, y: 0, scale: 1, stagger: 0.2, duration: 0.8, ease: 'power3.out',
                scrollTrigger: { trigger: '.features', start: 'top 80%', end: 'bottom 20%', toggleActions: 'play none none reverse' }
            }
        );
    }
});
