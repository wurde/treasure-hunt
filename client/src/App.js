/**
 * Dependencies
 */

import React from "react";
import CheatCodes from './components/cheat-codes/CheatCodes';
import Sidebar from './components/sidebar/Sidebar';
import Map from './components/map/Map';

/**
 * Define component
 */

function App() {
  return (
    <div className="App">
      <h1 className="title">Treasure Hunter</h1>
      <section className="section">
        <Map />
        <Sidebar />
      </section>

      <section className="section">
        <CheatCodes />
      </section>
    </div>
  );
}

/**
 * Export component
 */

export default App;
