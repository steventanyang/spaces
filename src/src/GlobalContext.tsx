import React, {
  createContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

interface GlobalContextType {
  globalState: number;
  setGlobalState: Dispatch<SetStateAction<number>>;
}
// Create the context
export const GlobalContext = createContext<GlobalContextType>({
  globalState: 0,
  setGlobalState: () => {},
});

// Create a provider component
export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [globalState, setGlobalState] = useState<number>(0);

  return (
    <GlobalContext.Provider
      value={{ globalState, setGlobalState } as GlobalContextType}
    >
      {children}
    </GlobalContext.Provider>
  );
};
