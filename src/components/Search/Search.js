import { useState } from "react";

function Search(props) {
  const [country, setCountry] = useState("");
  const [error, setError] = useState("");

  const [countryData, setCountryData] = useState({
    country: "",
    totalCases: "",
    totalDeaths: "",
  });

  console.log(countryData);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Verificar si el valor ingresado es un país
      const urlCovid = `https://api.covid19api.com/total/country/${country}`;
      const covidDataResponse = await fetch(urlCovid);

      if (!covidDataResponse.ok || covidDataResponse.status === 404) {
        throw new Error("Error en API de datos de COVID");
      }

      const covidData = await covidDataResponse.json();

      if (covidData.length > 1) {
        setCountryData({
          country: covidData[covidData.length - 1].Country,
          totalCases: covidData[covidData.length - 1].Confirmed,
          totalDeaths: covidData[covidData.length - 1].Deaths,
        });
      }

      // Obtener los límites del país
      console.log(-0)
      const countryCode = covidData[covidData.length - 1].Country.toLowerCase();
      const limitDataResponse = await fetch(
       ` https://restcountries.com/v2/alpha/${countryCode}`
      );
      console.log("0", limitDataResponse);
      if (!limitDataResponse.ok) {
        throw new Error("Error en API de límites de país");
      }

      const limitData = await limitDataResponse.json();
      console.log(limitData);
      // Calcular el riesgo basado en los casos totales y el número de muertes
      const totalCases = countryData[0].cases;
      const totalDeaths = countryData[0].deaths;
      const combinedValue = totalCases * 0.7 + totalDeaths * 0.3; // 70% weight to total cases, 30% weight to total deaths

      // Generar un color basado en el riesgo calculado
      const color = generateColor(combinedValue);

      // Crear el objeto con los datos del país
      const countryDataObject = {
        name: countryData[0].name,
        lat: limitData.latlng[0],
        long: limitData.latlng[1],
        color: color,
      };

      // Enviar los datos del país al componente padre
      props.onSearch(countryDataObject);
    } catch (error) {
      // Manejar el error de cada API por separado
      console.error(error);
      if (error.message === "Error en API de datos de COVID") {
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

  const generateColor = (partial, total) => {
    const percentage = (partial * 100) / total;
    const hue = (percentage * 120) / 100;
    console.log(`hsl(${hue}, 100%, 50%)`);
    return `hsl(${hue}, 100%, 50%)`;
  };

  return (
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
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r-lg"
      >
        Search
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
}

export default Search;
