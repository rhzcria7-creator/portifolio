import React from 'react';
import { motion } from 'framer-motion';

export interface LogoItem {
    node?: React.ReactNode;
    src?: string;
    alt?: string;
    href?: string;
    title?: string;
}

interface LogoLoopProps {
    logos: LogoItem[];
    speed?: number;
    direction?: 'left' | 'right' | 'up' | 'down';
    width?: number | string;
    logoHeight?: number;
    gap?: number;
    hoverSpeed?: number;
    fadeOut?: boolean;
    fadeOutColor?: string;
    scaleOnHover?: boolean;
    renderItem?: (item: LogoItem, key: React.Key) => React.ReactNode;
    ariaLabel?: string;
    className?: string;
    style?: React.CSSProperties;
}

const LogoLoop: React.FC<LogoLoopProps> = ({
    logos,
    speed = 120,
    direction = 'left',
    width = '100%',
    logoHeight = 48,
    gap = 40,
    fadeOut = false,
    fadeOutColor = '#ffffff',
    scaleOnHover = false,
    className = '',
    style,
}) => {
    // Duplicate the logos array 3 times to ensure smooth infinite looping
    const duplicatedLogos = [...logos, ...logos, ...logos];

    // Determine motion variant based on direction 
    // Usually horizontal, but let's assume left to right just for simplicity to mimic the component need.
    const isHorizontal = direction === 'left' || direction === 'right';
    const isLeft = direction === 'left';

    return (
        <div 
            className={`relative overflow-hidden flex ${className}`}
            style={{ 
                width, 
                height: isHorizontal ? logoHeight + 'px' : '100%',
                ...style 
            }}
        >
            {/* Fade out edges */}
            {fadeOut && (
                <>
                    <div 
                        className="absolute top-0 bottom-0 left-0 w-16 z-10 pointer-events-none"
                        style={{
                            background: `linear-gradient(to right, ${fadeOutColor}, transparent)`
                        }}
                    />
                    <div 
                        className="absolute top-0 bottom-0 right-0 w-16 z-10 pointer-events-none"
                        style={{
                            background: `linear-gradient(to left, ${fadeOutColor}, transparent)`
                        }}
                    />
                </>
            )}

            <motion.div
                className={`flex gap-${gap} whitespace-nowrap items-center`}
                style={{ gap: `${gap}px` }}
                animate={{
                    translateX: isLeft ? ['0%', '-33.333333%'] : ['-33.333333%', '0%'],
                }}
                transition={{
                    repeat: Infinity,
                    ease: 'linear',
                    duration: (100 / speed) * logos.length, // Rough approximation
                }}
            >
                {duplicatedLogos.map((item, index) => (
                    <a
                        key={index}
                        href={item.href || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex-shrink-0 flex items-center justify-center text-neutral-500 hover:text-neutral-900 transition-colors ${scaleOnHover ? 'hover:scale-110 transition-transform' : ''}`}
                        title={item.title || item.alt}
                        style={{ height: logoHeight }}
                    >
                        {item.node ? (
                            <div className="w-full h-full flex items-center justify-center">
                                {item.node}
                            </div>
                        ) : item.src ? (
                            <img src={item.src} alt={item.alt || ''} style={{ height: logoHeight, width: 'auto' }} className="object-contain" />
                        ) : null}
                    </a>
                ))}
            </motion.div>
        </div>
    );
};

export default LogoLoop;
