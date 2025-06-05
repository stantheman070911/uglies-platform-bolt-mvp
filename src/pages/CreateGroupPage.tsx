import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MaterialInput } from '../components/ui/MaterialInput';
import { MaterialButton } from '../components/ui/MaterialButton';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ProductCard } from '../components/ui/MaterialCard';
// CORRECT TYPING: Import the specific Product type from your services or types file.
// Assuming your ProductService exports the Product type as defined in your services.
import { ProductService, Product } from '../services/products';
import { GroupBuyingService, CreateGroupRequest } from '../services/groups'; // Ensure CreateGroupRequest is typed
import { useAuth } from '../hooks/useAuth';
import { Search, Package, Users, Clock, ArrowLeft } from 'lucide-react';

// Define a type for our form data for absolute type safety.
interface GroupFormData {
  targetQuantity: string;
  deadline: string;
  deliveryMethod: string;
  region: string;
}

/**
 * @file src/pages/CreateGroupPage.tsx
 * @description Page for creating a new group buy.
 * Allows users to select a product and then configure group details.
 * Adherence to "Violent Psychopath Maintenance Standard":
 * - NO `any` types. All state and props are strongly typed.
 * - Clear separation of concerns for product fetching and form submission.
 * - Robust validation before submission.
 * - User-friendly loading and error states.
 */
const CreateGroupPage: React.FC = () => {
  // useAuth hook provides the currently authenticated user's profile.
  // Renamed userProfile to user for consistency with useAuth's return.
  const { user } = useAuth();
  const navigate = useNavigate();

  // Manages the current step of the group creation process (1: Select Product, 2: Configure Group).
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // --- Step 1 State: Product Selection ---
  const [products, setProducts] = useState<Product[]>([]); // CRITICAL: Strongly typed
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // --- Step 2 State: Group Configuration ---
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null); // CRITICAL: Strongly typed
  const [groupData, setGroupData] = useState<GroupFormData>({
    targetQuantity: '10', // Default to a sensible minimum.
    deadline: '',
    deliveryMethod: 'home', // Default delivery method.
    region: user?.region || 'local_area', // Default to user's region or a general local area.
  });

  // Delivery methods available for selection.
  const deliveryMethods = [
    { value: 'home', label: '🏠 Home Delivery', description: 'Direct to your doorstep' },
    { value: 'pickup', label: '🚜 Farm Pickup', description: 'Pick up from the farm' },
    { value: 'market', label: '🏪 Farmers Market', description: 'Meet at local market' },
    { value: 'hub', label: '📍 Community Hub', description: 'Central pickup location' }
  ];

  // Regions available for selection.
  const regions = [
    { value: 'local_area', label: '🏡 Local Area' },
    { value: 'nearby', label: '🌱 Nearby Farms' },
    // ... add other regions as defined in your project
  ];

  // Debounced product fetching for Step 1.
  // Using useCallback to memoize the fetch function.
  const debouncedLoadProducts = useCallback(() => {
    const fetchProducts = async () => {
      setLoadingProducts(true);
      // Ensure ProductService.getProducts filters are correctly typed.
      const result = await ProductService.getProducts({ 
        limit: 20, // Sensible limit for initial display.
        search: searchQuery || undefined, // Pass undefined if search query is empty.
        // region: groupData.region || undefined // If filtering by region in step 1
      });
      setProducts(result.data as Product[] || []); // Ensure result.data is cast to Product[]
      setLoadingProducts(false);
    };

    // Set a timeout to delay the API call, reducing load during rapid typing.
    const timerId = setTimeout(fetchProducts, 300);
    return () => clearTimeout(timerId); // Cleanup: clear timeout if dependencies change or component unmounts.
  }, [searchQuery/*, groupData.region*/]); // Add groupData.region if filtering by it here

  // Effect for loading products in Step 1.
  useEffect(() => {
    if (step === 1) {
      debouncedLoadProducts();
    }
  }, [step, debouncedLoadProducts]); // debouncedLoadProducts is now stable

  /**
   * Handles selection of a product and transitions to Step 2.
   * @param product The product selected by the user.
   */
  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product); // Product is now strongly typed.
    setStep(2);
  };

  /**
   * Handles input changes for the group configuration form.
   * @param field The name of the form field being changed.
   */
  const handleInputChange = (field: keyof GroupFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setGroupData(prev => ({ ...prev, [field]: e.target.value }));
    // Clear error for this field when user starts typing.
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  /**
   * Validates the group configuration form data (Step 2).
   * @returns {boolean} True if the form is valid, false otherwise.
   */
  const validateStep2 = (): boolean => {
    const newErrors: Record<string, string> = {};
    const now = new Date();
    // Group deadline must be at least 2 hours in the future for practical reasons.
    const minDeadline = new Date(now.getTime() + 2 * 60 * 60 * 1000);

    if (!selectedProduct) { // Safety check, though UI should prevent this.
      newErrors.submit = "Critical error: No product selected for group creation.";
      setErrors(newErrors);
      return false;
    }

    if (!groupData.targetQuantity.trim()) {
      newErrors.targetQuantity = 'Target quantity is required.';
    } else if (isNaN(Number(groupData.targetQuantity)) || Number(groupData.targetQuantity) < 2) {
      newErrors.targetQuantity = 'Target quantity must be a number and at least 2.';
    } else if (Number(groupData.targetQuantity) > selectedProduct.inventory_available) {
      // Ensure target quantity does not exceed product's available inventory.
      newErrors.targetQuantity = `Cannot exceed available inventory of ${selectedProduct.inventory_available}.`;
    }

    if (!groupData.deadline) {
      newErrors.deadline = 'A deadline for the group buy is required.';
    } else if (new Date(groupData.deadline) <= minDeadline) {
      newErrors.deadline = 'Deadline must be at least 2 hours from now.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Valid if no errors.
  };

  /**
   * Handles the final submission of the new group buy.
   */
  const handleSubmit = async () => {
    if (!validateStep2() || !selectedProduct || !user?.id) {
      // Log or display a more specific error if user or product is missing.
      if (!selectedProduct) setErrors(prev => ({...prev, submit: "Product details are missing."}));
      if (!user?.id) setErrors(prev => ({...prev, submit: "User session error. Please log in again."}));
      return;
    }

    setIsSubmitting(true);
    setErrors({}); // Clear previous submission errors.

    // Construct the request payload with correct types.
    const groupCreationRequest: CreateGroupRequest = {
      productId: selectedProduct.id,
      initiatorId: user.id, // Make sure user.id is available and correct
      targetQuantity: Number(groupData.targetQuantity),
      basePrice: selectedProduct.base_price, // Use base_price from the Product type
      deadline: new Date(groupData.deadline).toISOString(),
      deliveryMethod: groupData.deliveryMethod,
      region: groupData.region,
      // Add other fields as required by your CreateGroupRequest type
      title: `${selectedProduct.name} Group Buy`, // Example: Construct a title
    };
    
    const result = await GroupBuyingService.createGroup(groupCreationRequest);

    if (result.success && result.data?.id) {
      // Successfully created, navigate to the new group's page.
      navigate(`/groups/${result.data.id}`);
    } else {
      setErrors({ submit: result.error || 'Failed to create group. Please try again later.' });
    }
    setIsSubmitting(false);
  };
  
  // Calculate potential savings to display to the user.
  const potentialSavings = (() => {
    if (!selectedProduct || !groupData.targetQuantity || Number(groupData.targetQuantity) < 2) return null;

    const basePrice = selectedProduct.base_price;
    const quantity = Number(groupData.targetQuantity);
    // Use the service's price calculation logic.
    const groupPrice = GroupBuyingService.calculateGroupPrice(basePrice, quantity);
    const totalSavings = (basePrice - groupPrice) * quantity;
    const savingsPercentage = basePrice > 0 ? Math.round(((basePrice - groupPrice) / basePrice) * 100) : 0;

    return {
      basePrice,
      groupPrice,
      totalSavings,
      savingsPercentage,
      totalCost: groupPrice * quantity
    };
  })();

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-surface-900 mb-2">Start a Group Buy</h1>
        <p className="text-surface-600">
          {step === 1 ? "Select fresh produce to organize a group buy around." : "Set the details for your group buy."}
        </p>
      </div>

      {/* Progress Steps Indicator */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center space-x-4">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
            step >= 1 ? 'bg-secondary-500 text-white' : 'bg-surface-200 text-surface-500'
          }`}>
            <Package className="w-5 h-5" />
          </div>
          <div className={`w-16 h-1 transition-colors ${step >= 2 ? 'bg-secondary-500' : 'bg-surface-200'}`} />
          <div className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
            step >= 2 ? 'bg-secondary-500 text-white' : 'bg-surface-200 text-surface-500'
          }`}>
            <Users className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Step 1: Product Selection */}
      {step === 1 && (
        <div className="space-y-6">
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
          {loadingProducts ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
              {[...Array(3)].map((_, index) => <LoadingSpinner key={index} variant="skeleton" />)}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🤔</div>
              <h3 className="text-lg font-semibold text-surface-900 mb-2">No products found</h3>
              <p className="text-surface-600">Try a different search term or check back later.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.id} onClick={() => handleProductSelect(product)} className="h-full">
                  <ProductCard product={product} className="cursor-pointer hover:shadow-lg transition-shadow h-full flex flex-col" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 2: Group Configuration */}
      {step === 2 && selectedProduct && (
        <div className="space-y-6">
          {/* Selected Product Summary Card */}
          <div className="bg-green-50 rounded-xl p-6 border border-green-200 shadow-sm flex items-start space-x-4">
            <img
              src={selectedProduct.images?.[0] || `https://placehold.co/100x100/22C55E/FFFFFF?text=${selectedProduct.name.charAt(0)}`}
              alt={selectedProduct.name}
              className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
            />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">{selectedProduct.name}</h3>
              <p className="text-sm text-gray-600 mb-1">
                From: <span className="font-medium">{selectedProduct.farmer?.display_name || 'Unknown Farmer'}</span>
              </p>
              <p className="text-sm text-gray-600 mb-2">
                Category: <span className="font-medium">{selectedProduct.category}</span>
              </p>
              <div className="flex items-baseline space-x-2 text-sm">
                <span className="font-semibold text-green-600 text-xl">${selectedProduct.base_price}</span>
                <span className="text-gray-500">per {selectedProduct.unit || 'unit'}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">{selectedProduct.inventory_available} units available</p>
            </div>
            <MaterialButton
              variant="text"
              size="small"
              onClick={() => setStep(1)}
              className="text-green-600 hover:bg-green-100"
              iconType="edit"
            >
              Change
            </MaterialButton>
          </div>

          {/* Configuration Form Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-6">
            <MaterialInput
              label="Target Quantity (Minimum 2)"
              type="number"
              min="2"
              max={selectedProduct.inventory_available.toString()} // Convert number to string for input prop
              value={groupData.targetQuantity}
              onChange={handleInputChange('targetQuantity')}
              error={errors.targetQuantity}
              startIcon={<Package className="w-5 h-5" />}
              fullWidth
              required
            />
            <MaterialInput
              label="Group Deadline (At least 2 hours from now)"
              type="datetime-local"
              value={groupData.deadline}
              onChange={handleInputChange('deadline')}
              error={errors.deadline}
              startIcon={<Clock className="w-5 h-5" />}
              fullWidth
              required
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Method</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {deliveryMethods.map((method) => (
                  <label
                    key={method.value}
                    className={`flex items-start p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      groupData.deliveryMethod === method.value 
                      ? 'border-secondary-500 bg-secondary-50 ring-2 ring-secondary-500' 
                      : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="deliveryMethod"
                      value={method.value}
                      checked={groupData.deliveryMethod === method.value}
                      onChange={handleInputChange('deliveryMethod')}
                      className="sr-only" // Hide default radio, use custom styling
                    />
                    <span className="text-lg mr-3">{method.icon}</span>
                    <div>
                      <span className="font-medium text-gray-900">{method.label}</span>
                      <p className="text-xs text-gray-500">{method.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Region</label>
                <select
                  name="region" // Ensure name attribute is present
                  value={groupData.region}
                  onChange={handleInputChange('region')}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-secondary-500 focus:ring-secondary-500 transition-colors"
                >
                  {regions.map(region => (
                    <option key={region.value} value={region.value}>{region.label}</option>
                  ))}
                </select>
              </div>
          </div>

          {/* Potential Savings Preview Card */}
          {potentialSavings && (
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200 shadow-sm">
              <h3 className="text-lg font-semibold text-blue-700 mb-4">Potential Savings Preview</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-xs text-blue-600">Base Price/unit</p>
                  <p className="text-xl font-bold text-blue-800">${potentialSavings.basePrice.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-blue-600">Your Group Price/unit</p>
                  <p className="text-xl font-bold text-green-600">${potentialSavings.groupPrice.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-blue-600">Total Savings on Target</p>
                  <p className="text-xl font-bold text-blue-800">${potentialSavings.totalSavings.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-blue-600">Discount Achieved</p>
                  <p className="text-xl font-bold text-green-600">{potentialSavings.savingsPercentage}%</p>
                </div>
              </div>
              <p className="text-xs text-blue-600 mt-3 text-center">
                Final price depends on total quantity reached by deadline.
              </p>
            </div>
          )}

          {/* Submission Error Display */}
          {errors.submit && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 text-center">
              {errors.submit}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <MaterialButton
              variant="outlined"
              onClick={() => setStep(1)}
              disabled={isSubmitting}
              className="flex-1"
              iconType="custom" customIcon={<ArrowLeft className="w-4 h-4"/>}
            >
              Back to Products
            </MaterialButton>
            <MaterialButton
              onClick={handleSubmit}
              loading={isSubmitting}
              disabled={isSubmitting || !selectedProduct} // Disable if no product is selected
              className="flex-1"
              iconType="users"
              icon="leading" // Or "trailing" depending on desired placement
              color="secondary" // Make create button distinct
            >
              {isSubmitting ? 'Creating Group...' : 'Confirm & Create Group'}
            </MaterialButton>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateGroupPage;
