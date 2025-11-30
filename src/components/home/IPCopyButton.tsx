import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface IPCopyButtonProps {
  ip?: string;
  variant?: 'large' | 'small';
}

const IPCopyButton = ({ ip = 'mc.fincaserver.net', variant = 'large' }: IPCopyButtonProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(ip);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy IP:', err);
    }
  };

  const isLarge = variant === 'large';

  return (
    <motion.button
      onClick={handleCopy}
      className={`
        relative overflow-hidden group cursor-pointer
        ${isLarge 
          ? 'px-8 py-4 text-xl md:text-2xl rounded-2xl' 
          : 'px-4 py-2 text-sm rounded-lg'
        }
        bg-gradient-to-r from-tropical-green to-tropical-teal
        text-white font-semibold
        border-2 border-tropical-emerald/30
        shadow-lg shadow-tropical-green/20
        transition-all duration-300
      `}
      whileHover={{ 
        scale: 1.05,
        boxShadow: '0 0 30px rgba(34, 139, 34, 0.5)'
      }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-tropical-emerald/0 via-white/10 to-tropical-emerald/0 
                      translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
      
      <div className="relative flex items-center gap-3">
        <AnimatePresence mode="wait">
          {copied ? (
            <motion.div
              key="copied"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2"
            >
              {/* Checkmark icon */}
              <svg className={`${isLarge ? 'w-6 h-6' : 'w-4 h-4'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <motion.path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </svg>
              <span>¡IP Copiada!</span>
            </motion.div>
          ) : (
            <motion.div
              key="ip"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex items-center gap-2"
            >
              {/* Copy icon */}
              <svg className={`${isLarge ? 'w-6 h-6' : 'w-4 h-4'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span className="font-mono tracking-wide">{ip}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Pulse ring animation */}
      <motion.div
        className="absolute inset-0 rounded-2xl border-2 border-tropical-emerald"
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
    </motion.button>
  );
};

export default IPCopyButton;

