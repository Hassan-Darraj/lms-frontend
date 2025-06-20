import { useState } from 'react';
import CourseCard from '../course/CourseCard';
import './SearchResults.css';

const SearchResults = ({ searchResults, onCourseSelect, onUserSelect }) => {
  const [activeTab, setActiveTab] = useState('courses');

  if (!searchResults) {
    return (
      <div className="search-results-container">
        <div className="empty-search-state">
          <div className="empty-search-icon">🔍</div>
          <h3 className="empty-search-title">Start Your Search</h3>
          <p className="empty-search-description">
            Use the search bar above to find courses, instructors, and categories.
          </p>
        </div>
      </div>
    );
  }

  const { searchTerm, totalResults, results } = searchResults;

  const tabs = [
    { key: 'courses', label: 'Courses', count: results.courses?.length || 0, icon: '📚' },
    { key: 'users', label: 'Instructors', count: results.users?.length || 0, icon: '👨‍🏫' },
    { key: 'categories', label: 'Categories', count: results.categories?.length || 0, icon: '📁' },
    { key: 'lessons', label: 'Lessons', count: results.lessons?.length || 0, icon: '📖' }
  ];

  return (
    <div className="search-results-container">
      <div className="search-results-header">
        <div className="header-content">
          <h2 className="results-title">
            Search Results for "<span className="search-term">{searchTerm}</span>"
          </h2>
          <div className="results-summary">
            <span className="results-count">{totalResults}</span>
            <span className="results-text">results found</span>
          </div>
        </div>
      </div>

      <div className="search-tabs">
        {tabs.map(tab => (
          <button
            key={tab.key}
            className={`search-tab ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
            <span className="tab-count">({tab.count})</span>
          </button>
        ))}
      </div>

      <div className="search-results-content">
        {activeTab === 'courses' && (
          <div className="courses-results">
            {results.courses?.length > 0 ? (
              <div className="results-grid course-grid">
                {results.courses.map(course => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    onView={onCourseSelect}
                  />
                ))}
              </div>
            ) : (
              <div className="no-results">
                <div className="no-results-icon">📚</div>
                <h3>No courses found</h3>
                <p>Try adjusting your search terms or browse our course catalog.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'users' && (
          <div className="users-results">
            {results.users?.length > 0 ? (
              <div className="results-grid users-grid">
                {results.users.map(user => (
                  <div 
                    key={user.id} 
                    className="result-card user-card" 
                    onClick={() => onUserSelect?.(user)}
                  >
                    <div className="card-header">
                      <div className="user-avatar">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="user-info">
                        <h4 className="user-name">{user.name}</h4>
                        <p className="user-email">{user.email}</p>
                      </div>
                    </div>
                    <div className="card-details">
                      <div className="detail-item">
                        <span className="detail-label">Role:</span>
                        <span className={`role-badge role-${user.role}`}>{user.role}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Joined:</span>
                        <span className="detail-value">
                          {new Date(user.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-results">
                <div className="no-results-icon">👨‍🏫</div>
                <h3>No instructors found</h3>
                <p>Try searching with different keywords or browse all instructors.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="categories-results">
            {results.categories?.length > 0 ? (
              <div className="results-grid categories-grid">
                {results.categories.map(category => (
                  <div key={category.id} className="result-card category-card">
                    <div className="card-header">
                      <div className="category-icon">📁</div>
                      <h4 className="category-name">{category.name}</h4>
                    </div>
                    <div className="card-details">
                      <div className="detail-item">
                        <span className="detail-label">Created:</span>
                        <span className="detail-value">
                          {new Date(category.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-results">
                <div className="no-results-icon">📁</div>
                <h3>No categories found</h3>
                <p>Try different search terms or explore all available categories.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'lessons' && (
          <div className="lessons-results">
            {results.lessons?.length > 0 ? (
              <div className="results-grid lessons-grid">
                {results.lessons.map(lesson => (
                  <div key={lesson.id} className="result-card lesson-card">
                    <div className="card-header">
                      <div className="lesson-icon">📖</div>
                      <div className="lesson-info">
                        <h4 className="lesson-title">{lesson.title}</h4>
                        <p className="lesson-course">Course: {lesson.course_title}</p>
                      </div>
                      {lesson.is_free && <span className="free-badge">Free</span>}
                    </div>
                    <div className="card-details">
                      <div className="detail-item">
                        <span className="detail-label">Type:</span>
                        <span className="detail-value">{lesson.content_type}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Duration:</span>
                        <span className="detail-value">{lesson.duration} minutes</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-results">
                <div className="no-results-icon">📖</div>
                <h3>No lessons found</h3>
                <p>Try refining your search or browse lessons by course.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;