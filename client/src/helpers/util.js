import map from "./map";
import axiosWithAuth from "./axiosWithAuth";
import { baseUrl } from "./constants";

const wait = seconds => {
  let makeMS = seconds * 1000;
  return new Promise((res, rej) => setTimeout(res, makeMS));
};

const pickItem = async (prevRoom) => {
  if (Object.keys(prevRoom.items).length === 0) {
    return false;
  }

  try {
    // Get current player status
    const playerStatus = await axiosWithAuth().post(`${baseUrl}/api/adv/status`);
    await wait(playerStatus.data.cooldown);
    let encumbrance = playerStatus.data.encumbrance;

    const uniqItems = Array.from(new Set(prevRoom.items));
    for (let i = 0; i < uniqItems.length; i++) {
      const item = uniqItems[i];
      // inspect item
      const itemStatus = await axiosWithAuth().post(`${baseUrl}/api/adv/examine`, { "name": item });
      await wait(itemStatus.data.cooldown);

      // Check if item weight will exceed player strength if picked up
      const weightAllowance = playerStatus.data.strength - encumbrance - 1
      const itemWeight = itemStatus.data.weight
      if (itemWeight > weightAllowance) {
        // do traversal to shop
        // sell items
        continue
      } else {
        if (i > 0) {
          encumbrance += itemStatus.data.weight;
        }

        const takeStatus = await axiosWithAuth().post(`${baseUrl}/api/adv/take`, { "name": item });
        await wait(takeStatus.data.cooldown);
      }
    }

    // If pickup item.
    return true
  } catch(err) {
    console.log(err)
    return false
  }
};

const generatePath = (startRoomID, destinationRoomID) => {
  const visited = new Set();
  const previousRooms = {};

  const queue = [];  
  queue.push(startRoomID);

  while(queue.length > 0) {
    const roomID = queue.shift();
    
    if (!(visited.has(roomID))) {
      visited.add(roomID);

      if (roomID === destinationRoomID) {
        let currentRoomID = destinationRoomID;
        let path = [];
        
        while (currentRoomID !== startRoomID) {
          path.push(currentRoomID);
          currentRoomID = previousRooms[currentRoomID];
        }
        path.push(startRoomID);

        for (let i = 0; i < path.length - 1; i++) {
          let roomAID = path[i];
          let roomBID = path[i+1];
          let roomA = map[roomAID];
          
          if (roomA['n'] === roomBID) {
            path[i] = 's';
          } else if (roomA['s'] === roomBID) {
            path[i] = 'n';
          } else if (roomA['e'] === roomBID) {
            path[i] = 'w';
          } else if (roomA['w'] === roomBID) {
            path[i] = 'e';
          }
        }
        path.pop();

        return path;
      }

      const room = map[roomID];
      for (let i = 0; i < room.exits.length; i++) {
        const adjacentRoomID = room[room.exits[i]];
        if (!(adjacentRoomID in previousRooms)) {
          previousRooms[adjacentRoomID] = roomID;
        }
        queue.push(adjacentRoomID);
      }
    }
  }
}

const moveWithWiseExplorer = async (roomId, direction, cooldown = 0, hasFlight = false) => {
  try {
    // search graph for roomId
    let room = map[roomId];
    // search found roomID for direction being moved
    let nextRoomId = room[direction];

    if (cooldown > 0) {
      await wait(cooldown);
    }

    let moveEndpoint = `${baseUrl}/api/adv/move/`;
    if (hasFlight) {
      moveEndpoint = `${baseUrl}/api/adv/fly/`;
    }

    // make move request with extra next_direction param
    const postBody = {
      direction,
      next_room_id: `${nextRoomId}`
    };
    const newRoom = await axiosWithAuth().post(
      moveEndpoint,
      postBody
    );
    return newRoom;
  } catch (err) {
    console.error(err);
  }
};

export { wait, moveWithWiseExplorer, pickItem, generatePath };
