import React, { useEffect, useState, useRef } from 'react';
import { toggleBookmark, checkBookmarkStatus } from '../appwrite';

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`,
  },
};

const MovieDetails = ({ movie, onClose, onBookmarkUpdate }) => {
  const [movieDetails, setMovieDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (!movie) return;

      try {
        setLoading(true);
        const response = await fetch(
          `${API_BASE_URL}/movie/${movie.id}?append_to_response=credits,videos`,
          API_OPTIONS
        );
        if (!response.ok) throw new Error('Failed to fetch movie details');
        const data = await response.json();
        setMovieDetails(data);
        const status = await checkBookmarkStatus(movie.id);
        setBookmarked(status);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [movie]);

  useEffect(() => {
    if (!loading && movieDetails && contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [loading, movieDetails]);

  const handleBookmark = async () => {
    if (!movieDetails) return;
    try {
      await toggleBookmark(movieDetails);
      setBookmarked(!bookmarked);
      if (onBookmarkUpdate) await onBookmarkUpdate();
    } catch (error) {
      console.error('Error toggling bookmark in MovieDetails:', error);
    }
  };

  if (!movie) return null;

  const trailer = movieDetails?.videos?.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');
  const cast = movieDetails?.credits?.cast.slice(0, 5);

  return (
    <div className={`movie-details ${movie ? 'active' : ''}`}>
      <div className="modal-content">
        <button onClick={onClose} className="close-button">✕</button>
        
        {loading ? (
          <p className="text-white text-center">Loading details...</p>
        ) : movieDetails ? (
          <div ref={contentRef}>
            <h2>{movieDetails.title}</h2>
            
            <div className="flex flex-col gap-6">
              <img 
                src={`https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`} 
                alt={movieDetails.title}
                className="w-full sm:w-1/3 rounded"
              />
              <div className="flex-1">

                {trailer && (
                  <div className="trailer">
                    <h3>Trailer</h3>
                    <iframe
                      src={`https://www.youtube.com/embed/${trailer.key}`}
                      title={trailer.name}
                      allowFullScreen
                      className="w-full h-150 rounded"
                    />
                  </div>
                )}

                <div className="summary">
                  <h3>Summary</h3>
                  <p>{movieDetails.overview || 'No summary available'}</p>
                </div>

                {cast && cast.length > 0 && (
                  <div className="cast">
                    <h3>Top Cast</h3>
                    <ul>
                      {cast.map(actor => (
                        <li key={actor.id}>
                          <span className="actor-name">{actor.name}</span>
                          <span className="character"> as {actor.character}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="additional-details">
                  <p><strong>Genre:</strong> {movieDetails.genres?.map(g => g.name).join(', ') || 'N/A'}</p>
                  <p><strong>Rating:</strong> {movieDetails.vote_average?.toFixed(1) || 'N/A'}</p>
                  <p><strong>Release Date:</strong> {movieDetails.release_date || 'N/A'}</p>
                  <p><strong>Language:</strong> {movieDetails.original_language?.toUpperCase() || 'N/A'}</p>
                  <p><strong>Runtime:</strong> {movieDetails.runtime ? `${Math.floor(movieDetails.runtime / 60)}h ${movieDetails.runtime % 60}m` : 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-white">Failed to load movie details</p>
        )}
      </div>
    </div>
  );
};

export default MovieDetails;