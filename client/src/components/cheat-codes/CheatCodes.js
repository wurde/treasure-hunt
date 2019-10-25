/**
 * Dependencies
 */

import React from "react";
import travelTo from "../../helpers/travelTo";
import traverseMap from "../../helpers/traverseMap";
import startGoldFarming from "../../helpers/startGoldFarming";
import earnNewPowers from "../../helpers/earnNewPowers";
import examineWishingWell from "../../helpers/examineWishingWell";
import { generatePath } from "../../helpers/util";
/**
 * Define component
 */

function CheatCodes({ generateMovementMessage, getRoomData }) {
  async function askTravelTo() {
    const roomID = window.prompt("Room ID:");

    await generateMovementMessage(roomID);

    travelTo(roomID, getRoomData);
  }

  return (
    <div className="CheatCodes pannel mb-4">
      <div className="translucent"></div>

      <div className="p-2">
        <h3 className="text-black">Cheat Codes</h3>
        <button onClick={askTravelTo} className="m-1 btn btn-sm btn-primary">
          Go To Room
        </button>
        <button
          onClick={e => travelTo(1, getRoomData)}
          className="m-1 btn btn-sm btn-primary"
        >
          Go To Shop
        </button>
        <button
          onClick={e => travelTo(467, getRoomData)}
          className="m-1 btn btn-sm btn-primary"
        >
          Go To Pirate Ry's
        </button>
        <button
          onClick={e => travelTo(495, getRoomData)}
          className="m-1 btn btn-sm btn-primary"
        >
          Go To The Transmogriphier
        </button>
        <button
          onClick={e => travelTo(55, getRoomData)}
          className="m-1 btn btn-sm btn-primary"
        >
          Go To Wishing Well
        </button>
        <button onClick={earnNewPowers} className="m-1 btn btn-sm btn-primary">
          Earn New Powers
        </button>
        <button
          onClick={() => startGoldFarming(getRoomData)}
          className="m-1 btn btn-sm btn-primary"
        >
          Start Gold Farming
        </button>
        {/* <button onClick={examineWishingWell} className="m-1 btn btn-sm btn-primary">Examine Wishing Well</button> */}
        <button
          onClick={() => traverseMap(getRoomData)}
          className="m-1 btn btn-sm btn-primary"
        >
          Traverse Map
        </button>
      </div>
    </div>
  );
}

/**
 * Export component
 */

export default CheatCodes;
