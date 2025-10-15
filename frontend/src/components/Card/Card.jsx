import React from 'react';
import { ArrowRight } from 'lucide-react';

const Card = ({ title, onClick, icon: Icon }) => {
  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 overflow-hidden"
    >
      <div className="p-8">
        {/* Icon */}
        {Icon && (
          <div className="w-16 h-16 bg-teal-50 rounded-lg flex items-center justify-center mb-6 group-hover:bg-teal-600 transition-colors duration-300">
            <Icon className="w-8 h-8 text-teal-600 group-hover:text-white transition-colors duration-300" />
          </div>
        )}
        
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-800 mb-3">
          {title}
        </h3>
        
        {/* Arrow */}
        <div className="flex items-center text-teal-600 group-hover:text-teal-700 transition-colors duration-300">
          <span className="text-sm font-medium mr-2">View Details</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
        </div>
      </div>
    </div>
  );
};

export default Card;