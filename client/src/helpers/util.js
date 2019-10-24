import map from "./map";
import axiosWithAuth from "./axiosWithAuth";
import { baseUrl } from "./constants";

const wait = seconds => {
  let makeMS = seconds * 1000;
  return new Promise((res, rej) => setTimeout(res, makeMS));
};

const pickUpAllPerks = async () => {
  try {
    let shrineRooms = [22, 461, 499];

    while (shrineRooms.length > 0) {
      const destinationRoom = shrineRooms.pop(0);
      const finalRoom = await movePlayerToDestination(destinationRoom);
      const prayerResult = await pray();
    }
  } catch (err) {
    console.error(err);
  }
};

const examineWishingWell = async () => {
  try {
    const goToWishingWell = await movePlayerToDestination(55);
    const getLS8 = await axiosWithAuth().post(`${baseUrl}/api/adv/examine`, {
      name: "well"
    });
    await wait(getLS8.data.cooldown);
  } catch (err) {
    console.error(err);
  }
};

const pray = async () => {
  try {
    const prayerResult = await axiosWithAuth().post(`${baseUrl}/api/adv/pray`);
    console.log(prayerResult.data.messages);
    await wait(prayerResult.data.cooldown);
  } catch (err) {
    console.error(err);
  }
};

const sellTreasures = async () => {
  const playerStatus = await axiosWithAuth().post(`${baseUrl}/api/adv/status`);

  const playerTreasures = playerStatus.data.inventory.filter(item => {
    return item.includes("treasure");
  });

  await wait(playerStatus.data.cooldown);

  while (playerTreasures.length > 0) {
    let treasure = playerTreasures.pop();

    try {
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
    } catch (err) {
      console.error(err);
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

      const itemStatus = await axiosWithAuth().post(
        `${baseUrl}/api/adv/examine`,
        { name: item }
      );
      await wait(itemStatus.data.cooldown);

      // Check if item weight will exceed player strength if picked up
      const weightAllowance = playerStatus.data.strength - encumbrance - 1;
      const itemWeight = itemStatus.data.weight;

      if (itemWeight > weightAllowance) {
        await movePlayerToDestination(1);
        await sellTreasures();
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
  } catch (err) {
    console.log(err);
  }
};

const movePlayerToDestination = async (
  destinationRoomId,
  callback = undefined
) => {
  try {
    const roomInfo = await axiosWithAuth().get(`${baseUrl}/api/adv/init`);

    let roomId = roomInfo.data.room_id;

    const { directions: movePath } = await generatePath(
      roomId,
      destinationRoomId
    );

    console.log("move path", movePath);

    await wait(roomInfo.data.cooldown);

    while (movePath.length > 0) {
      const moveDirection = movePath.pop();
      const newRoom = await moveWithPerks(roomId, moveDirection);
      if (callback) {
        callback(newRoom.data);
      }
      roomId = newRoom.data.room_id;
      markCurrentRoom(roomId);
      await wait(newRoom.data.cooldown);
    }
  } catch (err) {
    console.error(err);
  }
};

const generatePath = async (startRoomId = undefined, destinationRoomId) => {
  if (!startRoomId) {
    const initData = await axiosWithAuth().get(`${baseUrl}/api/adv/init`);

    startRoomId = initData.data.room_id;
    await wait(initData.data.cooldown);
  }

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
        let numbers = path.filter(item => {
          return !validDirections.has(item);
        });
        // return directions array
        return { directions, numbers };
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

const moveWithPerks = async (roomId, direction, callback = undefined) => {
  try {
    // search graph for roomId
    let room = map[roomId];
    // search found roomID for direction being moved
    let nextRoomId = room[direction];

    let moveEndpoint = `${baseUrl}/api/adv/fly/`;

    // make move request with extra next_direction param
    const postBody = {
      direction,
      next_room_id: `${nextRoomId}`
    };
    const newRoom = await axiosWithAuth().post(
      `${baseUrl}/api/adv/fly/`,
      postBody
    );
    if (callback) {
      callback(newRoom.data);
    }
    markCurrentRoom(newRoom.data.room_id);
    return newRoom;
  } catch (err) {
    console.error(err);
  }
};

const markCurrentRoom = roomId => {
  let previousRoom = document.querySelector(`.currentRoom`);
  if (previousRoom) {
    previousRoom.classList.remove("currentRoom");
  }
  let room = document.querySelector(`div[value='${roomId}']`);
  room.classList.add("currentRoom");
  return room;
};
export {
  wait,
  moveWithPerks,
  pickItem,
  generatePath,
  sellTreasures,
  pray,
  pickUpAllPerks,
  movePlayerToDestination,
  examineWishingWell,
  markCurrentRoom
};
