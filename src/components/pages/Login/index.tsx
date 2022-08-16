import React from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../../api/user';

import { ThemeContext } from '../../../contexts/ThemeContext';
import FormLogin from '../../molecules/FormLogin';
import './styles.scss';

type LoginProps = {};

const Login = (props: LoginProps): JSX.Element => {
  const [loaded, setLoaded] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (localStorage.getItem('userId') && localStorage.getItem('token')) {
      navigate('/home');
    }
    setLoaded(true);
  }, [navigate]);

  const handleLogin = (state: {
    username: string;
    phone: string;
    password: string;
  }) => {
    loginUser(state.username, state.password, state.phone).then(
      ({ token, userId }) => {
        navigate('/home');
        console.log({ token, userId });
        localStorage.setItem('userId', userId);
        localStorage.setItem('token', token);
      }
    );
  };

  if (!loaded) {
    return <div className="login"></div>;
  }

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
