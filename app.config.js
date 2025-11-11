require('dotenv/config');

export default {
  expo: {
    name: "Yakınımdaki Yerler",
    slug: "yakinYerler",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    plugins: [
      [
        "expo-location",
        {
          locationAlwaysAndWhenInUsePermission: "Bu uygulama yakınızdaki yerleri bulmak için konumunuza erişmek istiyor."
        }
      ]
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.yakinYerler.app",
      infoPlist: {
        NSLocationWhenInUseUsageDescription: "Bu uygulama yakınızdaki yerleri bulmak için konumunuza erişmek istiyor.",
        NSLocationAlwaysUsageDescription: "Bu uygulama yakınızdaki yerleri bulmak için konumunuza erişmek istiyor."
      },
      config: {
        googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      edgeToEdgeEnabled: true,
      package: "com.yakinYerler.app",
      permissions: [
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION"
      ],
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_API_KEY
        }
      }
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    extra: {
      GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY
    }
  }
};