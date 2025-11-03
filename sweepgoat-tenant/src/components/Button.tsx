import { ButtonHTMLAttributes } from 'react';
import { useBranding } from '../context/BrandingContext';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  fullWidth?: boolean;
  loading?: boolean;
  useWhiteLabel?: boolean; // If true, uses the primary brand color
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  fullWidth = false,
  loading = false,
  useWhiteLabel = false,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  const { primaryColor } = useBranding();

  const baseStyles = 'inline-flex items-center justify-center font-light rounded transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';

  // If useWhiteLabel is true and we have a custom color, apply it to primary variant
  const shouldUseWhiteLabel = useWhiteLabel && variant === 'primary' && primaryColor !== '#FFFFFF';

  const variantStyles = {
    primary: shouldUseWhiteLabel ? '' : 'bg-white text-black hover:bg-zinc-200 active:bg-zinc-300',
    secondary: 'bg-zinc-800 text-white hover:bg-zinc-700',
    outline: 'border border-zinc-700 text-zinc-300 hover:border-white hover:text-white',
    ghost: 'text-zinc-400 hover:text-white',
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-xs min-h-[40px]',
    md: 'px-6 py-3 text-sm min-h-[44px]',
    lg: 'px-8 py-4 text-sm min-h-[48px]',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  // Custom inline styles for white label
  const whiteLabelStyles = shouldUseWhiteLabel ? {
    backgroundColor: primaryColor,
    color: '#000000',
  } : undefined;

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`}
      style={whiteLabelStyles}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
}