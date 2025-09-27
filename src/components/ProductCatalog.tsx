import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Minus, ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Import product images
import sparkler10cmElectric from "@/assets/sparkler-10cm-electric.jpg";
import sparkler10cmColor from "@/assets/sparkler-10cm-color.jpg";
import sparkler12cmElectric from "@/assets/sparkler-12cm-electric.jpg";
import sparkler15cmGreen from "@/assets/sparkler-15cm-green.jpg";
import sparkler15cmRed from "@/assets/sparkler-15cm-red.jpg";

interface Product {
  id: number;
  image: string;
  name: string;
  content: string;
  originalPrice: number;
  discountPrice: number;
  category: string;
}

const products: Product[] = [
  {
    id: 1,
    image: sparkler10cmElectric,
    name: "10 Cm Electric",
    content: "1 Box (10 Pcs)",
    originalPrice: 29.0,
    discountPrice: 15.5,
    category: "sparklers",
  },
  {
    id: 2,
    image: sparkler10cmColor,
    name: "10 Cm Colour",
    content: "1 Box (10 Pcs)",
    originalPrice: 34.0,
    discountPrice: 18.5,
    category: "sparklers",
  },
  {
    id: 3,
    image: sparkler12cmElectric,
    name: "12 Cm Electric",
    content: "1 Box (10 Pcs)",
    originalPrice: 42.0,
    discountPrice: 19.0,
    category: "sparklers",
  },
  {
    id: 4,
    image: sparkler12cmElectric,
    name: "12 Cm Colour",
    content: "1 Box (10 Pcs)",
    originalPrice: 105.0,
    discountPrice: 21.0,
    category: "sparklers",
  },
  {
    id: 5,
    image: sparkler15cmGreen,
    name: "15 Cm Electric",
    content: "1 Box (10 Pcs)",
    originalPrice: 150.0,
    discountPrice: 30.0,
    category: "sparklers",
  },
  {
    id: 6,
    image: sparkler15cmGreen,
    name: "15 Cm Colour",
    content: "1 Box (10 Pcs)",
    originalPrice: 155.0,
    discountPrice: 31.0,
    category: "sparklers",
  },
  {
    id: 7,
    image: sparkler15cmGreen,
    name: "15 Cm Green",
    content: "1 Box (10 Pcs)",
    originalPrice: 190.0,
    discountPrice: 38.0,
    category: "sparklers",
  },
  {
    id: 8,
    image: sparkler15cmRed,
    name: "15 Cm Red",
    content: "1 Box (10 Pcs)",
    originalPrice: 205.0,
    discountPrice: 41.0,
    category: "sparklers",
  },
];

const ProductCatalog = () => {
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const { toast } = useToast();

  const updateQuantity = (productId: number, change: number) => {
    setQuantities(prev => {
      const current = prev[productId] || 0;
      const newQuantity = Math.max(0, current + change);
      return { ...prev, [productId]: newQuantity };
    });
  };

  const setQuantity = (productId: number, quantity: number) => {
    const numQuantity = Math.max(0, Math.floor(quantity));
    setQuantities(prev => ({ ...prev, [productId]: numQuantity }));
  };

  const calculateTotal = (product: Product) => {
    const qty = quantities[product.id] || 0;
    return (product.discountPrice * qty).toFixed(2);
  };

  const calculateDiscount = (originalPrice: number, discountPrice: number) => {
    return Math.round(((originalPrice - discountPrice) / originalPrice) * 100);
  };

  const addToCart = (product: Product) => {
    const quantity = quantities[product.id] || 0;
    if (quantity === 0) {
      toast({
        title: "Please select quantity",
        description: "Enter a quantity before adding to cart",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Added to cart!",
      description: `${quantity}x ${product.name} added to your cart`,
    });

    // In a real app, you would add this to a cart state/context
    console.log(`Added ${quantity}x ${product.name} to cart`);
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-discount text-discount-foreground p-4 rounded-lg mb-6 text-center">
            <h2 className="text-2xl font-bold">SPARKLERS (80% DISCOUNT)</h2>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="block md:hidden space-y-4">
          {products.map((product) => {
            const discount = calculateDiscount(product.originalPrice, product.discountPrice);
            const quantity = quantities[product.id] || 0;
            
            return (
              <Card key={product.id} className="card-product">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-20 h-20 object-cover rounded-md flex-shrink-0"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm mb-1">{product.name}</h3>
                      <p className="text-xs text-muted-foreground mb-2">{product.content}</p>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <span className="price-original text-xs">₹{product.originalPrice}</span>
                        <span className="price-current text-sm">₹{product.discountPrice}</span>
                        <Badge className="badge-discount text-xs">{discount}% OFF</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(product.id, -1)}
                            className="h-6 w-6 p-0"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          
                          <Input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(product.id, parseInt(e.target.value) || 0)}
                            className="input-quantity h-6 w-12 text-xs"
                            min="0"
                          />
                          
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(product.id, 1)}
                            className="h-6 w-6 p-0"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-sm font-bold text-primary">₹{calculateTotal(product)}</div>
                          <Button
                            size="sm"
                            onClick={() => addToCart(product)}
                            className="mt-1 h-6 text-xs"
                          >
                            <ShoppingCart className="h-3 w-3 mr-1" />
                            Add
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse border border-border rounded-lg overflow-hidden">
            <thead>
              <tr className="table-header">
                <th className="border border-border p-3 text-left">Image</th>
                <th className="border border-border p-3 text-left">Product Name</th>
                <th className="border border-border p-3 text-left">Content</th>
                <th className="border border-border p-3 text-left">Actual Price</th>
                <th className="border border-border p-3 text-left">Price</th>
                <th className="border border-border p-3 text-left">Quantity</th>
                <th className="border border-border p-3 text-left">Total</th>
                <th className="border border-border p-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => {
                const discount = calculateDiscount(product.originalPrice, product.discountPrice);
                const quantity = quantities[product.id] || 0;
                
                return (
                  <tr key={product.id} className={index % 2 === 0 ? "bg-background" : "bg-muted/30"}>
                    <td className="border border-border p-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                    </td>
                    
                    <td className="border border-border p-3 font-medium">
                      {product.name}
                    </td>
                    
                    <td className="border border-border p-3 text-sm text-muted-foreground">
                      {product.content}
                    </td>
                    
                    <td className="border border-border p-3">
                      <div className="flex items-center gap-2">
                        <span className="price-original">₹{product.originalPrice}</span>
                        <Badge className="badge-discount text-xs">{discount}% OFF</Badge>
                      </div>
                    </td>
                    
                    <td className="border border-border p-3">
                      <span className="price-current">₹{product.discountPrice}</span>
                    </td>
                    
                    <td className="border border-border p-3">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(product.id, -1)}
                          className="h-8 w-8 p-0"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        
                        <Input
                          type="number"
                          value={quantity}
                          onChange={(e) => setQuantity(product.id, parseInt(e.target.value) || 0)}
                          className="input-quantity"
                          min="0"
                        />
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(product.id, 1)}
                          className="h-8 w-8 p-0"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                    
                    <td className="border border-border p-3">
                      <span className="text-lg font-bold text-primary">₹{calculateTotal(product)}</span>
                    </td>
                    
                    <td className="border border-border p-3">
                      <Button
                        onClick={() => addToCart(product)}
                        size="sm"
                        className="min-w-[100px]"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductCatalog;