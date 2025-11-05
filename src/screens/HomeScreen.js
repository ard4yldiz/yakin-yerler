import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { useSettings } from '../contexts/SettingsContext';
import { getCurrentLocation, formatDistance, calculateDistance } from '../services/location';
import { searchNearbyPlaces } from '../services/googlePlaces';

export default function HomeScreen() {
  const { selectedDistance, selectedCategory, userLocation, setUserLocation } = useSettings();
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // İlk yüklemede konumu al ve yerleri ara
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

      // Mesafeleri hesapla ve sırala
      const placesWithDistance = results.map(place => ({
        ...place,
        distance: calculateDistance(
          location.latitude,
          location.longitude,
          place.location.latitude,
          place.location.longitude
        ),
      }));

      // Mesafeye göre sırala
      placesWithDistance.sort((a, b) => a.distance - b.distance);

      setPlaces(placesWithDistance);
    } catch (error) {
      console.error('Yerler yüklenemedi:', error);
      Alert.alert(
        'Hata',
        'Yakındaki yerler yüklenemedi. Lütfen konum izinlerini kontrol edin.',
        [{ text: 'Tamam' }]
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadPlaces();
  };

  const renderPlace = ({ item }) => (
    <TouchableOpacity style={styles.placeCard}>
      <View style={styles.placeInfo}>
        <Text style={styles.placeName}>{item.name}</Text>
        <Text style={styles.placeAddress}>{item.address}</Text>

        <View style={styles.placeDetails}>
          <Text style={styles.placeDistance}>
            📍 {formatDistance(item.distance)}
          </Text>

          {item.rating > 0 && (
            <Text style={styles.placeRating}>
              ⭐ {item.rating.toFixed(1)}
            </Text>
          )}

          {item.isOpen !== undefined && (
            <Text style={[styles.placeStatus, item.isOpen ? styles.open : styles.closed]}>
              {item.isOpen ? '🟢 Açık' : '🔴 Kapalı'}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>{selectedCategory.icon}</Text>
      <Text style={styles.emptyText}>
        Yakınınızda {selectedCategory.label.toLowerCase()} bulunamadı
      </Text>
      <Text style={styles.emptySubtext}>
        Mesafe ayarını artırmayı deneyin
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {selectedCategory.icon} {selectedCategory.label}
        </Text>
        <Text style={styles.headerSubtitle}>
          {selectedDistance.label} yarıçapında • {places.length} sonuç
        </Text>
      </View>

      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Yakındaki yerler aranıyor...</Text>
        </View>
      ) : (
        <FlatList
          data={places}
          renderItem={renderPlace}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={renderEmpty}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  listContainer: {
    padding: 16,
    flexGrow: 1,
  },
  placeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  placeInfo: {
    flex: 1,
  },
  placeName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  placeAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  placeDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
  },
  placeDistance: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  placeRating: {
    fontSize: 14,
    color: '#FF9500',
    fontWeight: '500',
  },
  placeStatus: {
    fontSize: 14,
    fontWeight: '500',
  },
  open: {
    color: '#34C759',
  },
  closed: {
    color: '#FF3B30',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});
