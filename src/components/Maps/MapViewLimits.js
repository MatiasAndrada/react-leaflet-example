import React, { useState } from "react";
import * as turf from "@turf/turf";
import { Map, TileLayer, GeoJSON } from "react-leaflet";
import { useDispatch, useSelector } from "react-redux";
import { setGeoJson } from "../../store/slice/covidSlice";

const MapViewLimits = () => {
  const { countryName, geoJson } = useSelector((state) => state.covid);
  console.log(countryName, geoJson);
  // const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const getCountryGeoJSON = async (countryName) => {
    // Cargar el archivo GeoJSON con los límites de los países
    const response = await fetch(
      "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"
    );
    const worldData = await response.json();

    // Filtrar los datos para obtener solo los límites del país deseado
    const filteredData = turf.filter(worldData, "name", countryName);

    // Devolver el objeto GeoJSON con los límites del país
    return filteredData.features[0];
  };

  if (
    countryName !== "" &&
    (geoJson.length === 0) | (geoJson[0].properties.name !== countryName)
  ) {
    console.log("fetching geoJson");
    getCountryGeoJSON(countryName)
      .then((data) => {
        console.log("dataGE")
        dispatch(setGeoJson(data));
      })
      .catch((error) => {
        setError(error);
      });
  }

  return (
    <Map center={[0, 0]} zoom={2} className="w-90 h-screen">
      {error && <p>{error}</p>}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <GeoJSON
        data={geoJson}
        style={() => ({
          color: "red",
          weight: 1,
          fillColor: "blue",
          fillOpacity: 0.1,
        })}
      />
    </Map>
  );
};

export default MapViewLimits;
