import { configureStore } from "redux";
import covidSlice from "./slice/covidSlice";

const store = configureStore({
  reducer: {
    covid: covidSlice.reducer,
  },
});

export default store;
