import React from "react";


import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Home from "./components/Home";
import Search from './components/Search/Search'
import MapView from "./components/Maps/MapView"; 
import MapViewLimits from "./components/Maps/MapViewLimits";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/map">
          <MapView />
        </Route>
        <Route path="/">
          <Home />
          <Search />
          <MapViewLimits/>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
