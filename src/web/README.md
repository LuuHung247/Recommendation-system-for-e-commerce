# E-commerce App with Next.js

A modern, fullstack e-commerce application built with Next.js, MongoDB, and Vercel. This application features personalized product recommendations, user reviews, and a responsive interface.

## Live Demo

**View the live application:** [E-commerce App on Vercel](https://recommender-system-inky.vercel.app/)

## Features

- User authentication
- Product listing with pagination
- Product details and related items
- Personalized recommendations
- User review history
- Responsive design

## Getting Started

### Prerequisites

- Node.js (v18 or newer)
- pnpm (preferred) or npm
- MongoDB database (local or Atlas)
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ArsiHien/recommender-system.git
   cd recommender-system
   ```

2. Install dependencies:
   ```bash
   pnpm install
   # or
   npm install
   ```

3. Configure environment variables:

   Create a `.env.local` file in the root directory and add the database uri variable:

   ```env
   MONGODB_URI=your_mongodb_connection_string
   ```

### Running the Application

1. Development server:
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

2. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Build for Production

```bash
pnpm build
# or
npm run build
```

## Deployment

This project is deployed on Vercel. To deploy your own instance:

1. Fork this repository to your GitHub account
2. Sign up for a [Vercel account](https://vercel.com/signup) if you don't have one
3. From the Vercel dashboard, click "Add New..." and select "Project"
4. Import your forked repository
5. Configure the project:
   - Set the Framework Preset to "Next.js"
   - Configure the following environment variables in the Vercel dashboard:
     - `MONGODB_URI`: Your MongoDB connection string
6. Click "Deploy"

After deployment, Vercel will provide you with a URL to access your application.

## Project Structure

- `app/`: Next.js application routes and pages
- `components/`: React components
- `lib/`: Utility functions, data services, and API handlers
- `public/`: Static assets
- `styles/`: CSS and styling files

## Technology Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB
- **Authentication**: Next Auth
- **Deployment**: Vercel
