import { Red } from '@/interface/Nodos';
import { createContext, useContext, useState } from 'react';

interface RedContextType {
  redSeleccionada: Red | null;
  setRedSeleccionada: (red: Red | null) => void;
}

const RedContext = createContext<RedContextType | null>(null);

export function RedProvider({ children }: { children: React.ReactNode }) {
  const [redSeleccionada, setRedSeleccionada] = useState<Red | null>(null);

  return (
    <RedContext.Provider value={{ redSeleccionada, setRedSeleccionada }}>
      {children}
    </RedContext.Provider>
  );
}

// Hook personalizado para usarlo fácil
export function useRed() {
  const context = useContext(RedContext);
  if (!context) throw new Error('useRed debe usarse dentro de RedProvider');
  return context;
}