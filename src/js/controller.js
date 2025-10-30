import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import movieView from './views/movieView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addMovieView from './views/addMovieView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';

const controlMovies = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    movieView.renderSpinner();

    // 0) Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    // 1) Updating bookmarks view
    bookmarksView.update(model.state.bookmarks);

    // 2) Loading movie
    await model.loadMovie(id);

    // 3) Rendering movie
    movieView.render(model.state.movie);
  } catch (err) {
    movieView.renderError();
    console.error(err);
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // 1) Get search query
    const query = searchView.getQuery();
    console.log('Search query:', query);
    if (!query) return;

    // 2) Load search results
    await model.loadSearchResults(query);
    console.log('Search results loaded:', model.state.search.results.length);

    // 3) Render results
    resultsView.render(model.getSearchResultsPage());
    console.log('Results rendered');

    // 4) Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.error('Search error:', err);
    resultsView.renderError(err.message);
  }
};

const controlPagination = function (goToPage) {
  // 1) Render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 2) Render NEW pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Not applicable for movies
  return;
};

const controlAddBookmark = function () {
  // 1) Add/remove bookmark
  if (!model.state.movie.bookmarked) model.addBookmark(model.state.movie);
  else model.deleteBookmark(model.state.movie.id);

  // 2) Update movie view
  movieView.update(model.state.movie);

  // 3) Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddMovie = async function (newMovie) {
  try {
    // Show loading spinner
    addMovieView.renderSpinner();

    // Upload the new movie data
    await model.uploadMovie(newMovie);
    console.log(model.state.movie);

    // Render movie
    movieView.render(model.state.movie);

    // Success message
    addMovieView.renderMessage();

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Change ID in URL
    window.history.pushState(null, '', `#${model.state.movie.id}`);

    // Close form window
    setTimeout(function () {
      addMovieView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('💥', err);
    addMovieView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  movieView.addHandlerRender(controlMovies);
  movieView.addHandlerUpdateServings(controlServings);
  movieView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addMovieView.addHandlerUpload(controlAddMovie);
};
init();
