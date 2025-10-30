import View from './View.js';
import icons from 'url:../../img/icons.svg';

class MovieView extends View {
  _parentElement = document.querySelector('.movie');
  _errorMessage = 'We could not find that movie. Please try another one!';
  _message = '';

  addHandlerRender(handler) {
    ['hashchange', 'load'].forEach(ev => window.addEventListener(ev, handler));
  }

  addHandlerUpdateServings(handler) {
    // Not needed for movies, keeping for compatibility
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--update-servings');
      if (!btn) return;
      const { updateTo } = btn.dataset;
      if (+updateTo > 0) handler(+updateTo);
    });
  }

  addHandlerAddBookmark(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--bookmark');
      if (!btn) return;
      handler();
    });
  }

  _generateMarkup() {
    const castMarkup = this._data.cast && this._data.cast.length > 0
      ? this._data.cast.map(actor => `
        <li class="movie__cast-member">
          <div class="movie__cast-avatar">
            ${actor.profilePath ? `<img src="${actor.profilePath}" alt="${actor.name}" />` : '<div class="movie__cast-placeholder"></div>'}
          </div>
          <div class="movie__cast-info">
            <p class="movie__cast-name">${actor.name}</p>
            <p class="movie__cast-character">${actor.character}</p>
          </div>
        </li>
      `).join('')
      : '<p style="text-align: center; color: #888;">No cast information available</p>';

    const genresMarkup = this._data.genres && this._data.genres.length > 0
      ? this._data.genres.map(genre => `<span class="movie__genre-tag">${genre}</span>`).join('')
      : '<span class="movie__genre-tag">Unknown</span>';

    return `
      <figure class="movie__fig">
        <img src="${this._data.poster || this._data.backdrop || 'src/img/test-1.jpg'}" alt="${
          this._data.title
        }" class="movie__img" />
        <h1 class="movie__title">
          <span>${this._data.title}</span>
        </h1>
      </figure>

      <div class="movie__details">
        <div class="movie__info">
          <svg class="movie__info-icon">
            <use href="${icons}#icon-clock"></use>
          </svg>
          <span class="movie__info-data movie__info-data--runtime">${
            this._data.runtime || 'N/A'
          }</span>
          <span class="movie__info-text">minutes</span>
        </div>
        <div class="movie__info">
          <svg class="movie__info-icon">
            <use href="${icons}#icon-calendar"></use>
          </svg>
          <span class="movie__info-data">${
            this._data.releaseDate ? new Date(this._data.releaseDate).getFullYear() : 'N/A'
          }</span>
          <span class="movie__info-text">year</span>
        </div>

        <div class="movie__user-generated ${this._data.key ? '' : 'hidden'}">
          <svg>
            <use href="${icons}#icon-user"></use>
          </svg>
        </div>
        <button class="btn--round btn--bookmark">
          <svg class="">
            <use href="${icons}#icon-bookmark${
      this._data.bookmarked ? '-fill' : ''
    }"></use>
          </svg>
        </button>
      </div>

      <div class="movie__overview">
        <h2 class="heading--2">Overview</h2>
        <p class="movie__overview-text">${
          this._data.overview || 'No overview available'
        }</p>
      </div>

      <div class="movie__info-section">
        <h2 class="heading--2">Movie Details</h2>
        <div class="movie__info-grid">
          <div class="movie__info-item">
            <strong>Director:</strong> ${this._data.director || 'Unknown'}
          </div>
          <div class="movie__info-item">
            <strong>Rating:</strong> ⭐ ${this._data.rating ? this._data.rating.toFixed(1) : 'N/A'}/10
          </div>
          <div class="movie__genres">
            ${genresMarkup}
          </div>
        </div>
      </div>

      <div class="movie__cast">
        <h2 class="heading--2">Top Cast</h2>
        <ul class="movie__cast-list">
          ${castMarkup}
        </ul>
      </div>
    `;
  }
}

export default new MovieView();

