# Travel Trove - Frontend

A modern travel planning application built with React, TypeScript, and Tailwind CSS.

## 🚀 Tech Stack

### Core Technologies

- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe JavaScript development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework

### UI & Styling

- **shadcn/ui** - Modern, accessible component library
- **Radix UI** - Unstyled, accessible UI primitives
- **Lucide React** - Beautiful, customizable icons
- **Sonner** - Toast notifications

### State Management

- **Zustand** - Lightweight state management with persistence
- **React Context** - Component-level state sharing

### Maps & Location Services

- **Leaflet** - Open-source mapping library
- **React-Leaflet** - React components for Leaflet
- **OpenStreetMap** - Free, open-source map tiles

### Development Tools

- **ESLint** - Code linting and formatting
- **PostCSS** - CSS processing
- **Hot Module Replacement (HMR)** - Instant development feedback

## 📁 Project Structure

```
client/src/
├── components/           # Reusable UI components
│   ├── auth/            # Authentication components
│   ├── common/          # Shared utility components
│   ├── map/             # Map-related components
│   ├── preferences/     # User preference components
│   └── ui/              # shadcn/ui components
├── context/             # React Context providers
├── features/            # Feature-specific components
│   └── preferences/     # Preference management features
├── hooks/               # Custom React hooks
├── lib/                 # Utility libraries
├── pages/               # Page components
├── services/            # API service layers
├── stores/              # Zustand state stores
├── types/               # TypeScript type definitions
│   └── preferences/     # Consolidated preference types
└── utils/               # Utility functions
```

## 🛠️ Development Setup

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the client directory
cd travel-trove/client

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

## 🗺️ Map Integration

The application features a comprehensive map system:

- **OpenStreetMap Integration** - Free, open-source mapping
- **Place Search** - Search for locations using OSM/Nominatim
- **Interactive Markers** - Custom markers with popups
- **Itinerary Integration** - Add places directly to trip itineraries
- **Responsive Design** - Works on desktop and mobile

## 🎨 Design System

- **Tailwind CSS** - Utility-first styling approach
- **shadcn/ui Components** - Consistent, accessible UI components
- **Custom CSS** - Minimal custom styles for Leaflet integration
- **Responsive Design** - Mobile-first approach

## 🔧 Key Features

### State Management

- **Zustand Stores** - Centralized state with persistence
- **Type Safety** - Full TypeScript coverage
- **Hot Reloading** - Instant development feedback

### Map Components

- **SimpleMapComponent** - Direct Leaflet integration
- **PlacesMap** - Search and selection interface
- **AddToItineraryDialog** - Modal for itinerary management

### Preference System

- **Consolidated Types** - Single source of truth for preferences
- **Form Validation** - Comprehensive input validation
- **Persistent Storage** - User preferences saved locally

## 🚀 Deployment

### Production Build

```bash
npm run build
```

### Deployment Options

- **Lovable Platform** - One-click deployment
- **Netlify** - Custom domain support
- **Vercel** - Serverless deployment
- **GitHub Pages** - Static hosting

## 📝 Development Notes

### Code Organization

- **Consolidated Types** - All preference types in `types/preferences/`
- **Single Store Location** - All Zustand stores in `stores/`
- **Component Co-location** - Related components grouped together
- **Service Layer** - API calls abstracted in `services/`

### Best Practices

- **TypeScript First** - All components and functions typed
- **Tailwind Classes** - Utility-first CSS approach
- **Component Composition** - Reusable, composable components
- **Error Boundaries** - Graceful error handling

## 🔗 Related Projects

- **Backend API** - Node.js/Express server in `/server`
- **Database** - MongoDB with Mongoose ODM
- **Authentication** - JWT-based auth system

## 📄 License

This project is part of the Travel Trove application suite.
