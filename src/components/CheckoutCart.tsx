import { useState, useMemo } from "react";
import { useEffect } from "react";
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
import { api, Product } from "@/lib/supabase";
import StickyCartBar from "@/components/StickyCartBar";
import { useCart } from "@/contexts/CartContext";

// Import the StickyCartBar component

interface CartItem extends Product {
  quantity: number;
}

interface CustomerDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
}

const CheckoutCart = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [localQuantities, setLocalQuantities] = useState<Record<string, number>>({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const { toast } = useToast();
  const { items: cartItems, addToCart, updateQuantity: updateCartQuantity, removeFromCart, getTotalPrice, getTotalItems, clearCart, getSelectedCategoriesCount } = useCart();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await api.getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
      toast({
        title: "Error",
        description: "Failed to load products. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateLocalQuantity = (productId: string, change: number) => {
    setLocalQuantities(prev => {
      const current = prev[productId] || 0;
      const newQuantity = Math.max(0, current + change);
      if (newQuantity === 0) {
        const { [productId]: removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [productId]: newQuantity };
    });
  };

  const setLocalQuantity = (productId: string, quantity: number) => {
    const numQuantity = Math.max(0, Math.floor(quantity));
    if (numQuantity === 0) {
      const { [productId]: removed, ...rest } = localQuantities;
      setLocalQuantities(rest);
    } else {
      setLocalQuantities(prev => ({ ...prev, [productId]: numQuantity }));
    }
  };

  const getLocalTotalItems = () => {
    return Object.values(localQuantities).reduce((total, quantity) => total + quantity, 0);
  };

  const getLocalTotalPrice = () => {
    return Object.entries(localQuantities).reduce((total, [productId, quantity]) => {
      const product = products.find(p => p.id === productId);
      return total + (product ? product.discount_price * quantity : 0);
    }, 0);
  };

  const getLocalCategoriesCount = () => {
    const selectedCategories = new Set();
    Object.entries(localQuantities).forEach(([productId, quantity]) => {
      if (quantity > 0) {
        const product = products.find(p => p.id === productId);
        if (product && product.category) {
          selectedCategories.add(product.category.name);
        }
      }
    });
    return selectedCategories.size;
  };

  const calculateDiscount = (originalPrice: number, discountPrice: number) => {
    return Math.round(((originalPrice - discountPrice) / originalPrice) * 100);
  };

  const handleAddToCart = () => {
    const totalItems = getLocalTotalItems();
    if (totalItems === 0) {
      toast({
        title: "No items selected",
        description: "Please select quantities for the products you want to purchase",
        variant: "destructive",
      });
      return;
    }

    Object.entries(localQuantities).forEach(([productId, quantity]) => {
      const product = products.find(p => p.id === productId);
      if (product && quantity > 0) {
        addToCart(product, quantity);
      }
    });

    // Don't clear local quantities - keep them for user reference
    setIsCartOpen(true);
    
    toast({
      title: "Added to cart!",
      description: `${totalItems} items added to your cart`,
    });
  };

  const handleBookNow = async () => {
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

    try {
      let customer = await api.getCustomerByEmail(customerDetails.email);
      if (!customer) {
        customer = await api.createCustomer({
          name: customerDetails.name,
          email: customerDetails.email,
          phone: customerDetails.phone,
          address: customerDetails.address,
        });
      }

      const order = await api.createOrder({
        customer_id: customer.id,
        total_amount: getTotalPrice(),
        status: 'pending',
      });

      const orderItems = cartItems.map(item => ({
        order_id: order.id,
        product_id: item.product.id,
        quantity: item.quantity,
        unit_price: item.product.discount_price,
        total_price: item.product.discount_price * item.quantity,
      }));

      await api.createOrderItems(orderItems);

      for (const item of cartItems) {
        const newStock = item.product.stock_quantity - item.quantity;
        await api.updateProductStock(item.product.id, Math.max(0, newStock));
      }

      toast({
        title: "Order confirmed!",
        description: `Your order has been placed successfully!`,
      });

      clearCart();
      setCustomerDetails({ name: "", email: "", phone: "", address: "" });
      setLocalQuantities({});
      setIsCartOpen(false);
      
      // Reload products to refresh stock quantities
      await loadProducts();
      
      // Force a page refresh to ensure clean state
      window.location.reload();
    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: "Order failed",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: keyof CustomerDetails, value: string) => {
    setCustomerDetails(prev => ({ ...prev, [field]: value }));
  };

  const productsByCategory = useMemo(() => {
    const grouped = products.reduce((acc, product) => {
      const categoryName = product.category?.name || 'Uncategorized';
      if (!acc[categoryName]) {
        acc[categoryName] = [];
      }
      acc[categoryName].push(product);
      return acc;
    }, {} as Record<string, Product[]>);
    return grouped;
  }, [products]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-background py-8 pb-32">
        <div className="container mx-auto px-4">
          {/* Mobile Card View - Grouped by Category */}
          <div className="block md:hidden space-y-8 mb-8">
            {Object.entries(productsByCategory).map(([categoryName, categoryProducts]) => (
              <div key={categoryName} className="space-y-4">
                <h2 className="text-2xl font-bold capitalize bg-primary text-primary-foreground p-4 rounded-lg text-center">
                  {categoryName}
                </h2>
                {categoryProducts.map((product) => {
                  const discount = calculateDiscount(product.original_price, product.discount_price);
                  const quantity = localQuantities[product.id] || 0;

                  return (
                    <Card key={product.id} className="card-product">
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-20 h-20 object-cover rounded-md flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm mb-1">{product.name}</h3>
                            <p className="text-xs text-muted-foreground mb-2">{product.content}</p>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="price-original text-xs">₹{product.original_price}</span>
                              <span className="price-current text-sm">₹{product.discount_price}</span>
                              <Badge className="badge-discount text-xs">{discount}% OFF</Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateLocalQuantity(product.id, -1)}
                                className="h-6 w-6 p-0"
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <Input
                                type="number"
                                value={quantity}
                                onChange={(e) => setLocalQuantity(product.id, parseInt(e.target.value) || 0)}
                                className="input-quantity h-6 w-12 text-xs"
                                min="0"
                              />
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateLocalQuantity(product.id, 1)}
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
            ))}
          </div>

          {/* Desktop Table View - Grouped by Category */}
          <div className="hidden md:block space-y-8 mb-8">
            {Object.entries(productsByCategory).map(([categoryName, categoryProducts]) => (
              <div key={categoryName} className="space-y-4">
                <h2 className="text-2xl font-bold capitalize bg-primary text-primary-foreground p-4 rounded-lg text-center">
                  {categoryName}
                </h2>
                <div className="overflow-x-auto">
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
                      {categoryProducts.map((product, index) => {
                        const discount = calculateDiscount(product.original_price, product.discount_price);
                        const quantity = localQuantities[product.id] || 0;

                        return (
                          <tr key={product.id} className={index % 2 === 0 ? "bg-background" : "bg-muted/30"}>
                            <td className="border border-border p-3">
                              <img
                                src={product.image_url}
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
                                <span className="price-original">₹{product.original_price}</span>
                                <Badge className="badge-discount text-xs">{discount}% OFF</Badge>
                              </div>
                            </td>
                            <td className="border border-border p-3">
                              <span className="price-current">₹{product.discount_price}</span>
                            </td>
                            <td className="border border-border p-3">
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateLocalQuantity(product.id, -1)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                                <Input
                                  type="number"
                                  value={quantity}
                                  onChange={(e) => setLocalQuantity(product.id, parseInt(e.target.value) || 0)}
                                  className="input-quantity"
                                  min="0"
                                />
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateLocalQuantity(product.id, 1)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                            <td className="border border-border p-3">
                              <span className="text-lg font-bold text-primary">
                                ₹{(product.discount_price * quantity).toFixed(2)}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>

          {/* Single Add to Cart Button */}
          <div className="flex justify-center">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <Button
                onClick={handleAddToCart}
                size="xl"
                variant="hero"
                className="min-w-[200px]"
                disabled={getLocalTotalItems() === 0}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart ({getLocalTotalItems()})
              </Button>
              
              {getLocalTotalItems() > 0 && (
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Selected Total:</p>
                  <p className="text-lg font-bold text-primary">
                    ₹{Object.entries(localQuantities).reduce((total, [productId, quantity]) => {
                      const product = products.find(p => p.id === productId);
                      return total + (product ? product.discount_price * quantity : 0);
                    }, 0).toFixed(2)}
                  </p>
                </div>
              )}
            </div>
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
                {cartItems.length > 0 ? (
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <Card key={item.id} className="p-4">
                        <div className="flex gap-3">
                          <img
                            src={item.product.image_url}
                            alt={item.product.name}
                            className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm">{item.product.name}</h4>
                            <p className="text-xs text-muted-foreground">{item.product.content}</p>
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                                  className="h-6 w-6 p-0"
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                                  className="h-6 w-6 p-0"
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-bold text-primary">
                                  ₹{(item.product.discount_price * item.quantity).toFixed(2)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}

                    <Separator />

                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-primary">₹{getTotalPrice().toFixed(2)}</span>
                    </div>

                    <Separator />

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
      {/* Footer Navigation */}
      <StickyCartBar 
        localQuantities={localQuantities}
        products={products}
        getLocalTotalItems={getLocalTotalItems}
        getLocalTotalPrice={getLocalTotalPrice}
        getLocalCategoriesCount={getLocalCategoriesCount}
      />
    </>
  );
};

export default CheckoutCart;
