import React from 'react';
import './styles.scss';

import SearchBar from '../../molecules/SearchBar';

type SearchBarPanelProps = {
  className?: string;
  onChangeSearch?: (search: string) => void;
};

const SearchBarPanel = ({ className, onChangeSearch }: SearchBarPanelProps) => {
  return (
    <div className={['searchBarPanel', className].join(' ')}>
      <SearchBar useIcons onChangeSearch={onChangeSearch} />
    </div>
  );
};

export default SearchBarPanel;
