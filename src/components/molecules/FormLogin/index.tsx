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

  React.useEffect(() => {
    const onPress = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        props.onLogin(state);
      }
    };

    document.addEventListener('keydown', onPress);
    return () => document.removeEventListener('keydown', onPress);
  }, [state, props]);

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
        placeholder="Bryan | Avery | Katie | Marco | Samy | John"
        value={state.username}
        onChange={handleChange}
      />
      <input
        className="formLogin__input"
        name="phone"
        placeholder="+111111111"
        value={state.phone}
        onChange={handleChange}
      />
      <input
        className="formLogin__input"
        name="password"
        placeholder="password"
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
