import React, {useRef, useState, useEffect} from 'react'

function SearchBar() {
    const searchInput = useRef(null);
    const [searchEngine, setSearchEngine] = useState();

    useEffect(() => {
        const engine = localStorage.getItem('searchEngine');

        if (engine) {
            setSearchEngine(engine);
        } else {
            setSearchEngine('youtube');
        }
    }, []);

    function redirect(val, engine) {
        let url = "";

        if(!engine) {
            url = (searchEngine === 'youtube') 
                ? `https://www.youtube.com/results?search_query=${val}`
                : `https://www.google.com/search?q=${val}`;
        } else {
            url = (engine === 'youtube') 
                ? `https://www.youtube.com/results?search_query=${val}`
                : `https://www.google.com/search?q=${val}`;
        }

        window.location.href = url;
    }

    function handleClick(engine) {
        localStorage.setItem('searchEngine', engine);
        setSearchEngine(engine);

        if(searchInput.current.value)
            redirect(searchInput.current.value, engine);
    }

    const iconClass = (searchEngine === 'youtube') ? ' active' : '';

    return (
        <div className="search-container">
            <div className="search-input-box">
                <div className="search-icon">
                    <i className="ri-search-line"></i>
                </div>
                <input 
                    className="search-input" 
                    ref={searchInput} 
                    type="text"
                    placeholder={`Search in ${searchEngine && searchEngine.charAt(0).toUpperCase() + searchEngine.slice(1)}`}
                    onKeyDown={(e) => {
                        if(e.key === 'Enter')
                            redirect(e.target.value)
                    }}
                ></input>
                <button id="btn-google" onClick={() => handleClick('google')}>
                    <i className={`ri-google-fill google-icon ${(searchEngine === 'google') ? 'active' : ''}`}></i>
                </button>
                <button id="btn-youtube" onClick={() => handleClick('youtube')}>
                    <i className={`ri-youtube-fill youtube-icon ${(searchEngine === 'youtube') ? 'active' : ''}`}></i>
                </button>
            </div>
        </div>
    )
}

export default SearchBar