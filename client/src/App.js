import React from "react";
import traverseMap from "./helpers/traverseMap";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        Maze
        <button onClick={traverseMap}>Traverse Map</button>
      </header>
    </div>
  );
}

export default App;
