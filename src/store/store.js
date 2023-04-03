
import { configureStore } from "@reduxjs/toolkit";
import covidSlice from './slice/covidSlice'

export default configureStore({
    reducer: {
        covid: covidSlice
    }
})




