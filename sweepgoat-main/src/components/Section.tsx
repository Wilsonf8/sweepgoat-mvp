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
    gray: 'bg-zinc-950',
    gradient: 'bg-black',
  };

  const sizeStyles = {
    sm: 'py-16 md:py-20',
    md: 'py-20 md:py-32',
    lg: 'py-32 md:py-40',
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