export async function handler(event) {
  // const apiKey = process.env.TMDB_API_KEY;
  const apiKey = process.env.VITE_TMDB_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Server misconfiguration: TMDB_API_KEY is missing',
      }),
    };
  }

  try {
    const url = new URL(
      event.rawUrl ||
        `https://example.com${event.path}${
          event.rawQuery ? '?' + event.rawQuery : ''
        }`
    );
    const path = url.searchParams.get('path');
    if (!path) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Missing path parameter' }),
      };
    }

    // Build TMDb URL
    const tmdbUrl = new URL(`https://api.themoviedb.org/3${path}`);

    // Copy all query params except path
    url.searchParams.forEach((value, key) => {
      if (key !== 'path') tmdbUrl.searchParams.set(key, value);
    });

    // Always add API key
    tmdbUrl.searchParams.set('api_key', apiKey);

    const res = await fetch(tmdbUrl.toString());
    const data = await res.json();

    return {
      statusCode: res.status,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ message: err.message }) };
  }
}
