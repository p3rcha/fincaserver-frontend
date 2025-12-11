import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import IPCopyButton from './IPCopyButton';
import ParticleBackground from './ParticleBackground';
import heroImage from '../../assets/hero.png';

// Discord invite URL from environment variable
const DISCORD_INVITE_URL = import.meta.env.VITE_DISCORD_INVITE_URL;

const HeroSection = () => {
  const serverName = "FINCA SERVER";
  const letters = serverName.split("");

  // Brightness/reveal effect based on mouse activity
  const [isHovering, setIsHovering] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setIsHovering(true);
      setMousePos({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
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

      {/* Cursor spotlight effect */}
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          background: `radial-gradient(800px circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(34, 139, 34, 0.15), transparent 40%)`,
        }}
      />

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

        {/* IP Copy Button and Discord Button */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <IPCopyButton />
          <motion.a
            href={DISCORD_INVITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="relative overflow-hidden group cursor-pointer
                       px-8 py-4 text-xl md:text-2xl rounded-2xl
                       bg-gradient-to-r from-[#5865F2] to-[#7289DA]
                       text-white font-semibold
                       border-2 border-[#7289DA]/50
                       shadow-lg shadow-[#5865F2]/30
                       transition-all duration-300
                       flex items-center gap-3"
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 0 30px rgba(88, 101, 242, 0.5)'
            }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Glow effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 
                            translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            
            {/* Discord icon */}
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
            </svg>
            <span>Únete al Discord</span>
            
            {/* Pulse ring animation */}
            <motion.div
              className="absolute inset-0 rounded-2xl border-2 border-[#7289DA]"
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.a>
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
