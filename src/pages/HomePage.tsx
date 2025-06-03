import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sprout, Users, ShoppingBag, 
  Globe, ArrowRight, Star, Truck, Heart,
  MapPin
} from 'lucide-react';

const HomePage: React.FC = () => {
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
              Join the agricultural revolution. UGLIES connects farmers directly with consumers through group buying power, eliminating middlemen and reducing food waste.
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
          
          <div className="hidden lg:flex justify-center">
            <div className="relative w-full h-96">
              <div className="absolute top-0 right-0 bg-white bg-opacity-90 rounded-lg shadow-xl p-6 w-64 transform rotate-3 z-10">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <Sprout size={20} className="text-green-600" />
                  </div>
                  <h3 className="font-semibold text-green-800">Organic Produce</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Save up to 40% on organic produce through group buying
                </p>
              </div>
              
              <div className="absolute bottom-0 left-0 bg-white bg-opacity-90 rounded-lg shadow-xl p-6 w-64 transform -rotate-2 z-20">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="bg-yellow-100 p-2 rounded-full">
                    <Users size={20} className="text-yellow-600" />
                  </div>
                  <h3 className="font-semibold text-yellow-800">Group Buying</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Join 5,000+ active groups across 120 countries
                </p>
              </div>
              
              {/* Semi-transparent central image */}
              <div className="absolute inset-0 flex items-center justify-center opacity-70">
                <img 
                  src="https://images.pexels.com/photos/5529599/pexels-photo-5529599.jpeg" 
                  alt="Farmer with fresh produce" 
                  className="object-cover rounded-lg max-w-full max-h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">How UGLIES Works</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Connecting farmers and consumers through innovative social commerce
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 transition-all hover:shadow-lg">
              <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Sprout className="text-green-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Farmers List Produce</h3>
              <p className="text-gray-600">
                Farmers upload their available produce, set baseline prices, and specify minimum order quantities.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 transition-all hover:shadow-lg">
              <div className="bg-yellow-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Users className="text-yellow-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Consumers Join Groups</h3>
              <p className="text-gray-600">
                Consumers join group buys to unlock volume discounts, with prices dropping as more people join.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 transition-all hover:shadow-lg">
              <div className="bg-red-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Truck className="text-red-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Direct Delivery</h3>
              <p className="text-gray-600">
                Once the group buy completes, farmers deliver directly to local distribution points or homes.
              </p>
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
            {/* Sample Group Buy Cards */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative h-40 overflow-hidden">
                  <img 
                    src={`https://images.pexels.com/photos/${3000 + i * 100}/pexels-photo-${3000 + i * 100}.jpeg`} 
                    alt="Fresh produce" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-0 left-0 m-3">
                    <span className="badge badge-success">
                      {i === 1 ? '70% Complete' : i === 2 ? '45% Complete' : '25% Complete'}
                    </span>
                  </div>
                </div>
                
                <div className="p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {i === 1 ? 'Organic Avocados' : i === 2 ? 'Fresh Strawberries' : 'Heirloom Tomatoes'}
                      </h3>
                      <p className="text-sm text-gray-500 mb-2">
                        {i === 1 ? 'Ends in 2 days' : i === 2 ? 'Ends in 8 hours' : 'Ends in 3 days'}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <Star size={16} className="text-yellow-500 fill-current" />
                      <span className="text-sm font-medium ml-1">{4 + i * 0.1}</span>
                    </div>
                  </div>
                  
                  <div className="mt-3 mb-4">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: i === 1 ? '70%' : i === 2 ? '45%' : '25%' }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-gray-500">
                      <span>{i === 1 ? '14/20' : i === 2 ? '9/20' : '5/20'} participants</span>
                      <span>{i === 1 ? '$2.15/lb' : i === 2 ? '$3.25/box' : '$2.75/lb'}</span>
                    </div>
                  </div>
                  
                  <Link 
                    to={`/groups/${i}`} 
                    className="btn-primary w-full text-center flex items-center justify-center"
                  >
                    Join Group
                    <Users size={16} className="ml-2" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Farmers */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Featured Farmers</h2>
            <p className="mt-4 text-xl text-gray-600">
              Meet the producers who grow your food with care
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Sample Farmer Cards */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all">
                <div className="flex">
                  <div className="w-1/3">
                    <img 
                      src={`https://images.pexels.com/photos/${5000 + i * 100}/pexels-photo-${5000 + i * 100}.jpeg`}
                      alt={`Farmer ${i}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="w-2/3 p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {i === 1 ? 'Green Valley Farms' : i === 2 ? 'Sunshine Organics' : 'Heritage Roots'}
                    </h3>
                    <p className="text-sm text-gray-500 flex items-center mb-2">
                      <MapPin size={14} className="mr-1" />
                      {i === 1 ? 'California, USA' : i === 2 ? 'Ontario, Canada' : 'Oaxaca, Mexico'}
                    </p>
                    <div className="flex items-center mb-3">
                      {[...Array(5)].map((_, j) => (
                        <Star 
                          key={j} 
                          size={14} 
                          className={`${j < 4 ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
                        />
                      ))}
                      <span className="text-xs text-gray-500 ml-1">
                        ({i === 1 ? '234' : i === 2 ? '186' : '127'} reviews)
                      </span>
                    </div>
                    <Link 
                      to={`/farmers/${i}`}
                      className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center"
                    >
                      View Profile
                      <ArrowRight size={14} className="ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
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