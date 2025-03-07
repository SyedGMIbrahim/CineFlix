import React, { useEffect, useState, useRef } from 'react';

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`,
  },
};

const MovieDetails = ({ movie, onClose }) => {
  const [movieDetails, setMovieDetails] = useState(null);
  const [loading, setLoading] = useState(true);
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
        const data = await response.json();
        setMovieDetails(data);
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

  if (!movie) return null;

  const trailer = movieDetails?.videos?.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');
  const cast = movieDetails?.credits?.cast.slice(0, 5); // Limit to top 5 cast members

  return (
    <div className="movie-details">
      <div className="modal-content">
        <button onClick={onClose}>✕</button>
        
        {loading ? (
          <p className="text-white text-center">Loading details...</p>
        ) : movieDetails ? (
          <div ref={contentRef}>
            <h2>{movieDetails.title}</h2>
            
            <img 
              src={`https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`} 
              alt={movieDetails.title}
            />

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
        ) : (
          <p className="text-white">Failed to load movie details</p>
        )}
      </div>
    </div>
  );
};

export default MovieDetails;