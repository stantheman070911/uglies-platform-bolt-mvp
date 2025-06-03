import React, { forwardRef, HTMLAttributes } from 'react';
import { MoreVertical, Heart, Share2, Bookmark, ExternalLink } from 'lucide-react';

interface MaterialCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'elevated' | 'filled' | 'outlined';
  elevation?: 0 | 1 | 2 | 3 | 4 | 5;
  padding?: 'none' | 'small' | 'medium' | 'large' | 'xl';
  rounded?: 'none' | 'small' | 'medium' | 'large' | 'xl';
  interactive?: boolean;
  header?: React.ReactNode;
  media?: React.ReactNode;
  footer?: React.ReactNode;
  actions?: React.ReactNode;
  menu?: React.ReactNode;
  badge?: React.ReactNode;
  overlay?: React.ReactNode;
  aspectRatio?: '1:1' | '4:3' | '16:9' | '3:2' | 'auto';
  hoverEffect?: 'none' | 'lift' | 'glow' | 'scale' | 'shadow';
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
  menu,
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
    elevated: 'bg-white',
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
    large: 'p-6',
    xl: 'p-8'
  };

  // Rounded configurations
  const roundedClasses = {
    none: 'rounded-none',
    small: 'rounded-sm',
    medium: 'rounded-lg',
    large: 'rounded-xl',
    xl: 'rounded-2xl'
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
    lift: 'hover:transform hover:-translate-y-1 hover:shadow-lg',
    glow: 'hover:shadow-primary-lg hover:border-primary-300',
    scale: 'hover:transform hover:scale-105',
    shadow: 'hover:shadow-elevation-3'
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
          ${elevationClasses[elevation]}
          ${roundedClasses[rounded]}
          ${paddingClasses[padding]}
          ${className}
        `}
        data-testid={`${testId}-loading`}
      >
        <div className="animate-pulse">
          {media && (
            <div className={`bg-surface-200 ${aspectRatioClasses[aspectRatio]} mb-4`} />
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
        ${elevationClasses[elevation]}
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

      {/* Menu */}
      {menu && (
        <div className="absolute top-3 right-3 z-20">
          {menu}
        </div>
      )}

      {/* Media Section */}
      {media && (
        <div className={`relative ${aspectRatioClasses[aspectRatio]} overflow-hidden`}>
          {media}
          {overlay && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent">
              {overlay}
            </div>
          )}
        </div>
      )}

      {/* Header Section */}
      {header && (
        <div className={`${media ? 'p-4 pb-0' : paddingClasses[padding]} border-b border-surface-100`}>
          {header}
        </div>
      )}

      {/* Content Section */}
      {children && (
        <div className={media || header ? 'p-4' : paddingClasses[padding]}>
          {children}
        </div>
      )}

      {/* Footer Section */}
      {footer && (
        <div className={`${paddingClasses[padding]} pt-0 border-t border-surface-100`}>
          {footer}
        </div>
      )}

      {/* Actions Section */}
      {actions && (
        <div className="px-4 py-3 bg-surface-50 border-t border-surface-100">
          {actions}
        </div>
      )}
    </div>
  );
});

MaterialCard.displayName = 'MaterialCard';

// Pre-configured card variants
export const ProductCard = ({ product, onLike, onShare, ...props }: any) => (
  <MaterialCard
    variant="elevated"
    hoverEffect="lift"
    interactive
    media={
      <img 
        src={product.images?.[0] || '/placeholder-product.jpg'} 
        alt={product.name}
        className="w-full h-full object-cover"
      />
    }
    badge={
      product.organic_certified && (
        <span className="bg-secondary-500 text-white px-2 py-1 rounded-full text-xs font-medium">
          Organic
        </span>
      )
    }
    actions={
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button onClick={onLike} className="p-1 hover:bg-surface-100 rounded">
            <Heart className="w-4 h-4 text-surface-400" />
          </button>
          <button onClick={onShare} className="p-1 hover:bg-surface-100 rounded">
            <Share2 className="w-4 h-4 text-surface-400" />
          </button>
        </div>
        <span className="text-primary-600 font-bold text-lg">
          ${product.price}
        </span>
      </div>
    }
    {...props}
  >
    <h3 className="font-semibold text-surface-900 mb-1">{product.name}</h3>
    <p className="text-surface-600 text-sm line-clamp-2">{product.description}</p>
  </MaterialCard>
);

export const GroupCard = ({ group, onJoin, ...props }: any) => (
  <MaterialCard
    variant="elevated"
    hoverEffect="glow"
    border={`border-l-4 border-${group.status === 'active' ? 'secondary' : 'primary'}-500`}
    {...props}
  >
    <div className="flex items-start justify-between mb-3">
      <h3 className="font-semibold text-surface-900">{group.title}</h3>
      <span className={`
        px-2 py-1 rounded-full text-xs font-medium
        ${group.status === 'active' ? 'bg-secondary-100 text-secondary-800' : 'bg-primary-100 text-primary-800'}
      `}>
        {group.status}
      </span>
    </div>
    
    <p className="text-surface-600 text-sm mb-4">{group.description}</p>
    
    <div className="space-y-2 mb-4">
      <div className="flex justify-between text-sm">
        <span>Progress</span>
        <span>{group.current_quantity}/{group.target_quantity}</span>
      </div>
      <div className="w-full bg-surface-200 rounded-full h-2">
        <div 
          className="bg-secondary-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${Math.min(100, (group.current_quantity / group.target_quantity) * 100)}%` }}
        />
      </div>
    </div>

    <button 
      onClick={onJoin}
      className="w-full bg-primary-500 hover:bg-primary-600 text-white py-2 rounded-lg transition-colors"
    >
      Join Group
    </button>
  </MaterialCard>
);

export const ProfileCard = ({ user, ...props }: any) => (
  <MaterialCard
    variant="outlined"
    header={
      <div className="flex items-center space-x-3">
        <img 
          src={user.avatar_url || '/placeholder-avatar.jpg'} 
          alt={user.display_name}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <h3 className="font-semibold text-surface-900">{user.display_name}</h3>
          <span className="text-surface-500 text-sm capitalize">{user.role}</span>
        </div>
      </div>
    }
    {...props}
  >
    {user.bio && (
      <p className="text-surface-600 text-sm">{user.bio}</p>
    )}
  </MaterialCard>
);