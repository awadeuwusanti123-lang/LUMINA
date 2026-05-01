import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Menu, X, ShieldCheck, Award, Users, Cross, 
  XCircle, CheckCircle2, Leaf, Microscope, Diamond, HeartHandshake,
  Stethoscope, Sparkles, LayoutGrid, Smile, Star, ChevronDown, Clock, MapPin, Phone
} from 'lucide-react';

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  
  // Booking Form State
  const [bookingData, setBookingData] = useState({ name: '', service: '', date: '', time: '' });
  const [showSummary, setShowSummary] = useState(false);
  const [formError, setFormError] = useState('');
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  const [isFormPulsing, setIsFormPulsing] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleScrollToForm = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsMenuOpen(false);
    const formEl = document.getElementById('agendar');
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth' });
      setIsFormPulsing(true);
      setTimeout(() => setIsFormPulsing(false), 1500);
    }
  };

  const validateField = (field: string, value: string) => {
    if (!value.trim()) return 'Este campo es obligatorio';
    if (field === 'name' && value.trim().length < 3) return 'Debe tener al menos 3 caracteres';
    return '';
  };

  const getFieldError = (field: string) => {
    if (!touchedFields[field]) return '';
    return validateField(field, bookingData[field as keyof typeof bookingData]);
  };

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, { threshold: 0.5 });

    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const services = [
    "Limpieza dental",
    "Blanqueamiento",
    "Ortodoncia",
    "Estética dental"
  ];

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTouched = { name: true, service: true, date: true, time: true };
    setTouchedFields(newTouched);

    if (
      validateField('name', bookingData.name) ||
      validateField('service', bookingData.service) ||
      validateField('date', bookingData.date) ||
      validateField('time', bookingData.time)
    ) {
      setFormError('Por favor revisa los campos requeridos antes de continuar.');
      return;
    }

    setFormError('');
    setShowSummary(true);
  };

  const handleWhatsAppRedirect = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setIsRedirecting(true);

    setTimeout(() => {
      const text = `Hola, quiero agendar una cita en Lumina Dental Studio:

*Servicio:* ${bookingData.service || '[servicio seleccionado]'}
*Fecha:* ${bookingData.date || '[fecha seleccionada]'}
*Hora:* ${bookingData.time || '[hora seleccionada]'}
*Nombre:* ${bookingData.name || '[nombre del cliente]'}

¿Tienen disponibilidad en ese horario?`;
      window.open(`https://wa.me/573165362934?text=${encodeURIComponent(text)}`, '_blank');
      
      setTimeout(() => {
        setIsRedirecting(false);
        setBookingData({ name: '', service: '', date: '', time: '' });
        setShowSummary(false);
        setTouchedFields({});
      }, 1000);
    }, 1500);
  };

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  return (
    <div className="min-h-screen bg-[#F7FAFC] font-sans text-[#1A365D] selection:bg-[#4FD1C5]/30">
      
      {/* 1. Header */}
      <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-xl border-b border-[#1A365D]/5 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-28 flex items-center justify-between">
          <a href="#" className="flex items-center py-4 group -ml-2 md:-ml-4">
            <img 
              src="https://lh3.googleusercontent.com/d/1zj-n2QbUY4_tAZiZfE1knOekZrKlYeC8" 
              alt="Lumina Dental Studio Logo" 
              className="h-14 md:h-16 w-auto object-contain drop-shadow-md transition-transform duration-300 transform group-hover:scale-105" 
            />
            <div className="flex flex-col justify-center -ml-4 md:-ml-5">
              <span className="text-2xl md:text-3xl font-bold tracking-tight text-[#1A365D] uppercase leading-none mb-0.5">LUMINA</span>
              <span className="text-[10px] md:text-[11px] font-bold tracking-[0.35em] text-[#1A365D]/50 uppercase leading-none">DENTAL STUDIO</span>
            </div>
          </a>
          
          <nav className="hidden md:flex gap-10 items-center text-sm font-semibold text-[#1A365D]/60 ml-auto mr-10">
            <a href="#servicios" className="hover:text-[#1A365D] transition-colors">Servicios</a>
            <a href="#resultados" className="hover:text-[#1A365D] transition-colors">Resultados</a>
            <a href="#faq" className="hover:text-[#1A365D] transition-colors">FAQ</a>
            <a href="#contacto" className="hover:text-[#1A365D] transition-colors">Contacto</a>
          </nav>

          <div className="hidden md:block">
            <a href="#agendar" onClick={handleScrollToForm} className="bg-[#1A365D] text-white px-8 py-3 rounded-full hover:bg-[#2c4d7e] transition-all font-semibold text-sm shadow-lg shadow-[#1A365D]/20 hover:shadow-[#1A365D]/30 hover:-translate-y-0.5 inline-block">
              Mi Reserva
            </a>
          </div>

          <button className="md:hidden text-[#1A365D] p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-white/95 backdrop-blur-md pt-24 px-6 md:hidden flex flex-col"
          >
            <motion.nav 
              initial="closed"
              animate="open"
              exit="closed"
              variants={{
                open: { transition: { staggerChildren: 0.1 } },
                closed: { transition: { staggerChildren: 0.05, staggerDirection: -1 } }
              }}
              className="flex flex-col gap-6 text-2xl font-bold text-[#1A365D]"
            >
              {[
                { id: "servicios", label: "Servicios" },
                { id: "resultados", label: "Resultados" },
                { id: "faq", label: "FAQ" },
                { id: "contacto", label: "Contacto" }
              ].map((link) => (
                <motion.a 
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={() => setIsMenuOpen(false)}
                  variants={{
                    open: { opacity: 1, x: 0 },
                    closed: { opacity: 0, x: -20 }
                  }}
                  className={`flex items-center gap-4 transition-colors ${activeSection === link.id ? 'text-[#4FD1C5]' : ''}`}
                >
                  {link.label}
                  {activeSection === link.id && (
                    <motion.div layoutId="mobile-indicator" className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                  )}
                </motion.a>
              ))}
              <motion.a 
                href="#agendar"
                onClick={handleScrollToForm} 
                variants={{
                  open: { opacity: 1, y: 0 },
                  closed: { opacity: 0, y: 20 }
                }}
                className="px-6 py-4 bg-[#1A365D] text-white rounded-2xl text-center mt-8 text-xl shadow-lg shadow-[#1A365D]/20 active:scale-95 transition-transform w-full"
              >
                Mi Reserva
              </motion.a>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="pt-20">
        
        {/* 2. Hero */}
        <section className="max-w-7xl mx-auto px-6 py-16 md:py-32 grid md:grid-cols-2 gap-16 items-center">
          <motion.div {...fadeIn}>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37] mb-4 block">Excelencia Odontológica Premium</span>
            <h1 className="text-6xl md:text-7xl font-bold leading-[1.1] tracking-tighter mb-6 text-[#1A365D]">
              La estética dental <br/>elevada a <span className="text-[#4FD1C5] font-serif italic">el arte.</span>
            </h1>
            <p className="text-lg text-[#1A365D]/70 mb-10 max-w-lg leading-relaxed">
              Experimente un nuevo estándar en cuidado dental. Tecnología de vanguardia y confort absoluto para su transformación.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#agendar" onClick={handleScrollToForm} className="bg-[#1A365D] text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-[#1A365D]/90 active:scale-95 transition-all shadow-lg shadow-[#1A365D]/20">
                Reserva de Consulta
              </a>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-[#D4AF37]/20 rounded-[2rem] transform rotate-2"></div>
            <img 
              src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=1200" 
              alt="Lumina Dental Studio Interior" 
              className="relative w-full aspect-[4/3] object-cover shadow-xl rounded-[2rem]"
            />
          </motion.div>
        </section>

        {/* 3. Trust Elements */}
        <section className="bg-white py-12 border-y border-[#1A365D]/10">
          <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-80 text-[#1A365D]">
            <div className="flex items-center gap-3"><ShieldCheck className="w-6 h-6 text-[#4FD1C5]"/> <span className="font-semibold text-sm tracking-wide">CERTIFICACIÓN ISO 9001</span></div>
            <div className="flex items-center gap-3"><Award className="w-6 h-6 text-[#4FD1C5]"/> <span className="font-semibold text-sm tracking-wide">ESTÉTICA PREMIUM</span></div>
            <div className="flex items-center gap-3"><Cross className="w-6 h-6 text-[#4FD1C5]"/> <span className="font-semibold text-sm tracking-wide">MIEMBRO ADA</span></div>
            <div className="flex items-center gap-3"><Users className="w-6 h-6 text-[#4FD1C5]"/> <span className="font-semibold text-sm tracking-wide">+5000 CASOS DE ÉXITO</span></div>
          </div>
        </section>

        {/* 4. Pain Points / Solutions */}
        <section className="py-24 md:py-32 bg-white">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16">
            <motion.div {...fadeIn} className="space-y-10">
              <h2 className="text-4xl md:text-5xl font-bold text-[#1A365D] leading-tight tracking-tighter">
                ¿Sientes ansiedad al visitar al dentista?
              </h2>
              <div className="space-y-8">
                <div className="flex gap-4 items-start">
                  <XCircle className="w-6 h-6 text-[#D4AF37] flex-shrink-0 mt-1" strokeWidth={2}/>
                  <div>
                    <h4 className="font-semibold text-lg text-[#1A365D] mb-1">Miedo al dolor</h4>
                    <p className="text-[#1A365D]/70">Muchos pacientes evitan el dentista por experiencias traumáticas pasadas.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <XCircle className="w-6 h-6 text-[#D4AF37] flex-shrink-0 mt-1" strokeWidth={2}/>
                  <div>
                    <h4 className="font-semibold text-lg text-[#1A365D] mb-1">Ambientes fríos y estresantes</h4>
                    <p className="text-[#1A365D]/70">El olor a hospital y el ruido de las máquinas aumentan los niveles de cortisol.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <XCircle className="w-6 h-6 text-[#D4AF37] flex-shrink-0 mt-1" strokeWidth={2}/>
                  <div>
                    <h4 className="font-semibold text-lg text-[#1A365D] mb-1">Resultados poco naturales</h4>
                    <p className="text-[#1A365D]/70">La preocupación de quedar con una sonrisa "artificial" o incómoda.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-[#1A365D] text-white p-10 md:p-14 rounded-[2rem] flex flex-col justify-center border border-[#1A365D] relative z-10 shadow-2xl"
            >
              <h2 className="text-3xl font-bold mb-10 tracking-tight">Nuestra Solución:<br/><span className="text-[#4FD1C5] font-serif italic">Senses Experience</span></h2>
              <div className="space-y-8">
                <div className="flex gap-4 items-start">
                  <CheckCircle2 className="w-6 h-6 text-[#4FD1C5] flex-shrink-0 mt-1" strokeWidth={2}/>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Cuidado sin dolor</h4>
                    <p className="text-[#F7FAFC]/80">Tecnología ultrasónica y sedación consciente opcional.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <CheckCircle2 className="w-6 h-6 text-[#4FD1C5] flex-shrink-0 mt-1" strokeWidth={2}/>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Atmósfera de Spa</h4>
                    <p className="text-[#F7FAFC]/80">Aromaterapia, música relajante y diseño minimalista.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <CheckCircle2 className="w-6 h-6 text-[#4FD1C5] flex-shrink-0 mt-1" strokeWidth={2}/>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Estética de Vanguardia</h4>
                    <p className="text-[#F7FAFC]/80">Diseño digital de sonrisa para resultados 100% personalizados.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 5. Why Choose Us */}
        <section className="py-24 md:py-32 max-w-7xl mx-auto px-6 text-center">
          <motion.h2 {...fadeIn} className="text-4xl text-[#1A365D] mb-16 font-bold tracking-tight">
            ¿Por qué elegir Lumina?
          </motion.h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Leaf, title: "Paz Mental", desc: "Diseñamos tu visita para que sea el momento más relajante de tu día." },
              { icon: Microscope, title: "Precisión Digital", desc: "Uso de escaneo 3D para diagnósticos sin moldes incómodos." },
              { icon: Diamond, title: "Calidad Premium", desc: "Materiales de grado médico de la más alta calidad internacional." },
              { icon: HeartHandshake, title: "Atención Humana", desc: "Especialistas que escuchan tus metas y resuelven tus dudas." }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-3xl bg-white shadow-sm border border-[#1A365D]/10"
              >
                <item.icon className="w-10 h-10 text-[#4FD1C5] mx-auto mb-6" strokeWidth={1.5}/>
                <h4 className="font-semibold text-[#1A365D] text-lg mb-3">{item.title}</h4>
                <p className="text-sm text-[#1A365D]/70 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 6. Showcase Results */}
        <section id="resultados" className="py-24 md:py-32 bg-white border-y border-[#1A365D]/10">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div {...fadeIn} className="text-center mb-16">
              <h2 className="text-4xl text-[#1A365D] mb-4 font-bold tracking-tight">Resultados que transforman</h2>
              <p className="text-[#1A365D]/60 text-lg max-w-2xl mx-auto font-serif italic">Casos reales de pacientes que recuperaron la confianza en su sonrisa.</p>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: "Diseño de Sonrisa", img: "https://images.pexels.com/photos/3762453/pexels-photo-3762453.jpeg" },
                { title: "Blanqueamiento Clínico", img: "https://images.pexels.com/photos/6627562/pexels-photo-6627562.jpeg" },
                { title: "Ortodoncia Invisible", img: "https://images.pexels.com/photos/11887613/pexels-photo-11887613.jpeg" }
              ].map((res, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-[#F7FAFC] p-4 rounded-3xl border border-[#1A365D]/10 group shadow-sm"
                >
                  <div className="relative overflow-hidden rounded-2xl aspect-[4/5] bg-gray-200 mb-4 mix-blend-multiply">
                    <img src={res.img} alt={res.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <h4 className="font-semibold text-center text-[#1A365D] pb-2">{res.title}</h4>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. Services */}
        <section id="servicios" className="py-24 md:py-32 bg-[#F7FAFC]">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div {...fadeIn} className="text-center mb-16">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37] mb-4 block">Especialidades</span>
              <h2 className="text-4xl text-[#1A365D] font-bold tracking-tight">Nuestros Servicios</h2>
            </motion.div>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { icon: Stethoscope, title: "Limpieza dental", desc: "Prevención integral con tecnología ultrasónica para una salud bucal impecable." },
                { icon: Sparkles, title: "Blanqueamiento", desc: "Recupera la luminosidad natural de tus dientes con tratamientos no invasivos." },
                { icon: LayoutGrid, title: "Ortodoncia", desc: "Alineación perfecta con sistemas invisibles y tradicionales de alta gama." },
                { icon: Smile, title: "Estética dental", desc: "Diseño de sonrisa personalizado mediante carillas y restauraciones premium." }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white p-8 rounded-3xl border border-[#1A365D]/10 shadow-sm hover:border-[#1A365D]/30 hover:shadow-md transition-all"
                >
                  <item.icon className="text-[#4FD1C5] w-8 h-8 mb-6" strokeWidth={1.5}/>
                  <h3 className="font-semibold text-lg text-[#1A365D] mb-3">{item.title}</h3>
                  <p className="text-[#1A365D]/70 text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 8. Offer */}
        <section className="py-24 bg-white border-b border-[#1A365D]/10">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div 
              {...fadeIn}
              className="bg-[#1A365D] rounded-3xl p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#4FD1C5]/20 rounded-full blur-3xl mix-blend-screen"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#D4AF37]/20 rounded-full blur-3xl mix-blend-screen"></div>
              
              <div className="max-w-xl text-center md:text-left relative z-10">
                <span className="inline-block border border-[#D4AF37] text-[#D4AF37] px-4 py-1 rounded-full text-[10px] font-bold mb-6 uppercase tracking-widest">Oferta de Apertura</span>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tighter text-white">Pack Bienvenida Lumina</h2>
                <p className="text-[#F7FAFC]/80 text-lg">Obtén un 20% de descuento en tu primer Limpieza Dental Pro + Diagnóstico Digital 3D.</p>
              </div>
              <div className="text-center bg-[#F7FAFC] p-8 rounded-3xl min-w-[280px] border border-[#1A365D]/10 relative z-10">
                <p className="text-5xl font-bold mb-2 text-[#1A365D]">$1,200 <span className="text-xl font-normal text-[#1A365D]/60">MXN</span></p>
                <p className="text-sm text-[#1A365D]/50 line-through mb-8">Precio regular: $1,500 MXN</p>
                <a href="#agendar" onClick={handleScrollToForm} className="bg-[#1A365D] text-white px-8 py-4 rounded-xl font-semibold text-lg block hover:bg-[#2c4d7e] transition-colors w-full shadow-lg shadow-[#1A365D]/20 text-center">
                  Reclamar Oferta
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 9. Reviews */}
        <section className="py-24 md:py-32 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <motion.h2 {...fadeIn} className="text-3xl md:text-4xl text-[#1A365D] font-bold tracking-tight mb-16 text-center">
              Reconocimiento de <span className="font-serif italic text-[#4FD1C5]">nuestros pacientes</span>
            </motion.h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { name: "Mariana Castillo", type: "Paciente de Estética", text: "Nunca imaginé que ir al dentista fuera tan relajante. El ambiente es increíble y los resultados superaron mis expectativas." },
                { name: "Ricardo Gómez", type: "Paciente de Ortodoncia", text: "La tecnología que usan es impresionante. No sentí nada de dolor durante mi ortodoncia. Totalmente recomendados." },
                { name: "Elena Vargas", type: "Paciente General", text: "El trato personalizado es lo que los hace diferentes. Realmente se preocupan por cómo te sientes en cada paso." }
              ].map((rev, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-[#F7FAFC] p-10 rounded-3xl border border-[#1A365D]/10"
                >
                  <div className="flex gap-1 text-[#D4AF37] mb-6">
                    {[...Array(5)].map((_, j) => <Star fill="currentColor" className="w-4 h-4" key={j}/>)}
                  </div>
                  <p className="text-[#1A365D]/80 font-serif italic mb-8 leading-relaxed">"{rev.text}"</p>
                  <div>
                    <div className="font-semibold text-sm text-[#1A365D] uppercase tracking-wide">{rev.name}</div>
                    <div className="text-[10px] text-[#4FD1C5] uppercase tracking-widest mt-1 font-bold">{rev.type}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 10. Booking Form / Contact */}
        <section id="agendar" className="py-24 md:py-32 bg-white border-t border-[#1A365D]/10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row gap-16">
              
              {/* Left Info */}
              <div className="md:w-1/2 flex flex-col justify-center">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37] mb-4 block">Experiencia Lumina</span>
                <h2 className="text-5xl md:text-6xl font-bold mb-6 tracking-tighter text-[#1A365D] leading-none">Reserva tu <br/><span className="text-[#4FD1C5] font-serif italic">espacio de calma</span></h2>
                <p className="text-[#1A365D]/70 text-lg mb-12 max-w-sm">Selecciona tu tratamiento y el horario que mejor se adapte a tu ritmo de vida.</p>
                
                <div className="space-y-6 text-sm text-[#1A365D]/80">
                  <div className="flex items-center gap-4">
                    <Clock className="w-5 h-5 text-[#4FD1C5]"/>
                    <span className="font-medium">Lunes a Viernes: 9:00 - 19:00</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <MapPin className="w-5 h-5 text-[#4FD1C5]"/>
                    <span className="font-medium">Av. Lomas de la Paz 450, Suite 102</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Phone className="w-5 h-5 text-[#4FD1C5]"/>
                    <span className="font-medium">+52 123 456 7890</span>
                  </div>
                </div>
              </div>

              {/* Right Form */}
              <div className="md:w-1/2">
                <div className={`bg-[#F7FAFC] p-8 md:p-10 rounded-3xl border border-[#1A365D]/10 transition-all duration-700 ${isFormPulsing ? 'shadow-[0_0_30px_rgba(79,209,197,0.5)] scale-[1.02] border-[#4FD1C5]' : 'shadow-lg shadow-[#1A365D]/5'}`}>
                  {!showSummary ? (
                    <form onSubmit={handleBookingSubmit} className="space-y-6">
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-[#1A365D]/60 block mb-2">Nombre Completo</label>
                        <input 
                          type="text" 
                          value={bookingData.name}
                          onChange={(e) => {
                            setBookingData({...bookingData, name: e.target.value});
                            if (touchedFields.name) setTouchedFields(prev => ({...prev, name: true}));
                          }}
                          onBlur={() => setTouchedFields(prev => ({...prev, name: true}))}
                          className={`w-full bg-white border ${getFieldError('name') ? 'border-[#ea4335] focus:border-[#ea4335] focus:ring-[#ea4335]' : 'border-[#1A365D]/10 focus:border-[#4FD1C5] focus:ring-[#4FD1C5]'} rounded-xl px-4 py-3 text-sm focus:ring-2 outline-none placeholder:text-gray-300 text-[#1A365D] transition-all`}
                          placeholder="Ej. Ana García"
                        />
                        {getFieldError('name') && <p className="text-[10px] text-[#ea4335] mt-1 font-semibold">{getFieldError('name')}</p>}
                      </div>

                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-[#1A365D]/60 block mb-2">Servicio de interés</label>
                        <div className="relative">
                          <select 
                            value={bookingData.service}
                            onChange={(e) => {
                              setBookingData({...bookingData, service: e.target.value});
                              if (touchedFields.service) setTouchedFields(prev => ({...prev, service: true}));
                            }}
                            onBlur={() => setTouchedFields(prev => ({...prev, service: true}))}
                            className={`w-full bg-white border ${getFieldError('service') ? 'border-[#ea4335] focus:border-[#ea4335] focus:ring-[#ea4335]' : 'border-[#1A365D]/10 focus:border-[#4FD1C5] focus:ring-[#4FD1C5]'} rounded-xl px-4 py-3 text-sm appearance-none cursor-pointer focus:ring-2 outline-none text-[#1A365D] transition-all`}
                          >
                            <option value="" disabled>Seleccionar tratamiento</option>
                            {services.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A365D]/40 pointer-events-none"/>
                        </div>
                        {getFieldError('service') && <p className="text-[10px] text-[#ea4335] mt-1 font-semibold">{getFieldError('service')}</p>}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-bold uppercase tracking-wider text-[#1A365D]/60 block mb-2">Fecha</label>
                          <input 
                            type="date"
                            value={bookingData.date}
                            onChange={(e) => {
                              setBookingData({...bookingData, date: e.target.value});
                              if (touchedFields.date) setTouchedFields(prev => ({...prev, date: true}));
                            }}
                            onBlur={() => setTouchedFields(prev => ({...prev, date: true}))}
                            className={`w-full bg-white border ${getFieldError('date') ? 'border-[#ea4335] focus:border-[#ea4335] focus:ring-[#ea4335]' : 'border-[#1A365D]/10 focus:border-[#4FD1C5] focus:ring-[#4FD1C5]'} rounded-xl px-4 py-3 text-sm focus:ring-2 outline-none text-[#1A365D] transition-all`}
                          />
                          {getFieldError('date') && <p className="text-[10px] text-[#ea4335] mt-1 font-semibold">{getFieldError('date')}</p>}
                        </div>
                        <div>
                          <label className="text-[10px] font-bold uppercase tracking-wider text-[#1A365D]/60 block mb-2">Hora</label>
                          <div className="relative">
                            <select 
                              value={bookingData.time}
                              onChange={(e) => {
                                setBookingData({...bookingData, time: e.target.value});
                                if (touchedFields.time) setTouchedFields(prev => ({...prev, time: true}));
                              }}
                              onBlur={() => setTouchedFields(prev => ({...prev, time: true}))}
                              className={`w-full bg-white border ${getFieldError('time') ? 'border-[#ea4335] focus:border-[#ea4335] focus:ring-[#ea4335]' : 'border-[#1A365D]/10 focus:border-[#4FD1C5] focus:ring-[#4FD1C5]'} rounded-xl px-4 py-3 text-sm appearance-none cursor-pointer focus:ring-2 outline-none text-[#1A365D] transition-all`}
                            >
                               <option value="" disabled>Elegir</option>
                              <option value="09:00 AM">09:00 AM</option>
                              <option value="11:00 AM">11:00 AM</option>
                              <option value="01:00 PM">01:00 PM</option>
                              <option value="04:00 PM">04:00 PM</option>
                              <option value="06:00 PM">06:00 PM</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A365D]/40 pointer-events-none"/>
                          </div>
                          {getFieldError('time') && <p className="text-[10px] text-[#ea4335] mt-1 font-semibold">{getFieldError('time')}</p>}
                        </div>
                      </div>

                      {formError && <p className="text-[11px] text-[#ea4335] font-semibold">{formError}</p>}

                      <button 
                        type="submit" 
                        className="w-full bg-[#1A365D] text-white hover:bg-[#2c4d7e] shadow-lg shadow-[#1A365D]/20 py-4 rounded-xl font-semibold text-sm transition-all transform active:scale-[0.98] mt-2"
                      >
                        Revisar Reserva
                      </button>
                    </form>
                  ) : isRedirecting ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col h-full items-center justify-center text-center space-y-4 py-12"
                    >
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        className="w-20 h-20 bg-[#25D366]/10 rounded-full flex items-center justify-center mb-4"
                      >
                        <CheckCircle2 className="w-10 h-10 text-[#25D366]" />
                      </motion.div>
                      <h3 className="text-2xl font-bold text-[#1A365D]">¡Iniciando reserva!</h3>
                      <p className="text-[#1A365D]/70 text-sm max-w-[250px]">
                        Abriendo WhatsApp con los detalles de tu cita para que podamos confirmar...
                      </p>
                      <div className="w-6 h-6 border-2 border-[#25D366]/20 border-t-[#25D366] rounded-full animate-spin mt-4"></div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col h-full justify-between"
                    >
                      <div>
                        {/* Mini Invoice Summary */}
                        <div className="bg-white/50 rounded-2xl p-6 mb-6 border border-dashed border-[#1A365D]/20">
                          <div className="flex justify-between items-center text-xs mb-4">
                            <span className="text-[#1A365D]/60 font-medium">Resumen de Consulta</span>
                            <span className="font-bold text-[#1A365D]">ID #LDS-{Math.floor(Math.random() * 899) + 100}</span>
                          </div>
                          <div className="space-y-2 mb-4 border-b border-[#1A365D]/10 pb-4">
                            <div className="flex justify-between text-sm">
                              <span className="text-[#1A365D]/60">Paciente</span>
                              <span className="font-semibold text-[#1A365D]">{bookingData.name}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-[#1A365D]/60">Fecha</span>
                              <span className="font-semibold text-[#1A365D]">{bookingData.date}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-[#1A365D]/60">Hora</span>
                              <span className="font-semibold text-[#1A365D]">{bookingData.time}</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-end">
                            <div>
                              <p className="text-sm font-semibold text-[#1A365D]">{bookingData.service}</p>
                              <p className="text-[10px] text-[#1A365D]/50 italic">Duración estimada: 45 min</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <button 
                          onClick={handleWhatsAppRedirect}
                          className="w-full bg-[#25D366] hover:bg-[#20bd5c] shadow-lg shadow-[#25D366]/20 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all transform active:scale-[0.98]"
                        >
                          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.659 1.437 5.634 1.437h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                          </svg>
                          Confirmar vía WhatsApp
                        </button>
                        <button 
                          onClick={() => setShowSummary(false)}
                          className="w-full py-4 text-xs font-bold uppercase tracking-widest text-[#1A365D]/50 hover:text-[#1A365D] transition-colors"
                        >
                          Modificar Datos
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 11. Footer */}
        <footer className="py-12 bg-[#F7FAFC] flex flex-col items-center justify-center">
          <div className="max-w-7xl w-full mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex gap-6 text-[10px] font-bold uppercase tracking-widest text-[#1A365D]/50">
              <span>GDL</span>
              <span>CDMX</span>
              <span>MTY</span>
            </div>
            <div className="text-[10px] text-[#1A365D]/50 font-medium">
              AVISO LEGAL / PRIVACIDAD / POLÍTICA DE COOKIES © 2026 Lumina Studio
            </div>
          </div>
        </footer>

      </main>
    </div>
  );
}
