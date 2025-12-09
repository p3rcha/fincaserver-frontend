import { motion } from 'motion/react';
import type { TebexPackage } from '../../types/TebexTypes';

// Discord invite URL
const DISCORD_INVITE_URL = 'https://discord.com/invite/FQh9dcNMQq';

interface ProductCardProps {
  package_: TebexPackage;
  onViewDetails: (package_: TebexPackage) => void;
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
 * Clicking the card opens the detail modal, clicking the button opens Discord
 */
const ProductCard = ({ package_, onViewDetails }: ProductCardProps) => {
  const hasDiscount = package_.sales_price !== null && package_.sales_price < package_.base_price;
  const descriptionPreview = stripHtml(package_.description);
  const displayPrice = hasDiscount ? package_.sales_price! : package_.base_price;
  const discountPercent = hasDiscount 
    ? Math.round((1 - package_.sales_price! / package_.base_price) * 100) 
    : 0;

  // Handle card click - open modal unless clicking the Discord button
  const handleCardClick = (e: React.MouseEvent) => {
    // Check if clicking the actual Discord button (not the card itself)
    const target = e.target as HTMLElement;
    if (target.closest('[data-discord-button]')) return;
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

          <motion.a
            href={DISCORD_INVITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-discord-button
            className="px-5 py-2.5 bg-gradient-to-r from-tropical-green to-tropical-teal 
                       text-white font-semibold rounded-xl
                       hover:shadow-lg hover:shadow-tropical-green/30
                       transition-all duration-300 inline-flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
            </svg>
            Compra en Discord
          </motion.a>
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

