import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  countryName: "",
  covidData: {},
  geoJson: [
    {
      type: "Feature",
      properties: {
        name: "",
      },
    },
  ],
};

const covidSlice = createSlice({
  name: "covid",
  initialState,
  reducers: {
    setCountryName(state, action) {
      state.countryName = action.payload;
    },
    setCovidData(state, action) {
      state.covidData = action.payload;
    },
    setGeoJson(state, action) {
      state.geoJson = action.payload;
    },
  },
});

export const { setCountryName, setCovidData, setGeoJson, setState } =
  covidSlice.actions;

export default covidSlice.reducer;
