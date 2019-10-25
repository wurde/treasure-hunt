/**
 * Dependencies
 */

import axiosWithAuth from "./axiosWithAuth";
import move from "./move";
import { wait } from "./util";
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

async function pickupTreasure(stack, traversalGraph, weightAllowance, currentRoomID) {
  console.log('pickupTreasure()', traversalGraph);
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

    const itemWeights = {};
    const uniqItems = Array.from(new Set(prevRoom.items));
    for (let i = 0; i < uniqItems.length; i++) {
      const item = uniqItems[i];
      const itemStatus = await axiosWithAuth().post(`${baseUrl}/api/adv/examine`, { "name": item });
      console.log('itemStatus', itemStatus);
      await wait(itemStatus.data.cooldown);
      itemWeights[item] = itemStatus.data.weight;
    }

    for (let i = 0; i < prevRoom.items.length; i++) {
      const item = prevRoom.items[i];
      const itemWeight = itemWeights[prevRoom.items[i]];

      // Check if item weight will exceed player strength if picked up
      if (itemWeight > weightAllowance) {
        continue
      } else {
        const takeStatus = await axiosWithAuth().post(`${baseUrl}/api/adv/take`, { "name": item });
        console.log('takeStatus', takeStatus);
        await wait(takeStatus.data.cooldown);
        encumbrance += itemWeight;
        weightAllowance = playerStatus.data.strength - encumbrance - 1;
      }
    }
  }

  /**
   * Move to the next room.
   */

  const moveStatus = await move(prevRoomID, direction, 0, true);
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
   * Return current state.
   */

  return [weightAllowance, traversalGraph, stack, currentRoomID];
}

/**
 * Export helper
 */

export default pickupTreasure;
