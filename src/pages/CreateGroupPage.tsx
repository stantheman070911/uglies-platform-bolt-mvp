import React, { useState, useEffect } from 'react';
import { MaterialInput } from '../components/ui/MaterialInput';
import { MaterialButton } from '../components/ui/MaterialButton';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ProductCard } from '../components/ui/MaterialCard';
import { ProductService } from '../services/products';
import { GroupBuyingService } from '../services/groups';
import { useAuth } from '../hooks/useAuth';
import { Search, Package, Users, Clock, MapPin, DollarSign } from 'lucide-react';

const CreateGroupPage: React.FC = () => {
  const { userProfile } = useAuth();
  const [step, setStep] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [groupData, setGroupData] = useState({
    targetQuantity: '',
    deadline: '',
    deliveryMethod: 'home',
    region: userProfile?.region || 'local_area'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const deliveryMethods = [
    { value: 'home', label: '🏠 Home Delivery', description: 'Direct to your doorstep' },
    { value: 'pickup', label: '🚜 Farm Pickup', description: 'Pick up from the farm' },
    { value: 'market', label: '🏪 Farmers Market', description: 'Meet at local market' },
    { value: 'hub', label: '📍 Community Hub', description: 'Central pickup location' }
  ];

  const regions = [
    { value: 'local_area', label: '🏡 Local Area' },
    { value: 'nearby', label: '🌱 Nearby Farms' },
    { value: 'urban_farming', label: '🏢 Urban Agriculture' },
    { value: 'organic_certified', label: '🌿 Certified Organic' },
    { value: 'heritage_farms', label: '🌾 Heritage Varieties' },
    { value: 'seasonal_local', label: '📅 Seasonal Focus' }
  ];

  useEffect(() => {
    if (step === 1) {
      loadProducts();
    }
  }, [step, searchQuery]);

  const loadProducts = async () => {
    setLoadingProducts(true);
    try {
      const result = await ProductService.getProducts({ 
        limit: 20,
        region: groupData.region || undefined
      });

      if (result.success) {
        let filteredProducts = result.data || [];
        
        if (searchQuery) {
          filteredProducts = filteredProducts.filter(product =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.farmer?.display_name.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }

        setProducts(filteredProducts);
      }
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoadingProducts(false);
    }
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};

    if (!groupData.targetQuantity) {
      newErrors.targetQuantity = 'Target quantity is required';
    } else if (Number(groupData.targetQuantity) < 2) {
      newErrors.targetQuantity = 'Minimum 2 items required for group buying';
    }

    if (!groupData.deadline) {
      newErrors.deadline = 'Deadline is required';
    } else {
      const deadline = new Date(groupData.deadline);
      const now = new Date();
      const minDeadline = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours from now

      if (deadline <= minDeadline) {
        newErrors.deadline = 'Deadline must be at least 2 hours from now';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProductSelect = (product: any) => {
    setSelectedProduct(product);
    setStep(2);
  };

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setGroupData(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async () => {
    if (!validateStep2() || !selectedProduct || !userProfile?.id) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const deadline = new Date(groupData.deadline);
      
      const result = await GroupBuyingService.createGroup({
        productId: selectedProduct.id,
        initiatorId: userProfile.id,
        targetQuantity: Number(groupData.targetQuantity),
        basePrice: selectedProduct.base_price,
        deadline: deadline.toISOString(),
        deliveryMethod: groupData.deliveryMethod,
        region: groupData.region
      });

      if (result.success) {
        // Redirect to group details or groups page
        window.location.href = `/groups/${result.data.id}`;
      } else {
        setErrors({ submit: result.error?.message || 'Failed to create group' });
      }
    } catch (error: any) {
      setErrors({ submit: 'An unexpected error occurred' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculatePotentialSavings = () => {
    if (!selectedProduct || !groupData.targetQuantity) return null;

    const basePrice = selectedProduct.base_price;
    const quantity = Number(groupData.targetQuantity);
    const groupPrice = GroupBuyingService.calculateGroupPrice(basePrice, quantity);
    const savings = (basePrice - groupPrice) * quantity;
    const savingsPercentage = Math.round(((basePrice - groupPrice) / basePrice) * 100);

    return {
      basePrice,
      groupPrice,
      savings,
      savingsPercentage,
      totalCost: groupPrice * quantity
    };
  };

  const potentialSavings = calculatePotentialSavings();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-surface-900 mb-2">Start a Group Buy</h1>
        <p className="text-surface-600">
          Unite with your community to get better prices on fresh local produce
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center space-x-4">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
            step >= 1 ? 'bg-secondary-500 text-white' : 'bg-surface-200 text-surface-500'
          }`}>
            <Package className="w-5 h-5" />
          </div>
          <div className={`w-16 h-1 ${step >= 2 ? 'bg-secondary-500' : 'bg-surface-200'}`} />
          <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
            step >= 2 ? 'bg-secondary-500 text-white' : 'bg-surface-200 text-surface-500'
          }`}>
            <Users className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Step 1: Product Selection */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-surface-900 mb-2">Choose a Product</h2>
            <p className="text-surface-600">Select fresh produce to organize a group buy around</p>
          </div>

          {/* Search */}
          <div className="max-w-md mx-auto">
            <MaterialInput
              placeholder="Search products or farmers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              startIcon={<Search className="w-5 h-5" />}
              showClearButton
              onClear={() => setSearchQuery('')}
              fullWidth
            />
          </div>

          {/* Products Grid */}
          {loadingProducts ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <LoadingSpinner key={index} variant="skeleton" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold text-surface-900 mb-2">No products found</h3>
              <p className="text-surface-600">Try adjusting your search or check back later</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.id} onClick={() => handleProductSelect(product)}>
                  <ProductCard
                    product={product}
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 2: Group Configuration */}
      {step === 2 && selectedProduct && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-surface-900 mb-2">Configure Your Group</h2>
            <p className="text-surface-600">Set the details for your group buy</p>
          </div>

          {/* Selected Product Summary */}
          <div className="bg-secondary-50 rounded-lg p-4 border border-secondary-200">
            <div className="flex items-start space-x-4">
              <img
                src={selectedProduct.images?.[0] || '/placeholder-product.jpg'}
                alt={selectedProduct.name}
                className="w-20 h-20 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-surface-900">{selectedProduct.name}</h3>
                <p className="text-sm text-surface-600 mb-2">{selectedProduct.farmer?.display_name}</p>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="font-medium text-secondary-600">
                    Base Price: ${selectedProduct.base_price}
                  </span>
                  <span className="text-surface-500">
                    {selectedProduct.inventory_available} available
                  </span>
                </div>
              </div>
              <MaterialButton
                variant="text"
                size="small"
                onClick={() => setStep(1)}
              >
                Change Product
              </MaterialButton>
            </div>
          </div>

          {/* Configuration Form */}
          <div className="bg-white rounded-lg border border-surface-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Target Quantity */}
              <MaterialInput
                label="Target Quantity"
                type="number"
                min="2"
                max={selectedProduct.inventory_available}
                value={groupData.targetQuantity}
                onChange={handleInputChange('targetQuantity')}
                error={errors.targetQuantity}
                startIcon={<Package className="w-5 h-5" />}
                placeholder="e.g., 20"
                helperText="Minimum 2 items required"
                fullWidth
              />

              {/* Deadline */}
              <MaterialInput
                label="Group Deadline"
                type="datetime-local"
                value={groupData.deadline}
                onChange={handleInputChange('deadline')}
                error={errors.deadline}
                startIcon={<Clock className="w-5 h-5" />}
                helperText="When should the group close?"
                fullWidth
              />

              {/* Delivery Method */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-surface-700 mb-3">
                  Delivery Method
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {deliveryMethods.map((method) => (
                    <label
                      key={method.value}
                      className={`
                        flex items-start p-3 border-2 rounded-lg cursor-pointer transition-all
                        ${groupData.deliveryMethod === method.value 
                          ? 'border-secondary-500 bg-secondary-50' 
                          : 'border-surface-200 hover:border-surface-300'
                        }
                      `}
                    >
                      <input
                        type="radio"
                        name="deliveryMethod"
                        value={method.value}
                        checked={groupData.deliveryMethod === method.value}
                        onChange={handleInputChange('deliveryMethod')}
                        className="sr-only"
                      />
                      <div>
                        <div className="font-medium text-surface-900">{method.label}</div>
                        <div className="text-sm text-surface-600">{method.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Target Region */}
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-2">
                  Target Region
                </label>
                <select
                  value={groupData.region}
                  onChange={handleInputChange('region')}
                  className="w-full px-4 py-3 border-2 border-surface-300 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500"
                >
                  {regions.map(region => (
                    <option key={region.value} value={region.value}>{region.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Potential Savings Preview */}
          {potentialSavings && (
            <div className="bg-gradient-to-r from-secondary-50 to-primary-50 rounded-lg p-6 border border-secondary-200">
              <h3 className="font-semibold text-surface-900 mb-4">💰 Potential Group Savings</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-sm text-surface-600">Base Price</p>
                  <p className="text-lg font-bold text-surface-900">${potentialSavings.basePrice}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-surface-600">Group Price</p>
                  <p className="text-lg font-bold text-secondary-600">${potentialSavings.groupPrice}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-surface-600">Total Savings</p>
                  <p className="text-lg font-bold text-primary-600">${potentialSavings.savings.toFixed(2)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-surface-600">Discount</p>
                  <p className="text-lg font-bold text-tertiary-600">{potentialSavings.savingsPercentage}%</p>
                </div>
              </div>
            </div>
          )}

          {/* Submit Error */}
          {errors.submit && (
            <div className="p-3 bg-error-50 border border-error-200 rounded-lg">
              <p className="text-error-700 text-sm">{errors.submit}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <MaterialButton
              variant="outlined"
              onClick={() => setStep(1)}
              disabled={isSubmitting}
              className="flex-1"
            >
              Back to Products
            </MaterialButton>
            
            <MaterialButton
              onClick={handleSubmit}
              loading={isSubmitting}
              disabled={isSubmitting}
              className="flex-1"
              iconType="users"
              icon="leading"
            >
              {isSubmitting ? 'Creating Group...' : 'Create Group Buy'}
            </MaterialButton>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateGroupPage;