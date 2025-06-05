import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MaterialInput } from '../components/ui/MaterialInput';
import { MaterialButton } from '../components/ui/MaterialButton';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ProductCard } from '../components/ui/MaterialCard';
import { ProductService, Product } from '../services/products'; // Import Product type
import { GroupBuyingService } from '../services/groups';
import { useAuth } from '../hooks/useAuth';
import { Search, Package, Users, Clock, MapPin, DollarSign, ArrowLeft } from 'lucide-react';

// Define a type for our form data for type safety
interface GroupFormData {
  targetQuantity: string;
  deadline: string;
  deliveryMethod: string;
  region: string;
}

/**
 * Renders the page for creating a new group buy.
 * This is a two-step process:
 * 1. Select a product from a searchable list.
 * 2. Configure the group buy details (quantity, deadline, etc.).
 */
const CreateGroupPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Step 1: Product Selection
  const [step, setStep] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Step 2: Group Configuration
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [groupData, setGroupData] = useState<GroupFormData>({
    targetQuantity: '10', // Sensible default
    deadline: '',
    deliveryMethod: 'home',
    region: user?.region || 'local_area',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch products when the component mounts or search query changes for Step 1
  useEffect(() => {
    if (step === 1) {
      const fetchProducts = async () => {
        setLoadingProducts(true);
        const result = await ProductService.getProducts({
          limit: 20,
          search: searchQuery || undefined,
        });
        setProducts(result.data || []);
        setLoadingProducts(false);
      };
      // Debounce the fetch to avoid excessive API calls while typing
      const debounceTimer = setTimeout(fetchProducts, 300);
      return () => clearTimeout(debounceTimer);
    }
  }, [step, searchQuery]);

  /**
   * Handles the selection of a product and transitions to the next step.
   * @param product The product object selected by the user.
   */
  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setStep(2);
  };

  /**
   * Validates the group configuration form data.
   * @returns {boolean} - True if the form is valid, false otherwise.
   */
  const validateStep2 = (): boolean => {
    const newErrors: Record<string, string> = {};
    const now = new Date();
    const minDeadline = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour from now

    if (!groupData.targetQuantity || Number(groupData.targetQuantity) <= 1) {
      newErrors.targetQuantity = 'Target must be at least 2.';
    }
    if (selectedProduct && Number(groupData.targetQuantity) > selectedProduct.inventory_available) {
      newErrors.targetQuantity = `Cannot exceed available inventory of ${selectedProduct.inventory_available}.`;
    }
    if (!groupData.deadline) {
      newErrors.deadline = 'A deadline is required.';
    } else if (new Date(groupData.deadline) <= minDeadline) {
      newErrors.deadline = 'Deadline must be at least 1 hour from now.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handles the final submission of the new group buy.
   */
  const handleSubmit = async () => {
    // Re-validate before submitting
    if (!validateStep2() || !selectedProduct || !user?.id) return;

    setIsSubmitting(true);
    setErrors({});

    const result = await GroupBuyingService.createGroup({
      productId: selectedProduct.id,
      initiatorId: user.id,
      targetQuantity: Number(groupData.targetQuantity),
      basePrice: selectedProduct.base_price,
      deadline: new Date(groupData.deadline).toISOString(),
      deliveryMethod: groupData.deliveryMethod,
      region: groupData.region,
    });

    if (result.success && result.data) {
      navigate(`/groups/${result.data.id}`);
    } else {
      setErrors({ submit: result.error || 'Failed to create group.' });
    }
    setIsSubmitting(false);
  };
  
  // Renders the product selection view (Step 1)
  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-surface-900 mb-2">Step 1: Choose a Product</h2>
        <p className="text-surface-600">Select an item to build your group buy around.</p>
      </div>
      <div className="max-w-md mx-auto">
        <MaterialInput
          placeholder="Search for produce or farmers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          startIcon={<Search className="w-5 h-5" />}
          showClearButton
          onClear={() => setSearchQuery('')}
          fullWidth
        />
      </div>
      {loadingProducts ? (
        <LoadingSpinner variant="skeleton" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} onClick={() => handleProductSelect(product)}>
              <ProductCard product={product} className="cursor-pointer hover:shadow-lg transition-shadow" />
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Renders the group configuration view (Step 2)
  const renderStep2 = () => {
    if (!selectedProduct) return null; // Should never happen if step is 2, but a good safeguard.
    
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-surface-900 mb-2">Step 2: Configure Your Group</h2>
          <p className="text-surface-600">Set the details for your group buy.</p>
        </div>

        {/* Selected Product Summary */}
        <div className="bg-green-50 rounded-lg p-4 border border-green-200 flex items-start space-x-4">
          <img
            src={selectedProduct.images?.[0] || '/placeholder-product.jpg'}
            alt={selectedProduct.name}
            className="w-20 h-20 rounded-lg object-cover"
          />
          <div className="flex-1">
            <h3 className="font-semibold text-surface-900">{selectedProduct.name}</h3>
            <p className="text-sm text-surface-600 mb-2">by {selectedProduct.farmer?.display_name || 'Unknown Farmer'}</p>
            <div className="flex items-center space-x-4 text-sm">
              <span className="font-medium text-green-600">Base Price: ${selectedProduct.base_price}</span>
              <span className="text-surface-500">{selectedProduct.inventory_available} available</span>
            </div>
          </div>
          <MaterialButton variant="text" size="small" onClick={() => setStep(1)} iconType="edit">Change</MaterialButton>
        </div>

        {/* Configuration Form */}
        <div className="bg-white rounded-lg border border-surface-200 p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <MaterialInput
            label="Target Quantity"
            type="number"
            min="2"
            max={selectedProduct.inventory_available}
            value={groupData.targetQuantity}
            onChange={(e) => setGroupData({...groupData, targetQuantity: e.target.value})}
            error={errors.targetQuantity}
            startIcon={<Package className="w-5 h-5" />}
            fullWidth
          />
          <MaterialInput
            label="Group Deadline"
            type="datetime-local"
            value={groupData.deadline}
            onChange={(e) => setGroupData({...groupData, deadline: e.target.value})}
            error={errors.deadline}
            startIcon={<Clock className="w-5 h-5" />}
            fullWidth
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <MaterialButton variant="outlined" onClick={() => setStep(1)} disabled={isSubmitting} className="flex-1" iconType="custom" customIcon={<ArrowLeft className="w-4 h-4"/>}>Back</MaterialButton>
          <MaterialButton onClick={handleSubmit} loading={isSubmitting} disabled={isSubmitting} className="flex-1" iconType="users">Create Group</MaterialButton>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {step === 1 ? renderStep1() : renderStep2()}
    </div>
  );
};

export default CreateGroupPage;
