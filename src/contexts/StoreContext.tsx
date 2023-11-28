import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from 'react';

// Defina o tipo do cliente
interface Cliente {
  name: string;
  email: string;
  // Outras propriedades do cliente
}

// Defina o tipo dos dados da loja
interface StoreData {
  cliente: Cliente[] | null;
  // Outras propriedades da loja
}

// Defina a interface do contexto
interface StoreContextData {
  storeData: StoreData;
  setStore: Dispatch<SetStateAction<StoreData>>;
}

// Crie o contexto inicializando-o com valores padrão
const StoreContext = createContext<StoreContextData | undefined>(undefined);

// Crie um provedor de contexto que envolve seu componente de nível superior
interface StoreProviderProps {
  children: ReactNode;
}

export const StoreProvider: React.FC<StoreProviderProps> = ({children}) => {
  const [storeData, setStoreData] = useState<StoreData | null>(null);

  const setStore: StoreContextData['setStore'] = newData => {
    // Certifique-se de que storeData seja uma cópia completa dos dados existentes,
    // para não perder outras propriedades além de 'cliente'.
    setStore(
      prevStore =>
        ({
          ...prevStore,
          cliente: listaDeClientes,
        } as StoreData),
    );
  };

  const contextValue: StoreContextData = {
    storeData,
    setStore,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};

// Crie um hook personalizado para acessar o contexto
export const useStore = (): StoreContextData => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
