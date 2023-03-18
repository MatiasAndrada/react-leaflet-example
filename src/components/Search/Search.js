import { useState } from "react";

function Search(props) {
  const [country, setCountry] = useState("");
  const [error, setError] = useState("");

  const [countryData, setCountryData] = useState({
    country: "",
    totalCases: "",
    totalDeaths: "",
    colorState: "",
    limitData: {},
  });
  console.log("🦇 ~ file: Search.js:14 ~ Search ~ countryData:", countryData)

/*     console.log(countryData); */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Validar si lo ingresado en el input es un país
      const urlValidate = `https://restcountries.com/v3.1/name/${country}`;
      const countryDataResponse = await fetch(urlValidate);
      if (!countryDataResponse.ok) {
        throw new Error("Error en API de validación de país");
      }
      const countryData = await countryDataResponse.json();
      const countryCode  = countryData[0].name.common;
      console.log("🦇 ~ file: Search.js:30 ~ handleSubmit ~ countryCode:", countryCode)


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
