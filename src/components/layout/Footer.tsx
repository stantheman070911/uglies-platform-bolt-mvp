import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Facebook, Twitter, Instagram, 
  Youtube, Mail, Phone, MapPin 
} from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">About UGLIES</h3>
            <p className="text-gray-600 mb-4">
              Connecting farmers and consumers globally through sustainable agricultural commerce.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-green-600">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-green-600">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-green-600">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-green-600">
                <Youtube size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-600 hover:text-green-600">About Us</Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-gray-600 hover:text-green-600">How It Works</Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-600 hover:text-green-600">Blog</Link>
              </li>
              <li>
                <Link to="/careers" className="text-gray-600 hover:text-green-600">Careers</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-green-600">Contact Us</Link>
              </li>
            </ul>
          </div>
          
          {/* For Farmers/Consumers */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">For You</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/for-farmers" className="text-gray-600 hover:text-green-600">For Farmers</Link>
              </li>
              <li>
                <Link to="/for-consumers" className="text-gray-600 hover:text-green-600">For Consumers</Link>
              </li>
              <li>
                <Link to="/for-coordinators" className="text-gray-600 hover:text-green-600">For Coordinators</Link>
              </li>
              <li>
                <Link to="/help-center" className="text-gray-600 hover:text-green-600">Help Center</Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-600 hover:text-green-600">FAQ</Link>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin size={20} className="text-green-600 flex-shrink-0 mt-1" />
                <span className="text-gray-600">
                  123 Farm Road, Agricultural District, CA 92101, USA
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={20} className="text-green-600 flex-shrink-0" />
                <span className="text-gray-600">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={20} className="text-green-600 flex-shrink-0" />
                <span className="text-gray-600">info@ugliesplatform.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom bar */}
        <div className="border-t border-gray-200 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} UGLIES Platform. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link to="/privacy" className="text-gray-600 hover:text-green-600 text-sm">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-gray-600 hover:text-green-600 text-sm">
              Terms of Service
            </Link>
            <Link to="/cookies" className="text-gray-600 hover:text-green-600 text-sm">
              Cookies Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;