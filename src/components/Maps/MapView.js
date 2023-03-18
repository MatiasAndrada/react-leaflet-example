import React, { useState, useEffect } from "react";
import { Map, TileLayer, /* GeoJSON */ } from "react-leaflet";
import data from "../../assets/data.json";
import Markers from "./VenueMarkers";
import { useLocation, useHistory } from "react-router-dom";
import "leaflet/dist/leaflet.css";

const MapView = (props) => {
  const [state, setState] = useState({
    currentLocation: { lat: 52.52437, lng: 13.41053 },
    zoom: 13,
    data,
  });
 
  const location = useLocation();
  const history = useHistory();
  


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
{/* 
      <GeoJSON data={spainGeoJSON} style={{ color: 'red', fillColor: 'red' }} /> */}

    </Map>
  );
};

export default MapView;
