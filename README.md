# tv.io

![tv.io Logo](./src/assets/images/logo.png)

## Overview

tv.io is a sophisticated platform that combines beautiful UI design with advanced recommendation algorithms. It features a neural network visualization for rating progress, real-time user preferences, and a personalized recommendation system.

## Features

- **Emotional Rating System**: Rate content based on emotional responses rather than just stars
- **Neural Network Visualization**: See how your ratings influence recommendations
- **Personalized Recommendations**: Get content suggestions based on your unique taste profile
- **Responsive Design**: Optimized for all devices from mobile to desktop
- **Dark Mode**: Easy on the eyes with a beautiful dark theme

## Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Animation**: Framer Motion
- **State Management**: React Context API
- **Authentication**: Firebase Auth
- **Database**: Firestore
- **API**: TMDB (The Movie Database)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account
- TMDB API key

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/tvio.git
   cd tvio
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   REACT_APP_FIREBASE_APP_ID=your_firebase_app_id
   REACT_APP_TMDB_API_KEY=your_tmdb_api_key
   ```

4. Start the development server:
   ```
   npm start
   ```

## Project Structure

```
src/
├── assets/          # Static assets (images, fonts)
├── components/      # Reusable UI components
├── contexts/        # React context providers
├── hooks/           # Custom React hooks
├── pages/           # Page components
├── services/        # API and service integrations
├── styles/          # Global styles and Tailwind config
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
├── App.tsx          # Main App component
└── index.tsx        # Entry point
```

## Onboarding Flow

1. **Age Selection**: Helps personalize content ratings
2. **Country Selection**: Customizes content availability
3. **Movie Rating**: Rate a selection of popular movies
4. **Movie Favorites**: Search and rate your favorite movies
5. **TV Show Rating**: Rate a selection of popular TV shows
6. **TV Show Favorites**: Search and rate your favorite TV shows
7. **Completion**: Finalizes your preference profile

## Recommendation Algorithm

The recommendation system uses a combination of:

- Content-based filtering
- Collaborative filtering
- Emotional response patterns
- Genre preferences
- Release era preferences
- Language preferences

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- TMDB for providing the movie and TV show data
- Firebase for authentication and database services
- The open source community for the amazing tools and libraries

---

# tv.io Brand Kit & Design System

tv.io is a sophisticated movie and TV series tracking platform that combines emotional design with advanced recommendation systems. This document outlines our brand kit and design system.

## Core Values

- **Emotional Intelligence**: We prioritize emotional connections over algorithmic coldness
- **Personalization**: Every user experience is unique
- **Simplicity**: Complex technology with simple interfaces
- **Inclusivity**: Accessible to all users regardless of device or ability
- **Trust**: Transparent about data usage and recommendations

## Color System

### Primary Colors

- **Gradient Pink**: #FF007A → #FF5E5E (Primary brand color, used for emphasis)
- **Gradient Purple**: #7A00FF → #FF007A (Secondary brand color, used for accents)
- **Dark Background**: #121212 (Main background color)
- **Dark Card**: #1E1E1E (Card and component backgrounds)
- **Dark Border**: #2A2A2A (Subtle borders and dividers)

### Emotional Rating Colors

- **Great**: #FF007A (Pink)
- **Good**: #7A00FF (Purple)
- **Meh**: #FFB800 (Amber)
- **Nooo**: #FF3D00 (Red-Orange)
- **Thinking**: #00B8FF (Blue)
- **Won't Watch**: #757575 (Gray)

## Typography

### Font Families

- **Display**: Clash Display (Variable font with weights 200-700)
- **Body**: Inter (Variable font with weights 400-600)

### Type Scale

- **h1**: 2.5rem/3rem, Clash Display, Bold
- **h2**: 2rem/2.5rem, Clash Display, Bold
- **h3**: 1.5rem/2rem, Clash Display, Bold
- **h4**: 1.25rem/1.75rem, Clash Display, Medium
- **body**: 1rem/1.5rem, Inter, Regular
- **small**: 0.875rem/1.25rem, Inter, Regular
- **caption**: 0.75rem/1rem, Inter, Medium

## Animation System

### Transitions

- **Default**: 300ms ease-in-out
- **Emphasis**: 500ms cubic-bezier(0.16, 1, 0.3, 1)
- **Quick**: 150ms ease

### Motion Principles

- **Responsive**: Immediate feedback to user actions
- **Natural**: Physics-based animations that feel organic
- **Purposeful**: Animations guide attention and provide context
- **Efficient**: Optimized for performance across devices

## Component Library

### Cards

- **Content Card**: Displays movie/TV information with poster
- **Rating Card**: Interactive card for rating content
- **Profile Card**: User information display

### Buttons

- **Primary Button**: Gradient background, white text
- **Secondary Button**: Transparent with border
- **Icon Button**: Circular button with icon

### Inputs

- **Text Input**: Clean, minimal with animated focus states
- **Search Input**: With integrated search icon
- **Selection Controls**: Custom radio buttons and checkboxes

## Responsive Design

- **Mobile First**: Designed for mobile, then enhanced for larger screens
- **Breakpoints**:
  - Small: 640px
  - Medium: 768px
  - Large: 1024px
  - Extra Large: 1280px

## Accessibility

- **Color Contrast**: WCAG AA compliant (minimum 4.5:1 for normal text)
- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: Semantic HTML and ARIA attributes
- **Reduced Motion**: Alternative animations for users with motion sensitivity

## Motion Design

### Micro-interactions

- **Button Hover/Press**: Subtle scale and color change
- **Card Hover**: Slight elevation change
- **Input Focus**: Animated border highlight

### Page Transitions

- **Enter**: Fade in and slight upward movement
- **Exit**: Fade out and slight downward movement
- **Between Sections**: Crossfade with position change

## Technical Integration

- **Tailwind CSS**: Custom theme extending Tailwind
- **Framer Motion**: For complex animations
- **CSS Variables**: For theme values and dark mode

---

Copyright © 2024 tv.io. All rights reserved.

# Project Name

A new project with Firebase integration.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with your Firebase configuration:
```
# Firebase Configuration
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_auth_domain
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
FIREBASE_APP_ID=your_app_id
FIREBASE_MEASUREMENT_ID=your_measurement_id
```

3. Start the development server:
```bash
npm start
```

## Firebase Configuration

The project uses Firebase for authentication and database services. The configuration is stored in `src/services/firebase.ts`. Make sure to update the Firebase configuration with your own credentials. 