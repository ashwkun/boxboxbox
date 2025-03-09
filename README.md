# TV.io

A modern movie and TV series recommendation platform built with Next.js, Firebase, and TMDB API.

## Features

- 🎬 Personalized movie recommendations using collaborative and content-based filtering
- 🔥 Real-time user ratings and preferences
- 🎨 Beautiful, modern UI with smooth animations
- 🧠 Neural network visualization for rating progress
- 🔒 Secure authentication with Firebase
- 📱 Fully responsive design

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Firebase (Authentication, Firestore)
- **APIs**: TMDB API
- **Deployment**: Vercel

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/tvio.git
cd tvio
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory with your API keys:
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser.

## Deployment

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase:
```bash
firebase init
```

4. Deploy Firestore rules:
```bash
firebase deploy --only firestore:rules
```

5. Deploy to Vercel:
```bash
vercel
```

## Project Structure

```
tvio/
├── src/
│   ├── app/                 # Next.js app router pages
│   ├── components/          # React components
│   ├── lib/                 # Utilities and services
│   │   ├── firebase/       # Firebase configuration and services
│   │   └── services/       # API services (TMDB, recommendations)
│   └── styles/             # Global styles
├── public/                 # Static assets
├── firestore.rules         # Firestore security rules
└── package.json           # Project dependencies and scripts
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 