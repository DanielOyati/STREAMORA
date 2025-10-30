# Streamora 🎬

A cinematic Movies & TV Shows discovery app powered by The Movie Database (TMDb) API.

## Features

- 🔍 Search for movies using TMDb API
- 📽️ View detailed movie information (poster, director, runtime, cast, genres)
- ⭐ Star ratings display
- ❤️ Bookmark your favorite movies
- ➕ Upload custom movies (stored locally)
- 📄 Pagination through search results
- 💾 Persistent bookmarks (localStorage)
- 🎨 Beautiful Netflix-inspired cinematic UI

## Tech Stack

- **Vanilla JavaScript (ES6 modules)**
- **SASS** for styling
- **Parcel** bundler
- **TMDb API** for movie data
- **.env** for secure API key management

## API Key Security

The app uses `.env` file to securely manage the TMDb API key. The `.env` file is already added to `.gitignore` to prevent accidental commits.

## Theme

Inspired by Netflix's cinematic design:

- Dark backgrounds (#000000 → #121212)
- Netflix red (#E50914) for primary actions
- Gold accents (#FFD700) for highlights
- Smooth animations and hover effects
- Modern Poppins typography

## Features Retained from Forkify

- Same modular architecture
- MVC pattern with Views
- Smooth fade and slide animations
- Pagination
- Bookmarks with localStorage
- User-generated content support
