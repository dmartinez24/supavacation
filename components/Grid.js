import PropTypes from 'prop-types';
import Card from '@/components/Card';
import { ExclamationIcon } from '@heroicons/react/outline';
import { useEffect, useState } from 'react';
import axios from 'axios';

const Grid = ({ homes = [] }) => {
  const [favorites, setFavorites] = useState([]);
  const isEmpty = homes.length === 0;

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        if (!ignore) {
          const { data: favoriteHomes } = await axios.get(
            `/api/user/favorites`
          );
          setFavorites(JSON.parse(JSON.stringify(favoriteHomes)));
        }
      } catch (e) {
        setFavorites([]);
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);

  const toggleFavorite = async (id) => {
    const favoriteHome = favorites?.find((fav) => fav.id === id);

    if (favoriteHome) {
      setFavorites(favorites.filter((fav) => fav.id !== id));
      await axios.delete(`/api/homes/${favoriteHome.id}/favorites`);
    } else {
      setFavorites([...favorites, homes.find((home) => home.id === id)]);
      await axios.put(`/api/homes/${id}/favorites`);
    }
  };

  return isEmpty ? (
    <p className="text-amber-700 bg-amber-100 px-4 rounded-md py-2 max-w-max inline-flex items-center space-x-1">
      <ExclamationIcon className="shrink-0 w-5 h-5 mt-px" />
      <span>Unfortunately, there is nothing to display yet.</span>
    </p>
  ) : (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {homes.map((home) => (
        <Card
          key={home.id}
          {...home}
          onClickFavorite={toggleFavorite}
          favorite={favorites?.some((fav) => fav.id === home.id)}
        />
      ))}
    </div>
  );
};

Grid.propTypes = {
  homes: PropTypes.array,
};

export default Grid;
