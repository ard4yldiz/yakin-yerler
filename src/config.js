// Google Maps API anahtarınızı buraya ekleyin
// https://console.cloud.google.com/apis/credentials adresinden alabilirsiniz
export const GOOGLE_MAPS_API_KEY = 'AIzaSyA9no7aKldHcM6lquJaqrh-WaUldU8LXTs';

// Kategoriler ve Türkçe isimleri
export const CATEGORIES = [
  { key: 'pharmacy', label: 'Eczane', icon: '💊' },
  { key: 'hospital', label: 'Hastane', icon: '🏥' },
  { key: 'restaurant', label: 'Restoran', icon: '🍽️' },
  { key: 'cafe', label: 'Kafe', icon: '☕' },
  { key: 'lodging', label: 'Otel', icon: '🏨' },
  { key: 'gas_station', label: 'Benzin İstasyonu', icon: '⛽' },
  { key: 'atm', label: 'ATM', icon: '🏧' },
  { key: 'bank', label: 'Banka', icon: '🏦' },
  { key: 'supermarket', label: 'Market', icon: '🛒' },
  { key: 'parking', label: 'Otopark', icon: '🅿️' },
];

// Mesafe seçenekleri (metre cinsinden)
export const DISTANCE_OPTIONS = [
  { label: '500m', value: 500 },
  { label: '1km', value: 1000 },
  { label: '2km', value: 2000 },
  { label: '3km', value: 3000 },
  { label: '5km', value: 5000 },
  { label: '10km', value: 10000 },
];
