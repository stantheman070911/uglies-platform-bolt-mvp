import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MaterialButton } from '@/components/ui/MaterialButton';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ProductCard } from '@/components/ui/MaterialCard';
import { GroupCard } from '@/components/ui/MaterialCard';
import { StatsService } from '@/services/stats';
import { ProductService, ProductWithDetails } from '@/services/products';
import { GroupBuyingService, FullGroupBuy } from '@/services/groups';
import { 
  Sprout, Users, ShoppingBag, 
  Globe, ArrowRight, Star, Truck, Heart,
  MapPin, Plus, Search, Filter, Menu, User,
  Home, Bell, Settings, Package
} from 'lucide-react';

interface PageStats {
  totalFarmers: number;
  totalGroups: number;
  amountSaved: string;
}

const HomePage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<PageStats>({
    totalFarmers: 0,
    totalGroups: 0,
    amountSaved: "$0"
  });
  const [featuredProducts, setFeaturedProducts] = useState<ProductWithDetails[]>([]);
  const [activeGroups, setActiveGroups] = useState<FullGroupBuy[]>([]);

  useEffect(() => {
    loadPageData();

    // Subscribe to group changes
    const subscription = GroupBuyingService.subscribeToAllGroupChanges(() => {
      loadActiveGroups();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadPageData = async () => {
    setLoading(true);
    try {
      // Load all data in parallel
      const [farmersResult, groupsResult, savingsResult, productsResult, groupsDataResult] = await Promise.all([
        StatsService.getTotalFarmers(),
        StatsService.getTotalGroups(),
        StatsService.getAmountSaved(),
        ProductService.getFeaturedProducts(3),
        GroupBuyingService.getActiveGroups(undefined, 3)
      ]);

      setStats({
        totalFarmers: farmersResult.count,
        totalGroups: groupsResult.count,
        amountSaved: savingsResult.amount
      });

      if (productsResult.success && productsResult.data) {
        setFeaturedProducts(productsResult.data);
      }

      if (groupsDataResult.success && groupsDataResult.data) {
        setActiveGroups(groupsDataResult.data);
      }
    } catch (error) {
      console.error('Error loading homepage data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadActiveGroups = async () => {
    try {
      const result = await GroupBuyingService.getActiveGroups(undefined, 3);
      if (result.success && result.data) {
        setActiveGroups(result.data);
      }
    } catch (error) {
      console.error('Error loading active groups:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner message="Loading..." />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative -mt-6 bg-green-700 py-16 px-4 sm:px-6 lg:px-8 rounded-b-3xl">
        <div className="absolute inset-0 overflow-hidden rounded-b-3xl">
          <div className="absolute inset-0 bg-gradient-to-r from-green-800 to-green-600 opacity-90"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-white space-y-6">
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
              Fresh Produce, <br />
              <span className="text-yellow-300">Fair Prices</span> <br />
              For Everyone
            </h1>
            <p className="text-green-50 text-lg max-w-xl">
              Join {stats.totalFarmers} farmers and save through group buying power. Our community has already saved {stats.amountSaved} together!
            </p>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
              <Link 
                to="/products" 
                className="btn-primary bg-yellow-600 hover:bg-yellow-700 inline-flex items-center justify-center"
              >
                Browse Products
                <ShoppingBag size={18} className="ml-2" />
              </Link>
              <Link 
                to="/groups" 
                className="btn-outline border-white text-white hover:bg-white hover:bg-opacity-10 inline-flex items-center justify-center"
              >
                Join a Group Buy
                <Users size={18} className="ml-2" />
              </Link>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 text-white">
              <Users className="w-8 h-8 mb-2" />
              <div className="text-3xl font-bold mb-1">{stats.totalGroups}</div>
              <div className="text-green-100">Active Groups</div>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 text-white">
              <Sprout className="w-8 h-8 mb-2" />
              <div className="text-3xl font-bold mb-1">{stats.totalFarmers}</div>
              <div className="text-green-100">Local Farmers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Active Group Buys */}
      <section className="py-12 bg-neutral-100 rounded-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Active Group Buys</h2>
            <Link 
              to="/groups" 
              className="text-green-600 hover:text-green-700 font-medium flex items-center"
            >
              View All
              <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeGroups.length === 0 ? (
              <div className="col-span-3 text-center py-12">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Groups</h3>
                <p className="text-gray-600 mb-6">Be the first to start a group buy!</p>
                <MaterialButton
                  href="/groups/create"
                  iconType="plus"
                  icon="leading"
                  color="secondary"
                >
                  Start a Group Buy
                </MaterialButton>
              </div>
            ) : (
              activeGroups.map((group) => (
                <GroupCard
                  key={group.id}
                  group={group}
                  onJoin={() => {}}
                  onViewDetails={() => {}}
                />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
            <p className="mt-4 text-xl text-gray-600">
              Discover quality goods from local farmers
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.length === 0 ? (
              <div className="col-span-3 text-center py-12">
                <Sprout className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Featured Products</h3>
                <p className="text-gray-600">Check back soon for fresh produce!</p>
              </div>
            ) : (
              featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onViewDetails={() => {}}
                />
              ))
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-yellow-100 rounded-2xl py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-yellow-900 mb-6">
            Ready to Transform How You Buy and Sell Produce?
          </h2>
          <p className="text-lg text-yellow-800 mb-8 max-w-2xl mx-auto">
            Join thousands of farmers and consumers already using UGLIES to create a more sustainable food system.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link 
              to="/register?role=farmer" 
              className="btn-primary bg-green-600 hover:bg-green-700"
            >
              Join as a Farmer
            </Link>
            <Link 
              to="/register?role=customer" 
              className="btn-secondary"
            >
              Join as a Consumer
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;