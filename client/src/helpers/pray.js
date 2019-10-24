/**
 * Dependencies
 */

import axiosWithAuth from "./axiosWithAuth";
import { wait } from "./util";
import { baseUrl } from "./constants";

/**
 * Define helper
 */

async function pray() {
  try {
    const prayStatus = await axiosWithAuth().post(`${baseUrl}/api/adv/pray/`);
    await wait(prayStatus.data.cooldown);

    return true;
  } catch (error) {
    console.error(error);
  }
}

/**
 * Export helper
 */

export default pray;
