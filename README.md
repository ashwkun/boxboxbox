# tv.io

tv.io is a modern movie recommendation Progressive Web App (PWA) that allows users to discover, search, and save their favorite movies.

![tv.io logo](public/logo.lottie)

## Features

- **Movie Discovery**: Browse popular, upcoming, and top-rated movies
- **Movie Details**: View detailed information about movies including cast, ratings, and trailers
- **Search Functionality**: Search for movies by title
- **User Authentication**: Sign up and login with email/password or Google
- **Personalization**: Save movies to watchlist and favorites
- **Responsive Design**: Works on mobile, tablet, and desktop devices
- **PWA Support**: Install as a native app on supported devices

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication & Database**: Firebase (Auth, Firestore)
- **Animations**: Framer Motion, Lottie
- **Icons**: React Icons
- **API**: TMDB (The Movie Database)
- **Deployment**: Firebase Hosting

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- Firebase account
- TMDB API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ashwkun/tvio.git
   cd tvio
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory with your API keys:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-firebase-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-firebase-messaging-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-firebase-app-id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-firebase-measurement-id
   NEXT_PUBLIC_TMDB_API_KEY=your-tmdb-api-key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

This project is configured for deployment to Firebase Hosting:

1. Install the Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize your Firebase project:
   ```bash
   firebase init
   ```

4. Build your Next.js app:
   ```bash
   npm run build
   ```

5. Deploy to Firebase:
   ```bash
   firebase deploy
   ```

## License

MIT

## Attribution

Data provided by [The Movie Database API](https://www.themoviedb.org/documentation/api). This product uses the TMDB API but is not endorsed or certified by TMDB.
