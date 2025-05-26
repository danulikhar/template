import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import { fetchData, getImageUrl } from './api';

interface Artist {
  name: string;
  playcount: string;
  listeners: string;
  image: any[];
}
interface Track {
  name: string;
  artist: { name: string } | string;
  listeners: string;
  image: any[];
}
interface Album {
  name: string;
  artist: string;
  image: any[];
}

const App: React.FC = () => {
  const [view, setView] = useState<'overview' | 'search'>('overview');
  const [query, setQuery] = useState('');
  const [topArtists, setTopArtists] = useState<Artist[]>([]);
  const [topTracks, setTopTracks] = useState<Track[]>([]);
  const [searchResults, setSearchResults] = useState<{ artists: Artist[], albums: Album[], tracks: Track[] }>({ artists: [], albums: [], tracks: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        const artistsPromise = fetchData({ method: 'chart.gettopartists', limit: '6' });
        const tracksPromise = fetchData({ method: 'chart.gettoptracks', limit: '5' });

        const [artistsData, tracksData] = await Promise.all([artistsPromise, tracksPromise]);

        setTopArtists(artistsData.artists.artist);
        setTopTracks(tracksData.tracks.track);
        setError(null);
      } catch (err) {
        setError('Не удалось загрузить данные. Пожалуйста, проверьте ваше соединение и обновите страницу.');
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, []);

  const handleSearch = async (searchQuery: string) => {
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) {
      setView('overview');
      return;
    }
    
    setQuery(trimmedQuery);
    setView('search');
    setLoading(true);
    setError(null);

    try {
      const artistPromise = fetchData({ method: 'artist.search', artist: trimmedQuery, limit: '7' });
      const albumPromise = fetchData({ method: 'album.search', album: trimmedQuery, limit: '10' });
      const trackPromise = fetchData({ method: 'track.search', track: trimmedQuery, limit: '10' });

      const [artistRes, albumRes, trackRes] = await Promise.all([artistPromise, albumPromise, trackPromise]);

      setSearchResults({
        artists: artistRes.results.artistmatches.artist || [],
        albums: albumRes.results.albummatches.album || [],
        tracks: trackRes.results.trackmatches.track || [],
      });
    } catch (err) {
      setError(`Не удалось выполнить поиск по запросу "${trimmedQuery}". Попробуйте еще раз.`);
    } finally {
      setLoading(false);
    }
  };

  const renderTopArtists = () => (
    <div className="artist-grid artist-grid--hot">
      {topArtists.map(artist => (
        <div key={artist.name} className="artist-card artist-card--circular">
          <img src={getImageUrl(artist.image, 'extralarge')} alt={artist.name} className="artist-card__image" />
          <h3 className="artist-card__name">{artist.name}</h3>
          <p className="artist-card__tags">Playcount: {parseInt(artist.playcount || '0').toLocaleString()}</p>
        </div>
      ))}
    </div>
  );

  const renderTopTracks = () => (
    <div className="track-list track-list--popular">
      {topTracks.map(track => {
        const artistName = typeof track.artist === 'string' ? track.artist : track.artist.name;
        return (
          <div key={track.name + artistName} className="track-item">
            <img src={getImageUrl(track.image, 'medium')} alt={track.name} className="track-item__artwork" />
            <div className="track-item__info">
              <h4 className="track-item__title">{track.name}</h4>
              <p className="track-item__artist">{artistName}</p>
              <p className="track-item__genre">Listeners: {parseInt(track.listeners).toLocaleString()}</p>
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderSearchResults = () => (
     <section className="search-results-section">
      <h1 className="main-title">Search results for "<span className="search-query-display">{query}</span>"</h1>
      <section className="content-section results-artists">
        <h2 className="section-title">Artists</h2>
        <div className="artist-grid artist-grid--results">
          {searchResults.artists.length > 0 ? searchResults.artists.map(artist => (
            <div key={artist.name} className="artist-card artist-card--square">
              <img src={getImageUrl(artist.image, 'large')} alt={artist.name} className="artist-card__image" />
              <h3 className="artist-card__name">{artist.name}</h3>
              <p className="artist-card__meta">Listeners: {parseInt(artist.listeners).toLocaleString()}</p>
            </div>
          )) : <p>No artists found.</p>}
        </div>
      </section>
      
      <section className="content-section results-albums">
         <h2 className="section-title">Albums</h2>
         <div className="album-grid">
           {searchResults.albums.length > 0 ? searchResults.albums.map(album => (
             <div key={album.name + album.artist} className="album-card">
               <img src={getImageUrl(album.image, 'extralarge')} alt={album.name} className="album-card__cover" />
               <h3 className="album-card__title">{album.name}</h3>
               <p className="album-card__artist">{album.artist}</p>
             </div>
           )) : <p>No albums found.</p>}
         </div>
       </section>

      <section className="content-section results-tracks">
        <h2 className="section-title">Tracks</h2>
        <div className="track-list track-list--results">
            {searchResults.tracks.length > 0 ? searchResults.tracks.map(track => {
                const artistName = typeof track.artist === 'string' ? track.artist : track.artist.name;
                return (
                 <div key={track.name + artistName} className="track-item">
                     <img src={getImageUrl(track.image, 'medium')} alt={track.name} className="track-item__artwork" />
                     <div className="track-item__info">
                         <h4 className="track-item__title">{track.name}</h4>
                         <p className="track-item__artist">{artistName}</p>
                     </div>
                     <div className="track-item__duration">Listeners: {parseInt(track.listeners).toLocaleString()}</div>
                 </div>
                )
            }) : <p>No tracks found.</p>}
        </div>
      </section>
     </section>
  );

  return (
    <div className="app-wrapper">
      <Header onSearch={handleSearch} />
      <main className="site-main">
        <div className="container">
          {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
          {loading && <p style={{ textAlign: 'center' }}>Loading...</p>}
          
          {!loading && !error && view === 'overview' && (
            <section className="music-overview-section">
              <h1 className="main-title">Music</h1>
              <section className="content-section">
                <h2 className="section-title">Hot right now</h2>
                {renderTopArtists()}
              </section>
              <section className="content-section">
                <h2 className="section-title">Popular tracks</h2>
                {renderTopTracks()}
              </section>
            </section>
          )}

          {!loading && !error && view === 'search' && renderSearchResults()}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;