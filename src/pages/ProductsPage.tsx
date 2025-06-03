import React, { useState, useEffect } from 'react';
import { MaterialButton } from '@/components/ui/MaterialButton';
import { MaterialInput } from '@/components/ui/MaterialInput';
import { ProductCard } from '@/components/ui/MaterialCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ProductService } from '@/services/products';
import { useAuth } from '@/hooks/useAuth';
import { Search, Filter, Grid, List, Plus } from 'lucide-react';
import type { Product } from '@/types/products';

interface ProductFilters {
  category: string;
  region: string;
  quality: string;
  priceRange: string;
  searchQuery: string;
}

const ProductsPage: React.FC = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<ProductFilters>({
    category: '',
    region: '',
    quality: '',
    priceRange: '',
    searchQuery: ''
  });

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'vegetables', label: '🥬 Vegetables' },
    { value: 'fruits', label: '🍎 Fruits' },
    { value: 'grains', label: '🌾 Grains & Legumes' },
    { value: 'herbs', label: '🌿 Herbs & Spices' }
  ];

  const regions = [
    { value: '', label: 'All Regions' },
    { value: 'local_area', label: '🏡 Local Area' },
    { value: 'nearby', label: '🌱 Nearby Farms' },
    { value: 'urban_farming', label: '🏢 Urban Agriculture' },
    { value: 'organic_certified', label: '🌿 Certified Organic' },
    { value: 'heritage_farms', label: '🌾 Heritage Varieties' }
  ];

  const qualityTiers = [
    { value: '', label: 'All Quality' },
    { value: 'premium', label: '🏆 Premium Grade' },
    { value: 'standard', label: '✓ Standard Grade' },
    { value: 'cosmetic', label: '💝 Cosmetic Seconds' }
  ];

  useEffect(() => {
    loadProducts();
  }, [filters]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const result = await ProductService.getProducts({
        category: filters.category || undefined,
        region: filters.region || undefined,
        quality: filters.quality || undefined
      });

      if (result.success) {
        let filteredProducts = result.data;
        
        // Apply search filter
        if (filters.searchQuery) {
          const query = filters.searchQuery.toLowerCase();
          filteredProducts = filteredProducts.filter(product =>
            product.name.toLowerCase().includes(query) ||
            product.description?.toLowerCase().includes(query)
          );
        }

        // Apply price range filter
        if (filters.priceRange) {
          const [min, max] = filters.priceRange.split('-').map(Number);
          filteredProducts = filteredProducts.filter(product =>
            product.price >= min && (!max || product.price <= max)
          );
        }

        setProducts(filteredProducts);
      }
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof ProductFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      region: '',
      quality: '',
      priceRange: '',
      searchQuery: ''
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-surface-900">Fresh Products</h1>
          <p className="text-surface-600 mt-1">
            Discover quality produce from local farmers
          </p>
        </div>
        
        {user?.role === 'farmer' && (
          <MaterialButton
            href="/products/create"
            iconType="plus"
            icon="leading"
            color="secondary"
          >
            Add Product
          </MaterialButton>
        )}
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-surface-200 p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <MaterialInput
              placeholder="Search products, farmers, or descriptions..."
              value={filters.searchQuery}
              onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
              startIcon={<Search className="w-5 h-5" />}
              fullWidth
            />
          </div>

          <div className="flex items-center gap-2">
            <MaterialButton
              variant="outlined"
              onClick={() => setShowFilters(!showFilters)}
              iconType="filter"
              icon="leading"
            >
              Filters
            </MaterialButton>

            <div className="border-l border-surface-200 pl-2">
              <MaterialButton
                variant={viewMode === 'grid' ? 'filled' : 'outlined'}
                onClick={() => setViewMode('grid')}
                iconType="custom"
                icon="only"
                customIcon={<Grid className="w-4 h-4" />}
              />
              <MaterialButton
                variant={viewMode === 'list' ? 'filled' : 'outlined'}
                onClick={() => setViewMode('list')}
                iconType="custom"
                icon="only"
                customIcon={<List className="w-4 h-4" />}
                className="ml-1"
              />
            </div>
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-surface-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="form-select"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>

              <select
                value={filters.region}
                onChange={(e) => handleFilterChange('region', e.target.value)}
                className="form-select"
              >
                {regions.map(region => (
                  <option key={region.value} value={region.value}>{region.label}</option>
                ))}
              </select>

              <select
                value={filters.quality}
                onChange={(e) => handleFilterChange('quality', e.target.value)}
                className="form-select"
              >
                {qualityTiers.map(quality => (
                  <option key={quality.value} value={quality.value}>{quality.label}</option>
                ))}
              </select>

              <select
                value={filters.priceRange}
                onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                className="form-select"
              >
                <option value="">All Prices</option>
                <option value="0-5">Under $5</option>
                <option value="5-15">$5 - $15</option>
                <option value="15-30">$15 - $30</option>
                <option value="30-">Over $30</option>
              </select>
            </div>

            {Object.values(filters).some(Boolean) && (
              <div className="mt-4 flex justify-end">
                <MaterialButton
                  variant="text"
                  onClick={clearFilters}
                  size="small"
                >
                  Clear all filters
                </MaterialButton>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <LoadingSpinner key={i} variant="skeleton" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🌱</div>
          <h3 className="text-lg font-semibold text-surface-900 mb-2">
            No products found
          </h3>
          <p className="text-surface-600 mb-6">
            Try adjusting your filters or search terms
          </p>
          <MaterialButton
            variant="outlined"
            onClick={clearFilters}
          >
            Clear filters
          </MaterialButton>
        </div>
      ) : (
        <div className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-4'
        }>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onLike={() => {}}
              onShare={() => {}}
              onViewDetails={() => {}}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsPage;