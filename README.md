# AttendEase

AttendEase is a minimal and modern attendance management system built with the T3 stack, featuring QR code-based attendance tracking and an insights dashboard.

## Key Features

- **QR Code-Based Attendance:** Effortlessly mark attendance by scanning a unique QR code for each event.
- **Admin Dashboard:** A comprehensive dashboard for administrators to manage events, view attendance data, and gain insights.
- **User-Friendly Interface:** A clean and intuitive UI for a seamless user experience.
- **Event Management:** Easily create, update, and manage events.
- **Secure Authentication:** Built-in authentication to protect user data.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **ORM:** [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication:** [Better Auth](https://www.better-auth.com/)
- **Database:** [Postgres](https://www.postgresql.org/)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Make sure you have Node.js and npm installed on your machine.

- npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/jayan110105/attendeaseMinimal.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Set up your environment variables by creating a `.env` file in the root of your project.
   ```env
   # Example .env file
   DATABASE_URL="your_postgres_database_url"
   BETTER_AUTH_SECRET="your_better_auth_secret"
   BETTER_AUTH_URL="http://localhost:3000"
   ```
4. Push the database schema using Drizzle
   ```sh
   npm run db:push
   ```
5. Run the development server
   ```sh
   npm run dev
   ```
