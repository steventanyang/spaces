import { MapView, useMapData, useMap, Label } from "@mappedin/react-sdk";
import "@mappedin/react-sdk/lib/esm/index.css";
import GoogleSearch from "./components/Search";
import styled from "styled-components";
import FloorSelector from "./components/FloorSelector";
import { VideoRecorder } from "@capacitor-community/video-recorder";
import { useEffect } from "react";
import { Filesystem } from "@capacitor/filesystem";
import { Camera, CameraResultType } from "@capacitor/camera";
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
      .then(() => {
        console.log("Video Recorder initialized");

        // Add preview frame configuration
        VideoRecorder.addPreviewFrameConfig({
          id: "previewFrame", // Unique ID for the frame
          stackPosition: "back", // Back camera
          x: 0, // x position (top-left corner)
          y: 0, // y position (top-left corner)
          width: "fill", // Fill the entire width of the screen
          height: "fill", // Fill the entire height of the screen
          borderRadius: 0, // No border radius
          dropShadow: { opacity: 0.5, radius: 10, color: "#000" }, // Optional: drop shadow effect
        });
      })
      .catch((error) =>
        console.error("Error initializing video recorder", error)
      );

    return () => {
      // Clean up on unmount
      VideoRecorder.destroy();
    };
  }, []);

  // const startRecording = async () => {
  //   try {
  //     await VideoRecorder.showPreviewFrame({
  //       position: 1, // 1 (Back camera or adjust as needed)
  //       quality: 2, // 1080p (can be changed based on your needs)
  //     });

  //     console.log("Preview frame shown");

  //     await VideoRecorder.startRecording();
  //     console.log("Recording started");
  //   } catch (error) {
  //     console.error("Error starting recording", error);
  //   }
  // };

  const stopRecording = async () => {
    try {
      const url = await VideoRecorder.stopRecording();
      console.log("test", url.videoUrl);

      const fakecoor = ["3.1", "3.2", "3"];

      const filePath = "file://" + url.videoUrl.split("_capacitor_file_")[1];
      const file = await Filesystem.readFile({ path: filePath });

      const fileData = file.data as string;
      // Convert base64 to Blob
      const base64ToBlob = (base64: string, type = "video/mp4") => {
        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray], { type });
      };

      const videoBlob = base64ToBlob(fileData);

      // Create FormData and append the video
      const formData = new FormData();
      formData.append("video", videoBlob, "video/mp4");
      formData.append("x", fakecoor[0]);
      formData.append("y", fakecoor[1]);
      formData.append("floor", fakecoor[2]);

      try {
        const response = await fetch("http://172.20.10.2:8000/upload_video/", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();
        console.log("Upload result:", result);
      } catch (error) {
        console.log("error uploading", error);
      }

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
        <FloorSelector />
      </MapView>

      <ButtonContainer>
        <RecordButton onClick={takePicture}>Start Recording</RecordButton>
        <StopButton onClick={stopRecording}>Stop Recording</StopButton>
      </ButtonContainer>
    </Main>
  ) : null;
}
