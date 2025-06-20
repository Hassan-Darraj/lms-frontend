import { useState, useEffect, useRef } from 'react';
import { globalSearch, getSearchSuggestions } from '../../services/searchService';
import './SearchBar.css';

const SearchBar = ({ onSearch, placeholder = "Search courses, instructors, categories..." }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Debounced suggestions
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchTerm.length >= 2) {
        try {
          const response = await getSearchSuggestions({ q: searchTerm, limit: 5 });
          setSuggestions(response.data.data.suggestions);
          setShowSuggestions(true);
          setSelectedIndex(-1);
        } catch (error) {
          console.error('Failed to fetch suggestions:', error);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (searchTerm.trim().length < 2) return;
    
    setLoading(true);
    setShowSuggestions(false);
    
    try {
      const response = await globalSearch({ q: searchTerm.trim() });
      onSearch(response.data.data);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion.suggestion);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    // Trigger search with selected suggestion
    setTimeout(() => {
      handleSubmit({ preventDefault: () => {} });
    }, 100);
  };

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleBlur = () => {
    // Delay hiding to allow suggestion clicks
    setTimeout(() => setShowSuggestions(false), 200);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        if (selectedIndex >= 0) {
          e.preventDefault();
          handleSuggestionClick(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        searchRef.current?.blur();
        break;
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    searchRef.current?.focus();
  };

  const getSuggestionIcon = (type) => {
    switch (type) {
      case 'course': return '📚';
      case 'instructor': return '👨‍🏫';
      case 'category': return '📁';
      default: return '🔍';
    }
  };

  return (
    <div className="search-bar-container" ref={suggestionsRef}>
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-wrapper">
          <div className="search-icon">🔍</div>
          <input
            ref={searchRef}
            type="text"
            value={searchTerm}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="search-input"
            autoComplete="off"
          />
          {searchTerm && (
            <button
              type="button"
              className="clear-btn"
              onClick={clearSearch}
              title="Clear search"
            >
              ✕
            </button>
          )}
          <button 
            type="submit" 
            className="search-btn"
            disabled={loading || searchTerm.length < 2}
            title="Search"
          >
            {loading ? (
              <div className="search-spinner"></div>
            ) : (
              <span className="search-btn-text">Search</span>
            )}
          </button>
        </div>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <div className="search-suggestions">
          <div className="suggestions-header">
            <span className="suggestions-title">Suggestions</span>
          </div>
          <div className="suggestions-list">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className={`suggestion-item ${selectedIndex === index ? 'selected' : ''}`}
                onClick={() => handleSuggestionClick(suggestion)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div className="suggestion-icon">
                  {getSuggestionIcon(suggestion.type)}
                </div>
                <div className="suggestion-content">
                  <span className="suggestion-text">{suggestion.suggestion}</span>
                  <span className="suggestion-type">{suggestion.type}</span>
                </div>
                <div className="suggestion-arrow">→</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;