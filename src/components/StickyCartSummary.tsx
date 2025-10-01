import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Package, Grid3x3 } from "lucide-react";

interface StickyCartSummaryProps {
  totalPrice: number;
  totalProducts: number;
  totalCategories: number;
}

const StickyCartSummary = ({ totalPrice, totalProducts, totalCategories }: StickyCartSummaryProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <Card className="border-primary/20">
          <CardContent className="p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">Total Price</span>
                </div>
                <div className="text-2xl font-bold text-primary">₹{totalPrice.toFixed(2)}</div>
              </div>

              <div className="flex flex-col items-center gap-2 border-x border-border">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">Products</span>
                </div>
                <div className="text-2xl font-bold">
                  {totalProducts}
                  {totalProducts > 0 && (
                    <Badge variant="secondary" className="ml-2 text-xs">
                      Selected
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2">
                  <Grid3x3 className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">Categories</span>
                </div>
                <div className="text-2xl font-bold">
                  {totalCategories}
                  {totalCategories > 0 && (
                    <Badge variant="secondary" className="ml-2 text-xs">
                      Active
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StickyCartSummary;
