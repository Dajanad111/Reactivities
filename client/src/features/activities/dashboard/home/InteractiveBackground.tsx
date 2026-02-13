import React, { useEffect, useRef, type ReactNode } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  symbol: string;
  rotation: number;
  rotationSpeed: number;
}

interface InteractiveBackgroundProps {
  children?: ReactNode;
}

const InteractiveBackground: React.FC<InteractiveBackgroundProps> = ({ children }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create particles
    const symbols = ['+', '×', '◆', '○', '▪', '✦', '✧', '●', '■'];
    const particleCount = 400;

    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 15 + 10,
      speedX: (Math.random() - 0.5) * 1.5,
      speedY: (Math.random() - 0.5) * 1.5,
      opacity: Math.random() * 0.4 + 0.3,
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
    }));

    console.log('✅ Created', particleCount, 'particles');

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    const animate = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle) => {
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        particle.rotation += particle.rotationSpeed;

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;

        // Mouse interaction
        const dx = mouseRef.current.x - particle.x;
        const dy = mouseRef.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 150;

        let scale = 1;
        let currentOpacity = particle.opacity;

        if (distance < maxDistance) {
          const force = (maxDistance - distance) / maxDistance;
          scale = 1 + force * 1.5;
          currentOpacity = Math.min(1, particle.opacity + force * 0.6);

          // Repel particles
          const angle = Math.atan2(dy, dx);
          particle.x -= Math.cos(angle) * force * 6;
          particle.y -= Math.sin(angle) * force * 6;
        }

        // Draw particle
        ctx.save();
        ctx.translate(particle.x, particle.y);
        ctx.rotate(particle.rotation);
        ctx.font = `${particle.size * scale}px Arial`;
        ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity})`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        if (scale > 1.3) {
          ctx.shadowBlur = 20;
          ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
        }

        ctx.fillText(particle.symbol, 0, 0);
        ctx.restore();
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        backgroundImage: 'linear-gradient(135deg, #182a73 0%, #218aae 69%, #20a7ac 89%)',
        overflow: 'hidden',
      }}
    >
      {/* Canvas layer */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Content layer */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        {children}
      </div>
    </div>
  );
};

export default InteractiveBackground;