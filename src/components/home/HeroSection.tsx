import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import IPCopyButton from './IPCopyButton';
import ParticleBackground from './ParticleBackground';
import heroImage from '../../assets/hero.png';

const HeroSection = () => {
  const serverName = "FINCA SERVER";
  const letters = serverName.split("");

  // Brightness/reveal effect based on mouse activity
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = () => {
      setIsHovering(true);
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <ParticleBackground />
      
      {/* Hero Image - Full cover with blur/reveal effect */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.img
          src={heroImage}
          alt=""
          className="w-full h-full object-cover select-none"
          initial={{ opacity: 0, filter: 'blur(12px) brightness(0.3)' }}
          animate={{ 
            opacity: 1,
            filter: isHovering 
              ? 'blur(4px) brightness(0.45)' 
              : 'blur(8px) brightness(0.3)',
          }}
          transition={{ 
            opacity: { duration: 1.5 },
            filter: { duration: 0.8, ease: "easeOut" }
          }}
        />
        
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-jungle-dark/60 via-transparent to-jungle-dark/80" />
        
        {/* Vignette effect */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 20%, rgba(15, 26, 15, 0.7) 70%, rgba(15, 26, 15, 0.95) 100%)',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        {/* Animated Server Name */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight">
            {letters.map((letter, index) => (
              <motion.span
                key={index}
                className={`inline-block ${letter === " " ? "mx-2" : ""} 
                  bg-gradient-to-b from-white via-tropical-emerald to-tropical-green 
                  bg-clip-text text-transparent
                  drop-shadow-[0_0_30px_rgba(34,139,34,0.5)]`}
                initial={{ opacity: 0, y: 50, rotateX: -90 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.05,
                  ease: [0.215, 0.61, 0.355, 1]
                }}
              >
                {letter === " " ? "\u00A0" : letter}
              </motion.span>
            ))}
          </h1>
        </motion.div>

        {/* Costa Rica Badge */}
        <motion.div
          className="flex items-center justify-center gap-2 mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <div className="flex gap-0.5">
            <div className="w-6 h-4 bg-cr-blue rounded-l-sm" />
            <div className="w-6 h-4 bg-white" />
            <div className="w-6 h-4 bg-cr-red" />
            <div className="w-6 h-4 bg-white" />
            <div className="w-6 h-4 bg-cr-blue rounded-r-sm" />
          </div>
          <span className="text-white/80 text-lg font-medium ml-2">Costa Rica</span>
        </motion.div>

        {/* Tagline */}
        <motion.p
          className="text-xl sm:text-2xl md:text-3xl text-white/80 mb-12 font-light"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          Explora Costa Rica en Minecraft
        </motion.p>

        {/* IP Copy Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <IPCopyButton />
        </motion.div>

        {/* Secondary text */}
        <motion.p
          className="mt-6 text-white/50 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
        >
          Haz clic para copiar la IP del servidor
        </motion.p>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
      >
        <motion.div
          className="flex flex-col items-center gap-2 text-white/50"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
