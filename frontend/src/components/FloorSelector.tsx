import { useMap } from "@mappedin/react-sdk";
import styled from "styled-components";

// Styled component similar to the Search button container
const FloorSelectorContainer = styled.div`
  position: absolute;
  top: 10%;
  z-index: 1000;
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 5px;
  justify-content: flex-end;
`;

const StyledSelect = styled.select`
  padding: 25px 30px;
  font-size: 16px;
  border-radius: 5px;
  border: px solid #dfe1e5;
  background: #333;
  appearance: none;
  outline: none;
  cursor: pointer;
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
      <StyledSelect
        defaultValue={mapView.currentFloor.id}
        onChange={(e) => {
          mapView.setFloor(e.target.value);
        }}
      >
        {sortedFloors.map((floor, idx) => {
          const floorNumber = floor.name.replace("Floor ", "");
          return (
            <>
              <option key={idx} value={floor.id}>
                {floorNumber}
              </option>
            </>
          );
        })}
      </StyledSelect>
    </FloorSelectorContainer>
  );
}
