import React from 'react';

interface SlideTransitionProps {
  children: React.ReactNode;
  direction: 'left' | 'right';
  isVisible: boolean;
}

const SlideTransition: React.FC<SlideTransitionProps> = ({ 
  children, 
  direction, 
  isVisible 
}) => {
  return (
    <div 
      className={`transform transition-transform duration-300 ease-in-out ${
        isVisible 
          ? 'translate-x-0' 
          : direction === 'left' 
            ? '-translate-x-full' 
            : 'translate-x-full'
      }`}
    >
      {children}
    </div>
  );
};

export default SlideTransition;
