import React, { useEffect, useState } from 'react';
import { checkBookmarkStatus, toggleBookmark } from '../appwrite';

const BookmarkCard = ({ movie, onBookmarkUpdate }) => {
  const { id, title, vote_average, release_date, original_language, poster_url } = movie;
  const [bookmarked, setBookmarked] = useState(true);

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
      if (onBookmarkUpdate) await onBookmarkUpdate();
    } catch (error) {
      console.error("Error in handleBookmark:", error);
    }
  };

  return (
    <div className='movie-card cursor-pointer'>
      <img src={poster_url} alt={title} className='cursor-pointer' />
      <div className='mt-4'>
        <h3>{title}</h3>
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
          <img src='./bookmark2.svg' alt='Checked Bookmark Icon' />
        </button>
      </div>
    </div>
  );
};

export default BookmarkCard;