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
  children?: React.ReactNode | React.ReactNode[];
};

const Avatar = ({
  htmlFor,
  classNameSize,
  classNameText,
  className,
  rounded,
  imageSrc,
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
                ? imageSrc
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
          />
        ) : typeof imageSrc === 'string' ? (
          <Image
            src={imageSrc}
            alt="Picture"
            layout="fill"
            objectFit="cover"
            objectPosition="bottom"
            className={rounded ? 'rounded-full' : ''}
          />
        ) : (
          <div
            className={cx(
              'h-fit font-bold text-offWhite/90',
              classNameText ? classNameText : 'text-2xl',
            )}
          >
            {user?.displayName?.split(' ').map((str) => str.charAt(0))}
          </div>
        )}
      </div>
      {children}
    </label>
  );
};

export default Avatar;
