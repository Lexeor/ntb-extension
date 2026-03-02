import { useEffect, useRef, useState } from 'react';

type SearchEngine = 'google' | 'youtube'

function SearchBar() {
  const searchInput = useRef<HTMLInputElement>(null);
  const [searchEngine, setSearchEngine] = useState<SearchEngine>('youtube');

  useEffect(() => {
    const engine = localStorage.getItem('searchEngine') as SearchEngine | null;
    setSearchEngine(engine ?? 'youtube');
  }, []);

  function redirect(val: string, engine?: SearchEngine) {
    const active = engine ?? searchEngine;
    window.location.href = active === 'youtube'
      ? `https://www.youtube.com/results?search_query=${encodeURIComponent(val)}`
      : `https://www.google.com/search?q=${encodeURIComponent(val)}`;
  }

  function handleEngineClick(engine: SearchEngine) {
    localStorage.setItem('searchEngine', engine);
    setSearchEngine(engine);
    if (searchInput.current?.value) {
      redirect(searchInput.current.value, engine);
    }
  }

  const placeholder = `Search in ${searchEngine.charAt(0).toUpperCase() + searchEngine.slice(1)}`;

  return (
    <div className="search-container">
      <div className="search-input-box">
        <div className="search-icon">
          <i className="ri-search-line" />
        </div>
        <input
          className="search-input"
          ref={searchInput}
          type="text"
          placeholder={placeholder}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && searchInput.current) {
              redirect(searchInput.current.value);
            }
          }}
        />
        <div className="absolute right-3 top-0 h-full flex flex-row gap-1 items-center justify-center">
          <button onClick={() => handleEngineClick('google')}>
            <i className={`ri-google-fill google-icon${searchEngine === 'google' ? ' active' : ''}`} />
          </button>
          <button onClick={() => handleEngineClick('youtube')}>
            <i className={`ri-youtube-fill youtube-icon${searchEngine === 'youtube' ? ' active' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default SearchBar;
