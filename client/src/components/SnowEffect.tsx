import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function SnowEffect() {
  const [snowflakes, setSnowflakes] = useState<{ id: number; left: number; duration: number; delay: number }[]>([]);

  useEffect(() => {
    // Generate snowflakes only on client side to avoid hydration mismatch
    const flakes = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100, // Random horizontal position %
      duration: Math.random() * 5 + 5, // 5-10s fall duration
      delay: Math.random() * 5, // Staggered start
    }));
    setSnowflakes(flakes);
  }, []);

  return (
    <div className="snow-container">
      {snowflakes.map((flake) => (
        <motion.div
          key={flake.id}
          initial={{ y: -20, opacity: 0 }}
          animate={{
            y: "110vh",
            opacity: [0, 0.8, 0],
            rotate: 360,
          }}
          transition={{
            duration: flake.duration,
            delay: flake.delay,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            position: "absolute",
            left: `${flake.left}%`,
            width: "8px",
            height: "8px",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            borderRadius: "50%",
            filter: "blur(1px)",
          }}
        />
      ))}
    </div>
  );
}
