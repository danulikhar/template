/**
 * @file Manages API interactions and dynamic content rendering for the Last.fm clone.
 */

document.addEventListener('DOMContentLoaded', () => {
    const API_KEY = 'c116db33258d690ea68498890b6b24d7'; // <-- ЗАМЕНИТЕ НА ВАШ КЛЮЧ API
    const BASE_URL = 'https://ws.audioscrobbler.com/2.0/';

    // --- DOM Elements ---
    const hotArtistsGrid = document.querySelector('.artist-grid--hot');
    const popularTracksList = document.querySelector('.track-list--popular');

    const searchInput = document.querySelector('.site-header__search .search-input');
    const searchButton = document.querySelector('.site-header__search .search-button');

    const musicOverviewSection = document.querySelector('.music-overview-section');
    const searchResultsSection = document.querySelector('.search-results-section');
    const searchQueryDisplay = document.querySelector('.search-query-display');

    // Ensure these selectors target existing elements from the updated HTML structure
    const resultsArtistsContainer = searchResultsSection.querySelector('.results-artists');
    const resultsAlbumsContainer = searchResultsSection.querySelector('.results-albums');
    const resultsTracksContainer = searchResultsSection.querySelector('.results-tracks');

    const resultsArtistsGrid = resultsArtistsContainer ? resultsArtistsContainer.querySelector('.artist-grid--results') : null;
    const resultsAlbumsGrid = resultsAlbumsContainer ? resultsAlbumsContainer.querySelector('.album-grid') : null;
    const resultsTracksList = resultsTracksContainer ? resultsTracksContainer.querySelector('.track-list--results') : null;


    /**
     * Fetches data from the Last.fm API.
     * @async
     * @param {object} params - API method parameters.
     * @returns {Promise<object>} The JSON response from the API.
     * @throws {Error} If the network response is not ok or API returns an error.
     */
    async function fetchData(params) {
        const queryParams = new URLSearchParams({
            api_key: API_KEY,
            format: 'json',
            ...params,
        });

        const url = `${BASE_URL}?${queryParams.toString()}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            const data = await response.json();
            if (data.error) {
                // Log API specific error code and message for better debugging
                console.error(`Last.fm API Error ${data.error}: ${data.message}`);
                throw new Error(`Last.fm API error: ${data.message}`);
            }
            return data;
        } catch (error) {
            // Log the full error object for more details
            console.error('Fetch error details:', error);
            throw error; // Re-throw to be caught by calling function
        }
    }

    /**
     * Displays an error message in a specified container.
     * @param {HTMLElement|null} container - The HTML element to display the error in. Can be null.
     * @param {string} message - The error message.
     */
    function displayError(container, message) {
        if (container) {
            container.innerHTML = `<p class="error-message" style="color: #ff4d4d; text-align: center; padding: 10px;">${message}</p>`;
        } else {
            console.warn("Attempted to display error in a null container:", message);
        }
    }

    /**
     * Clears the content of a specified container.
     * @param {HTMLElement|null} container - The HTML element to clear. Can be null.
     */
    function clearContainer(container) {
        if (container) {
            container.innerHTML = '';
        }
    }

    /**
     * Safely gets an image URL from an image array.
     * @param {Array<object>|undefined} imageArray - Array of image objects from API.
     * @param {string} desiredSize - The desired image size (e.g., 'medium', 'large', 'extralarge').
     * @param {string} defaultUrl - A default URL if the desired image is not found.
     * @returns {string} The image URL.
     */
    function getImageUrl(imageArray, desiredSize, defaultUrl) {
        if (imageArray && Array.isArray(imageArray)) {
            const foundImage = imageArray.find(img => img.size === desiredSize);
            if (foundImage && foundImage['#text']) {
                return foundImage['#text'];
            }
        }
        return defaultUrl;
    }

    // --- Rendering Functions ---

    /**
     * Renders top artists.
     * @param {Array<object>} artists - Array of artist objects from API.
     */
    function renderTopArtists(artists) {
        clearContainer(hotArtistsGrid);
        if (!hotArtistsGrid) return;

        const artistsToDisplay = artists.slice(0, 6);

        artistsToDisplay.forEach(artist => {
            const imageUrl = getImageUrl(artist.image, 'extralarge', 'https://placehold.co/150x150/333/fff?text=Artist');
            const artistCard = `
                <div class="artist-card artist-card--circular">
                    <img src="${imageUrl}" alt="${artist.name}" class="artist-card__image">
                    <h3 class="artist-card__name">${artist.name}</h3>
                    <p class="artist-card__tags">Playcount: ${parseInt(artist.playcount || 0).toLocaleString()}</p>
                </div>
            `;
            hotArtistsGrid.innerHTML += artistCard;
        });
    }

    /**
     * Renders top tracks.
     * @param {Array<object>} tracks - Array of track objects from API.
     */
    function renderTopTracks(tracks) {
        clearContainer(popularTracksList);
        if (!popularTracksList) return;

        const tracksToDisplay = tracks.slice(0, 5);

        tracksToDisplay.forEach(track => {
            const artworkUrl = getImageUrl(track.image, 'medium', 'https://placehold.co/50x50/444/fff?text=Track');
            const trackItem = `
                <div class="track-item">
                    <img src="${artworkUrl}" alt="${track.name} artwork" class="track-item__artwork">
                    <div class="track-item__info">
                        <h4 class="track-item__title">${track.name}</h4>
                        <p class="track-item__artist">${track.artist.name}</p>
                        <p class="track-item__genre">Listeners: ${parseInt(track.listeners || 0).toLocaleString()}</p>
                    </div>
                </div>
            `;
            popularTracksList.innerHTML += trackItem;
        });
    }


    /**
     * Renders artist search results.
     * @param {Array<object>} artists - Array of artist objects from search API.
     */
    function renderArtistSearchResults(artists) {
        clearContainer(resultsArtistsGrid);
        if (!resultsArtistsGrid) {
             console.error("Artist results grid not found in DOM for search."); return;
        }
        if (!artists || artists.length === 0) {
            resultsArtistsGrid.innerHTML = '<p style="padding: 10px; text-align: center;">No artists found.</p>';
            return;
        }

        artists.forEach(artist => {
            const imageUrl = getImageUrl(artist.image, 'large', 'https://placehold.co/130x130/333/fff?text=Artist');
            const artistCard = `
                <div class="artist-card artist-card--square">
                    <img src="${imageUrl}" alt="${artist.name}" class="artist-card__image">
                    <h3 class="artist-card__name">${artist.name}</h3>
                    <p class="artist-card__meta">Listeners: ${parseInt(artist.listeners || 0).toLocaleString()}</p>
                </div>
            `;
            resultsArtistsGrid.innerHTML += artistCard;
        });
    }

    /**
     * Renders album search results.
     * @param {Array<object>} albums - Array of album objects from search API.
     */
    function renderAlbumSearchResults(albums) {
        clearContainer(resultsAlbumsGrid);
        if (!resultsAlbumsGrid) {
            console.error("Album results grid not found in DOM for search."); return;
        }
         if (!albums || albums.length === 0) {
            resultsAlbumsGrid.innerHTML = '<p style="padding: 10px; text-align: center;">No albums found.</p>';
            return;
        }

        albums.forEach(album => {
            const imageUrl = getImageUrl(album.image, 'extralarge', 'https://placehold.co/170x170/555/fff?text=Album');
            const albumCard = `
                <div class="album-card">
                    <img src="${imageUrl}" alt="${album.name}" class="album-card__cover">
                    <h3 class="album-card__title">${album.name}</h3>
                    <p class="album-card__artist">${album.artist}</p>
                </div>
            `;
            resultsAlbumsGrid.innerHTML += albumCard;
        });
    }

    /**
     * Renders track search results.
     * @param {Array<object>} tracks - Array of track objects from search API.
     */
    function renderTrackSearchResults(tracks) {
        clearContainer(resultsTracksList);
        if (!resultsTracksList) {
            console.error("Track results list not found in DOM for search."); return;
        }
        if (!tracks || tracks.length === 0) {
            resultsTracksList.innerHTML = '<p style="padding: 10px; text-align: center;">No tracks found.</p>';
            return;
        }

        tracks.forEach(track => {
            const artworkUrl = getImageUrl(track.image, 'medium', 'https://placehold.co/50x50/444/fff?text=Track');
            const trackItem = `
                <div class="track-item track-item--result">
                    <div class="track-item__play-icon">▶</div>
                    <img src="${artworkUrl}" alt="${track.name} artwork" class="track-item__artwork">
                    <div class="track-item__info">
                        <h4 class="track-item__title">${track.name}</h4>
                        <p class="track-item__artist">${track.artist}</p>
                    </div>
                    <div class="track-item__duration">Listeners: ${parseInt(track.listeners || 0).toLocaleString()}</div>
                </div>
            `;
            resultsTracksList.innerHTML += trackItem;
        });
    }

    // --- API Call Functions ---

    /**
     * Loads and displays top artists.
     * @async
     */
    async function loadTopArtists() {
        try {
            if (!hotArtistsGrid) { console.warn("Hot artists grid container not found."); return; }
            hotArtistsGrid.innerHTML = '<p style="padding: 10px; text-align: center;">Loading top artists...</p>';
            const data = await fetchData({ method: 'chart.gettopartists', limit: 6 });
            if (data && data.artists && data.artists.artist) {
                renderTopArtists(data.artists.artist);
            } else {
                throw new Error("Top artists data is not in expected format.");
            }
        } catch (error) {
            displayError(hotArtistsGrid, 'Failed to load top artists. Please try again later.');
        }
    }

    /**
     * Loads and displays top tracks.
     * @async
     */
    async function loadTopTracks() {
        try {
            if (!popularTracksList) { console.warn("Popular tracks list container not found."); return; }
            popularTracksList.innerHTML = '<p style="padding: 10px; text-align: center;">Loading popular tracks...</p>';
            const data = await fetchData({ method: 'chart.gettoptracks', limit: 5 });
             if (data && data.tracks && data.tracks.track) {
                renderTopTracks(data.tracks.track);
            } else {
                throw new Error("Popular tracks data is not in expected format.");
            }
        } catch (error) {
            displayError(popularTracksList, 'Failed to load popular tracks. Please try again later.');
        }
    }

    /**
     * Performs search and displays results.
     * @async
     * @param {string} query - The search query.
     */
    async function performSearch(query) {
        const trimmedQuery = query.trim();
        if (!trimmedQuery) {
            if (musicOverviewSection) musicOverviewSection.style.display = 'block';
            if (searchResultsSection) searchResultsSection.style.display = 'none';
            return;
        }

        if (musicOverviewSection) musicOverviewSection.style.display = 'none';
        if (searchResultsSection) searchResultsSection.style.display = 'block';
        if (searchQueryDisplay) searchQueryDisplay.textContent = trimmedQuery;

        const resultContainers = [resultsArtistsGrid, resultsAlbumsGrid, resultsTracksList];
        resultContainers.forEach(container => {
            if (container) {
                clearContainer(container);
                container.innerHTML = '<p style="padding: 10px; text-align: center;">Loading...</p>';
            }
        });
        
        let artistsLoaded = false, albumsLoaded = false, tracksLoaded = false;

        function updateResultsDisplay() {
            if (artistsLoaded && albumsLoaded && tracksLoaded) {
                // Optional: Add a message if all sections loaded but some had no results individually
            }
        }

        // Artist Search
        if (resultsArtistsGrid) {
            fetchData({ method: 'artist.search', artist: trimmedQuery, limit: 3 })
                .then(data => {
                    if (data && data.results && data.results.artistmatches && data.results.artistmatches.artist) {
                        renderArtistSearchResults(data.results.artistmatches.artist);
                    } else {
                       throw new Error("Artist search data is not in expected format.");
                    }
                })
                .catch(error => displayError(resultsArtistsGrid, `Failed to load artist results for "${trimmedQuery}".`))
                .finally(() => { artistsLoaded = true; updateResultsDisplay(); });
        } else { artistsLoaded = true; }


        // Album Search
        if (resultsAlbumsGrid) {
            fetchData({ method: 'album.search', album: trimmedQuery, limit: 3 })
                .then(data => {
                     if (data && data.results && data.results.albummatches && data.results.albummatches.album) {
                        renderAlbumSearchResults(data.results.albummatches.album);
                    } else {
                        throw new Error("Album search data is not in expected format.");
                    }
                })
                .catch(error => displayError(resultsAlbumsGrid, `Failed to load album results for "${trimmedQuery}".`))
                .finally(() => { albumsLoaded = true; updateResultsDisplay(); });
        } else { albumsLoaded = true; }

        // Track Search
        if (resultsTracksList) {
            fetchData({ method: 'track.search', track: trimmedQuery, limit: 4 })
                .then(data => {
                    if (data && data.results && data.results.trackmatches && data.results.trackmatches.track) {
                        renderTrackSearchResults(data.results.trackmatches.track);
                    } else {
                        throw new Error("Track search data is not in expected format.");
                    }
                })
                .catch(error => displayError(resultsTracksList, `Failed to load track results for "${trimmedQuery}".`))
                .finally(() => { tracksLoaded = true; updateResultsDisplay(); });
        } else { tracksLoaded = true; }
    }


    // --- Event Listeners ---
    if (searchButton && searchInput) {
        searchButton.addEventListener('click', () => {
            performSearch(searchInput.value);
        });

        searchInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                performSearch(searchInput.value);
            }
        });
    } else {
        console.error('Search input or button not found.');
    }

    /**
     * Initializes the page by loading default content.
     */
    function initializePage() {
        if (musicOverviewSection) musicOverviewSection.style.display = 'block';
        if (searchResultsSection) searchResultsSection.style.display = 'none';
        loadTopArtists();
        loadTopTracks();
    }

    // --- Initial Load ---
    if (API_KEY === 'YOUR_LASTFM_API_KEY' || !API_KEY) {
        const mainContainer = document.querySelector('.site-main .container') || document.body;
        displayError(mainContainer, 'API Key is not configured. Please set your Last.fm API key in script.js.');
        console.error('API Key is not configured. Please set your Last.fm API key in script.js.');
    } else {
        initializePage();
    }
});