/**
 * Dependencies
 */

import axiosWithAuth from "./axiosWithAuth";
import { wait, moveWithWiseExplorer } from "./util";
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

async function travelTo(targetRoomID) {
  console.log('travelTo()');
  try {
    // Get current room information.
    const initStatus = await axiosWithAuth().get(`${baseUrl}/api/adv/init/`);
    await wait(initStatus.data.cooldown);
    let currentRoomID = initStatus.data.room_id;

    // Get shortest path to target Room ID.
    const shortestPath = generatePath(currentRoomID, targetRoomID);
    console.log('shortestPath', shortestPath);
    
    // Move through the maze Following directions.
    for (let i = 0; i < shortestPath.length; i++) {
      console.log(`Move currentRoomID(${currentRoomID}) ${shortestPath[i]}`);
      const moveStatus = await moveWithWiseExplorer(currentRoomID, shortestPath[i], 0, true);
      console.log('moveStatus', moveStatus);
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
