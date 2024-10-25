import { useState, useEffect } from "react";

function useDarkMode() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  useEffect(() => {
    document.body.className = darkMode ? "dark-mode" : "light-mode";
  }, [darkMode]);

  return [darkMode, toggleDarkMode];
}

export default useDarkMode;