import React, { createContext, useState } from 'react';

export const LoggedInContext = createContext();

export const LoggedInProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('user'));

  const login = () => {
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
  };

  return (
    <LoggedInContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </LoggedInContext.Provider>
  );
};
