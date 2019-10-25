/**
 * Dependencies
 */

import React, { useState, useEffect } from "react";
import { generatePath, movePlayerToDestination, wait } from "./helpers/util";
import mapData from "./helpers/map";

import axiosWithAuth from "./helpers/axiosWithAuth";
import { markCurrentRoom } from "./helpers/util";

import Sidebar from "./components/sidebar/Sidebar";
import Map from "./components/map/Map";
import CheatCodes from "./components/cheat-codes/CheatCodes";

const baseUrl = "https://lambda-treasure-hunt.herokuapp.com";

/**
 * Define component
 */

const App = () => {
  const [selectedRoom, setSelectedRoom] = useState("None");
  const [isSelectingRoom, setIsSelectingRoom] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [currentRoom, setCurrentRoom] = useState("");

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
      setAlertMessage(`You cannot move ${direction}`);
      return null;
    }
    const moveRes = await axiosWithAuth().post(`${baseUrl}/api/adv/fly/`, {
      direction,
      next_room_id: currentRoom[direction].toString()
    });

    setAlertMessage(moveRes.data.messages.join(", "));
    const exits = generateDirections(moveRes.data.room_id);
    markCurrentRoom(moveRes.data.room_id);
    setCurrentRoom({ ...moveRes.data, ...exits });

    await wait(moveRes.data.cooldown);
  };

  const getRoomData = async (room = undefined) => {
    if (!room) {
      const { data } = await axiosWithAuth().get(`${baseUrl}/api/adv/init/`);
      let cooldown = data.cooldown;

      let exits = generateDirections(data.room_id);
      room = { ...data, ...exits };
      markCurrentRoom(data.room_id);
      await wait(cooldown);
    } else {
      let exits = generateDirections(room.room_id);
      room = { ...room, ...exits };
    }
    setCurrentRoom(room);
  };

  const generateMovementMessage = async roomid => {
    const { directions } = await generatePath(null, roomid);

    setAlertMessage(`Moving to room ${roomid} in ${directions.length} steps `);
  };
  const handleSelectedRoom = async e => {
    if (isSelectingRoom) {
      e.persist();

      const targetRoomId = parseInt(e.target.innerHTML);
      setSelectedRoom(targetRoomId);

      generateMovementMessage(targetRoomId);
      await movePlayerToDestination(targetRoomId, getRoomData);
      setIsSelectingRoom(false);
      setAlertMessage("Moves completed ");
    } else {
      setAlertMessage("Click on 'Go To Room' to select a room to move to. ");
    }
  };

  useEffect(() => {
    getRoomData();
  }, []);

  return (
    <div className="App">
      <h1 className="title">Treasure Hunter</h1>
      <section className="section">
        <Map setSelectedRoom={handleSelectedRoom} />
        <Sidebar
          alertMessage={alertMessage}
          setAlertMessage={setAlertMessage}
          selectedRoom={selectedRoom}
          setSelectedRoom={handleSelectedRoom}
          isSelectingRoom={isSelectingRoom}
          setIsSelectingRoom={setIsSelectingRoom}
          move={move}
          currentRoom={currentRoom}
          getRoomData={getRoomData}
        />
      </section>

      <section className="section">
        <CheatCodes generateMovementMessage={generateMovementMessage} />
      </section>

      <header className="App-header">Maze</header>
    </div>
  );
};

/**
 * Export component
 */

export default App;
