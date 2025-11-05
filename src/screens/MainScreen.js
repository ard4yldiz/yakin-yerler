import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
  Dimensions,
  Linking,
  Platform,
} from 'react-native';
import MapView, { Marker, Circle, PROVIDER_GOOGLE } from 'react-native-maps';
import { useSettings } from '../contexts/SettingsContext';
import { getCurrentLocation, formatDistance, calculateDistance } from '../services/location';
import { searchNearbyPlaces } from '../services/googlePlaces';
import { CATEGORIES, DISTANCE_OPTIONS } from '../config';

const { width } = Dimensions.get('window');

export default function MainScreen() {
  const { selectedDistance, setSelectedDistance, selectedCategory, setSelectedCategory, userLocation, setUserLocation, favorites, toggleFavorite } = useSettings();
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
  const mapRef = useRef(null);

  useEffect(() => {
    loadPlaces();
  }, [selectedDistance, selectedCategory]);

  const openInMaps = (place) => {
    const latitude = place.location.latitude;
    const longitude = place.location.longitude;
    const label = encodeURIComponent(place.name);

    // iOS için Apple Maps, Android için Google Maps
    const scheme = Platform.select({
      ios: `maps:0,0?q=${label}@${latitude},${longitude}`,
      android: `geo:0,0?q=${latitude},${longitude}(${label})`,
    });

    // Google Maps alternatifi (her iki platform için)
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}&query_place_id=${place.id}`;

    Alert.alert(
      'Haritada Aç',
      `${place.name} konumunu haritada görmek ister misiniz?`,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Haritalar',
          onPress: () => {
            Linking.openURL(scheme).catch(() => {
              // Eğer yerel harita uygulaması yoksa Google Maps aç
              Linking.openURL(googleMapsUrl);
            });
          },
        },
        {
          text: 'Google Maps',
          onPress: () => Linking.openURL(googleMapsUrl),
        },
      ]
    );
  };

  const loadPlaces = async () => {
    try {
      setLoading(true);

      const location = await getCurrentLocation();
      setUserLocation(location);

      const results = await searchNearbyPlaces(
        location.latitude,
        location.longitude,
        selectedDistance.value,
        selectedCategory.key
      );

      const placesWithDistance = results.map(place => ({
        ...place,
        distance: calculateDistance(
          location.latitude,
          location.longitude,
          place.location.latitude,
          place.location.longitude
        ),
      }));

      placesWithDistance.sort((a, b) => a.distance - b.distance);
      setPlaces(placesWithDistance);

      // Harita görünümündeyse haritayı güncelle
      if (viewMode === 'map' && mapRef.current && results.length > 0) {
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

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryCard,
        selectedCategory.key === item.key && styles.categoryCardSelected,
      ]}
      onPress={() => setSelectedCategory(item)}
    >
      <Text style={styles.categoryIcon}>{item.icon}</Text>
      <Text
        style={[
          styles.categoryLabel,
          selectedCategory.key === item.key && styles.categoryLabelSelected,
        ]}
      >
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  const isFavorite = (placeId) => {
    return favorites.some(fav => fav.id === placeId);
  };

  const handleFavoriteToggle = (e, place) => {
    e.stopPropagation(); // Kartın tıklama olayını engelle
    toggleFavorite(place);
  };

  const renderPlaceItem = ({ item }) => (
    <TouchableOpacity style={styles.placeCard} onPress={() => openInMaps(item)}>
      <View style={styles.placeInfo}>
        <View style={styles.placeHeader}>
          <Text style={styles.placeName}>{item.name}</Text>
          <View style={styles.placeActions}>
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={(e) => handleFavoriteToggle(e, item)}
            >
              <Text style={styles.favoriteIcon}>
                {isFavorite(item.id) ? '❤️' : '🤍'}
              </Text>
            </TouchableOpacity>
            <Text style={styles.placeNavigateIcon}>🧭</Text>
          </View>
        </View>
        <Text style={styles.placeAddress}>{item.address}</Text>

        <View style={styles.placeDetails}>
          <Text style={styles.placeDistance}>
            📍 {formatDistance(item.distance)}
          </Text>

          {item.rating > 0 && (
            <Text style={styles.placeRating}>
              ⭐ {item.rating.toFixed(1)}
              {item.ratingCount > 0 && (
                <Text style={styles.ratingCount}> ({item.ratingCount})</Text>
              )}
            </Text>
          )}

          {item.isOpen !== undefined && (
            <Text style={[styles.placeStatus, item.isOpen ? styles.open : styles.closed]}>
              {item.isOpen ? '🟢 Açık' : '🔴 Kapalı'}
            </Text>
          )}

          {item.businessStatus === 'CLOSED_PERMANENTLY' && (
            <Text style={[styles.placeStatus, styles.closedPermanently]}>
              ⚫ Kalıcı Kapalı
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderListView = () => (
    <FlatList
      data={places}
      renderItem={renderPlaceItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContainer}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>{selectedCategory.icon}</Text>
          <Text style={styles.emptyText}>
            Yakınınızda {selectedCategory.label.toLowerCase()} bulunamadı
          </Text>
          <Text style={styles.emptySubtext}>
            Mesafe ayarını artırmayı deneyin
          </Text>
        </View>
      }
    />
  );

  const renderMapView = () => {
    if (!userLocation) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Konum alınıyor...</Text>
        </View>
      );
    }

    return (
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
      >
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

        {places.map((place) => (
          <Marker
            key={place.id}
            coordinate={place.location}
            title={place.name}
            description={place.address}
            onCalloutPress={() => openInMaps(place)}
          >
            <View style={[
              styles.markerContainer,
              isFavorite(place.id) && styles.markerContainerFavorite
            ]}>
              <Text style={styles.markerEmoji}>{selectedCategory.icon}</Text>
              {isFavorite(place.id) && (
                <View style={styles.markerFavoriteBadge}>
                  <Text style={styles.markerFavoriteBadgeText}>❤️</Text>
                </View>
              )}
            </View>
          </Marker>
        ))}
      </MapView>
    );
  };

  return (
    <View style={styles.container}>
      {/* Kategori Seçici */}
      <View style={styles.categorySection}>
        <FlatList
          horizontal
          data={CATEGORIES}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.key}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
        />
      </View>

      {/* Mesafe Seçici */}
      <View style={styles.distanceSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.distanceList}
        >
          {DISTANCE_OPTIONS.map((distance) => (
            <TouchableOpacity
              key={distance.value}
              style={[
                styles.distanceChip,
                selectedDistance.value === distance.value && styles.distanceChipSelected,
              ]}
              onPress={() => setSelectedDistance(distance)}
            >
              <Text
                style={[
                  styles.distanceChipText,
                  selectedDistance.value === distance.value && styles.distanceChipTextSelected,
                ]}
              >
                📏 {distance.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Liste/Harita Toggle */}
      <View style={styles.toggleSection}>
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleButton, viewMode === 'list' && styles.toggleButtonActive]}
            onPress={() => setViewMode('list')}
          >
            <Text style={[styles.toggleText, viewMode === 'list' && styles.toggleTextActive]}>
              📋 Liste
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, viewMode === 'map' && styles.toggleButtonActive]}
            onPress={() => setViewMode('map')}
          >
            <Text style={[styles.toggleText, viewMode === 'map' && styles.toggleTextActive]}>
              🗺️ Harita
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.resultCount}>{places.length} sonuç</Text>
      </View>

      {/* İçerik */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Yakındaki yerler aranıyor...</Text>
        </View>
      ) : (
        viewMode === 'list' ? renderListView() : renderMapView()
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  categorySection: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  categoryList: {
    paddingHorizontal: 12,
  },
  categoryCard: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    minWidth: 80,
  },
  categoryCardSelected: {
    backgroundColor: '#007AFF',
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  categoryLabelSelected: {
    color: '#FFFFFF',
  },
  distanceSection: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  distanceList: {
    paddingHorizontal: 12,
  },
  distanceChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  distanceChipSelected: {
    backgroundColor: '#E3F2FD',
    borderColor: '#007AFF',
  },
  distanceChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  distanceChipTextSelected: {
    color: '#007AFF',
    fontWeight: '600',
  },
  toggleSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 4,
  },
  toggleButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
  },
  toggleButtonActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  toggleTextActive: {
    color: '#007AFF',
    fontWeight: '600',
  },
  resultCount: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
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
    paddingBottom: 100,
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
  placeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  placeName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  placeActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  favoriteButton: {
    padding: 4,
  },
  favoriteIcon: {
    fontSize: 22,
  },
  placeNavigateIcon: {
    fontSize: 20,
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
  ratingCount: {
    fontSize: 12,
    color: '#999',
    fontWeight: '400',
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
  closedPermanently: {
    color: '#8E8E93',
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
  map: {
    flex: 1,
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
    position: 'relative',
  },
  markerContainerFavorite: {
    borderColor: '#FF3B30',
    backgroundColor: '#FFF5F5',
  },
  markerEmoji: {
    fontSize: 24,
  },
  markerFavoriteBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  markerFavoriteBadgeText: {
    fontSize: 12,
  },
});
