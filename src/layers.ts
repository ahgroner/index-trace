// Toggle on/off layers in the map - use this for baked in Mapbox layers, 

import { useEffect, useState } from "react";

// custom data layers are controlled via React state and Source/Layer components
export const layerVisibility = {
    "place-": false,  // All city/town related labels
    "state-": false,      // State related labels
    "water": true,       // Water feature labels
    "poi": false,        // Points of interest
    "road": true,        // Road labels
  };
  
  export const setLayerVisibility = (map: mapboxgl.Map, layerVisibilityRules: Record<string, boolean>) => {
    // Get all layers from the map
    const mapLayers = map.getStyle().layers;
  
    // Debug: Log all layer IDs
    // console.log("All map layers:", mapLayers.map(l => l.id));
  
    // For each visibility rule
    Object.entries(layerVisibilityRules).forEach(([prefix, isVisible]) => {
      // Debug: Log which layers we're affecting
    //   const matchingLayers = mapLayers
    //     .filter(layer => layer.id.includes(prefix))
    //     .map(l => l.id);
    //   console.log(`Layers matching '${prefix}':`, matchingLayers);
  
      // Find and update all layers that start with this prefix
      mapLayers.forEach(layer => {
        if (layer.id.includes(prefix)) {
          map.setLayoutProperty(
            layer.id,
            "visibility",
            isVisible ? "visible" : "none"
          );
        }
      });
    });
  };


export const useLayerVisibility = (map: mapboxgl.Map | null) => {
    const [visibility, setVisibility] = useState(layerVisibility);
    useEffect(() => {
      if(map) {
        setLayerVisibility(map, visibility);
      }
    }, [map, visibility]);
  
    return [visibility, setVisibility] as const
}