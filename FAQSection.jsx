import React from 'react';
import { faqs } from '../mock';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';

const FAQSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="text-sm font-semibold text-teal-600 uppercase tracking-wider mb-3">
            Frequently Asked Questions
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Got Any Questions?
          </h2>
          <p className="text-lg text-gray-600">
            We've prepared a list of frequently asked questions and answers to help you get started. If you can't find what you're looking for, please reach out to us!
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-gray-50 rounded-lg px-6 border-none"
            >
              <AccordionTrigger className="text-left text-lg font-semibold text-gray-900 hover:text-teal-600 transition-colors py-6">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 leading-relaxed pb-6">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="text-center mt-8">
          <a
            href="/faq"
            className="text-teal-600 hover:text-teal-700 font-semibold inline-flex items-center group"
          >
            See All FAQs
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
          </a>
        </div>
      </div>
    </section>
  );
};

const ArrowRight = ({ className, size }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

export default FAQSection;
