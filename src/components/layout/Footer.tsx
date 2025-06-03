import React from 'react';
import { Link } from 'react-router-dom';
import { MaterialButton } from '../ui/MaterialButton';
import { Sprout, Heart, Globe, Mail, Phone, MapPin } from 'lucide-react';

interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`bg-white border-t border-surface-200 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-secondary-500 to-primary-500 rounded-lg flex items-center justify-center">
                <Sprout className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-surface-900">UGLIES Platform</h3>
                <p className="text-sm text-surface-600">Connecting Local Agriculture Globally</p>
              </div>
            </div>
            <p className="text-surface-600 mb-4 max-w-md">
              Empowering agricultural communities through social commerce and group buying. 
              Supporting local farmers, delivering fresh produce, creating sustainable food systems worldwide.
            </p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-surface-500">
                <Sprout className="w-4 h-4 mr-1 text-secondary-500" />
                <span>Supporting Local Agriculture</span>
              </div>
              <div className="flex items-center text-sm text-surface-500">
                <Heart className="w-4 h-4 mr-1 text-error-500" />
                <span>Community Driven</span>
              </div>
              <div className="flex items-center text-sm text-surface-500">
                <Globe className="w-4 h-4 mr-1 text-primary-500" />
                <span>Global Impact</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-surface-900 mb-4">Platform</h4>
            <ul className="space-y-2">
              <li><Link to="/products" className="text-surface-600 hover:text-primary-600 text-sm">Browse Products</Link></li>
              <li><Link to="/groups" className="text-surface-600 hover:text-primary-600 text-sm">Join Groups</Link></li>
              <li><Link to="/farmers" className="text-surface-600 hover:text-primary-600 text-sm">Meet Farmers</Link></li>
              <li><Link to="/how-it-works" className="text-surface-600 hover:text-primary-600 text-sm">How It Works</Link></li>
              <li><Link to="/pricing" className="text-surface-600 hover:text-primary-600 text-sm">Pricing</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-surface-900 mb-4">Support</h4>
            <ul className="space-y-2 mb-4">
              <li><Link to="/help" className="text-surface-600 hover:text-primary-600 text-sm">Help Center</Link></li>
              <li><Link to="/contact" className="text-surface-600 hover:text-primary-600 text-sm">Contact Us</Link></li>
              <li><Link to="/faq" className="text-surface-600 hover:text-primary-600 text-sm">FAQ</Link></li>
              <li><Link to="/community" className="text-surface-600 hover:text-primary-600 text-sm">Community</Link></li>
            </ul>
            
            {/* Contact Info */}
            <div className="space-y-2">
              <div className="flex items-center text-xs text-surface-500">
                <Mail className="w-3 h-3 mr-2" />
                <span>hello@uglies.farm</span>
              </div>
              <div className="flex items-center text-xs text-surface-500">
                <Phone className="w-3 h-3 mr-2" />
                <span>1-800-UGLIES</span>
              </div>
              <div className="flex items-center text-xs text-surface-500">
                <MapPin className="w-3 h-3 mr-2" />
                <span>Global Agricultural Network</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-surface-100">
          <div className="flex flex-col md:flex-row items-center justify-between">
            
            {/* Copyright */}
            <div className="text-sm text-surface-500 mb-4 md:mb-0">
              © {currentYear} UGLIES Platform. Built with ❤️ for agricultural communities worldwide.
            </div>

            {/* Legal Links */}
            <div className="flex items-center space-x-6">
              <Link to="/privacy" className="text-sm text-surface-500 hover:text-primary-600">Privacy Policy</Link>
              <Link to="/terms" className="text-sm text-surface-500 hover:text-primary-600">Terms of Service</Link>
              <Link to="/cookies" className="text-sm text-surface-500 hover:text-primary-600">Cookie Policy</Link>
            </div>
          </div>

          {/* Agricultural Mission Statement */}
          <div className="mt-4 p-3 bg-gradient-to-r from-secondary-50 to-primary-50 rounded-lg">
            <p className="text-center text-sm text-surface-700">
              <Sprout className="w-4 h-4 inline mr-1 text-secondary-600" />
              Committed to supporting sustainable agriculture and building stronger farming communities through innovative technology.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};