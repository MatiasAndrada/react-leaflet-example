import { useState } from "react";
import Loading from "../Loading/Loading";

function Search(props) {
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
  console.log("🦇 ~ file: Search.js:14 ~ Search ~ countryData:", countryData);

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
      console.log(
        "🦇 ~ file: Search.js:30 ~ handleSubmit ~ countryCode:",
        countryCode
      );

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
        // Calcular el color del país en base a los casos y muertes
        const color = generateColor(deathsTotal, casesTotal);

        setCountryData((prevState) => ({
          ...prevState,
          country: countryCode,
          totalCases: casesTotal,
          totalDeaths: deathsTotal,
          colorState: color,
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
        limitData: limitData.features[0].geometry.coordinates[0],
      }));

      /*       props.onSearch(countryDataObject); */
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

  const generateColor = (deaths, cases) => {
    const deathRate = deaths / cases;
    console.log(
      "🦇 ~ file: Search.js:88 ~ generateColor ~ deathRate:",
      deathRate
    );
    let color;

    if (deathRate <= 0.01) {
      color = "green"; // si la tasa es menor o igual a 1%, verde
    } else if (deathRate <= 0.03) {
      color = "yellow"; // si la tasa es menor o igual a 3%, amarillo
    } else if (deathRate <= 0.06) {
      color = "orange"; // si la tasa es menor o igual a 6%, naranja
    } else {
      color = "red"; // si la tasa es mayor a 6%, rojo
    }

    return color;
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
      {countryData.country && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">
            {countryData.country} - {countryData.colorState}
          </h2>
          <p className="text-lg">
            Total cases: {countryData.totalCases} - Total deaths: {countryData.totalDeaths}
          </p>
        </div>
      )}
      // Aquí se renderiza el mapa
      {countryData.limitData.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Map</h2>
          <div className="w-96 h-96">
            <Map
              center={[0, 0]}
              zoom={2}
              style={{ width: "100%", height: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Polygon
                positions={countryData.limitData}
                color={countryData.colorState}
              />
            </Map>
        </div>
    </div>
  );
};




export default Search;
