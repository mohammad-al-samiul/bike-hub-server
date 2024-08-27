# 🏍 Bike Rental Api Backend

Welcome to the backend of the Bike Rental Api System! This project offers an efficient bike rental service designed for both tourists and locals in Cox's Bazar, known for the picturesque Inani beach. Users can rent bikes online effortlessly, making it easy to explore the town.

## 🌟 Features

- **TypeScript Support**: Ensures type safety and improves code quality.
- **Easy Bike Browsing and Booking**: Users can conveniently explore and rent bikes.
- **JWT Authentication**: Provides secure authentication and authorization for user data.
- **Scalable Architecture**: Built for performance and scalability.

## 🛠️ Technology Stack

- **Programming Language**: TypeScript
- **Web Framework**: Express.js
- **Database & Validation**: Mongoose and Zod for MongoDB
- **Authentication**: JWT (Json Web Token)

## 🌐 API Endpoints

### User Routes

- **Sign Up**: `/api/auth/signup` (POST)
- **Log In**: `/api/auth/login` (POST)
- **Get Profile**: `/api/users/me` (GET)
- **Update Profile**: `/api/users/me` (PUT)

### Bike Routes

- **Add Bike (Admin Only)**: `/api/bikes` (POST)
- **List All Bikes**: `/api/bikes` (GET)
- **Update Bike (Admin Only)**: `/api/bikes/:id` (PUT)
- **Delete Bike (Admin Only)**: `/api/bikes/:id` (DELETE)

### Rental Routes

- **Create Rental**: `/api/rentals` (POST)
- **Return Bike (Admin Only)**: `/api/rentals/:id/return` (PUT)
- **Get User Rentals**: `/api/rentals` (GET)

## 🛠️ Installation & Setup

1. Clone the repository:

   ```bash
   https://github.com/mohammad-al-samiul/bike-rental-api-with-typescript-mongoose-express.git
   ```

2. Navigate to the project directory:

   ```bash
   cd bike-rental-api-with-typescript-mongoose-express
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

4. Start the Development Server

   ```bash
   npm run start:dev
   ```
