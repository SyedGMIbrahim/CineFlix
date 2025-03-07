# CineFlix (https://marvelous-moonbeam-9a8550.netlify.app/ - Netlify)

A React-based web application for browsing, searching, and bookmarking movies using the TMDB (The Movie Database) API. Features include trending movies, detailed movie pages, pagination, and a sleek UI styled with Tailwind CSS.

## Features
- **Search Movies:** Search for movies by title with debounced input for smooth API calls.
- **Trending Movies:** View a list of the top 5 trending movies based on search popularity.
- **Movie Details:** Access detailed information about each movie, including trailers, cast, summary, genres, rating, release date, and runtime.
- **Bookmarking:** Bookmark your favorite movies, stored via Appwrite.
- **Pagination:** Navigate through movie results with "Prev," "Next," and numbered page buttons.
- **Responsive Design:** Fully responsive layout with Tailwind CSS and custom styles.
- **Cool UI Effects:** Hover effects on movie cards with scaling and gradient overlays.
- **Logo Branding:** Custom logo displayed in the header.

## Tech Stack
- **Frontend:** React, React Router, Tailwind CSS
- **API:** TMDB (The Movie Database) API for movie data
- **Backend:** Appwrite for bookmarking and trending movie storage
- **Tools:** Vite (build tool), React-Use (for debouncing)

## Prerequisites
- Node.js (v16 or higher recommended)
- npm or yarn
- A TMDB API key (sign up at TMDB to get one)
- An Appwrite instance (optional, for bookmarking and trending features)

## Setup
### Clone the Repository:
```bash
git clone https://github.com/your-username/movie-browser.git
cd movie-browser
```

### Install Dependencies:
```bash
npm install
```

### Set Up Environment Variables:
Create a `.env` file in the root directory and add the following:
```env
VITE_TMDB_API_KEY=your-tmdb-api-key
VITE_APPWRITE_PROJECT_ID=your-appwrite-project-id
VITE_APPWRITE_DATABASE_ID=your-appwrite-database-id
VITE_APPWRITE_COLLECTION_ID_1=your-collection-id-for-search-count
VITE_APPWRITE_COLLECTION_ID_2=your-collection-id-for-bookmarks
```
Replace `your-tmdb-api-key` with your TMDB API key.
If using Appwrite, replace the Appwrite-related values with your project details. If not, the app will still work without bookmarking.

### Add Logo (Optional):
Place your logo file (e.g., `logo.png`) in the `public` folder or `src/assets` and update the path in `App.jsx` if necessary.

### Run the Application:
```bash
npm run dev
```
Open your browser to `http://localhost:5173` (or the port Vite assigns).

## Usage
### Home Page:
- View trending movies and a paginated list of all movies.
- Use the search bar to find specific movies.
- Click a movie card to visit its details page.
- Bookmark movies by clicking the bookmark icon on a movie card.

### Movie Details Page:
- Access detailed movie info, including a trailer (if available), top cast, summary, and more.
- Use the "Back" button to return to the home page.
- The page auto-scrolls to the content on load.

### Pagination:
Navigate through movie results using "Prev," numbered pages, and "Next" buttons in the "All Movies" section.

## Project Structure
```
movie-browser/
├── public/
│   ├── logo.png           # Logo file (optional)
│   ├── hero.png          # Hero banner image
│   └── hero-bg.png       # Background pattern
├── src/
│   ├── assets/           # Alternative folder for images (if used)
│   ├── components/
│   │   ├── Search.jsx
│   │   ├── Spinner.jsx
│   │   ├── MovieCard.jsx
│   │   ├── MovieDetails.jsx
│   │   └── BookmarkCard.jsx
│   ├── appwrite.js       # Appwrite API functions
│   ├── App.jsx           # Main app component
│   ├── main.jsx          # Entry point with React Router
│   └── index.css         # Tailwind and custom styles
├── .env                  # Environment variables
├── tailwind.config.js    # Tailwind configuration
├── vite.config.js        # Vite configuration
└── README.md             # This file
```

## Customization
- **Logo:** Replace `public/logo.png` with your own logo and adjust the size in `App.jsx` (`w-24 h-24 sm:w-32 sm:h-32`).
- **Styling:** Modify Tailwind classes in `App.jsx`, `MovieCard.jsx`, or `MovieDetails.jsx`, or update `index.css` for custom styles.
- **Pagination:** Change `maxPagesToShow` in `renderPagination` to show more/fewer page numbers.
- **API:** Extend the TMDB API calls in `MovieDetails.jsx` to fetch additional data (e.g., budget, production companies).

## Contributing
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m "Add your feature"`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

## License
This project is licensed under the MIT License. See the `LICENSE` file for details.


