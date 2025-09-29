import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Star, Zap, Gift, Flower } from "lucide-react";
import { api, Category } from "@/lib/supabase";
import Navigation from "./Navigation";

// Import images
import heroBanner from "@/assets/hero-banner.jpg";
import sparklersCategory from "@/assets/sparklers-category.jpg";
import rocketsCategory from "@/assets/rockets-category.jpg";
import giftBoxesCategory from "@/assets/gift-boxes-category.jpg";
import flowerPotsCategory from "@/assets/flower-pots-category.jpg";

const HomePage = () => {
  const [categories, setCategories] = useState([
    {
      id: "sparklers",
      name: "Sparklers",
      image: sparklersCategory,
      icon: Star,
      description: "Beautiful sparklers for celebrations",
      path: "/products?category=sparklers",
    },
    {
      id: "rockets",
      name: "Rockets",
      image: rocketsCategory,
      icon: Zap,
      description: "High-flying aerial fireworks",
      path: "/products?category=rockets",
    },
    {
      id: "gift-boxes",
      name: "Gift Boxes",
      image: giftBoxesCategory,
      icon: Gift,
      description: "Perfect firework gift sets",
      path: "/products?category=gift-boxes",
    },
    {
      id: "flower-pots",
      name: "Flower Pots",
      image: flowerPotsCategory,
      icon: Flower,
      description: "Ground-based colorful fountains",
      path: "/products?category=flower-pots",
    },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(false); // Keep static categories for now
      // Uncomment below to load from database
      // const data = await api.getCategories();
      // setCategories(data.map(cat => ({
      //   id: cat.id,
      //   name: cat.name.charAt(0).toUpperCase() + cat.name.slice(1),
      //   image: cat.image_url || sparklersCategory,
      //   icon: Star, // You can map different icons based on category
      //   description: cat.description || `Premium ${cat.name} for celebrations`,
      //   path: `/products?category=${cat.name}`,
      // })));
    } catch (error) {
      console.error('Error loading categories:', error);
      setLoading(false);
    }
  };

  return (
    <>
      <Navigation cartItemCount={3} />
      <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroBanner})` }}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <Badge className="mb-4 bg-discount text-discount-foreground text-lg px-4 py-2 font-bold animate-pulse">
            🎆 80% OFF SPECIAL DISCOUNT! 🎆
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Light Up Your Celebrations
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-gray-200">
            Premium fireworks and sparklers for unforgettable moments
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="xl" asChild>
              <Link to="/products">
                Shop Now <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            
            <Button variant="discount" size="xl" asChild>
              <Link to="/products?offer=true">
                Check Offers 🔥
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-foreground">
              Shop by Category
            </h2>
            <p className="text-xl text-muted-foreground">
              Discover our premium collection of fireworks and celebration essentials
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Card key={category.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4">
                        <div className="bg-primary text-primary-foreground p-2 rounded-full">
                          <IconComponent className="h-5 w-5" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2 text-foreground">
                        {category.name}
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        {category.description}
                      </p>
                      <Button variant="outline" asChild className="w-full">
                        <Link to={category.path}>
                          Explore {category.name}
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-foreground">
              Why Choose FireworkShop?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary text-primary-foreground w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
              <p className="text-muted-foreground">Only the finest fireworks from trusted manufacturers</p>
            </div>

            <div className="text-center">
              <div className="bg-success text-success-foreground w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-muted-foreground">Quick and safe delivery to your doorstep</p>
            </div>

            <div className="text-center">
              <div className="bg-discount text-discount-foreground w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Best Prices</h3>
              <p className="text-muted-foreground">Unbeatable prices with amazing discounts</p>
            </div>
          </div>
        </div>
      </section>
      </div>
    </>
  );
};

export default HomePage;