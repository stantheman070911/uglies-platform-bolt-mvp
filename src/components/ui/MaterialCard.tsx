import React, { forwardRef, HTMLAttributes } from 'react';
import { MoreVertical, Heart, Share2, Bookmark, ExternalLink, MapPin, Users, Clock, Star } from 'lucide-react';

interface MaterialCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'elevated' | 'filled' | 'outlined';
  elevation?: 0 | 1 | 2 | 3 | 4 | 5;
  padding?: 'none' | 'small' | 'medium' | 'large';
  rounded?: 'none' | 'small' | 'medium' | 'large';
  interactive?: boolean;
  header?: React.ReactNode;
  media?: React.ReactNode;
  footer?: React.ReactNode;
  actions?: React.ReactNode;
  badge?: React.ReactNode;
  overlay?: React.ReactNode;
  aspectRatio?: '1:1' | '4:3' | '16:9' | '3:2' | 'auto';
  hoverEffect?: 'none' | 'lift' | 'glow' | 'scale';
  loading?: boolean;
  testId?: string;
}

export const MaterialCard = forwardRef<HTMLDivElement, MaterialCardProps>(({
  variant = 'elevated',
  elevation = 1,
  padding = 'medium',
  rounded = 'medium',
  interactive = false,
  header,
  media,
  footer,
  actions,
  badge,
  overlay,
  aspectRatio = 'auto',
  hoverEffect = 'none',
  loading = false,
  testId = 'material-card',
  children,
  className = '',
  onClick,
  ...props
}, ref) => {
  
  // Variant configurations
  const variantClasses = {
    elevated: 'bg-white shadow-elevation-1',
    filled: 'bg-surface-100',
    outlined: 'bg-white border border-surface-300'
  };

  // Elevation configurations
  const elevationClasses = {
    0: 'shadow-none',
    1: 'shadow-elevation-1',
    2: 'shadow-elevation-2',
    3: 'shadow-elevation-3',
    4: 'shadow-elevation-4',
    5: 'shadow-elevation-5'
  };

  // Padding configurations
  const paddingClasses = {
    none: 'p-0',
    small: 'p-3',
    medium: 'p-4',
    large: 'p-6'
  };

  // Rounded configurations
  const roundedClasses = {
    none: 'rounded-none',
    small: 'rounded-sm',
    medium: 'rounded-lg',
    large: 'rounded-xl'
  };

  // Aspect ratio configurations
  const aspectRatioClasses = {
    '1:1': 'aspect-square',
    '4:3': 'aspect-[4/3]',
    '16:9': 'aspect-video',
    '3:2': 'aspect-[3/2]',
    'auto': ''
  };

  // Hover effect configurations
  const hoverEffectClasses = {
    none: '',
    lift: 'hover:transform hover:-translate-y-1 hover:shadow-lg transition-all duration-300',
    glow: 'hover:shadow-primary-lg hover:border-primary-300 transition-all duration-300',
    scale: 'hover:transform hover:scale-105 transition-all duration-300'
  };

  // Interactive configurations
  const interactiveClasses = interactive 
    ? 'cursor-pointer transition-all duration-200 ease-out' 
    : '';

  // Loading skeleton
  if (loading) {
    return (
      <div 
        className={`
          ${variantClasses[variant]}
          ${roundedClasses[rounded]}
          ${paddingClasses[padding]}
          ${className}
        `}
        data-testid={`${testId}-loading`}
      >
        <div className="animate-pulse">
          {media && (
            <div className={`bg-surface-200 ${aspectRatioClasses[aspectRatio]} mb-4 rounded`} />
          )}
          <div className="space-y-3">
            <div className="h-4 bg-surface-200 rounded w-3/4" />
            <div className="h-4 bg-surface-200 rounded w-1/2" />
            <div className="h-4 bg-surface-200 rounded w-5/6" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={`
        relative overflow-hidden
        ${variantClasses[variant]}
        ${variant === 'elevated' ? elevationClasses[elevation] : ''}
        ${roundedClasses[rounded]}
        ${interactiveClasses}
        ${hoverEffectClasses[hoverEffect]}
        ${className}
      `}
      onClick={onClick}
      data-testid={testId}
      {...props}
    >
      {/* Badge */}
      {badge && (
        <div className="absolute top-3 right-3 z-10">
          {badge}
        </div>
      )}

      {/* Media Section */}
      {media && (
        <div className={`relative ${aspectRatioClasses[aspectRatio]} overflow-hidden`}>
          {media}
          {overlay && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-4">
              {overlay}
            </div>
          )}
        </div>
      )}

      {/* Header Section */}
      {header && (
        <div className={`${media ? 'p-4 pb-0' : paddingClasses[padding]} ${footer || actions ? 'pb-2' : ''}`}>
          {header}
        </div>
      )}

      {/* Content Section */}
      {children && (
        <div className={`${(media || header) ? 'px-4 pb-4' : paddingClasses[padding]} ${(header && !media) ? 'pt-0' : ''}`}>
          {children}
        </div>
      )}

      {/* Footer Section */}
      {footer && (
        <div className="px-4 pb-4 pt-2">
          {footer}
        </div>
      )}

      {/* Actions Section */}
      {actions && (
        <div className="px-4 py-3 bg-surface-50 border-t border-surface-100 rounded-b-lg">
          {actions}
        </div>
      )}
    </div>
  );
});

MaterialCard.displayName = 'MaterialCard';

// Pre-configured variants for UGLIES Platform
export const ProductCard = ({ 
  product, 
  onLike, 
  onShare, 
  onViewDetails,
  ...props 
}: {
  product: any;
  onLike?: () => void;
  onShare?: () => void;
  onViewDetails?: () => void;
} & Omit<MaterialCardProps, 'media' | 'badge' | 'actions'>) => (
  <MaterialCard
    variant="elevated"
    hoverEffect="lift"
    interactive
    onClick={onViewDetails}
    media={
      <img 
        src={product.images?.[0] || '/placeholder-product.jpg'} 
        alt={product.name}
        className="w-full h-full object-cover"
      />
    }
    badge={
      product.quality_grade === 'premium' ? (
        <span className="bg-tertiary-500 text-white px-2 py-1 rounded-full text-xs font-medium">
          Premium
        </span>
      ) : product.organic_certified ? (
        <span className="bg-secondary-500 text-white px-2 py-1 rounded-full text-xs font-medium">
          Organic
        </span>
      ) : null
    }
    actions={
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button 
            onClick={(e) => { e.stopPropagation(); onLike?.(); }}
            className="p-1 hover:bg-surface-100 rounded transition-colors"
          >
            <Heart className="w-4 h-4 text-surface-400" />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onShare?.(); }}
            className="p-1 hover:bg-surface-100 rounded transition-colors"
          >
            <Share2 className="w-4 h-4 text-surface-400" />
          </button>
        </div>
        <span className="text-primary-600 font-bold text-lg">
          ${product.price.toFixed(2)}
        </span>
      </div>
    }
    {...props}
  >
    <div className="space-y-2">
      <h3 className="font-semibold text-surface-900 line-clamp-1">{product.name}</h3>
      <p className="text-surface-600 text-sm line-clamp-2">{product.description}</p>
      <div className="flex items-center text-xs text-surface-500">
        <MapPin className="w-3 h-3 mr-1" />
        <span className="capitalize">{product.location?.address || 'Location not specified'}</span>
      </div>
    </div>
  </MaterialCard>
);

export const GroupCard = ({ 
  group, 
  onJoin, 
  onViewDetails,
  ...props 
}: {
  group: any;
  onJoin?: () => void;
  onViewDetails?: () => void;
} & Omit<MaterialCardProps, 'actions'>) => {
  const progress = Math.min(100, (group.current_quantity / group.target_quantity) * 100);
  const timeLeft = new Date(group.end_date).getTime() - new Date().getTime();
  const hoursLeft = Math.max(0, Math.floor(timeLeft / (1000 * 60 * 60)));

  return (
    <MaterialCard
      variant="elevated"
      hoverEffect="glow"
      interactive
      onClick={onViewDetails}
      className="border-l-4 border-secondary-500"
      actions={
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-surface-600">
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              <span>{group.current_participants}/{group.max_participants}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span>{hoursLeft}h left</span>
            </div>
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); onJoin?.(); }}
            className="bg-secondary-500 hover:bg-secondary-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Join Group
          </button>
        </div>
      }
      {...props}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-surface-900 line-clamp-1">{group.name}</h3>
          <span className={`
            px-2 py-1 rounded-full text-xs font-medium
            ${group.status === 'active' ? 'bg-secondary-100 text-secondary-800' : 'bg-primary-100 text-primary-800'}
          `}>
            {group.status}
          </span>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-surface-600">Progress</span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-surface-200 rounded-full h-2">
            <div 
              className="bg-secondary-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-surface-600">Current Price</span>
          <span className="font-bold text-lg text-primary-600">${group.unit_price.toFixed(2)}</span>
        </div>
      </div>
    </MaterialCard>
  );
};

export const FarmerCard = ({ 
  farmer, 
  onViewProfile,
  ...props 
}: {
  farmer: any;
  onViewProfile?: () => void;
} & Omit<MaterialCardProps, 'header' | 'media'>) => (
  <MaterialCard
    variant="outlined"
    interactive
    onClick={onViewProfile}
    hoverEffect="lift"
    header={
      <div className="flex items-center space-x-3">
        <img 
          src={farmer.avatar_url || '/placeholder-avatar.jpg'} 
          alt={farmer.display_name}
          className="w-12 h-12 rounded-full object-cover border-2 border-secondary-100"
        />
        <div className="flex-1">
          <h3 className="font-semibold text-surface-900">{farmer.display_name}</h3>
          <div className="flex items-center text-sm text-surface-500">
            <MapPin className="w-3 h-3 mr-1" />
            <span className="capitalize">{farmer.location?.address || 'Location not specified'}</span>
          </div>
        </div>
        <div className="flex items-center">
          <Star className="w-4 h-4 text-tertiary-500 mr-1" />
          <span className="text-sm font-medium">4.8</span>
        </div>
      </div>
    }
    {...props}
  >
    {farmer.bio && (
      <p className="text-surface-600 text-sm line-clamp-3">{farmer.bio}</p>
    )}
  </MaterialCard>
);