import React, { createContext, useState, useContext } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [repoDetails, setRepoDetails] = useState(null);

  return (
    <AppContext.Provider value={{ repoDetails, setRepoDetails }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
