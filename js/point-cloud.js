/**
 * Interactive Point Cloud Background
 * LiDAR-style particle system with mouse interaction
 */

class PointCloud {
    constructor() {
        this.canvas = document.getElementById('point-cloud-canvas');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null, radius: 150 };
        this.particleCount = 150;

        this.colors = {
            cyan: { r: 102, g: 252, b: 241 },
            teal: { r: 69, g: 162, b: 158 }
        };

        this.init();
        this.setupEventListeners();
        this.animate();
    }

    init() {
        this.resize();
        this.createParticles();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        this.particles = [];

        for (let i = 0; i < this.particleCount; i++) {
            // Random position
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;

            // Random velocity for floating motion
            const vx = (Math.random() - 0.5) * 0.5;
            const vy = (Math.random() - 0.5) * 0.5;

            // Random size (depth simulation) - smaller for finer point cloud
            const size = Math.random() * 1.5 + 0.5;

            // Random color (cyan or teal)
            const color = Math.random() > 0.5 ? this.colors.cyan : this.colors.teal;

            // Random opacity based on size (smaller = farther = dimmer)
            const opacity = (size / 2) * 0.6 + 0.3;

            this.particles.push({
                x, y,
                vx, vy,
                size,
                color,
                opacity,
                baseX: x,
                baseY: y
            });
        }
    }

    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.resize();
            this.createParticles();
        });

        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.x;
            this.mouse.y = e.y;
        });

        window.addEventListener('mouseout', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }

    drawParticle(particle) {
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, ${particle.opacity})`;
        this.ctx.fill();
    }

    updateParticle(particle) {
        // Random floating motion
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around edges
        if (particle.x > this.canvas.width + particle.size) {
            particle.x = -particle.size;
            particle.baseX = particle.x;
        }
        if (particle.x < -particle.size) {
            particle.x = this.canvas.width + particle.size;
            particle.baseX = particle.x;
        }
        if (particle.y > this.canvas.height + particle.size) {
            particle.y = -particle.size;
            particle.baseY = particle.y;
        }
        if (particle.y < -particle.size) {
            particle.y = this.canvas.height + particle.size;
            particle.baseY = particle.y;
        }

        // Mouse interaction - particles move away from cursor
        if (this.mouse.x !== null && this.mouse.y !== null) {
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.mouse.radius) {
                const force = (this.mouse.radius - distance) / this.mouse.radius;
                const angle = Math.atan2(dy, dx);

                // Push particles away from mouse
                const pushX = Math.cos(angle) * force * 5;
                const pushY = Math.sin(angle) * force * 5;

                particle.x -= pushX;
                particle.y -= pushY;

                // Increase opacity when interacting
                particle.opacity = Math.min(1, particle.opacity + force * 0.3);
            } else {
                // Gradually return to base opacity
                const baseOpacity = (particle.size / 2) * 0.6 + 0.3;
                particle.opacity += (baseOpacity - particle.opacity) * 0.05;
            }
        }
    }

    animate() {
        // Clear canvas completely for crisp point cloud appearance
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Update and draw particles
        this.particles.forEach(particle => {
            this.updateParticle(particle);
            this.drawParticle(particle);
        });

        requestAnimationFrame(() => this.animate());
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new PointCloud());
} else {
    new PointCloud();
}
