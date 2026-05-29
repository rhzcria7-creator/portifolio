import React from 'react';
import { motion } from 'framer-motion';

const services = [
    {
        title: "Landing Pages",
        description: "High-converting, single-page experiences designed to capture attention and drive specific actions. Optimized for performance and clarity.",
        details: ["Conversion Rate Optimization", "A/B Testing Ready", "Blazing Fast Load Times"]
    },
    {
        title: "Business Websites",
        description: "Comprehensive digital platforms that establish trust, explain complex value propositions, and serve as the core of your online presence.",
        details: ["Custom Architecture", "CMS Integration", "Scalable Foundations"]
    },
    {
        title: "Local Commerce",
        description: "Specialized solutions for Restaurants, Barbershops, and Bakeries. Integrating digital menus, booking systems, and local SEO to drive foot traffic.",
        details: ["Google Workspace Integration", "Google Business Sync", "Mobile-First Design"]
    },
    {
        title: "Performance & SEO",
        description: "Technical optimizations that ensure your website ranks well, loads instantly, and provides a flawless experience across all devices and networks.",
        details: ["Core Web Vitals", "Semantic HTML", "On-page Optimization"]
    }
];

export default function Services() {
    return (
        <div className="w-full bg-neutral-50 min-h-screen">
            <header className="py-32 px-6 max-w-4xl mx-auto text-center">
                <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[48px] md:text-[80px] lg:text-[120px] font-bold leading-[0.9] tracking-[-0.04em] uppercase text-neutral-900 mb-6"
                >
                    Premium Solutions
                </motion.h1>
                <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-lg text-neutral-500 font-light"
                >
                    We don't build generic templates. We engineer specific solutions designed to solve business problems and generate tangible outcomes.
                </motion.p>
            </header>

            <section className="px-6 pb-32 max-w-7xl mx-auto">
                <div className="grid md:grid-cols-2 gap-6">
                    {services.map((service, index) => (
                        <motion.div 
                            key={index}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-neutral-100 rounded-3xl p-8 border border-neutral-300 flex flex-col justify-between group hover:border-neutral-400 transition-colors"
                        >
                            <div>
                                <span className="text-[10px] font-bold tracking-[0.2em] text-neutral-400 uppercase">Service 0{index + 1}</span>
                                <h3 className="text-2xl font-semibold mt-2 tracking-tight text-neutral-900">{service.title}</h3>
                            </div>
                            <p className="text-neutral-500 font-light leading-relaxed my-8">{service.description}</p>
                            
                            <ul className="space-y-3">
                                {service.details.map((detail, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm font-medium text-neutral-700">
                                        <span className="w-1.5 h-1.5 rounded-full bg-neutral-300" />
                                        {detail}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
}
