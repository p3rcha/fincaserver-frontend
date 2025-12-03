import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSearchParams } from 'react-router-dom';
import { getPackages, getCategories, createBasket, addPackageToBasket } from '../api/tebexApi';
import type { TebexPackage, TebexCategory } from '../types/TebexTypes';
import ProductCard from '../components/store/ProductCard';

// Declare Tebex global for TypeScript
declare global {
  interface Window {
    Tebex?: {
      checkout: {
        init: (config: { ident: string }) => void;
        launch: () => void;
      };
    };
  }
}

const StorePage = () => {
  const [searchParams] = useSearchParams();
  const [packages, setPackages] = useState<TebexPackage[]>([]);
  const [categories, setCategories] = useState<TebexCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [purchasingId, setPurchasingId] = useState<number | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'cancelled'; message: string } | null>(null);

  // Check for success/cancelled URL params
  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      setNotification({ type: 'success', message: '¡Compra completada! Gracias por tu apoyo.' });
      window.history.replaceState({}, '', '/store');
    } else if (searchParams.get('cancelled') === 'true') {
      setNotification({ type: 'cancelled', message: 'Compra cancelada. Puedes intentarlo de nuevo.' });
      window.history.replaceState({}, '', '/store');
    }
  }, [searchParams]);

  // Load Tebex.js script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://js.tebex.io/v/1.js';
    script.defer = true;
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  // Fetch packages and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [packagesRes, categoriesRes] = await Promise.all([
          getPackages(),
          getCategories(),
        ]);

        setPackages(packagesRes.data || []);
        setCategories(categoriesRes.data || []);
      } catch (err) {
        console.error('Failed to fetch store data:', err);
        setError('No se pudo cargar la tienda. Por favor, intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle purchase
  const handlePurchase = useCallback(async (packageId: number) => {
    if (purchasingId) return;

    try {
      setPurchasingId(packageId);

      // Create basket
      const basketRes = await createBasket();
      const basketIdent = basketRes.data.ident;

      // Add package to basket
      await addPackageToBasket(basketIdent, packageId);

      // Launch Tebex checkout
      if (window.Tebex) {
        window.Tebex.checkout.init({ ident: basketIdent });
        window.Tebex.checkout.launch();
      } else {
        throw new Error('Tebex checkout not loaded');
      }
    } catch (err) {
      console.error('Purchase error:', err);
      setNotification({ type: 'error', message: 'Error al procesar la compra. Por favor, intenta de nuevo.' });
    } finally {
      setPurchasingId(null);
    }
  }, [purchasingId]);

  // Filter packages by category
  const filteredPackages = selectedCategory
    ? packages.filter(pkg => pkg.category?.id === selectedCategory)
    : packages;

  // Dismiss notification
  const dismissNotification = () => setNotification(null);

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
            onClick={() => window.location.reload()}
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
      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 max-w-md w-full mx-4"
          >
            <div className={`px-6 py-4 rounded-xl backdrop-blur-lg border shadow-lg flex items-center gap-3
              ${notification.type === 'success' 
                ? 'bg-tropical-green/20 border-tropical-green/30 text-tropical-emerald' 
                : notification.type === 'cancelled'
                ? 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400'
                : 'bg-cr-red/20 border-cr-red/30 text-cr-red-light'
              }`}
            >
              <span className="flex-1">{notification.message}</span>
              <button onClick={dismissNotification} className="p-1 hover:opacity-70">
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

        {/* Category Filter */}
        {categories.length > 0 && (
          <motion.div
            className="flex flex-wrap justify-center gap-3 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-5 py-2 rounded-xl font-medium transition-all duration-300 ${
                selectedCategory === null
                  ? 'bg-tropical-green text-white shadow-lg shadow-tropical-green/30'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              Todos
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-5 py-2 rounded-xl font-medium transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-tropical-green text-white shadow-lg shadow-tropical-green/30'
                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
                }`}
              >
                {category.name}
              </button>
            ))}
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
                transition={{ delay: 0.1 * index }}
              >
                <ProductCard
                  package_={pkg}
                  onPurchase={handlePurchase}
                  isPurchasing={purchasingId === pkg.id}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default StorePage;
