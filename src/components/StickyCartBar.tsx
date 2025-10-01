import { useCart } from '@/contexts/CartContext';
import { ShoppingCart, Package, Layers } from 'lucide-react';
import { Product } from '@/lib/supabase';

interface StickyCartBarProps {
  localQuantities?: Record<string, number>;
  products?: Product[];
  getLocalTotalItems?: () => number;
  getLocalTotalPrice?: () => number;
  getLocalCategoriesCount?: () => number;
}

const StickyCartBar = ({ 
  localQuantities = {}, 
  products = [], 
  getLocalTotalItems, 
  getLocalTotalPrice, 
  getLocalCategoriesCount 
}: StickyCartBarProps) => {
  const { getTotalPrice, getTotalItems, getSelectedCategoriesCount } = useCart();

  // Use local selection data if available, otherwise use cart data
  const hasLocalSelections = Object.keys(localQuantities).length > 0 && getLocalTotalItems && getLocalTotalPrice && getLocalCategoriesCount;
  
  const totalPrice = hasLocalSelections ? getLocalTotalPrice() : getTotalPrice();
  const totalItems = hasLocalSelections ? getLocalTotalItems() : getTotalItems();
  const categoriesCount = hasLocalSelections ? getLocalCategoriesCount() : getSelectedCategoriesCount();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-primary text-primary-foreground shadow-lg z-50 border-t-4 border-primary-foreground/20 min-h-[80px]">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4 flex-1">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              <div>
                <p className="text-xs opacity-90">Items</p>
                <p className="text-sm font-bold">{totalItems}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5" />
              <div>
                <p className="text-xs opacity-90">Categories</p>
                <p className="text-sm font-bold">{categoriesCount}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              <div>
                <p className="text-xs opacity-90">Total</p>
                <p className="text-sm font-bold">
                  {totalPrice > 0 ? `₹${totalPrice.toFixed(2)}` : '₹0.00'}
                </p>
              </div>
            </div>
          </div>

          <div className="text-right">
            <p className="text-xs opacity-90">{hasLocalSelections ? 'Selected Total' : 'Grand Total'}</p>
            <p className="text-lg font-bold">
              {totalPrice > 0 ? `₹${totalPrice.toFixed(2)}` : '₹0.00'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StickyCartBar;
