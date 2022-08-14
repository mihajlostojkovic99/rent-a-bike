import Image from 'next/image';
import { useAuth } from '../utils/useAuth';
import cx from 'classnames';
import NavMenuList from './navMenuList';

type AvatarProps = {
  htmlFor?: string;
  className?: string;
  classNameSize?: string;
  children?: React.ReactNode | React.ReactNode[];
};

const Avatar = ({
  htmlFor,
  classNameSize,
  className,
  children,
}: AvatarProps) => {
  const { user } = useAuth();
  return (
    <label
      htmlFor={htmlFor}
      className={cx('avatar', className, {
        placeholder: !user?.photoURL,
      })}
      tabIndex={0}
    >
      <div
        className={cx(
          'mask mask-squircle w-14 bg-accentBlue ring ring-accent',
          classNameSize,
        )}
      >
        {user?.photoURL ? (
          <Image
            src={user.photoURL.substring(0, user.photoURL.length - 6)}
            alt={user.displayName
              ?.split(' ')
              .map((str) => str.charAt(0))
              .join()}
            layout="fill"
            objectFit="contain"
            objectPosition="bottom"
          />
        ) : (
          <div className="btn btn-accent text-2xl font-bold">
            {user?.displayName?.split(' ').map((str) => str.charAt(0))}
          </div>
        )}
      </div>
      {children}
    </label>
  );
};

export default Avatar;
