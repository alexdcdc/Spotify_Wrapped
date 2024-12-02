import React, {createContext, useContext, useState, useEffect} from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({children}) => {
  const [theme, setTheme] = useState(() => {
    // Load theme from sessionStorage or default to 'light'
    return sessionStorage.getItem("theme") || "light";
  });

  useEffect(() => {
    // Save the current theme in sessionStorage
    sessionStorage.setItem("theme", theme);
  }, [theme]);

  // Function to toggle the theme
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{theme, toggleTheme}}>
      <div data-theme={theme}>{children}</div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
