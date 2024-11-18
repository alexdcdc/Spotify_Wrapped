import React, { createContext, useContext, useState, useEffect} from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [isDark, setIsDark] = useState(() => {
        const savedTheme = sessionStorage.getItem('isDark');
        return savedTheme ? JSON.parse(savedTheme) : false;
    });

    const toggleTheme = () => {
        setIsDark((prevTheme) => {
            const newTheme = !prevTheme;
            sessionStorage.setItem('isDark', JSON.stringify(newTheme)); // Store updated theme in sessionStorage
            return newTheme;
        });
    };

     useEffect(() => {
        document.body.style.backgroundColor = isDark ? '#000000' : '#ffffff';
        document.body.style.color = isDark ? '#ffffff' : '#000000';
    }, [isDark]);


    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme }}>

                {children}

        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
