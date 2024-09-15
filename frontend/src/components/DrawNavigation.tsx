import { Navigation, useMap } from "@mappedin/react-sdk";

export default function DrawNavigation() {
  const { mapData, mapView } = useMap();
  const space1 = mapData.getByType("space")[0];
  const space2 = mapData.getByType("space")[103];
  const directions = mapView.getDirections(space1, space2);
  return directions ? <Navigation directions={directions} /> : null;
}
