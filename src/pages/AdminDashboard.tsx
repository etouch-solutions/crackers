import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, ShoppingCart, DollarSign, Users } from "lucide-react";
import ProductManagement from "@/components/admin/ProductManagement";
import OrderManagement from "@/components/admin/OrderManagement";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { api } from "@/lib/supabase";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const [products, orders] = await Promise.all([
        api.getProducts(),
        api.getAllOrders(),
      ]);

      const revenue = orders.reduce((sum, order) => sum + order.total_amount, 0);
      const uniqueCustomers = new Set(orders.map(order => order.customer_id)).size;

      setStats({
        totalProducts: products.length,
        totalOrders: orders.length,
        totalRevenue: revenue,
        totalCustomers: uniqueCustomers,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Revenue",
      value: `₹${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      title: "Customers",
      value: stats.totalCustomers,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Main Content */}
        <div className="flex-1 lg:ml-64">
          <div className="p-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage your fireworks store</p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsContent value="overview" className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {statsCards.map((stat, index) => {
                    const IconComponent = stat.icon;
                    return (
                      <Card key={index} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">
                                {stat.title}
                              </p>
                              <p className="text-2xl font-bold text-foreground">
                                {loading ? "..." : stat.value}
                              </p>
                            </div>
                            <div className={`p-3 rounded-full ${stat.bgColor}`}>
                              <IconComponent className={`h-6 w-6 ${stat.color}`} />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button
                        onClick={() => setActiveTab("products")}
                        className="p-4 text-left border rounded-lg hover:bg-accent transition-colors"
                      >
                        <Package className="h-8 w-8 text-primary mb-2" />
                        <h3 className="font-semibold">Manage Products</h3>
                        <p className="text-sm text-muted-foreground">
                          Add, edit, or remove products from your catalog
                        </p>
                      </button>
                      <button
                        onClick={() => setActiveTab("orders")}
                        className="p-4 text-left border rounded-lg hover:bg-accent transition-colors"
                      >
                        <ShoppingCart className="h-8 w-8 text-primary mb-2" />
                        <h3 className="font-semibold">Manage Orders</h3>
                        <p className="text-sm text-muted-foreground">
                          View and update order status and details
                        </p>
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="products">
                <ProductManagement onStatsUpdate={loadStats} />
              </TabsContent>

              <TabsContent value="orders">
                <OrderManagement onStatsUpdate={loadStats} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;