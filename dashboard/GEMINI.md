# Project Overview

This is a full-stack agricultural management platform. The frontend is built with Next.js 14+ and the backend is built with Node.js and the `najm-api` framework. The application is designed to streamline farm operations, vehicle tracking, operator management, and resource optimization through intelligent automation and real-time analytics.

## Frontend

*   **Framework**: Next.js 14+ with TypeScript
*   **Styling**: Tailwind CSS with a custom component library based on shadcn/ui
*   **State Management**: Zustand for global state, React Query for server state
*   **Forms**: React Hook Form with Zod for validation
*   **Charts**: Recharts for data visualization
*   **Internationalization**: Multi-language support (i18n)

## Backend

*   **Framework**: Node.js with `najm-api`
*   **Database**: SQL with a repository pattern
*   **Authentication**: JWT with role-based access control
*   **Validation**: Multi-layer validation system

# Building and Running

## Development

To run the development server, use the following command:

```bash
bun install
bun run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Building

To build the application for production, use the following command:

```bash
bun run build
```

## Database

The project uses `drizzle-kit` for database migrations. The following commands are available:

*   `bun run db:generate`: Generate database migration files
*   `bun run db:push`: Apply database migrations
*   `bun run db:drop`: Drop the database
*   `bun run db:check`: Check the status of the database

## Testing

There are no explicit test commands in the `package.json` file.

# Development Conventions

The project uses TypeScript and ESLint for code quality. The frontend follows a feature-based structure, with each feature having its own components, hooks, and configuration. The backend follows a 4-layer architecture: Controller, Service, Repository, and Validation.

# API Endpoints

The API endpoints are documented in the `README.md` file. The base path for all API endpoints is `/api`.
