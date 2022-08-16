import React from 'react';
import { updateProfilePicture } from '../../../api/user';

import './styles.scss';
import { MdAccountCircle } from 'react-icons/md';
import { IoMdCamera } from 'react-icons/io';
import { LazyLoadImage } from 'react-lazy-load-image-component';

type AvatarProps = {
  avatarUrl: string;
  iconClassName?: string;
  onClick?: () => void;
  large?: boolean;
  editable?: boolean; // to upload a new photo
};

const Avatar = ({
  avatarUrl,
  iconClassName,
  onClick,
  large,
  editable,
}: AvatarProps) => {
  const [hover, setHover] = React.useState(false);

  const updateAvatarImageUrl = (file: File) => {
    // file size < 10Mo
    if (file.size < 10000000) {
      const userId = localStorage.getItem('userId');
      updateProfilePicture(userId, file).then((pictureUrl) => {
        console.log(pictureUrl);
      });
    } else {
      console.error(`Profile picture must be less than 10Mo`);
    }
  };

  return avatarUrl ? (
    <div
      className="avatar"
      onMouseOver={() => setHover(editable ? true : false)}
      onMouseLeave={() => setHover(false)}
    >
      <LazyLoadImage
        src={avatarUrl}
        className={[
          'avatar__img',
          large && 'avatar__img--large',
          iconClassName,
        ].join(' ')}
        onClick={onClick}
        style={{ opacity: hover ? 0.4 : 1 }}
      />
      {hover && (
        <>
          <div className="avatar__overlay">
            <IoMdCamera className="avatar__overlay__camera" />
            <p className="avatar__overlay__text">Changer de photo de profil</p>
          </div>
          <input
            className="avatar__overlay__input"
            type="file"
            value=""
            title=""
            onChange={(e) => updateAvatarImageUrl(e.target.files[0])}
          />
        </>
      )}
    </div>
  ) : (
    <div className="avatar">
      <MdAccountCircle
        className={[
          'avatar__img',
          large && 'avatar__img--large',
          iconClassName,
        ].join(' ')}
      />
    </div>
  );
};

export default Avatar;
