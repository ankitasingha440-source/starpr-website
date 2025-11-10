import React from 'react';
import { features } from '../mock';
import { CheckCircle, Network, Zap, Sparkles } from 'lucide-react';

const iconMap = {
  CheckCircle,
  Network,
  Zap,
  Sparkles
};

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 to-blue-800 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-300 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-purple-400 rounded-full blur-2xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-white/10 rounded-full px-4 py-2 mb-6">
            <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></div>
            <span className="text-white/80 text-sm font-medium uppercase tracking-wider">Features</span>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">
            Our state-of-the-art blockchain and crypto newswire platform
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => {
            const Icon = iconMap[feature.icon];
            return (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 group border border-white/20"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Icon className="text-white" size={24} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-white/80 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
