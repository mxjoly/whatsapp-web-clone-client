import React from 'react';
import './styles.scss';
import { MdAccountCircle } from 'react-icons/md';
import { LazyLoadImage } from 'react-lazy-load-image-component';

type AvatarProps = {
  avatarUrl: string;
  iconClassName?: string;
  onClick?: () => void;
  large?: boolean;
};

const Avatar = ({ avatarUrl, iconClassName, onClick, large }: AvatarProps) => {
  return avatarUrl ? (
    <LazyLoadImage
      src={avatarUrl}
      className={['avatar', large && 'avatar--large', iconClassName].join(' ')}
      onClick={onClick}
    />
  ) : (
    <MdAccountCircle
      className={['avatar', large && 'avatar--large', iconClassName].join(' ')}
    />
  );
};

export default Avatar;
