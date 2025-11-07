const watchlistContainer = document.getElementById('watchlist');

// Fetch the watchlist from localStorage, or use an empty array if none exists
let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];

function displayWatchlist() {
  watchlistContainer.innerHTML = '';  // Clear current list

  if (watchlist.length === 0) {
    watchlistContainer.innerHTML = "<p>Your watchlist is empty.</p>";
  }

  watchlist.forEach((animeId) => {
    fetch(`https://api.jikan.moe/v4/anime/${animeId}`)
      .then(response => response.json())
      .then(data => {
        const anime = data.data;

        // Create a new div for the anime item
        const animeItem = document.createElement('div');
        animeItem.classList.add('anime-card');
        animeItem.innerHTML = `
          <h3>${anime.title}</h3>
          <img src="${anime.images.jpg.large_image_url}" alt="${anime.title}">
          <p>${anime.synopsis}</p>
          <button class="remove" data-id="${animeId}">Remove</button>
          <button class="mark-read" data-id="${animeId}">Mark as Read</button>
          <p class="status ${animeId}-read-status"></p> <!-- Display status here -->
          <textarea class="review-text" placeholder="Write your review here..." data-id="${animeId}"></textarea>
          <button class="save-review" data-id="${animeId}">Save Review</button>
          <p class="review-display"></p> <!-- Display the review here -->
        `;

        watchlistContainer.appendChild(animeItem);

        // Display "WATCHED/READ" status if marked as read
        const readStatus = localStorage.getItem(`${animeId}-readStatus`);
        if (readStatus === 'read') {
          document.querySelector(`.${animeId}-read-status`).textContent = 'Status: WATCHED/READ';
        }

        // Remove anime from watchlist
        const removeButton = animeItem.querySelector('.remove');
        removeButton.addEventListener('click', () => {
          removeFromWatchlist(animeId);
        });

        // Mark as Read functionality
        const markReadButton = animeItem.querySelector('.mark-read');
        markReadButton.addEventListener('click', () => {
          markAsRead(animeId);
        });

        // Save review functionality
        const saveReviewButton = animeItem.querySelector('.save-review');
        saveReviewButton.addEventListener('click', () => {
          const reviewText = animeItem.querySelector('.review-text').value;
          saveReview(animeId, reviewText);
        });

        // Display the review if it exists
        const reviews = JSON.parse(localStorage.getItem('reviews')) || {};
        if (reviews[animeId]) {
          animeItem.querySelector('.review-display').textContent = `Review: ${reviews[animeId]}`;
        }
      })
      .catch(error => {
        console.error('Error fetching anime:', error);
      });
  });
}

// Remove anime from watchlist
function removeFromWatchlist(animeId) {
  watchlist = watchlist.filter(id => id !== animeId);
  localStorage.setItem('watchlist', JSON.stringify(watchlist));
  displayWatchlist();  // Refresh the watchlist display
}

// Mark anime as read
function markAsRead(animeId) {
  // Update the localStorage to mark the anime as read
  localStorage.setItem(`${animeId}-readStatus`, 'read');

  // Display the "Status: WATCHED/READ" below the button
  const statusElement = document.querySelector(`.${animeId}-read-status`);
  if (statusElement) {
    statusElement.textContent = 'Status: WATCHED/READ';  // This will display below the button
  }
}

// Save user review
function saveReview(animeId, reviewText) {
  let reviews = JSON.parse(localStorage.getItem('reviews')) || {};
  reviews[animeId] = reviewText;
  localStorage.setItem('reviews', JSON.stringify(reviews));

  // Display the saved review below the anime
  const animeItem = document.querySelector(`[data-id="${animeId}"]`).closest('.anime-card');
  animeItem.querySelector('.review-display').textContent = `Review: ${reviewText}`;
}

// Load the watchlist when the page is loaded
displayWatchlist();

// Clear all data (Watchlist, Reviews, Read Status)
document.getElementById('clearDataBtn').addEventListener('click', () => {
  // Clear all relevant localStorage data
  localStorage.removeItem('watchlist');
  localStorage.removeItem('reviews');
  
  // Remove all read statuses
  Object.keys(localStorage).forEach((key) => {
    if (key.endsWith('-readStatus')) {
      localStorage.removeItem(key);
    }
  });

  // Reload the page to reset everything
  window.location.reload();
});
