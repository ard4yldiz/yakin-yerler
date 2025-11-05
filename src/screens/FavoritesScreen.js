import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import { useSettings } from '../contexts/SettingsContext';
import { formatDistance, calculateDistance } from '../services/location';

export default function FavoritesScreen() {
  const { favorites, toggleFavorite, userLocation } = useSettings();

  const openInMaps = (place) => {
    const latitude = place.location.latitude;
    const longitude = place.location.longitude;
    const label = encodeURIComponent(place.name);

    const scheme = Platform.select({
      ios: `maps:0,0?q=${label}@${latitude},${longitude}`,
      android: `geo:0,0?q=${latitude},${longitude}(${label})`,
    });

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

  const handleFavoriteToggle = (e, place) => {
    e.stopPropagation();
    Alert.alert(
      'Favorilerden Çıkar',
      `${place.name} favorilerden çıkarılsın mı?`,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Çıkar',
          style: 'destructive',
          onPress: () => toggleFavorite(place),
        },
      ]
    );
  };

  const renderFavoriteItem = ({ item }) => {
    // Eğer kullanıcı konumu varsa mesafeyi hesapla
    let distance = null;
    if (userLocation) {
      distance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        item.location.latitude,
        item.location.longitude
      );
    }

    return (
      <TouchableOpacity style={styles.favoriteCard} onPress={() => openInMaps(item)}>
        <View style={styles.favoriteInfo}>
          <View style={styles.favoriteHeader}>
            <Text style={styles.favoriteName}>{item.name}</Text>
            <View style={styles.favoriteActions}>
              <TouchableOpacity
                style={styles.favoriteButton}
                onPress={(e) => handleFavoriteToggle(e, item)}
              >
                <Text style={styles.favoriteIcon}>❤️</Text>
              </TouchableOpacity>
              <Text style={styles.navigateIcon}>🧭</Text>
            </View>
          </View>
          <Text style={styles.favoriteAddress}>{item.address}</Text>

          <View style={styles.favoriteDetails}>
            {distance !== null && (
              <Text style={styles.favoriteDistance}>
                📍 {formatDistance(distance)}
              </Text>
            )}

            {item.rating > 0 && (
              <Text style={styles.favoriteRating}>
                ⭐ {item.rating.toFixed(1)}
                {item.ratingCount > 0 && (
                  <Text style={styles.ratingCount}> ({item.ratingCount})</Text>
                )}
              </Text>
            )}

            {item.isOpen !== undefined && (
              <Text style={[styles.favoriteStatus, item.isOpen ? styles.open : styles.closed]}>
                {item.isOpen ? '🟢 Açık' : '🔴 Kapalı'}
              </Text>
            )}
          </View>

          <Text style={styles.favoriteAddedDate}>
            Eklenme: {new Date(item.addedAt).toLocaleDateString('tr-TR')}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>❤️</Text>
      <Text style={styles.emptyText}>Henüz favori yeriniz yok</Text>
      <Text style={styles.emptySubtext}>
        Ana sayfadan kalp ikonuna tıklayarak favori ekleyebilirsiniz
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        renderItem={renderFavoriteItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmpty}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 100,
    flexGrow: 1,
  },
  favoriteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#FF3B30',
  },
  favoriteInfo: {
    flex: 1,
  },
  favoriteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  favoriteName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  favoriteActions: {
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
  navigateIcon: {
    fontSize: 20,
  },
  favoriteAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  favoriteDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 8,
  },
  favoriteDistance: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  favoriteRating: {
    fontSize: 14,
    color: '#FF9500',
    fontWeight: '500',
  },
  ratingCount: {
    fontSize: 12,
    color: '#999',
    fontWeight: '400',
  },
  favoriteStatus: {
    fontSize: 14,
    fontWeight: '500',
  },
  open: {
    color: '#34C759',
  },
  closed: {
    color: '#FF3B30',
  },
  favoriteAddedDate: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
    marginTop: 4,
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
    paddingHorizontal: 40,
  },
});
