/**
 * Dependencies
 */

import axiosWithAuth from "./axiosWithAuth";
import { wait } from "./util";
import { baseUrl } from "./constants";
import pickupTreasure from './pickupTreasure';
import travelTo from './travelTo';
import sellAllItems from './sellAllItems';

/**
 * Constants
 */

const shopRoomID = 1;

/**
 * Define helper
 */

async function startGoldFarming() {
  try {
    // Continue until manually stopped.
    while (true) {
      // Get current player status.
      const playerStatus = await axiosWithAuth().post(`${baseUrl}/api/adv/status`);
      console.log('playerStatus', playerStatus);
      const { cooldown, strength, encumbrance } = playerStatus.data;
      await wait(cooldown);

      let weightAllowance = strength - encumbrance - 1;
      let stack = [];
      let traversalGraph = {};
      console.log('weightAllowance', weightAllowance)

      const initStatus = await axiosWithAuth().get(`${baseUrl}/api/adv/init/`);
      console.log('initStatus', initStatus);
      await wait(initStatus.data.cooldown);

      let currentRoomID = initStatus.data.room_id;
      traversalGraph[currentRoomID] = initStatus.data;
      for (let i = 0; i < initStatus.data.exits.length; i++) {
        traversalGraph[currentRoomID][initStatus.data.exits[i]] = "?";
      }
      while (weightAllowance > 1) {
        const [
          newWeightAllowance,
          newTraversalGraph,
          newStack,
          newCurrentRoomID
        ] = await pickupTreasure(stack, traversalGraph, weightAllowance, currentRoomID);
        weightAllowance = newWeightAllowance;
        traversalGraph = newTraversalGraph;
        stack = newStack;
        currentRoomID = newCurrentRoomID;
        console.log('weightAllowance', weightAllowance)
      }

      await travelTo(shopRoomID);
      await sellAllItems();
    }
  } catch (error) {
    console.error(error);
  }
}

/**
 * Export helper
 */

 export default startGoldFarming;
