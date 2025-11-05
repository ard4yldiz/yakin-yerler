import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useSettings } from '../contexts/SettingsContext';
import packageJson from '../../package.json';

export default function SettingsScreen() {
  return (
    <ScrollView style={styles.container}>

      {/* Uygulama Bilgileri */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Uygulama Bilgileri</Text>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Uygulama Adı</Text>
            <Text style={styles.infoValue}>Yakınımdaki Yerler</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Versiyon</Text>
            <Text style={styles.infoValue}>{packageJson.version}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Geliştirici</Text>
            <Text style={styles.infoValue}>Claude AI</Text>
          </View>
        </View>
      </View>

      {/* Hakkında */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hakkında</Text>

        <View style={styles.aboutCard}>
          <Text style={styles.aboutIcon}>📍</Text>
          <Text style={styles.aboutText}>
            Yakınımdaki Yerler uygulaması, konumunuzun çevresindeki eczane, otel,
            restoran ve daha fazla yeri bulmanızı sağlar.
          </Text>
        </View>
      </View>

      {/* Özellikler */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Özellikler</Text>

        <View style={styles.featuresList}>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>🔍</Text>
            <Text style={styles.featureText}>10 farklı kategoride arama</Text>
          </View>

          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>📏</Text>
            <Text style={styles.featureText}>Özelleştirilebilir mesafe (500m - 10km)</Text>
          </View>

          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>🗺️</Text>
            <Text style={styles.featureText}>Harita ve liste görünümü</Text>
          </View>

          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>❤️</Text>
            <Text style={styles.featureText}>Favori yerlerinizi kaydedin</Text>
          </View>

          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>🧭</Text>
            <Text style={styles.featureText}>Haritada navigasyon</Text>
          </View>
        </View>
      </View>

      {/* Bilgi Kartı */}
      <View style={styles.tipCard}>
        <Text style={styles.tipIcon}>💡</Text>
        <Text style={styles.tipTitle}>İpucu</Text>
        <Text style={styles.tipText}>
          Bir yere tıkladığınızda Google Maps veya cihazınızın harita uygulamasında
          açabilirsiniz!
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  section: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 4,
  },
  aboutCard: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  aboutIcon: {
    fontSize: 64,
    marginBottom: 12,
  },
  aboutText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  featuresList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  featureText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  tipCard: {
    backgroundColor: '#FFF3CD',
    padding: 16,
    margin: 16,
    marginBottom: 100, // Bottom tab için extra boşluk
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFE69C',
    alignItems: 'center',
  },
  tipIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#856404',
    textAlign: 'center',
    lineHeight: 20,
  },
});
