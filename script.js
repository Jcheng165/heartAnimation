document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.container');
    const heart = document.querySelector('.heart-container');
    const heartOutline = document.querySelector('.heart-outline');
    const heartFill = document.querySelector('.heart');
    const canvas = document.querySelector('.particle-canvas');
    const ctx = canvas.getContext('2d');
    const firefliesContainer = document.querySelector('.fireflies');
    const sparklesContainer = document.querySelector('.sparkles');
    const loveMessages = document.querySelector('.love-messages');
    
    // Create cursor elements
    const cursorGlow = document.createElement('div');
    cursorGlow.className = 'cursor-glow';
    document.body.appendChild(cursorGlow);

    const cursorTrail = document.createElement('div');
    cursorTrail.className = 'cursor-trail';
    document.body.appendChild(cursorTrail);

    const cursorBurst = document.createElement('div');
    cursorBurst.className = 'cursor-burst';
    document.body.appendChild(cursorBurst);

    let lastX = 0;
    let lastY = 0;
    let isIdle = false;
    let idleTimeout;
    let lastTrailTime = 0;
    const trailInterval = 50; // Minimum time between trail particles

    const messages = [
        'Forever', 'My Love', 'You & Me', 'Eternal', 'Together',
        'Always', 'Destiny', 'Soulmate', 'Love', 'Heart & Soul'
    ];

    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle system
    class Particle {
        constructor(x, y, color) {
            this.x = x;
            this.y = y;
            this.color = color;
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 2 - 1;
            this.speedY = Math.random() * 2 - 1;
            this.life = 1;
            this.decay = Math.random() * 0.02 + 0.02;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.speedY -= 0.02; // Gravity effect
            this.life -= this.decay;
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.life;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.restore();
        }
    }

    let particles = [];
    let drawProgress = 0;
    let lastDrawTime = 0;
    const drawSpeed = 0.001;

    // Create drawing particles
    function createDrawingParticle(x, y) {
        const colors = ['#ffd700', '#ff69b4', '#ff1493'];
        particles.push(new Particle(
            x,
            y,
            colors[Math.floor(Math.random() * colors.length)]
        ));
    }

    // Animation loop
    function animate(timestamp) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update drawing progress
        if (drawProgress < 1) {
            const deltaTime = timestamp - lastDrawTime;
            drawProgress += drawSpeed * deltaTime;
            lastDrawTime = timestamp;

            // Create particles along the path
            const point = heartOutline.getPointAtLength(drawProgress * heartOutline.getTotalLength());
            createDrawingParticle(point.x + heart.offsetLeft, point.y + heart.offsetTop);
        }

        // Update and draw particles
        particles = particles.filter(particle => {
            particle.update();
            particle.draw();
            return particle.life > 0;
        });

        requestAnimationFrame(animate);
    }

    // Start animation
    requestAnimationFrame(animate);

    // Create stars in background
    function createStars() {
        const stars = document.querySelector('.stars');
        for (let i = 0; i < 50; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            star.style.animationDelay = `${Math.random() * 3}s`;
            stars.appendChild(star);
        }
    }
    createStars();

    // Create hover sparkle effect
    function createHoverSparkle(e, element) {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle-hover';
        sparkle.style.left = `${x}px`;
        sparkle.style.top = `${y}px`;
        
        // Random movement direction
        const angle = Math.random() * Math.PI * 2;
        const distance = 50 + Math.random() * 50;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance - distance; // Bias upward
        
        sparkle.style.setProperty('--tx', `${tx}px`);
        sparkle.style.setProperty('--ty', `${ty}px`);
        
        element.appendChild(sparkle);
        
        setTimeout(() => sparkle.remove(), 1500);
    }

    // Create initial fireflies
    function createFireflies(count) {
        for (let i = 0; i < count; i++) {
            const firefly = document.createElement('div');
            firefly.className = 'firefly';
            firefly.style.left = `${Math.random() * 100}%`;
            firefly.style.top = `${Math.random() * 100}%`;
            firefly.style.animationDelay = `${Math.random() * 4}s`;
            firefliesContainer.appendChild(firefly);
        }
    }

    // Create floating love messages
    function createLoveMessage() {
        const message = document.createElement('div');
        message.className = 'message';
        message.textContent = messages[Math.floor(Math.random() * messages.length)];
        message.style.left = `${20 + Math.random() * 60}%`;
        message.style.top = `${50 + Math.random() * 20}%`;
        loveMessages.appendChild(message);

        setTimeout(() => message.remove(), 4000);
    }

    // Create sparkles following cursor
    function createSparkle(x, y) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.left = `${x}px`;
        sparkle.style.top = `${y}px`;
        sparklesContainer.appendChild(sparkle);

        setTimeout(() => sparkle.remove(), 2000);
    }

    // Create floating hearts on click
    function createFloatingHeart(x, y) {
        const heart = document.createElement('div');
        heart.className = 'message';
        heart.textContent = '♥';
        heart.style.left = `${x}px`;
        heart.style.top = `${y}px`;
        heart.style.color = `hsl(${Math.random() * 60 + 330}, 100%, 70%)`;
        loveMessages.appendChild(heart);

        setTimeout(() => heart.remove(), 4000);
    }

    // Update cursor glow position
    function updateCursorGlow(e) {
        const currentX = e.clientX;
        const currentY = e.clientY;
        
        // Calculate speed for stretching effect
        const dx = currentX - lastX;
        const dy = currentY - lastY;
        const speed = Math.sqrt(dx * dx + dy * dy);
        
        // Adjust glow size based on movement speed
        const size = Math.min(20 + speed * 0.5, 40);
        cursorGlow.style.width = `${size}px`;
        cursorGlow.style.height = `${size}px`;
        
        cursorGlow.style.left = `${currentX}px`;
        cursorGlow.style.top = `${currentY}px`;
        
        lastX = currentX;
        lastY = currentY;
    }

    // Create trail particle
    function createTrailParticle(x, y) {
        const now = Date.now();
        if (now - lastTrailTime < trailInterval) return;
        lastTrailTime = now;

        const particle = document.createElement('div');
        particle.className = 'trail-particle';
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        cursorTrail.appendChild(particle);

        setTimeout(() => particle.remove(), 1000);

        // Randomly create floating hearts
        if (Math.random() < 0.3) {
            createFloatingCursorHeart(x, y);
        }
    }

    // Create floating cursor heart
    function createFloatingCursorHeart(x, y) {
        const heart = document.createElement('div');
        heart.className = 'cursor-heart';
        heart.innerHTML = '♥';
        heart.style.left = `${x}px`;
        heart.style.top = `${y}px`;
        document.body.appendChild(heart);

        setTimeout(() => heart.remove(), 1500);
    }

    // Create burst effect
    function createBurst(x, y) {
        const burstCount = 8;
        for (let i = 0; i < burstCount; i++) {
            const heart = document.createElement('div');
            heart.className = 'burst-heart';
            heart.innerHTML = '♥';
            heart.style.left = `${x}px`;
            heart.style.top = `${y}px`;
            heart.style.setProperty('--rotation', `${(360 / burstCount) * i}deg`);
            cursorBurst.appendChild(heart);

            setTimeout(() => heart.remove(), 1000);
        }
    }

    // Create idle sparkle
    function createIdleSparkle(x, y) {
        if (!isIdle) return;
        
        const sparkle = document.createElement('div');
        sparkle.className = 'idle-sparkle';
        const angle = Math.random() * Math.PI * 2;
        const distance = 20 + Math.random() * 20;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        
        sparkle.style.left = `${x}px`;
        sparkle.style.top = `${y}px`;
        sparkle.style.setProperty('--tx', `${tx}px`);
        sparkle.style.setProperty('--ty', `${ty}px`);
        
        document.body.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 2000);
    }

    // Event Listeners for cursor effects
    document.addEventListener('mousemove', (e) => {
        updateCursorGlow(e);
        createTrailParticle(e.clientX, e.clientY);
        
        // Reset idle state
        isIdle = false;
        clearTimeout(idleTimeout);
        idleTimeout = setTimeout(() => {
            isIdle = true;
            // Start creating idle sparkles
            const createSparkleInterval = setInterval(() => {
                if (!isIdle) {
                    clearInterval(createSparkleInterval);
                    return;
                }
                createIdleSparkle(lastX, lastY);
            }, 300);
        }, 1000);
    });

    document.addEventListener('click', (e) => {
        createBurst(e.clientX, e.clientY);
    });

    // Event Listeners
    container.addEventListener('mousemove', (e) => {
        if (Math.random() < 0.3) {
            createSparkle(e.clientX, e.clientY);
        }
    });

    heart.addEventListener('mousemove', (e) => {
        if (Math.random() < 0.5) { // Higher frequency for hover sparkles
            createHoverSparkle(e, heart);
        }
    });

    heart.addEventListener('click', (e) => {
        const rect = heart.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                createFloatingHeart(
                    centerX + (Math.random() - 0.5) * 100,
                    centerY + (Math.random() - 0.5) * 100
                );
            }, i * 100);
        }
    });

    // Initialize
    createFireflies(15);
    setInterval(createLoveMessage, 3000);

    // Add dynamic glow effect to heart
    let glowIntensity = 2;
    let increasing = true;

    setInterval(() => {
        if (increasing) {
            glowIntensity += 0.1;
            if (glowIntensity >= 3) increasing = false;
        } else {
            glowIntensity -= 0.1;
            if (glowIntensity <= 2) increasing = true;
        }
        document.querySelector('#glow feGaussianBlur').setAttribute('stdDeviation', glowIntensity);
    }, 50);
}); 