import { useState, useEffect } from 'react';
import { searchCourses } from '../../services/searchService';
import { getCategories } from '../../services/categoryService';
import './AdvancedCourseSearch.css';

const AdvancedCourseSearch = ({ onResults }) => {
  const [searchParams, setSearchParams] = useState({
    q: '',
    category_id: '',
    instructor_id: '',
    price_min: '',
    price_max: '',
    sort_by: 'relevance'
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response.data.data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setSearchParams(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (searchParams.q.trim().length < 2) return;

    setLoading(true);
    try {
      // Filter out empty values
      const cleanParams = Object.entries(searchParams)
        .filter(([key, value]) => value !== '')
        .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});

      const response = await searchCourses(cleanParams);
      onResults(response.data.data);
    } catch (error) {
      console.error('Advanced search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSearchParams({
      q: '',
      category_id: '',
      instructor_id: '',
      price_min: '',
      price_max: '',
      sort_by: 'relevance'
    });
  };

  return (
    <div className="advanced-search-container">
      <div className="search-header">
        <h3 className="search-title">Advanced Course Search</h3>
        <div className="search-icon">🔍</div>
      </div>
      
      <form onSubmit={handleSubmit} className="advanced-search-form">
        <div className="form-group">
          <label className="form-label">Search Query</label>
          <div className="input-wrapper">
            <input
              type="text"
              name="q"
              value={searchParams.q}
              onChange={handleChange}
              className="form-input"
              placeholder="Search courses..."
              required
            />
            <span className="input-icon">🔍</span>
          </div>
        </div>

        <div className="search-row">
          <div className="form-group">
            <label className="form-label">Category</label>
            <div className="select-wrapper">
              <select
                name="category_id"
                value={searchParams.category_id}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <span className="select-icon">▼</span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Instructor ID</label>
            <div className="input-wrapper">
              <input
                type="number"
                name="instructor_id"
                value={searchParams.instructor_id}
                onChange={handleChange}
                className="form-input"
                placeholder="Instructor ID"
              />
              <span className="input-icon">👨‍🏫</span>
            </div>
          </div>
        </div>

        <div className="search-row">
          <div className="form-group">
            <label className="form-label">Min Price</label>
            <div className="input-wrapper">
              <input
                type="number"
                name="price_min"
                value={searchParams.price_min}
                onChange={handleChange}
                className="form-input"
                placeholder="Min Price"
                min="0"
                step="0.01"
              />
              <span className="input-icon">💰</span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Max Price</label>
            <div className="input-wrapper">
              <input
                type="number"
                name="price_max"
                value={searchParams.price_max}
                onChange={handleChange}
                className="form-input"
                placeholder="Max Price"
                min="0"
                step="0.01"
              />
              <span className="input-icon">💰</span>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Sort By</label>
          <div className="select-wrapper">
            <select
              name="sort_by"
              value={searchParams.sort_by}
              onChange={handleChange}
              className="form-select"
            >
              <option value="relevance">Relevance</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
            <span className="select-icon">▼</span>
          </div>
        </div>

        <div className="search-actions">
          <button 
            type="button" 
            className="action-btn reset-btn"
            onClick={handleReset}
          >
            <span className="btn-icon">🔄</span>
            Reset
          </button>
          <button 
            type="submit" 
            className="action-btn search-btn"
            disabled={loading || searchParams.q.length < 2}
          >
            {loading ? (
              <>
                <div className="btn-spinner"></div>
                Searching...
              </>
            ) : (
              <>
                <span className="btn-icon">🔍</span>
                Search Courses
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdvancedCourseSearch;