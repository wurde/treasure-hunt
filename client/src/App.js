import React from "react";
import traverseMap from "./helpers/traverseMap";
import travelTo from "./helpers/travelTo";
import startGoldFarming from "./helpers/startGoldFarming";
import Sidebar from './components/sidebar/Sidebar.js';
import Map from './components/map/Map.js';
import { generatePath } from "./helpers/util";

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

      <div>
        <button onClick={traverseMap} style={{ margin: '5px' }}>Traverse Map</button>
        <button onClick={askTravelTo} style={{ margin: '5px' }}>Go To Room</button>
        <button onClick={e => travelTo(1)} style={{ margin: '5px' }}>Go To Shop</button>
        <button onClick={e => travelTo(22)} style={{ margin: '5px' }}>Go To The Peak of Mt. Holloway</button>
        <button onClick={e => travelTo(55)} style={{ margin: '5px' }}>Go To Wishing Well</button>
        <button onClick={e => travelTo(461)} style={{ margin: '5px' }}>Go To Linh's Shrine</button>
        <button onClick={e => travelTo(467)} style={{ margin: '5px' }}>Go To Pirate Ry's</button>
        <button onClick={e => travelTo(495)} style={{ margin: '5px' }}>Go To The Transmogriphier</button>
        <button onClick={e => travelTo(499)} style={{ margin: '5px' }}>Go To Glasowyn's Grave</button>
        <button onClick={startGoldFarming} style={{ margin: '5px' }}>Start Gold Farming</button>
        <button onClick={() => console.log(generatePath(499, 1))}>
          Generate path
        </button>
      </div>
    </div>
  );
}

export default App;
