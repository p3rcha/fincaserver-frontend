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
    description: "Explora una recreación única del territorio costarricense usando información de Topografía Nacional.",
    color: "from-tropical-green to-tropical-teal"
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "100% Gratuito",
    description: "Servidor survival completamente gratuito y abierto al público. Tanto para JAVA como para BEDROCK.",
    color: "from-cr-blue to-cr-blue-light"
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
              d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
      </svg>
    ),
    title: "Rangos para Mejorar tu Experiencia",
    description: "Sistema de rangos opcionales que te permiten personalizar y mejorar tu experiencia de juego. Más comodidad, más diversión.",
    color: "from-tropical-emerald to-teal-400"
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
    description: "Anti-cheat activo 24/7. Tu experiencia de juego está protegida.",
    color: "from-purple-500 to-purple-700"
  },
];

const FeatureItem = ({ feature, index }: { feature: Feature; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <div className="flex items-start gap-6 p-6 rounded-xl
                      bg-white/5 backdrop-blur-sm
                      border border-white/10
                      hover:bg-white/10 hover:border-white/20
                      transition-all duration-300">
        {/* Icon - Fixed size */}
        <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center
                        bg-gradient-to-br ${feature.color} text-white
                        shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          <div className="w-6 h-6">
            {feature.icon}
          </div>
        </div>

        {/* Content - Fixed structure */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-white mb-2 
                         group-hover:text-tropical-emerald transition-colors duration-300">
            {feature.title}
          </h3>
          <p className="text-white/60 text-sm leading-relaxed">
            {feature.description}
          </p>
        </div>
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
            Un servidor survival gratuito para todos. Explora Costa Rica, mejora tu experiencia con rangos opcionales y disfruta de la pura vida.
          </p>
        </motion.div>

        {/* Features List - Uniform design */}
        <div className="max-w-4xl mx-auto space-y-4">
          {features.map((feature, index) => (
            <FeatureItem key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

