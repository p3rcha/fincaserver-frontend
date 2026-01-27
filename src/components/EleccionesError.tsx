import { motion } from 'motion/react';

interface EleccionesErrorProps {
  message: string;
  discordUrl?: string;
  type?: string;
}

const EleccionesError = ({ message, discordUrl, type }: EleccionesErrorProps) => {
  const DISCORD_INVITE_URL = import.meta.env.VITE_DISCORD_INVITE_URL || discordUrl;

  // If it's a whitelist error and we have a Discord URL, render with link
  if (type === 'whitelist_error' && DISCORD_INVITE_URL) {
    // Split message to insert Discord link
    const parts = message.split('discord');
    if (parts.length === 2) {
      return (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-cr-red/20 border border-cr-red text-cr-red-light"
        >
          <p className="text-sm font-medium">
            {parts[0]}
            <a
              href={DISCORD_INVITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-tropical-emerald hover:text-tropical-green underline font-semibold transition-colors"
            >
              discord
            </a>
            {parts[1]}
          </p>
        </motion.div>
      );
    }
  }

  // Default error display
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-xl bg-cr-red/20 border border-cr-red text-cr-red-light"
    >
      <p className="text-sm font-medium">{message}</p>
    </motion.div>
  );
};

export default EleccionesError;
