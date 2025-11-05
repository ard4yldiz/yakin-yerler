import axios from 'axios';
import { GOOGLE_MAPS_API_KEY } from '../config';

const BASE_URL = 'https://maps.googleapis.com/maps/api/place';

/**
 * Yakındaki yerleri Google Places API ile arar
 * @param {number} latitude - Enlem
 * @param {number} longitude - Boylam
 * @param {number} radius - Yarıçap (metre)
 * @param {string} type - Yer türü (restaurant, pharmacy, hotel vb.)
 * @returns {Promise<Array>} Bulunan yerler listesi
 */
export const searchNearbyPlaces = async (latitude, longitude, radius, type) => {
  try {
    // API parametreleri
    const params = {
      location: `${latitude},${longitude}`,
      radius: radius,
      type: type,
      key: GOOGLE_MAPS_API_KEY,
      language: 'tr', // Türkçe sonuçlar
    };

    // Bazı kategoriler için ek keyword ekle (daha doğru sonuçlar için)
    const keywordMap = {
      'lodging': 'otel|hotel|motel',
      'restaurant': 'restoran|lokanta|yemek',
      'cafe': 'kafe|kahve',
    };

    if (keywordMap[type]) {
      params.keyword = keywordMap[type];
    }

    const response = await axios.get(`${BASE_URL}/nearbysearch/json`, { params });

    if (response.data.status === 'OK') {
      return response.data.results.map(place => ({
        id: place.place_id,
        name: place.name,
        address: place.vicinity,
        location: {
          latitude: place.geometry.location.lat,
          longitude: place.geometry.location.lng,
        },
        rating: place.rating || 0,
        ratingCount: place.user_ratings_total || 0,
        isOpen: place.opening_hours?.open_now,
        businessStatus: place.business_status,
        photo: place.photos?.[0]
          ? `${BASE_URL}/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${GOOGLE_MAPS_API_KEY}`
          : null,
        types: place.types,
      }));
    } else if (response.data.status === 'ZERO_RESULTS') {
      return [];
    } else {
      throw new Error(`API Error: ${response.data.status}`);
    }
  } catch (error) {
    console.error('Google Places API hatası:', error);
    throw error;
  }
};

/**
 * Bir yerin detaylı bilgilerini alır
 * @param {string} placeId - Yer ID'si
 * @returns {Promise<Object>} Yer detayları
 */
export const getPlaceDetails = async (placeId) => {
  try {
    const response = await axios.get(`${BASE_URL}/details/json`, {
      params: {
        place_id: placeId,
        fields: 'name,formatted_address,formatted_phone_number,opening_hours,website,rating,photos',
        key: GOOGLE_MAPS_API_KEY,
        language: 'tr',
      },
    });

    if (response.data.status === 'OK') {
      return response.data.result;
    } else {
      throw new Error(`API Error: ${response.data.status}`);
    }
  } catch (error) {
    console.error('Google Places API hatası:', error);
    throw error;
  }
};
