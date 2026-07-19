import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronUp, Mail, MapPin, Building2, Users, Handshake, Heart, Camera, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const pageLinks = [
    { to: '/departments', label: 'Departments', icon: Building2 },
    { to: '/faculty', label: 'Faculty', icon: Users },
    { to: '/placements', label: 'Placements', icon: Handshake },
    { to: '/clubs', label: 'Clubs', icon: Heart },
    { to: '/gallery', label: 'Gallery', icon: Camera },
  ];

  return (
    <footer className="relative bg-slate-950 text-slate-300 pt-16 pb-8 border-t-4 border-rose-600 overflow-hidden w-full">
      {/* Decorative gradient blur */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-1/2 bg-rose-600/10 blur-[100px] pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16 border-b border-slate-800 pb-12">
          
          {/* Brand & Tagline */}
          <div className="space-y-4">
            <Link to="/" className="inline-block group">
              <h3 className="text-3xl font-black text-white tracking-tight flex flex-col">
                <span>Government</span>
                <span>Engineering College</span>
                <span className="text-rose-500 group-hover:text-rose-400 transition-colors">Palamu</span>
              </h3>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs mt-4">
              Standardized management, seamless collaboration, and academic growth all in one portal.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-white font-bold text-lg uppercase tracking-wider">Quick Links</h4>
            <ul className="grid grid-cols-2 gap-4">
              {pageLinks.map((link) => (
                <li key={link.to}>
                  <Link 
                    to={link.to} 
                    className="group flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-all duration-300"
                  >
                    <span className="p-1.5 rounded-lg bg-slate-900 group-hover:bg-rose-600/20 group-hover:text-rose-500 transition-colors">
                      <link.icon className="w-4 h-4" />
                    </span>
                    <span className="group-hover:translate-x-1 transition-transform">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h4 className="text-white font-bold text-lg uppercase tracking-wider">Contact Us</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li className="flex items-start gap-4 group cursor-default">
                <div className="p-2 rounded-xl bg-slate-900 group-hover:bg-rose-600/20 group-hover:text-rose-500 transition-colors shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <p className="leading-relaxed group-hover:text-white transition-colors">
                  Post: Lesliganj, Medininagar<br />
                  Palamu (Jharkhand) - 822118
                </p>
              </li>
              <li className="flex items-center gap-4 group cursor-default">
                <div className="p-2 rounded-xl bg-slate-900 group-hover:bg-rose-600/20 group-hover:text-rose-500 transition-colors shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <a href="mailto:gecp.academic@gmail.com" className="hover:text-white transition-colors">
                  gecp.academic@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-slate-500 flex flex-col sm:flex-row items-center gap-2 text-center md:text-left">
            <p>© 2026 GEC Palamu. All rights reserved.</p>
            <span className="hidden sm:inline text-slate-700">|</span>
            <p>Developed by Pragyasoft Technologies</p>
          </div>
          
          {/* Scroll to top button */}
          <motion.button 
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToTop}
            className="flex items-center justify-center bg-rose-600 hover:bg-rose-500 text-white w-12 h-12 rounded-2xl shadow-[0_0_20px_rgba(225,29,72,0.3)] transition-colors"
            aria-label="Scroll to top"
          >
            <ChevronUp className="w-6 h-6" strokeWidth={3} />
          </motion.button>
        </div>
      </div>
    </footer>
  );
}
