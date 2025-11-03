import { createContext, useContext, ReactNode } from 'react';

interface BrandingContextType {
  companyName: string;
  primaryColor: string;
  subdomain: string;
}

const BrandingContext = createContext<BrandingContextType>({
  companyName: '',
  primaryColor: '#FFFFFF', // Default white
  subdomain: '',
});

export function useBranding() {
  return useContext(BrandingContext);
}

interface BrandingProviderProps {
  children: ReactNode;
  companyName: string;
  primaryColor: string;
  subdomain: string;
}

export function BrandingProvider({ children, companyName, primaryColor, subdomain }: BrandingProviderProps) {
  return (
    <BrandingContext.Provider value={{ companyName, primaryColor, subdomain }}>
      {children}
    </BrandingContext.Provider>
  );
}