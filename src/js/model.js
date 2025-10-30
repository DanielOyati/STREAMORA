import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE, IMG_BASE_URL, API_PROXY_BASE } from './config.js';
import { AJAX } from './helpers.js';

export const state = {
  movie: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

const createMovieObject = function (data) {
  return {
    id: data.id,
    title: data.title || data.name,
    overview: data.overview,
    poster: data.poster_path ? `${IMG_BASE_URL}${data.poster_path}` : null,
    backdrop: data.backdrop_path ? `${IMG_BASE_URL}${data.backdrop_path}` : null,
    releaseDate: data.release_date || data.first_air_date,
    runtime: data.runtime,
    director: data.credits?.crew?.find(person => person.job === 'Director')?.name || 'Unknown',
    genres: data.genres?.map(genre => genre.name) || [],
    cast: data.credits?.cast?.slice(0, 5).map(actor => ({
      name: actor.name,
      character: actor.character,
      profilePath: actor.profile_path ? `${IMG_BASE_URL}${actor.profile_path}` : null,
    })) || [],
    rating: data.vote_average,
    ...(data.key && { key: data.key }),
  };
};

export const loadMovie = async function (id) {
  try {
    const url = `${API_PROXY_BASE}?path=/movie/${id}&append_to_response=credits`;
    const data = await AJAX(url);
    state.movie = createMovieObject(data);

    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.movie.bookmarked = true;
    else state.movie.bookmarked = false;

    console.log(state.movie);
  } catch (err) {
    // Temp error handling
    console.error(`${err} 💥💥💥💥`);
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;

    const url = `${API_PROXY_BASE}?path=/search/movie&query=${encodeURIComponent(query)}`;
    console.log('🔍 Making API request to:', url);
    const data = await AJAX(url);
    console.log('✅ API Response received:', data);
    console.log('📊 Number of results:', data.results.length);

    state.search.results = data.results.map(movie => {
      return {
        id: movie.id,
        title: movie.title,
        poster: movie.poster_path ? `${IMG_BASE_URL}${movie.poster_path}` : null,
        releaseDate: movie.release_date,
        overview: movie.overview,
        rating: movie.vote_average,
      };
    });
    state.search.page = 1;
    console.log('✅ Search results processed:', state.search.results.length);
  } catch (err) {
    console.error('❌ Search error:', err);
    console.error('❌ Error details:', err.message);
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage; // 0
  const end = page * state.search.resultsPerPage; // 9

  return state.search.results.slice(start, end);
};

// No longer needed for movies, keeping for structure
export const updateServings = function (newServings) {
  // Not applicable for movies
  return;
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (movie) {
  // Add bookmark
  state.bookmarks.push(movie);

  // Mark current movie as bookmarked
  if (movie.id === state.movie.id) state.movie.bookmarked = true;

  persistBookmarks();
};

export const deleteBookmark = function (id) {
  // Delete bookmark
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  // Mark current movie as NOT bookmarked
  if (id === state.movie.id) state.movie.bookmarked = false;

  persistBookmarks();
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
// clearBookmarks();

export const uploadMovie = async function (newMovie) {
  try {
    // Parse cast members
    const cast = Object.entries(newMovie)
      .filter(entry => entry[0].startsWith('cast-') && entry[1] !== '')
      .map(castMember => {
        const parts = castMember[1].split(',').map(el => el.trim());
        if (parts.length !== 2)
          throw new Error(
            'Wrong cast format! Please use the correct format :)'
          );

        const [name, character] = parts;
        return { name, character, profilePath: null };
      });

    // Create a properly formatted movie object
    const movieData = {
      id: Date.now(), // Generate unique ID
      title: newMovie.title,
      overview: newMovie.overview || '',
      poster_path: newMovie.posterUrl || null,
      backdrop_path: null,
      release_date: newMovie.releaseDate,
      first_air_date: newMovie.releaseDate,
      runtime: +newMovie.runtime || 0,
      credits: {
        crew: [{ name: newMovie.director || 'Unknown', job: 'Director' }],
        cast: cast.map(c => ({
          name: c.name,
          character: c.character,
          profile_path: null
        }))
      },
      genres: newMovie.genres ? newMovie.genres.split(',').map(g => ({ name: g.trim() })) : [],
      vote_average: 0,
      key: true, // Mark as user-generated
    };

    state.movie = createMovieObject(movieData);
    addBookmark(state.movie);
  } catch (err) {
    throw err;
  }
};
