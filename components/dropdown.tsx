import { Combobox, Menu } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/solid';
import { ReactElement, ReactNode } from 'react';
import cx from 'classnames';

type DropdownProps<T> = {
  item: T;
  items: readonly T[];
  renderItem: (item: T) => ReactElement;
  noChevron?: boolean;
  absoluteDropdown?: boolean;
  className?: string;
  classNameItems?: string;
  children?: ReactNode;
};

const Dropdown = function <T>({
  item,
  items,
  renderItem,
  noChevron = false,
  absoluteDropdown = false,
  className,
  classNameItems,
  children,
}: DropdownProps<T>) {
  return (
    <div className="relative">
      <Menu>
        <Menu.Button
          className={cx(
            'relative flex h-[2.875rem] items-center justify-between overflow-hidden rounded-[4px] border border-black/[0.23] py-1 pl-1 tracking-tight hover:border-justBlack lg:h-10',
            { relative: absoluteDropdown === false },
            className,
          )}
        >
          {renderItem(item)}
          {!noChevron && (
            <ChevronDownIcon className="ml-1 inline h-6 w-6"></ChevronDownIcon>
          )}
        </Menu.Button>

        <Menu.Items
          className={cx('absolute flex flex-col bg-offWhite', classNameItems)}
        >
          {items.map((item, index) => {
            return (
              <div key={index}>
                <Menu.Item>{({ active }) => renderItem(item)}</Menu.Item>
              </div>
            );
          })}
        </Menu.Items>
      </Menu>
    </div>
  );
};

export default Dropdown;
