/**
 * Dependencies
 */

import axiosWithAuth from "./axiosWithAuth";
import { wait } from "./util";
import { baseUrl } from "./constants";
import pickupTreasure from './pickupTreasure';
import travelTo from './travelTo';

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
      const stack = [];
      const traversalGraph = {};
      while (weightAllowance > 1) {
        weightAllowance = await pickupTreasure(stack, traversalGraph);
      }

      // DEBUG "{"direction":"n","next_room_id":"undefined"}"
      // await travelTo(shopRoomID);
      // TODO automate sellAllItems();
      throw new Error('Sell your stuff!');
    }
  } catch (error) {
    console.error(error);
  }
}

/**
 * Export helper
 */

 export default startGoldFarming;
