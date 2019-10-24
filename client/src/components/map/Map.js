import React from "react";
import "./Map.scss";

import mapData from "../../helpers/map.json";

let mapMatrix = [];
for (let i = 0; i < 29; i++) {
  let row = [];
  for (var j = 0; j < 32; j++) {
    row.push(null);
  }
  mapMatrix.push(row);
}

for (var room in mapData) {
  let x = parseInt(mapData[room].coordinates.slice(1, 3));
  let y = parseInt(mapData[room].coordinates.slice(4, 6));
  mapMatrix[y - 46][x - 46] = mapData[room];
}

mapMatrix.reverse();

let classes = "";

let specialRooms = {
  shrines: new Set([22, 461, 499]),
  well: 55,
  shop: 1,
  pirateRy: 467,
  transmogri: 495
};

function hasExits(room) {
  classes = "room";

  if (room) {
    let { exits, description, title, room_id, items } = room;

    exits.includes("n") && (classes += " north");
    exits.includes("e") && (classes += " east");
    exits.includes("s") && (classes += " south");
    exits.includes("w") && (classes += " west");
    specialRooms.well === room_id && (classes += " well");
    specialRooms.shrines.has(room_id) && (classes += " shrine");
    specialRooms.shop === room_id && (classes += " shop");
    specialRooms.transmogri === room_id && (classes += " transmogri");
    specialRooms.pirateRy === room_id && (classes += " pirate");
    // room.room_id === 356 && (classes += " mine");
    items.length > 0 && (classes += " treasure");
  } else {
    classes = "noroom";
  }
  return classes;
}

function Map() {
  return (
    <div className="Map pannel">
      <div className="translucent"></div>

      <div className="map-display">
        {mapMatrix.map(row => (
          <div className="row">
            {row.map(room => (
              <div className={hasExits(room)}>{room && room.room_id}</div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Map;
