import React, { useState, useEffect } from "react";
import { Map, TileLayer, GeoJSON } from "react-leaflet";
import data from "../../assets/data.json";
import Markers from "./VenueMarkers";
import { useLocation, useHistory } from "react-router-dom";
import "leaflet/dist/leaflet.css";

const MapView = (props) => {
  const [state, setState] = useState({
    currentLocation: {
      lat: 40.416775,
      lng: -3.70379,
    },
    zoom: 13,
    data,
  });

  const location = useLocation();
  const history = useHistory();

  const spainGeoJSON = {
    type: "Feature",
    properties: {
      name: "Spain",
      amenity: "Country",
      popupContent: "I am a polygon!",
    },
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [-9.39288330078125, 35.946850091796875],
          [-6.38916015625, 43.748779296875],
          [2.724609375, 43.748779296875],
          [3.515625, 35.1171875],
          [-9.39288330078125, 35.946850091796875],
        ],
      ],
    },
  };

  useEffect(() => {
    if (location.state.latitude && location.state.longitude) {
      const currentLocation = {
        lat: location.state.latitude,
        lng: location.state.longitude,
      };
      setState((prevState) => ({
        ...prevState,
        currentLocation,
      }));
      history.replace({
        pathname: "/map",
        state: {},
      });
    }
  }, [location, history]);

  return (
    <Map center={state.currentLocation} zoom={state.zoom}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      <Markers venues={state.data.venues} />

      <GeoJSON data={spainGeoJSON} style={{ color: "red", fillColor: "red" }} />
    </Map>
  );
};

export default MapView;
