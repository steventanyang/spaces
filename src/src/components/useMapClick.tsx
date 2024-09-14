import {
  E_SDK_EVENT,
  E_SDK_EVENT_PAYLOAD,
  MapView,
} from "@mappedin/mappedin-js";
import { createContext, useCallback, useContext, useEffect } from "react";
import { GlobalContext } from '../GlobalContext';

export function useMapClick(
  mapView: MapView | undefined,
  onClick: (payload: E_SDK_EVENT_PAYLOAD[E_SDK_EVENT.CLICK]) => void
) {
  const { globalState, setGlobalState } = useContext(GlobalContext);

  const handleClick = useCallback(
    (payload: E_SDK_EVENT_PAYLOAD[E_SDK_EVENT.CLICK]) => {
      onClick(payload);
      console.log("clicked", payload);
      setGlobalState(payload.position.latitude);
    },
    [onClick]
  );

  // Subscribe to E_SDK_EVENT.CLICK
  useEffect(() => {
    if (mapView == null) {
      return;
    }

    mapView.on(E_SDK_EVENT.CLICK, handleClick);

    // Cleanup
    return () => {
      mapView.off(E_SDK_EVENT.CLICK, handleClick);
    };
  }, [mapView, handleClick]);
}
