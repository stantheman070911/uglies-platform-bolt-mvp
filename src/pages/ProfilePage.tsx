import React from 'react';

const ProfilePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-surface-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-elevation-2 p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-surface-900 mb-2">User Profile</h1>
            <p className="text-surface-600">
              Profile management will be fully implemented in Step 10.x
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-primary-50 p-6 rounded-lg border border-primary-200">
              <h3 className="text-lg font-semibold text-primary-700 mb-2">Farmer Profiles</h3>
              <p className="text-surface-600 text-sm">
                Farm information, product management, and earnings tracking
              </p>
            </div>
            
            <div className="bg-secondary-50 p-6 rounded-lg border border-secondary-200">
              <h3 className="text-lg font-semibold text-secondary-700 mb-2">Customer Profiles</h3>
              <p className="text-surface-600 text-sm">
                Purchase history, group participation, and preferences
              </p>
            </div>
            
            <div className="bg-tertiary-50 p-6 rounded-lg border border-tertiary-200">
              <h3 className="text-lg font-semibold text-tertiary-700 mb-2">Coordinator Profiles</h3>
              <p className="text-surface-600 text-sm">
                Community management and group coordination tools
              </p>
            </div>
          </div>

          <div className="mt-8 p-6 bg-surface-50 rounded-lg">
            <h3 className="text-lg font-semibold text-surface-900 mb-4">Planned Features</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="w-8 h-8 bg-primary-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
                  <div className="w-4 h-4 bg-primary-500 rounded"></div>
                </div>
                <span className="text-sm text-surface-600">Avatar Upload</span>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-secondary-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
                  <div className="w-4 h-4 bg-secondary-500 rounded"></div>
                </div>
                <span className="text-sm text-surface-600">Bio & Stories</span>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-tertiary-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
                  <div className="w-4 h-4 bg-tertiary-500 rounded"></div>
                </div>
                <span className="text-sm text-surface-600">Settings</span>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-success-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
                  <div className="w-4 h-4 bg-success-500 rounded"></div>
                </div>
                <span className="text-sm text-surface-600">Statistics</span>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <button 
              onClick={() => window.location.href = '/'}
              className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;