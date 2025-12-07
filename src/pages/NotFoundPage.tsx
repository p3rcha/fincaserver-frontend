import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

/**
 * NotFoundPage - Custom 404 error page
 */
const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-jungle-dark flex items-center justify-center px-4">
      <motion.div
        className="text-center max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* 404 Number */}
        <motion.h1
          className="text-[8rem] sm:text-[10rem] font-black text-transparent bg-clip-text 
                     bg-gradient-to-br from-tropical-green to-tropical-teal leading-none mb-4"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          404
        </motion.h1>

        {/* Minecraft-style message */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            ¡Chunk no encontrado!
          </h2>
          <p className="text-white/60 text-lg">
            Parece que te perdiste explorando. Esta página no existe en nuestro mundo.
          </p>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Link
            to="/"
            className="px-8 py-3 bg-gradient-to-r from-tropical-green to-tropical-teal 
                       text-white font-bold rounded-xl hover:shadow-lg hover:shadow-tropical-green/30
                       transition-all duration-300"
          >
            Ir al Inicio
          </Link>
          <Link
            to="/store"
            className="px-8 py-3 bg-white/10 border border-white/20 
                       text-white font-medium rounded-xl hover:bg-white/20
                       transition-all duration-300"
          >
            Ver Tienda
          </Link>
        </motion.div>

        {/* Decorative elements */}
        <motion.div
          className="mt-12 text-white/20 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p>Error 404 • Página no encontrada</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;

