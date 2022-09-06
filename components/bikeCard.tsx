import { LightningBoltIcon, StarIcon } from '@heroicons/react/solid';
import Image from 'next/image';
import cx from 'classnames';
import { Bike } from '../lib/dbTypes';
import { useAuth } from '../utils/useAuth';

type BikeCardProps = {
  bike: Bike;
  onClick: () => void;
};

const BikeCard = ({ bike, onClick }: BikeCardProps) => {
  const { user } = useAuth();

  return (
    <div
      className={cx(
        'card card-compact w-full tracking-tighter  shadow-xl lg:w-96',
        {
          'bg-electricGreen/20': bike.isElectric,
          'bg-accentBlue/20': !bike.isElectric,
        },
      )}
    >
      <div className="absolute m-2 flex items-center">
        <StarIcon className="h-6 w-6 stroke-black text-gold" />
        <div>{bike.rating ? bike.rating.toFixed(1) : 5.0}</div>
      </div>
      {bike.isElectric && (
        <div className="absolute right-0 m-2 stroke-black text-electricGreen">
          <LightningBoltIcon className="h-6 w-6" />
        </div>
      )}
      {bike.photoURL && (
        <figure className="relative h-56 w-full">
          <Image
            src={bike.photoURL}
            alt="Image loading..."
            layout="fill"
            objectFit="contain"
            objectPosition="bottom"
          ></Image>
        </figure>
      )}

      <div className="card-body">
        <h2 className="card-title mx-auto text-2xl font-extrabold">
          {bike.brand} {bike.model}{' '}
          <span className="text-justBlack/40">{bike.year}</span>
        </h2>
        <div className="mx-auto text-base">
          <span className="font-bold">Type: </span>
          {bike.type} | <span className="font-bold">Speeds: </span>{' '}
          {bike.speeds} | <span className="font-bold">Brakes: </span>
          {bike.brakes}
        </div>
        <div className="card-actions mt-3 justify-center gap-0">
          <div>
            Price: ${bike.pricePerHour}{' '}
            <span className="text-justBlack/40">/ hour</span>
          </div>
          {user ? (
            <button
              data-theme={bike.isElectric ? 'greentheme' : 'mytheme'}
              className="btn btn-accent w-full text-2xl normal-case tracking-tighter"
              onClick={() => {
                onClick();
              }}
            >
              Find out more
            </button>
          ) : (
            <label
              htmlFor="my-modal"
              data-theme={bike.isElectric ? 'greentheme' : 'mytheme'}
              className="btn btn-accent w-full text-2xl normal-case tracking-tighter"
            >
              Find out more
            </label>
          )}
        </div>
      </div>
    </div>
  );
};

export default BikeCard;
