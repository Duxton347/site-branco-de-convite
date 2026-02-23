/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';

export default function App() {
  const [isOpened, setIsOpened] = useState(false);
  const [showContent, setShowContent] = useState(false);

  const handleOpen = () => {
    setIsOpened(true);
    setTimeout(() => {
      setShowContent(true);
    }, 800);
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
        className={`fixed inset-0 z-50 flex items-center justify-center bg-background-light p-4 transition-all duration-1000 ease-in-out perspective-[1000px] ${isOpened ? 'opacity-0 pointer-events-none scale-110' : ''}`}
      >
        <div className="relative w-full max-w-2xl aspect-[4/3] bg-[#fdfbf7] shadow-2xl flex items-center justify-center rounded-sm border border-[#e6e0d4]">
          <div className="absolute inset-0 border-[20px] border-[#f4f0e6] opacity-50 pointer-events-none"></div>
          <div className="flex flex-col items-center gap-6 z-10 text-center">
            <h1 className="text-3xl md:text-5xl italic text-primary font-light tracking-wide">Julia & Jesse</h1>
            <p className="text-slate-500 uppercase tracking-widest text-xs md:text-sm">Toque no selo para abrir</p>
            <button 
              className="relative group cursor-pointer transition-transform duration-300 hover:scale-105" 
              onClick={handleOpen}
            >
              <div className="w-24 h-24 rounded-full bg-primary shadow-lg flex items-center justify-center border-4 border-[#7a896b] relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10 rounded-full"></div>
                <span className="material-symbols-outlined text-white text-5xl opacity-90 drop-shadow-md">favorite</span>
              </div>
              <div className="absolute -inset-2 rounded-full border border-primary/30 animate-ping"></div>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className={`w-full flex flex-col items-center transition-opacity duration-1000 ease-in-out ${showContent ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
        
        {/* Hero Section */}
        <section className="relative w-full min-h-[90vh] md:min-h-screen flex flex-col items-center justify-center">
          <div 
            className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat fixed"
            style={{
              backgroundImage: "linear-gradient(rgba(246, 241, 232, 0.5), rgba(246, 241, 232, 0.85)), url('https://irmaosdreon.com.br/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-23-at-09.25.42.jpeg')"
            }}
          >
          </div>
          <motion.div 
            className="relative z-10 flex flex-col items-center justify-center w-full max-w-4xl p-6 text-center"
            initial="hidden"
            animate={showContent ? "visible" : "hidden"}
            variants={fadeInUp}
          >
            <div className="bg-white/90 backdrop-blur-sm p-8 md:p-20 shadow-xl w-full border border-primary/20 torn-paper-bottom torn-paper-top">
              <span className="block text-primary text-base md:text-xl font-medium tracking-[0.2em] uppercase mb-4">O Casamento de</span>
              <h1 className="text-5xl md:text-8xl text-slate-800 italic mb-6 leading-tight">
                Julia <span className="text-primary text-4xl md:text-7xl">&</span> Jesse
              </h1>
              <div className="w-16 md:w-24 h-[1px] bg-primary/40 mx-auto my-6 md:my-8"></div>
              <p className="text-lg md:text-2xl text-slate-700 mb-2">26 de Maio de 2026</p>
              <p className="text-sm md:text-base text-slate-500 italic font-light mb-8 max-w-md mx-auto">
                "Um cordão de três dobras não se rompe com facilidade." <br/>— Eclesiastes 4:12
              </p>
              <a href="#rsvp" className="inline-flex items-center justify-center h-14 md:h-12 px-10 md:px-8 bg-primary hover:bg-primary-dark text-white text-xs md:text-sm font-bold uppercase tracking-widest transition-colors shadow-md rounded-sm">
                Confirmar Presença
              </a>
            </div>
          </motion.div>
        </section>

        {/* Welcome Section */}
        <section className="w-full bg-white relative py-24 px-6 md:px-20 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-8 bg-white torn-paper-bottom z-10 transform rotate-180"></div>
          <motion.div 
            className="max-w-4xl mx-auto text-center flex flex-col items-center gap-8 relative z-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <div className="bg-white/40 p-10 md:p-16 rounded-sm shadow-inner" style={{backgroundImage: "url('https://www.transparenttextures.com/patterns/cream-paper.png')"}}>
              <h2 className="text-4xl md:text-6xl text-primary mb-8 font-script">Você e Sua Família São Nossos Convidados Especiais</h2>
              <p className="text-lg md:text-xl text-slate-700 leading-relaxed max-w-2xl mx-auto font-display italic">
                Nosso casamento é um sonho que estamos realizando com muito amor, e ter vocês ao nosso lado nesse dia é parte essencial dessa alegria. Queremos celebrar cercados de pessoas que têm significado em nossa vida, e por isso a presença de vocês é tão importante para nós.
              </p>
              <div className="w-16 h-[1px] bg-primary/30 mx-auto mt-10"></div>
            </div>
          </motion.div>
        </section>

        {/* Details Section */}
        <section className="w-full bg-white relative py-20 px-6 md:px-20 overflow-hidden">
          <motion.div 
            className="max-w-6xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl italic text-slate-800 mb-4">Detalhes do Casamento</h2>
              <div className="w-16 h-1 bg-primary/30 mx-auto"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-start">
              <div className="flex flex-col gap-10">
                <div className="flex flex-col gap-4">
                  <h3 className="text-3xl text-slate-800 font-semibold italic">Sítio Essência</h3>
                  <p className="text-slate-600 text-lg leading-relaxed">Rua Abra de Dentro, 380 — Bairro Pegorelli — Caraguatatuba/SP</p>
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
                  style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA_zyblpLzro3IEemCTJyrf_BPleWvsTp4pWmh2IamvZIwWZd7CNH-VbWFxvj8qqT0fkhgXqijK0IBvrPDXQqtH1UG2DxCj3YvxrP8aVK8Re2mviMlXunOtZedVh5JLjdAIUVhRfD9HvYXy2j4tpMLQ_IAv-2aCh4Klm_FQ3EmrM3tYXuj6m2Lngiac556t7kd6ZGEYqHpoDe51D3zBnN8BvmmfaHmYrfSMMnyCugmzbbTPE3uLiIFsPcpdhlgvjnyLSRxf0MKEYkw')"}}
                >
                </div>
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-4 py-2 rounded-sm shadow text-xs font-bold text-slate-800">Sítio Essência, Caraguatatuba</div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Schedule Section */}
        <section className="w-full bg-white relative py-20 px-6 md:px-20 overflow-hidden">
          <motion.div 
            className="max-w-6xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
          >
            <motion.div className="text-center mb-16" variants={fadeInUp}>
              <h2 className="text-4xl md:text-5xl italic text-slate-800 mb-4">Programação</h2>
              <div className="w-16 h-1 bg-primary/30 mx-auto"></div>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Reception Card */}
              <motion.div variants={fadeInUp} className="bg-background-light p-8 rounded-sm shadow-sm border border-slate-200 flex flex-col items-center text-center transition-transform hover:-translate-y-1 duration-300" style={{backgroundImage: "url('https://www.transparenttextures.com/patterns/cream-paper.png')"}}>
                <div className="w-16 h-16 rounded-full bg-white shadow-inner flex items-center justify-center mb-6 border border-[#859778]/20">
                  <span className="material-symbols-outlined text-4xl text-primary">notifications</span>
                </div>
                <h3 className="text-2xl italic text-slate-800 mb-2">Recepção</h3>
                <p className="text-xl font-light tracking-widest text-[#666e48]">15:30</p>
                <div className="w-8 h-[1px] bg-[#859778]/30 mt-4"></div>
              </motion.div>
              {/* Ceremony Card */}
              <motion.div variants={fadeInUp} className="bg-background-light p-8 rounded-sm shadow-md border border-[#859778]/30 flex flex-col items-center text-center transition-transform hover:-translate-y-1 duration-300 relative" style={{backgroundImage: "url('https://www.transparenttextures.com/patterns/cream-paper.png')"}}>
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#859778] text-white text-[10px] uppercase tracking-[0.2em] px-3 py-1 rounded-full">O Momento</div>
                <div className="w-16 h-16 rounded-full bg-white shadow-inner flex items-center justify-center mb-6 border border-[#859778]/20">
                  <span className="material-symbols-outlined text-4xl text-primary">church</span>
                </div>
                <h3 className="text-2xl italic text-slate-800 mb-2">Cerimônia</h3>
                <p className="text-xl font-light tracking-widest text-[#666e48]">16:30</p>
                <div className="w-8 h-[1px] bg-[#859778]/30 mt-4"></div>
              </motion.div>
              {/* Party Card */}
              <motion.div variants={fadeInUp} className="bg-background-light p-8 rounded-sm shadow-sm border border-slate-200 flex flex-col items-center text-center transition-transform hover:-translate-y-1 duration-300" style={{backgroundImage: "url('https://www.transparenttextures.com/patterns/cream-paper.png')"}}>
                <div className="w-16 h-16 rounded-full bg-white shadow-inner flex items-center justify-center mb-6 border border-[#859778]/20">
                  <span className="material-symbols-outlined text-4xl text-primary">celebration</span>
                </div>
                <h3 className="text-2xl italic text-slate-800 mb-2">Festa</h3>
                <p className="text-xl font-light tracking-widest text-[#666e48]">17:30</p>
                <div className="w-8 h-[1px] bg-[#859778]/30 mt-4"></div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Transport & Accommodation */}
        <section className="w-full bg-background-light relative py-20 px-4 md:px-20 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-8 bg-background-light torn-paper-bottom z-10 transform rotate-180"></div>
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
                  <h2 className="text-3xl md:text-4xl text-slate-800 font-display">
                    Transporte & <br/> Hospedagem
                  </h2>
                </div>
                <span className="material-symbols-outlined text-slate-100 text-7xl select-none">directions_bus</span>
              </div>
              {/* Content Rows */}
              <div className="flex flex-col gap-10">
                {/* Suites Section */}
                <div className="flex gap-5">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#859778] text-2xl">bed</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-xl font-bold text-slate-800">Suítes no Local</h3>
                    <div className="text-slate-600 leading-relaxed flex flex-col gap-3">
                      <p>Para nossos queridos convidados que vêm de longe, queremos que se sintam em casa! Dispomos de suítes no próprio sítio para que possam descansar e aproveitar a festa até o último minuto conosco.</p>
                      <p>É nosso presente para vocês. Basta sinalizar o interesse na confirmação de presença abaixo.</p>
                    </div>
                    <div className="mt-1">
                      <span className="inline-block bg-[#e8f5e9] text-[#2e7d32] px-3 py-1 rounded-lg text-sm font-bold">
                        Vagas Limitadas
                      </span>
                    </div>
                  </div>
                </div>
                {/* Van Section */}
                <div className="flex gap-5">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#859778] text-2xl">directions_bus</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-xl font-bold text-slate-800">Van saindo de Maresias</h3>
                    <div className="text-slate-600 leading-relaxed flex flex-col gap-3">
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

        {/* Our Story */}
        <section className="w-full py-24 px-6 md:px-20 bg-white relative">
          <div className="absolute top-0 left-0 w-full h-8 bg-white torn-paper-bottom z-10 transform rotate-180"></div>
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
                  style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDoRlzgSUWXULuQk9B-XtZYgYKKnDpOWaBlqy4mxfMHm10RcQ4xDqccmE5pGV8qXrVKdcT1LfqBnLxqIUV4SmCombLRnrwdOQnpnkq9Wxd7LZdYYjJBvpd2hGmTj7kDJKF3BfDFFi7LZ9BOwrL9wpfRSiAdlwxic2Ks3BfT3X3o9Z3XxOOngU4DIYEacDsG6fzHeKAVEB-6K7icW2KFRBY8ZjqeIb9bNhR_CLSS4MPJNNeTZPY7Xfg_vz9QELLQabvBy5KeHI7lZt8')"}}
                ></div>
              </div>
              <div className="absolute bottom-0 right-4 w-60 h-72 bg-slate-200 shadow-xl transform rotate-3 border-4 border-white z-20">
                <div 
                  className="w-full h-full bg-cover bg-center" 
                  style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuClStczQchcP0E54MCbcN0-8boMZr35CggZkEcSZtS8Mqc3bfsFjgyNPLfMsZYU5cGNlimlrfCVrktQF6_q44ZjgGq5IcFyNfoqXfa-tyW6ch9ru76F0RHZtoYM_8VWig6J8FatqEpdnTFr8gcqxjEf5zW-Eb1D1Yds0XfcDryGWQPZEIa7nl40RkfGzBx2zozjeBx8jBnBQQKMxw3cIZPjUPubA9AcV_U0PIdZZd6rNTgu95RYN2yRgbttBhebd9jbLkZz6j9sV_8')"}}
                ></div>
              </div>
              <div className="absolute -top-10 -left-10 text-primary/20 transform rotate-12 z-0">
                <span className="material-symbols-outlined text-9xl">local_florist</span>
              </div>
            </div>
            <div className="w-full md:w-1/2 flex flex-col justify-center">
              <h2 className="text-4xl md:text-5xl italic text-slate-800 mb-6">Nossa História</h2>
              <div className="prose prose-lg text-slate-600 font-display">
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
              <img className="w-full h-full object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCxRhfyxH6ldJVHkWFe1rLlPOZK7eACjRgza80X-rQ3fQg0MAl6FqwnR49UlnBLPLNQY5b_MhDfGN3svMgMHtfevgQg6500vR4jZCrNezOI_8c4KkZME3bTN0ezOwZ3lSmCdh6Rcjem9acp_J5yMv8gM795za38M2CoeKCjOFvFOvAZac8-8ecDVBP9__ZatB98waSqwXX2yOnzDqPcgcYy6B9jXnf_fv-H6JHyz-ZLop3lYg0xoiv_wNnoVFYiynusnzpFUwMURGw" alt="Floral decoration"/>
            </div>
            <div className="absolute -bottom-10 -right-10 w-48 h-48 opacity-20 pointer-events-none mix-blend-multiply -rotate-12">
              <img className="w-full h-full object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCxRhfyxH6ldJVHkWFe1rLlPOZK7eACjRgza80X-rQ3fQg0MAl6FqwnR49UlnBLPLNQY5b_MhDfGN3svMgMHtfevgQg6500vR4jZCrNezOI_8c4KkZME3bTN0ezOwZ3lSmCdh6Rcjem9acp_J5yMv8gM795za38M2CoeKCjOFvFOvAZac8-8ecDVBP9__ZatB98waSqwXX2yOnzDqPcgcYy6B9jXnf_fv-H6JHyz-ZLop3lYg0xoiv_wNnoVFYiynusnzpFUwMURGw" alt="Floral decoration"/>
            </div>
            <span className="material-symbols-outlined text-[#859778] text-5xl mb-6">checkroom</span>
            <h3 className="text-4xl md:text-5xl italic text-slate-800 mb-8">Traje</h3>
            <div className="bg-white/40 p-8 md:p-12 rounded-sm border border-[#859778]/10 backdrop-blur-sm">
              <p className="text-xl md:text-2xl text-slate-700 leading-relaxed font-display mb-6">
                Queremos que vocês aproveitem esse dia com conforto e elegância, então fiquem à vontade para escolher a cor do traje. Avisamos apenas, com carinho, que não usem a cor branca, pois ela será reservada à noiva. 🤍
              </p>
              <p className="text-lg md:text-xl text-[#666e48] leading-relaxed font-display italic">
                Ah! E uma dica: como a cerimônia será no gramado, salto grosso ou bloco pode ser uma ótima escolha.
              </p>
            </div>
          </motion.div>
        </section>

        {/* RSVP Section */}
        <section className="w-full py-24 px-4 bg-background-light relative" id="rsvp">
          <div className="absolute top-0 left-0 w-full h-8 bg-background-light torn-paper-bottom z-10 transform rotate-180"></div>
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC5t7oEpGV1tKMe_LOkAOZdirWx3yojmBvX9m2C1SrRYi73np9F3BExxLG4Hs2U7e1cwynZXaTn9ELZ5ZqkkWvTvMNAkLBcJZApxxX3HbrBlZY_9c60XKaXF47uGXMNasEs37MZ9TnbHhG5TJWoNjevUBI6c5Wlc3wrwa9UnbgArk2nZe2d2avR-qRuLbacHyofld16jxXe-QSjgHx6opwF6m68TrZncRQC-h7Jr6783tDbTPp5tJWPITdfSE_870jxKcW42JJ6q4M')"}}></div>
          <motion.div 
            className="max-w-xl mx-auto bg-white p-8 md:p-12 shadow-2xl relative torn-paper-top torn-paper-bottom"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <div className="text-center mb-10">
              <h2 className="text-4xl md:text-5xl italic text-slate-800 mb-4 font-script">Confirme sua Presença</h2>
              <p className="text-slate-500 text-sm italic">Por favor, responda até 20 de Março</p>
            </div>
            <form className="flex flex-col gap-8" onSubmit={(e) => e.preventDefault()}>
              
              {/* Nome Completo */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-widest" htmlFor="name">
                  Nome Completo
                </label>
                <input 
                  className="w-full bg-[#F6F1E8] border border-transparent focus:border-primary/30 focus:bg-white px-4 py-3 rounded-sm text-slate-800 placeholder-slate-400 outline-none transition-all" 
                  id="name" 
                  name="name" 
                  placeholder="Digite seu nome" 
                  type="text" 
                />
              </div>

              {/* Whatsapp */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-widest" htmlFor="whatsapp">
                  Whatsapp
                </label>
                <input 
                  className="w-full bg-[#F6F1E8] border border-transparent focus:border-primary/30 focus:bg-white px-4 py-3 rounded-sm text-slate-800 placeholder-slate-400 outline-none transition-all" 
                  id="whatsapp" 
                  name="whatsapp" 
                  placeholder="(00) 00000-0000" 
                  type="tel" 
                />
              </div>

              {/* Attendance Buttons */}
              <div className="flex flex-col gap-3">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-widest">
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
                    <div className="w-full h-12 flex items-center justify-center bg-[#F6F1E8] text-slate-600 font-bold rounded-sm shadow-sm hover:bg-[#ebe5da] peer-checked:ring-2 peer-checked:ring-offset-2 peer-checked:ring-slate-300 transition-all">
                      Infelizmente não
                    </div>
                  </label>
                </div>
              </div>

              {/* Total Guests */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-widest" htmlFor="guests">
                  Total de Convidados (Incluindo você)
                </label>
                <div className="relative">
                  <select 
                    className="w-full bg-[#F6F1E8] border border-transparent focus:border-primary/30 focus:bg-white px-4 py-3 rounded-sm text-slate-800 outline-none appearance-none cursor-pointer transition-all"
                    id="guests"
                    name="guests"
                  >
                    <option>1 Pessoa</option>
                    <option>2 Pessoas</option>
                    <option>3 Pessoas</option>
                    <option>4 Pessoas</option>
                    <option>5 Pessoas</option>
                  </select>
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 material-symbols-outlined text-sm">expand_more</span>
                </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-col gap-6 py-2">
                <label className="flex items-center justify-between cursor-pointer group">
                  <span className="text-slate-600 italic text-lg">Precisa de van do local do casamento?</span>
                  <div className="relative">
                    <input type="checkbox" className="peer sr-only" />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6a7a5b]"></div>
                  </div>
                </label>
                
                <label className="flex items-center justify-between cursor-pointer group">
                  <span className="text-slate-600 italic text-lg">Pretende se hospedar no sítio?</span>
                  <div className="relative">
                    <input type="checkbox" className="peer sr-only" />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6a7a5b]"></div>
                  </div>
                </label>
              </div>

              {/* Children */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-widest" htmlFor="children">
                  Crianças (0-10 anos)
                </label>
                <input 
                  className="w-full bg-[#F6F1E8] border border-transparent focus:border-primary/30 focus:bg-white px-4 py-3 rounded-sm text-slate-800 placeholder-slate-400 outline-none transition-all" 
                  id="children" 
                  name="children" 
                  placeholder="0" 
                  type="number" 
                  min="0"
                />
              </div>

              {/* Message */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-widest" htmlFor="message">
                  Mensagem aos Noivos (Opcional)
                </label>
                <textarea 
                  className="w-full bg-[#F6F1E8] border border-transparent focus:border-primary/30 focus:bg-white px-4 py-3 rounded-sm text-slate-800 placeholder-slate-400 outline-none transition-all min-h-[100px] resize-none" 
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
        <footer className="w-full bg-white py-12 flex flex-col items-center justify-center border-t border-slate-100">
          <h2 className="text-3xl italic text-slate-800 mb-2">Julia & Jesse</h2>
          <p className="text-slate-400 text-sm mb-6">Nos vemos no altar.</p>
          <div className="flex gap-4">
            <a href="#" className="text-slate-400 hover:text-primary transition-colors">
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
