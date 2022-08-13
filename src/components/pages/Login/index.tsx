import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { ThemeContext } from '../../../contexts/ThemeContext';
import FormLogin from '../../molecules/FormLogin';
import './styles.scss';

type LoginProps = {};

const Login = (props: LoginProps): JSX.Element => {
  const navigate = useNavigate();

  React.useEffect(() => {
    if (localStorage.getItem('userId') && localStorage.getItem('token')) {
      navigate('/');
    }
  }, [navigate]);

  const handleLogin = (state: {
    username: string;
    phone: string;
    password: string;
  }) => {
    axios({
      method: 'post',
      url: `${axios.defaults.baseURL}/user/login`,
      data: {
        password: 'password',
        username: state.username,
        phone: state.phone,
      },
    })
      .then((res) => {
        if (res.status === 200) {
          console.log(`Login successfully`);
          navigate('/');
          console.log(res.data);
          localStorage.setItem('userId', res.data.userId);
          localStorage.setItem('token', res.data.token);
        }
      })
      .catch((err) => {
        console.error(`Failed to login`);
      });
  };

  return (
    <div className="login">
      <div className="login__container">
        <ThemeContext.Consumer>
          {({ isDark }) => (
            <img
              alt="background"
              className="login__image"
              src={
                isDark
                  ? './images/connection-dark.jpg'
                  : './images/connection.jpg'
              }
            />
          )}
        </ThemeContext.Consumer>
        <h3 className="login__title">Gardez votre téléphone connecté</h3>
        <p className="login__p">
          Connectez vous afin de lancer une conversation !
        </p>
        <div className="login__divider"></div>
        <FormLogin onLogin={handleLogin} />
      </div>
    </div>
  );
};

export default Login;
