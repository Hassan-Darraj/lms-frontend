import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "../../components/common/Layout";
import SearchBar from "../../components/common/SearchBar";
import SearchResults from "../../components/common/SearchResults";

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const [searchResults, setSearchResults] = useState(null);
  const initialQuery = searchParams.get("q") || "";

  const handleSearchResults = (results) => {
    setSearchResults(results);
  };

  const handleCourseSelect = (course) => {
    window.location.href = `/courses/${course.id}`;
  };

  const handleUserSelect = (user) => {
    // Navigate to user profile or courses by this instructor
    window.location.href = `/courses?instructor=${user.id}`;
  };

  return (
    <Layout showSidebar={true}>
      <div className="search-page">
        <div className="page-header">
          <h1>Search</h1>
          <p>Find courses, instructors, and content across the platform</p>
        </div>

        <div className="search-results-section">
          <SearchResults
            searchResults={searchResults}
            onCourseSelect={handleCourseSelect}
            onUserSelect={handleUserSelect}
          />
          <div className="search-section">
            <SearchBar
              onSearch={handleSearchResults}
              placeholder="Search for courses, instructors, categories..."
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SearchResultsPage;
