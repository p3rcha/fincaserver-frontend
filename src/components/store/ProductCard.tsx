import { motion } from 'motion/react';
import type { TebexPackage } from '../../types/TebexTypes';

interface ProductCardProps {
  package_: TebexPackage;
  onPurchase: (packageId: number) => void;
  onViewDetails: (package_: TebexPackage) => void;
  isPurchasing: boolean;
}

/**
 * Strip HTML tags from description for preview text
 */
const stripHtml = (html: string): string => {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

/**
 * ProductCard - Clickable card component for store products
 * Clicking the card opens the detail modal, clicking the button triggers purchase
 */
const ProductCard = ({ package_, onPurchase, onViewDetails, isPurchasing }: ProductCardProps) => {
  const hasDiscount = package_.sales_price !== null && package_.sales_price < package_.base_price;
  const descriptionPreview = stripHtml(package_.description);
  const displayPrice = hasDiscount ? package_.sales_price! : package_.base_price;
  const discountPercent = hasDiscount 
    ? Math.round((1 - package_.sales_price! / package_.base_price) * 100) 
    : 0;

  // Handle card click - open modal unless clicking the purchase button
  const handleCardClick = (e: React.MouseEvent) => {
    // Check if clicking the actual purchase button (not the card itself)
    const target = e.target as HTMLElement;
    if (target.closest('[data-purchase-button]')) return;
    onViewDetails(package_);
  };

  return (
    <motion.div
      className="group relative bg-white/5 backdrop-blur-sm border border-white/10 
                 rounded-2xl overflow-hidden hover:border-tropical-green/30 
                 transition-all duration-300 cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      onClick={handleCardClick}
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onViewDetails(package_)}
      aria-label={`Ver detalles de ${package_.name}`}
    >
      {/* Discount Badge */}
      {hasDiscount && (
        <div className="absolute top-4 right-4 z-10 px-3 py-1 bg-cr-red text-white 
                        text-sm font-bold rounded-full shadow-lg">
          -{discountPercent}%
        </div>
      )}

      {/* Image */}
      {package_.image ? (
        <div className="relative h-48 overflow-hidden">
          <img
            src={package_.image}
            alt={package_.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-jungle-dark/80 to-transparent" />
        </div>
      ) : (
        <div className="h-48 bg-gradient-to-br from-tropical-green/20 to-tropical-teal/20 
                        flex items-center justify-center">
          <svg className="w-16 h-16 text-tropical-green/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Category */}
        {package_.category && (
          <span className="inline-block px-2 py-1 text-xs font-medium text-tropical-emerald 
                          bg-tropical-green/10 rounded-md mb-3">
            {package_.category.name}
          </span>
        )}

        {/* Name */}
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-tropical-emerald 
                       transition-colors duration-300">
          {package_.name}
        </h3>

        {/* Description Preview (plain text) */}
        <p className="text-white/60 text-sm mb-4 line-clamp-2">
          {descriptionPreview}
        </p>

        {/* Price and Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-tropical-emerald">
              ${displayPrice.toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-white/40 line-through">
                ${package_.base_price.toFixed(2)}
              </span>
            )}
            <span className="text-xs text-white/40 uppercase">{package_.currency}</span>
          </div>

          <motion.button
            onClick={() => onPurchase(package_.id)}
            disabled={isPurchasing}
            data-purchase-button
            className="px-5 py-2.5 bg-gradient-to-r from-tropical-green to-tropical-teal 
                       text-white font-semibold rounded-xl
                       hover:shadow-lg hover:shadow-tropical-green/30
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isPurchasing ? (
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                ...
              </span>
            ) : (
              'Comprar'
            )}
          </motion.button>
        </div>
      </div>

      {/* Hover glow effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 
                      bg-gradient-to-t from-tropical-green/5 to-transparent 
                      pointer-events-none transition-opacity duration-300" />
    </motion.div>
  );
};

export default ProductCard;

