import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setCountryName, setCovidData } from "../../store/slice/covidSlice";

import Loading from "../Loading/Loading";

function Search() {
  const [country, setCountry] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setLoading(true);
      //! Validar si lo ingresado en el input es un país
      const urlValidate = `https://restcountries.com/v3.1/name/${country}`;
      const countryDataResponse = await fetch(urlValidate);
      if (!countryDataResponse.ok) {
        throw new Error("Error en API de validación de país");
      }
      const countryData = await countryDataResponse.json();
      const countryCode = countryData[0].name.common;
      dispatch(setCountryName(countryCode));
      //! Obtener los datos de COVID del país
      const urlCovid = `https://api.covid19api.com/total/country/${countryCode}`;
      const covidDataResponse = await fetch(urlCovid);

      if (!covidDataResponse.ok) {
        throw new Error("Error en API de datos de COVID");
      }

      const covidData = await covidDataResponse.json();
      const casesTotal = covidData[covidData.length - 1].Confirmed;
      const deathsTotal = covidData[covidData.length - 1].Deaths;
      const generateColor = (deaths, cases) => {
        const percentage = (deaths / cases) * 100;
        if (percentage < 1) {
          return "green";
        } else if (percentage >= 1 && percentage < 5) {
          return "yellow";
        } else if (percentage >= 5 && percentage < 10) {
          return "orange";
        } else if (percentage >= 10) {
          return "red";
        }
      };
      const color = generateColor(deathsTotal, casesTotal);
      const covidObj = {
        casesTotal: casesTotal,
        deathsTotal: deathsTotal,
        colorState: color,
      };
      dispatch(setCovidData(covidObj));

      /*
      //! Obtener los límites del país
      const limitDataResponse = await fetch(
        `https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson`
      );
      if (!limitDataResponse.ok) {
        throw new Error("Error en API de límites de país");
      }
      const limitData = await limitDataResponse.json();

      const countryGeoJSON = limitData.features.find(
        (feature) => feature.properties.name === countryCode
      );
      
      //countryGeoJSON.properties.color = color;
*/
      setLoading(false);
    } catch (error) {
      // Manejar el error de cada API por separado
      console.error(error);
      if (error.message === "Error en API de validación de país") {
        setError("País no encontrado");
      } else if (error.message === "Error en API de datos de COVID") {
        setError("No se encontró información de COVID para el país ingresado");
      } else if (error.message === "Error en API de límites de país") {
        setError(
          "No se encontró información de límites para el país ingresado"
        );
      } else if (error.message === "Failed to fetch") {
        setError("No se pudo conectar con la API");
      }
    }
  };

  const handleCountryChange = (e) => {
    setCountry(e.target.value);
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold mb-8">Search country</h1>
      <form onSubmit={handleSubmit} className="flex items-center">
        <input
          type="text"
          className="py-2 px-4 rounded-l-lg border-t mr-0 border-b border-l text-gray-800 border-gray-200 bg-white"
          placeholder="Search country"
          onChange={handleCountryChange}
          value={country}
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r-lg ml-2"
        >
          Search
        </button>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {loading && <Loading />}
    </div>
  );
}

export default Search;
