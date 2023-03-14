import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export function useUserFavorites(homes) {
  const { data, error, isLoading, mutate } = useSWR(
    '/api/user/favorites',
    fetcher
  );

  const toggleFavorite = async (id) => {
    const favoriteHome = data?.find((fav) => fav.id === id);

    try {
      if (favoriteHome) {
        toast.success('Deleted!');
        await mutate(
          deleteFavoriteMutation(id, data),
          deleteFavoriteOptions(id, data)
        );
      } else {
        toast.success('added!');
        const newFavorite = homes?.find((home) => home.id === id);
        await mutate(
          addFavoriteMutation(newFavorite, data),
          addFavoriteOptions(newFavorite, data)
        );
      }
    } catch (e) {
      toast.error(
        'Something happened: ' + e.message + ' - ' + e.response.data.message
      );
    }
  };

  return {
    favoriteHomes: data,
    isError: error,
    isLoading,
    mutate,
    toggleFavorite,
  };
}

async function addFavoriteMutation(newFavorite, favorites) {
  const home = (await axios.put(`/api/homes/${newFavorite.id}/favorites`)).data;

  return [...favorites, home];
}

async function deleteFavoriteMutation(newFavorite, favorites) {
  const home = (await axios.delete(`/api/homes/${newFavorite}/favorites`)).data;

  return favorites.filter((fav) => fav.id !== newFavorite);
}

const addFavoriteOptions = (newFavorite, favorites) => {
  return {
    optimisticData: [...favorites, newFavorite],
    rollbackOnError: true,
    populateCache: true,
    revalidate: false,
  };
};

const deleteFavoriteOptions = (newFavorite, favorites) => {
  return {
    optimisticData: favorites.filter((fav) => fav.id !== newFavorite),
    rollbackOnError: true,
    populateCache: true,
    revalidate: false,
  };
};
