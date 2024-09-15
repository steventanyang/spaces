import { useState } from "react";
import styled from "styled-components";

const SearchContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const SearchBox = styled.input`
  width: 300px;
  padding: 12px 20px;
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

const SearchButton = styled.button`
  margin-left: 10px;
  padding: 12px 20px;
  border-radius: 50px;
  border: none;
  background-color: #333; /* Dark button color */
  color: #fff; /* White text for contrast */
  font-size: 16px;
  cursor: pointer;
  outline: none;
  box-shadow: 0px 1px 6px rgba(32, 33, 36, 0.28);

  &:hover {
    background-color: #555; /* Slightly lighter on hover */
  }
`;

const GoogleSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (e: any) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = () => {
    console.log("Search term:", searchTerm);
    // Add functionality to handle the search
  };

  return (
    <SearchContainer>
      <SearchBox
        type="text"
        placeholder="Search For Spaces"
        value={searchTerm}
        onChange={handleInputChange}
      />
      <SearchButton onClick={handleSearch}>
        Search
      </SearchButton>
    </SearchContainer>
  );
};

export default GoogleSearch;
