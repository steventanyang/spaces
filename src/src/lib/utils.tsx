import { HeatmapLayer } from "@deck.gl/aggregation-layers";
import { ScatterplotLayer } from "@deck.gl/layers";
import { FeatureCollection } from "@mappedin/mappedin-js";

import { type ClassValue, clsx } from "clsx";

export async function getPublicFileJson(file: string) {
  return (await fetch(`${file}`)).json();
}

export async function getPublicFileCsv(file: string) {
  return (await fetch(`${file}`)).text();
}

export async function csvToJson(csv: string) {
  const lines = csv.split("\n");
  const headers = lines[0].split(",");
  const result = [];

  for (let i = 1; i < lines.length; i++) {
    const obj = {};
    const currentLine = lines[i].split(",");
    for (let j = 0; j < headers.length; j++) {
      (obj as Record<string, string>)[headers[j]] = currentLine[j];
    }

    result.push(obj as Record<string, string>);
  }

  return result;
}

export function generateRandomPoints(
  lng: number,
  lat: number,
  numPoints: number,
  radius: number
): [number, number][] {
  function randomNormal(): number {
    let u = 0,
      v = 0;
    while (u === 0) u = Math.random(); // Converting [0,1) to (0,1)
    while (v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  }

  function randomInRadius(): [number, number] {
    const r = radius * Math.sqrt(Math.random());
    const theta = Math.random() * 2 * Math.PI;
    const dx = r * Math.cos(theta);
    const dy = r * Math.sin(theta);
    return [dx, dy];
  }

  const points: [number, number][] = [];
  for (let i = 0; i < numPoints; i++) {
    const [dx, dy] = randomInRadius();
    const newLng = lng + dx / (111320 * Math.cos(lat * (Math.PI / 180)));
    const newLat = lat + dy / 110540;
    points.push([newLng, newLat]);
  }

  return points;
}

export function createScatterplotLayer(data: FeatureCollection) {
  const layer = new ScatterplotLayer({
    id: "scatterplot-layer" + Math.random().toFixed(4),
    data: data.features,
    pickable: false,
    opacity: 1,
    stroked: true,
    filled: true,
    radiusScale: 3,
    radiusMinPixels: 3,
    radiusMaxPixels: 5,
    lineWidthMinPixels: 1,
    getPosition: (d) => d.geometry.coordinates,
    getFillColor: (d) => [88, 196, 211],
    getLineColor: (d) => [12, 100, 67],
  });
  return layer;
}

export function createHeatmapLayer(data: FeatureCollection) {
  const layer = new HeatmapLayer({
    id: "HeatmapLayer" + Math.random().toFixed(4),
    data: data.features,
    aggregation: "SUM",
    getPosition: (d) => d.geometry.coordinates,
    getWeight: 1,
    radiusPixels: 50,
    intensity: 1,
    getPolygonOffset: ({ layerIndex }) => [0, -layerIndex * 500],
  });
  return layer;
}
