import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

const features: Feature[] = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    ),
    title: "Mapa de Costa Rica",
    description: "Explora una recreación única del territorio costarricense en escala 1:1000. Desde las playas del Caribe hasta los volcanes.",
    color: "from-tropical-green to-tropical-teal"
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: "Comunidad Activa",
    description: "Únete a una comunidad vibrante de jugadores ticos y de toda Latinoamérica. Eventos semanales y torneos.",
    color: "from-cr-blue to-cr-blue-light"
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
              d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    title: "Plugins Exclusivos",
    description: "Sistemas personalizados de economía, protección de terrenos y misiones únicas inspiradas en la cultura tica.",
    color: "from-gold-accent to-yellow-500"
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
              d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "Alto Rendimiento",
    description: "Servidor optimizado con baja latencia para jugadores de toda la región. 99.9% uptime garantizado.",
    color: "from-cr-red to-cr-red-light"
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: "Seguro y Protegido",
    description: "Anti-cheat avanzado y staff activo 24/7. Tu experiencia de juego está protegida.",
    color: "from-purple-500 to-purple-700"
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
              d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
      </svg>
    ),
    title: "Rangos y Recompensas",
    description: "Sistema de rangos con beneficios exclusivos. Participa en eventos y gana premios increíbles.",
    color: "from-tropical-emerald to-teal-400"
  },
];

const FeatureCard = ({ feature, index }: { feature: Feature; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative"
    >
      {/* Glassmorphism card */}
      <div className="relative p-6 rounded-2xl 
                      bg-white/5 backdrop-blur-lg
                      border border-white/10
                      hover:bg-white/10 hover:border-white/20
                      transition-all duration-500
                      overflow-hidden">
        {/* Gradient glow on hover */}
        <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 
                        bg-gradient-to-br ${feature.color} 
                        transition-opacity duration-500 blur-xl`} />
        
        {/* Icon */}
        <div className={`relative w-14 h-14 rounded-xl mb-4 flex items-center justify-center
                        bg-gradient-to-br ${feature.color} text-white
                        shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          {feature.icon}
        </div>

        {/* Content */}
        <h3 className="relative text-xl font-bold text-white mb-2 
                       group-hover:text-tropical-emerald transition-colors duration-300">
          {feature.title}
        </h3>
        <p className="relative text-white/60 text-sm leading-relaxed">
          {feature.description}
        </p>
      </div>
    </motion.div>
  );
};

const FeaturesSection = () => {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-100px" });

  return (
    <section className="relative py-24 px-4 bg-jungle-medium">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          ref={headerRef}
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            ¿Por qué <span className="text-tropical-emerald">Finca Server</span>?
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Descubre lo que nos hace únicos en el mundo de Minecraft
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

