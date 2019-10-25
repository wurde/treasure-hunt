/**
 * Dependencies
 */

import { baseUrl } from "./constants";
import { wait } from "./util";
import axiosWithAuth from "./axiosWithAuth";
import map from "./map";

/**
 * Define helper
 */

async function move(roomId, direction, cooldown = 0, hasFlight = false) {
  try {
    // search graph for roomId
    let room = map[roomId];
    // search found roomID for direction being moved
    let nextRoomId = room[direction];

    if (cooldown > 0) {
      await wait(cooldown);
    }

    let moveEndpoint = `${baseUrl}/api/adv/move/`;
    if (hasFlight) {
      moveEndpoint = `${baseUrl}/api/adv/fly/`;
    }

    // make move request with extra next_direction param
    const postBody = {
      direction,
      next_room_id: `${nextRoomId}`
    };
    const newRoom = await axiosWithAuth().post(
      moveEndpoint,
      postBody
    );
    return newRoom;
  } catch (err) {
    console.error(err);
  }
};

/**
 * Export helper
 */

export default move;
