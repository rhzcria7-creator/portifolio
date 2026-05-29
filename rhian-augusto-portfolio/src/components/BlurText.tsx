import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface BlurTextProps {
    text: string;
    className?: string;
    delay?: number;
    once?: boolean;
}

export default function BlurText({ text, className = '', delay = 0, once = true }: BlurTextProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once });

    const words = text.split(' ');

    const container = {
        hidden: { opacity: 0 },
        visible: (i = 1) => ({
            opacity: 1,
            transition: { staggerChildren: 0.08, delayChildren: delay * 0.1 }
        })
    };

    const child = {
        visible: {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            transition: {
                type: 'spring',
                damping: 20,
                stiffness: 100
            }
        },
        hidden: {
            opacity: 0,
            filter: 'blur(8px)',
            y: 20,
            transition: {
                type: 'spring',
                damping: 20,
                stiffness: 100
            }
        }
    };

    return (
        <motion.div
            ref={ref}
            variants={container}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className={`flex flex-wrap ${className}`}
        >
            {words.map((word, index) => (
                <motion.span variants={child as any} key={index} className="mr-[0.25em]">
                    {word}
                </motion.span>
            ))}
        </motion.div>
    );
}
