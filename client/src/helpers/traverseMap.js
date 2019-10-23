/**
 * Dependencies
 */

import axiosWithAuth from "./axiosWithAuth";

/**
 * Constants
 */

const baseUrl = "https://lambda-treasure-hunt.herokuapp.com";
const reverseDirection = {
  n: "s",
  s: "n",
  e: "w",
  w: "e"
};

/**
 * Define Helpers
 */

// const now = new Date();
// const buffer = 5000; // 5 seconds
// localStorage.setItem('cooldown', new Date(now.getTime() + response.data.cooldown * 1000 + buffer));

// // Prevent all axiosWithAuth requests if active cooldown in localStorage.
// const now = new Date();
// const cooldown = new Date(localStorage.getItem('cooldown'));
// if (now < cooldown) {
//   throw Error('Cooldown still in effect.')
// }

/**
 * Define traversal algorithm
 */

//  returns a promise that can be used to halt something for an allotted amount of time
const wait = ms => {
  return new Promise((res, rej) => setTimeout(res, ms));
};

async function traverseMap() {
  const traversalGraph = {};
  const stack = [];

  try {
    // Get current room information
    const response = await axiosWithAuth().get(`${baseUrl}/api/adv/init/`);

    let currentRoomID = response.data.room_id;
    traversalGraph[currentRoomID] = response.data;
    for (let i = 0; i < response.data.exits.length; i++) {
      traversalGraph[currentRoomID][response.data.exits[i]] = "?";
    }

    await wait(response.data.cooldown * 1000);

    let count = 0;
    while (Object.keys(traversalGraph).length <= 2) {
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

      const moveRes = await axiosWithAuth().post(`${baseUrl}/api/adv/move/`, {
        direction: direction
      });
      currentRoomID = moveRes.data.room_id;
      if (!(currentRoomID in traversalGraph)) {
        traversalGraph[currentRoomID] = moveRes.data;
        for (let i = 0; i < moveRes.data.exits.length; i++) {
          traversalGraph[currentRoomID][moveRes.data.exits[i]] = "?";
        }
      }
      traversalGraph[prevRoomID][direction] = currentRoomID;
      traversalGraph[currentRoomID][reverseDirection[direction]] = prevRoomID;

      console.log("traversalGraph", traversalGraph);
      localStorage.setItem("graph", JSON.stringify(traversalGraph));

      await wait(moveRes.data.cooldown * 1000);
    }
  } catch (error) {
    console.error(error);
  }
}

export default traverseMap;
