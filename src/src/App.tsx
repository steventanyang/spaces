import React, { useMemo } from "react";
import logo from "./logo.svg";
import "./App.css";
import { TGetVenueOptions, Mappedin, getVenue } from "@mappedin/mappedin-js";
import useMapView from "./components/useMapView";
import useVenue from "./components/useVenue";
import { SignInButton } from "@clerk/clerk-react";

function App() {
  const options = useMemo<TGetVenueOptions>(
    () => ({
      venue: "mappedin-demo-mall",
      clientId: "5eab30aa91b055001a68e996",
      clientSecret: "RJyRXKcryCMy4erZqqCbuB1NbR66QTGNXVE0x3Pg6oCIlUR1"
    }),
    []
  );

  const venue = useVenue(options);
  const { elementRef, mapView } = useMapView(venue);

  return (
    <div id="app">
      <p>Hello</p>
      <SignInButton mode="modal" />
      <div ref={elementRef} />
    </div>
  );
}

export default App;
