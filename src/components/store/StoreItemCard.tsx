import type { StoreItem } from '../../types/StoreItem';

interface StoreItemCardProps {
  item: StoreItem;
}

const StoreItemCard = ({ item }: StoreItemCardProps) => {
  const handlePurchase = () => {
    // Stub for purchase functionality
    console.log(`Purchase clicked for ${item.name}`);
  };

  return (
    <div className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700 hover:border-slate-600 transition-colors">
      {item.imageUrl && (
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-slate-100">{item.name}</h3>
          <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded">
            {item.category}
          </span>
        </div>
        <p className="text-slate-400 text-sm mb-4">{item.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-green-400">${item.price.toFixed(2)}</span>
          <button
            onClick={handlePurchase}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
          >
            Purchase
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoreItemCard;

