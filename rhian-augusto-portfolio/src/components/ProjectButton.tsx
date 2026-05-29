import React, { useState, MouseEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Spark {
  id: number;
  x: number;
  y: number;
}

interface Particle {
  id: string;
  x: number;
  y: number;
  angle: number;
  distance: number;
}

export function ProjectButton({ href, children }: { href: string; children: React.ReactNode }) {
  const [sparks, setSparks] = useState<Spark[]>([]);

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newSpark = { id: Date.now(), x, y };
    setSparks((prev) => [...prev, newSpark]);
    
    setTimeout(() => {
      setSparks((prev) => prev.filter((s) => s.id !== newSpark.id));
    }, 600);
  };

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      initial={{ outline: '1px solid rgba(0,0,0,0)' }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="relative z-10 inline-flex items-center gap-3 px-6 py-3 text-sm font-medium text-neutral-800 bg-white rounded-2xl overflow-hidden group shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 transition-shadow duration-500"
    >
      {/* Border Glow Gradient */}
      <div 
        className="absolute inset-[0px] z-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          background: 'linear-gradient(45deg, transparent 20%, rgba(200,200,200,0.4) 50%, transparent 80%)',
          backgroundSize: '200% 200%',
          animation: 'shimmer 3s infinite linear'
        }}
      />
      
      {/* Animated Subtle Border */}
      <div className="absolute inset-0 rounded-2xl border border-neutral-300 group-hover:border-neutral-400 transition-colors duration-500" />
      
      {/* Content wrapper */}
      <div className="relative z-10 flex items-center gap-3">
        <span className="tracking-tight">{children}</span>
        <motion.div 
          className="flex items-center justify-center w-6 h-6 rounded-full bg-neutral-100 group-hover:bg-neutral-900 group-hover:text-white transition-colors duration-500"
        >
          <svg
            className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </motion.div>
      </div>

      {/* Click Spark Particles */}
      <AnimatePresence>
        {sparks.map((spark) => (
          <React.Fragment key={spark.id}>
            {/* Expanding Ring */}
            <motion.div
              initial={{ opacity: 0.5, scale: 0.2 }}
              animate={{ opacity: 0, scale: 2.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute w-32 h-32 rounded-full border border-neutral-400 pointer-events-none z-20"
              style={{ left: spark.x - 64, top: spark.y - 64 }}
            />
            
            {/* Particles */}
            {Array.from({ length: 8 }).map((_, i) => {
              const angle = (i / 8) * Math.PI * 2;
              const distance = 40 + Math.random() * 20;
              return (
                <motion.div
                  key={`${spark.id}-${i}`}
                  initial={{ 
                    opacity: 1, 
                    x: spark.x, 
                    y: spark.y,
                    scale: Math.random() * 0.5 + 0.5 
                  }}
                  animate={{ 
                    opacity: 0, 
                    x: spark.x + Math.cos(angle) * distance, 
                    y: spark.y + Math.sin(angle) * distance,
                    scale: 0
                  }}
                  transition={{ duration: 0.4 + Math.random() * 0.2, ease: "easeOut" }}
                  className="absolute w-1.5 h-1.5 rounded-full bg-neutral-600 pointer-events-none z-20"
                />
              );
            })}
          </React.Fragment>
        ))}
      </AnimatePresence>
    </motion.a>
  );
}
