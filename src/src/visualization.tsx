import { useMappedin } from "./components/mappedin-react";
import { createHeatmapLayer, generateRandomPoints } from "./lib/utils";
import { Feature, FeatureCollection, Point } from "@mappedin/mappedin-js";
import { useEffect } from "react";
import { data } from "./data";

export default function Visualization() {
  const { deck, mapView } = useMappedin();
  useEffect(() => {
    if (!deck || !mapView) return;

    const pointLocations: FeatureCollection<Point> = {
      type: "FeatureCollection",
      features: [],
    };

    /* Used to create fake data that is stored in
    mapView.on("click", (e) => {
      const points: Feature<Point>[] = generateRandomPoints(
        e.coordinate.longitude,
        e.coordinate.latitude,
        30,
        20
      ).map((p) => ({
        type: "Feature",
        properties: {},
        geometry: {
          type: "Point",
          coordinates: p,
        },
      }));

      pointLocations.features.push(...points);
      // console.log(pointLocations);
      console.log(JSON.stringify(pointLocations));
      deck.setProps({
        layers: [
          createHeatmapLayer(
            pointLocations
          ) 
        ],
      });
    });
    */
    // deck.setProps({
    //   layers: [createHeatmapLayer(data)],
    // });
  }, [deck, mapView]);
  return null;
}
