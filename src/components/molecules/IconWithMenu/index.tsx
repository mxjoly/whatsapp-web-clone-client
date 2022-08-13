import React from 'react';
import { IconType } from 'react-icons';
import './styles.scss';

type IconWithMenuProps = {
  Icon: IconType;
  iconClassName?: string;
  menuClassName?: string;
  menuItemClassName?: string;
  menuItems: string[];
  onSelectMenuItem?: (index: number) => void;
  menuPlacement?: 'right' | 'left';
  useHoverColor?: boolean;
};

const IconWithMenu = ({
  Icon,
  iconClassName,
  menuClassName,
  menuItems,
  menuItemClassName,
  menuPlacement,
  useHoverColor,
  onSelectMenuItem,
}: IconWithMenuProps) => {
  const [menuHidden, setMenuHidden] = React.useState(true);
  const iconRef = React.useRef<HTMLDivElement>();

  const handleClickIcon = () => {
    setMenuHidden(!menuHidden);
  };

  const handleClickOutside = (event: React.MouseEvent) => {
    if (iconRef.current && !iconRef.current.contains(event.target as Node)) {
      setMenuHidden(true);
    }
  };

  React.useEffect(() => {
    document.addEventListener('click', handleClickOutside as any);
    return () =>
      document.removeEventListener('click', handleClickOutside as any);
  }, [iconRef]);

  React.useEffect(() => {
    setMenuHidden(true);
  }, [iconClassName]);

  return (
    <div
      ref={iconRef}
      onClick={handleClickOutside}
      className={[
        'iconWithMenu',
        iconClassName,
        useHoverColor && !menuHidden && 'iconWithMenu--highlight',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <Icon className="iconWithMenu__icon" onClick={handleClickIcon} />
      <ul
        className={[
          'iconWithMenu__menu',
          menuClassName,
          menuHidden && 'iconWithMenu__menu--hide',
          menuPlacement === 'left'
            ? 'iconWithMenu__menu--left'
            : menuPlacement === 'right'
            ? 'iconWithMenu__menu--right'
            : 'iconWithMenu__menu--left',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {menuItems.map((item, i) => (
          <li
            key={i}
            className={['iconWithMenu__menuItem', menuItemClassName].join(' ')}
            onClick={() => {
              setMenuHidden(true);
              onSelectMenuItem(i);
            }}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default IconWithMenu;
