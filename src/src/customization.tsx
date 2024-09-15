import { useMappedin } from "./components/mappedin-react";
import React, { useEffect } from "react";

// The existing names of some spaces.
const spaceNames = ["Sun Restaurant", "Pancake Stack", "Confectionary Goods"];
// Names of coffee shops to use instead of the existing space names.
const coffeeShops = ["Starbucks", "Tim Hortons", "Second Cup"];

export default function Customization() {
  const { mapData, mapView } = useMappedin();
  useEffect(() => {
    if (!mapView || !mapData) return;

    mapData.getByType("space").forEach((space) => {
      const index = spaceNames.findIndex((spaceName) =>
        space.name.includes(spaceName)
      );

      if (index !== -1) {
        mapView.Markers.add(
          space,
          `<div class="text-3xl pointer-events-none">☕ ${coffeeShops[index]}</div>`,
          {
            rank: "always-visible",
            anchor: "right",
            interactive: false,
          }
        );
      }
    });
  }, [mapData, mapView]);

  return null;
}
