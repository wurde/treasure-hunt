import React, { useState, useEffect } from "react";
import "./Sidebar.scss";

import { Button } from "reactstrap";
import axiosWithAuth from "../../helpers/axiosWithAuth.js";
import mapData from "../../helpers/map.json";

const baseUrl = "https://lambda-treasure-hunt.herokuapp.com";

const Sidebar = () => {
  const [currentRoom, setCurrentRoom] = useState("");
  const [validDirections, setValidDirections] = useState(new Set());

  const getRoomData = async () => {
    const { data } = await axiosWithAuth().get(`${baseUrl}/api/adv/init/`);

    let exits = generateDirections(data.room_id);
    await setValidDirections(new Set(Object.keys(exits)));

    let stateRoom = { ...data, ...exits };
    markCurrentRoom(data.room_id);
    setCurrentRoom(stateRoom);
  };

  const generateDirections = roomId => {
    let room = mapData[roomId];

    const exits = {};
    room.exits.forEach(direction => {
      exits[direction] = room[direction];
    });

    return exits;
  };

  const move = async e => {
    let { value: direction } = e.target;
    console.log(direction);

    if (!currentRoom[direction]) {
      console.warn(`You can't move ${direction}`);
      return null;
    } else {
    }
    const moveRes = await axiosWithAuth().post(`${baseUrl}/api/adv/fly/`, {
      direction,
      next_room_id: currentRoom[direction].toString()
    });

    const exits = generateDirections(moveRes.data.room_id);
    markCurrentRoom(moveRes.data.room_id);
    setCurrentRoom({ ...moveRes.data, ...exits });
  };

  let markCurrentRoom = roomId => {
    let previousRoom = document.querySelector(`.currentRoom`);
    if (previousRoom) {
      previousRoom.classList.remove("currentRoom");
    }
    let room = document.querySelector(`div[value='${roomId}']`);
    room.classList.add("currentRoom");
    return room;
  };

  useEffect(() => {
    getRoomData();
  }, []);

  if (currentRoom) {
    let itemsString = currentRoom.items.join(", ");
    let exitsString = currentRoom.exits.join(", ");
    return (
      <div className="Sidebar pannel">
        <div className="translucent"></div>

        <div className="console">
          <p>
            Room #{currentRoom.room_id} : {currentRoom.title}
          </p>
          <p>Description: {currentRoom.description}</p>
          <p>Message: {currentRoom.message}</p>
          <p>Items: {itemsString}</p>
          <p>Exits: {exitsString} </p>
          <p>Cooldown: {currentRoom.cooldown}</p>
        </div>

        <div className="dpad">
          <Button
            className="round-button N"
            color="primary"
            value="n"
            onClick={e => move(e)}
          >
            N
          </Button>
          <div className="center">
            <Button
              className="round-button W"
              color="primary"
              value="w"
              onClick={e => move(e)}
            >
              W
            </Button>
            <Button
              className="round-button E"
              color="primary"
              value="e"
              onClick={e => move(e)}
            >
              E
            </Button>
          </div>
          <Button
            className="round-button S"
            color="primary"
            value="s"
            onClick={e => move(e)}
          >
            S
          </Button>
        </div>

        <div className="action-buttons">
          <Button className="action-button" color="primary">
            Pick up
          </Button>
          <Button className="action-button" color="primary">
            Drop
          </Button>
        </div>
      </div>
    );
  } else {
    return null;
  }
};

export default Sidebar;
