import { Client, Databases, ID, Query } from 'appwrite';

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID_1 = import.meta.env.VITE_APPWRITE_COLLECTION_ID_1;
const COLLECTION_ID_2 = import.meta.env.VITE_APPWRITE_COLLECTION_ID_2;

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject(PROJECT_ID);

const database = new Databases(client);

export const updateSearchCount = async (searchTerm, movie) => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID_1, [
      Query.equal('searchTerm', searchTerm),
    ]);

    if (result.documents.length > 0) {
      const doc = result.documents[0];
      await database.updateDocument(DATABASE_ID, COLLECTION_ID_1, doc.$id, {
        count: doc.count + 1,
      });
    } else {
      await database.createDocument(DATABASE_ID, COLLECTION_ID_1, ID.unique(), {
        searchTerm,
        count: 1,
        movie_id: movie.id,
        poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      });
    }
  } catch (error) {
    console.error('Error updating search count:', error);
    throw error;
  }
};

export const getTrendingMovies = async () => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID_1, [
      Query.limit(5),
      Query.orderDesc('count'),
    ]);
    return result.documents;
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    return [];
  }
};

export const toggleBookmark = async (movie) => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID_2, [
      Query.equal('movie_id', movie.id),
    ]);

    if (result.documents.length > 0) {
      const docId = result.documents[0].$id;
      await database.deleteDocument(DATABASE_ID, COLLECTION_ID_2, docId);
      return { action: 'deleted', movieId: movie.id };
    } else {
      const newDoc = await database.createDocument(DATABASE_ID, COLLECTION_ID_2, ID.unique(), {
        movie_id: movie.id,
        title: movie.title,
        poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        is_bookmarked: true,
        vote_average: movie.vote_average,
        release_date: movie.release_date,
        original_language: movie.original_language,
      });
      return { action: 'added', movieId: movie.id, doc: newDoc };
    }
  } catch (error) {
    console.error('Error toggling bookmark:', error);
    throw error;
  }
};

export const checkBookmarkStatus = async (movieId) => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID_2, [
      Query.equal('movie_id', movieId),
    ]);
    return result.documents.length > 0;
  } catch (error) {
    console.error('Error checking bookmark status:', error);
    return false;
  }
};

export const getBookmarkedMovies = async () => {
  try {
    const response = await database.listDocuments(DATABASE_ID, COLLECTION_ID_2);
    return response.documents;
  } catch (error) {
    console.error('Error loading bookmarked movies:', error);
    return [];
  }
};