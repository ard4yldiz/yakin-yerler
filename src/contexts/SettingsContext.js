import React, { createContext, useState, useContext, useEffect } from 'react';
import { DISTANCE_OPTIONS, CATEGORIES } from '../config';
import { getFavorites, addFavorite as addFav, removeFavorite as removeFav } from '../services/favorites';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  // Varsayılan ayarlar
  const [selectedDistance, setSelectedDistance] = useState(DISTANCE_OPTIONS[2]); // 2km
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]); // Eczane
  const [userLocation, setUserLocation] = useState(null);
  const [favorites, setFavorites] = useState([]);

  // Favorileri yükle
  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    const favs = await getFavorites();
    setFavorites(favs);
  };

  const addFavorite = async (place) => {
    try {
      const updatedFavorites = await addFav(place);
      setFavorites(updatedFavorites);
      return true;
    } catch (error) {
      console.error('Favoriye eklenemedi:', error);
      return false;
    }
  };

  const removeFavorite = async (placeId) => {
    try {
      const updatedFavorites = await removeFav(placeId);
      setFavorites(updatedFavorites);
      return true;
    } catch (error) {
      console.error('Favoriden çıkarılamadı:', error);
      return false;
    }
  };

  const toggleFavorite = async (place) => {
    const isFav = favorites.some(fav => fav.id === place.id);
    if (isFav) {
      return await removeFavorite(place.id);
    } else {
      return await addFavorite(place);
    }
  };

  const value = {
    selectedDistance,
    setSelectedDistance,
    selectedCategory,
    setSelectedCategory,
    userLocation,
    setUserLocation,
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
