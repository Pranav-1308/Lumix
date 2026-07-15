import { useEffect, useRef } from "react";
import "./AuthLayout.css";

function AuthLayout({ headline, sub, features, children }) {
  const canvasRef = useRef(null);
  const leftPanelRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const leftPanel = leftPanelRef.current;
    if (!canvas || !leftPanel) return;

    const ctx = canvas.getContext("2d");
    let w, h;
    let particles = [];
    const COUNT = 46;
    const MAX_DIST = 130;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function resize() {
      w = canvas.width = leftPanel.clientWidth;
      h = canvas.height = leftPanel.clientHeight;
    }

    function init() {
      particles = Array.from({ length: COUNT }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.6 + 1
      }));
    }

    let animationFrameId;

    function step() {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
      }
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            ctx.strokeStyle = `rgba(255,255,255,${0.14 * (1 - dist / MAX_DIST)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.55)";
        ctx.fill();
      }
      if (!reduceMotion) {
        animationFrameId = requestAnimationFrame(step);
      }
    }

    resize();
    init();
    step();

    const handleResize = () => {
      resize();
      init();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <div className="page">
      <div className="left" ref={leftPanelRef}>
        <canvas ref={canvasRef} id="network"></canvas>
        <div className="brand">
          <div className="logo">LUMIX</div>
          <h1 className="headline">{headline}</h1>
          <p className="sub">{sub}</p>
          {features && features.length > 0 && (
            <div className="features">
              {features.map((feature, idx) => (
                <div key={idx} className="feature">
                  <span className="badge">{feature.icon}</span> {feature.text}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="right">
        <div className="card">
          {children}
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
