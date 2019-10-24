/**
 * Dependencies
 */

import axiosWithAuth from "./axiosWithAuth";
import { wait } from "./util";
import { baseUrl } from "./constants";

/**
 * Define helper
 */

async function sellAllItems() {
  console.log('sellAllItems()');
  try {
    // Get current player status.
    const playerStatus = await axiosWithAuth().post(`${baseUrl}/api/adv/status`);
    console.log('playerStatus', playerStatus);
    let { cooldown, inventory } = playerStatus.data;
    await wait(cooldown);

    inventory = inventory.filter(item => item.match(/treasure/))

    // Sell all of your current inventory
    for (let i = 0; i < inventory.length; i++) {
      const item = inventory[i];
      const sellStatus = await axiosWithAuth().post(`${baseUrl}/api/adv/sell`, {
        name: item,
        confirm: "yes"
      });
      const { cooldown } = sellStatus.data;
      await wait(cooldown);
    }

    return true;
  } catch (error) {
    console.error(error);
  }
}

/**
 * Export helper
 */

export default sellAllItems;
