import React, { useEffect, useState } from 'react';
import { Map, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const MapViewLimits = ({ countryName, limitData, color, totalDeaths, totalCases }) => {
  const [state, setState] = useState({
    geojsonData: null,
    currentLocation: [51.505, -0.09],
    zoom: 3,
  });

  console.log("🦇 ~ file: MapViewLimits.js:43 ~ useEffect ~ countryName", countryName);
  console.log("🦇 ~ file: MapViewLimits.js:44 ~ useEffect ~ limitData", limitData);
  console.log("🦇 ~ file: MapViewLimits.js:45 ~ useEffect ~ color", color);
   console.log("🦇 ~ file: MapViewLimits.js:46 ~ useEffect ~ totalDeaths", totalDeaths);
  console.log("🦇 ~ file: MapViewLimits.js:47 ~ useEffect ~ totalCases", totalCases);
  useEffect(() => {

    if (limitData) {
      const geojsonData = {
        type: "Feature",
        properties: {
          name: countryName,
          totalCases,
          totalDeaths,
          color,
        },
        geometry: {
          type: "Polygon",
          coordinates: [[limitData]],
        },
      };
      console.log("🦇 ~ file: MapViewLimits.js:33 ~ useEffect ~ geojsonData:", geojsonData)
      
      setState((prevState) => ({
        ...prevState,
        geojsonData,
      }));
    }
  }, [countryName, limitData, color, totalDeaths, totalCases]);

  /* const popupContent = `<h2>${countryName}</h2>
  <p>Total de casos: ${totalCases}</p>
  <p>Total de muertes: ${totalDeaths}</p>`; */
/* 
  const onRegionClick = (event) => {
    const layer = event.target;

    layer.bindPopup(popupContent);
    layer.openPopup();
  }; */

  return (
    <Map
      center={state.currentLocation}
      zoom={state.zoom}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
      />
      {state.geojsonData && (
        <GeoJSON
          key={state.geojsonData.properties.name}
          data={state.geojsonData.geometry}
          style={{
            fillColor: state.geojsonData.properties.color,
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8,
          }}
          /* onEachFeature={(feature, layer) => {
            layer.on({
              click: (e) => onRegionClick(e),
            });
          }} */
        />
      )}
    </Map>
  )
}

export default MapViewLimits;
