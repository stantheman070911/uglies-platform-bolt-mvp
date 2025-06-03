import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Users, Calendar, DollarSign, Target, MapPin } from 'lucide-react';

interface CreateGroupForm {
  name: string;
  description: string;
  targetQuantity: number;
  unitPrice: number;
  discountUnitPrice: number;
  minParticipants: number;
  maxParticipants: number;
  startDate: string;
  endDate: string;
  location: string;
}

const CreateGroupPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<CreateGroupForm>();

  const onSubmit = async (data: CreateGroupForm) => {
    setIsSubmitting(true);
    try {
      // TODO: Implement group creation logic
      console.log('Form data:', data);
      navigate('/groups');
    } catch (error) {
      console.error('Error creating group:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Create a New Group Buy</h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Group Name
            </label>
            <input
              type="text"
              id="name"
              className="mt-1 form-input"
              placeholder="e.g., Organic Avocados Group Buy"
              {...register('name', { required: 'Group name is required' })}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              rows={3}
              className="mt-1 form-input"
              placeholder="Describe your group buy..."
              {...register('description', { required: 'Description is required' })}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          {/* Quantity and Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="targetQuantity" className="block text-sm font-medium text-gray-700">
                Target Quantity
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Target size={18} className="text-gray-400" />
                </div>
                <input
                  type="number"
                  id="targetQuantity"
                  className="form-input pl-10"
                  placeholder="100"
                  {...register('targetQuantity', { 
                    required: 'Target quantity is required',
                    min: { value: 1, message: 'Must be greater than 0' }
                  })}
                />
              </div>
              {errors.targetQuantity && (
                <p className="mt-1 text-sm text-red-600">{errors.targetQuantity.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="unitPrice" className="block text-sm font-medium text-gray-700">
                Unit Price
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign size={18} className="text-gray-400" />
                </div>
                <input
                  type="number"
                  id="unitPrice"
                  step="0.01"
                  className="form-input pl-10"
                  placeholder="2.99"
                  {...register('unitPrice', { 
                    required: 'Unit price is required',
                    min: { value: 0.01, message: 'Must be greater than 0' }
                  })}
                />
              </div>
              {errors.unitPrice && (
                <p className="mt-1 text-sm text-red-600">{errors.unitPrice.message}</p>
              )}
            </div>
          </div>

          {/* Participants */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="minParticipants" className="block text-sm font-medium text-gray-700">
                Minimum Participants
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Users size={18} className="text-gray-400" />
                </div>
                <input
                  type="number"
                  id="minParticipants"
                  className="form-input pl-10"
                  placeholder="5"
                  {...register('minParticipants', { 
                    required: 'Minimum participants is required',
                    min: { value: 2, message: 'Must be at least 2' }
                  })}
                />
              </div>
              {errors.minParticipants && (
                <p className="mt-1 text-sm text-red-600">{errors.minParticipants.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="maxParticipants" className="block text-sm font-medium text-gray-700">
                Maximum Participants
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Users size={18} className="text-gray-400" />
                </div>
                <input
                  type="number"
                  id="maxParticipants"
                  className="form-input pl-10"
                  placeholder="20"
                  {...register('maxParticipants', { 
                    required: 'Maximum participants is required',
                    min: { value: 2, message: 'Must be at least 2' }
                  })}
                />
              </div>
              {errors.maxParticipants && (
                <p className="mt-1 text-sm text-red-600">{errors.maxParticipants.message}</p>
              )}
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                Start Date
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar size={18} className="text-gray-400" />
                </div>
                <input
                  type="datetime-local"
                  id="startDate"
                  className="form-input pl-10"
                  {...register('startDate', { required: 'Start date is required' })}
                />
              </div>
              {errors.startDate && (
                <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                End Date
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar size={18} className="text-gray-400" />
                </div>
                <input
                  type="datetime-local"
                  id="endDate"
                  className="form-input pl-10"
                  {...register('endDate', { required: 'End date is required' })}
                />
              </div>
              {errors.endDate && (
                <p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>
              )}
            </div>
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              Pickup Location
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                id="location"
                className="form-input pl-10"
                placeholder="Enter pickup location"
                {...register('location', { required: 'Location is required' })}
              />
            </div>
            {errors.location && (
              <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/groups')}
              className="btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary"
            >
              {isSubmitting ? 'Creating...' : 'Create Group'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupPage;