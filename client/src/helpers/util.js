import map from "./map";
import axiosWithAuth from "./axiosWithAuth";
import { baseUrl } from "./constants";

const wait = seconds => {
  let makeMS = seconds * 1000;
  return new Promise((res, rej) => setTimeout(res, makeMS));
};

const pickItem = async (prevRoom) => {
  if (Object.keys(prevRoom.items).length === 0) {
    return false;
  }

  try {
    // Get current player status
    const playerStatus = await axiosWithAuth().post(`${baseUrl}/api/adv/status`);
    await wait(playerStatus.data.cooldown);
    let encumbrance = playerStatus.data.encumbrance;

    const uniqItems = Array.from(new Set(prevRoom.items));
    for (let i = 0; i < uniqItems.length; i++) {
      const item = uniqItems[i];
      // inspect item
      const itemStatus = await axiosWithAuth().post(`${baseUrl}/api/adv/examine`, { "name": item });
      await wait(itemStatus.data.cooldown);

      // Check if item weight will exceed player strength if picked up
      const weightAllowance = playerStatus.data.strength - encumbrance - 1
      const itemWeight = itemStatus.data.weight
      if (itemWeight > weightAllowance) {
        // do traversal to shop
        // sell items
        continue
      } else {
        if (i > 0) {
          encumbrance += itemStatus.data.weight;
        }

        const takeStatus = await axiosWithAuth().post(`${baseUrl}/api/adv/take`, { "name": item });
        await wait(takeStatus.data.cooldown);
      }
    }

    // If pickup item.
    return true
  } catch(err) {
    console.log(err)
    return false
  }
};

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

export { wait, moveWithWiseExplorer, pickItem };
