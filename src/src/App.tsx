// import { TGetVenueOptions } from "@mappedin/mappedin-js";
// import { useMemo, useState } from "react";
// import styled from "styled-components";
// import "./App.css";

// import Map from "./screens/Map";
// import Profile from "./screens/Profile";

// import { CgProfile } from "react-icons/cg";
// import { FaMapMarkerAlt } from "react-icons/fa";

// const Main = styled.div`
//   height: 100vh;
//   width: 100vw;
// `;

// const BottomNavbar = styled.div`
//   position: fixed;
//   left: 0;
//   bottom: 0;
//   width: 100%;
//   height: 100px;
//   background-color: #323437;
//   color: white;
//   text-align: center;
//   justify-content: center;
//   display: flex;
//   flex-direction: row;
//   align-items: center;
// `;

// const Text = styled.div`
//   padding: 20px;
//   background-color: #000;
//   height: 20px;
//   width: 20px;
// `;

// const Icon = styled.div`
//   padding: 20px;
// `;

// const enum Screen {
//   MAP = "map",
//   PROFILE = "profile",
// }

// const App = () => {
//   const [screen, setScreen] = useState(Screen.MAP);

//   const options = {
//     key: "mik_yeBk0Vf0nNJtpesfu560e07e5",
//     secret: "mis_2g9ST8ZcSFb5R9fPnsvYhrX3RyRwPtDGbMGweCYKEq385431022",
//     mapId: "660c0c6e7c0c4fe5b4cc484c",
//   };

//   return (
//     <>
//       <Main>
//         {screen === Screen.MAP && <Map />}
//         {screen === Screen.PROFILE && <Profile />}
//       </Main>

//       <BottomNavbar>
//         <Icon onClick={() => setScreen(Screen.MAP)}>
//           <FaMapMarkerAlt size={40} />
//         </Icon>

//         <Icon onClick={() => setScreen(Screen.PROFILE)}>
//           <CgProfile size={40} />
//         </Icon>
//       </BottomNavbar>
//     </>
//   );
// };

// export default App;

import { MappedinLocation, TGetVenueOptions } from "@mappedin/mappedin-js";
import "@mappedin/mappedin-js/lib/mappedin.css";
import { useContext, useEffect, useMemo, useState } from "react";
import useMapView from "./components/useMapView";
import useSelectedLocation from "./components/useSelectedLocation";
import useVenue from "./components/useVenue";
import styled from "styled-components";
import { CgProfile } from "react-icons/cg";
import { FaMapMarkerAlt } from "react-icons/fa";
import { GlobalContext } from "./GlobalContext";

const Main = styled.div`
  height: 100vh;
  width: 100vw;
`;

const Map = styled.div`
  height: 100vh;
  width: 100vw;
`;

const BottomNavbar = styled.div`
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 100px;
  background-color: #323437;
  color: white;
  text-align: center;
  justify-content: center;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Text = styled.div`
  padding: 20px;
  background-color: #000;
  height: 20px;
  width: 20px;
`;

const Icon = styled.div`
  padding: 20px;
`;

const enum Screen {
  MAP = "map",
  PROFILE = "profile",
}

export default function App() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [screen, setScreen] = useState(Screen.MAP);
  // See Trial API key Terms and Conditions
  // https://developer.mappedin.com/api-keys
  const options = useMemo<TGetVenueOptions>(
    () => ({
      venue: "mappedin-demo-mall",
      clientId: "5eab30aa91b055001a68e996",
      clientSecret: "RJyRXKcryCMy4erZqqCbuB1NbR66QTGNXVE0x3Pg6oCIlUR1",
    }),
    []
  );
  const venue = useVenue(options);
  const { elementRef, mapView } = useMapView(venue);
  const { selectedLocation, setSelectedLocation } =
    useSelectedLocation(mapView);

  const { globalState, setGlobalState } = useContext(GlobalContext);


  return (
    <Main id="app">
      <div id="ui">
        <div>{`Selected: ${globalState ?? 0}`}</div>
      </div>
      <Map id="map-container" ref={elementRef}></Map>

      <BottomNavbar>
        <Icon onClick={() => setScreen(Screen.MAP)}>
          <FaMapMarkerAlt size={40} />
        </Icon>

        <Icon onClick={() => setScreen(Screen.PROFILE)}>
          <CgProfile size={40} />
        </Icon>
      </BottomNavbar>
    </Main>
  );
}
