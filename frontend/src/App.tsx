import { MapView, useMapData, useMap, Label } from "@mappedin/react-sdk";
import "@mappedin/react-sdk/lib/esm/index.css";
import GoogleSearch from "./components/Search";
import styled from "styled-components";
import FloorSelector from "./components/FloorSelector";
import { VideoRecorder } from "@capacitor-community/video-recorder";
import { useEffect } from "react";
import { Filesystem } from "@capacitor/filesystem";

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
  padding: 10px 20px;
  background-color: red;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
`;

const StopButton = styled.button`
  padding: 10px 20px;
  background-color: green;
  color: white;
  border: none;
  border-radius: 5px;
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
  useEffect(() => {
    // Initialize Video Recorder
    VideoRecorder.initialize({
      camera: 1,
      quality: 2,
      autoShow: true,
    })
      .then(() => console.log("Video Recorder initialized"))
      .catch((error) =>
        console.error("Error initializing video recorder", error)
      );

    return () => {
      // Clean up on unmount
      VideoRecorder.destroy();
    };
  }, []);

  const startRecording = async () => {
    try {
      await VideoRecorder.startRecording();
      console.log("Recording started");
    } catch (error) {
      console.error("Error starting recording", error);
    }
  };

  const stopRecording = async () => {
    try {
      const url = await VideoRecorder.stopRecording();
      console.log("test", url.videoUrl);

      const filePath = "file://" + url.videoUrl.split("_capacitor_file_")[1];
      const file = await Filesystem.readFile({ path: filePath });
      const fileData = file.data
      const bucketUrl = "https://storage.googleapis.com/video-storage-12345678";
      const fileBlob = Buffer.from(file.data, "base64");

      console.log("fil", file);

      // const readFile = await Filesystem.readFile({
      //   path: url.replace("capacitor://localhost/_capacitor_file_", ""),
      //   directory: Directory.Data,
      // });
      // console.log("readFile", readFile);

      // console.log(
      //   "testing",
      //   Filesystem.getUri({ path: videoUrl, directory: Directory.Data })
      // );
      // console.log("Recording stopped, saved at", videoUrl);

      // // Extract the file name from the videoUrl
      // const fileName = videoUrl.substring(videoUrl.lastIndexOf("/") + 1);

      // // Read the video file from the temporary path
      // const videoData = await Filesystem.readFile({
      //   path: videoUrl,
      //   directory: Directory.Cache, // Temp files are typically stored in the Cache directory
      // });

      // // Save the file to the Documents directory for permanent storage
      // await Filesystem.writeFile({
      //   path: fileName,
      //   data: videoData.data,
      //   directory: Directory.Documents, // Store it in the permanent Documents directory
      // });

      // console.log(`Video saved to Documents directory: ${fileName}`);
    } catch (error) {
      console.error("Error stopping or saving the recording", error);
    }
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
        <FloorSelector />
      </MapView>

      <ButtonContainer>
        <RecordButton onClick={startRecording}>Start Recording</RecordButton>
        <StopButton onClick={stopRecording}>Stop Recording</StopButton>
      </ButtonContainer>
    </Main>
  ) : null;
}
