import React from 'react';
import { publishers } from '../mock';

const PublishersSection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Distribute Your News to These Crypto News Sites
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            At Chainwire, we're proud of our publishing ecosystem that we've developed over the last decade. Our partners are top-notch blockchain and crypto news websites. Each website is directly connected to the Chainwire system so every release gets guaranteed coverage.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {publishers.map((publisher, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-6 shadow-sm hover:shadow-lg transition-all duration-300 flex items-center justify-center group cursor-pointer border border-gray-100 hover:border-teal-200"
            >
              <span className="text-sm font-semibold text-gray-700 group-hover:text-teal-600 transition-colors text-center">
                {publisher}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PublishersSection;
