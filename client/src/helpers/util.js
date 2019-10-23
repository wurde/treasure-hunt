import map from "./map";
import axiosWithAuth from "./axiosWithAuth";
import { baseUrl } from "./constants";

const wait = seconds => {
  let makeMS = seconds * 1000;
  return new Promise((res, rej) => setTimeout(res, makeMS));
};

const pickItem = (object, encumberance) => {};

const moveWithWiseExplorer = async (roomId, direction, cooldown = 0) => {
  try {
    // search graph for roomId
    let room = map[roomId];
    // search found roomID for direction being moved
    let nextRoomId = room[direction];

    if (cooldown > 0) {
      await wait(cooldown);
    }

    // make move request with extra next_direction param
    const postBody = {
      direction,
      next_room_id: `${nextRoomId}`
    };
    const newRoom = await axiosWithAuth().post(
      `${baseUrl}/api/adv/move/`,
      postBody
    );
    return newRoom;
  } catch (err) {
    console.error(err);
  }
};

export { wait, moveWithWiseExplorer };
