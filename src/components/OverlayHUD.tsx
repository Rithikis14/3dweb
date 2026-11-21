"use client";

import { motion, useScroll, useTransform } from "framer-motion";

export default function OverlayHUD() {
  const { scrollYProgress } = useScroll();

  // --- EXISTING HERO TRANSFORMS ---
  const heroOpacity = useTransform(scrollYProgress, [0, 0.1, 0.15], [1, 1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.15], [0, -50]);

  // --- NEW: FIX OVERLAP ISSUES ---
  // Completely disables clicks/hovers on the hero once it begins fading out
  const heroPointerEvents = useTransform(
    scrollYProgress,
    [0, 0.1],
    ["auto", "none"] as const
  );

  // Changes display to 'none' completely after 0.15 so it never ghost-overlaps downstream content
  const heroVisibility = useTransform(
    scrollYProgress,
    [0, 0.14, 0.15],
    ["visible", "visible", "hidden"] as const
  );

  // --- OTHER SECTIONS (Keep these as they are) ---
  const engOpacity = useTransform(scrollYProgress, [0.25, 0.35, 0.45, 0.5], [0, 1, 1, 0]);
  const engY = useTransform(scrollYProgress, [0.25, 0.35], [50, 0]);
  const detailsOpacity = useTransform(scrollYProgress, [0.6, 0.65, 0.8, 0.85], [0, 1, 1, 0]);
  const detailsY = useTransform(scrollYProgress, [0.6, 0.65], [50, 0]);
  const ctaOpacity = useTransform(scrollYProgress, [0.9, 0.95, 1], [0, 1, 1]);
  const ctaY = useTransform(scrollYProgress, [0.9, 0.95], [50, 0]);

  return (
    <div className="fixed inset-0 pointer-events-none z-10 font-sans">
      
      {/* Fixed Header / Nav */}
      <header className="absolute top-0 left-0 w-full p-8 flex justify-between items-center text-cartier-gold mix-blend-difference pointer-events-auto">
        <div className="font-serif text-2xl tracking-widest uppercase">Cartier</div>
        <nav className="hidden md:flex gap-8 text-xs tracking-[0.2em] uppercase">
          <a href="#" className="hover:text-silk transition-colors">The Tank</a>
          <a href="#" className="hover:text-silk transition-colors">Savoir-Faire</a>
          <a href="#" className="hover:text-silk transition-colors">Boutiques</a>
        </nav>
      </header>

      {/* --- MODIFIED HERO SECTION --- */}
      <motion.div 
        style={{ 
          opacity: heroOpacity, 
          y: heroY,
          pointerEvents: heroPointerEvents, // Dynamic pointer state
          visibility: heroVisibility       // Dynamic layout visibility
        }}
        className="absolute inset-0 flex flex-col items-center justify-center text-center p-6"
      >
        {/* Luxury Vignette Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.45)_0%,transparent_65%)] pointer-events-none mix-blend-multiply" />

        {/* Text Content */}
        <h1 className="relative font-serif text-5xl md:text-7xl lg:text-8xl text-silk mb-6 tracking-tighter drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
          THE TANK
        </h1>
        <p className="relative text-cartier-gold tracking-[0.3em] uppercase text-xs md:text-sm drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
          A Century of Elegance
        </p>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-silk/70 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
          <span className="text-[10px] tracking-[0.2em] uppercase">Scroll to Discover</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-cartier-gold/70 to-transparent"></div>
        </div>
      </motion.div>

      {/* Engineering Reveal */}
      <motion.div 
        style={{ opacity: engOpacity, y: engY }}
        className="absolute top-1/3 left-8 md:left-24 max-w-sm text-silk pointer-events-auto drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)]"
      >
        <div className="h-[1px] w-12 bg-cartier-gold mb-6"></div>
        <h2 className="font-serif text-3xl md:text-4xl mb-4 tracking-tight">Precision Crafted</h2>
        <p className="text-sm font-sans tracking-wide leading-relaxed text-silk/90">
          The unmistakable rectangular brancards seamlessly integrate the strap into the case, a revolution in watchmaking design that has defined an era of luxury.
        </p>
      </motion.div>

      {/* Cinematic Details */}
      <motion.div 
        style={{ opacity: detailsOpacity, y: detailsY }}
        className="absolute bottom-1/3 right-8 md:right-24 max-w-sm text-silk text-right pointer-events-auto drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)]"
      >
        <div className="h-[1px] w-12 bg-cartier-gold mb-6 ml-auto"></div>
        <h2 className="font-serif text-3xl md:text-4xl mb-4 tracking-tight">The Beating Heart</h2>
        <p className="text-sm font-sans tracking-wide leading-relaxed text-silk/90">
          Powered by an ultra-thin mechanical movement. Every gear and pinion meticulously assembled by master artisans to ensure absolute accuracy.
        </p>
      </motion.div>

      {/* Footer / CTA */}
      <motion.div 
        style={{ opacity: ctaOpacity, y: ctaY }}
        className="absolute inset-0 flex flex-col items-center justify-center bg-obsidian/40 backdrop-blur-sm pointer-events-auto"
      >
        <h2 className="font-serif text-4xl md:text-6xl text-silk mb-8 tracking-tighter">
          Make It Yours
        </h2>
        <button className="border border-cartier-gold text-cartier-gold px-12 py-4 tracking-[0.2em] uppercase text-xs hover:bg-cartier-gold hover:text-obsidian transition-colors duration-500">
          Book an Appointment
        </button>
      </motion.div>

    </div>
  );
}