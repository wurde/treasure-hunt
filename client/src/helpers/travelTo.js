/**
 * Dependencies
 */

import axiosWithAuth from "./axiosWithAuth";
import { wait, moveWithWiseExplorer, generatePath } from "./util";
import { baseUrl } from "./constants";

/**
 * Constants
 */

const shopRoomID = 1;
const hollowayShrineRoomID = 22;
const wishingWellRoomID = 55;
const linhShrineRoomID = 461;
const pirateRyRoomID = 467;
const glasowynGraveRoomID = 499;

/**
 * Define helper
 */

async function travelTo(targetRoomID) {
  try {
    // Get current room information.
    const initStatus = await axiosWithAuth().get(`${baseUrl}/api/adv/init/`);
    await wait(initStatus.data.cooldown);
    let currentRoomID = initStatus.data.room_id;
    console.log(`From ${currentRoomID} to ${targetRoomID}`);

    // Get shortest path to target Room ID.
    const shortestPath = generatePath(parseInt(currentRoomID), parseInt(targetRoomID));
    console.log('shortestPath', shortestPath);
    
    // Move through the maze Following directions.
    for (let i = 0; i < shortestPath.length; i++) {
      console.log(`Move currentRoomID(${currentRoomID}) ${shortestPath[i]}`);
      const moveStatus = await moveWithWiseExplorer(currentRoomID, shortestPath[i], 0, true);
      console.log('moveStatus', moveStatus);
      // data => "{"direction":"n","next_room_id":"undefined"}"
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
