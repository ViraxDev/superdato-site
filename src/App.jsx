import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, useScroll, AnimatePresence } from 'framer-motion';
import {
  Wrench,
  Search,
  Sparkles,
  Instagram,
  Youtube,
  Mail,
  ArrowRight,
  Menu,
  X,
  Star,
  Clock,
  ChevronsLeftRight,
  ChevronLeft,
  ChevronRight,
  Upload,
  Phone,
  MapPin
} from 'lucide-react';
import restorations from './data/restorations';

const App = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Restauration aléatoire pour le Hero
  const heroRestoration = useMemo(() => {
    if (restorations.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * restorations.length);
    return restorations[randomIndex];
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- COMPOSANT : SLIDER AVANT/APRÈS ---
  const BeforeAfterSlider = ({ before, after, title, tag }) => {
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef(null);

    const handleMove = (clientX) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
        const percentage = (x / rect.width) * 100;
        setSliderPosition(percentage);
      }
    };

    const onMouseMove = (e) => {
      if (isDragging) handleMove(e.clientX);
    };

    const onTouchMove = (e) => {
      handleMove(e.touches[0].clientX);
    };

    const startDrag = () => setIsDragging(true);
    const stopDrag = () => setIsDragging(false);

    useEffect(() => {
      if (isDragging) {
        window.addEventListener('mouseup', stopDrag);
        window.addEventListener('touchend', stopDrag);
      } else {
        window.removeEventListener('mouseup', stopDrag);
        window.removeEventListener('touchend', stopDrag);
      }
      return () => {
        window.removeEventListener('mouseup', stopDrag);
        window.removeEventListener('touchend', stopDrag);
      };
    }, [isDragging]);

    return (
      <div className="flex flex-col gap-4">
        <div
          ref={containerRef}
          className="relative w-full aspect-[4/5] md:aspect-square rounded-2xl overflow-hidden cursor-ew-resize border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,0.1)] select-none touch-none group"
          onMouseDown={startDrag}
          onMouseMove={onMouseMove}
          onTouchStart={startDrag}
          onTouchMove={onTouchMove}
          onClick={(e) => handleMove(e.clientX)}
        >
          {/* Image AVANT */}
          <img
            src={before}
            alt="Avant restauration"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          />

          <div className="absolute top-4 left-4 bg-black/90 text-white text-xs px-2 py-1 font-bold rounded rotate-2 z-10 shadow-md pointer-events-none" aria-label="Avant restauration">
            AVANT
          </div>

          {/* Image APRÈS avec clip */}
          <div
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
          >
            <img
              src={after}
              alt="Après restauration"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 bg-[#FF6B35] text-white text-xs px-2 py-1 font-bold rounded -rotate-2 z-10 shadow-md" aria-label="Après restauration">
              APRÈS
            </div>
          </div>

          {/* Slider Handle */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20 shadow-[0_0_10px_rgba(0,0,0,0.3)]"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white border-2 border-black rounded-full flex items-center justify-center text-[#FF6B35] shadow-lg transform transition-transform group-hover:scale-110 active:scale-95">
              <ChevronsLeftRight size={16} strokeWidth={3} />
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center px-1">
          <h3 className="font-display text-xl">{title}</h3>
          <span className="text-[#FF6B35] font-mono text-xs font-bold bg-[#FF6B35]/10 px-2 py-1 rounded-md border border-[#FF6B35]/20">
            {tag}
          </span>
        </div>
      </div>
    );
  };

  // --- AUTRES COMPOSANTS ---
  const StickerImage = ({ src, alt, className, rotation = 0 }) => (
    <motion.div
      className={`relative inline-block ${className}`}
      initial={{ rotate: rotation, scale: 0.95 }}
      whileHover={{ rotate: 0, scale: 1.02 }}
      whileInView={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
    >
      <div className="absolute inset-0 bg-black/10 rounded-2xl translate-y-3 translate-x-2 transform" />
      <img
        src={src}
        alt={alt}
        className="relative z-10 border-[3px] border-white rounded-2xl shadow-lg object-cover"
      />
    </motion.div>
  );

  const RetroButton = ({ children, primary = true, icon: Icon, className = '' }) => (
    <motion.button
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98 }}
      className={`
        px-5 py-2.5 rounded-full font-semibold text-sm flex items-center gap-2 transition-all 
        shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] border-[1.5px] border-black
        ${primary ? 'bg-[#FF6B35] text-white' : 'bg-white text-black'}
        ${className}
      `}
    >
      {children}
      {Icon && <Icon size={16} />}
    </motion.button>
  );

  const ServiceCard = ({ icon: Icon, title, desc, color }) => (
    <motion.div
      variants={{
        hidden: { y: 30, opacity: 0 },
        visible: { y: 0, opacity: 1 },
      }}
      className="bg-white border-2 border-black p-6 rounded-xl shadow-[4px_4px_0px_rgba(0,0,0,0.08)] hover:shadow-[6px_6px_0px_rgba(0,0,0,0.1)] transition-shadow relative overflow-hidden group"
    >
      <div
        className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 group-hover:scale-125 transition-transform duration-500 ${color}`}
      />
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 border-[1.5px] border-black ${color} text-white`}
      >
        <Icon size={24} />
      </div>
      <h3 className="font-display text-xl mb-2">{title}</h3>
      <p className="text-gray-600 leading-relaxed text-sm">{desc}</p>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-[#F9F7F1] text-[#1A1A1A] font-body selection:bg-[#FF6B35] selection:text-white overflow-x-hidden">
      <style>{`
        .font-display { font-family: 'Shrikhand', cursive; }
        .font-body { font-family: 'DM Sans', sans-serif; }

        .noise-bg {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 50;
          opacity: 0.03;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }

        .gradient-text {
          background: linear-gradient(45deg, #FF6B35, #8338EC);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>

      <div className="noise-bg" />

      {/* NAVBAR */}
      <nav
        className={`fixed w-full z-40 transition-all duration-300 ${
          isScrolled
            ? 'py-3 bg-white/90 backdrop-blur-sm border-b-[1.5px] border-black/5'
            : 'py-5 bg-transparent'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 md:px-6 flex justify-between items-center">
          <div className="flex items-center gap-2 group cursor-pointer">
            <span className="text-2xl font-display text-[#FF6B35] drop-shadow-[1px_1px_0px_rgba(0,0,0,0.8)] group-hover:scale-105 transition-transform">
              SuperDato
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 font-medium text-base">
            {[
              { label: 'Services', href: '#services' },
              { label: 'Galerie', href: '#galerie' },
              { label: 'Avis', href: '#avis' },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="hover:text-[#FF6B35] transition-colors relative group text-sm font-semibold tracking-tight"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#FF6B35] transition-all group-hover:w-full" />
              </a>
            ))}
            <a href="#contact">
              <RetroButton icon={ArrowRight}>
                Demander un devis
              </RetroButton>
            </a>
          </div>

          <button
            className="md:hidden text-[#1A1A1A]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Overlay pour fermer au clic */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-25 bg-black/20 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="fixed inset-x-0 top-0 z-30 bg-[#F9F7F1] pt-20 pb-8 px-6 md:hidden flex flex-col gap-4 text-xl font-display shadow-lg"
            >
              {[
                { label: 'Services', href: '#services' },
                { label: 'Galerie', href: '#galerie' },
                { label: 'Avis', href: '#avis' },
                { label: 'Contact', href: '#contact' },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block border-b-2 border-black/5 pb-3"
                >
                  {item.label}
                </a>
              ))}
              <a href="#contact" onClick={() => setMobileMenuOpen(false)}>
                <RetroButton icon={ArrowRight} className="w-full justify-center mt-2">
                  Demander un devis
                </RetroButton>
              </a>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* HERO */}
      <header className="relative pt-32 pb-16 md:pb-20 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-[#FF6B35] rounded-full blur-[120px] opacity-10" />
        <div className="absolute bottom-0 left-[-10%] w-[300px] h-[300px] bg-[#8338EC] rounded-full blur-[120px] opacity-10" />

        <div className="max-w-6xl mx-auto px-4 md:px-6 grid md:grid-cols-2 gap-10 items-center relative z-10">
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-block px-3 py-1.5 bg-[#8338EC] text-white text-xs font-bold rounded-full mb-5 transform -rotate-1 shadow-sm">
              ✨ Atelier Vintage Premium
            </div>

            <h1
              className="font-display leading-[1.1] mb-5 text-[#1A1A1A]"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
            >
              Je fais revenir les <span className="gradient-text">vieilles montres</span> à la vie.
            </h1>

            <p className="text-base md:text-lg text-gray-600 mb-6 font-medium max-w-md leading-relaxed">
              Restauration mécanique de précision et esthétique intemporelle pour vos garde-temps
              oubliés.
            </p>

            {/* Stats inline */}
            <div className="flex gap-6 mb-8">
              {[
                { value: '150+', label: 'Restaurations' },
                { value: '12 ans', label: 'Expérience' },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="font-display text-xl md:text-2xl text-[#FF6B35]">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <a href="#contact">
                <RetroButton icon={Wrench}>Restaurer ma montre</RetroButton>
              </a>
              <RetroButton primary={false} icon={Youtube}>
                Voir l'atelier
              </RetroButton>
            </div>
          </motion.div>

          <div className="relative h-[450px] flex items-center justify-center">
            {heroRestoration && (
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
                initial={{ rotate: -3, scale: 0.95 }}
                whileHover={{ rotate: 0, scale: 1.02 }}
                className="relative z-20"
              >
                <div className="absolute inset-0 bg-black/10 rounded-2xl translate-y-3 translate-x-2 transform" />
                <div className="relative z-10 border-[3px] border-white rounded-2xl shadow-lg overflow-hidden bg-white">
                  {/* Image AVANT */}
                  <div className="relative">
                    <img
                      src={heroRestoration.before}
                      alt="Avant restauration"
                      className="w-52 h-44 md:w-64 md:h-52 object-cover"
                    />
                    <span className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 font-bold rounded" aria-label="Avant restauration">
                      AVANT
                    </span>
                  </div>

                  {/* Image APRÈS */}
                  <div className="relative">
                    <img
                      src={heroRestoration.after}
                      alt="Après restauration"
                      className="w-52 h-44 md:w-64 md:h-52 object-cover"
                    />
                    <span className="absolute top-2 right-2 bg-[#FF6B35] text-white text-xs px-2 py-1 font-bold rounded" aria-label="Après restauration">
                      APRÈS
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 30, ease: 'linear' }}
              className="absolute top-4 right-10 text-[#FF6B35] opacity-60"
              aria-hidden="true"
            >
              <Clock size={60} strokeWidth={1.5} />
            </motion.div>
          </div>
        </div>
      </header>

      {/* MARQUEE */}
      <div className="bg-[#1A1A1A] py-3 transform -rotate-1 border-y-2 border-white overflow-hidden">
        <div className="flex gap-12 whitespace-nowrap text-white font-display text-lg md:text-2xl uppercase tracking-wider animate-marquee opacity-90">
          {[...Array(10)].map((_, i) => (
            <React.Fragment key={i}>
              <span>OMEGA ✦</span>
              <span className="text-[#FF6B35]">LONGINES ✦</span>
              <span>ZENITH ✦</span>
              <span className="text-[#8338EC]">ROLEX ✦</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* SERVICES */}
      <section id="services" className="py-16 md:py-20 bg-white relative">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display mb-3">
              Mes Services <span className="text-[#FF6B35]">.</span>
            </h2>
            <p className="text-base text-gray-500 max-w-xl mx-auto">
              Savoir-faire traditionnel, outillage moderne.
            </p>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ staggerChildren: 0.1 }}
            className="grid md:grid-cols-3 gap-4 md:gap-6"
          >
            <ServiceCard
              icon={Wrench}
              title="Restauration"
              desc="Démontage intégral, nettoyage et réglage. Ton mouvement repart pour une nouvelle vie."
              color="bg-[#FF6B35]"
            />
            <ServiceCard
              icon={Sparkles}
              title="Esthétique"
              desc="Polissage respectueux des angles d'origine. On redonne l'éclat sans effacer l'histoire."
              color="bg-[#8338EC]"
            />
            <ServiceCard
              icon={Search}
              title="Expertise"
              desc="Authentification et estimation. Évite les pièges et les montres 'frankenstein'."
              color="bg-[#FF006E]"
            />
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {[
              { value: '150+', label: 'Restaurations' },
              { value: '12', label: 'Ans d\'expérience' },
              { value: '100%', label: 'Satisfaction' },
              { value: '48h', label: 'Devis gratuit' },
            ].map((stat, i) => (
              <div
                key={i}
                className="text-center p-4 bg-[#F9F7F1] rounded-xl border-2 border-black/5"
              >
                <p className="font-display text-2xl md:text-3xl text-[#FF6B35]">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* PORTFOLIO INTERACTIF */}
      <section id="galerie" className="py-16 md:py-20 bg-[#F9F7F1]">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-display mb-3 transform -rotate-1 inline-block bg-[#FF6B35] text-white px-4 py-1 shadow-[4px_4px_0px_#000]">
              Le Hall of Fame 🏆
            </h2>
            <p className="mt-4 text-gray-500 text-sm md:text-base">
              Glisse le curseur pour voir la magie opérer.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            {restorations.map((resto) => (
              <BeforeAfterSlider
                key={resto.id}
                before={resto.before}
                after={resto.after}
                title={resto.title}
                tag={resto.tag}
              />
            ))}
          </div>

          <div className="text-center mt-12">
            <a
              href="https://instagram.com/superdatomatic"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-bold hover:text-[#FF6B35] underline decoration-wavy underline-offset-4"
            >
              Voir plus de restaurations sur Instagram <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* AVIS */}
      <section id="avis" className="py-16 md:py-20 bg-[#FF6B35] overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 md:px-6 mb-8 flex justify-between items-end">
          <h2 className="text-3xl md:text-4xl font-display text-white">
            Validé par la commu
          </h2>
          <div className="hidden md:flex gap-2">
            <button
              onClick={() => {
                const container = document.getElementById('avis-scroll');
                container?.scrollBy({ left: -340, behavior: 'smooth' });
              }}
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
              aria-label="Avis précédent"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => {
                const container = document.getElementById('avis-scroll');
                container?.scrollBy({ left: 340, behavior: 'smooth' });
              }}
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
              aria-label="Avis suivant"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="md:hidden px-4 mb-4 flex items-center gap-2 text-white/70 text-sm">
          <ChevronLeft size={16} />
          <span>Glisse pour voir plus</span>
          <ChevronRight size={16} />
        </div>

        <div id="avis-scroll" className="flex gap-4 md:gap-6 px-4 md:px-6 overflow-x-auto pb-6 snap-x scrollbar-hide scroll-smooth">
          {[
            {
              name: '@vintage_bob',
              initials: 'VB',
              avatarColor: 'bg-[#1A1A1A]',
              text: "Le boulot de dingue sur ma Longines ! Je reconnais plus le cadran.",
              color: 'bg-white',
            },
            {
              name: '@marie_watches',
              initials: 'MW',
              avatarColor: 'bg-[#8338EC]',
              text: 'Super comm, rapide et ultra pro. La vidéo YouTube était top.',
              color: 'bg-[#E0F7FA]',
            },
            {
              name: '@ticktock_fr',
              initials: 'TT',
              avatarColor: 'bg-[#FF006E]',
              text: "J'ai failli la jeter, tu l'as sauvée. Respect éternel.",
              color: 'bg-[#F3E5F5]',
            },
            {
              name: '@julien_b',
              initials: 'JB',
              avatarColor: 'bg-[#FF6B35]',
              text: 'Un artiste. Point barre.',
              color: 'bg-[#FFF9C4]',
            },
          ].map((avis, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className={`min-w-[280px] md:min-w-[320px] p-4 rounded-xl border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,0.15)] ${avis.color} flex-shrink-0 snap-center`}
            >
              <div className="flex items-center gap-3 mb-2 border-b-2 border-black/5 pb-2">
                <div className={`w-8 h-8 rounded-full ${avis.avatarColor} flex items-center justify-center text-white text-xs font-bold`}>
                  {avis.initials}
                </div>
                <span className="font-bold text-sm">{avis.name}</span>
                <div className="ml-auto flex text-[#FF6B35]">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={12} fill="currentColor" aria-hidden="true" />
                  ))}
                </div>
              </div>
              <p className="font-medium text-sm leading-relaxed">"{avis.text}"</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CONTACT & FOOTER */}
      <footer id="contact" className="bg-[#1A1A1A] text-white py-16 md:py-20 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        ></div>

        <div className="max-w-6xl mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-4xl mx-auto bg-[#F9F7F1] text-black rounded-2xl p-6 md:p-8 border-4 border-[#8338EC] shadow-[0_10px_30px_rgba(131,56,236,0.2)]">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-4xl font-display mb-2">On lance le projet ?</h2>
              <p className="text-sm md:text-base text-gray-600">
                Remplis le formulaire, envoie-moi une photo.
              </p>
            </div>

            <form className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="prenom" className="font-bold ml-1 text-sm">Ton Prénom</label>
                  <input
                    id="prenom"
                    type="text"
                    className="w-full bg-white border-2 border-black rounded-lg p-3 font-medium text-sm focus:outline-none focus:ring-2 ring-[#FF6B35] transition-all"
                    placeholder="Jean-Michel"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="email" className="font-bold ml-1 text-sm">Ton Email</label>
                  <input
                    id="email"
                    type="email"
                    className="w-full bg-white border-2 border-black rounded-lg p-3 font-medium text-sm focus:outline-none focus:ring-2 ring-[#FF6B35] transition-all"
                    placeholder="jean@michel.com"
                    required
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label htmlFor="histoire" className="font-bold ml-1 text-sm">L'histoire de la montre</label>
                <textarea
                  id="histoire"
                  rows="3"
                  className="w-full bg-white border-2 border-black rounded-lg p-3 font-medium text-sm focus:outline-none focus:ring-2 ring-[#FF6B35] transition-all"
                  placeholder="Détails du problème, marque, année..."
                  required
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="photo" className="font-bold ml-1 text-sm">Photo de ta montre</label>
                <label
                  htmlFor="photo"
                  className="flex items-center justify-center gap-3 w-full bg-white border-2 border-dashed border-black/30 hover:border-[#FF6B35] rounded-lg p-4 font-medium text-sm cursor-pointer transition-colors group"
                >
                  <Upload size={20} className="text-gray-400 group-hover:text-[#FF6B35] transition-colors" />
                  <span className="text-gray-500 group-hover:text-[#FF6B35] transition-colors">
                    Clique ou glisse une image ici
                  </span>
                  <input
                    id="photo"
                    type="file"
                    accept="image/*"
                    className="hidden"
                  />
                </label>
              </div>
              <button
                type="submit"
                className="w-full bg-[#8338EC] text-white font-display text-lg py-3 rounded-lg hover:bg-[#7020d0] transition-colors border-2 border-black shadow-[4px_4px_0px_#000] active:translate-y-0.5 active:shadow-[2px_2px_0px_#000]"
              >
                ENVOYER LA DEMANDE
              </button>
            </form>
          </div>

          {/* Infos de contact */}
          <div className="mt-16 grid md:grid-cols-3 gap-8 text-sm">
            <div>
              <span className="font-display text-xl text-[#FF6B35]">SuperDato</span>
              <p className="mt-2 text-gray-400 leading-relaxed">
                Atelier de restauration horlogère spécialisé dans les montres vintage de prestige.
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-3">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center gap-2">
                  <Phone size={14} aria-hidden="true" />
                  <a href="tel:+33612345678" className="hover:text-[#FF6B35] transition-colors">
                    +33 6 12 34 56 78
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Mail size={14} aria-hidden="true" />
                  <a href="mailto:contact@superdato.com" className="hover:text-[#FF6B35] transition-colors">
                    contact@superdato.com
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin size={14} aria-hidden="true" />
                  <span>Paris, France</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-3">Suivre l'atelier</h3>
              <div className="flex gap-4">
                <a
                  href="https://instagram.com/superdatomatic"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#FF6B35] flex items-center justify-center transition-colors"
                  aria-label="Instagram SuperDato"
                >
                  <Instagram size={18} />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#FF6B35] flex items-center justify-center transition-colors"
                  aria-label="YouTube SuperDato"
                >
                  <Youtube size={18} />
                </a>
                <a
                  href="mailto:contact@superdato.com"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#FF6B35] flex items-center justify-center transition-colors"
                  aria-label="Envoyer un email"
                >
                  <Mail size={18} />
                </a>
              </div>
            </div>
          </div>

          {/* Copyright + liens légaux */}
          <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
            <span>© {new Date().getFullYear()} SuperDato. Tous droits réservés.</span>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Mentions légales</a>
              <a href="#" className="hover:text-white transition-colors">CGV</a>
              <a href="#" className="hover:text-white transition-colors">Politique de confidentialité</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
