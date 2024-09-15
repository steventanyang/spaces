import { MapView, useMapData, useMap, Label } from "@mappedin/react-sdk";
import "@mappedin/react-sdk/lib/esm/index.css";
import GoogleSearch from "./components/Search";
import styled from "styled-components";
import FloorSelector from "./components/FloorSelector";

const Main = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const SearchContainer = styled.div`
  position: absolute;
  width: 80%;
  top: -40%;
  padding-horizontal: 30px;
  z-index: 1000;
`;

function MyCustomComponent() {
  const { mapData } = useMap();

  return mapData.getByType("space").map((space) => {
    return <Label key={space.id} target={space.center} text={space.name} />;
  });
}

export default function App() {

  // See Demo API key Terms and Conditions
  // https://developer.mappedin.com/v6/demo-keys-and-maps/
  const { isLoading, error, mapData } = useMapData({
    key: "mik_Qar1NBX1qFjtljLDI52a60753",
    secret: "mis_CXFS9WnkQkzQmy9GCt4ucn2D68zNRgVa2aiJj5hEIFM8aa40fee",
    mapId: "66ce20fdf42a3e000b1b0545",
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error.message}</div>;
  }
  

  return mapData ? (
    <Main>
      <SearchContainer>
        <GoogleSearch />
      </SearchContainer>
        
      <MapView mapData={mapData}>
        <MyCustomComponent />
        <FloorSelector />
      </MapView>
    </Main>
  ) : null;
}
