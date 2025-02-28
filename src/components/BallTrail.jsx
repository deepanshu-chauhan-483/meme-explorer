import { useEffect, useRef } from "react";
import { useTheme } from "../contexts/ThemeContext"; // Import your theme context

export default function BallTrail() {
  const containerRef = useRef(null);
  const { darkMode } = useTheme(); // Get dark mode status

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const numBalls = 30;
    const balls = [];

    // Create balls
    for (let i = 0; i < numBalls; i++) {
      const ball = document.createElement("div");
      ball.classList.add("ball");
      container.appendChild(ball);
      balls.push({ element: ball, x: 0, y: 0, scale: 1 });
    }

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    document.addEventListener("mousemove", handleMouseMove);

    function animate() {
      let prevX = mouseX;
      let prevY = mouseY;

      balls.forEach((ball, index) => {
        const dx = prevX - ball.x;
        const dy = prevY - ball.y;

        ball.x += dx * 0.15;
        ball.y += dy * 0.15;

        const distance = Math.sqrt(dx * dx + dy * dy);
        ball.scale = Math.max(0.3, 1 - distance / 100);

        ball.element.style.transform = `translate(${ball.x}px, ${ball.y}px) scale(${ball.scale})`;
        ball.element.style.opacity = `${1 - index / numBalls}`;

        prevX = ball.x;
        prevY = ball.y;
      });

      requestAnimationFrame(animate);
    }

    animate();

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      balls.forEach((ball) => ball.element.remove());
    };
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none">
      <style>{`
        .ball {
          position: fixed;
          width: 20px;
          height: 20px;
          background-color: ${darkMode ? "white" : "black"}; /* Dark mode: Black, Light mode: White */
          border-radius: 50%;
          transform: translate(-50%, -50%);
        }
      `}</style>
    </div>
  );
}
