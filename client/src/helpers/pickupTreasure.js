/**
 * Dependencies
 */

import axiosWithAuth from "./axiosWithAuth";
import { wait, moveWithWiseExplorer } from "./util";
import { baseUrl } from "./constants";

/**
 * Constants
 */

const reverseDirection = {
  n: "s",
  s: "n",
  e: "w",
  w: "e"
};

/**
 * Define helper
 */

async function pickupTreasure(stack, traversalGraph) {
  console.log('pickupTreasure()', traversalGraph);
  let weightAllowance;

  const initStatus = await axiosWithAuth().get(`${baseUrl}/api/adv/init/`);
  console.log('initStatus', initStatus);
  await wait(initStatus.data.cooldown);

  let currentRoomID = initStatus.data.room_id;
  traversalGraph[currentRoomID] = initStatus.data;
  for (let i = 0; i < initStatus.data.exits.length; i++) {
    traversalGraph[currentRoomID][initStatus.data.exits[i]] = "?";
  }
  
  let prevRoomID = currentRoomID;
  let prevRoom = traversalGraph[prevRoomID];

  const unexploredExits = [];
  const exits = prevRoom.exits;
  for (let i = 0; i < exits.length; i++) {
    if (prevRoom[exits[i]] === "?") {
      unexploredExits.push(exits[i]);
    }
  }

  let direction;
  if (unexploredExits.length > 0) {
    direction = unexploredExits.pop();
    stack.push(reverseDirection[direction]);
  } else {
    direction = stack.pop();
  }

  /**
   * Pickup items.
   */

  if (Object.keys(prevRoom.items).length > 0) {
    // Get current player status
    const playerStatus = await axiosWithAuth().post(`${baseUrl}/api/adv/status`);
    console.log('playerStatus', playerStatus);
    await wait(playerStatus.data.cooldown);
    let encumbrance = playerStatus.data.encumbrance;
    weightAllowance = playerStatus.data.strength - encumbrance - 1;

    const uniqItems = Array.from(new Set(prevRoom.items));
    for (let i = 0; i < uniqItems.length; i++) {
      const item = uniqItems[i];
      const itemStatus = await axiosWithAuth().post(`${baseUrl}/api/adv/examine`, { "name": item });
      console.log('itemStatus', itemStatus);
      await wait(itemStatus.data.cooldown);

      // Check if item weight will exceed player strength if picked up
      const itemWeight = itemStatus.data.weight;
      if (itemWeight > weightAllowance) {
        continue
      } else {
        if (i > 0) {
          encumbrance += itemStatus.data.weight;
          weightAllowance = playerStatus.data.strength - encumbrance - 1;
        }

        const takeStatus = await axiosWithAuth().post(`${baseUrl}/api/adv/take`, { "name": item });
        console.log('takeStatus', takeStatus);
        await wait(takeStatus.data.cooldown);
      }
    }
  }

  /**
   * Move to the next room.
   */

  const moveStatus = await moveWithWiseExplorer(prevRoomID, direction, 0, true);
  console.log('moveStatus', moveStatus);
  await wait(moveStatus.data.cooldown);
  currentRoomID = moveStatus.data.room_id;
  if (!(currentRoomID in traversalGraph)) {
    traversalGraph[currentRoomID] = moveStatus.data;
    for (let i = 0; i < moveStatus.data.exits.length; i++) {
      traversalGraph[currentRoomID][moveStatus.data.exits[i]] = "?";
    }
  }
  traversalGraph[prevRoomID][direction] = currentRoomID;
  traversalGraph[currentRoomID][reverseDirection[direction]] = prevRoomID;

  /**
   * Return current weightAllowance
   */

  return weightAllowance;
}

/**
 * Export helper
 */

export default pickupTreasure;
