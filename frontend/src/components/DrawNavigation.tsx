import { Navigation, useMap } from "@mappedin/react-sdk";
import { Coordinate } from "@mappedin/react-sdk/mappedin-js/src/map-data-objects";
import { useState, useEffect } from "react";
import { Geolocation } from "@capacitor/geolocation";

export default function DrawNavigation() {
  const { mapView } = useMap();

  // Initialize state for both the current position and destination
  const [currentPosition, setCurrentPosition] = useState<Coordinate | null>(
    null
  );
  const [destination, setDestination] = useState<Coordinate | null>(null);

  // Function to get the current position of the user
  const getCurrentPosition = async () => {
    try {
      const position = await Geolocation.getCurrentPosition();
      const { latitude, longitude } = position.coords;
      setCurrentPosition(new Coordinate(latitude, longitude));
    } catch (error) {
      console.error("Error getting current position:", error);
    }
  };

  // Fetch the current position when the component mounts
  useEffect(() => {
    getCurrentPosition();
  }, []);

  // Listen for click events and update the destination
  useEffect(() => {
    mapView.on("click", (event) => {
      console.log("Clicked on", event.coordinate);
      setDestination(event.coordinate); // Set destination to clicked coordinate
    });
  }, [mapView]);

  // If both current position and destination are set, get directions
  const directions =
    currentPosition && destination
      ? mapView.getDirections(currentPosition, destination)
      : null;

  return directions ? <Navigation directions={directions} /> : null;
}
