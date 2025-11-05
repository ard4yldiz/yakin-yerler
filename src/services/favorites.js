import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = '@yakinYerler:favorites';

/**
 * Tüm favorileri getirir
 * @returns {Promise<Array>} Favori yerler listesi
 */
export const getFavorites = async () => {
  try {
    const favoritesJson = await AsyncStorage.getItem(FAVORITES_KEY);
    return favoritesJson ? JSON.parse(favoritesJson) : [];
  } catch (error) {
    console.error('Favoriler yüklenemedi:', error);
    return [];
  }
};

/**
 * Favorilere yer ekler
 * @param {Object} place - Eklenecek yer
 * @returns {Promise<Array>} Güncel favori listesi
 */
export const addFavorite = async (place) => {
  try {
    const favorites = await getFavorites();

    // Zaten favorilerde mi kontrol et
    const exists = favorites.some(fav => fav.id === place.id);
    if (exists) {
      return favorites;
    }

    // Favoriye eklenme tarihini ekle
    const newFavorite = {
      ...place,
      addedAt: new Date().toISOString(),
    };

    const updatedFavorites = [...favorites, newFavorite];
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));

    return updatedFavorites;
  } catch (error) {
    console.error('Favoriye eklenemedi:', error);
    throw error;
  }
};

/**
 * Favorilerden yer çıkarır
 * @param {string} placeId - Çıkarılacak yerin ID'si
 * @returns {Promise<Array>} Güncel favori listesi
 */
export const removeFavorite = async (placeId) => {
  try {
    const favorites = await getFavorites();
    const updatedFavorites = favorites.filter(fav => fav.id !== placeId);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));

    return updatedFavorites;
  } catch (error) {
    console.error('Favoriden çıkarılamadı:', error);
    throw error;
  }
};

/**
 * Bir yerin favori olup olmadığını kontrol eder
 * @param {string} placeId - Kontrol edilecek yerin ID'si
 * @param {Array} favorites - Favori listesi
 * @returns {boolean} Favori mi?
 */
export const isFavorite = (placeId, favorites) => {
  return favorites.some(fav => fav.id === placeId);
};

/**
 * Tüm favorileri temizler
 * @returns {Promise<void>}
 */
export const clearFavorites = async () => {
  try {
    await AsyncStorage.removeItem(FAVORITES_KEY);
  } catch (error) {
    console.error('Favoriler temizlenemedi:', error);
    throw error;
  }
};
