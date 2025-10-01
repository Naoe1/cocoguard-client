# Coconut Management Application Frontend - Cocoguard

A comprehensive coconut farm management platform built that empowers coconut farmers to efficiently manage their plantations from seed to sale. CocoGuard provides farm management capabilities including plantation monitoring, harvest tracking, treatment scheduling, inventory control, online marketplace integration, and real-time market analytics to maximize productivity and profitability.

<b>For the backend repo see - https://github.com/Naoe1/cocoguard-server</b>

## 🛠 Tech Stack
- React 19
- shadcn
- Tailwind CSS
- React Query 
- React Router DOM v7
- React Hook Form with Zod
- Axios
- Vitest
- React Testing Library
- Node.js
- Express.js
- Supabase
- Docker
## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn package manager

### Local Installation

1. Clone the project repository from GitHub to your local machine and install the required dependencies.

```bash
git clone https://github.com/Naoe1/cocoguard-client.git
cd cocoguard-client
```

2. Create a .env file in the project root directory with your credentials 

```bash
VITE_WEATHER_API_KEY=
VITE_WEATHER_BASE_URL=
VITE_PAYPAL_CLIENT_ID=
VITE_API_URL=
```

3. Start the development server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

For the backend installation see - https://github.com/Naoe1/cocoguard-server

### Deployment

1. Build the frontend application using:
```
npm run build
```
2. Deploy the build artifacts to a static file hosting service or a cloud platform like Netlify or Vercel.


## 🏗 Project Structure

```
src/
├── app/                    # App routing and main components
│   ├── routes/            # Route components
│   └── Index.jsx          # Main app component
├── components/            # Reusable UI components
│   ├── layout/           # Layout components
│   ├── ui/               # Base UI components
│   └── errors/           # Error handling components
├── features/             # Feature-specific modules
│   ├── auth/            # Authentication
│   ├── coconuts/        # Coconut management
│   ├── harvest/         # Harvest tracking
│   ├── inventory/       # Inventory management
│   ├── market/          # Market features
│   ├── staff/           # Staff management
│   ├── treatment/       # Treatment records
│   ├── nutrient/        # Nutrient management
│   ├── weather/         # Weather integration
│   └── disease/         # Disease management
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
├── shared/               # Shared components
└── testing/              # Test utilities
```
