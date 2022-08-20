import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { isMobile } from 'react-device-detect';

import './App.scss';
import Login from './components/pages/Login';
import Main from './components/pages/Main';
import { ThemeContextProvider, ThemeContext } from './contexts/ThemeContext';
import { MdOutlineWarning } from 'react-icons/md';

type AppProps = {};

const App = (props: AppProps): JSX.Element => {
  return (
    <ThemeContextProvider>
      <ThemeContext.Consumer>
        {({ isDark }) => (
          <div className={`${isDark ? 'theme--dark' : 'theme--light'}`}>
            <div className="app">
              <div className="app__background">
                <div className="app__background app__background--top"></div>
                <div className="app__background app__background--bottom"></div>
              </div>
              <div className="app__container">
                {isMobile ? (
                  <>
                    <MdOutlineWarning className="app__warningIcon" />
                    <p className="app__info">
                      Cette application est uniquement disponible sur ordinateur
                    </p>
                  </>
                ) : (
                  <BrowserRouter>
                    <Routes>
                      <Route path="/login" element={<Login />} />
                      <Route path="/home" element={<Main />} />
                      <Route path="*" element={<Navigate to="/login" />} />
                    </Routes>
                  </BrowserRouter>
                )}
              </div>
            </div>
          </div>
        )}
      </ThemeContext.Consumer>
    </ThemeContextProvider>
  );
};

export default App;
