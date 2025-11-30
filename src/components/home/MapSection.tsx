import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';

const MapSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative py-24 px-4 bg-jungle-dark overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-tropical-green/50 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-tropical-green/50 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto relative" ref={ref}>
        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Explora el <span className="text-tropical-emerald">Mapa</span>
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Navega por nuestra recreación de Costa Rica en tiempo real
          </p>
        </motion.div>

        {/* Map Container */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Decorative frame */}
          <div className="absolute -inset-1 bg-gradient-to-r from-tropical-green via-tropical-teal to-tropical-emerald rounded-2xl opacity-50 blur-sm" />
          <div className="absolute -inset-0.5 bg-gradient-to-r from-tropical-green via-tropical-teal to-tropical-emerald rounded-2xl opacity-75" />
          
          {/* Map iframe container */}
          <div className="relative bg-jungle-medium rounded-xl overflow-hidden">
            <iframe
              src="https://mapa.fincaserver.net"
              className="w-full h-[500px] md:h-[600px] border-0"
              title="Mapa de Finca Server"
              loading="lazy"
              allowFullScreen
            />
          </div>
        </motion.div>

        {/* Action Button */}
        <motion.div
          className="flex justify-center mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <motion.a
            href="https://mapa.fincaserver.net"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-6 py-3 
                       bg-white/10 backdrop-blur-sm
                       border border-white/20 rounded-xl
                       text-white font-medium
                       hover:bg-white/20 hover:border-tropical-green/50
                       transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Abrir Mapa en Nueva Pestaña
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default MapSection;

