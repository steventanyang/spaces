import { MapView, useMapData, useMap, Label } from "@mappedin/react-sdk";
import "@mappedin/react-sdk/lib/esm/index.css";
import GoogleSearch from "./components/Search";
import styled from "styled-components";
import FloorSelector from "./components/FloorSelector";
import { Camera, CameraResultType } from "@capacitor/camera";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import DrawNavigation from "./components/DrawNavigation";
import { Geolocation } from '@capacitor/geolocation';
// import axios from "axios";

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

const ButtonContainer = styled.div`
  position: absolute;
  bottom: 20px;
  display: flex;
  gap: 20px;
  justify-content: center;
  width: 100%;
`;

const RecordButton = styled.button`
  padding: 20px 20px;
  background-color: #333;
  color: white;
  border: none;
  border-radius: 50%;
  width: 100px;
  height: 100px;
  cursor: pointer;
  font-size: 16px;
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

  const getCurrentPosition = async () => {
    const coordinates = await Geolocation.getCurrentPosition();
    return coordinates;
  };

  const takePicture = async () => {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri,
    });

    // image.webPath will contain a path that can be set as an image src.
    // You can access the original file using image.path, which can be
    // passed to the Filesystem API to read the raw data of the image,
    // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
    const imageUrl = image.webPath;

    // Can be set to the src of an image now
    console.log(imageUrl);
  };

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
        <DrawNavigation />
        <FloorSelector />
      </MapView>

      <ButtonContainer>
        <RecordButton onClick={takePicture}>
          <FontAwesomeIcon
            icon={faCamera}
            style={{ color: "white", height: "35px", width: "35px" }}
          />
        </RecordButton>
      </ButtonContainer>
    </Main>
  ) : null;
}
