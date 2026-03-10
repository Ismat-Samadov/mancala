'use client';

import { useEffect, useState } from 'react';

interface StarData {
  id: number;
  top: string;
  left: string;
  size: string;
  duration: string;
  delay: string;
}

export default function Starfield() {
  const [stars, setStars] = useState<StarData[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const generated: StarData[] = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: `${1 + Math.random() * 2}px`,
      duration: `${2 + Math.random() * 3}s`,
      delay: `${Math.random() * 5}s`,
    }));

    setStars(generated);
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="starfield" aria-hidden="true">
      {stars.map((star) => (
        <div
          key={star.id}
          className="star"
          style={
            {
              top: star.top,
              left: star.left,
              width: star.size,
              height: star.size,
              '--duration': star.duration,
              '--delay': star.delay,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
