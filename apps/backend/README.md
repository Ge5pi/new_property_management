# Backend Setup and Usage

This document outlines the steps to set up and run the backend application.

## Prerequisites

- Node.js (v18 or higher)
- pnpm (package manager)
- PostgreSQL database
- Docker (optional, for database setup)

## Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository_url>
    cd new_property_management/apps/backend
    ```

2.  **Install dependencies:**

    ```bash
    pnpm install
    ```

## Configuration

1.  **Environment Variables:**

    Create a `.env` file in the `backend/` directory based on the `.env.example` (if available) or the following structure:

    ```env
    DATABASE_URL="postgresql://user:password@localhost:5432/mydatabase?schema=public"
    JWT_SECRET="your_jwt_secret_key"
    STRIPE_SECRET_KEY="your_stripe_secret_key"
    PORT=3000
    ```

    -   `DATABASE_URL`: Your PostgreSQL connection string.
    -   `JWT_SECRET`: A strong, random string for JWT token signing.
    -   `STRIPE_SECRET_KEY`: Your Stripe secret key for payment processing.
    -   `PORT`: The port on which the Express server will run (default: 3000).

2.  **Database Setup (using Docker - Recommended for local development):**

    If you have Docker installed, you can quickly set up a PostgreSQL database:

    ```bash
    # From the root of your project (new_property_management/)
    docker-compose up -d postgres
    ```

    This will start a PostgreSQL container. Ensure your `DATABASE_URL` in `.env` matches the Docker configuration.

3.  **Run Prisma Migrations:**

    Apply the Prisma migrations to create the necessary tables in your database:

    ```bash
    pnpm prisma migrate dev --name init
    ```

4.  **Generate Kysely Types:**

    Generate Kysely types from your Prisma schema:

    ```bash
    pnpm generate-kysely-types
    ```

## Running the Application

To start the development server:

```bash
pnpm dev
```

The server will typically run on `http://localhost:3000` (or the port specified in your `.env` file).

## API Endpoints

Refer to the `src/api/index.ts` file for a list of available API endpoints and their respective modules.

## Project Structure

-   `src/api`: Contains the main API router and integrates all module routers.
-   `src/config`: Configuration files.
-   `src/database`: Database connection setup (Kysely).
-   `src/generated`: Generated Prisma Client and Kysely types.
-   `src/lib`: Utility functions.
-   `src/middleware`: Express middleware (e.g., authentication).
-   `src/modules`: Contains individual modules for different resources (e.g., `property`, `unit`, `auth`). Each module typically has:
    -   `*.controller.ts`: Handles incoming requests and sends responses.
    -   `*.service.ts`: Contains business logic and interacts with the database.
    -   `*.router.ts`: Defines API routes for the module.
-   `src/services`: Shared services (e.g., `user.service.ts`).
-   `src/workers`: Background workers (if any).
-   `prisma`: Prisma schema and migrations.

