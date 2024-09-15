import React, { useMemo } from "react";
import logo from "./logo.svg";
import "./App.css";
import Map, { Mappedin } from "./components/mappedin-react";
import { SignIn, SignInButton, SignedIn, SignedOut } from "@clerk/clerk-react";
import Visualization from "./visualization";
import Customization from "./customization";

function App() {
  const options = {
      key: "mik_Qar1NBX1qFjtljLDI52a60753",
      mapId: "66ce20fdf42a3e000b1b0545",
      secret: "mis_CXFS9WnkQkzQmy9GCt4ucn2D68zNRgVa2aiJj5hEIFM8aa40fee",
  };

  return (
    <div id="app" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <SignedIn>
        <div id="mappedin-div">
          <Mappedin
            mapKey={options.key}
            mapSecret={options.secret}
            mapId={options.mapId}
          >
            <Map />
            {/* <Customization /> */}
            {/* <Visualization /> */}
          </Mappedin>

          <div id="demo-descriptions-container">
            <h1>Where are customers searching for coffee?</h1>
          </div>
        </div>
      </SignedIn>
      <SignedOut>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <h2>Please sign in to access the application</h2>
          <SignIn />
        </div>
      </SignedOut>
    </div>
  );
}

export default App;
