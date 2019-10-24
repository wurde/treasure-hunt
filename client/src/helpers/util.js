import map from "./map";
import axiosWithAuth from "./axiosWithAuth";
import { baseUrl } from "./constants";

const wait = seconds => {
  let makeMS = seconds * 1000;
  return new Promise((res, rej) => setTimeout(res, makeMS));
};

const sellItems = async () => {
  const playerStatus = await axiosWithAuth().post(`${baseUrl}/api/adv/status`);

  const playerTreasures = playerStatus.data.inventory.filter(item => {
    return item.includes("treasure");
  });

  await wait(playerStatus.data.cooldown);

  while (playerTreasures.length > 0) {
    let treasure = playerTreasures.pop();

    const playerChoice = window
      .prompt(`Would you like to sell ${treasure}?`, "Y/N")
      .toLowerCase();

    if (playerChoice === "y") {
      const item = {
        name: treasure,
        confirm: "yes"
      };
      const sellResult = await axiosWithAuth().post(
        `${baseUrl}/api/adv/sell`,
        item
      );
      console.log(sellResult.data.messages);
      await wait(sellResult.data.cooldown);
    } else {
      console.log(`Did not sell item ${treasure}`);
    }
  }
};

const pickItem = async prevRoom => {
  if (Object.keys(prevRoom.items).length === 0) {
    return false;
  }

  try {
    // Get current player status
    const playerStatus = await axiosWithAuth().post(
      `${baseUrl}/api/adv/status`
    );
    await wait(playerStatus.data.cooldown);
    let encumbrance = playerStatus.data.encumbrance;

    const uniqItems = Array.from(new Set(prevRoom.items));
    for (let i = 0; i < uniqItems.length; i++) {
      const item = uniqItems[i];
      // inspect item
      const itemStatus = await axiosWithAuth().post(
        `${baseUrl}/api/adv/examine`,
        { name: item }
      );
      await wait(itemStatus.data.cooldown);

      // Check if item weight will exceed player strength if picked up
      const weightAllowance = playerStatus.data.strength - encumbrance - 1;
      const itemWeight = itemStatus.data.weight;

      if (itemWeight > weightAllowance) {
        const roomInfo = await axiosWithAuth().get(`${baseUrl}/api/adv/init`);
        let roomID = roomInfo.data.room_id;
        const userChoice = window
          .prompt("Inventory is full, would you like to visit the shop?", "Y/N")
          .toLowerCase();

        if (userChoice === "y") {
          const path = generatePath(roomID, 1);
          while (path.length > 0) {
            let moveDirection = path.pop();
            const newRoom = await moveWithWiseExplorer(roomID, moveDirection);
            roomID = newRoom.data.room_id;
            await wait(newRoom.data.cooldown);
          }
          await sellItems();
        } else {
          console.log("Heard ya loud and clear, keep on walking!");
        }
      } else {
        const takeStatus = await axiosWithAuth().post(
          `${baseUrl}/api/adv/take`,
          { name: item }
        );
        await wait(takeStatus.data.cooldown);
      }
      if (i > 0) {
        encumbrance += itemStatus.data.weight;
      }
    }

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
          return validDirections.has(item);
        });
        // return directions array
        return directions;
      }

      // add room id to visited rooms
      visitedRooms.add(room);

      // get current room data from map
      let roomObject = map[room];

      for (let i = 0; i < roomObject.exits.length; i++) {
        // direction player is moving in
        let direction = roomObject.exits[i];
        // new path to get stored on queue with direction, the current path and room id in given direction

        let newPath = [direction, ...path, roomObject[direction]];
        // add new path to front of array
        queue.unshift(newPath);
      }
    }
  }
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

export { wait, moveWithWiseExplorer, pickItem, generatePath, sellItems };
