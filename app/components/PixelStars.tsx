"use client";

import { useMemo } from "react";
import styles from "./PixelStars.module.css";

interface Star {
  id: number;
  x: number;
  y: number;
  delay: number;
}

export default function PixelStars() {
  const stars = useMemo<Star[]>(() => {
    const pseudoRandom = (seed: number) => {
      const x = Math.sin(seed * 12.9898) * 43758.5453;
      return x - Math.floor(x);
    };

    return Array.from({ length: 40 }, (_, id) => ({
      id,
      x: pseudoRandom(id + 1) * 100,
      y: pseudoRandom(id + 101) * 100,
      delay: pseudoRandom(id + 201) * 3,
    }));
  }, []);

  return (
    <div className={styles.starfield}>
      {stars.map((star) => (
        <div
          key={star.id}
          className={styles.star}
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
