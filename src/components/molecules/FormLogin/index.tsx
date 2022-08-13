import React from 'react';
import './styles.scss';

type LoginState = {
  username: string;
  phone: string;
  password: string;
};

type FormLoginProps = {
  onLogin: (state: LoginState) => void;
};

const FormLogin = (props: FormLoginProps): JSX.Element => {
  const [state, setState] = React.useState<LoginState>({
    username: '',
    phone: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const inputValue = e.target.value;
    const inputName = e.target.name;
    setState((prevState) => ({
      ...prevState,
      [inputName]: inputValue,
    }));
  };

  return (
    <div className="formLogin">
      <input
        className="formLogin__input"
        name="username"
        placeholder="Nom d'utilisateur"
        value={state.username}
        onChange={handleChange}
      />
      <input
        className="formLogin__input"
        name="phone"
        placeholder="Téléphone"
        value={state.phone}
        onChange={handleChange}
      />
      <input
        className="formLogin__input"
        name="password"
        placeholder="Mot de passe"
        value={state.password}
        onChange={handleChange}
      />
      <button
        className="formLogin__button"
        onClick={() => props.onLogin(state)}
      >
        Connection
      </button>
    </div>
  );
};

export default FormLogin;
