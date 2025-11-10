import React from 'react';
import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';
import { partnerLogos } from '../mock';

const NewswireSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-gray-900 leading-tight">
                Meet the Top Newswire for Crypto: Chainwire
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Our blockchain and crypto wire service guarantees media coverage thanks to direct integrations with our crypto publication partners. Get your story seen from the moment it's released.
              </p>
            </div>

            <ul className="space-y-4">
              {[
                'Select the time you want to launch',
                'Choose your preferred distribution package',
                'Watch the coverage instantly roll in'
              ].map((item, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-teal-600"></div>
                    </div>
                  </div>
                  <span className="text-lg text-gray-700">{item}</span>
                </li>
              ))}
            </ul>

            <Button
              size="lg"
              className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              Get Press
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </Button>
          </div>

          {/* Right Content - Partner Logos */}
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-xl border border-gray-100">
              <div className="grid grid-cols-2 gap-6">
                {partnerLogos.map((partner, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow flex items-center justify-center"
                  >
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      className="h-8 w-auto object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewswireSection;
