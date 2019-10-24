/**
 * Dependencies
 */

import React from 'react';
import travelTo from "../../helpers/travelTo";
import traverseMap from "../../helpers/traverseMap";
import startGoldFarming from "../../helpers/startGoldFarming";
import { generatePath } from "../../helpers/util";

/**
 * Define component
 */

function CheatCodes() {
	function askTravelTo() {
		const roomID = window.prompt("Room ID:");
		travelTo(roomID);
	}

	return (
		<div className="CheatCodes pannel mb-4">
			<div className="translucent"></div>

			<div class="p-2">
				<h3 className="text-black">Cheat Codes</h3>
				<button onClick={askTravelTo} className="m-1 btn btn-sm btn-primary">Go To Room</button>
				<button onClick={e => travelTo(1)} className="m-1 btn btn-sm btn-primary">Go To Shop</button>
				<button onClick={e => travelTo(22)} className="m-1 btn btn-sm btn-primary">Go To The Peak of Mt. Holloway</button>
				<button onClick={e => travelTo(55)} className="m-1 btn btn-sm btn-primary">Go To Wishing Well</button>
				<button onClick={e => travelTo(461)} className="m-1 btn btn-sm btn-primary">Go To Linh's Shrine</button>
				<button onClick={e => travelTo(467)} className="m-1 btn btn-sm btn-primary">Go To Pirate Ry's</button>
				<button onClick={e => travelTo(495)} className="m-1 btn btn-sm btn-primary">Go To The Transmogriphier</button>
				<button onClick={e => travelTo(499)} className="m-1 btn btn-sm btn-primary">Go To Glasowyn's Grave</button>
				<button onClick={startGoldFarming} className="m-1 btn btn-sm btn-primary">Start Gold Farming</button>
				<button onClick={traverseMap} className="m-1 btn btn-sm btn-primary">Traverse Map</button>
				<button onClick={() => console.log(generatePath(499, 1))} className="m-1 btn btn-sm btn-primary">
					Generate path
				</button>
			</div>
		</div>
	)
}

/**
 * Export component
 */

export default CheatCodes;
