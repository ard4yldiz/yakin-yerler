# Yakındaki Yerler Uygulaması

Google Maps API kullanarak yakınızdaki restoran, hastane, benzin istasyonu ve daha fazlasını bulmanıza yardımcı olan React Native uygulaması.

## Özellikler

- Otomatik kullanıcı konumu tespiti
- 10 farklı kategoride arama (Eczane, Hastane, Restoran, Kafe, Otel, vb.)
- Özelleştirilebilir arama mesafesi (500m - 10km)
- Liste görünümünde detaylı bilgiler
- İnteraktif harita görselleştirmesi
- Puan ve açık/kapalı durumu gösterimi
- Gerçek zamanlı yenileme fonksiyonu
- Favori yerler özelliği

## Teknoloji Yığını

- **React Native** - Mobil uygulama geliştirme
- **Expo** - React Native araç zinciri
- **Google Places API** - Konum verileri
- **Google Maps** - Harita görselleştirmesi
- **Expo Location** - Konum servisleri
- **React Navigation** - Ekran navigasyonu

## Kurulum

### Gereksinimler

- Node.js (v16 veya üstü)
- npm veya yarn
- Expo Go uygulaması (mobil test için)
- Google Maps API Key

### Kurulum Adımları

1. **Depoyu klonlayın**
   ```bash
   git clone https://github.com/gokhanaydinli/google-maps.git
   cd google-maps
   ```

2. **Bağımlılıkları yükleyin**
   ```bash
   npm install
   ```

3. **Google Maps API Key Alın**

   - [Google Cloud Console](https://console.cloud.google.com/) adresine gidin
   - Yeni bir proje oluşturun
   - "APIs & Services" > "Credentials" bölümüne gidin
   - "Create Credentials" > "API Key" seçeneğini seçin
   - Şu API'leri etkinleştirin:
     - Maps SDK for Android
     - Maps SDK for iOS
     - Places API
     - Maps JavaScript API

4. **API Key'i Yapılandırın**

   - `.env.example` dosyasını `.env` olarak kopyalayın
   - API key'inizi `.env` dosyasına ekleyin:
     ```
     GOOGLE_MAPS_API_KEY=sizin_api_keyiniz
     ```

5. **Uygulamayı başlatın**
   ```bash
   npm start
   ```

6. **Mobil cihazda test edin**

   - Android: Expo Go uygulamasını açın ve QR kodu tarayın
   - iOS: Kamera ile QR kodu tarayın ve Expo Go'da açın
   - Web: Terminalde `w` tuşuna basın

## Kullanım

1. **Ayarlar Ekranı**: Aramak istediğiniz kategori ve mesafeyi seçin
2. **Liste Ekranı**: Mesafeye göre sıralanmış yakındaki yerleri görüntüleyin
3. **Harita Ekranı**: Yerleri interaktif haritada görselleştirin
4. **Favoriler Ekranı**: Favori yerlerinizi görüntüleyin ve yönetin

## Kategoriler

Uygulama şu kategorileri destekler:

- Eczane
- Hastane
- Restoran
- Kafe
- Otel
- Benzin İstasyonu
- ATM
- Banka
- Market
- Otopark

## Proje Yapısı

```
maps/
├── src/
│   ├── screens/          # Ekran bileşenleri
│   │   ├── MainScreen.js      # Liste ve harita görünümü
│   │   ├── FavoritesScreen.js # Favoriler ekranı
│   │   └── SettingsScreen.js  # Ayarlar
│   ├── services/         # Servis katmanı
│   │   ├── googlePlaces.js    # Google Places API
│   │   ├── location.js        # Konum servisleri
│   │   └── favorites.js       # Favori yönetimi
│   ├── contexts/         # React Context
│   │   └── SettingsContext.js # Ayarlar state yönetimi
│   └── config.js         # Yapılandırma dosyası
├── App.js               # Ana uygulama dosyası
├── app.config.js        # Expo yapılandırması
├── eas.json            # EAS Build yapılandırması
└── package.json        # Bağımlılıklar
```

## Build

### Android APK

```bash
eas build --platform android --profile preview
```

### iOS IPA

```bash
eas build --platform ios --profile preview
```

Not: EAS Build için [Expo hesabı](https://expo.dev/) gereklidir.

## Sorun Giderme

### Konum izni sorunları
- Cihazınızda konum servislerinin açık olduğundan emin olun
- Uygulamaya konum izni verin

### API hataları
- API key'inizin doğru olduğunu kontrol edin
- Gerekli API'lerin etkinleştirildiğini kontrol edin
- API kullanım kotanızı izleyin
- Billing hesabının aktif olduğundan emin olun

### Harita görünmüyor
- Google Maps API key'inin doğru yapılandırıldığından emin olun
- Maps SDK'larının etkinleştirildiğini kontrol edin

## Katkıda Bulunma

Katkılar ve öneriler memnuniyetle karşılanır!

## Lisans

MIT License
