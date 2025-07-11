import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface QuickAccessCardProps {
  title: string;
  icon: React.ReactNode;
  to: string;
  gradient?: string;
  textColor?: string;
}

const QuickAccessCard: React.FC<QuickAccessCardProps> = ({ 
  title, 
  icon, 
  to, 
  gradient = 'from-primary-50 to-secondary-50',
  textColor = 'text-primary-700'
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <Link 
      to={to}
      className={`relative overflow-hidden rounded-3xl shadow-md transition-all duration-300 ${
        isHovered ? 'shadow-lg transform scale-[1.02]' : 'shadow-sm'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`p-6 md:p-8 h-full bg-gradient-to-br ${gradient}`}>
        <div className={`flex flex-col items-start h-full`}>
          <div className={`${
            isHovered ? 'scale-110' : 'scale-100'
          } transition-transform duration-300 mb-4 p-3 rounded-full bg-white/80 backdrop-blur-sm`}>
            {icon}
          </div>
          <h3 className={`text-xl md:text-2xl font-bold mt-2 ${textColor} ${
            isHovered ? 'underline decoration-2 underline-offset-4' : ''
          }`}>
            {title}
          </h3>
        </div>
      </div>
    </Link>
  );
};

const QuickAccessCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="flex gap-6">
        <div className="flex-1">
          <QuickAccessCard 
            title="Food Options" 
            to="/food"
            gradient="from-rose-50 to-red-50"
            textColor="text-rose-700"
            icon={
              <div className="rounded-full bg-rose-100 p-2">
                <svg className="h-8 w-8 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
                </svg>
              </div>
            }
          />
        </div>
        <div className="flex-1">
          <QuickAccessCard 
            title="Accommodation Finder" 
            to="/accommodation"
            gradient="from-emerald-50 to-green-50"
            textColor="text-emerald-700"
            icon={
              <div className="rounded-full bg-emerald-100 p-2">
                <svg className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
                </svg>
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default QuickAccessCards;
