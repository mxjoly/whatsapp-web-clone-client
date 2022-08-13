import React, { ReactNode } from 'react';

type ContextType = {
  toggleDark: () => void;
  isDark: boolean;
};

const defaultContext: ContextType = {
  toggleDark: () => {
    console.warn('Should have been overridden');
  },
  isDark:
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches, // detect if the browser uses dark mode
};

export const ThemeContext = React.createContext(defaultContext);

export const ThemeContextProvider = ({ children }: { children: ReactNode }) => {
  const [isDark, setIsDark] = React.useState(defaultContext.isDark);

  React.useEffect(() => {
    const handleChange = (e: any) => {
      setIsDark(e.matches ? true : false);
    };
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', handleChange);
    return window
      .matchMedia('(prefers-color-scheme: dark)')
      .removeEventListener('change', handleChange);
  }, []);

  const context: ContextType = {
    toggleDark: () => {
      setIsDark(!isDark);
    },
    isDark,
  };

  return (
    <ThemeContext.Provider value={context}>{children}</ThemeContext.Provider>
  );
};
