import { useState, useEffect } from "react";
import Loading from "../Loading/Loading";
import MapViewLimits from "../Maps/MapViewLimits";

function Search() {
  const [loading, setLoading] = useState(false);
  const [country, setCountry] = useState("");
  const [error, setError] = useState("");

  const [countryData, setCountryData] = useState({
    country: "",
    totalCases: "",
    totalDeaths: "",
    colorState: "",
    limitData: {},
  });
  console.log("🦇 ~ file: Search.js:17 ~ Search ~ countryData:", countryData)
  useEffect(() => {
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

    if (countryData.totalCases && countryData.totalDeaths) {
      const color = generateColor(
        countryData.totalDeaths,
        countryData.totalCases
      );
      setCountryData((prevState) => ({
        ...prevState,
        colorState: color,
      }));
    }
  }, [countryData.totalCases, countryData.totalDeaths]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setLoading(true);
      // Validar si lo ingresado en el input es un país
      const urlValidate = `https://restcountries.com/v3.1/name/${country}`;
      const countryDataResponse = await fetch(urlValidate);
      if (!countryDataResponse.ok) {
        throw new Error("Error en API de validación de país");
      }
      const countryData = await countryDataResponse.json();
      const countryCode = countryData[0].name.common;

      // Obtener los datos de COVID del país
      const urlCovid = `https://api.covid19api.com/total/country/${countryCode}`;
      const covidDataResponse = await fetch(urlCovid);

      if (!covidDataResponse.ok) {
        throw new Error("Error en API de datos de COVID");
      }

      const covidData = await covidDataResponse.json();

      if (covidData.length > 1) {
        const casesTotal = covidData[covidData.length - 1].Confirmed;
        const deathsTotal = covidData[covidData.length - 1].Deaths;

        setCountryData((prevState) => ({
          ...prevState,
          country: countryCode,
          totalCases: casesTotal,
          totalDeaths: deathsTotal,
        }));
      }

      // Obtener los límites del país
      const limitDataResponse = await fetch(
        `https://nominatim.openstreetmap.org/search.php?q=${countryCode}&format=geojson&polygon_geojson=1`
      );
      if (!limitDataResponse.ok) {
        throw new Error("Error en API de límites de país");
      }
      const limitData = await limitDataResponse.json();
      setCountryData((prevState) => ({
        ...prevState,
        limitData: limitData,
      }));
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
    <div className="flex flex-col justify-center items-center h-screen">
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
      {countryData.country && countryData.limitData && countryData.colorState && countryData.totalCases && countryData.totalDeaths && (
        <MapViewLimits countryName={countryData.country} limitData={countryData.limitData} color={countryData.colorState} totalCases={countryData.totalCases} totalDeaths={countryData.totalDeaths}/>
      )}

    </div>
  );
}

export default Search;
