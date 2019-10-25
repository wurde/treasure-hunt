/**
 * Dependencies
 */

import React from "react";
import "./Map.scss";
import mapData from "../../helpers/map";

/**
 * Build map matrix
 */

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

let specialRooms = {
  shrines: new Set([22, 461, 499]),
  well: 55,
  shop: 1,
  pirateRy: 467,
  transmogri: 495,
  traps: new Set([242, 302, 339, 361, 415, 422, 426, 457])
};

const setSelectedRoom = e => {
  e.persist();
  localStorage.setItem("selectedRoom", e.target.innerHTML);
};

function hasExits(room) {
  let classes = "room";

  if (room) {
    let { exits, room_id, items } = room;

    exits.includes("n") && (classes += " north");
    exits.includes("e") && (classes += " east");
    exits.includes("s") && (classes += " south");
    exits.includes("w") && (classes += " west");
    specialRooms.well === room_id && (classes += " well");
    specialRooms.shrines.has(room_id) && (classes += " shrine");
    specialRooms.shop === room_id && (classes += " shop");
    specialRooms.transmogri === room_id && (classes += " transmogri");
    specialRooms.pirateRy === room_id && (classes += " pirate");
    specialRooms.traps.has(room_id) && (classes += " trap");
    // room.room_id === 356 && (classes += " mine");
    items.length > 0 && (classes += " treasure");
    return { classes, room_id };
  } else {
    classes = "noroom";
    return { classes };
  }
}

const Map = ({ setSelectedRoom }) => {
  return (
    <div className="Map pannel">
      <div className="translucent"></div>

      <div className="map-display">
        {mapMatrix.map(row => (
          <div className="row">
            {row.map(room => (
              <div
                className={hasExits(room).classes}
                value={hasExits(room).room_id}
                onClick={e => setSelectedRoom(e)}
              >
                {room && room.room_id}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Export component
 */

export default Map;
