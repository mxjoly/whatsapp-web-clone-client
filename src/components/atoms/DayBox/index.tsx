import React from 'react';
import { getDateLabel } from '../../../utils/date';
import './styles.scss';

type DayBoxProps = {
  className?: string;
  date: Date;
};

const DayBox = ({ date }: DayBoxProps) => {
  return <div className={['dayBox'].join(' ')}>{getDateLabel(date)}</div>;
};

export default DayBox;
