import React from 'react';
import { MdOutlineArchive } from 'react-icons/md';

import './styles.scss';

type ArchivePanelProps = {
  className?: string;
  onClick?: () => void;
};

const ArchivePanel = ({ className, onClick }: ArchivePanelProps) => {
  return (
    <div className={['archivePanel', className].join(' ')} onClick={onClick}>
      <div className="archivePanel__container--left">
        <MdOutlineArchive className="archivePanel__icon" />
      </div>
      <div className="archivePanel__container--right">
        <span className="archivePanel__label">Archivées</span>
      </div>
    </div>
  );
};

export default ArchivePanel;
