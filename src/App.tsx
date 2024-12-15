import "./App.css";
import Map, { Layer, LayerProps, Source } from "react-map-gl";
import { Paper, Stack, Typography } from "@mui/material";
import "mapbox-gl/dist/mapbox-gl.css";

import statesGeoJSON from "./data/states/geo.json";
import { data as statesData } from "./data/states/data.json";

import { useState } from "react";
import { DataGrid, GridRowSelectionModel } from "@mui/x-data-grid";
import { useLayerVisibility } from "./layers";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoiaW5kZXh0cmFjZSIsImEiOiJjbTRwZmM1YmowdHNrMmtvZ2FsMTZpMDNxIn0.xEDA1jg4rntFk9UglfSRVg";

const STATES_LAYER: LayerProps = {
  id: "data_layer_state",
  type: "fill",
  paint: {
    "fill-color": "#ff0000",
    "fill-opacity": 0.2,
  }
};

export const App = () => {
  const [showDataDrawer, setShowDataDrawer] = useState<boolean>(true);
  const [selectedStates, setSelectedStates] = useState<string[]>(statesData.map((state) => state.id));

  const [map, setMap] = useState<mapboxgl.Map | null>(null);


  useLayerVisibility(map);
  const handleSelectionChange = (newSelection: GridRowSelectionModel) => {
    setSelectedStates(newSelection.map(id => id.toString()));
  };

  return (
    <Stack direction="row">
      <Map
        onLoad={(event) => setMap(event.target)}
        initialViewState={{
          longitude: -100,
          latitude: 40,
          zoom: 3.5,
        }}
        style={{ width: "100vw", height: "100vh" }}
        mapStyle="mapbox://styles/mapbox/dark-v9"
        mapboxAccessToken={MAPBOX_TOKEN}
      >
        <Source
          id="states"
          type="geojson"
          data={statesGeoJSON as GeoJSON.FeatureCollection}
        >
          <Layer 
            {...STATES_LAYER} 
            filter={["in", ["get", "name"], ["literal", selectedStates]]}
          />
        </Source>
      </Map>
      {showDataDrawer && (
        <Paper sx={{ overflow: "auto", maxHeight: "100vh", width: "500px", alignItems: 'flex-start' }}>
          <Typography variant="h6">States</Typography>
          <Stack maxHeight={400}>
            <DataGrid
              rowHeight={30}
              rows={statesData}
              columns={[{ field: "id", headerName: "Name", width: 130 }]}
              pageSizeOptions={[5, 10]}
              checkboxSelection
              sx={{ border: 0 }}
              rowSelectionModel={selectedStates}
              onRowSelectionModelChange={handleSelectionChange}
            />
          </Stack>
        </Paper>
      )}
    </Stack>
  );
};