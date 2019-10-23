import map from "./map";
import axiosWithAuth from "./axiosWithAuth";
import { baseUrl } from "./constants";

const wait = seconds => {
  let makeMS = seconds * 1000;
  return new Promise((res, rej) => setTimeout(res, makeMS));
};

const pickItem = async prevRoom => {
  if (Object.keys(prevRoom.items).length === 0) {
    return false;
  }

  const reverseDirection = {
    n: "s",
    s: "n",
    e: "w",
    w: "e"
  };

  try {
    // Get current player status
    const playerStatus = await axiosWithAuth().post(
      `${baseUrl}/api/adv/status`
    );
    await wait(playerStatus.data.cooldown);

    const uniqItems = Array.from(new Set(prevRoom.items));
    for (let i = 0; i < uniqItems.length; i++) {
      const item = uniqItems[i];
      // inspect item
      const itemStatus = await axiosWithAuth().post(
        `${baseUrl}/api/adv/examine`,
        { name: item }
      );
      await wait(itemStatus.data.cooldown);

      // check if item weight will exceed player strength if picked up
      const weightAllowance =
        playerStatus.data.strength - playerStatus.data.encumbrance;
      const itemWeight = itemStatus.data.weight;
      if (itemWeight > weightAllowance) {
        continue;
      } else {
        const takeStatus = await axiosWithAuth().post(
          `${baseUrl}/api/adv/take`,
          { name: item }
        );
        await wait(takeStatus.data.cooldown);
      }
    }

    // do traversal to shop
    // sell items

    // If pickup item.
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

const generatePath = (startRoomId, destinationRoomId) => {
  const queue = [];
  let visitedRooms = new Set();
  let startingRoom = map[startRoomId];
  // add initial room to visited to remove it from the returned path
  visitedRooms.add(startRoomId);

  // add all neighbors of starting node to start queue traversal
  for (let i = 0; i < startingRoom.exits.length; i++) {
    let direction = startingRoom.exits[i];
    // add [direction(n, s, e, w), roomId] combo to queue
    queue.unshift([direction, startingRoom[direction]]);
  }

  while (queue.length > 0) {
    // remove path array from queue
    let path = queue.pop();
    // get last item from path, assuming this will be the most recently visited room id
    let room = path[path.length - 1];

    if (!visitedRooms.has(room)) {
      // return directions from path  if destination hit
      if (room === destinationRoomId) {
        let validDirections = new Set(["n", "s", "e", "w"]);

        // filter path for valid movement directions
        let directions = path.filter(item => {
          //eslint-disable-next-line
          return validDirections.has(item);
        });
        // return directions in reverse to get proper order
        return directions.reverse();
      }
      visitedRooms.add(room);
      let roomObject = map[room];
      for (let i = 0; i < roomObject.exits.length; i++) {
        let direction = roomObject.exits[i];
        let newPath = [direction, ...path, roomObject[direction]];
        queue.unshift(newPath);
      }
    }
  }
  // generate path of (n,s,e,w) direction from startRoom to endRoom using bfs
  // queue and visited will be filled with room ids
  // path will be directions
  // add starting room to visitedRooms
  // visitedRooms.add(startRoomId);
  // // add all exit directions to q
  // let exits = map[startRoomId].exits;
  // for (let i = 0; i < exits.length; i++) {
  //   queue.push([startRoomId, exits[i]]);
  // }

  // let currentRoom = map[startRoomId];

  // while (queue.length > 0) {
  //   let path = queue.pop();
  //   let nextRoomID = map[path[0]][path[path.length - 1]];
  //   // room at direction path[-1] from room path[0]
  //   let nextRoom = map[nextRoomID];

  //   // // visitedRooms.add(currentRoom.room_id);
  //   if (!visitedRooms.has(currentRoom.room_id)) {
  //     // add success check here

  //     for (let i = 0; i < nextRoom.exits.length; i++) {
  //       console.log(`Exit ${nextRoom.exits[i]} for ${nextRoom.room_id}`);
  //       let newPath = path.slice(1);
  //       newPath = [nextRoom.room_id, ...newPath, nextRoom.exits[i]];
  //       // currentRoom = nextRoom;
  //       queue.push(newPath);
  //     }
  //     currentRoom = nextRoom;
  //     visitedRooms.add(currentRoom.room_id);
  //   }
  //   let roomId = path[path.length - 1];
  // }
};

const moveWithWiseExplorer = async (roomId, direction, cooldown = 0) => {
  try {
    // search graph for roomId
    let room = map[roomId];
    // search found roomID for direction being moved
    let nextRoomId = room[direction];

    if (cooldown > 0) {
      await wait(cooldown);
    }

    // make move request with extra next_direction param
    const postBody = {
      direction,
      next_room_id: `${nextRoomId}`
    };
    const newRoom = await axiosWithAuth().post(
      `${baseUrl}/api/adv/move/`,
      postBody
    );
    return newRoom;
  } catch (err) {
    console.error(err);
  }
};

export { wait, moveWithWiseExplorer, pickItem, generatePath, reverseDirection };
