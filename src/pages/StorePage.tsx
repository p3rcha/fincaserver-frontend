import { useEffect, useState } from 'react';
import { getStoreItems } from '../api/storeApi';
import type { StoreItem } from '../types/StoreItem';
import StoreItemCard from '../components/store/StoreItemCard';

const StorePage = () => {
  const [items, setItems] = useState<StoreItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const data = await getStoreItems();
        setItems(data);
        setError(null);
      } catch (err) {
        setError('Failed to load store items');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-slate-400">Loading store items...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Store</h1>
      {items.length === 0 ? (
        <div className="text-center">
          <p className="text-slate-400">No items available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <StoreItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default StorePage;

