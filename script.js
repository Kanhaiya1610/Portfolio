document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. Custom Cursor Logic ---
    const cursorCrosshair = document.getElementById('cursor-crosshair');
    const cursorBbox = document.getElementById('cursor-bbox');
    
    // Only run custom cursor logic if device has a fine pointer (mouse)
    if (window.matchMedia("(pointer: fine)").matches) {
        document.addEventListener('mousemove', (e) => {
            cursorCrosshair.style.left = e.clientX + 'px';
            cursorCrosshair.style.top = e.clientY + 'px';
            cursorBbox.style.left = e.clientX + 'px';
            cursorBbox.style.top = e.clientY + 'px';
        });

        // Enlarge cursor box over interactive elements
        document.querySelectorAll('a, button, .bbox-container').forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorBbox.style.opacity = '1';
                cursorBbox.style.width = '60px';
                cursorBbox.style.height = '60px';
            });
            el.addEventListener('mouseleave', () => {
                cursorBbox.style.opacity = '0';
                cursorBbox.style.width = '40px';
                cursorBbox.style.height = '40px';
            });
        });
    }

    // --- 2. Theme Toggle ---
    const themeBtn = document.getElementById('theme-toggle');
    
    // Load saved theme on initial load
    const savedTheme = localStorage.getItem('portfolio_theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    }
    
    // Handle toggle click
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('portfolio_theme', newTheme);
        });
    }

    // --- 3. Terminal Typing Effect ---
    const termText = "Kanhaiya Lal\nAI / ML Engineer · Computer Vision · LLM Systems";
    const typedElement = document.getElementById('typed-text');
    let typeIndex = 0;
    
    function typeWriter() {
        if (typeIndex < termText.length) {
            if(termText.charAt(typeIndex) === '\n') {
                typedElement.innerHTML += '<br>';
            } else {
                typedElement.innerHTML += termText.charAt(typeIndex);
            }
            typeIndex++;
            setTimeout(typeWriter, 40);
        }
    }
    // Start typing after a short delay
    setTimeout(typeWriter, 600);

    // --- 4. Sakura Petals Particles (Canvas) ---
    const canvas = document.getElementById('sakura-canvas');
    const ctx = canvas.getContext('2d');
    let petals = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Petal {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height - canvas.height;
            this.size = Math.random() * 3 + 1.5;
            this.speedY = Math.random() * 1 + 0.5;
            this.speedX = Math.random() * 1.5 - 0.75;
            this.rotation = Math.random() * 360;
            this.rotationSpeed = Math.random() * 2 - 1;
        }
        update() {
            this.y += this.speedY;
            this.x += this.speedX + Math.sin(this.y * 0.01);
            this.rotation += this.rotationSpeed;
            // Reset to top when falling off screen
            if (this.y > canvas.height) {
                this.y = -10;
                this.x = Math.random() * canvas.width;
            }
        }
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation * Math.PI / 180);
            
            // Adapt petal color slightly based on theme
            const isLight = document.documentElement.getAttribute('data-theme') === 'light';
            ctx.fillStyle = isLight ? 'rgba(211, 47, 47, 0.5)' : 'rgba(232, 56, 61, 0.4)';
            
            ctx.beginPath();
            ctx.ellipse(0, 0, this.size, this.size * 0.6, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    // Check for prefers-reduced-motion to disable particles for accessibility
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (!prefersReducedMotion.matches) {
        // Initialize petals
        for (let i = 0; i < 25; i++) {
            petals.push(new Petal());
        }
        function animatePetals() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            petals.forEach(p => { p.update(); p.draw(); });
            requestAnimationFrame(animatePetals);
        }
        animatePetals();
    }

    // --- 5. GSAP Scroll Animations ---
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && !prefersReducedMotion.matches) {
        gsap.registerPlugin(ScrollTrigger);
        
        // Fade in sections on scroll
        document.querySelectorAll('.fade-in').forEach(sec => {
            gsap.from(sec, {
                scrollTrigger: {
                    trigger: sec,
                    start: "top 85%",
                },
                y: 40,
                opacity: 0,
                duration: 0.8,
                ease: "power2.out"
            });
        });

        // Abstract SVG float animation in Hero
        gsap.to('.hero-visual svg', {
            y: -15,
            duration: 3,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    }
});
