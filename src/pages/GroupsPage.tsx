import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, MapPin, Calendar, ArrowRight, Filter, Search } from 'lucide-react';
import { demoGroups } from '@/data';

const GroupsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Group Buys</h1>
        <p className="text-lg text-gray-600 max-w-3xl">
          Join other buyers to unlock wholesale prices on fresh, organic produce. The more people join, the lower the price gets!
        </p>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search group buys..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="flex gap-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            <option value="vegetables">Vegetables</option>
            <option value="fruits">Fruits</option>
            <option value="grains">Grains</option>
            <option value="dairy">Dairy</option>
          </select>
          
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter size={20} />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {demoGroups.map((group) => (
          <div key={group.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
            {/* Group Image */}
            <div className="relative h-48">
              <img
                src={`https://images.pexels.com/photos/${3000 + parseInt(group.id) * 100}/pexels-photo-${3000 + parseInt(group.id) * 100}.jpeg`}
                alt={group.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded-full">
                  {Math.round((group.currentQuantity / group.targetQuantity) * 100)}% Complete
                </span>
              </div>
            </div>

            {/* Group Info */}
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {group.name}
              </h3>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center text-gray-600">
                  <Users size={18} className="mr-2" />
                  <span>{group.currentParticipants}/{group.maxParticipants} participants</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <MapPin size={18} className="mr-2" />
                  <span>{group.location.address}</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <Calendar size={18} className="mr-2" />
                  <span>Ends in {new Date(group.endDate).getDate() - new Date().getDate()} days</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <span className="text-gray-600">Current Price</span>
                    <div className="text-2xl font-bold text-gray-900">
                      ${group.discountUnitPrice.toFixed(2)}
                      <span className="text-sm text-gray-500 line-through ml-2">
                        ${group.unitPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-green-600 font-medium">
                      Save {Math.round(((group.unitPrice - group.discountUnitPrice) / group.unitPrice) * 100)}%
                    </span>
                  </div>
                </div>

                <Link
                  to={`/groups/${group.id}`}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center transition-colors"
                >
                  View Group
                  <ArrowRight size={18} className="ml-2" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Group CTA */}
      <div className="mt-12 bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-8 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Start Your Own Group Buy</h2>
          <p className="text-green-100 mb-6">
            Create a group buy for your favorite products and invite others to join. The more people join, the more everyone saves!
          </p>
          <Link
            to="/groups/create"
            className="inline-flex items-center bg-white text-green-700 font-medium px-6 py-3 rounded-lg hover:bg-green-50 transition-colors"
          >
            Create a Group
            <ArrowRight size={18} className="ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GroupsPage;