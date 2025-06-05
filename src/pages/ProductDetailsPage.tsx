/**
 * @file src/pages/ProductDetailsPage.tsx
 * @description Displays detailed information about a specific product.
 * Fetches data using ProductService and presents it in a visually rich,
 * user-friendly layout. Includes image gallery, farmer details, pricing,
 * and calls to action for group buying.
 * Adherence to "Violent Psychopath Maintenance Standard":
 * - All state and props are strongly typed.
 * - Component logic is broken into manageable pieces or hooks.
 * - All side effects (data fetching) are handled in useEffect.
 * - Loading and error states are explicitly managed and displayed.
 * - UI elements are clearly named and styled according to design system.
 */
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ProductService, ProductWithDetails } from '../services/products';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { MaterialButton } from '../components/ui/MaterialButton';
import {
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Users,
  Star,
  MapPin,
  Leaf,
  CalendarDays,
  Tag,
  ShieldCheck,
  Heart,
  Share2,
  MessageCircle,
  Info,
  Package,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { GroupBuyingService } from '../services/groups'; // For calculating potential savings

// Define quality tier information consistent with the content bank
const qualityTiersInfo = {
  premium: { label: "🏆 Premium Grade", color: "text-yellow-500 bg-yellow-100", description: "Perfect appearance, highest quality." },
  standard: { label: "✓ Standard Grade", color: "text-green-500 bg-green-100", description: "Excellent quality for everyday use." },
  cosmetic: { label: "💝 Cosmetic Seconds", color: "text-orange-500 bg-orange-100", description: "Minor imperfections, same great taste." }
};


const ProductDetailsPage: React.FC = () => {
  const { id: productId } = useParams<{ id: string }>(); // Get product ID from URL
  const { user } = useAuth(); // For user-specific actions like "Start Group Buy"
  const navigate = useNavigate();

  const [product, setProduct] = useState<ProductWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false); // Mock state for favorite button

  // Effect to fetch product details when the component mounts or productId changes.
  useEffect(() => {
    if (!productId) {
      setError("Product ID is missing.");
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      const result = await ProductService.getProductById(productId);
      if (result.success && result.data) {
        setProduct(result.data);
      } else {
        setError(result.error || "Failed to load product details.");
        setProduct(null); // Ensure product state is cleared on error
      }
      setLoading(false);
    };

    fetchProduct();
  }, [productId]);

  // Memoized calculation for potential group buy savings.
  const potentialSavings = useMemo(() => {
    if (!product) return null;
    // Simulate joining with a common group size, e.g., 10 participants.
    // This is for display purposes on the product page to entice users.
    const typicalGroupSize = 10;
    const groupPrice = GroupBuyingService.calculateGroupPrice(product.price, typicalGroupSize);
    const savings = product.price - groupPrice;
    const savingsPercentage = product.price > 0 ? Math.round((savings / product.price) * 100) : 0;
    return {
      groupPrice,
      savings,
      savingsPercentage,
      typicalGroupSize
    };
  }, [product]);

  // Handlers for image gallery navigation.
  const nextImage = () => {
    if (product && product.images && product.images.length > 0) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % product.images.length);
    }
  };
  const prevImage = () => {
    if (product && product.images && product.images.length > 0) {
      setCurrentImageIndex((prevIndex) => (prevIndex - 1 + product.images.length) % product.images.length);
    }
  };

  // Handler for "Start Group Buy" button.
  const handleStartGroupBuy = () => {
    if (product) {
      // Navigate to the CreateGroupPage, pre-filling the selected product.
      // The CreateGroupPage will need to be ableto handle this state.
      navigate('/groups/create', { state: { preselectedProductId: product.id } });
    }
  };
  
  // Toggle favorite state (mock implementation)
  const toggleFavorite = () => {
    setIsFavorited(!isFavorited);
    // Here you would typically call a service to update the user's favorites in the database.
  };


  // Loading state display.
  if (loading) {
    return (
      <div className="container mx-auto min-h-[calc(100vh-10rem)] flex items-center justify-center p-4">
        <LoadingSpinner message="Loading product details..." size="large" />
      </div>
    );
  }

  // Error state display.
  if (error) {
    return (
      <div className="container mx-auto text-center py-12 px-4">
        <Info className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Oops! Something went wrong.</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <MaterialButton onClick={() => navigate('/products')} iconType="arrow" icon="leading">
          Back to Products
        </MaterialButton>
      </div>
    );
  }

  // Product not found state.
  if (!product) {
    return (
      <div className="container mx-auto text-center py-12 px-4">
        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Product Not Found</h2>
        <p className="text-gray-600 mb-6">We couldn't find the product you're looking for.</p>
        <MaterialButton onClick={() => navigate('/products')} iconType="arrow" icon="leading">
          Back to Products
        </MaterialButton>
      </div>
    );
  }
  
  // Helper to get quality tier info
  const qualityInfo = qualityTiersInfo[product.quality_grade as keyof typeof qualityTiersInfo] || 
                      qualityTiersInfo.standard;


  // Main component render.
  return (
    <div className="container mx-auto max-w-6xl p-4 sm:p-6 lg:p-8 font-roboto">
      {/* Breadcrumbs (Optional but good for UX) */}
      <nav className="mb-6 text-sm text-gray-500">
        <Link to="/products" className="hover:text-green-600">Products</Link>
        <span className="mx-2">/</span>
        <Link to={`/products?category=${product.category_name}`} className="hover:text-green-600 capitalize">
            {product.category_name || 'Category'}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-700 font-medium">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Image Gallery Section */}
        <div className="relative">
          <div className="aspect-square bg-gray-100 rounded-xl shadow-lg overflow-hidden">
            {product.images && product.images.length > 0 ? (
              <img
                src={product.images[currentImageIndex]}
                alt={`${product.name} - image ${currentImageIndex + 1}`}
                className="w-full h-full object-cover transition-opacity duration-300 ease-in-out"
              />
            ) : (
              <img
                src={`https://placehold.co/600x600/22C55E/FFFFFF?text=${encodeURIComponent(product.name)}`}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          {product.images && product.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full shadow-md transition-colors text-gray-700"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full shadow-md transition-colors text-gray-700"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                {product.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentImageIndex ? 'bg-green-500 scale-125' : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
           <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-semibold text-white ${qualityInfo.color.replace('text-', 'bg-').replace('-100', '-500')}`}>
             {qualityInfo.label}
           </div>
        </div>

        {/* Product Information Section */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <p className="text-lg text-gray-600 mb-4">{product.description}</p>
          </div>

          {/* Price and Stock */}
          <div className="bg-green-50 p-6 rounded-xl border border-green-200">
            <div className="flex items-baseline justify-between mb-3">
              <p className="text-4xl font-bold text-green-600">
                ${product.price.toFixed(2)}
                <span className="text-lg text-gray-500 font-normal"> / {product.unit || 'unit'}</span>
              </p>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                product.stock_quantity > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {product.stock_quantity > 0 ? `${product.stock_quantity} available` : 'Out of Stock'}
              </span>
            </div>
            {potentialSavings && product.stock_quantity > 0 && (
              <p className="text-sm text-green-700">
                Join a group (avg. {potentialSavings.typicalGroupSize} people) & pay ~<span className="font-bold">${potentialSavings.groupPrice.toFixed(2)}</span>. Save up to <span className="font-bold">{potentialSavings.savingsPercentage}%</span>!
              </p>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <MaterialButton
                color="secondary"
                size="large"
                onClick={handleStartGroupBuy}
                disabled={product.stock_quantity === 0}
                className="w-full"
                iconType="users"
                icon="leading"
            >
                Start Group Buy
            </MaterialButton>
            <MaterialButton
                variant="outlined"
                color="primary"
                size="large"
                onClick={toggleFavorite}
                className="w-full"
            >
                <Heart className={`w-5 h-5 mr-2 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-blue-500'}`} />
                {isFavorited ? 'Favorited' : 'Add to Favorites'}
            </MaterialButton>
          </div>
          <div className="flex items-center justify-center space-x-3 mt-3">
            <MaterialButton variant="text" size="small" iconType="share" className="text-gray-600 hover:text-blue-600">Share</MaterialButton>
            <MaterialButton variant="text" size="small" iconType="custom" customIcon={<MessageCircle className="w-4 h-4"/>} className="text-gray-600 hover:text-green-600">Ask Farmer</MaterialButton>
          </div>


          {/* Product Attributes */}
          <div className="space-y-4 pt-6 border-t border-gray-200">
             <InfoRow icon={<Leaf className="text-green-500" />} label="Category" value={product.category_name || 'N/A'} />
             <InfoRow icon={<ShieldCheck className="text-blue-500" />} label="Quality" value={qualityInfo.description} />
             {product.harvest_date && (
                <InfoRow icon={<CalendarDays className="text-orange-500" />} label="Harvested On" value={new Date(product.harvest_date).toLocaleDateString()} />
             )}
             {product.organic_certified && (
                <InfoRow icon={<Leaf className="text-green-600" />} label="Certification" value="Certified Organic" />
             )}
          </div>

          {/* Farmer Information */}
          {product.farmer_name && (
            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">About the Farmer</h3>
              <Link to={`/farmers/${product.farmer_id}`} className="block p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-start space-x-4">
                  <img
                    src={product.farmer_avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(product.farmer_name)}&background=34C759&color=fff`}
                    alt={product.farmer_name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-green-700">{product.farmer_name}</h4>
                    {/* product.farmer_region is commented out in the view, add if available
                    <p className="text-sm text-gray-500 flex items-center">
                      <MapPin className="w-4 h-4 mr-1 text-gray-400" /> {product.farmer_region || 'Region Unknown'}
                    </p>
                    */}
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{product.farmer_bio || 'This farmer believes in quality and freshness.'}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 self-center" />
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* TODO: Related Products / Other Groups for this Product Section */}
      <div className="mt-12 pt-8 border-t border-gray-200">
         <h2 className="text-2xl font-bold text-gray-800 mb-6">You Might Also Like</h2>
         {/* Placeholder for related products/groups carousel or grid */}
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Example placeholder cards */}
            {[1,2,3].map(i => (
                <div key={i} className="bg-gray-100 rounded-lg p-4 h-48 animate-pulse">
                    <div className="w-3/4 h-6 bg-gray-300 rounded mb-2"></div>
                    <div className="w-1/2 h-4 bg-gray-300 rounded"></div>
                </div>
            ))}
         </div>
      </div>
    </div>
  );
};

// Helper component for consistent info row display
const InfoRow: React.FC<{ icon: React.ReactNode; label: string; value: string | number | undefined }> = ({ icon, label, value }) => (
  <div className="flex items-start">
    <div className="flex-shrink-0 w-6 h-6 mr-3 mt-0.5">{icon}</div>
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-md text-gray-800 font-semibold">{value || 'Not specified'}</p>
    </div>
  </div>
);

export default ProductDetailsPage;
