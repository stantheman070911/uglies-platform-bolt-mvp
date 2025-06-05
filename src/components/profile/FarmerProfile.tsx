import React from 'react';
import { MaterialButton } from '../ui/MaterialButton';
import {
  Leaf, Image, Plus, Award,
  Star, ShieldCheck
} from 'lucide-react';

interface FarmerProfileProps {
  isEditing: boolean;
  formData: {
    farmStory: string;
    certifications: string[];
    specialties: string[];
  };
  onFormChange: (field: string, value: any) => void;
  loading?: boolean;
  className?: string;
}

export const FarmerProfile: React.FC<FarmerProfileProps> = ({
  isEditing,
  formData,
  onFormChange,
  loading = false,
  className = ''
}) => {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Farm Story Section */}
      <div className="bg-white rounded-xl shadow-sm border border-surface-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Leaf className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-semibold text-surface-900">Farm Story</h3>
        </div>

        {isEditing ? (
          <textarea
            value={formData.farmStory}
            onChange={(e) => onFormChange('farmStory', e.target.value)}
            placeholder="Share your farming philosophy, methods, and what makes your produce special..."
            rows={6}
            className="w-full px-4 py-3 border border-surface-300 rounded-lg mb-4 focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
            disabled={loading}
          />
        ) : (
          <p className="text-surface-700 whitespace-pre-line">
            {formData.farmStory || (
              <span className="text-surface-500 italic">
                Share your farming story with customers...
              </span>
            )}
          </p>
        )}
      </div>

      {/* Certifications & Specialties */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-surface-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-surface-900">Certifications</h3>
          </div>
          <div className="space-y-2">
            {formData.certifications.length > 0 ? (
              formData.certifications.map((cert: string, index: number) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-2 bg-surface-50 rounded-lg"
                >
                  <Award className="w-4 h-4 text-yellow-600" />
                  <span className="text-surface-700">{cert}</span>
                </div>
              ))
            ) : (
              <p className="text-surface-500 italic">No certifications added yet</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-surface-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 text-yellow-600" />
            <h3 className="text-lg font-semibold text-surface-900">Specialties</h3>
          </div>
          <div className="space-y-2">
            {formData.specialties.length > 0 ? (
              formData.specialties.map((specialty: string, index: number) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-2 bg-surface-50 rounded-lg"
                >
                  <Leaf className="w-4 h-4 text-green-600" />
                  <span className="text-surface-700">{specialty}</span>
                </div>
              ))
            ) : (
              <p className="text-surface-500 italic">No specialties added yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Photo Gallery */}
      <div className="bg-white rounded-xl shadow-sm border border-surface-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Image className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-surface-900">Farm Gallery</h3>
          </div>
          {isEditing && (
            <MaterialButton
              variant="outlined"
              size="small"
              iconType="plus"
              icon="leading"
              disabled={loading}
            >
              Add Photos
            </MaterialButton>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="aspect-square bg-surface-100 rounded-lg flex items-center justify-center"
            >
              <Plus className="w-6 h-6 text-surface-400" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FarmerProfile;