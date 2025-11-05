# Yakınımdaki Yerler 📍

Konumunuzun çevresindeki eczane, otel, restoran ve daha fazla yeri bulmanızı sağlayan React Native mobil uygulaması.

## Özellikler ✨

- 📍 Kullanıcı konumunu otomatik algılama
- 🔍 10 farklı kategoride yer arama (Eczane, Hastane, Restoran, Kafe, Otel, vb.)
- 📏 Özelleştirilebilir arama mesafesi (500m - 10km)
- 📋 Liste görünümünde detaylı bilgiler
- 🗺️ Harita üzerinde görselleştirme
- ⭐ Puan ve açık/kapalı durumu gösterimi
- 🔄 Anlık yenileme özelliği

## Teknolojiler 🛠️

- **React Native** - Mobil uygulama geliştirme
- **Expo** - React Native toolchain
- **Google Places API** - Yer verilerini çekme
- **Google Maps** - Harita görselleştirme
- **Expo Location** - Konum servisleri
- **React Navigation** - Ekranlar arası geçiş

## Kurulum 🚀

### Gereksinimler

- Node.js (v16 veya üzeri)
- npm veya yarn
- Expo Go uygulaması (mobil cihazınızda test için)
- Google Maps API Anahtarı

### Adımlar

1. **Projeyi klonlayın veya indirin**

2. **Bağımlılıkları yükleyin**
   ```bash
   npm install
   ```

3. **Google Maps API Anahtarı Alın**

   - [Google Cloud Console](https://console.cloud.google.com/) adresine gidin
   - Yeni bir proje oluşturun
   - "APIs & Services" > "Credentials" bölümüne gidin
   - "Create Credentials" > "API Key" seçin
   - Şu API'leri aktif edin:
     - Maps SDK for Android
     - Maps SDK for iOS
     - Places API
     - Maps JavaScript API

4. **API Anahtarını Yapılandırın**

   `src/config.js` dosyasındaki `GOOGLE_MAPS_API_KEY` değerini kendi API anahtarınızla değiştirin:

   ```javascript
   export const GOOGLE_MAPS_API_KEY = 'BURAYA_API_ANAHTARINIZI_EKLEYIN';
   ```

   Ayrıca `app.json` dosyasındaki ilgili yerlere de API anahtarınızı ekleyin.

5. **Uygulamayı Başlatın**
   ```bash
   npx expo start
   ```

6. **Mobil Cihazda Test Edin**

   - Android: Expo Go uygulamasını açın ve QR kodu tarayın
   - iOS: Kamera uygulamasıyla QR kodu tarayın ve Expo Go'da açın
   - Web: Tarayıcınızda `w` tuşuna basın

## Kullanım 📱

1. **Ayarlar Ekranı**: Aramak istediğiniz kategoriyi ve mesafeyi seçin
2. **Liste Ekranı**: Yakındaki yerleri mesafeye göre sıralı liste halinde görün
3. **Harita Ekranı**: Yerleri harita üzerinde görselleştirin

## Proje Yapısı 📁

```
yakinYerler/
├── src/
│   ├── screens/          # Ekran komponentleri
│   │   ├── HomeScreen.js      # Liste görünümü
│   │   ├── MapScreen.js       # Harita görünümü
│   │   └── SettingsScreen.js  # Ayarlar
│   ├── services/         # Servis katmanı
│   │   ├── googlePlaces.js    # Google Places API
│   │   └── location.js        # Konum servisleri
│   ├── contexts/         # React Context
│   │   └── SettingsContext.js # Ayarlar state yönetimi
│   └── config.js         # Yapılandırma dosyası
├── App.js               # Ana uygulama dosyası
├── app.json            # Expo yapılandırması
└── package.json        # Bağımlılıklar
```

## Kategoriler 📂

Uygulama şu kategorileri desteklemektedir:

- 💊 Eczane
- 🏥 Hastane
- 🍽️ Restoran
- ☕ Kafe
- 🏨 Otel
- ⛽ Benzin İstasyonu
- 🏧 ATM
- 🏦 Banka
- 🛒 Market
- 🅿️ Otopark

## Build (Derleme) 🏗️

### Android APK Oluşturma

```bash
npx eas build --platform android --profile preview
```

### iOS IPA Oluşturma

```bash
npx eas build --platform ios --profile preview
```

Not: EAS Build için [Expo hesabı](https://expo.dev/) oluşturmanız gerekir.

## Sorun Giderme 🔧

### Konum izni alınamıyor
- Cihazınızın konum servislerini açtığınızdan emin olun
- Uygulamaya konum izni verdiğinizden emin olun

### API hatası alıyorum
- API anahtarınızın doğru olduğundan emin olun
- Gerekli API'lerin aktif olduğunu kontrol edin
- API kotanızı aşmadığınızı kontrol edin

### Harita görünmüyor
- Google Maps API anahtarının app.json'da doğru yapılandırıldığından emin olun
- Maps SDK'larının aktif olduğunu kontrol edin

## Geliştirme İpuçları 💡

- API anahtarınızı production'da `.env` dosyasında saklayın
- API isteklerini sınırlamak için debounce kullanın
- Offline durumları için hata yönetimi ekleyin
- Test için mock data kullanın (API kotası için)

## Lisans 📄

Bu proje eğitim amaçlı geliştirilmiştir.

## Katkıda Bulunma 🤝

Önerileriniz ve katkılarınız için teşekkürler!

---

**Not**: Google Maps API kullanımı için ücret alınabilir. Ücretsiz kotayı aşmamak için API kullanımınızı takip edin.
