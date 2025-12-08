import { useEffect, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { fetchPackages, fetchCategories, createBasket, addPackageToBasket } from '../api/tebexApi';
import type { TebexPackage, TebexCategory } from '../types/TebexTypes';
import ProductCard from '../components/store/ProductCard';
import ProductModal from '../components/store/ProductModal';
import { useTebexCheckout } from '../hooks/useTebexCheckout';

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
  const [searchParams] = useSearchParams();
  
  const [packages, setPackages] = useState<TebexPackage[]>([]);
  const [categories, setCategories] = useState<TebexCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [purchasingId, setPurchasingId] = useState<number | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'cancelled'; message: string } | null>(null);
  
  // Modal state for product details
  const [selectedProduct, setSelectedProduct] = useState<TebexPackage | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Initialize Tebex checkout with event handlers
  const { launchCheckout } = useTebexCheckout({
    theme: 'dark',
    locale: 'es_ES',
    colors: [
      { name: 'primary', color: '#228B22' },    // tropical-green
      { name: 'secondary', color: '#10B981' },  // tropical-emerald
    ],
    onOpen: () => {
      console.log('Checkout opened');
    },
    onClose: () => {
      console.log('Checkout closed');
      setPurchasingId(null);
    },
    onPaymentComplete: (event) => {
      console.log('Payment complete:', event);
      setNotification({ 
        type: 'success', 
        message: '¡Compra completada! Gracias por tu apoyo. Tu compra será procesada en breve.' 
      });
      setPurchasingId(null);
    },
    onPaymentError: (event) => {
      console.error('Payment error:', event);
      setNotification({ 
        type: 'error', 
        message: 'Error en el pago. Por favor, intenta de nuevo o contacta soporte.' 
      });
      setPurchasingId(null);
    },
  });

  // Check for success/cancelled URL params (fallback for redirect flow)
  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      setNotification({ type: 'success', message: '¡Compra completada! Gracias por tu apoyo.' });
      window.history.replaceState({}, '', `/tienda/${categorySlug ?? 'rangos'}`);
    } else if (searchParams.get('cancelled') === 'true') {
      setNotification({ type: 'cancelled', message: 'Compra cancelada. Puedes intentarlo de nuevo.' });
      window.history.replaceState({}, '', `/tienda/${categorySlug ?? 'rangos'}`);
    }
  }, [searchParams, categorySlug]);

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

  // Handle purchase - creates basket, adds package, launches checkout
  const handlePurchase = useCallback(async (packageId: number) => {
    if (purchasingId) return;

    try {
      setPurchasingId(packageId);

      // Create basket via backend API (returns basket directly)
      const basket = await createBasket();
      const basketIdent = basket.ident;

      // Add package to basket
      await addPackageToBasket(basketIdent, packageId);

      // Launch Tebex checkout modal
      launchCheckout(basketIdent);

    } catch (err) {
      console.error('Purchase error:', err);
      setNotification({ 
        type: 'error', 
        message: 'Error al procesar la compra. Por favor, intenta de nuevo.' 
      });
      setPurchasingId(null);
    }
  }, [purchasingId, launchCheckout]);

  // Filter packages by current category
  const filteredPackages = useMemo(() => {
    if (!currentCategory) return [];
    return packages.filter(pkg => pkg.category?.id === currentCategory.id);
  }, [packages, currentCategory]);

  // Dismiss notification
  const dismissNotification = () => setNotification(null);

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

  // Auto-dismiss notifications after 5 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  if (loading) {
    return (
      <div className="min-h-screen bg-jungle-dark flex items-center justify-center pt-20">
        <div className="text-center">
          <motion.div
            className="w-16 h-16 border-4 border-tropical-green/30 border-t-tropical-green rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-white/60">Cargando tienda...</p>
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
      {/* Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.95 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 max-w-md w-full mx-4"
          >
            <div className={`px-6 py-4 rounded-xl backdrop-blur-lg border shadow-2xl flex items-center gap-3
              ${notification.type === 'success' 
                ? 'bg-tropical-green/20 border-tropical-green/30 text-tropical-emerald' 
                : notification.type === 'cancelled'
                ? 'bg-yellow-500/20 border-yellow-500/30 text-yellow-300'
                : 'bg-red-950/80 border-red-500/50 text-red-200'
              }`}
            >
              {/* Icon */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                ${notification.type === 'success' 
                  ? 'bg-tropical-green/30' 
                  : notification.type === 'cancelled'
                  ? 'bg-yellow-500/30'
                  : 'bg-red-500/40'
                }`}
              >
                {notification.type === 'success' ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : notification.type === 'cancelled' ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
              <span className="flex-1 text-sm">{notification.message}</span>
              <button onClick={dismissNotification} className="p-1 hover:opacity-70 transition-opacity">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Apoya al servidor y obtén beneficios exclusivos
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
                  onPurchase={handlePurchase}
                  onViewDetails={handleViewDetails}
                  isPurchasing={purchasingId === pkg.id}
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
        onPurchase={handlePurchase}
        isPurchasing={purchasingId === selectedProduct?.id}
      />
    </div>
  );
};

export default StorePage;
