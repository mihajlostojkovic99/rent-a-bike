import cx from 'classnames';
import { Menu } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/solid';

type SearchboxProps = {
  className?: string;
  children?: React.ReactNode;
};

const Searchbox = ({ className, children }: SearchboxProps) => {
  return (
    <div
      className={cx(
        'searchbox mx-auto flex h-32 max-w-7xl rounded-3xl text-base text-black',
        className,
      )}
    >
      <div className="my-auto mx-7 flex">
        <div className="mx-4">
          <div className="mb-2 ml-1">Type</div>
          <Menu>
            <Menu.Button className="relative rounded-md py-1 pl-1 tracking-tight outline outline-2 outline-offWhite">
              Cross country
              <ChevronDownIcon className="ml-1 inline h-6 w-6 text-black"></ChevronDownIcon>
            </Menu.Button>
            <Menu.Items className="absolute flex flex-col">
              <Menu.Item>
                {({ active }) => <span className="py-1">Cross country</span>}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <span className={`${active && 'bg-blue-500'}`}>Road</span>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <span className={`${active && 'bg-blue-500'}`}>City</span>
                )}
              </Menu.Item>
            </Menu.Items>
          </Menu>
        </div>

        <div className="mx-4">
          <div className="mb-2 ml-1">Pick up {'&'} return</div>
          <Menu>
            <Menu.Button className="relative rounded-md py-1 pl-1 tracking-tight outline outline-2 outline-offWhite">
              Ada Ciganlija, Belgrade
              <ChevronDownIcon className="ml-1 inline h-6 w-6 text-black"></ChevronDownIcon>
            </Menu.Button>
            <Menu.Items className="absolute flex flex-col">
              <Menu.Item>
                {({ active }) => (
                  <span className="py-1">Ada Ciganlija, Belgrade</span>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <span className={`${active && 'bg-blue-500'}`}>
                    Savamala, Belgrade
                  </span>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <span className={`${active && 'bg-blue-500'}`}>
                    25. maj, Belgrade
                  </span>
                )}
              </Menu.Item>
            </Menu.Items>
          </Menu>
        </div>
      </div>
    </div>
  );
};

export default Searchbox;
