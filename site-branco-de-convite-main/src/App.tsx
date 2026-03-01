/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, AnimatePresence } from 'motion/react';

// Substitua pela URL de Implantação do Google Apps Script
const GAS_URL = 'https://script.google.com/macros/s/AKfycbwxfkhGaiRC6XPY43uB-EwBZkX3RGe11ohWpyJurfLbnoSwvXZnVJjqRPSyGnoRQuOr_A/exec';

export default function App() {
  const [isOpened, setIsOpened] = useState(false);
  const [showContent, setShowContent] = useState(false);

  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef as any,
    offset: ["start 80%", "end 20%"]
  });

  // ========== RSVP STATE ==========
  const [rsvpState, setRsvpState] = useState<'search' | 'confirming' | 'success'>('search');
  const [searchValue, setSearchValue] = useState('');
  const [searchError, setSearchError] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);

  const [guestConfirmations, setGuestConfirmations] = useState<Record<string, boolean>>({});
  const [needsVan, setNeedsVan] = useState(false);
  const [needsAccommodation, setNeedsAccommodation] = useState(false);
  const [childrenCount, setChildrenCount] = useState('');
  const [guestMessage, setGuestMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handlers para o RSVP
  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError('');
    if (!searchValue.trim()) return;

    setIsSearching(true);
    try {
      const res = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' }, // Content-type raw for Apps Script CORS
        body: JSON.stringify({ action: 'search', query: searchValue })
      });
      const data = await res.json();

      if (data.error) {
        setSearchError(data.message || data.error);
      } else if (data.group) {
        setSelectedGroup(data.group);
        // Inicializa o estado de confirmacao de todo mundo do grupo pra vazio ou false se preferir, deixando undefined para forçar clique
        setGuestConfirmations({});
        setRsvpState('confirming');
      }
    } catch (err) {
      setSearchError('Erro ao buscar convidado. Tente novamente mais tarde.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleConfirmSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError('');

    // Verifica se todos as pessoas do grupo foram sinalizadas
    const allNames = [selectedGroup.principal_raw, ...selectedGroup.members_raw];
    const missing = allNames.some(name => guestConfirmations[name] === undefined);

    if (missing) {
      setSearchError('Por favor, marque SIM ou NÃO para todas as pessoas do seu grupo acima.');
      return;
    }

    const whatsappInput = (document.getElementById('whatsapp') as HTMLInputElement)?.value;

    const attendingMembers = allNames.filter(name => guestConfirmations[name] === true);
    const notAttendingMembers = allNames.filter(name => guestConfirmations[name] === false);

    setIsSubmitting(true);
    try {
      const res = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'confirm',
          payload: {
            groupId: selectedGroup.group_id,
            principalName: selectedGroup.principal_raw,
            whatsapp: whatsappInput,
            attendingMembers,
            notAttendingMembers,
            totalGuests: attendingMembers.length,
            needsVan,
            needsAccommodation,
            childrenCount: childrenCount || 0,
            message: guestMessage
          }
        })
      });

      const data = await res.json();
      if (data.error) {
        setSearchError(data.message || data.error);
      } else {
        setRsvpState('success');
      }
    } catch (error) {
      setSearchError('Ocorreu um erro ao enviar sua confirmação. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleOpen = () => {
    setIsOpened(true);
    setTimeout(() => {
      setShowContent(true);
      // Oculta completamente o envelope da DOM após a animação de revelação terminar
      setTimeout(() => {
        document.getElementById('envelope-container')?.classList.add('hidden');
      }, 1500);
    }, 1800); // tempo até liberar scroll e mostrar conteúdo (0.5s fade + 1.3s flaps)
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const stagger = {
    visible: { transition: { staggerChildren: 0.2 } }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen flex flex-col items-center overflow-x-hidden selection:bg-primary/30 text-base md:text-lg">

      {/* Envelope Section */}
      <div
        id="envelope-container"
        className={`fixed inset-0 z-50 flex items-center justify-center bg-background-light ease-in-out overflow-hidden transition-all duration-1000 ${isOpened ? 'is-opening pointer-events-none' : ''} ${showContent ? 'opacity-0 scale-105' : 'opacity-100 scale-100'}`}
      >
        <div className="relative w-full h-full">

          {/* Carta Interna */}
          <div className="envelope-letter absolute top-0 left-0 w-full h-full bg-paper z-0 flex flex-col items-center justify-center p-6 text-center">
            <h1 className="text-5xl md:text-7xl font-script text-primary mb-4">Julia & Jesse</h1>
            <p className="font-display text-text-dark text-xl">Temos a alegria de convidar você!</p>
          </div>

          {/* Fundo Verde Sólido Interno */}
          <div className="envelope-base absolute inset-0 bg-primary z-10 pointer-events-none"></div>

          {/* Abas Laterais */}
          <div className="absolute inset-0 z-20 pointer-events-none">
            {/* Esquerda */}
            <div className="absolute top-0 left-0 w-1/2 h-full envelope-flap-left origin-left">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                <polygon points="0,0 100,50 0,100" className="fill-primary" />
                <polyline points="0,0 100,50 0,100" fill="none" className="stroke-[#E0C58E]" strokeWidth="1.5" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
              </svg>
            </div>
            {/* Direita */}
            <div className="absolute top-0 right-0 w-1/2 h-full envelope-flap-right origin-right">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                <polygon points="100,0 0,50 100,100" className="fill-primary" />
                <polyline points="100,0 0,50 100,100" fill="none" className="stroke-[#E0C58E]" strokeWidth="1.5" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          {/* Aba Inferior */}
          <div className="envelope-flap-bottom absolute bottom-0 left-0 w-full h-1/2 origin-bottom z-30 pointer-events-none drop-shadow-[0_-5px_15px_rgba(0,0,0,0.15)]">
            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
              <polygon points="0,100 50,0 100,100" className="fill-primary" />
              <polyline points="0,100 50,0 100,100" fill="none" className="stroke-[#E0C58E]" strokeWidth="1.5" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
            </svg>
          </div>

          {/* Aba Superior */}
          <div className="envelope-flap-top absolute top-0 left-0 w-full h-1/2 origin-top z-40 pointer-events-none drop-shadow-2xl">
            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
              <polygon points="0,0 50,100 100,0" className="fill-primary" />
              <polyline points="0,0 50,100 100,0" fill="none" className="stroke-[#E0C58E]" strokeWidth="1.5" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
            </svg>
          </div>

          {/* Selo (Centralizado e clicável) */}
          <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
            <button
              className="envelope-seal pointer-events-auto cursor-pointer transition-transform duration-300 hover:scale-110 active:scale-95"
              onClick={handleOpen}
              aria-label="Abrir convite"
            >
              <img
                src="https://irmaosdreon.com.br/wp-content/uploads/2026/02/selo.svg"
                className="w-[120px] h-[104px] md:w-[150px] md:h-[130px] drop-shadow-2xl object-contain text-transparent"
                alt="Selo do envelope"
              />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className={`w-full flex flex-col items-center transition-opacity duration-1000 ease-in-out ${showContent ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>

        {/* Hero Section (Maryinvite Inspired) */}
        <section id="hero" className="relative w-full min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20 pb-12 overflow-hidden bg-paper">

          {/* Inner Victorian Frame */}
          <div className="victorian-border"></div>

          {/* Corner Filigrees */}
          <div className="absolute top-10 left-10 sm:top-14 sm:left-14 pointer-events-none opacity-40 z-10 w-16 h-16 sm:w-24 sm:h-24">
            <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" className="text-gold" strokeWidth="1">
              <path d="M10 10 Q 50 10, 50 50 Q 50 90, 90 90" strokeDasharray="2 2" opacity="0.5" />
              <path d="M10 10 Q 10 50, 50 50 Q 90 50, 90 90" strokeDasharray="2 2" opacity="0.5" />
              <path d="M5 5 C 20 5, 5 20, 20 20" />
              <path d="M5 5 C 5 20, 20 5, 20 20" />
              <circle cx="20" cy="20" r="2" fill="currentColor" />
              <path d="M5 5 L 40 5 M 5 5 L 5 40" strokeWidth="0.5" />
              <path d="M15 5 Q 15 15, 5 15" />
              <path d="M25 5 Q 25 25, 5 25" />
            </svg>
          </div>
          <div className="absolute top-10 right-10 sm:top-14 sm:right-14 pointer-events-none opacity-40 rotate-90 z-10 w-16 h-16 sm:w-24 sm:h-24">
            <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" className="text-gold" strokeWidth="1">
              <path d="M10 10 Q 50 10, 50 50 Q 50 90, 90 90" strokeDasharray="2 2" opacity="0.5" />
              <path d="M10 10 Q 10 50, 50 50 Q 90 50, 90 90" strokeDasharray="2 2" opacity="0.5" />
              <path d="M5 5 C 20 5, 5 20, 20 20" />
              <path d="M5 5 C 5 20, 20 5, 20 20" />
              <circle cx="20" cy="20" r="2" fill="currentColor" />
              <path d="M5 5 L 40 5 M 5 5 L 5 40" strokeWidth="0.5" />
              <path d="M15 5 Q 15 15, 5 15" />
              <path d="M25 5 Q 25 25, 5 25" />
            </svg>
          </div>
          <div className="absolute bottom-14 left-10 sm:bottom-16 sm:left-14 pointer-events-none opacity-40 -rotate-90 z-10 w-16 h-16 sm:w-24 sm:h-24">
            <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" className="text-gold" strokeWidth="1">
              <path d="M10 10 Q 50 10, 50 50 Q 50 90, 90 90" strokeDasharray="2 2" opacity="0.5" />
              <path d="M10 10 Q 10 50, 50 50 Q 90 50, 90 90" strokeDasharray="2 2" opacity="0.5" />
              <path d="M5 5 C 20 5, 5 20, 20 20" />
              <path d="M5 5 C 5 20, 20 5, 20 20" />
              <circle cx="20" cy="20" r="2" fill="currentColor" />
              <path d="M5 5 L 40 5 M 5 5 L 5 40" strokeWidth="0.5" />
              <path d="M15 5 Q 15 15, 5 15" />
              <path d="M25 5 Q 25 25, 5 25" />
            </svg>
          </div>
          <div className="absolute bottom-14 right-10 sm:bottom-16 sm:right-14 pointer-events-none opacity-40 rotate-180 z-10 w-16 h-16 sm:w-24 sm:h-24">
            <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" className="text-gold" strokeWidth="1">
              <path d="M10 10 Q 50 10, 50 50 Q 50 90, 90 90" strokeDasharray="2 2" opacity="0.5" />
              <path d="M10 10 Q 10 50, 50 50 Q 90 50, 90 90" strokeDasharray="2 2" opacity="0.5" />
              <path d="M5 5 C 20 5, 5 20, 20 20" />
              <path d="M5 5 C 5 20, 20 5, 20 20" />
              <circle cx="20" cy="20" r="2" fill="currentColor" />
              <path d="M5 5 L 40 5 M 5 5 L 5 40" strokeWidth="0.5" />
              <path d="M15 5 Q 15 15, 5 15" />
              <path d="M25 5 Q 25 25, 5 25" />
            </svg>
          </div>

          <motion.div
            className="relative z-20 flex flex-col items-center space-y-8 md:space-y-12 w-full max-w-4xl p-6"
            initial="hidden"
            animate={showContent ? "visible" : "hidden"}
            variants={fadeInUp}
          >
            {/* Monogram or Verse */}
            <div className="space-y-4 pt-10">
              <p className="font-display text-[10px] md:text-xs uppercase tracking-[0.4em] text-primary-dark/60">Eclesiastes 4.12</p>
              <p className="font-display italic text-base md:text-lg text-primary-dark/80 max-w-sm mx-auto">
                "Um cordão de três dobras não se rompe com facilidade."
              </p>
            </div>

            {/* Names */}
            <h1 className="text-6xl md:text-8xl lg:text-[9rem] text-primary font-script leading-none translate-y-2">
              Julia & Jesse
            </h1>

            <div className="w-48 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />

            <p className="font-display text-[10px] md:text-xs uppercase tracking-[0.3em] md:tracking-[0.4em] text-primary-dark/70">
              Convidam para celebrar o seu amor
            </p>

            {/* Date Details */}
            <div className="flex items-center gap-6 md:gap-8 font-display text-2xl md:text-5xl text-primary-dark/90 tracking-[0.15em] md:tracking-[0.2em] pt-4">
              <span>26</span>
              <span className="w-px h-10 md:h-12 bg-gold/50"></span>
              <span className="text-lg md:text-3xl mt-1">MAIO</span>
              <span className="w-px h-10 md:h-12 bg-gold/50"></span>
              <span>2026</span>
            </div>

            <p className="font-display text-[10px] md:text-sm uppercase tracking-[0.3em] md:tracking-[0.4em] text-primary-dark/80">
              Terça - Feira às 15:30
            </p>

            {/* Location */}
            <div className="pt-8 md:pt-12">
              <h2 className="font-script text-3xl md:text-5xl text-gold mb-3">Sítio Essência</h2>
              <p className="font-display text-[9px] md:text-[11px] uppercase tracking-[0.2em] md:tracking-widest text-primary-dark/60">Caraguatatuba, São Paulo</p>
            </div>

            <a href="#rsvp" className="mt-12 inline-flex items-center justify-center h-12 px-8 bg-transparent border border-gold text-primary hover:bg-gold hover:text-white transition-all text-xs font-bold uppercase tracking-widest rounded-sm">
              Confirmar Presença
            </a>
          </motion.div>
        </section>

        {/* Welcome Section (Luxury Card) */}
        <section className="w-full bg-white relative py-24 md:py-32 px-6 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-8 bg-white torn-paper-bottom z-10 transform rotate-180"></div>
          <motion.div
            className="max-w-4xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <div className="luxury-card bg-background-light p-10 md:p-20 shadow-xl max-w-3xl mx-auto">
              <div className="text-center space-y-8 relative z-10">
                <span className="material-symbols-outlined text-gold mx-auto opacity-70 text-3xl">favorite</span>
                <h2 className="font-script text-5xl md:text-7xl text-gold">Nossos Convidados</h2>
                <p className="font-display text-lg md:text-2xl text-primary-dark/80 leading-relaxed italic max-w-2xl mx-auto">
                  Nosso casamento é um sonho que estamos realizando com muito amor, e ter vocês ao nosso lado nesse dia é parte essencial dessa alegria. Queremos celebrar cercados de pessoas que têm significado em nossa vida, e por isso a presença de vocês é tão importante para nós.
                </p>
                <div className="flex items-center justify-center pt-6 opacity-60">
                  <div className="h-px bg-primary w-12 sm:w-24"></div>
                  <div className="mx-4 text-primary text-2xl font-script">❦</div>
                  <div className="h-px bg-primary w-12 sm:w-24"></div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Schedule Section */}
        <section className="w-full bg-white relative py-20 px-6 md:px-20 overflow-hidden">
          <motion.div
            className="timeline-zigzag max-w-[980px] mx-auto py-12 relative"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            <motion.div className="text-center mb-24" variants={fadeInUp}>
              <h2 className="text-4xl md:text-5xl font-script text-primary mb-4">Programação</h2>
              <div className="w-16 h-[2px] bg-primary/30 mx-auto"></div>
            </motion.div>

            {/* Timeline Header (Center) */}
            <motion.div variants={fadeInUp} className="timeline-header-center flex flex-col items-center justify-center text-center relative z-20 bg-white mx-auto w-fit px-8 py-4 mb-16">
              <img src="https://irmaosdreon.com.br/wp-content/uploads/2026/02/local.svg" alt="Local da recepção" className="w-[160px] md:w-[340px] mb-4 opacity-100" />
              <div className="flex flex-col items-center">
                <h3 className="font-script text-[clamp(28px,3vw,36px)] text-primary-dark mb-1 leading-none">Recepção</h3>
                <p className="font-display text-text-dark text-[clamp(14px,1.5vw,18px)]">às 15:30</p>
              </div>
            </motion.div>

            {/* Timeline Track & Events */}
            <div className="timeline-track relative w-full pt-8 pb-16" ref={timelineRef}>

              {/* Animated SVG Path for Zig-Zag Line */}
              <div className="absolute inset-y-0 left-0 right-0 pointer-events-none z-0 overflow-visible">
                <svg
                  className="w-full h-full overflow-visible"
                  preserveAspectRatio="none"
                  viewBox="0 0 100 1000"
                  fill="none"
                >
                  <motion.path
                    initial={{ pathLength: 0 }}
                    d="M50,0 C95,150 95,250 50,333 S5,500 50,666 S95,850 50,1000"
                    stroke="#E0C58E"
                    strokeWidth="0.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                    style={{ pathLength: scrollYProgress }}
                  />
                </svg>
              </div>

              <div className="flex flex-col gap-[120px] md:gap-[200px] relative z-10 w-full px-4 md:px-0">

                {/* Event 2: Left */}
                <motion.article
                  variants={fadeInUp}
                  className="timeline-item w-[calc(50%-10px)] md:w-[calc(40%)] flex flex-col items-center text-center mr-auto"
                >
                  <img src="https://irmaosdreon.com.br/wp-content/uploads/2026/02/Aliancas.svg" alt="Cerimônia" className="w-[140px] md:w-[380px] mb-2 md:mb-4" />
                  <h4 className="font-script text-[clamp(28px,3vw,36px)] text-primary-dark mb-1 leading-none">Cerimônia</h4>
                  <p className="font-display text-text-dark text-[clamp(14px,1.2vw,16px)]">às 16:30</p>
                </motion.article>

                {/* Event 3: Right */}
                <motion.article
                  variants={fadeInUp}
                  className="timeline-item w-[calc(50%-10px)] md:w-[calc(40%)] flex flex-col items-center text-center ml-auto"
                >
                  <img src="https://irmaosdreon.com.br/wp-content/uploads/2026/02/prato-Festa.svg" alt="Coquetel e ceia" className="w-[140px] md:w-[380px] mb-2 md:mb-4" />
                  <h4 className="font-script text-[clamp(28px,3vw,36px)] text-primary-dark mb-1 leading-none">Coquetel & Ceia</h4>
                  <p className="font-display text-text-dark text-[clamp(14px,1.2vw,16px)]">às 18:00</p>
                </motion.article>

                {/* Event 4: Left */}
                <motion.article
                  variants={fadeInUp}
                  className="timeline-item w-[calc(50%-10px)] md:w-[calc(40%)] flex flex-col items-center text-center mr-auto"
                >
                  <img src="https://irmaosdreon.com.br/wp-content/uploads/2026/02/tacas.svg" alt="Festa" className="w-[140px] md:w-[380px] mb-2 md:mb-4" />
                  <h4 className="font-script text-[clamp(28px,3vw,36px)] text-primary-dark mb-1 leading-none">Festa</h4>
                  <p className="font-display text-text-dark text-[clamp(13px,1.1vw,15px)] leading-tight max-w-[200px] md:max-w-[300px]">Vamos aproveitar o restante da noite juntos.</p>
                </motion.article>

              </div>
            </div>
          </motion.div>
        </section>

        {/* Our Story */}
        <section className="w-full py-24 px-6 md:px-20 bg-background-light relative">
          <div className="absolute top-0 left-0 w-full h-8 bg-background-light torn-paper-bottom z-10 transform rotate-180"></div>
          <motion.div
            className="max-w-4xl mx-auto flex flex-col md:flex-row gap-12 items-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <div className="w-full md:w-1/2 relative h-[500px]">
              <div className="absolute top-0 left-4 w-64 h-80 bg-slate-200 shadow-xl transform -rotate-3 border-4 border-white z-10">
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDoRlzgSUWXULuQk9B-XtZYgYKKnDpOWaBlqy4mxfMHm10RcQ4xDqccmE5pGV8qXrVKdcT1LfqBnLxqIUV4SmCombLRnrwdOQnpnkq9Wxd7LZdYYjJBvpd2hGmTj7kDJKF3BfDFFi7LZ9BOwrL9wpfRSiAdlwXic2Ks3BfT3X3o9Z3XxOOngU4DIYEacDsG6fzHeKAVEB-6K7icW2KFRBY8ZjqeIb9bNhR_CLSS4MPJNNeTZPY7Xfg_vz9QELLQabvBy5KeHI7lZt7')" }}
                ></div>
              </div>
              <div className="absolute bottom-0 right-4 w-60 h-72 bg-slate-200 shadow-xl transform rotate-3 border-4 border-white z-20">
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuClStczQchcP0E54MCbcN0-8boMZr35CggZkEcSZtS8Mqc3bfsFjgyNPLfMsZYU5cGNlimlrfCVrktQF6_q44ZjgGq5IcFyNfoqXfa-tyW6ch7ru76F0RHZtoYM_8VWig6J8FatqEpdnTFr8gcqxjEf5zW-Eb1D1Yds0XfcDryGWQPZEIa7nl40RkfGzBx2zozjeBx8jBnBQQKMxw3cIZPjUPubA9AcV_U0PIdZZd6rNTgu95RYN2yRgbttBhebd9jbLkZz6j9sV_8')" }}
                ></div>
              </div>
              <div className="absolute -top-10 -left-10 text-primary/20 transform rotate-12 z-0">
                <span className="material-symbols-outlined text-9xl">local_florist</span>
              </div>
            </div>
            <div className="w-full md:w-1/2 flex flex-col justify-center text-center md:text-left">
              <h2 className="text-6xl md:text-7xl font-script text-gold mb-6">Nossa História</h2>
              <div className="prose prose-lg text-primary-dark/80 font-display">
                <p className="mb-4">
                  Tudo começou na igreja, onde eu a via de longe em vários momentos. Havia algo nela que chamava meu coração de um jeito especial, e, em silêncio, passei a admirá-la e a orar por ela.
                </p>
                <p className="mb-4">
                  Com o tempo, nos aproximamos, nos conhecemos de verdade, e aquilo que nasceu em oração se transformou em amor. Em dois anos juntos, oficializamos o noivado e agora, estamos prontos para dar o próximo passo da nossa maior jornada: o nosso casamento.
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Details Section */}
        <section className="w-full bg-white relative py-20 px-6 md:px-20 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-8 bg-white torn-paper-bottom z-10 transform rotate-180"></div>
          <motion.div
            className="max-w-6xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-7xl font-script text-gold mb-4">Detalhes do Casamento</h2>
              <div className="w-16 h-[2px] bg-primary/30 mx-auto"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-start">
              <div className="flex flex-col gap-10">
                <div className="flex flex-col gap-4">
                  <h3 className="text-4xl text-primary font-script">Sítio Essência</h3>
                  <p className="text-primary-dark/80 text-lg leading-relaxed font-display">Rua Abra de Dentro, 380 — Bairro Pegorelli — Caraguatatuba/SP</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a href="https://maps.app.goo.gl/aPPtKgrtumDP1hv98" target="_blank" rel="noreferrer" className="flex-1 bg-primary hover:bg-primary-dark text-white p-4 rounded-sm shadow-md transition-colors flex items-center justify-center gap-2 text-xs font-bold tracking-widest uppercase min-h-[56px]">
                    <span className="material-symbols-outlined text-lg">map</span>
                    Abrir no Google Maps
                  </a>
                  <a href="https://waze.com/ul?q=Sítio%20Essência%20Caraguatatuba" target="_blank" rel="noreferrer" className="flex-1 bg-white border-2 border-primary text-primary hover:bg-primary/5 p-4 rounded-sm shadow-sm transition-colors flex items-center justify-center gap-2 text-xs font-bold tracking-widest uppercase min-h-[56px]">
                    <span className="material-symbols-outlined text-lg">navigation</span>
                    Abrir no Waze
                  </a>
                </div>
              </div>
              <div className="relative h-[400px] w-full bg-slate-100 rounded-lg overflow-hidden border-8 border-white shadow-lg rotate-1 transform hover:rotate-0 transition-transform duration-500">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA_zyblpLzro3IEemCTJyrf_BPleWvsTp4pWmh2IamvZIwWZd7CNH-VbWFxvj8qqT0fkhgXqijK0IBvrPDXQqtH1UG2DxCj3YvxrP8aVK8Re2mviMlXunOtZedVh5JLjdAIUVhRfD9HvYXy2j4tpMLQ_IAv-2aCh4Klm_FQ3EmrM3tYXuj6m2Lngiac556t7kd6ZGEYqHpoDe51D3zBnN8BvmmfaHmYrfSMMnyCugmzbbTPE3uLiIFsPcpdhlgvjnyLSRxf0MKEYkw')" }}
                >
                </div>
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-4 py-2 rounded-sm shadow text-xs font-bold text-slate-800">Sítio Essência, Caraguatatuba</div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Dress Code */}
        <section className="w-full bg-white py-20 px-6 border-y border-primary/10">
          <motion.div
            className="max-w-4xl mx-auto text-center relative px-4 py-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            {/* Floral Overlays */}
            <div className="absolute -top-10 -left-10 w-48 h-48 opacity-20 pointer-events-none mix-blend-multiply rotate-12">
              <img className="w-full h-full object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCxRhfyxH6ldJVHkWFe1rLlPOZK7eACjRgza80X-rQ3fQg0MAl6FqwnR49UlnBLPLNQY5b_MhDfGN3svMgMHtfevgQg6500vR4jZCrNezOI_8c4KkZME3bTN0ezOwZ3lSmCdh6Rcjem9acp_J5yMv8gM795za38M2CoeKCjOFvFOvAZac8-8ecDVBP9__ZatB98waSqwXX2yOnzDqPcgcYy6B9jXnf_fv-H6JHyz-ZLop3lYg0xoiv_wNnoVFYiynusnzpFUwMURGw" alt="Floral decoration" />
            </div>
            <div className="absolute -bottom-10 -right-10 w-48 h-48 opacity-20 pointer-events-none mix-blend-multiply -rotate-12">
              <img className="w-full h-full object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCxRhfyxH6ldJVHkWFe1rLlPOZK7eACjRgza80X-rQ3fQg0MAl6FqwnR49UlnBLPLNQY5b_MhDfGN3svMgMHtfevgQg6500vR4jZCrNezOI_8c4KkZME3bTN0ezOwZ3lSmCdh6Rcjem9acp_J5yMv8gM795za38M2CoeKCjOFvFOvAZac8-8ecDVBP9__ZatB98waSqwXX2yOnzDqPcgcYy6B9jXnf_fv-H6JHyz-ZLop3lYg0xoiv_wNnoVFYiynusnzpFUwMURGw" alt="Floral decoration" />
            </div>
            <span className="material-symbols-outlined text-[#859778] text-5xl mb-6">checkroom</span>
            <h3 className="text-5xl md:text-7xl font-script text-gold mb-8">Traje</h3>
            <div className="bg-white/40 p-8 md:p-12 rounded-sm border border-[#859778]/10 backdrop-blur-sm">
              <p className="text-xl md:text-2xl text-primary-dark/80 leading-relaxed font-display mb-6">
                Queremos que vocês aproveitem esse dia com conforto e elegância, então fiquem à vontade para escolher a cor do traje. Avisamos apenas, com carinho, que não usem a cor branca, pois ela será reservada à noiva. 🤍
              </p>
              <p className="text-lg md:text-xl text-primary-dark leading-relaxed font-display italic">
                Ah! E uma dica: como a cerimônia será no gramado, salto grosso ou bloco pode ser uma ótima escolha.
              </p>
            </div>
          </motion.div>
        </section>

        {/* Transport & Accommodation */}
        <section className="w-full bg-background-light relative py-20 px-4 md:px-20 overflow-hidden border-t border-primary/10">
          <motion.div
            className="max-w-2xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <div className="bg-white rounded-[20px] shadow-xl p-8 md:p-10 flex flex-col gap-10 relative overflow-hidden">
              {/* Card Header */}
              <div className="flex justify-between items-start">
                <div className="border-l-4 border-[#859778] pl-5 py-1">
                  <h2 className="text-4xl md:text-6xl text-gold font-script leading-none">
                    Transporte & <br /> Hospedagem
                  </h2>
                </div>
                <span className="material-symbols-outlined text-[#F6F1E8] text-7xl select-none hidden md:block">directions_bus</span>
              </div>
              {/* Content Rows */}
              <div className="flex flex-col gap-10">
                {/* Suites Section */}
                <div className="flex gap-5">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#F6F1E8] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#859778] text-2xl">bed</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-2xl font-script text-primary-dark">Suítes no Local</h3>
                    <div className="text-primary-dark/80 font-display leading-relaxed flex flex-col gap-3">
                      <p>Para nossos queridos convidados que vêm de longe, queremos que se sintam em casa! Dispomos de suítes no próprio sítio para que possam descansar e aproveitar a festa até o último minuto conosco.</p>
                      <p>É nosso presente para vocês. Basta sinalizar o interesse na confirmação de presença abaixo.</p>
                    </div>
                    <div className="mt-1">
                      <span className="inline-block bg-[#e8f5e9] text-[#2e7d32] px-3 py-1 rounded-sm text-xs font-bold uppercase tracking-widest">
                        Vagas Limitadas
                      </span>
                    </div>
                  </div>
                </div>
                {/* Van Section */}
                <div className="flex gap-5">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#F6F1E8] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#859778] text-2xl">directions_bus</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-2xl font-script text-primary-dark">Van saindo de Maresias</h3>
                    <div className="text-primary-dark/80 font-display leading-relaxed flex flex-col gap-3">
                      <p>Teremos uma van parceira como opção de transporte até o local do casamento.</p>
                      <p>O valor será de R$ 60,00 por pessoa.</p>
                      <p>Caso tenham interesse em utilizar, pedimos que informem isso na confirmação de presença para organizarmos a reserva.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* RSVP Section */}
        <section className="w-full py-24 px-4 bg-background-light relative" id="rsvp">
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC5t7oEpGV1tKMe_LOkAOZdirWx3yojmBvX9m2C1SrRYi73np9F3BExxLG4Hs2U7e1cwynZXaTn9ELZ5ZqkkWvTvMNAkLBcJZApxxX3HbrBlZY_9c60XKaXF47uGXMNasEs37MZ9TnbHhG5TJWoNjevUBI6c5Wlc3wrwa9UnbgArk2nZe2d2avR-qRuLbacHyofld16jxXe-QSjgHx6opwF6m68TrZncRQC-h7Jr6783tDbTPp5tJWPITdfSE_870jxKcW42JJ6q4M')" }}></div>
          <motion.div
            className="max-w-xl mx-auto bg-white p-8 md:p-12 shadow-2xl relative torn-paper-top torn-paper-bottom min-h-[500px]"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <div className="text-center mb-10">
              <h2 className="text-5xl md:text-7xl font-script text-gold mb-4">Confirme sua Presença</h2>
              <p className="text-primary-dark/70 font-display text-sm italic">Por favor, responda até 20 de Março</p>
            </div>

            <AnimatePresence mode="wait">
              {rsvpState === 'search' && (
                <motion.form
                  key="search"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col gap-6 font-display"
                  onSubmit={handleSearchSubmit}
                >
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-primary-dark/80 uppercase tracking-widest" htmlFor="searchName">
                      Digite seu Nome e Sobrenome
                    </label>
                    <input
                      className="w-full bg-[#F6F1E8] border border-transparent focus:border-primary/30 focus:bg-white px-4 py-4 rounded-sm text-primary-dark placeholder-primary-dark/40 outline-none transition-all text-lg"
                      id="searchName"
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      placeholder="Ex: João da Silva"
                      type="text"
                      autoComplete="off"
                      spellCheck="false"
                    />
                  </div>

                  {searchError && (
                    <p className="text-red-500 text-sm font-bold bg-red-50 p-3 rounded border border-red-100">{searchError}</p>
                  )}

                  <button
                    disabled={isSearching || !searchValue.trim()}
                    className="mt-4 w-full h-14 bg-primary hover:bg-primary-dark text-white font-bold uppercase tracking-widest transition-all rounded-sm shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    type="submit"
                  >
                    {isSearching ? (
                      <span className="material-symbols-outlined text-white/80 animate-spin">refresh</span>
                    ) : 'Buscar Convite'}
                  </button>
                </motion.form>
              )}

              {rsvpState === 'confirming' && selectedGroup && (
                <motion.form
                  key="confirming"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col gap-8 font-display"
                  onSubmit={handleConfirmSubmit}
                >
                  <div className="bg-[#F6F1E8]/50 p-6 rounded-sm border border-primary/10 mb-2">
                    <h3 className="font-script text-3xl text-primary mb-2">Olá, {selectedGroup.principal_raw.split('(')[0].trim()}!</h3>
                    <p className="text-sm text-primary-dark/70 leading-relaxed font-bold">
                      Encontramos o seu grupo de convidados:
                    </p>
                    <p className="text-sm text-primary-dark/60 leading-relaxed mt-1">
                      Abaixo, por favor informe OBRIGATORIAMENTE pra cada pessoa listada se ela poderá ou não comparecer.
                    </p>
                  </div>

                  {/* Whatsapp do Titular */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-primary-dark/80 uppercase tracking-widest" htmlFor="whatsapp">
                      Seu Whatsapp de Contato
                    </label>
                    <input
                      className="w-full bg-[#F6F1E8] border border-transparent focus:border-primary/30 focus:bg-white px-4 py-3 rounded-sm text-primary-dark outline-none transition-all"
                      id="whatsapp"
                      placeholder="(00) 00000-0000"
                      type="tel"
                      required
                    />
                  </div>

                  {/* Listagem de Membros */}
                  <div className="flex flex-col gap-3">
                    <h4 className="text-xs font-bold text-primary-dark/80 uppercase tracking-widest border-b border-primary/10 pb-2 mb-2">
                      Sua lista de convidados:
                    </h4>

                    {/* Renderiza o titular */}
                    <GuestToggle
                      name={selectedGroup.principal_raw}
                      value={guestConfirmations[selectedGroup.principal_raw]}
                      onChange={(val) => setGuestConfirmations(prev => ({ ...prev, [selectedGroup.principal_raw]: val }))}
                    />

                    {/* Renderiza acompanhantes */}
                    {selectedGroup.members_raw.map((member: string) => (
                      <GuestToggle
                        key={member}
                        name={member}
                        value={guestConfirmations[member]}
                        onChange={(val) => setGuestConfirmations(prev => ({ ...prev, [member]: val }))}
                      />
                    ))}
                  </div>

                  {/* Detalhes extras */}
                  <div className="flex flex-col gap-6 py-4 mt-2 border-t border-primary/10">
                    <label className="flex items-center justify-between cursor-pointer group">
                      <span className="text-primary-dark/80 italic text-lg pr-4">Precisa de van do local do casamento? (Maresias x Sítio)</span>
                      <div className="relative flex-shrink-0">
                        <input type="checkbox" className="peer sr-only" checked={needsVan} onChange={(e) => setNeedsVan(e.target.checked)} />
                        <div className="w-11 h-6 bg-[#ebe5da] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6a7a5b]"></div>
                      </div>
                    </label>

                    <label className="flex items-center justify-between cursor-pointer group">
                      <span className="text-primary-dark/80 italic text-lg pr-4">Pretende se hospedar no sítio?</span>
                      <div className="relative flex-shrink-0">
                        <input type="checkbox" className="peer sr-only" checked={needsAccommodation} onChange={(e) => setNeedsAccommodation(e.target.checked)} />
                        <div className="w-11 h-6 bg-[#ebe5da] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6a7a5b]"></div>
                      </div>
                    </label>
                  </div>

                  {/* Crianças e Mensagem */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-primary-dark/80 uppercase tracking-widest" htmlFor="children">
                      Crianças de colo / pequenas (0-10 anos)
                    </label>
                    <input
                      className="w-full bg-[#F6F1E8] px-4 py-3 rounded-sm border focus:bg-white focus:border-primary/20 text-primary-dark outline-none"
                      id="children"
                      value={childrenCount}
                      onChange={e => setChildrenCount(e.target.value)}
                      placeholder="0"
                      type="number"
                      min="0"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-primary-dark/80 uppercase tracking-widest" htmlFor="message">
                      Mensagem aos Noivos / Restrições alimentares
                    </label>
                    <textarea
                      className="w-full bg-[#F6F1E8] px-4 py-3 rounded-sm border focus:bg-white focus:border-primary/20 text-primary-dark outline-none resize-none h-24"
                      id="message"
                      value={guestMessage}
                      onChange={e => setGuestMessage(e.target.value)}
                      placeholder="Ex: Sou vegano e alérgico a amendoim..."
                    />
                  </div>

                  {searchError && (
                    <p className="text-red-500 text-sm font-bold bg-red-50 p-3 rounded border border-red-100">{searchError}</p>
                  )}

                  <button
                    disabled={isSubmitting}
                    className="mt-4 relative overflow-hidden group w-full h-14 bg-primary text-white font-bold uppercase tracking-widest rounded-sm shadow-md disabled:opacity-70 transition-all border border-transparent hover:border-white/20"
                    type="submit"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isSubmitting ? <span className="material-symbols-outlined animate-spin text-white">refresh</span> : 'Enviar Confirmação e Finalizar'}
                    </span>
                    {/* Animação que vai pro lado e fica verde! */}
                    <div className="absolute top-0 left-0 w-full h-full bg-green-600 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out z-0"></div>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setRsvpState('search'); setSelectedGroup(null); setSearchValue(''); setSearchError(''); }}
                    className="text-primary-dark/50 text-xs font-bold uppercase tracking-widest mt-2 hover:text-primary transition-colors h-10"
                  >
                    Cancelar e Voltar
                  </button>
                </motion.form>
              )}

              {rsvpState === 'success' && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center text-center py-12 gap-6"
                >
                  <div className="w-24 h-24 bg-[#6a7a5b]/10 rounded-full flex items-center justify-center text-[#6a7a5b] mb-4">
                    <span className="material-symbols-outlined text-5xl">check_circle</span>
                  </div>
                  <h3 className="font-script text-5xl text-primary">Recebemos!</h3>
                  <p className="text-lg text-primary-dark/80 font-display">
                    Sua confirmação foi registrada com sucesso na nossa lista de convidados final. Muito obrigado de coração!
                  </p>
                  <p className="text-sm font-bold text-primary-dark/60">
                    Julia & Jesse
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="w-full bg-white py-16 flex flex-col items-center justify-center border-t border-[#F6F1E8]">
          <h2 className="text-5xl md:text-6xl font-script text-gold mb-2">Julia & Jesse</h2>
          <p className="text-primary-dark/60 font-display italic text-base mb-8">Nos vemos no altar.</p>
          <div className="flex gap-4">
            <a href="#" className="text-primary-dark/40 hover:text-gold transition-colors">
              <span className="material-symbols-outlined">mail</span>
            </a>
            <a href="#" className="text-slate-400 hover:text-primary transition-colors">
              <span className="material-symbols-outlined">favorite</span>
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}

function GuestToggle({ name, value, onChange }: { key?: string, name: string, value?: boolean, onChange: (v: boolean) => void }) {
  return (
    <div className="flex flex-col gap-3 p-4 bg-white border border-primary/10 rounded-sm shadow-sm">
      <span className="font-bold text-primary-dark text-lg leading-tight">{name}</span>
      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => onChange(true)}
          className={`flex-1 h-12 flex items-center justify-center font-bold rounded-sm shadow-sm transition-all focus:outline-none ${value === true ? 'bg-[#6a7a5b] text-white ring-2 ring-offset-1 ring-[#6a7a5b]' : 'bg-[#F6F1E8] text-primary-dark/60 hover:bg-[#ebe5da]'}`}
        >
          Irá confirmar
        </button>
        <button
          type="button"
          onClick={() => onChange(false)}
          className={`flex-1 h-12 flex items-center justify-center font-bold rounded-sm shadow-sm transition-all focus:outline-none ${value === false ? 'bg-red-500/90 text-white ring-2 ring-offset-1 ring-red-500/50' : 'bg-[#F6F1E8] text-primary-dark/60 hover:bg-[#ebe5da]'}`}
        >
          Não irá
        </button>
      </div>
    </div>
  );
}
