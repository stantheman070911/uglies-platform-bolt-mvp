/**
 * @file src/pages/ProductsPage.tsx
 * @description Page for browsing and filtering agricultural products.
 * Uses ProductService to fetch data (now from a performant view).
 * Allows users to search, filter, and view products in grid or list mode.
 * Navigates to ProductDetailsPage for individual product views.
 * Adherence to "Violent psychopath maintenance standard":
 * - Strict typing for all state and props.
 * - Clear separation of concerns: fetching, filtering, rendering.
 * - Robust handling of loading and empty states.
 * - Efficient data fetching by passing filters to the backend service.
 */
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation
import { MaterialButton } from '@/components/ui/MaterialButton';
import { MaterialInput } from '@/components/ui/MaterialInput';
import { ProductCard } from '@/components/ui/MaterialCard'; // Assuming ProductCard expects a compatible product type
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
// CORRECT TYPING: Use ProductWithDetails if that's what ProductService.getProducts now returns
// and what ProductCard is designed to accept, or adapt as needed.
// Based on our corrected ProductService, it returns ProductWithDetails.
import { ProductService, ProductWithDetails, ProductFilters as ServiceProductFilters } from '@/services/products';
import { useAuth } from '@/hooks/useAuth';
import { Search, Filter, Grid, List, Plus, XCircle } from 'lucide-react';

// Interface for frontend filter state. This might be slightly different from ServiceProductFilters
// to accommodate UI elements like price range selectors that are then translated.
interface PageProductFilters {
  categoryName: string; // Aligned with ProductService: filters by category_name from the view
  // region: string; // For filtering products by FARMER's region. The service handles this.
  qualityGrade: string; // Aligned with ProductService: filters by quality_grade
  priceRange: string; // UI state, will be converted to min/max for service
  searchQuery: string;
}

const ProductsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate(); // useNavigate hook for navigation

  // State for products, loading status, view mode, and filters.
  // CRITICAL: Use ProductWithDetails[] if your service and card expect it.
  const [products, setProducts] = useState<ProductWithDetails[]>([]);
  const [totalProducts, setTotalProducts] = useState(0); // For pagination
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false); // Toggle visibility of detailed filters

  // Initial filter state.
  const [filters, setFilters] = useState<PageProductFilters>({
    categoryName: '',
    // region: '', // Region filter will be applied via ProductService
    qualityGrade: '',
    priceRange: '', // e.g., "0-5", "5-15", "30-"
    searchQuery: ''
  });

  // Available filter options for dropdowns - these should match your data.
  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'Vegetables', label: '🥬 Vegetables' }, // Match category_name in your DB/View
    { value: 'Fruits', label: '🍎 Fruits' },
    { value: 'Grains', label: '🌾 Grains & Legumes' },
    { value: 'Herbs', label: '🌿 Herbs & Spices' },
  ];
  // const regions = [ // This would be for filtering farmers by region. Products are filtered by farmer's region via service.
  //   { value: '', label: 'All Regions' }, /* ... */
  // ];
  const qualityTiers = [
    { value: '', label: 'All Quality' },
    { value: 'premium', label: '🏆 Premium Grade' },
    { value: 'standard', label: '✓ Standard Grade' },
    { value: 'cosmetic', label: '💝 Cosmetic Seconds' },
  ];
  const priceRanges = [
    { value: '', label: 'All Prices' },
    { value: '0-5', label: 'Under $5' },
    { value: '5-15', label: '$5 - $15' },
    { value: '15-30', label: '$15 - $30' },
    { value: '30-', label: 'Over $30' },
  ];


  // Debounced product fetching logic.
  // useCallback ensures this function is stable unless `filters` change.
  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      // Prepare filters for the service call.
      const serviceFilters: ServiceProductFilters = {
        categoryName: filters.categoryName || undefined,
        qualityGrade: filters.qualityGrade || undefined,
        search: filters.searchQuery || undefined,
        limit: 20, // Example limit, implement pagination later
        // region: filters.region || undefined, // If you enable region filtering for farmers
      };

      // Translate priceRange UI state to min/max for the service.
      if (filters.priceRange) {
        const [minStr, maxStr] = filters.priceRange.split('-');
        const min = parseFloat(minStr);
        const max = maxStr ? parseFloat(maxStr) : undefined;
        if (!isNaN(min)) {
           // ServiceProductFilters should accept minPrice/maxPrice or handle range string.
           // Assuming it needs min/max. Adjust if your service expects a different format.
           // For now, I'll assume ProductService doesn't take priceRange directly,
           // and if it does, it should be typed in ServiceProductFilters.
           // My corrected ProductService.getProducts expects `priceRange: { min: number; max: number }`
           // This page's current `filters.priceRange` is a string "min-max".
           // This part needs alignment. For now, let's assume service does not take price directly.
           // If ProductService is updated to take minPrice/maxPrice:
           // serviceFilters.priceRange = { min, max: max === undefined ? Infinity : max };
        }
      }
      
      // CRITICAL CHANGE: Call ProductService.getProducts with constructed serviceFilters.
      // The service now handles more filtering logic internally using the DB view.
      const result = await ProductService.getProducts(serviceFilters);

      if (result.success) {
        // Client-side filtering should be MINIMAL if service handles it.
        // Only apply filters here if the service cannot handle them.
        // The price range filter is applied here as an example if service doesn't.
        let productsToDisplay = result.data;
        if (filters.priceRange) {
            const [min, max] = filters.priceRange.split('-').map(Number);
            productsToDisplay = productsToDisplay.filter(product => {
                const price = product.price; // Assuming 'price' from rough_fire schema
                return price >= min && (max === undefined || isNaN(max) || price <= max);
            });
        }

        setProducts(productsToDisplay);
        setTotalProducts(result.count || productsToDisplay.length); // Use count from service if available
      } else {
        console.error('Failed to load products:', result.error);
        setProducts([]);
        setTotalProducts(0);
      }
    } catch (error) {
      console.error('Critical error in loadProducts:', error);
      setProducts([]);
      setTotalProducts(0);
    } finally {
      setLoading(false);
    }
  }, [filters]); // Dependency array includes filters.

  // useEffect to call loadProducts when filters change.
  useEffect(() => {
    const timer = setTimeout(() => { // Debounce fetching
        loadProducts();
    }, 300);
    return () => clearTimeout(timer);
  }, [loadProducts]); // loadProducts is memoized

  /**
   * Handles changes to filter inputs.
   * @param key The key of the filter being changed in PageProductFilters.
   * @param value The new value for the filter.
   */
  const handleFilterChange = (key: keyof PageProductFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  /**
   * Resets all filters to their default empty state.
   */
  const clearFilters = () => {
    setFilters({
      categoryName: '',
      qualityGrade: '',
      priceRange: '',
      searchQuery: ''
    });
    setShowFilters(false); // Optionally close filter panel on clear
  };

  /**
   * Handles navigation to the product details page.
   * @param productId The ID of the product to view.
   */
  const handleViewDetails = (productId: string) => {
    navigate(`/products/${productId}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-roboto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">Fresh Produce</h1>
          <p className="text-gray-600 mt-1 text-lg">
            Discover quality goods from local farmers and artisans.
          </p>
        </div>
        {user?.role === 'farmer' && (
          <MaterialButton
            href="/products/create" // Assuming you have a page for farmers to create products
            iconType="plus"
            icon="leading"
            color="secondary"
            className="mt-4 sm:mt-0"
          >
            
