import React from 'react';
import { MdOutlineSearch, MdArrowBack } from 'react-icons/md';
import { CSSTransition } from 'react-transition-group';
import './styles.scss';

type SearchBarProps = {
  className?: string;
  useIcons?: boolean;
  onChangeSearch?: (search: string) => void;
};

const SearchBar = (props: SearchBarProps) => {
  const [isFocused, setIsFocused] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const inputRef = React.createRef<HTMLInputElement>();

  const handleSearch = (search: string) => {
    setSearch(search);
    props.onChangeSearch(search);
  };

  const handleFocus = (focus: boolean) => {
    setIsFocused(focus);
    if (focus) {
      inputRef.current.focus();
    } else {
      inputRef.current.blur();
    }
  };

  return (
    <div className={['searchBar', props.className].join(' ')}>
      {props.useIcons &&
        (isFocused ? (
          <CSSTransition
            in={isFocused}
            timeout={200}
            addEndListener={null}
            classNames={'searchBar__icon'}
            className={`searchBar__icon searchBar__icon--colored`}
          >
            <MdArrowBack />
          </CSSTransition>
        ) : (
          <CSSTransition
            in={isFocused}
            timeout={200}
            addEndListener={null}
            classNames={'searchBar__icon'}
            className={`searchBar__icon`}
          >
            <MdOutlineSearch onClick={() => handleFocus(true)} />
          </CSSTransition>
        ))}
      <input
        ref={inputRef}
        className="searchBar__input"
        type="text"
        placeholder={
          isFocused ? '' : 'Recherche ou démarrer une nouvelle discussion'
        }
        value={search}
        autoFocus={isFocused}
        onChange={(e) => handleSearch(e.target.value)}
        onFocus={() => handleFocus(true)}
        onBlur={() => handleFocus(false)}
        autoComplete="off"
      ></input>
    </div>
  );
};

export default SearchBar;
