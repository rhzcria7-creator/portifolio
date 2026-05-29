import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';
import PixelBlast from '../components/PixelBlast';
import LogoLoop from '../components/LogoLoop';
import TextPressure from '../components/TextPressure';
import BlurText from '../components/BlurText';
import RotatingText from '../components/RotatingText';

// Fake icons for logo loop
import { SiGoogle, SiApple, SiStripe, SiLinear, SiArc, SiFramer, SiUber, SiVercel, SiSpotify } from 'react-icons/si';

const techLogos = [
  { node: <SiApple size={32} />, title: "Apple" },
  { node: <SiStripe size={32} />, title: "Stripe" },
  { node: <SiLinear size={32} />, title: "Linear" },
  { node: <SiFramer size={32} />, title: "Framer" },
  { node: <SiVercel size={32} />, title: "Vercel" },
  { node: <SiArc size={32} />, title: "Arc" },
  { node: <SiGoogle size={32} />, title: "Google" },
  { node: <SiUber size={32} />, title: "Uber" },
  { node: <SiSpotify size={32} />, title: "Spotify" },
];

export default function Home() {
    const { scrollYProgress } = useScroll();
    const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
    const heroY = useTransform(scrollYProgress, [0, 0.2], [0, 50]);

    return (
        <div className="w-full">
            {/* HERO MODULE */}
            <section className="relative h-[90vh] min-h-[600px] flex flex-col items-center justify-center overflow-hidden bg-white">
                <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                    <PixelBlast
                        variant="square"
                        pixelSize={4}
                        color="#000000"
                        patternScale={1.5}
                        speed={0.2}
                    />
                </div>
                
                <motion.div 
                    style={{ opacity: heroOpacity, y: heroY }}
                    className="z-10 text-center px-6 max-w-5xl mx-auto flex flex-col items-center"
                >
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-100 text-neutral-800 text-[10px] font-bold mb-8 tracking-[0.2em] uppercase border border-neutral-200"
                    >
                        <Star className="w-3 h-3" /> Digital Craftsmanship
                    </motion.div>
                    
                    <div className="h-24 sm:h-32 md:h-40 w-full mb-6 relative">
                         <TextPressure
                            text="PREMIUM"
                            flex={true}
                            alpha={true}
                            stroke={false}
                            width={true}
                            weight={true}
                            italic={false}
                            textColor="#000000"
                            minFontSize={60}
                        />
                    </div>
                    
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="text-[48px] md:text-[80px] lg:text-[100px] font-bold leading-[0.9] tracking-[-0.04em] uppercase text-neutral-900 mb-8 text-center flex flex-col sm:flex-row items-center justify-center gap-2 flex-wrap"
                    >
                        <div>WEBSITES THAT</div>
                        {/* @ts-ignore */}
                        <RotatingText
                          texts={['INNOVATE.', 'INSPIRE.', 'ELEVATE.', 'DELIVER.']}
                          mainClassName="text-white bg-black px-4 sm:px-6 rounded-2xl overflow-hidden"
                          staggerFrom="last"
                          transition={{ type: "spring", damping: 30, stiffness: 400 }}
                          rotationInterval={2500}
                        />
                    </motion.h1>

                    <div className="max-w-2xl mx-auto mb-10 flex justify-center">
                        <BlurText 
                            text="We build digital experiences with intention. Merging strategy, technology, and meticulous design to create trust and drive results." 
                            className="text-lg md:text-xl text-neutral-500 font-light justify-center text-center" 
                            delay={6} 
                        />
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                    >
                        <Link 
                            to="/portfolio"
                            className="w-full sm:w-auto py-4 px-12 bg-neutral-900 text-white font-bold rounded-2xl hover:bg-neutral-800 transition-colors inline-block text-lg mt-8"
                        >
                            View Portfolio
                        </Link>
                    </motion.div>
                </motion.div>
            </section>

            {/* TRUST SIGNAL - LOGO LOOP */}
            <section className="py-24 bg-white border-y border-neutral-200 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
                    <p className="text-[10px] font-bold tracking-[0.2em] text-neutral-400 uppercase">Built with modern standards</p>
                </div>
                <div className="h-16 relative">
                     <LogoLoop
                        logos={techLogos}
                        speed={80}
                        direction="left"
                        logoHeight={32}
                        gap={80}
                        fadeOut
                        fadeOutColor="#FFFFFF"
                    />
                </div>
            </section>

            {/* WHY PREMIUM MATTERS */}
            <section className="py-32 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-[48px] md:text-[64px] font-bold leading-[0.9] tracking-[-0.04em] uppercase text-neutral-900 mb-6">
                                Design that earns trust.
                            </h2>
                            <p className="text-lg text-neutral-500 mb-8 leading-relaxed font-light">
                                A website is not just a digital brochure; it's the foundation of your modern business. A premium experience communicates quality before they even speak to you. We focus on performance, accessibility, and microscopic details.
                            </p>
                            <Link to="/about" className="inline-flex items-center text-neutral-900 font-medium hover:text-neutral-500 transition-colors">
                                Discover our philosophy <ArrowRight className="w-4 h-4 ml-2" />
                            </Link>
                        </div>
                        <div className="relative rounded-3xl overflow-hidden aspect-[4/3] bg-neutral-100 border border-neutral-200">
                             <img 
                                src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1200" 
                                alt="Craftsmanship" 
                                className="w-full h-full object-cover opacity-90"
                             />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
