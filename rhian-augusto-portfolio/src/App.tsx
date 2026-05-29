import React from 'react';
import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Icons
import { Github, Twitter, Linkedin, ExternalLink } from 'lucide-react';

// Pages
import Home from './pages/Home';
import Portfolio from './pages/Portfolio';
import Services from './pages/Services';
import About from './pages/About';
import Contact from './pages/Contact';

function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
      window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
}

import PillNav from './components/PillNav';

const logoDataUri = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'><circle cx='50' cy='50' r='50' fill='%23000'/><text x='50' y='55' font-family='Arial' font-size='30' font-weight='bold' fill='%23fff' text-anchor='middle'>RA</text></svg>";

const Navigation = () => {
    const { pathname } = useLocation();
    
    return (
        <PillNav
            logo={logoDataUri}
            logoAlt="Rhian Augusto Logo"
            items={[
                { label: 'Home', href: '/' },
                { label: 'Portfolio', href: '/portfolio' },
                { label: 'Services', href: '/services' },
                { label: 'About', href: '/about' },
                { label: 'Contact', href: '/contact' }
            ]}
            activeHref={pathname}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-auto shadow-lg"
            baseColor="#000000"
            pillColor="#ffffff"
            hoveredPillTextColor="#ffffff"
            pillTextColor="#000000"
            onMobileMenuClick={() => {}}
        />
    );
};

const Footer = () => {
    return (
        <footer className="w-full px-6 md:px-12 py-8 flex flex-col md:flex-row justify-between border-t border-neutral-200 bg-neutral-50 gap-6">
            <div className="flex gap-12 text-[11px] font-bold tracking-[0.1em] text-neutral-400 uppercase">
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                    Belo Horizonte, BR
                </div>
                <div>Built with Intention. &copy; {new Date().getFullYear()}</div>
            </div>
            <div className="flex gap-8 text-[11px] font-bold tracking-[0.1em] text-neutral-400 uppercase">
                <a href="#" className="hover:text-neutral-900 transition-colors">Instagram</a>
                <a href="#" className="hover:text-neutral-900 transition-colors">LinkedIn</a>
            </div>
        </footer>
    );
}

const PageTransition = ({ children }: { children: React.ReactNode }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
            {children}
        </motion.div>
    );
};

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen bg-neutral-50 flex flex-col font-sans text-neutral-900 selection:bg-neutral-900 selection:text-white">
        <Navigation />
        <main className="flex-1 pt-16">
            <AnimatePresence mode="wait">
                <Routes>
                    <Route path="/" element={<PageTransition><Home /></PageTransition>} />
                    <Route path="/portfolio" element={<PageTransition><Portfolio /></PageTransition>} />
                    <Route path="/services" element={<PageTransition><Services /></PageTransition>} />
                    <Route path="/about" element={<PageTransition><About /></PageTransition>} />
                    <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
                </Routes>
            </AnimatePresence>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
