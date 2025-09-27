import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { X, Plus, Minus, ShoppingCart } from "lucide-react";
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

interface CartItem extends Product {
  quantity: number;
}

interface CustomerDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
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

const CheckoutCart = () => {
  const [selectedProducts, setSelectedProducts] = useState<Record<number, number>>({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const { toast } = useToast();

  const updateQuantity = (productId: number, change: number) => {
    setSelectedProducts(prev => {
      const current = prev[productId] || 0;
      const newQuantity = Math.max(0, current + change);
      if (newQuantity === 0) {
        const { [productId]: removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [productId]: newQuantity };
    });
  };

  const setQuantity = (productId: number, quantity: number) => {
    const numQuantity = Math.max(0, Math.floor(quantity));
    if (numQuantity === 0) {
      const { [productId]: removed, ...rest } = selectedProducts;
      setSelectedProducts(rest);
    } else {
      setSelectedProducts(prev => ({ ...prev, [productId]: numQuantity }));
    }
  };

  const getCartItems = (): CartItem[] => {
    return Object.entries(selectedProducts)
      .map(([productId, quantity]) => {
        const product = products.find(p => p.id === parseInt(productId));
        return product ? { ...product, quantity } : null;
      })
      .filter((item): item is CartItem => item !== null);
  };

  const getTotalPrice = () => {
    return getCartItems().reduce((total, item) => total + (item.discountPrice * item.quantity), 0);
  };

  const getTotalItems = () => {
    return Object.values(selectedProducts).reduce((total, quantity) => total + quantity, 0);
  };

  const calculateDiscount = (originalPrice: number, discountPrice: number) => {
    return Math.round(((originalPrice - discountPrice) / originalPrice) * 100);
  };

  const handleAddToCart = () => {
    const totalItems = getTotalItems();
    if (totalItems === 0) {
      toast({
        title: "No items selected",
        description: "Please select quantities for the products you want to purchase",
        variant: "destructive",
      });
      return;
    }
    setIsCartOpen(true);
  };

  const handleBookNow = () => {
    const cartItems = getCartItems();
    if (cartItems.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add some items to your cart first",
        variant: "destructive",
      });
      return;
    }

    if (!customerDetails.name || !customerDetails.email || !customerDetails.phone || !customerDetails.address) {
      toast({
        title: "Missing details",
        description: "Please fill in all customer details to complete your booking",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Booking confirmed! 🎆",
      description: `Your order for ${getTotalItems()} items worth ₹${getTotalPrice().toFixed(2)} has been placed successfully!`,
    });

    // Reset form
    setSelectedProducts({});
    setCustomerDetails({ name: "", email: "", phone: "", address: "" });
    setIsCartOpen(false);
  };

  const handleInputChange = (field: keyof CustomerDetails, value: string) => {
    setCustomerDetails(prev => ({ ...prev, [field]: value }));
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
        <div className="block md:hidden space-y-4 mb-8">
          {products.map((product) => {
            const discount = calculateDiscount(product.originalPrice, product.discountPrice);
            const quantity = selectedProducts[product.id] || 0;
            
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
                      
                      <div className="flex items-center gap-2">
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
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto mb-8">
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
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => {
                const discount = calculateDiscount(product.originalPrice, product.discountPrice);
                const quantity = selectedProducts[product.id] || 0;
                
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
                      <span className="text-lg font-bold text-primary">
                        ₹{(product.discountPrice * quantity).toFixed(2)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Single Add to Cart Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleAddToCart}
            size="xl"
            variant="hero"
            className="min-w-[200px]"
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            Add to Cart ({getTotalItems()})
          </Button>
        </div>

        {/* Side Cart Sheet */}
        <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
          <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Your Cart ({getTotalItems()} items)
              </SheetTitle>
            </SheetHeader>

            <div className="mt-6 space-y-6">
              {/* Cart Items */}
              {getCartItems().length > 0 ? (
                <div className="space-y-4">
                  {getCartItems().map((item) => (
                    <Card key={item.id} className="p-4">
                      <div className="flex gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm">{item.name}</h4>
                          <p className="text-xs text-muted-foreground">{item.content}</p>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateQuantity(item.id, -1)}
                                className="h-6 w-6 p-0"
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateQuantity(item.id, 1)}
                                className="h-6 w-6 p-0"
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-bold text-primary">
                                ₹{(item.discountPrice * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}

                  <Separator />

                  {/* Total */}
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-primary">₹{getTotalPrice().toFixed(2)}</span>
                  </div>

                  <Separator />

                  {/* Customer Details Form */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Customer Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={customerDetails.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          placeholder="Enter your full name"
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={customerDetails.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          placeholder="Enter your email"
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={customerDetails.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          placeholder="Enter your phone number"
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="address">Address *</Label>
                        <Textarea
                          id="address"
                          value={customerDetails.address}
                          onChange={(e) => handleInputChange("address", e.target.value)}
                          placeholder="Enter your complete address"
                          className="mt-1"
                          rows={3}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Book Now Button */}
                  <Button
                    onClick={handleBookNow}
                    size="lg"
                    variant="hero"
                    className="w-full"
                  >
                    Book Now - ₹{getTotalPrice().toFixed(2)}
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Your cart is empty</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Add some products to get started
                  </p>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default CheckoutCart;