import React, { useMemo, useRef, useEffect } from "react";
import styled from "styled-components";
import { TGetVenueOptions, Mappedin, getVenue, showVenue } from "@mappedin/mappedin-js";
import useMapView from "../components/useMapView";
import useVenue from "../components/useVenue";
import useSelectedLocation from "../components/useSelectedLocation";

const Main = styled.div`
  height: 100vh;
  width: 100vw;
`;

const Map = () => {
  const options = useMemo<TGetVenueOptions>(
    () => ({
      venue: "mappedin-demo-mall",
      clientId: "5eab30aa91b055001a68e996",
      clientSecret: "RJyRXKcryCMy4erZqqCbuB1NbR66QTGNXVE0x3Pg6oCIlUR1",
    }),
    []
  );

  const venueRef = useRef<Mappedin | null>(null); // Cache venue
  const venue = useVenue(options);
  const { elementRef, mapView } = useMapView(venueRef.current || venue);
  const { selectedLocation, setSelectedLocation } = useSelectedLocation(
    mapView
  );

  const getData = async () => {
    const test = await getVenue(options);
    const mapView = await showVenue(document.getElementById("app")!, test);

    mapView.addInteractivePolygonsForAllLocations();
  };

  useEffect(() => {
    if (!venueRef.current) {
      venueRef.current = venue || null; // Cache the venue instance
    }
    getData();
  }, [venue]);

  return (
    <>
      <Main id="app" ref={elementRef} />
    </>
  );
};

export default Map;
