import React from "react";
import "./App.css";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Home from "./components/Home";
import Search from './components/Search/Search'
import MapView from "./components/Maps/MapView";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/map">
          <MapView />;
        </Route>
        <Route path="/">
          <Home />
          <Search />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
