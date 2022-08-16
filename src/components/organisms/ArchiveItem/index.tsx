import React from 'react';
import { MdOutlineArchive } from 'react-icons/md';

import './styles.scss';

type ArchiveItemProps = {
  className?: string;
  onClick?: () => void;
};

const ArchiveItem = ({ className, onClick }: ArchiveItemProps) => {
  return (
    <div className={['archiveItem', className].join(' ')} onClick={onClick}>
      <div className="archiveItem__container--left">
        <MdOutlineArchive className="archiveItem__icon" />
      </div>
      <div className="archiveItem__container--right">
        <span className="archiveItem__label">Archivées</span>
      </div>
    </div>
  );
};

export default ArchiveItem;
