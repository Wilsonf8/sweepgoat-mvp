import React from 'react';

interface SectionProps {
  id?: string;
  children: React.ReactNode;
  className?: string;
  background?: 'white' | 'gray' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
}

export const Section: React.FC<SectionProps> = ({
  id,
  children,
  className = '',
  background = 'white',
  size = 'md',
}) => {
  const bgStyles = {
    white: 'bg-black',
    gray: 'bg-gray-900',
    gradient: 'bg-gradient-to-br from-gray-900 via-black to-purple-950',
  };

  const sizeStyles = {
    sm: 'py-12 md:py-16',
    md: 'py-16 md:py-24',
    lg: 'py-24 md:py-32',
  };

  return (
    <section
      id={id}
      className={`${bgStyles[background]} ${sizeStyles[size]} ${className}`}
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
        {children}
      </div>
    </section>
  );
};