import React from 'react';
import { Button } from './ui/button';
import { ArrowRight, ChevronDown } from 'lucide-react';

const Hero = () => {
  const scrollToNext = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20">
      {/* Decorative blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-20 w-80 h-80 bg-teal-200/30 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Crypto & Blockchain Press Release Distribution Platform
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Broadcast your crypto & blockchain news with guaranteed coverage, in industry-leading publications.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                GET STARTED
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 px-8 py-6 text-lg font-semibold"
              >
                BOOK A DEMO
              </Button>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-6 pt-4">
              <div className="flex items-center space-x-2 bg-white rounded-lg px-4 py-3 shadow-md">
                <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center text-white font-bold text-sm">
                  PH
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase">Product Hunt</div>
                  <div className="text-sm font-bold text-gray-900">#2 Product of the Week</div>
                </div>
              </div>
              <div className="flex items-center space-x-2 bg-white rounded-lg px-4 py-3 shadow-md">
                <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center text-white font-bold text-lg">
                  G2
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-900">4.9</div>
                  <div className="flex text-yellow-400 text-xs">
                    {'★'.repeat(5)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Network Diagram */}
          <div className="relative hidden lg:block">
            <div className="relative w-full h-[500px]">
              {/* Center circle */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-40 h-40 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 shadow-2xl flex items-center justify-center">
                  <div className="text-white font-bold text-center">
                    <div className="text-xs uppercase tracking-wider">The</div>
                    <div className="text-xl">CHAINWIRE</div>
                  </div>
                </div>
              </div>

              {/* Publisher nodes */}
              {[
                { name: 'Cointelegraph', angle: 0, color: 'blue' },
                { name: 'CoinDesk', angle: 45, color: 'orange' },
                { name: 'Invezz', angle: 90, color: 'purple' },
                { name: 'Bitcoin.com', angle: 135, color: 'green' },
                { name: 'The Block', angle: 180, color: 'gray' },
                { name: 'Decrypt', angle: 225, color: 'indigo' },
                { name: 'CryptoSlate', angle: 270, color: 'red' },
                { name: 'Cryptopolitan', angle: 315, color: 'teal' }
              ].map((publisher, index) => {
                const radius = 180;
                const radian = (publisher.angle * Math.PI) / 180;
                const x = Math.cos(radian) * radius;
                const y = Math.sin(radian) * radius;

                return (
                  <div key={index}>
                    {/* Connecting line */}
                    <svg
                      className="absolute top-1/2 left-1/2 pointer-events-none"
                      style={{
                        width: '100%',
                        height: '100%',
                        transform: 'translate(-50%, -50%)'
                      }}
                    >
                      <line
                        x1="50%"
                        y1="50%"
                        x2={`calc(50% + ${x}px)`}
                        y2={`calc(50% + ${y}px)`}
                        stroke="#14B8A6"
                        strokeWidth="2"
                        strokeDasharray="5,5"
                        opacity="0.3"
                      />
                    </svg>

                    {/* Publisher node */}
                    <div
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                      style={{
                        transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`
                      }}
                    >
                      <div className="bg-white rounded-lg shadow-lg px-3 py-2 text-xs font-semibold text-gray-700 whitespace-nowrap hover:shadow-xl transition-shadow">
                        {publisher.name}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={scrollToNext}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer"
        aria-label="Scroll down"
      >
        <ChevronDown size={32} className="text-gray-400" />
      </button>
    </section>
  );
};

export default Hero;
