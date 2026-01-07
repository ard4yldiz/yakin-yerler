require('dotenv/config');

module.exports = {
  expo: {
    name: "Yakınımdaki Yerler",
    slug: "yakinYerler",
    owner: "ardayildiz",
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
      GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
      eas: {
        projectId: "396e54e8-d2be-4fda-b79c-e15dde3ecc95"
      }
    }
  }
};