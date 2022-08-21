import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../../api/user';
import { useSocket } from '../../../contexts/SocketContext';

import { ThreeDots } from 'react-loader-spinner';
import { ThemeContext } from '../../../contexts/ThemeContext';
import FormLogin from '../../molecules/FormLogin';
import './styles.scss';

type LoginProps = {};

const Login = (props: LoginProps): JSX.Element => {
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();
  const socket = useSocket();

  React.useEffect(() => {
    if (localStorage.getItem('userId') && localStorage.getItem('token')) {
      navigate('/home');
    }
    setLoading(false);
  }, [navigate]);

  const handleLogin = (state: {
    username: string;
    phone: string;
    password: string;
  }) => {
    setLoading(true);
    loginUser(state.username, state.password, state.phone)
      .then(({ token, userId }) => {
        socket.emit('user', userId);
        setLoading(false);
        navigate('/home');
        console.log({ token, userId });
        localStorage.setItem('userId', userId);
        localStorage.setItem('token', token);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  if (loading) {
    return (
      <div className="login">
        <ThreeDots
          height="80"
          width="80"
          radius="9"
          ariaLabel="three-dots-loading"
          color="#00a884"
        />
      </div>
    );
  }

  return (
    <div className="login">
      <div className="login__container">
        <ThemeContext.Consumer>
          {({ isDark }) => (
            <LazyLoadImage
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
