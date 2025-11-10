import React from 'react';
import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';

const GuaranteedSection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-6">
          Guaranteed Media Coverage for You
        </h2>
        <p className="text-xl text-gray-600 mb-10 leading-relaxed">
          We have been working in the crypto space with hundreds of companies. Our goal is to combine our platform with the latest crypto news, and provide guaranteed coverage effortlessly.
        </p>
        <Button
          size="lg"
          className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
        >
          Submit A Press Release
          <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
        </Button>
      </div>
    </section>
  );
};

export default GuaranteedSection;
