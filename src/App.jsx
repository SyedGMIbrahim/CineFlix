import { useEffect, useState } from 'react';
import Search from './components/Search';
import Spinner from './components/Spinner';
import MovieCard from './components/MovieCard';
import { useDebounce } from 'react-use';
import { getBookmarkedMovies, getTrendingMovies, updateSearchCount } from './appwrite';
import BookmarkCard from './components/BookmarkCard';
import MovieDetails from './components/MovieDetails';

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`,
  },
};

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [bookmarkedMovies, setBookmarkedMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 800, [searchTerm]);

  const fetchMovies = async (query = '', page = 1) => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const endPoint = query 
        ? `${API_BASE_URL}/search/movie?query=${query}&page=${page}` 
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc&page=${page}`;
      const response = await fetch(endPoint, API_OPTIONS);
      if (!response.ok) throw new Error('Failed to fetch movies');
      const data = await response.json();
      if (data.response === 'False') {
        setErrorMessage(data.Error || 'Error fetching movies');
        setMovieList([]);
        return;
      }
      setMovieList(data.results || []);
      setTotalPages(data.total_pages || 1);
      setCurrentPage(page);
      if (query && data.results.length > 0) {
        await updateSearchCount(query.toLowerCase(), data.results[0]);
      }
    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
      setErrorMessage('Error fetching movies. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);
    } catch (error) {
      console.error(`Error fetching trending movies: ${error}`);
    }
  };

  const loadBookmarkedMovies = async () => {
    try {
      const movies = await getBookmarkedMovies();
      setBookmarkedMovies(movies);
    } catch (error) {
      console.error('Error loading bookmarked movies:', error);
      setBookmarkedMovies([]);
    }
  };

  useEffect(() => {
    fetchMovies(debouncedSearchTerm, currentPage);
  }, [debouncedSearchTerm, currentPage]);

  useEffect(() => {
    loadTrendingMovies();
    loadBookmarkedMovies();
  }, []);

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleBookmarkUpdate = async () => {
    await loadBookmarkedMovies();
  };

  const handleCloseDetails = () => {
    setSelectedMovie(null);
  };

  const renderPagination = () => {
    const pages = [];
    const maxPagesToShow = 5;
    const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`pagination-button ${currentPage === i ? 'active' : ''}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="pagination">
        <button
          className="pagination-button"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        {pages}
        <button
          className="pagination-button"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <main>
      <div className='pattern'></div>
      <div className='wrapper'>
        <header className="flex flex-col items-center sm:mt-10 mt-5">
          <img 
            src="./logo.png"
            alt="Logo" 
            className="sm:w-50 sm:h-10 object-contain" 
          />
          <img src='./hero.png' alt='Hero Banner' />
          <h1>Find <span className='text-gradient'>Movies</span> You'll Enjoy Without the Hassle</h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>
        {trendingMovies.length > 0 && (
          <section className='trending'>
            <h2>Trending Movies</h2>
            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img 
                    src={movie.poster_url} 
                    alt={movie.title} 
                    className='cursor-pointer' 
                    onClick={() => handleMovieClick(movie)}
                  />
                </li>
              ))}
            </ul>
          </section>
        )}
        <section className='all-movies'>
          <h2>All Movies</h2>
          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className='text-white'>{errorMessage}</p>
          ) : (
            <>
              <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {movieList.map((movie) => (
                  <MovieCard 
                    key={movie.id}
                    movie={movie} 
                    onMovieClick={handleMovieClick}
                    onBookmarkUpdate={handleBookmarkUpdate}
                  />
                ))}
              </ul>
              {totalPages > 1 && renderPagination()}
            </>
          )}
        </section>
        <section className='bookmark'>
          <h2 className='mt-10'>Bookmarked Movies</h2>
          {bookmarkedMovies.length > 0 ? (
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {bookmarkedMovies.map((movie) => (
                <BookmarkCard 
                  key={movie.$id} 
                  movie={movie} 
                  onBookmarkUpdate={handleBookmarkUpdate}
                />
              ))}
            </ul>
          ) : (
            <div className="text-white">No Bookmarked Movies</div>
          )}
        </section>
        <MovieDetails movie={selectedMovie} onClose={handleCloseDetails} onBookmarkUpdate={handleBookmarkUpdate} />
      </div>
    </main>
  );
};

export default App;