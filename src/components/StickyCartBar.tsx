import { useCart } from '@/contexts/CartContext';
import { ShoppingCart, Package, Layers } from 'lucide-react';

const StickyCartBar = () => {
  const { getTotalPrice, getTotalItems, getSelectedCategoriesCount } = useCart();

  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();
  const categoriesCount = getSelectedCategoriesCount();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-primary text-primary-foreground shadow-lg z-50 border-t-4 border-primary-foreground/20">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              <div>
                <p className="text-xs opacity-90">Total Items</p>
                <p className="text-lg font-bold">{totalItems}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5" />
              <div>
                <p className="text-xs opacity-90">Categories</p>
                <p className="text-lg font-bold">{categoriesCount}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              <div>
                <p className="text-xs opacity-90">Total Price</p>
                <p className="text-lg font-bold">₹{totalPrice.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="text-right">
            <p className="text-sm opacity-90">Grand Total</p>
            <p className="text-2xl font-bold">₹{totalPrice.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StickyCartBar;
