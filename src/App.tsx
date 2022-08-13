import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import './App.scss';

import Main from './components/pages/Main';
import { ThemeContextProvider, ThemeContext } from './contexts/ThemeContext';

type AppProps = {};

const App = (props: AppProps): JSX.Element => {
  const [login, setLogin] = React.useState(false);

  React.useEffect(() => {
    axios({
      method: 'get',
      url: `${axios.defaults.baseURL}/user/test`,
    })
      .then((res) => {
        if (res.status === 200) {
          const testUser = res.data.user as User;
          axios({
            method: 'post',
            url: `${axios.defaults.baseURL}/user/login/${testUser._id}`,
            data: {
              password: 'password',
            },
          })
            .then((res) => {
              if (res.status === 200) {
                setLogin(true);
                localStorage.setItem('userId', res.data.userId);
                localStorage.setItem('token', res.data.token);
              }
            })
            .catch((err) => {
              console.error(err);
            });
        }
      })
      .catch(() => console.error(`Failed to load the test user`));
  }, []);

  if (!login) {
    return <div></div>;
  }

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
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<Main />} />
                    <Route path="*" element={<Navigate to="/" />} />
                  </Routes>
                </BrowserRouter>
              </div>
            </div>
          </div>
        )}
      </ThemeContext.Consumer>
    </ThemeContextProvider>
  );
};

export default App;
