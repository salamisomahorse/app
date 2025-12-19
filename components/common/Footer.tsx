
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <h3 className="text-xl font-bold">InsureNaija</h3>
            <p className="mt-2 text-gray-400 text-sm">
              Your trusted partner in securing what matters most. Fully digital, fully Nigerian.
            </p>
          </div>
          <div>
            <h4 className="font-semibold tracking-wider uppercase">Quick Links</h4>
            <ul className="mt-2 space-y-1 text-sm">
                <li><a href="#products" className="text-gray-400 hover:text-white">Products</a></li>
                <li><a href="#how-it-works" className="text-gray-400 hover:text-white">How It Works</a></li>
                <li><a href="#features" className="text-gray-400 hover:text-white">Features</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold tracking-wider uppercase">Contact Us</h4>
            <p className="mt-2 text-gray-400 text-sm">
              123 Insurance Avenue, Lagos, Nigeria<br/>
              support@insurenaija.com
            </p>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-6 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} InsureNaija. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
