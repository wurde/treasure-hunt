import React from "react";
import traverseMap from "./helpers/traverseMap";
import { generatePath } from "./helpers/util";
import Sidebar from "./components/sidebar/Sidebar.js";
import Map from "./components/map/Map.js";

function App() {
  return (
    <div className="App">
      <h1 className="title">Treasure Hunter</h1>
      <section className="main-section">
        <Map />
        <Sidebar />
      </section>

      <header className="App-header">
        Maze
        <button onClick={traverseMap}>Traverse Map</button>
        <button onClick={() => console.log(generatePath(499, 1))}>
          Generate path
        </button>
      </header>
    </div>
  );
}

export default App;
