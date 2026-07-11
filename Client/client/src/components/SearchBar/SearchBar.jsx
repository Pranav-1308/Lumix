import "./SearchBar.css";

import { FaSearch, FaFilter } from "react-icons/fa";

function SearchBar() {

  return (

    <div className="search-container">

      {/* Search Box */}

      <div className="search-box">

        <FaSearch className="search-icon" />

        <input
          type="text"
          placeholder="Search chats, users, OTP..."
        />

      </div>

      {/* Filter Button */}

      <button className="filter-btn">

        <FaFilter />

        <span>Filters</span>

      </button>

    </div>

  );

}

export default SearchBar;