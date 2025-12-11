import { motion, AnimatePresence } from 'motion/react';
import type { TebexPackage } from '../../types/TebexTypes';

// Discord invite URL from environment variable
const DISCORD_INVITE_URL = import.meta.env.VITE_DISCORD_INVITE_URL;

interface ProductModalProps {
  package_: TebexPackage | null;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * ProductModal - Full screen modal displaying complete product details
 * Shows all available Tebex package data with a beautiful overlay design
 */
const ProductModal = ({ package_, isOpen, onClose }: ProductModalProps) => {
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

                  {/* Discord Purchase Button */}
                  <motion.a
                    href={DISCORD_INVITE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-8 py-4 
                               bg-gradient-to-r from-tropical-green to-tropical-teal 
                               text-white font-bold text-lg rounded-xl
                               hover:shadow-xl hover:shadow-tropical-green/30
                               transition-all duration-300 inline-flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
                    </svg>
                    Compra en Discord
                  </motion.a>
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

