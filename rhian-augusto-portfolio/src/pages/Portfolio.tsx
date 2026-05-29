import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ExternalLink } from 'lucide-react';
import BlurText from '../components/BlurText';
import { ProjectButton } from '../components/ProjectButton';

const projects = [
    {
        id: 'barbaridade',
        name: 'Barbaridade Barbershop',
        category: 'Local Business',
        description: 'A robust booking platform and brand showcase for a premium barbershop. Highlighting craftsmanship and tradition through a dark, elegant digital presence.',
        image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=1200',
        color: 'bg-stone-900',
        liveUrl: 'https://barbaridade-babershop.netlify.app'
    },
    {
        id: 'jota-l',
        name: 'Jota L Restaurant',
        category: 'Hospitality',
        description: 'An immersive digital menu and reservation system that captures the vibrant atmosphere and culinary excellence of the Jota L dining experience.',
        image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=1200',
        color: 'bg-orange-900',
        liveUrl: 'https://jota-l.netlify.app'
    },
    {
        id: 'eduardo',
        name: 'Eduardo Auto Elétrica',
        category: 'Automotive',
        description: 'A trust-building, highly functional service portal for an automotive electrical specialist. Designed for rapid mobile access in emergency situations.',
        image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=1200',
        color: 'bg-blue-900',
        liveUrl: 'https://eduardo-auto-eletrica.netlify.app'
    },
    {
        id: 'doce-encanto',
        name: 'Doce Encanto Confeitaria',
        category: 'E-commerce',
        description: 'A delightful, visually rich ordering platform for Artisanal pastries. Soft, warm aesthetics combined with an effortless checkout process.',
        image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=1200',
        color: 'bg-rose-900',
        liveUrl: 'https://encanto-doce.netlify.app'
    }
];

export default function Portfolio() {
    return (
        <div className="w-full bg-white min-h-screen">
            <header className="py-32 px-6 max-w-7xl mx-auto text-center border-b border-neutral-200">
                <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[48px] md:text-[80px] lg:text-[120px] font-bold leading-[0.9] tracking-[-0.04em] uppercase text-neutral-900 mb-6"
                >
                    Selected Work
                </motion.h1>
                <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-lg text-neutral-500 max-w-2xl mx-auto font-light"
                >
                    A collection of digital experiences engineered for real-world impact.
                </motion.p>
            </header>

            <section className="py-24 px-6 max-w-7xl mx-auto flex flex-col gap-32">
                {projects.map((project, index) => (
                    <motion.div 
                        key={project.id}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="bg-neutral-100 rounded-3xl p-8 border border-neutral-300 md:col-span-12 group flex flex-col md:flex-row gap-12 items-center hover:border-neutral-400 transition-colors"
                    >
                        <div className={`md:w-7/12 w-full aspect-[4/3] rounded-2xl overflow-hidden relative ${project.color}`}>
                            <motion.img 
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                src={project.image} 
                                alt={project.name}
                                className="w-full h-full object-cover mix-blend-overlay opacity-80 group-hover:opacity-100 transition-opacity duration-700"
                            />
                        </div>
                        <div className="md:w-5/12 flex flex-col justify-center">
                            <p className="text-[10px] font-bold tracking-[0.2em] text-neutral-400 uppercase mb-4">
                                {project.category}
                            </p>
                            <h2 className="text-3xl font-semibold tracking-tight text-neutral-900 mb-6">
                                {project.name}
                            </h2>
                            <p className="text-neutral-500 leading-relaxed font-light mb-8">
                                {project.description}
                            </p>
                            <div className="flex">
                                <ProjectButton href={project.liveUrl}>Visit Live Site</ProjectButton>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </section>
        </div>
    );
}
