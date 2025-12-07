import { motion, AnimatePresence } from 'motion/react';
import type { TebexPackage } from '../../types/TebexTypes';

interface ProductModalProps {
  package_: TebexPackage | null;
  isOpen: boolean;
  onClose: () => void;
  onPurchase: (packageId: number) => void;
  isPurchasing: boolean;
}

/**
 * ProductModal - Full screen modal displaying complete product details
 * Shows all available Tebex package data with a beautiful overlay design
 */
const ProductModal = ({ package_, isOpen, onClose, onPurchase, isPurchasing }: ProductModalProps) => {
  if (!package_) return null;

  const hasDiscount = package_.sales_price !== null && package_.sales_price < package_.base_price;
  const displayPrice = hasDiscount ? package_.sales_price! : package_.base_price;
  const discountPercent = hasDiscount 
    ? Math.round((1 - package_.sales_price! / package_.base_price) * 100) 
    : 0;

  // Handle backdrop click to close
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle escape key to close
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleBackdropClick}
          onKeyDown={handleKeyDown}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          tabIndex={-1}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal Content */}
          <motion.div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-3xl 
                       bg-gradient-to-br from-jungle-dark to-jungle-darker 
                       border border-white/10 shadow-2xl shadow-black/50"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2 rounded-full 
                         bg-white/10 hover:bg-white/20 backdrop-blur-sm
                         text-white/70 hover:text-white
                         transition-all duration-200"
              aria-label="Cerrar modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Discount Badge */}
            {hasDiscount && (
              <div className="absolute top-4 left-4 z-20 px-4 py-1.5 
                              bg-cr-red text-white text-sm font-bold 
                              rounded-full shadow-lg shadow-cr-red/30">
                -{discountPercent}% DESCUENTO
              </div>
            )}

            {/* Scrollable Content */}
            <div className="overflow-y-auto max-h-[90vh] custom-scrollbar">
              {/* Image Section */}
              {package_.image ? (
                <div className="relative h-64 sm:h-72 md:h-80 overflow-hidden">
                  <img
                    src={package_.image}
                    alt={package_.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-jungle-dark via-jungle-dark/50 to-transparent" />
                </div>
              ) : (
                <div className="h-48 bg-gradient-to-br from-tropical-green/20 to-tropical-teal/20 
                                flex items-center justify-center">
                  <svg className="w-24 h-24 text-tropical-green/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
              )}

              {/* Content Section */}
              <div className="p-6 sm:p-8 -mt-12 relative z-10">
                {/* Category Tag */}
                {package_.category && (
                  <motion.span
                    className="inline-block px-3 py-1.5 text-xs font-semibold uppercase tracking-wider
                               text-tropical-emerald bg-tropical-green/20 
                               rounded-lg border border-tropical-green/30 mb-4"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    {package_.category.name}
                  </motion.span>
                )}

                {/* Title */}
                <motion.h2
                  id="modal-title"
                  className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  {package_.name}
                </motion.h2>

                {/* Description - Full HTML content with complete styling */}
                <motion.div
                  className="mb-6 package-description"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  dangerouslySetInnerHTML={{ __html: package_.description }}
                />
                
                {/* Inline styles for package description HTML */}
                <style>{`
                  .package-description {
                    color: rgba(255, 255, 255, 0.75);
                    font-size: 0.95rem;
                    line-height: 1.7;
                  }
                  .package-description p {
                    margin-bottom: 1rem;
                  }
                  .package-description strong {
                    color: #6ee7b7;
                    font-weight: 600;
                  }
                  .package-description em {
                    color: rgba(255, 255, 255, 0.6);
                    font-style: italic;
                  }
                  .package-description ul {
                    list-style-type: disc;
                    padding-left: 1.5rem;
                    margin: 0.75rem 0;
                  }
                  .package-description ul ul {
                    list-style-type: circle;
                    margin: 0.5rem 0;
                  }
                  .package-description li {
                    margin-bottom: 0.5rem;
                    padding-left: 0.25rem;
                  }
                  .package-description li::marker {
                    color: #2dd4bf;
                  }
                  .package-description ol {
                    list-style-type: decimal;
                    padding-left: 1.5rem;
                    margin: 0.75rem 0;
                  }
                  .package-description a {
                    color: #6ee7b7;
                    text-decoration: underline;
                    text-underline-offset: 2px;
                  }
                  .package-description a:hover {
                    color: #a7f3d0;
                  }
                  .package-description span[style*="font-size"] {
                    opacity: 0.7;
                  }
                  .package-description h1,
                  .package-description h2,
                  .package-description h3,
                  .package-description h4 {
                    color: white;
                    font-weight: 600;
                    margin-top: 1.25rem;
                    margin-bottom: 0.75rem;
                  }
                  .package-description blockquote {
                    border-left: 3px solid #2dd4bf;
                    padding-left: 1rem;
                    margin: 1rem 0;
                    color: rgba(255, 255, 255, 0.6);
                    font-style: italic;
                  }
                  .package-description code {
                    background: rgba(255, 255, 255, 0.1);
                    padding: 0.125rem 0.375rem;
                    border-radius: 0.25rem;
                    font-family: ui-monospace, monospace;
                    font-size: 0.875em;
                    color: #a7f3d0;
                  }
                  .package-description hr {
                    border: none;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                    margin: 1.5rem 0;
                  }
                  .package-description img {
                    max-width: 100%;
                    border-radius: 0.5rem;
                    margin: 1rem 0;
                  }
                  .package-description table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 1rem 0;
                  }
                  .package-description th,
                  .package-description td {
                    padding: 0.5rem;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    text-align: left;
                  }
                  .package-description th {
                    background: rgba(255, 255, 255, 0.05);
                    color: white;
                    font-weight: 600;
                  }
                `}</style>

                {/* Additional Info Grid */}
                <motion.div
                  className="grid grid-cols-2 gap-4 mb-8 p-4 rounded-xl bg-white/5 border border-white/10"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                >
                  {/* Type */}
                  <div className="text-center">
                    <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Tipo</p>
                    <p className="text-sm text-white/80 font-medium capitalize">
                      {package_.type === 'single' ? 'Individual' : package_.type}
                    </p>
                  </div>

                  {/* Currency */}
                  <div className="text-center">
                    <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Moneda</p>
                    <p className="text-sm text-white/80 font-medium">{package_.currency}</p>
                  </div>

                  {/* Gifting */}
                  <div className="text-center">
                    <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Regalo</p>
                    <p className={`text-sm font-medium ${package_.disable_gifting ? 'text-white/40' : 'text-tropical-emerald'}`}>
                      {package_.disable_gifting ? 'No disponible' : 'Disponible'}
                    </p>
                  </div>

                  {/* Quantity */}
                  <div className="text-center">
                    <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Cantidad</p>
                    <p className={`text-sm font-medium ${package_.disable_quantity ? 'text-white/40' : 'text-tropical-emerald'}`}>
                      {package_.disable_quantity ? 'Fija' : 'Ajustable'}
                    </p>
                  </div>

                  {/* Expiration */}
                  {package_.expiration_date && (
                    <div className="col-span-2 text-center border-t border-white/10 pt-4">
                      <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Disponible hasta</p>
                      <p className="text-sm text-cr-red-light font-medium">
                        {new Date(package_.expiration_date).toLocaleDateString('es-CR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  )}
                </motion.div>

                {/* Price and Purchase Section */}
                <motion.div
                  className="flex flex-col sm:flex-row items-center justify-between gap-4 
                             p-6 rounded-2xl bg-gradient-to-r from-tropical-green/10 to-tropical-teal/10 
                             border border-tropical-green/20"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {/* Price */}
                  <div className="text-center sm:text-left">
                    <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Precio</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl sm:text-4xl font-bold text-tropical-emerald">
                        ${displayPrice.toFixed(2)}
                      </span>
                      {hasDiscount && (
                        <span className="text-lg text-white/40 line-through">
                          ${package_.base_price.toFixed(2)}
                        </span>
                      )}
                      <span className="text-sm text-white/40 uppercase">{package_.currency}</span>
                    </div>
                    {hasDiscount && (
                      <p className="text-sm text-tropical-emerald mt-1">
                        ¡Ahorras ${(package_.base_price - package_.sales_price!).toFixed(2)}!
                      </p>
                    )}
                  </div>

                  {/* Purchase Button */}
                  <motion.button
                    onClick={() => onPurchase(package_.id)}
                    disabled={isPurchasing}
                    className="w-full sm:w-auto px-8 py-4 
                               bg-gradient-to-r from-tropical-green to-tropical-teal 
                               text-white font-bold text-lg rounded-xl
                               hover:shadow-xl hover:shadow-tropical-green/30
                               disabled:opacity-50 disabled:cursor-not-allowed
                               transition-all duration-300"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {isPurchasing ? (
                      <span className="flex items-center justify-center gap-3">
                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Procesando...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Comprar Ahora
                      </span>
                    )}
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductModal;

