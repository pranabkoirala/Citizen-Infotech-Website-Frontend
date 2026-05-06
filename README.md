# Flowing Frontend

A modern, responsive, and dynamic web application built for an agency/corporate portfolio. The platform features a public-facing website and a secure, comprehensive admin dashboard for content management.

## 🚀 Tech Stack

- **Frontend Framework**: [React 18](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) (built on Radix UI)
- **Routing**: [React Router](https://reactrouter.com/)
- **State Management & Data Fetching**: [React Query (@tanstack/react-query)](https://tanstack.com/query/latest)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Forms & Validation**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/)

## 📂 Project Structure

```text
flowing-frontend/
├── public/               # Static assets
├── src/
│   ├── components/       # Reusable UI components (including shadcn/ui)
│   ├── contexts/         # React contexts (AuthContext, ThemeContext, etc.)
│   ├── hooks/            # Custom React hooks
│   ├── images/           # Image assets
│   ├── lib/              # Utility functions and shared libraries
│   ├── pages/            # Application pages/routes
│   │   ├── admin/        # Admin dashboard pages
│   │   └── ...           # Public pages (Index, About, Work, Team, etc.)
│   ├── App.tsx           # Main application routing and setup
│   ├── main.tsx          # Application entry point
│   └── index.css         # Global styles and Tailwind configuration
├── .env.example          # Example environment variables
├── package.json          # Project metadata and dependencies
├── tailwind.config.ts    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
└── vite.config.ts        # Vite configuration
```

## 🗺️ Key Features & Routes

### Public Application
- **Home** (`/`)
- **About** (`/about`)
- **Work** (`/work`)
- **Inside** (`/inside`)
- **Team** (`/team`)
- **Careers** (`/careers`)
- **Contact** (`/contact`)

### Admin Dashboard (Protected)
Accessible via `/admin`, the dashboard allows administrators to manage:
- **Authentication**: Login (`/admin/login`)
- **Dashboard Overview**: (`/admin`)
- **Content Management**: Home, Works, Services, Inside, Team, Pages
- **Careers Management**: Jobs, Applications
- **Interactions**: Messages
- **Platform**: Settings

## 🛠️ Getting Started

### Prerequisites

You can use `npm` or `bun` (recommended, as `bun.lockb` is present).

- Node.js (v18+)
- Bun (optional, but supported)

### Installation

1. Clone the repository and navigate to the project directory:
   ```bash
   cd flowing-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   bun install
   ```

3. Set up environment variables:
   Copy `.env.example` to `.env` and fill in the required values.
   ```bash
   cp .env.example .env
   ```

### Running the Development Server

Start the Vite development server:

```bash
npm run dev
# or
bun run dev
```

The application will be available at `http://localhost:8080` (or the port specified by Vite).

### Building for Production

To create a production build:

```bash
npm run build
# or
bun run build
```

The built assets will be located in the `dist` directory.

## 🧪 Testing and Linting

- **Run tests**: `npm run test` or `npm run test:watch`
- **Run linter**: `npm run lint`

## 🎨 Styling

The project uses **Tailwind CSS** for utility-first styling and **shadcn/ui** for accessible, customizable components. Global styles and Tailwind directives are located in `src/index.css`.

## 🔒 Authentication & Authorization

The admin area is protected by a `ProtectedRoute` wrapper component. Authentication state is managed via the `AuthContext`.
