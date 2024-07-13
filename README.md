# Sketch-a-Day

Welcome to Sketch-a-Day! This is a fun and interactive platform where you can unleash your creativity by participating in daily drawing prompts, sharing your doodles, and engaging with a community of fellow doodlers.

## Features

- **Daily Prompt**: Get a new drawing prompt every day to inspire your doodles.
- **Submit Doodles**: Share your sketches by submitting them with your name, image URL, and description.
- **View Gallery**: Browse through a gallery of doodles submitted by users.
- **Favorite Doodles**: Like and favorite doodles you enjoy.

## Technologies Used

- HTML/CSS/JavaScript
- React.js
- Node.js/Express.js
- MongoDB/Mongoose
- Axios for API requests

## Hosted Version
A hosted version is now available at https://sketch-a-day.vercel.app/. Head on over there to try it out!

## Setup Instructions for your own server

### Prerequisites

- Node.js
- MongoDB 
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/sridhars650/Sketch-a-Day.git
   cd sketch-a-day

2. Install dependencies:
   ```bash
   npm install

4. Set up environment variables:
   Create a .env file in the root directory.
   Define the following variables:
   ```bash
   PORT=3000
   DB_HOST=mongodb://localhost:27017/sketchaday #This is where your unique mongodb url goes
   
5. Access the application in your browser at http://localhost:3000.

## Usage
- Navigate to the homepage to see today's prompt and submit your doodle.
- Click on doodle images in the gallery to view them in full size.
- Use the favorite button to mark your favorite doodles.

## API Endpoints
- GET /api/prompt: Fetches today's drawing prompt.
- GET /api/doodles: Retrieves all submitted doodles.
- POST /api/doodles: Submits a new doodle.
- POST /api/doodles/:id/favorite: Marks a doodle as a favorite.
- DELETE /api/doodles/:id/favorite: Removes a doodle from favorites.

## Contributing
### Contributions are welcome! Please follow these steps:

  - Fork the repository.
  - Create a new branch (git checkout -b feature/add-new-feature).
  - Commit your changes (git commit -am 'Add new feature').
  - Push to the branch (git push origin feature/add-new-feature).
  - Create a new Pull Request.


