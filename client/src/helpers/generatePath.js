/**
 * Dependencies
 */

import map from "./map";

/**
 * Define helper
 */

function generatePath(startRoomID, destinationRoomID) {
  startRoomID = parseInt(startRoomID);
  destinationRoomID = parseInt(destinationRoomID);
  console.log(`From ${startRoomID} to ${destinationRoomID}`);

  const visited = new Set();
  const previousRooms = {};

  const queue = [];
  queue.push(startRoomID);

  // Traverse the maze using BFS until destinationRoomID found.
  while (queue.length > 0) {
    let currentRoomID = queue.shift();

    // Only handle rooms we haven't visited yet.
    if (!(visited.has(currentRoomID))) {
      visited.add(currentRoomID);

      if (currentRoomID === destinationRoomID) {
        let path = [];

        while (currentRoomID !== startRoomID) {
          path.push(currentRoomID);
          currentRoomID = previousRooms[currentRoomID];
        }
        path.push(startRoomID);

        for (let i = 0; i < path.length - 1; i++) {
          let roomAID = path[i + 1];
          let roomBID = path[i];
          let roomA = map[roomAID];
          
          if (roomA['n'] === roomBID) {
            path[i] = 'n';
          } else if (roomA['s'] === roomBID) {
            path[i] = 's';
          } else if (roomA['e'] === roomBID) {
            path[i] = 'e';
          } else if (roomA['w'] === roomBID) {
            path[i] = 'w';
          }
        }

        path.pop();
        path.reverse();

        return path;
      }

      // If not the destination then add adjacent rooms to the queue.
      const room = map[currentRoomID];
      for (let i = 0; i < room.exits.length; i++) {
        const adjacentRoomID = room[room.exits[i]];
        if (!(adjacentRoomID in previousRooms)) {
          previousRooms[adjacentRoomID] = currentRoomID;
        }
        queue.push(adjacentRoomID);
      }
    }
  }
}

/**
 * Export helper
 */

export default generatePath;
