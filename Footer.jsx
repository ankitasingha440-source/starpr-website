import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const footerLinks = {
    Company: ['About', 'Blog', 'Careers', 'Press Kit'],
    Resources: ['Pricing', 'FAQ', 'How to Write a Press Release', 'Contact'],
    Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy'],
    Connect: ['Twitter', 'LinkedIn', 'Telegram', 'Discord']
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          {/* Logo and Description */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl font-bold text-white">CHAINWIRE</span>
              <div className="flex space-x-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-teal-500"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-teal-400"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-teal-300"></div>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              The leading blockchain and crypto press release distribution service.
            </p>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-white font-semibold mb-4">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <Link
                      to="#"
                      className="text-sm text-gray-400 hover:text-teal-400 transition-colors"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} Chainwire. All rights reserved.
            </p>
            <div className="flex items-center space-x-6">
              <span className="text-sm text-gray-400">Made with precision</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
