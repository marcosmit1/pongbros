# PongBros - Beer Pong Booking System

A modern web application for managing beer pong bookings at bars and venues. Built with Next.js 15.2.3 and Firebase.

## Features

- 🍺 Bar/Venue Management Dashboard
- 📅 Real-time Booking System
- 🔐 Secure Authentication
- 📱 Mobile-Responsive Design
- 🎯 Beer Pong Table Management
- 💫 Modern UI with Glass Effects

## Tech Stack

- Next.js 15.2.3
- Firebase (Auth, Firestore, Storage)
- TypeScript
- Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/pongbros.co.za.git
cd pongbros.co.za
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory with your Firebase configuration:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── bars/              # Bar management pages
│   ├── dashboard/         # Dashboard pages
│   ├── login/            # Authentication pages
│   └── register/         # Registration pages
├── components/            # Reusable components
├── contexts/             # React contexts
├── lib/                  # Utility functions and Firebase setup
└── styles/              # Global styles and Tailwind config
```

## Deployment

The project is set up for easy deployment to Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your environment variables
4. Deploy!

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
