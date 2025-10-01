import { useCart } from '@/contexts/CartContext';
import { ShoppingCart, Package, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const StickyCartBar = () => {
  const { getTotalPrice, getTotalItems, getSelectedCategoriesCount } = useCart();

  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();
  const categoriesCount = getSelectedCategoriesCount();

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

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs opacity-90">Grand Total</p>
              <p className="text-lg font-bold">
                {totalPrice > 0 ? `₹${totalPrice.toFixed(2)}` : '₹0.00'}
              </p>
            </div>
            <Button 
              asChild 
              variant="secondary" 
              size="sm" 
              className="bg-white text-primary hover:bg-white/90"
              disabled={totalItems === 0}
            >
              <Link to="/cart">
                {totalItems > 0 ? 'View Cart' : 'Cart Empty'}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StickyCartBar;
