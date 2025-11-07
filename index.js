const searchInput = document.getElementById('search-input');
const resultContainer = document.getElementById('anime-results');

// Fetching anime data from Jikan API
searchInput.addEventListener('input', async (e) => {
  const query = e.target.value;
  if (query.length > 2) {
    const response = await fetch(`https://api.jikan.moe/v4/anime?q=${query}`);
    const data = await response.json();
    displayResults(data);
  }
});

function displayResults(data) {
  resultContainer.innerHTML = ''; // Clear current list
  
  data.data.forEach((anime) => {
    const animeCard = document.createElement('div');
    animeCard.classList.add('anime-card');
    
    // Construct the HTML for each anime item, including additional info
    animeCard.innerHTML = `
      <h3>${anime.title}</h3>
      <img src="${anime.images.jpg.large_image_url}" alt="${anime.title}">
      <p>${anime.synopsis}</p>
      <p><strong>Score:</strong> ${anime.score}</p>
      <p><strong>Rank:</strong> ${anime.rank}</p>
      <p><strong>Popularity:</strong> ${anime.popularity}</p>
      <p><strong>Genres:</strong> ${anime.genres.map(genre => genre.name).join(', ')}</p>
      <p><strong>Producers:</strong> ${anime.producers.map(producer => producer.name).join(', ')}</p>
      <button class="add-watchlist" data-id="${anime.mal_id}">Add to Watchlist</button>
      <button class="more-info" data-url="${anime.url}">More Info</button>
    `;
    
    resultContainer.appendChild(animeCard);
  });

  // Add to Watchlist functionality
  const watchlistButtons = document.querySelectorAll('.add-watchlist');
  watchlistButtons.forEach(button => {
    button.addEventListener('click', () => {
      const animeId = button.dataset.id;
      addToWatchlist(animeId);
    });
  });

  // Add event listeners to "More Info" buttons inside displayResults
  const moreInfoButtons = document.querySelectorAll('.more-info');
  moreInfoButtons.forEach(button => {
    button.addEventListener('click', () => {
      const animeUrl = button.dataset.url;
      window.open(animeUrl, '_blank'); // Open the MyAnimeList page in a new tab
    });
  });
}

// Add anime to watchlist (using localStorage)
function addToWatchlist(animeId) {
  let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
  if (!watchlist.includes(animeId)) {
    watchlist.push(animeId);
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
    showPopup();
  }
}

// Show Success Popup
function showPopup() {
  const popup = document.getElementById('popup');
  popup.style.display = 'block';
  popup.style.opacity = 1;

  setTimeout(() => {
    popup.style.opacity = 0;
    setTimeout(() => {
      popup.style.display = 'none';
    }, 500);
  }, 3000);
}
