import React from "react";
import traverseMap from "./helpers/traverseMap";
import travelTo from "./helpers/travelTo";
import startGoldFarming from "./helpers/startGoldFarming";

import Sidebar from './components/sidebar/Sidebar.js';
import Map from './components/map/Map.js';

function App() {
  function askTravelTo() {
    const roomID = window.prompt("Room ID:");
    travelTo(roomID);
  }

  return (
    <div className="App">
      <h1 className="title">Treasure Hunter</h1>
      <section className="main-section">
        <Map />
        <Sidebar />
      </section>
      
      <header className="App-header">
        Maze
        <button onClick={traverseMap} style={{ marginRight: '15px' }}>Traverse Map</button>
        <button onClick={askTravelTo} style={{ marginRight: '15px' }}>Go To Room</button>
        <button onClick={startGoldFarming}>Start Gold Farming</button>
      </header>
    </div>
  );
}

export default App;
