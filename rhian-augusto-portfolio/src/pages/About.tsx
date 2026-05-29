import React from 'react';
import { motion } from 'framer-motion';

export default function About() {
    return (
        <div className="w-full bg-white min-h-screen">
            <header className="py-32 px-6 max-w-4xl mx-auto">
                <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-[10px] font-bold tracking-[0.2em] text-neutral-400 uppercase mb-6"
                >
                    The Philosophy
                </motion.p>
                <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[48px] md:text-[64px] lg:text-[100px] font-bold leading-[0.9] tracking-[-0.04em] uppercase text-neutral-900"
                >
                    Craftsmanship is not a luxury. It is a necessity in a world full of noise.
                </motion.h1>
            </header>

            <section className="py-16 px-6 max-w-7xl mx-auto">
                <div className="grid md:grid-cols-12 gap-12 md:gap-24">
                    <div className="md:col-span-5 relative aspect-[3/4] rounded-3xl overflow-hidden bg-neutral-100">
                        <img 
                            src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800" 
                            alt="Coding Environment"
                            className="w-full h-full object-cover mix-blend-luminosity opacity-80"
                        />
                    </div>
                    <div className="md:col-span-7 flex flex-col justify-center max-w-xl">
                        <div className="space-y-8 text-neutral-500 font-light text-lg leading-relaxed">
                            <p>
                                Hi, I'm Rhian Augusto. I specialize in engineering premium digital experiences that feel effortless, intentional, and physically tangible.
                            </p>
                            <p>
                                I believe the best websites don't shout; they earn your attention through meticulous detail, microscopic interactions, and blazing-fast performance. A great digital product should feel inevitable.
                            </p>
                            <p>
                                I focus on long-term value over short-term trends. By strictly adhering to web standards, accessibility guidelines, and optimized performance metrics, I build foundations that scale and endure.
                            </p>
                        </div>

                        <div className="mt-16 grid grid-cols-2 gap-8 pt-12 border-t border-neutral-100">
                            <div>
                                <h3 className="text-sm font-medium text-neutral-900 mb-2">Design</h3>
                                <p className="text-sm text-neutral-500 font-light">Minimalist aesthetics, precise typography, human interactions.</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-neutral-900 mb-2">Engineering</h3>
                                <p className="text-sm text-neutral-500 font-light">React, Next.js, Framer Motion, Tailwind, WebGL.</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-neutral-900 mb-2">Quality Standards</h3>
                                <p className="text-sm text-neutral-500 font-light">95+ Lighthouse, semantic structure, offline capabilities.</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-neutral-900 mb-2">Human Connection</h3>
                                <p className="text-sm text-neutral-500 font-light">Direct communication, transparent process, real investment.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
