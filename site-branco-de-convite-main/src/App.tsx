/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState, useEffect, useRef } from 'react';
import { motion, useScroll } from 'motion/react';

export default function App() {
  const [isOpened, setIsOpened] = useState(false);
  const [showContent, setShowContent] = useState(false);

  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef as any,
    offset: ["start 80%", "end 20%"]
  });

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
              <img src="https://irmaosdreon.com.br/wp-content/uploads/2026/02/selo.svg" className="w-[120px] md:w-[150px] drop-shadow-2xl" alt="Selo do envelope" />
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
            className="max-w-xl mx-auto bg-white p-8 md:p-12 shadow-2xl relative torn-paper-top torn-paper-bottom"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <div className="text-center mb-10">
              <h2 className="text-5xl md:text-7xl font-script text-gold mb-4">Confirme sua Presença</h2>
              <p className="text-primary-dark/70 font-display text-sm italic">Por favor, responda até 20 de Março</p>
            </div>
            <form className="flex flex-col gap-8 font-display" onSubmit={(e) => e.preventDefault()}>

              {/* Nome Completo */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-primary-dark/80 uppercase tracking-widest" htmlFor="name">
                  Nome Completo
                </label>
                <input
                  className="w-full bg-[#F6F1E8] border border-transparent focus:border-primary/30 focus:bg-white px-4 py-3 rounded-sm text-primary-dark placeholder-primary-dark/40 outline-none transition-all"
                  id="name"
                  name="name"
                  placeholder="Digite seu nome"
                  type="text"
                />
              </div>

              {/* Whatsapp */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-primary-dark/80 uppercase tracking-widest" htmlFor="whatsapp">
                  Whatsapp
                </label>
                <input
                  className="w-full bg-[#F6F1E8] border border-transparent focus:border-primary/30 focus:bg-white px-4 py-3 rounded-sm text-primary-dark placeholder-primary-dark/40 outline-none transition-all"
                  id="whatsapp"
                  name="whatsapp"
                  placeholder="(00) 00000-0000"
                  type="tel"
                />
              </div>

              {/* Attendance Buttons */}
              <div className="flex flex-col gap-3">
                <label className="text-xs font-bold text-primary-dark/80 uppercase tracking-widest">
                  Você irá comparecer?
                </label>
                <div className="flex gap-4">
                  <label className="flex-1 cursor-pointer">
                    <input type="radio" name="attendance" value="yes" className="peer sr-only" />
                    <div className="w-full h-12 flex items-center justify-center bg-[#6a7a5b] text-white font-bold rounded-sm shadow-sm opacity-90 hover:opacity-100 peer-checked:ring-2 peer-checked:ring-offset-2 peer-checked:ring-[#6a7a5b] transition-all">
                      Sim, com certeza!
                    </div>
                  </label>
                  <label className="flex-1 cursor-pointer">
                    <input type="radio" name="attendance" value="no" className="peer sr-only" />
                    <div className="w-full h-12 flex items-center justify-center bg-[#F6F1E8] text-primary-dark/80 font-bold rounded-sm shadow-sm hover:bg-[#ebe5da] peer-checked:ring-2 peer-checked:ring-offset-2 peer-checked:ring-primary-dark/20 transition-all">
                      Infelizmente não
                    </div>
                  </label>
                </div>
              </div>

              {/* Total Guests */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-primary-dark/80 uppercase tracking-widest" htmlFor="guests">
                  Total de Convidados (Incluindo você)
                </label>
                <div className="relative">
                  <select
                    className="w-full bg-[#F6F1E8] border border-transparent focus:border-primary/30 focus:bg-white px-4 py-3 rounded-sm text-primary-dark outline-none appearance-none cursor-pointer transition-all"
                    id="guests"
                    name="guests"
                  >
                    <option>1 Pessoa</option>
                    <option>2 Pessoas</option>
                    <option>3 Pessoas</option>
                    <option>4 Pessoas</option>
                    <option>5 Pessoas</option>
                  </select>
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-primary-dark/50 material-symbols-outlined text-sm">expand_more</span>
                </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-col gap-6 py-2">
                <label className="flex items-center justify-between cursor-pointer group">
                  <span className="text-primary-dark/80 italic text-lg">Precisa de van do local do casamento?</span>
                  <div className="relative">
                    <input type="checkbox" className="peer sr-only" />
                    <div className="w-11 h-6 bg-[#ebe5da] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6a7a5b]"></div>
                  </div>
                </label>

                <label className="flex items-center justify-between cursor-pointer group">
                  <span className="text-primary-dark/80 italic text-lg">Pretende se hospedar no sítio?</span>
                  <div className="relative">
                    <input type="checkbox" className="peer sr-only" />
                    <div className="w-11 h-6 bg-[#ebe5da] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6a7a5b]"></div>
                  </div>
                </label>
              </div>

              {/* Children */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-primary-dark/80 uppercase tracking-widest" htmlFor="children">
                  Crianças (0-10 anos)
                </label>
                <input
                  className="w-full bg-[#F6F1E8] border border-transparent focus:border-primary/30 focus:bg-white px-4 py-3 rounded-sm text-primary-dark placeholder-primary-dark/40 outline-none transition-all"
                  id="children"
                  name="children"
                  placeholder="0"
                  type="number"
                  min="0"
                />
              </div>

              {/* Message */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-primary-dark/80 uppercase tracking-widest" htmlFor="message">
                  Mensagem aos Noivos (Opcional)
                </label>
                <textarea
                  className="w-full bg-[#F6F1E8] border border-transparent focus:border-primary/30 focus:bg-white px-4 py-3 rounded-sm text-primary-dark placeholder-primary-dark/40 outline-none transition-all min-h-[100px] resize-none"
                  id="message"
                  name="message"
                  placeholder="Deixe uma mensagem carinhosa ou informe restrições alimentares..."
                ></textarea>
              </div>

              <button className="mt-4 w-full h-14 bg-primary hover:bg-primary-dark text-white font-bold uppercase tracking-widest transition-colors rounded-sm shadow-md" type="submit">
                Enviar Confirmação
              </button>
            </form>
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
