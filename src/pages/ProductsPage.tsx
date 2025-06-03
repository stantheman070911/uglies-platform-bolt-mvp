import React from 'react';
import { demoProducts } from '@/data';

const ProductsPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
        <div className="flex space-x-4">
          <select className="form-input">
            <option>All Categories</option>
            <option>Vegetables</option>
            <option>Fruits</option>
            <option>Grains</option>
            <option>Herbs</option>
          </select>
          <select className="form-input">
            <option>Sort by: Featured</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Most Popular</option>
            <option>Highest Rated</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {demoProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="aspect-w-4 aspect-h-3">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {product.name}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                {product.description.slice(0, 100)}...
              </p>
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-lg font-bold text-green-600">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.discountPrice && (
                    <span className="text-sm text-gray-500 line-through ml-2">
                      ${product.discountPrice.toFixed(2)}
                    </span>
                  )}
                </div>
                <button className="btn-primary text-sm">
                  Add to Cart
                </button>
              </div>
              {product.isOrganic && (
                <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded mt-2">
                  Organic
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;