// src/components/Header.tsx
import React, { useState } from 'react';

interface HeaderProps {
  onSearch: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSearchClick = () => {
    onSearch(query);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onSearch(query);
    }
  };

  return (
    <header className="site-header">
      <div className="container header-container">
        <div className="site-header__logo">
          <a href="/">Last.fm</a> <span className="site-header__logo-beta">Beta</span>
        </div>
        <nav className="site-header__nav">
          <ul>
            <li><a href="#" className="nav-link">Home</a></li>
            <li><a href="#" className="nav-link">Live</a></li>
            <li><a href="#" className="nav-link active">Music</a></li>
            <li><a href="#" className="nav-link">Charts</a></li>
            <li><a href="#" className="nav-link">Events</a></li>
            <li><a href="#" className="nav-link">Features</a></li>
          </ul>
        </nav>
        <div className="site-header__search">
          <input
            type="search"
            className="search-input"
            placeholder="Search artists, tracks, albums"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button type="button" className="search-button" onClick={handleSearchClick}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/></svg>
          </button>
        </div>
        <div className="site-header__user-actions">
          <a href="#" className="user-action-link">Login</a>
          <a href="#" className="user-action-link user-action-link--signup">Sign Up</a>
        </div>
      </div>
    </header>
  );
};

export default Header;