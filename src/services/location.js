import * as Location from 'expo-location';

/**
 * Konum izni ister
 * @returns {Promise<boolean>} İzin verildi mi?
 */
export const requestLocationPermission = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Konum izni hatası:', error);
    return false;
  }
};

/**
 * Kullanıcının mevcut konumunu alır
 * @returns {Promise<Object>} Konum bilgisi {latitude, longitude}
 */
export const getCurrentLocation = async () => {
  try {
    const hasPermission = await requestLocationPermission();

    if (!hasPermission) {
      throw new Error('Konum izni verilmedi');
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  } catch (error) {
    console.error('Konum alma hatası:', error);
    throw error;
  }
};

/**
 * İki nokta arasındaki mesafeyi hesaplar (Haversine formülü)
 * @param {number} lat1 - Birinci nokta enlemi
 * @param {number} lon1 - Birinci nokta boylamı
 * @param {number} lat2 - İkinci nokta enlemi
 * @param {number} lon2 - İkinci nokta boylamı
 * @returns {number} Mesafe (metre)
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Dünya yarıçapı (metre)
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Metre cinsinden
};

/**
 * Mesafeyi okunabilir formata çevirir
 * @param {number} meters - Metre cinsinden mesafe
 * @returns {string} Formatlanmış mesafe (örn: "1.2 km", "500 m")
 */
export const formatDistance = (meters) => {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  } else {
    return `${(meters / 1000).toFixed(1)} km`;
  }
};
