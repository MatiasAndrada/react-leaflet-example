import React, { useEffect, useState } from 'react';
import { Map, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const MapViewLimits = ({ countryName, limitData, color, covidData }) => {
  const [state, setState] = useState({
    currentLocation: {
      lat: 40.416775,
      lng: -3.70379,
    },
    zoom: 13,
    geojsonData: null
  });

    useEffect(() => {
        setState((prevState) => ({
            ...prevState,
            geojsonData: limitData
        }));
    }, [limitData]);



  const onRegionClick = (event) => {
    const layer = event.target;
    const { cases, deaths } = covidData[layer.feature.properties.name];
    const popupContent = `<div><strong>${layer.feature.properties.name}</strong></div>
                          <div>Casos: ${cases}</div>
                          <div>Muertes: ${deaths}</div>`;
    layer.bindPopup(popupContent);
    layer.openPopup();
  };

  return (
    <div>
      {state.geojsonData && (
        <Map center={state.currentLocation} zoom={state.zoom}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          <GeoJSON
            data={state.geojsonData}
            style={{ color }}
            onClick={onRegionClick}
          />
        </Map>
      )}
    </div>
  )
}

export default MapViewLimits;
