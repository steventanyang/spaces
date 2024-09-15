import { useState } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

// Container for the search bar and button
const SearchContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

// Wrapper for the search input and icon
const SearchBoxWrapper = styled.div`
  position: relative;
  width: 300px;
`;

const SearchBox = styled.input`
  width: 80%;
  padding: 12px 20px;
  padding-left: 45px; /* Space for the icon */
  border-radius: 50px;
  border: 1px solid #dfe1e5;
  box-shadow: 0px 4px 12px rgba(32, 33, 36, 0.38); /* Bigger shadow */
  font-size: 16px;
  outline: none;
  transition: box-shadow 0.3s ease-in-out;

  &:focus {
    box-shadow: 0px 6px 20px rgba(32, 33, 36, 0.5); /* Bigger shadow on focus */
  }
`;

// Style for the icon inside the search box
const IconWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 15px; /* Distance from the left edge of the input */
  transform: translateY(-50%);
  color: #9aa0a6; /* Slightly gray color for the icon */
  pointer-events: none; /* Allow clicks to pass through the icon */
`;

const GoogleSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (e: any) => {
    setSearchTerm(e.target.value);
  };

  // Handle search when Enter key is pressed
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSearch = () => {
    console.log("Search term:", searchTerm);
    // Add functionality to handle the search
  };

  return (
    <SearchContainer>
      <SearchBoxWrapper>
        <IconWrapper>
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </IconWrapper>
        <SearchBox
          type="text"
          placeholder="Search For Spaces"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
        />
      </SearchBoxWrapper>
    </SearchContainer>
  );
};

export default GoogleSearch;
