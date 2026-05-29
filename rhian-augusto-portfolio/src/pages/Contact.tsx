import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, MessageCircle, Calendar, Send } from 'lucide-react';
import GradientText from '../components/GradientText';

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        businessName: '',
        email: '',
        phone: '',
        businessType: '',
        description: '',
        _honeypot: ''
    });
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');
        
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    message: `Business: ${formData.businessName}\nPhone: ${formData.phone}\nType: ${formData.businessType}\n\nDescription:\n${formData.description}`,
                    _honeypot: formData._honeypot
                })
            });

            if (res.ok) {
                setStatus('success');
            } else {
                setStatus('error');
            }
        } catch (err) {
            setStatus('error');
        }
    };

    const whatsappBaseUrl = "https://wa.me/5531983648686?text=";
    const whatsappTemplates = [
        "Olá Rhian, encontrei seu site e gostaria de solicitar um orçamento para criação de um site profissional.",
        "Olá Rhian, gostaria de modernizar o site da minha empresa. Podemos conversar?",
        "Olá Rhian, gostaria de saber os valores para desenvolvimento de um site para meu negócio.",
        "Olá Rhian, quero aumentar minha presença online e gostaria de um orçamento."
    ];

    return (
        <div className="w-full bg-neutral-900 min-h-[calc(100vh-64px)] flex items-center pt-16 pb-24">
            <div className="max-w-5xl mx-auto px-6 w-full text-center">
                
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 mb-8 border border-white/10">
                        <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                    </div>

                    <h1 className="text-[48px] md:text-[64px] font-bold leading-[0.9] tracking-[-0.04em] uppercase text-white mb-6">
                        <GradientText
                          colors={["#ffffff", "#555555", "#ffffff"]}
                          animationSpeed={4}
                          showBorder={false}
                        >
                          Let's build something exceptional.
                        </GradientText>
                    </h1>
                    
                    <p className="text-lg text-neutral-400 font-light mb-16 leading-relaxed max-w-2xl mx-auto">
                        Whether you are launching a new brand or elevating an existing one, I am ready to help you create a digital experience that stands apart.
                    </p>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 text-left">
                        
                        {/* FORM SECTION */}
                        <div className="bg-neutral-800/30 p-8 rounded-3xl border border-white/5 relative overflow-hidden">
                            <h3 className="text-2xl font-bold text-white mb-6">Send an Email</h3>
                            
                            {status === 'success' ? (
                                <div className="py-12 text-center text-emerald-400">
                                    <CheckCircle2 className="w-16 h-16 mx-auto mb-4 opacity-80" />
                                    <p className="text-xl font-medium">Message safely delivered.</p>
                                    <p className="text-neutral-400 mt-2 text-sm">I'll get back to you shortly.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <input type="text" name="_honeypot" value={formData._honeypot} onChange={handleChange} className="hidden" tabIndex={-1} autoComplete="off" />
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-2">Name *</label>
                                            <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-neutral-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors" />
                                        </div>
                                        <div>
                                            <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-2">Email *</label>
                                            <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-neutral-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors" />
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-2">Business Name</label>
                                            <input type="text" name="businessName" value={formData.businessName} onChange={handleChange} className="w-full bg-neutral-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors" />
                                        </div>
                                        <div>
                                            <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-2">Phone</label>
                                            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-neutral-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-2">Business Type</label>
                                        <input type="text" name="businessType" value={formData.businessType} onChange={handleChange} className="w-full bg-neutral-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors" />
                                    </div>

                                    <div>
                                        <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-2">Project Description *</label>
                                        <textarea required name="description" rows={4} value={formData.description} onChange={handleChange} className="w-full bg-neutral-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors resize-none" />
                                    </div>

                                    <button
                                        disabled={status === 'submitting'}
                                        className="w-full bg-white text-neutral-900 px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-neutral-200 transition-colors disabled:opacity-50"
                                    >
                                        <Send className="w-4 h-4" />
                                        {status === 'submitting' ? 'Sending...' : 'Submit Inquiry'}
                                    </button>
                                    {status === 'error' && <p className="text-red-400 text-sm text-center mt-2">Error sending message. Please try again.</p>}
                                </form>
                            )}
                        </div>

                        {/* ALTERNATIVE METHODS */}
                        <div className="space-y-6">
                            <div className="bg-neutral-800/30 p-8 rounded-3xl border border-white/5">
                                <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                                    <Calendar className="w-6 h-6 text-neutral-400" />
                                    Schedule a Meeting
                                </h3>
                                <p className="text-neutral-400 mb-6 font-light">Prefer to talk face-to-face? Book a direct session via Google Meet.</p>
                                <a href="https://calendar.google.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center w-full bg-neutral-700/50 text-white px-6 py-4 rounded-xl font-bold hover:bg-neutral-700 transition-colors">
                                    Open Google Calendar
                                </a>
                            </div>

                            <div className="bg-neutral-800/30 p-8 rounded-3xl border border-white/5">
                                <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                                    <MessageCircle className="w-6 h-6 text-emerald-400" />
                                    WhatsApp
                                </h3>
                                <p className="text-neutral-400 mb-6 font-light">Select a quick message to start our conversation instantly.</p>
                                
                                <div className="space-y-3">
                                    {whatsappTemplates.map((text, i) => (
                                        <a 
                                            key={i}
                                            href={`${whatsappBaseUrl}${encodeURIComponent(text)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block w-full text-left bg-neutral-900/50 border border-white/5 p-4 rounded-xl hover:border-emerald-500/30 hover:bg-emerald-900/10 transition-colors"
                                        >
                                            <p className="text-sm text-neutral-300 line-clamp-2">{text}</p>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                </motion.div>
            </div>
        </div>
    );
}
