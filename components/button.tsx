import cx from 'classnames';

type ButtonProps = {
  className?: string;
  children: React.ReactNode;
};
const Button = ({ className, children }: ButtonProps) => {
  return (
    <button className={cx('rounded-lg bg-accentBlue p-2.5', className)}>
      {children}
    </button>
  );
};

export default Button;
