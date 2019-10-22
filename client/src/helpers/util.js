const fs = require("fs");

exports.writeRoomJson = object => {
	fs.readFile("./map.json", (err, data) => {
		if (err) {
			console.log(err);
		}
		const rooms = JSON.parse(data);

		rooms[object.room_id] = object;
		
		for (let i = 0; i < object.exits.length; i++) {
			const direction = object.exits[i];
			if (!(direction in rooms[object.room_id])) {
				rooms[object.room_id][direction] = "?";
			}
		}

		fs.writeFile("./map.json", JSON.stringify(rooms, null, 4), err => {
			if (err) {
				console.log(err);
			} else {
				console.log("JSON successfully added");
			}
		});
	});
};
