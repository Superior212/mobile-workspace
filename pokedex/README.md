# Pokédex App

A modern, cross-platform mobile application built with React Native and Expo that allows you to browse and explore Pokémon from the [PokéAPI](https://pokeapi.co/). Discover detailed information about your favorite Pokémon including stats, abilities, moves, and more.

## Features

- 🎨 **Beautiful UI**: Modern, dark-themed interface with type-based color coding
- 📱 **Cross-Platform**: Works on iOS, Android, and Web
- 🔍 **Pokémon Browser**: Browse through the first 100 Pokémon in a beautiful grid layout
- 📄 **Pagination**: Navigate through Pokémon with Previous/Next buttons
- 📊 **Detailed View**: View comprehensive information about each Pokémon including:
  - Physical stats (height, weight)
  - Base stats with visual progress bars
  - Abilities (including hidden abilities)
  - Top 20 moves
  - Type information with color-coded badges
- ⚡ **Loading States**: Skeleton loading animations for better UX
- 🎯 **Type-Based Styling**: Each Pokémon card is color-coded based on its primary type

## Tech Stack

- **Framework**: [Expo](https://expo.dev) ~54.0.25
- **Navigation**: [Expo Router](https://docs.expo.dev/router/introduction/) ~6.0.15 (file-based routing)
- **Language**: TypeScript
- **UI Library**: React Native 0.81.5
- **API**: [PokéAPI](https://pokeapi.co/)
- **Architecture**: React Native New Architecture enabled

## Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn
- Expo CLI (installed globally or via npx)
- For iOS development: Xcode (macOS only)
- For Android development: Android Studio

## Installation

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Start the development server**

   ```bash
   npx expo start
   ```

   Or use the npm scripts:

   ```bash
   npm start        # Start Expo dev server
   npm run android  # Start on Android
   npm run ios      # Start on iOS simulator
   npm run web      # Start on web browser
   ```

## Development

### Running the App

After starting the Expo development server, you can:

- Press `a` to open on Android emulator
- Press `i` to open on iOS simulator
- Press `w` to open in web browser
- Scan the QR code with Expo Go app on your physical device

### Project Structure

```
pokedex/
├── app/
│   ├── _layout.tsx    # Root layout with navigation setup
│   ├── index.tsx      # Main Pokémon list screen
│   └── details.tsx    # Pokémon detail screen
├── assets/
│   └── images/        # App icons and images
├── app.json           # Expo configuration
├── package.json       # Dependencies and scripts
└── tsconfig.json      # TypeScript configuration
```

### Key Files

- **`app/index.tsx`**: Main screen displaying the Pokémon grid with pagination
- **`app/details.tsx`**: Detail screen showing comprehensive Pokémon information
- **`app/_layout.tsx`**: Root layout component

## API Information

This app uses the [PokéAPI](https://pokeapi.co/) to fetch Pokémon data. The app currently displays the first 100 Pokémon and includes:

- Basic Pokémon information (name, ID, images)
- Type information
- Physical stats (height, weight)
- Base stats (HP, Attack, Defense, etc.)
- Abilities
- Moves (top 20 displayed)

## Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Start the app on Android emulator
- `npm run ios` - Start the app on iOS simulator
- `npm run web` - Start the app in web browser
- `npm run lint` - Run ESLint to check code quality

## Pokémon Type Colors

The app uses color-coded badges and cards based on Pokémon types:

- 🟢 Grass: `#78C850`
- 🔴 Fire: `#F08030`
- 🔵 Water: `#6890F0`
- 🟡 Electric: `#F8D030`
- 🟣 Poison: `#A040A0`
- 🟤 Ground: `#E0C068`
- 🐛 Bug: `#A8B820`
- ⚪ Normal: `#A8A878`
- 💖 Fairy: `#EE99AC`
- And more...

## Features in Detail

### Main Screen (`index.tsx`)

- Grid layout with 2 columns
- Skeleton loading animations
- Pagination controls (Previous/Next)
- Tap any Pokémon card to view details
- Type-based card coloring

### Detail Screen (`details.tsx`)

- Large Pokémon image
- Type badges with color coding
- Physical stats display
- Base stats with visual progress bars
- Abilities list (including hidden abilities)
- Moves grid (top 20 moves)

## Learn More

- [Expo Documentation](https://docs.expo.dev/)
- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)
- [React Native Documentation](https://reactnative.dev/)
- [PokéAPI Documentation](https://pokeapi.co/docs/v2)

## License

This project is private and for personal use.
