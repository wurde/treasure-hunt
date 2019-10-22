const fs = require("fs");

function writeRoomJson(graph) {
	fs.writeFile("./map.json", JSON.stringify(graph, null, 4), err => {
		if (err) {
			console.error(err);
		} else {
			console.log("JSON successfully added.");
		}
	});
};

export default writeRoomJson;
