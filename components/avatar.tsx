import Image from 'next/image';
import { useAuth } from '../utils/useAuth';
import cx from 'classnames';
import NavMenuList from './navMenuList';

type AvatarProps = {
  htmlFor?: string;
  className?: string;
  classNameSize?: string;
  classNameText?: string;
  rounded?: boolean;
  imageSrc?: string | null | ArrayBuffer;
  priority?: boolean;
  children?: React.ReactNode | React.ReactNode[];
};

const Avatar = ({
  htmlFor,
  classNameSize,
  classNameText,
  className,
  rounded,
  imageSrc,
  priority,
  children,
}: AvatarProps) => {
  const { user, userData } = useAuth();
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
          'bg-accentBlue',
          classNameSize ? classNameSize : 'w-14',
          rounded
            ? 'rounded-full ring ring-accent ring-offset-2 ring-offset-darkBlue'
            : 'mask mask-squircle',
        )}
      >
        {user?.photoURL ? (
          <Image
            src={
              typeof imageSrc === 'string'
                ? imageSrc.includes('diplomski-2022')
                  ? imageSrc
                  : imageSrc.substring(0, user.photoURL.length - 6)
                : user?.photoURL?.includes('diplomski-2022')
                ? user.photoURL
                : user?.photoURL?.substring(0, user.photoURL.length - 6)
            }
            alt={user.displayName
              ?.split(' ')
              .map((str) => str.charAt(0))
              .join()}
            layout="fill"
            objectFit="cover"
            objectPosition="bottom"
            className={rounded ? 'rounded-full' : ''}
            priority={priority}
          />
        ) : typeof imageSrc === 'string' ? (
          <Image
            src={imageSrc}
            alt="Picture"
            layout="fill"
            objectFit="cover"
            objectPosition="bottom"
            className={rounded ? 'rounded-full' : ''}
            priority={priority}
          />
        ) : (
          <div
            className={cx(
              'h-fit font-bold text-offWhite/90',
              classNameText ? classNameText : 'text-2xl',
            )}
          >
            {userData?.displayName?.split(' ').map((str) => str.charAt(0))}
          </div>
        )}
      </div>
      {children}
    </label>
  );
};

export default Avatar;
