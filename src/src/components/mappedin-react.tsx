import { MapboxOverlay } from "@deck.gl/mapbox";
import {
  Coordinate,
  getMapData,
  MapData,
  MapView,
  Marker,
  show3dMap,
  TAddMarkerOptions,
} from "@mappedin/mappedin-js";
import "@mappedin/mappedin-js/lib/index.css";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import "./mapStyles.css";

export default function Map() {
  const { mapEl } = useMappedin();
  return <div id="mappedin-map" ref={mapEl}></div>;
}

type MappedinContext = {
  mapView: MapView | undefined;
  mapData: MapData | undefined;
  mapEl: React.MutableRefObject<HTMLDivElement | null>;
  deck: MapboxOverlay | undefined;
};
const MappedinContext = createContext<MappedinContext>({
  mapView: undefined,
  mapData: undefined,
  mapEl: { current: null },
  deck: undefined,
});

type GetMapDataOptions = {
  mapKey: string;
  mapSecret: string;
  mapId: string;
};

type MappedinProps = GetMapDataOptions & {
  children: Readonly<React.ReactNode>;
};
export function Mappedin(props: MappedinProps) {
  const mapEl = useRef(null);
  const [mapView, setMapView] = useState<MapView | undefined>(undefined);
  const [mapData, setMapData] = useState<MapData | undefined>(undefined);
  const [deck, setDeck] = useState<MapboxOverlay | undefined>(undefined);
  const renderInProgress = useRef(false);

  useEffect(() => {
    async function init() {
      renderInProgress.current = true;
      if (!mapEl.current || mapView) {
        renderInProgress.current = false;
        return;
      }

      let _mapData: MapData;

      const { mapKey, mapSecret, mapId } = props;
      _mapData = await getMapData({
        key: mapKey,
        secret: mapSecret,
        mapId,
      });

      setMapData(_mapData);

      const _mapView = await show3dMap(mapEl.current, _mapData, {
        outdoorView: {
          token: "MuaG47ckVGhywd",
        },
      });
      setMapView(_mapView);

      const deck = new MapboxOverlay({
        interleaved: true,
      });
      _mapView.Outdoor.map.addControl(deck);
      setDeck(deck);
      renderInProgress.current = false;
    }
    if (!renderInProgress.current) {
      init();
    }
  }, [mapEl.current, props]);

  return (
    <MappedinContext.Provider value={{ mapView, mapData, mapEl, deck }}>
      {props.children}
    </MappedinContext.Provider>
  );
}

export function useMappedin() {
  return useContext(MappedinContext);
}

export function MarkerReact({
  coordinate,
  options,
  children,
}: {
  coordinate: Coordinate;
  options: TAddMarkerOptions;
  children?: React.ReactNode;
}) {
  const { mapView } = useMappedin();
  const [internalMarker, setInternalMarker] = useState<Marker | undefined>(
    undefined
  );

  useEffect(() => {
    if (!mapView) return;

    const _marker = mapView.Markers.add(coordinate, "<div></div>", {
      ...options,
      dynamicResize: true,
    });
    setInternalMarker(_marker);

    return () => {
      if (_marker) mapView.Markers.remove(_marker);
    };
  }, [coordinate, options, children, mapView]);

  if (!internalMarker) return null;
  return createPortal(children, internalMarker.contentEl);
}
