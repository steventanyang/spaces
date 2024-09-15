import { useMap } from "@mappedin/react-sdk";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStairs } from "@fortawesome/free-solid-svg-icons";

// Styled component similar to the Search button container
const FloorSelectorContainer = styled.div`
  position: absolute;
  bottom: 10%;
  left: 10%;
  z-index: 1000;
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 5px;
  justify-content: flex-end;
`;

const StyledSelectWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const StyledSelect = styled.select`
  padding: 10px 15px;
  padding-left: 40px; /* Space for the icon */
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #dfe1e5;
  background: #333;
  color: white;
  appearance: none;
  outline: none;
  cursor: pointer;
`;

// Positioned Icon inside the select box
const IconWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
  pointer-events: none; /* Prevents the icon from blocking interaction with the select */
`;

export default function FloorSelector() {
  const { mapData, mapView } = useMap();

  // Sort floors based on the numeric value in their names
  const sortedFloors = mapData.getByType("floor").sort((a, b) => {
    const floorA = parseInt(a.name.replace("Floor ", ""));
    const floorB = parseInt(b.name.replace("Floor ", ""));
    return floorA - floorB;
  });

  return (
    <FloorSelectorContainer>
      <StyledSelectWrapper>
        {/* Icon inside the box */}
        <IconWrapper>
          <FontAwesomeIcon icon={faStairs} style={{ color: "white" }} />
        </IconWrapper>
        <StyledSelect
          defaultValue={mapView.currentFloor.id}
          onChange={(e) => {
            mapView.setFloor(e.target.value);
          }}
        >
          {sortedFloors.map((floor, idx) => {
            const floorNumber = floor.name.replace("Floor ", "");
            return (
              <option key={idx} value={floor.id}>
                {floorNumber}
              </option>
            );
          })}
        </StyledSelect>
      </StyledSelectWrapper>
    </FloorSelectorContainer>
  );
}
