gsap.registerPlugin(ScrollTrigger);
const lenis = new Lenis();

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
    lenis.raf(time * 800);
});

gsap.ticker.lagSmoothing(0);

const rootElement = document.documentElement;
let shadowResetTimeout;

const resetScrollShadow = () => {
    rootElement.style.setProperty('--shadow-x', '0px');
    rootElement.style.setProperty('--shadow-y', '0px');
    rootElement.style.setProperty('--shadow-blur', '0px');
    rootElement.style.setProperty('--shadow-opacity', '0');
};

const updateScrollShadow = (velocity = 0) => {
    const absVelocity = Math.abs(velocity);
    if (absVelocity < 0.01) {
        resetScrollShadow();
        return;
    }
    let maxOffset = 10;
    if (window.innerWidth < 820) {
        maxOffset = 5;
    }
    const dynamicSpread = Math.min(maxOffset, absVelocity * 8 + 2);
    const offsetY = velocity > 0 ? dynamicSpread : -dynamicSpread;
    const offsetX = 0;
    const opacity = Math.min(0.85, 0.3 + absVelocity / 2.5);

    rootElement.style.setProperty('--shadow-x', `${offsetX}px`);
    rootElement.style.setProperty('--shadow-y', `${offsetY}px`);
    rootElement.style.setProperty('--shadow-opacity', opacity.toFixed(2));

    clearTimeout(shadowResetTimeout);
    shadowResetTimeout = setTimeout(resetScrollShadow, 150);
};

lenis.on('scroll', ({ velocity }) => {
    updateScrollShadow(velocity);
});


const targetDate = new Date("Dec 10, 2025 00:00:00").getTime();
const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");
let countdownInitialized = false;

const formatCountdownNumber = (value) => String(value).padStart(2, '0');

const animateCountUp = (el, targetValue, duration = 2000) => {
    const startValue = 0;
    const startTime = performance.now();

    const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 3); // easeOutCubic
        const currentValue = Math.floor(startValue + (targetValue - startValue) * easedProgress);

        el.innerText = formatCountdownNumber(currentValue);

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            el.innerText = formatCountdownNumber(targetValue);
        }
    };

    requestAnimationFrame(animate);
};

const updateCountdown = () => {
    const now = new Date().getTime();
    const distance = targetDate - now;

    const days = Math.max(0, Math.floor(distance / (1000 * 60 * 60 * 24)));
    const hours = Math.max(0, Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
    const minutes = Math.max(0, Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));
    const seconds = Math.max(0, Math.floor((distance % (1000 * 60)) / 1000));

    if (!countdownInitialized) {
        animateCountUp(daysEl, days);
        animateCountUp(hoursEl, hours);
        animateCountUp(minutesEl, minutes);
        animateCountUp(secondsEl, seconds);
        countdownInitialized = true;
    } else {
        daysEl.innerText = formatCountdownNumber(days);
        hoursEl.innerText = formatCountdownNumber(hours);
        minutesEl.innerText = formatCountdownNumber(minutes);
        secondsEl.innerText = formatCountdownNumber(seconds);
    }

    if (distance < 0) {
        clearInterval(timer);
        document.querySelector(".deadline-text").innerText = "SUBMISSIONS CLOSED";
    }
};

const timer = setInterval(updateCountdown, 1000);
updateCountdown();



document.addEventListener('DOMContentLoaded', () => {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');

        questionBtn.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // 1. Close all other items (Optional: Remove if you want multiple open)
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-answer').style.maxHeight = null;
                }
            });

            // 2. Toggle current item
            item.classList.toggle('active');

            // 3. Smooth height animation
            const answerDiv = item.querySelector('.faq-answer');
            if (!isActive) {
                answerDiv.style.maxHeight = answerDiv.scrollHeight + "px";
            } else {
                answerDiv.style.maxHeight = null;
            }
        });
    });

    // Navigation scroll-to functionality
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.querySelector('.navbar');
    const navbarHeight = navbar ? navbar.offsetHeight : 70; // Default to 70px if navbar not found

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');

            if (targetId && targetId.startsWith('#')) {
                const targetSection = document.querySelector(targetId);

                if (targetSection) {
                    const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

                    // Use Lenis smooth scroll if available, otherwise use native smooth scroll
                    if (lenis) {
                        lenis.scrollTo(targetPosition, {
                            duration: 1.2,
                            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
                        });
                    } else {
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                }
            }
        });
    });

    // Mobile Menu Toggle Functionality
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const body = document.body;

    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
            body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking on a nav link (mobile)
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 820) {
                    navMenu.classList.remove('active');
                    mobileMenuToggle.classList.remove('active');
                    body.style.overflow = '';
                }
            });
        });

        // Close menu when clicking outside (mobile)
        navMenu.addEventListener('click', (e) => {
            if (e.target === navMenu && window.innerWidth <= 820) {
                navMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
                body.style.overflow = '';
            }
        });

        // Close menu on window resize if it becomes desktop size
        window.addEventListener('resize', () => {
            if (window.innerWidth > 820) {
                navMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
                body.style.overflow = '';
            }
        });
    }
});



document.addEventListener("DOMContentLoaded", () => {

    setTimeout(() => {
        const animatedElements = document.querySelectorAll("[animate]");
        animatedElements.forEach(el => {
            el.style.opacity = 1;
        });
        animatedElements.forEach(el => {
            // Split text
            const typeSplit = new SplitType(el, {
                types: "lines, words",
                tagName: "span"
            });

            // Animation
            gsap.from(el.querySelectorAll(".word"), {
                y: "100%",
                duration: 0.5,
                ease: "power2.out",
                stagger: 0.05,

                scrollTrigger: {
                    trigger: el,
                    start: "top 85%",   // 85% of viewport
                    toggleActions: "play none none reverse"
                }
            });

        });

        const animatedElements_ = document.querySelectorAll("[animate_]");
        animatedElements_.forEach(el => {
            el.style.opacity = 1;
        });
        animatedElements_.forEach(el => {
            // Split text
            const typeSplit = new SplitType(el, {
                types: "lines, words",
                tagName: "span"
            });

            // Animation
            gsap.from(el.querySelectorAll(".word"), {
                y: "100%",
                duration: 0.5,
                ease: "power2.out",
                stagger: 0.05,

                scrollTrigger: {
                    trigger: el,
                    start: "top bottom",   // 85% of viewport
                    toggleActions: "play none none reverse"
                }
            });

        });

    }, 300);
    gsap.from(".features-grid > div", {
        y: "100px",
        duration: 0.5,
        opacity: 0,
        ease: "power2.out",
        stagger: 0.1,
        scrollTrigger: {
            trigger: ".section-desc",
            start: "top bottom",
            toggleActions: "play none none reverse"
        }
    });
    gsap.from(".gemini-card", {
        y: "100px",
        duration: 0.5,
        ease: "power2.out",
        scrollTrigger: {
            trigger: ".gemini-card",
            start: "top bottom",
            toggleActions: "play none none reverse",
        }
    });
    gsap.from(".gate-card", {
        y: "100px",
        duration: 0.5,
        filter: "blur(10px)",
        opacity: 0,
        ease: "power2.out",
        scrollTrigger: {
            trigger: ".gate-card",
            start: "top 95%",
            toggleActions: "play none none reverse",
        }
    });

    if (window.innerWidth > 820) {
        gsap.to('.what-we-are-looking-for .category-list > div', {
            x: "0px",
            opacity: 1,
            filter: "blur(0px)",
            ease: "none",
            duration: 1,
            ease: "power2.out",
            stagger: 0.05,
            scrollTrigger: {
                trigger: '.what-we-are-looking-for .category-list',
                start: 'top 85%',
                toggleActions: 'play none none reverse'

            }
        });
    } else {
        const criteriaCards = document.querySelectorAll('.what-we-are-looking-for .category-list > div');
        criteriaCards.forEach((card, index) => {
            gsap.to(card, {
                x: "0px",
                opacity: 1,
                filter: "blur(0px)",
                duration: 1,
                ease: "power2.out",
                delay: index * 0.05,
                scrollTrigger: {
                    trigger: card,
                    start: 'top bottom',
                    toggleActions: 'play none none reverse'
                }
            });
        });
    }

    let hasAnimated = true;
    // F    unction to animate percentage numbers from 00 to target
    const animateCriteriaPercentages = () => {
        const percentageElements = document.querySelectorAll('.judging-criteria .card-percentage');
        if (hasAnimated) {
            percentageElements.forEach((el) => {
                const text = el.textContent.trim();
                const targetValue = parseInt(text.replace('%', ''));

                if (isNaN(targetValue)) return;

                // Set initial value to 00
                el.textContent = '00%';

                // Animate to target value
                gsap.to({ value: 0 }, {
                    value: targetValue,
                    duration: 1.5,
                    ease: "power2.out",
                    onUpdate: function () {
                        const currentValue = Math.round(this.targets()[0].value);
                        el.textContent = currentValue + '%';
                    }
                });
            });
        }
        hasAnimated = false;
    };

    if (window.innerWidth > 820) {
        gsap.to('.judging-criteria .criteria-grid > div', {
            y: "0px",
            opacity: 1,
            filter: "blur(0px)",
            ease: "power2.out",
            duration: 1,
            stagger: 0.05,
            scrollTrigger: {
                trigger: '.judging-criteria .criteria-grid',
                start: 'top 85%',
                toggleActions: 'play none none reverse',
                onEnter: () => {
                    setTimeout(() => {
                        // animateCriteriaPercentages();
                    }, 500);
                }
            }
        });
    } else {
        const criteriaCards = document.querySelectorAll('.judging-criteria .criteria-grid > div');
        let hasAnimated = false;

        criteriaCards.forEach((card, index) => {
            gsap.to(card, {
                x: "0px",
                opacity: 1,
                filter: "blur(0px)",
                duration: 1,
                ease: "power2.out",
                delay: index * 0.05,
                scrollTrigger: {
                    trigger: card,
                    start: 'top bottom',
                    toggleActions: 'play none none reverse',
                    onEnter: () => {
                        if (!hasAnimated) {
                            // animateCriteriaPercentages();                            
                        }
                    }
                }
            });
        });
    }

    // gsap.to('.steps-container .step-wrapper', {
    //     y: "0px",
    //     opacity: 1,
    //     filter: "blur(0px)",
    //     ease: "none",
    //     duration: 1,
    //     ease: "power2.out",
    //     stagger: 0.05,
    //     scrollTrigger: {
    //         trigger: '.steps-container',
    //         start: 'top 85%',
    //         toggleActions: 'play none none reverse'

    //     }
    // });


    gsap.to('.faq-list .faq-item', {
        y: "0px",
        opacity: 1,
        ease: "none",
        duration: 1,
        ease: "power2.out",
        stagger: 0.1,
        scrollTrigger: {
            trigger: '.faq-list',
            start: 'top 85%',
            toggleActions: 'play none none reverse'

        }
    });

    // Parallax effect for m1, m2, m3 elements
    const parallaxElements = {
        m1: document.querySelectorAll('.m1'),
        m2: document.querySelectorAll('.m2'),
        m3: document.querySelectorAll('.m3')
    };

    // Parallax for m1 - moves up when scrolling down
    parallaxElements.m1.forEach((el) => {
        gsap.to(el, {
            y: -50,
            ease: "none",
            scrollTrigger: {
                trigger: el.closest('section, div') || document.body,
                start: "top bottom",
                end: "bottom top",
                scrub: 1
            }
        });
    });

    // Parallax for m2 - moves down when scrolling down (opposite direction)
    parallaxElements.m2.forEach((el) => {
        gsap.to(el, {
            y: 50,
            ease: "none",
            scrollTrigger: {
                trigger: el.closest('section, div') || document.body,
                start: "top bottom",
                end: "bottom top",
                scrub: 1
            }
        });
    });

    // Parallax for m3 - moves up when scrolling down (same as m1, alternating pattern)
    parallaxElements.m3.forEach((el) => {
        gsap.to(el, {
            y: -50,
            ease: "none",
            scrollTrigger: {
                trigger: el.closest('section, div') || document.body,
                start: "top bottom",
                end: "bottom top",
                scrub: 1
            }
        });
    });

});