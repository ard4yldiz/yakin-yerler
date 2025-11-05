import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import MapView, { Marker, Circle, PROVIDER_GOOGLE } from 'react-native-maps';
import { useSettings } from '../contexts/SettingsContext';
import { getCurrentLocation, calculateDistance } from '../services/location';
import { searchNearbyPlaces } from '../services/googlePlaces';

export default function MapScreen() {
  const { selectedDistance, selectedCategory, userLocation, setUserLocation } = useSettings();
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    loadPlaces();
  }, [selectedDistance, selectedCategory]);

  const loadPlaces = async () => {
    try {
      setLoading(true);

      // Konum al
      const location = await getCurrentLocation();
      setUserLocation(location);

      // Yakındaki yerleri ara
      const results = await searchNearbyPlaces(
        location.latitude,
        location.longitude,
        selectedDistance.value,
        selectedCategory.key
      );

      // Mesafeleri hesapla
      const placesWithDistance = results.map(place => ({
        ...place,
        distance: calculateDistance(
          location.latitude,
          location.longitude,
          place.location.latitude,
          place.location.longitude
        ),
      }));

      setPlaces(placesWithDistance);

      // Haritayı tüm markerları gösterecek şekilde ayarla
      if (mapRef.current && results.length > 0) {
        const coordinates = [
          { latitude: location.latitude, longitude: location.longitude },
          ...results.map(p => p.location),
        ];

        setTimeout(() => {
          mapRef.current.fitToCoordinates(coordinates, {
            edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
            animated: true,
          });
        }, 500);
      }
    } catch (error) {
      console.error('Yerler yüklenemedi:', error);
      Alert.alert(
        'Hata',
        'Yakındaki yerler yüklenemedi. Lütfen konum izinlerini kontrol edin.',
        [{ text: 'Tamam' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const onMarkerPress = (place) => {
    setSelectedPlace(place);
  };

  const onMapPress = () => {
    setSelectedPlace(null);
  };

  if (loading || !userLocation) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Harita yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
        onPress={onMapPress}
      >
        {/* Arama yarıçapını gösteren daire */}
        <Circle
          center={{
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
          }}
          radius={selectedDistance.value}
          fillColor="rgba(0, 122, 255, 0.1)"
          strokeColor="rgba(0, 122, 255, 0.5)"
          strokeWidth={2}
        />

        {/* Bulunan yerlerin markerları */}
        {places.map((place) => (
          <Marker
            key={place.id}
            coordinate={place.location}
            title={place.name}
            description={place.address}
            onPress={() => onMarkerPress(place)}
          >
            <View style={styles.markerContainer}>
              <Text style={styles.markerEmoji}>{selectedCategory.icon}</Text>
            </View>
          </Marker>
        ))}
      </MapView>

      {/* Üst bilgi kartı */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>
          {selectedCategory.icon} {selectedCategory.label}
        </Text>
        <Text style={styles.infoSubtitle}>
          {places.length} sonuç • {selectedDistance.label} yarıçapında
        </Text>
      </View>

      {/* Seçili yer detay kartı */}
      {selectedPlace && (
        <View style={styles.placeDetailCard}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setSelectedPlace(null)}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>

          <Text style={styles.placeDetailName}>{selectedPlace.name}</Text>
          <Text style={styles.placeDetailAddress}>{selectedPlace.address}</Text>

          <View style={styles.placeDetailInfo}>
            <Text style={styles.placeDetailDistance}>
              📍 {(selectedPlace.distance / 1000).toFixed(2)} km
            </Text>

            {selectedPlace.rating > 0 && (
              <Text style={styles.placeDetailRating}>
                ⭐ {selectedPlace.rating.toFixed(1)}
              </Text>
            )}

            {selectedPlace.isOpen !== undefined && (
              <Text
                style={[
                  styles.placeDetailStatus,
                  selectedPlace.isOpen ? styles.open : styles.closed,
                ]}
              >
                {selectedPlace.isOpen ? '🟢 Açık' : '🔴 Kapalı'}
              </Text>
            )}
          </View>
        </View>
      )}

      {/* Yenile butonu */}
      <TouchableOpacity style={styles.refreshButton} onPress={loadPlaces}>
        <Text style={styles.refreshButtonText}>🔄</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  markerContainer: {
    backgroundColor: '#FFFFFF',
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#007AFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  markerEmoji: {
    fontSize: 24,
  },
  infoCard: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  infoSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  placeDetailCard: {
    position: 'absolute',
    bottom: 20,
    left: 10,
    right: 10,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: 'bold',
  },
  placeDetailName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
    paddingRight: 30,
  },
  placeDetailAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  placeDetailInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
  },
  placeDetailDistance: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  placeDetailRating: {
    fontSize: 14,
    color: '#FF9500',
    fontWeight: '500',
  },
  placeDetailStatus: {
    fontSize: 14,
    fontWeight: '500',
  },
  open: {
    color: '#34C759',
  },
  closed: {
    color: '#FF3B30',
  },
  refreshButton: {
    position: 'absolute',
    top: 90,
    right: 10,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  refreshButtonText: {
    fontSize: 24,
  },
});
