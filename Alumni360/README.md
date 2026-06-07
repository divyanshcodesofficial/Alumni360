# Alumni360 - Synergy Alumni Hub

Transform your alumni engagement with Alumni360. Centralized data management, lifelong connections, and smart education impact for universities and colleges worldwide.

## Getting Started

### Prerequisites

- Node.js & npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Setup

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd synergy-alumni-hub

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:8080`.

## Tech Stack

- **Vite** — Fast build tool and dev server
- **React 18** — Component-based UI library
- **TypeScript** — Type-safe JavaScript
- **Tailwind CSS** — Utility-first CSS framework
- **shadcn/ui** — Accessible, composable UI components
- **React Router** — Client-side routing
- **TanStack Query** — Data fetching and caching
- **Recharts** — Charting library

## Project Structure

```
src/
├── assets/          # Static assets (images, etc.)
├── components/      # Reusable UI components
│   ├── modals/      # Modal dialogs
│   ├── sections/    # Page sections
│   └── ui/          # Base UI primitives (shadcn/ui)
├── hooks/           # Custom React hooks
├── lib/             # Utility functions
├── pages/           # Route-level page components
├── App.tsx          # Root app component
├── main.tsx         # Entry point
└── index.css        # Global styles
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## License

All rights reserved.
