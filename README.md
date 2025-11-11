# Nearby Places App 📍

A React Native app that helps you find nearby places like restaurants, hospitals, gas stations, and more using Google Maps API.

## Features ✨

- 📍 Automatic user location detection
- 🔍 Search in 10 different categories (Pharmacy, Hospital, Restaurant, Cafe, Hotel, etc.)
- 📏 Customizable search distance (500m - 10km)
- 📋 Detailed information in list view
- 🗺️ Interactive map visualization
- ⭐ Rating and open/closed status display
- 🔄 Real-time refresh functionality

## Tech Stack 🛠️

- **React Native** - Mobile app development
- **Expo** - React Native toolchain
- **Google Places API** - Location data
- **Google Maps** - Map visualization
- **Expo Location** - Location services
- **React Navigation** - Screen navigation

## Setup 🚀

### Requirements

- Node.js (v16 or higher)
- npm or yarn
- Expo Go app (for mobile testing)
- Google Maps API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/gokhanaydinli/google-maps.git
   cd google-maps
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Get Google Maps API Key**

   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project
   - Navigate to "APIs & Services" > "Credentials"
   - Select "Create Credentials" > "API Key"
   - Enable these APIs:
     - Maps SDK for Android
     - Maps SDK for iOS
     - Places API
     - Maps JavaScript API

4. **Configure API Key**

   - Copy `.env.example` to `.env`
   - Add your API key to `.env`:
     ```
     GOOGLE_MAPS_API_KEY=your_api_key_here
     ```

5. **Start the app**
   ```bash
   npm start
   ```

6. **Test on mobile device**

   - Android: Open Expo Go app and scan QR code
   - iOS: Scan QR code with camera and open in Expo Go
   - Web: Press `w` in terminal

## Usage 📱

1. **Settings Screen**: Select the category and distance you want to search
2. **List Screen**: View nearby places sorted by distance
3. **Map Screen**: Visualize places on an interactive map

## Categories 📂

The app supports these categories:

- 💊 Pharmacy
- 🏥 Hospital
- 🍽️ Restaurant
- ☕ Cafe
- 🏨 Hotel
- ⛽ Gas Station
- 🏧 ATM
- 🏦 Bank
- 🛒 Supermarket
- 🅿️ Parking

## Project Structure 📁

```
maps/
├── src/
│   ├── screens/          # Screen components
│   │   ├── HomeScreen.js      # List view
│   │   ├── MapScreen.js       # Map view
│   │   └── SettingsScreen.js  # Settings
│   ├── services/         # Service layer
│   │   ├── googlePlaces.js    # Google Places API
│   │   └── location.js        # Location services
│   ├── contexts/         # React Context
│   │   └── SettingsContext.js # Settings state management
│   └── config.js         # Configuration file
├── App.js               # Main app file
├── app.config.js        # Expo configuration
└── package.json        # Dependencies
```

## Build 🏗️

### Android APK

```bash
npx eas build --platform android --profile preview
```

### iOS IPA

```bash
npx eas build --platform ios --profile preview
```

Note: You need an [Expo account](https://expo.dev/) for EAS Build.

## Troubleshooting 🔧

### Location permission issues
- Make sure location services are enabled on your device
- Grant location permission to the app

### API errors
- Verify your API key is correct
- Check that required APIs are enabled
- Monitor your API usage quota

### Map not showing
- Ensure Google Maps API key is correctly configured
- Check that Maps SDKs are enabled

## Contributing 🤝

Contributions and suggestions are welcome!

## License 📄

MIT License
