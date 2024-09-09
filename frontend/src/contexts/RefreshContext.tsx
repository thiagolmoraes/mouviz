import React, { createContext, useContext, useState, ReactNode } from 'react';

interface RefreshContextProps {
  refresh: boolean;
  setRefresh: (value: boolean) => void;
}

interface RefreshProviderProps {
  children: ReactNode;
}

const RefreshContext = createContext<RefreshContextProps | undefined>(undefined);

export const RefreshProvider: React.FC<RefreshProviderProps> = ({ children }) => {
  const [refresh, setRefresh] = useState(true); 

  return (
    <RefreshContext.Provider value={{ refresh, setRefresh }}>
      {children}
    </RefreshContext.Provider>
  );
};

export const useRefresh = (): RefreshContextProps => {
  const context = useContext(RefreshContext);
  if (!context) {
    throw new Error('useRefresh must be used within a RefreshProvider');
  }
  return context;
};
