import React from 'react';
import { useParams } from 'react-router-dom';

const GroupDetailsPage = () => {
  const { id } = useParams();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Group Details</h1>
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b pb-4">
            <span className="text-gray-600">Group ID:</span>
            <span className="font-medium text-gray-900">{id}</span>
          </div>
          {/* Placeholder for group details - to be implemented */}
          <div className="bg-gray-50 rounded-md p-4 text-center">
            <p className="text-gray-600">Group details will be displayed here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupDetailsPage;