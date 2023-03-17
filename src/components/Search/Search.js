import { useState } from "react";

function Search(props) {
  const [country, setCountry] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Verificar si el valor ingresado es un país
      const countryDataResponse = await fetch(
        `https://corona.lmao.ninja/v2/countries/${country}`
      );
      const countryData = await countryDataResponse.json();
      console.log("0", countryData);

      if (countryData.message) {
        throw new Error("País no encontrado");
      }

      // Obtener los límites del país
        const countryCode = countryData.countryInfo.iso2.toLowerCase();
      console.log("code", countryCode);
      const limitDataResponse = await fetch(
        `https://restcountries.com/v2/alpha/${countryCode}`
      );
      const limitData = await limitDataResponse.json();
      console.log("1", limitData);

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
      setError("Invalid country");
    }
  };

  const handleCountryChange = (e) => {
    setCountry(e.target.value);
  };

  const generateColor = (partial, total) => {
    const percentage = (partial * 100) / total;
    const hue = (percentage * 120) / 100;
    console.log(
        `hsl(${hue}, 100%, 50%)`,
    )
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
