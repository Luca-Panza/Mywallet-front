import React, { createContext, useState } from "react";

const AppContext = createContext();

const AppProvider = ({ children }) => {

  const lsUser = JSON.parse(localStorage.getItem("user"))
  const [user, setUser] = useState(lsUser);

  return (
    <AppContext.Provider value={{ user, setUser }}>
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };


