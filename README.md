# TV.io - Movie & TV Series Tracking App

TV.io is a web application for discovering, tracking, and getting recommendations for movies and TV shows. Built with React, TypeScript, and Firebase.

## Features (Planned)

- Browse trending movies and TV shows
- Search for specific titles
- View detailed information about movies and TV shows
- Track your watchlist
- Get personalized recommendations
- User authentication and profiles
- Rate and review content
- Share recommendations with friends

## Technology Stack

- Frontend: React, TypeScript, SCSS
- Build Tool: Parcel
- Backend/Database: Firebase (Firestore)
- Authentication: Firebase Auth
- API: TMDB (The Movie Database)
- Hosting: Firebase Hosting

## Project Setup

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/tvio.git
cd tvio
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm start
# or
yarn start
```

4. Open [http://localhost:1234](http://localhost:1234) to view the app in your browser.

## Project Structure

```
tvio/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page components
│   ├── services/       # API and Firebase services
│   ├── utils/          # Utility functions
│   ├── styles/         # SCSS stylesheets
│   ├── assets/         # Static assets
│   ├── App.tsx         # Main App component
│   └── index.tsx       # Entry point
├── package.json
├── PROJECT-PHASES.md   # Detailed development phases
└── README.md
```

## Development Phases

This project is being developed in phases, with each phase focusing on a single feature. For a detailed breakdown of each phase including goals, tasks, deliverables, timeline, and testing strategy, see [PROJECT-PHASES.md](PROJECT-PHASES.md).

Overview of phases:

1. **Phase 1**: Project Setup and Basic Structure
2. **Phase 2**: Authentication (Sign up, Login, Profile)
3. **Phase 3**: Browse Movies and TV Shows
4. **Phase 4**: Search Functionality
5. **Phase 5**: Detailed Movie/TV Show Information
6. **Phase 6**: Watchlist Management
7. **Phase 7**: Personalized Recommendations
8. **Phase 8**: User Reviews and Ratings
9. **Phase 9**: Social Features and Sharing
10. **Phase 10**: UI/UX Enhancements and Optimizations

## License

This project is licensed under the MIT License.

## Acknowledgements

- [TMDB API](https://developers.themoviedb.org/3) for providing movie and TV show data
- [Firebase](https://firebase.google.com/) for authentication, database, and hosting services 