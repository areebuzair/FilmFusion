const axios = require('axios');
require('dotenv').config();


const apiKey =process.env.OMDB_API_KEY;


const movieTitles = [
  'Fight Club',
  'Dead Poets Society',
  'The French Dispatch',
  '1917',
  'The Batman'
];


async function fetchMovieData(title) {
  const url = `http://www.omdbapi.com/?apikey=${apiKey}&t=${encodeURIComponent(title)}`;
  try {
    const response = await axios.get(url);
    const movieData = response.data;
    
    if (movieData.Response === 'True') {
      console.log(`\nFull JSON Data for "${title}":`);
      console.log(JSON.stringify(movieData, null, 2));  
    } else {
      console.log(`Movie "${title}" not found.`);
    }
  } catch (error) {
    console.error(`Error fetching data for "${title}":`, error.message);
  }
}


async function fetchAllMovies() {
  for (const title of movieTitles) {
    await fetchMovieData(title);
  }
}


fetchAllMovies();
