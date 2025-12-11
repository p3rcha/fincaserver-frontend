import { useEffect, useState, useCallback, useMemo } from 'react';
import { motion } from 'motion/react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchPackages, fetchCategories } from '../api/tebexApi';
import type { TebexPackage, TebexCategory } from '../types/TebexTypes';
import ProductCard from '../components/store/ProductCard';
import ProductModal from '../components/store/ProductModal';

// Discord invite URL from environment variable
const DISCORD_INVITE_URL = import.meta.env.VITE_DISCORD_INVITE_URL;

/**
 * Convert category name to URL slug
 */
const toSlug = (name: string): string => {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

/**
 * Find category by slug
 */
const findCategoryBySlug = (categories: TebexCategory[], slug: string): TebexCategory | undefined => {
  return categories.find(cat => toSlug(cat.name) === slug);
};

const StorePage = () => {
  const { category: categorySlug } = useParams<{ category: string }>();
  const navigate = useNavigate();
  
  const [packages, setPackages] = useState<TebexPackage[]>([]);
  const [categories, setCategories] = useState<TebexCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal state for product details
  const [selectedProduct, setSelectedProduct] = useState<TebexPackage | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch packages and categories
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [packagesData, categoriesData] = await Promise.all([
        fetchPackages(),
        fetchCategories(),
      ]);

      setPackages(packagesData);
      setCategories(categoriesData);
    } catch (err) {
      console.error('Failed to fetch store data:', err);
      setError('No se pudo cargar la tienda. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Find the current category based on URL slug
  const currentCategory = useMemo(() => {
    if (!categorySlug || categories.length === 0) return null;
    return findCategoryBySlug(categories, categorySlug);
  }, [categorySlug, categories]);

  // Redirect to first available category if current slug is invalid
  useEffect(() => {
    if (!loading && categories.length > 0 && categorySlug) {
      const found = findCategoryBySlug(categories, categorySlug);
      if (!found) {
        // Category not found, redirect to first category
        const firstCategory = categories[0];
        if (firstCategory) {
          navigate(`/tienda/${toSlug(firstCategory.name)}`, { replace: true });
        }
      }
    }
  }, [loading, categories, categorySlug, navigate]);

  // Filter packages by current category
  const filteredPackages = useMemo(() => {
    if (!currentCategory) return [];
    return packages.filter(pkg => pkg.category?.id === currentCategory.id);
  }, [packages, currentCategory]);

  // Open product detail modal
  const handleViewDetails = useCallback((product: TebexPackage) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  }, []);

  // Close product detail modal
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    // Delay clearing selected product to allow exit animation
    setTimeout(() => setSelectedProduct(null), 300);
  }, []);

  // Navigate to category
  const handleCategoryChange = useCallback((category: TebexCategory) => {
    navigate(`/tienda/${toSlug(category.name)}`);
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-jungle-dark pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Skeleton */}
          <div className="text-center mb-12">
            <div className="h-16 bg-white/5 rounded-xl w-64 mx-auto mb-4 animate-pulse" />
            <div className="h-6 bg-white/5 rounded-lg w-96 max-w-full mx-auto animate-pulse" />
          </div>

          {/* Category Tabs Skeleton */}
          <div className="flex flex-wrap md:flex-nowrap justify-center gap-3 mb-12">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-10 bg-white/5 rounded-xl w-24 animate-pulse"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>

          {/* Product Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <motion.div
                key={i}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                {/* Image skeleton */}
                <div className="h-48 bg-gradient-to-br from-white/10 to-white/5 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
                </div>
                
                {/* Content skeleton */}
                <div className="p-6">
                  <div className="h-4 bg-white/5 rounded w-20 mb-3 animate-pulse" />
                  <div className="h-6 bg-white/5 rounded w-3/4 mb-2 animate-pulse" />
                  <div className="h-4 bg-white/5 rounded w-full mb-2 animate-pulse" />
                  <div className="h-4 bg-white/5 rounded w-2/3 mb-4 animate-pulse" />
                  
                  {/* Price and button skeleton */}
                  <div className="flex items-center justify-between">
                    <div className="h-8 bg-white/5 rounded w-24 animate-pulse" />
                    <div className="h-10 bg-gradient-to-r from-tropical-green/20 to-tropical-teal/20 rounded-xl w-32 animate-pulse" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-jungle-dark flex items-center justify-center pt-20">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-cr-red/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-cr-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <p className="text-white/60 mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="px-6 py-2 bg-tropical-green text-white rounded-lg hover:bg-tropical-teal transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-jungle-dark pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Tienda
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto mb-2">
            Apoya al servidor y obtén beneficios exclusivos
          </p>
          <p className="text-white/40 text-sm max-w-2xl mx-auto italic">
            Por el momento, las compras se realizan mediante Sinpe Móvil. Para realizar tu compra,{' '}
            <a
              href={DISCORD_INVITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-tropical-emerald hover:text-tropical-green underline transition-colors"
            >
              únete a nuestro Discord
            </a>
            {' '}y habla con <span className="font-semibold text-tropical-emerald">p3rcha</span>
          </p>
        </motion.div>

        {/* Category Tabs - No "Todos" option */}
        {categories.length > 0 && (
          <motion.div
            className="flex flex-wrap md:flex-nowrap justify-center gap-3 mb-12 overflow-x-auto md:overflow-x-visible"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {categories.map((category) => {
              const isActive = currentCategory?.id === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-5 py-2 rounded-xl font-medium transition-all duration-300 ${
                    isActive
                      ? 'bg-tropical-green text-white shadow-lg shadow-tropical-green/30'
                      : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
                  }`}
                >
                  {category.name}
                </button>
              );
            })}
          </motion.div>
        )}

        {/* Products Grid */}
        {filteredPackages.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-white/40">No hay productos disponibles en esta categoría.</p>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {filteredPackages.map((pkg, index) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * Math.min(index, 5) }}
              >
                <ProductCard
                  package_={pkg}
                  onViewDetails={handleViewDetails}
                />
              </motion.div>
            ))}
          </motion.div>
        )}

      </div>

      {/* Product Detail Modal - placed outside the container for proper z-index */}
      <ProductModal
        package_={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default StorePage;
