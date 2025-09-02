# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Immpression is a React Native mobile application built with Expo for an art-focused social media platform. The app allows users to browse, share, and purchase artwork, with separate experiences for authenticated and guest users.

## Technology Stack

- **Framework**: React Native with Expo (v53)
- **Navigation**: React Navigation v7 with stack navigator
- **State Management**: React Context (AuthProvider for authentication)
- **Storage**: AsyncStorage for local data persistence
- **Payments**: Stripe integration
- **Image Handling**: Cloudinary for uploads, Expo Image Picker/Manipulator
- **Styling**: React Native StyleSheet

## Development Commands

```bash
# Install dependencies
npm i

# Start development server (runs on port 8081)
npm start

# Run on Android
npm run android

# Run on iOS  
npm run ios

# Run on web
npm run web
```

## Project Architecture

### Authentication Flow
- **AuthProvider** (`state/AuthProvider.js`) manages user authentication state
- Token-based authentication with automatic refresh
- Conditional navigation based on authentication status via `utils/helpers.js`

### Navigation Structure
- **Guest users**: Login, SignUp, PasswordReset flows
- **Authenticated users**: Home, Profile, Upload, Statistics, Settings, and marketplace features
- Navigation configuration in `utils/constants.js` with separate `UserNavigation` and `GuestNavigation` arrays

### Key Directories
- `screens/`: Main application screens (Home, Profile, Upload, etc.)
- `components/`: Reusable UI components organized by feature
  - `home_sections/`: Homepage content sections (ArtForYou, FeaturedArtists, etc.)
  - `profile_sections/`: Profile-related components
- `state/`: Context providers and state management
- `utils/`: Helper functions, constants, and utility modules
- `assets/`: Images, fonts, and static resources organized by category
- `API/`: API integration and backend communication

### Backend Configuration
- Production: `https://immpression-backend.vercel.app`
- Development: Configure local IP in `API_URL.js` or `config.js`
- Environment switching controlled by `ENV` variable in `API_URL.js`

## Key Features

### Core Functionality
- User authentication with JWT tokens
- Art browsing and categorization
- Artist profiles and galleries
- Image upload and manipulation
- Payment processing with Stripe
- Social features (likes, follows, sharing)

### Screen Templates
- `ScreenTemplate.js`: Standard screen layout with footer navigation
- `ScreenNoFooterTemplate.js`: Full-screen layout without navigation

### Component Patterns
- Section-based architecture for homepage content
- Modular profile components for user pages
- Reusable UI elements (SearchBar, Navbar, etc.)

## Development Notes

### Local Development Setup
1. Ensure mobile device and development machine are on same network
2. Update IP address in `config.js` or `API_URL.js` for local backend testing
3. Use Expo DevTools for debugging and testing

### State Management
- Authentication state persisted in AsyncStorage
- Context-based state sharing across components
- Token expiration handling with automatic refresh

### Image Handling
- Cloudinary integration for image uploads and manipulation
- Expo Image Picker for camera/gallery access
- Optimized image loading and caching

### Payment Integration
- Stripe configured with test keys (update for production)
- Payment flow integrated into purchase screens
- Secure token handling for payment processing