/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, AnimatePresence } from 'motion/react';

// Substitua pela URL de Implantação do Google Apps Script
const GAS_URL = 'https://script.google.com/macros/s/AKfycbwbe5w5bF_gkkAERetOujLYYAnk0MTn7Z2-A-YaQR9i3NM3rSVtfNOzGVZYalWeEdOQXQ/exec';

export default function App() {
  const [isOpened, setIsOpened] = useState(false);
  const [showContent, setShowContent] = useState(false);

  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef as any,
    offset: ["start 80%", "end 15%"]
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
                "[...] O cordão de três dobras não se rompe facilmente."
              </p>
            </div>

            {/* Names */}
            <h1 className="text-6xl md:text-8xl lg:text-[9rem] text-primary font-script leading-none translate-y-2">
              Julia & Jesse
            </h1>

            <div className="w-48 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />

            <p className="font-display text-[10px] md:text-xs uppercase tracking-[0.3em] md:tracking-[0.4em] text-primary-dark/70">
              Convidam você para a cerimônia e festa do seu casamento
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
                <svg xmlns="http://www.w3.org/2000/svg" height="30" viewBox="0 -960 960 960" width="30" className="mx-auto opacity-70" fill="#E0C58E"><path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Z" /></svg>
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
                  <img src="https://irmaosdreon.com.br/wp-content/uploads/2026/02/prato-Festa.svg" alt="Jantar" className="w-[140px] md:w-[380px] mb-2 md:mb-4" />
                  <h4 className="font-script text-[clamp(28px,3vw,36px)] text-primary-dark mb-1 leading-none">Jantar</h4>
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
                  style={{ backgroundImage: "url('https://lh3.googleusercontent.com/d/1-l5kGm7ACRqitipbK1vrjmLT6r4YnSVl')" }}
                ></div>
              </div>
              <div className="absolute bottom-0 right-4 w-60 h-72 bg-slate-200 shadow-xl transform rotate-3 border-4 border-white z-20">
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: "url('https://lh3.googleusercontent.com/d/1dpAwAkBG5KYRywfDzDUyeEXpNAVOs6Me')" }}
                ></div>
              </div>
              <div className="absolute -top-10 -left-10 text-primary/20 transform rotate-12 z-0">
                <svg xmlns="http://www.w3.org/2000/svg" height="96" viewBox="0 -960 960 960" width="96" fill="currentColor"><path d="M440-80q-33 0-56.5-23.5T360-160v-160H200q-33 0-56.5-23.5T120-400q0-23 11-40.5t29-29.5q-18-12-29-29.5T120-540q0-33 23.5-56.5T200-620h70l-96-96q-11-11-17.5-25.5T150-772q0-36 26-62t62-26q16 0 30.5 6.5T294-836l66 66v-70q0-33 23.5-56.5T440-920q23 0 40.5 11t29.5 29q12-18 29.5-29t40.5-11q33 0 56.5 23.5T660-840v70l66-66q11-11 25.5-17.5T782-860q36 0 62 26t26 62q0 16-6.5 30.5T846-716l-96 96h70q33 0 56.5 23.5T900-540q0 23-11 40.5T860-470q18 12 29 29.5t11 40.5q0 33-23.5 56.5T820-320H660v160q0 33-23.5 56.5T580-80h-140Z" /></svg>
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
                  <p className="text-primary-dark/80 text-lg leading-relaxed font-display">Rua Rio Pinheiros, 380 — Porto Novo — Caraguatatuba/SP</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a href="https://share.google/G7742NroW63XqF5qN" target="_blank" rel="noreferrer" className="flex-1 bg-primary hover:bg-primary-dark text-white p-4 rounded-sm shadow-md transition-colors flex items-center justify-center gap-2 text-xs font-bold tracking-widest uppercase min-h-[56px]">
                    <svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 -960 960 960" width="18" fill="currentColor"><path d="M600-120 360-202l-162 68q-21 9-39.5-3T140-172v-576q0-15 9-27t24-17l187-76 240 82 162-68q21-9 39.5 3t18.5 35v576q0 15-9 27t-24 17l-187 76Zm-20-80v-504l-200-68v504l200 68Z" /></svg>
                    Abrir no Google Maps
                  </a>
                  <a href="https://ul.waze.com/ul?place=EkBSdWEuIFJpbyBQaW5oZWlyb3MsIDM4MCAtIFBvcnRvIE5vdm8sIENhcmFndWF0YXR1YmEgLSBTUCwgQnJhemlsIjESLwoUChIJWcsH5ceC0pQR_dQJdvBOhVwQ_AIqFAoSCQEUB-XHgtKUEaMJC7W4NcVp&ll=-23.72020460%2C-45.46036480&navigate=yes&utm_campaign=default&utm_source=waze_website&utm_medium=lm_share_location" target="_blank" rel="noreferrer" className="flex-1 bg-white border-2 border-primary text-primary hover:bg-primary/5 p-4 rounded-sm shadow-sm transition-colors flex items-center justify-center gap-2 text-xs font-bold tracking-widest uppercase min-h-[56px]">
                    <svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 -960 960 960" width="18" fill="currentColor"><path d="m200-80 56-560h448l56 560H200Zm80-80h400l-40-400H320l-40 400Zm120-640v-80h160v80H400Zm-40 160h240-240Zm0 0h240l20-200H340l20 200Z" /></svg>
                    Abrir no Waze
                  </a>
                </div>
              </div>
              <div className="relative h-[400px] w-full bg-slate-100 rounded-lg overflow-hidden border-8 border-white shadow-lg rotate-1 transform hover:rotate-0 transition-transform duration-500">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3645.5!2d-45.4625!3d-23.7202!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94d282c7e507cb59%3A0x5c854ef076d4d4fd!2sR.%20Rio%20Pinheiros%2C%20380%20-%20Porto%20Novo%2C%20Caraguatatuba%20-%20SP%2C%20Brazil!5e0!3m2!1spt-BR!2sbr!4v1709900000000!5m2!1spt-BR!2sbr"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Localização Sítio Essência"
                  className="absolute inset-0"
                />
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-4 py-2 rounded-sm shadow text-xs font-bold text-slate-800 pointer-events-none">Sítio Essência, Caraguatatuba</div>
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
            <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48" fill="#859778" className="mb-6"><path d="M480-528 300-368q-23 19-51.5 13.5T210-386q-10-27-1-53t35-43l196-152q-12-12-20-28.5t-8-37.5q0-42 29-71t71-29q42 0 71 29t29 71q0 21-8 37.5T584-634l196 152q26 17 35 43t-1 53q-10 26-38.5 31.5T724-368L480-528ZM200-120q-17 0-28.5-11.5T160-160q0-17 11.5-28.5T200-200h560q17 0 28.5 11.5T800-160q0 17-11.5 28.5T760-120H200Z" /></svg>
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
                <svg xmlns="http://www.w3.org/2000/svg" height="70" viewBox="0 -960 960 960" width="70" fill="#F6F1E8" className="select-none hidden md:block"><path d="M240-120q-17 0-28.5-11.5T200-160v-82q-18-20-29-44.5T160-340v-380q0-109 116-154.5T480-920q188 0 304 45.5T900-720v380q0 29-11 53.5T860-242v82q0 17-11.5 28.5T820-120h-40q-17 0-28.5-11.5T740-160v-40H340v40q0 17-11.5 28.5T300-120h-60Zm242-640h238-480 242Zm158 280H240h480-80Zm-400-80h480v-120H240v120Zm100 280q25 0 42.5-17.5T400-340q0-25-17.5-42.5T340-400q-25 0-42.5 17.5T280-340q0 25 17.5 42.5T340-280Zm280 0q25 0 42.5-17.5T680-340q0-25-17.5-42.5T620-400q-25 0-42.5 17.5T560-340q0 25 17.5 42.5T620-280ZM258-760h444q-46-20-121-30t-101-10q-66 0-121 10t-101 30Zm-18 400h480v-120H240v120Z" /></svg>
              </div>
              {/* Content Rows */}
              <div className="flex flex-col gap-10">
                {/* Suites Section */}
                <div className="flex gap-5">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#F6F1E8] flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="#859778"><path d="M80-200v-240q0-27 11-49t29-39v-112q0-50 35-85t85-35h160q23 0 43 8.5t37 23.5q17-15 37-23.5t43-8.5h160q50 0 85 35t35 85v112q18 17 29 39t11 49v240h-80v-80H160v80H80Zm440-360h240v-80q0-17-11.5-28.5T720-680H560q-17 0-28.5 11.5T520-640v80Zm-320 0h240v-80q0-17-11.5-28.5T400-680H240q-17 0-28.5 11.5T200-640v80Zm-40 200h640v-80q0-17-11.5-28.5T760-480H200q-17 0-28.5 11.5T160-440v80Zm640 0H160h640Z" /></svg>
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
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="#859778"><path d="M240-120q-17 0-28.5-11.5T200-160v-82q-18-20-29-44.5T160-340v-380q0-109 116-154.5T480-920q188 0 304 45.5T900-720v380q0 29-11 53.5T860-242v82q0 17-11.5 28.5T820-120h-40q-17 0-28.5-11.5T740-160v-40H340v40q0 17-11.5 28.5T300-120h-60Zm242-640h238-480 242Zm158 280H240h480-80Zm-400-80h480v-120H240v120Zm100 280q25 0 42.5-17.5T400-340q0-25-17.5-42.5T340-400q-25 0-42.5 17.5T280-340q0 25 17.5 42.5T340-280Zm280 0q25 0 42.5-17.5T680-340q0-25-17.5-42.5T620-400q-25 0-42.5 17.5T560-340q0 25 17.5 42.5T620-280ZM258-760h444q-46-20-121-30t-101-10q-66 0-121 10t-101 30Zm-18 400h480v-120H240v120Z" /></svg>
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
                      <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="rgba(255,255,255,0.8)" className="animate-spin"><path d="M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-692v-108h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z" /></svg>
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
                      {isSubmitting ? <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="white" className="animate-spin"><path d="M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-692v-108h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z" /></svg> : 'Enviar Confirmação e Finalizar'}
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
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="flex flex-col items-center justify-center text-center py-12 gap-6 relative overflow-hidden"
                >
                  {/* Confetti */}
                  <ConfettiEffect />

                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 12 }}
                    className="w-24 h-24 bg-[#6a7a5b]/10 rounded-full flex items-center justify-center text-[#6a7a5b] mb-2 relative z-10"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48" fill="currentColor"><path d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z" /></svg>
                  </motion.div>

                  <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="font-script text-5xl text-primary relative z-10"
                  >
                    Presença Confirmada!
                  </motion.h3>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                    className="text-lg text-primary-dark/80 font-display relative z-10 max-w-md"
                  >
                    Sua confirmação foi registrada com sucesso. Estamos muito felizes em saber que você estará conosco nesse dia tão especial!
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.5 }}
                    className="w-48 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent relative z-10"
                  />

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1, duration: 0.5 }}
                    className="flex flex-col items-center gap-4 relative z-10"
                  >
                    <p className="text-base text-primary-dark/70 font-display italic max-w-sm">
                      Se desejar, ficaremos muito felizes com o seu carinho através de um presente. 🤍
                    </p>
                    <a
                      href="https://site.lejour.com.br/julia-e-jesse"
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-flex items-center justify-center gap-3 h-14 px-10 bg-gold hover:bg-[#d4b57e] text-white font-bold uppercase tracking-widest rounded-sm shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 text-xs"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20" fill="currentColor"><path d="M160-80q-33 0-56.5-23.5T80-160v-400q0-33 23.5-56.5T160-640h120v-80q0-66 47-113t113-47q66 0 113 47t47 113v80h160q33 0 56.5 23.5T840-560v400q0 33-23.5 56.5T760-80H160Zm0-80h600v-400H160v400Zm200-480h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80ZM160-160v-400 400Z" /></svg>
                      Presentear os Noivos
                    </a>
                  </motion.div>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 0.5 }}
                    className="text-sm font-bold text-primary-dark/60 font-script text-2xl relative z-10 mt-4"
                  >
                    Julia & Jesse
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="w-full bg-white py-16 flex flex-col items-center justify-center border-t border-[#F6F1E8]">
          <h2 className="text-5xl md:text-6xl font-script text-gold mb-8">Julia & Jesse</h2>
          <div className="flex gap-4">
            <a href="#" className="text-primary-dark/40 hover:text-gold transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="currentColor"><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280L160-640v400h640v-400L480-440Zm0-80 320-200H160l320 200ZM160-640v-80 480-400Z" /></svg>
            </a>
            <a href="#" className="text-slate-400 hover:text-primary transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="currentColor"><path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Z" /></svg>
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}

const CONFETTI_COLORS = ['#E0C58E', '#859778', '#6a7a5b', '#d4a574', '#f0c4c4', '#A3B198', '#c9a96e', '#F6F1E8'];

function ConfettiEffect() {
  const particles = React.useMemo(() => {
    return Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 3,
      size: 4 + Math.random() * 8,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      rotation: Math.random() * 360,
      shape: Math.random() > 0.5 ? 'circle' : 'rect',
    }));
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      <style>{`
        @keyframes confettiFall {
          0% { transform: translateY(-20px) rotate(0deg) scale(1); opacity: 1; }
          50% { opacity: 1; }
          100% { transform: translateY(600px) rotate(720deg) scale(0.3); opacity: 0; }
        }
        @keyframes confettiSwing {
          0%, 100% { translate: -15px 0; }
          50% { translate: 15px 0; }
        }
      `}</style>
      {particles.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.left}%`,
            top: '-10px',
            width: `${p.size}px`,
            height: p.shape === 'rect' ? `${p.size * 1.5}px` : `${p.size}px`,
            backgroundColor: p.color,
            borderRadius: p.shape === 'circle' ? '50%' : '2px',
            animation: `confettiFall ${p.duration}s ease-in ${p.delay}s forwards, confettiSwing ${0.5 + Math.random() * 1}s ease-in-out ${p.delay}s ${Math.ceil(p.duration / 0.75)} alternate`,
            transform: `rotate(${p.rotation}deg)`,
            opacity: 0,
          }}
        />
      ))}
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
