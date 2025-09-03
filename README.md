# Stopky+ ⏱️

A modern, feature-rich stopwatch and time tracking application built with React Native and Expo. Track your activities, manage multiple timers, and analyze your time usage with beautiful charts.

## ✨ Features

- **Multiple Timers**: Create and manage multiple named stopwatches
- **Persistent Storage**: All your data is saved locally using SQLite
- **Beautiful Analytics**: Visualize your time usage with pie charts
- **Swipe to Delete**: Intuitive gesture controls for managing timers
- **Rename on the Fly**: Edit timer names with a simple tap
- **Real-time Updates**: Watch your timers update in real-time
- **Cross-platform**: Works on iOS, Android, and Web

## 📱 Screenshots

The app features three main screens:
- **Home Screen**: Overview of all your timers with total time tracking
- **Stopwatch Screen**: Individual timer with start/stop/reset functionality
- **Analytics Screen**: Visual breakdown of time spent on different activities

## 🛠️ Tech Stack

- **React Native** with **Expo SDK 52**
- **TypeScript** for type safety
- **Expo Router** for navigation
- **SQLite** for local data persistence
- **React Native Chart Kit** for analytics visualization
- **Expo Vector Icons** for beautiful iconography
- **React Native Gesture Handler** for smooth interactions

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or later)
- Expo CLI
- iOS Simulator / Android Emulator / Physical device

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd stopwatchAppRN3
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run on your preferred platform:
```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

## 📋 Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator
- `npm run web` - Run in web browser
- `npm test` - Run tests with Jest
- `npm run lint` - Run ESLint for code quality
- `npm run reset-project` - Reset project to default state

## 🏗️ Project Structure

```
app/
├── _layout.tsx          # Root layout component
├── index.tsx            # Home screen with timer list
├── stopwatchScreen.tsx  # Individual stopwatch interface
├── analyticsScreen.tsx  # Charts and time analytics
├── timerContext.tsx     # Global timer state management
└── components/
    └── timeItem.tsx     # Individual timer list item

assets/                  # Images, fonts, and static assets
components/              # Reusable UI components
constants/               # App constants and theme colors
hooks/                   # Custom React hooks
```

## 🎯 Core Functionality

### Timer Management
- Create new timers with custom names
- Start, stop, and reset individual timers
- Rename timers by tapping on their names
- Delete timers with swipe gestures

### Data Persistence
All timer data is automatically saved to a local SQLite database, ensuring your timing sessions persist between app launches.

### Analytics
View detailed breakdowns of your time usage with:
- Pie charts showing time distribution
- Total time calculations
- Color-coded categories

## 🔧 Database Schema

The app uses SQLite with the following structure:
- **items** table: Stores timer information (id, name, accumulated time)

## 🎨 Design Features

- Clean, minimalist interface
- Smooth animations and transitions
- Intuitive gesture controls
- Responsive design for all screen sizes
- Dark/light mode support (automatic)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## 🙏 Acknowledgments

- Built with [Expo](https://expo.dev/)
- Charts powered by [React Native Chart Kit](https://github.com/indiespirit/react-native-chart-kit)
- Icons from [Expo Vector Icons](https://icons.expo.fyi/)