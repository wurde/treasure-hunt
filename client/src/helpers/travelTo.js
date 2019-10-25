/**
 * Dependencies
 */

import axiosWithAuth from "./axiosWithAuth";
import move from "./move";
import {
  wait,
  markCurrentRoom,
  displayPath,
  generatePath as getPathRoomIds,
  removePathMarker
} from "./util";
import { baseUrl } from "./constants";
import generatePath from "./generatePath";

/**
 * References:
 *   shopRoomID = 1;
 *   hollowayShrineRoomID = 22;
 *   wishingWellRoomID = 55;
 *   linhShrineRoomID = 461;
 *   pirateRyRoomID = 467;
 *   glasowynGraveRoomID = 499;
 */

/**
 * Define helper
 */

async function travelTo(targetRoomID, callback = undefined) {
  console.log("travelTo()");
  try {
    // Get current room information.
    const initStatus = await axiosWithAuth().get(`${baseUrl}/api/adv/init/`);
    await wait(initStatus.data.cooldown);
    let currentRoomID = initStatus.data.room_id;

    // Get shortest path to target Room ID.
    const shortestPath = generatePath(currentRoomID, targetRoomID);
    console.log("shortestPath", shortestPath);

    const { numbers: rooms, directions } = await getPathRoomIds(
      currentRoomID,
      targetRoomID
    );

    displayPath(rooms);
    // Move through the maze Following directions.
    console.log(rooms);
    for (let i = 0; i < shortestPath.length; i++) {
      console.log(`Move currentRoomID(${currentRoomID}) ${shortestPath[i]}`);
      const moveStatus = await move(currentRoomID, shortestPath[i], 0, true);
      if (callback) {
        callback(moveStatus.data);
      }
      console.log("moveStatus", moveStatus);
      removePathMarker(moveStatus.data.room_id);
      markCurrentRoom(moveStatus.data.room_id);
      await wait(moveStatus.data.cooldown);
      currentRoomID = moveStatus.data.room_id;
    }
    console.log("You arrived!");

    return true;
  } catch (error) {
    console.error(error);
  }
}

/**
 * Export helper
 */

export default travelTo;
