import React, { useEffect, useState } from 'react'
import { checkBookmarkStatus, toggleBookmark } from '../appwrite';
    
const MovieCard = ({ movie, onMovieClick }) => {
  const [bookmarked, setBookmarked] = useState(false);
  const { id, title, vote_average, poster_path, release_date, original_language } = movie;

  useEffect(() => {
    const fetchBookmarkStatus = async () => {
      const status = await checkBookmarkStatus(id);
      setBookmarked(status);
    };
    fetchBookmarkStatus();
  }, [id]);

  const handleBookmark = async (e) => {
    e.stopPropagation();
    try {
      await toggleBookmark(movie);
      setBookmarked(!bookmarked);
    } catch (error) {
      console.error("Error in handleBookmark:", error);
    }
  };

  return (
    <div 
      className='movie-card cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50'
      onClick={() => onMovieClick(movie)}
    >
      <img 
        src={poster_path ? `https://image.tmdb.org/t/p/w500${poster_path}` : './no-movie.png'} 
        alt={title} 
        className="rounded transition-opacity duration-300 hover:opacity-80"
      />
      <div className='mt-4'>
        <h3 className="text-white truncate">{title}</h3>
      </div>
      <div className='content flex justify-between'>
        <div className='align'>
          <div className='rating'>
            <img src='./star.svg' alt='Star Icon' />
            <p>{vote_average ? vote_average.toFixed(1) : "N/A"}</p>
          </div>
          <span>•</span>
          <p className='lang'>{original_language}</p>
          <span>•</span>
          <p className='year'>{release_date ? release_date.split('-')[0] : "N/A"}</p>
        </div>
        <button className='cursor-pointer' onClick={handleBookmark}>
          {bookmarked 
            ? <img src='./bookmark2.svg' alt='Checked Bookmark Icon' />
            : <img src='./bookmark1.svg' alt='Unchecked Bookmark Icon' />
          }
        </button>
      </div>
    </div>
  );
};
    
export default MovieCard