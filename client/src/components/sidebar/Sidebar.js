import React, { useState, useEffect } from "react";

import { Button, Alert } from "reactstrap";
import "./Sidebar.scss";
import traverseMap from "../../helpers/traverseMap";

const Sidebar = ({
  alertMessage,
  setAlertMessage,
  selectedRoom,
  setIsSelectingRoom,
  move,
  currentRoom,
  getRoomData
}) => {
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
          <p>Items: {itemsString}</p>
          <p>Exits: {exitsString} </p>
          <p>Cooldown: {currentRoom.cooldown}</p>
          <p>Currently Selected Room: {selectedRoom}</p>
          <Alert color="light">
            {alertMessage || "Messages will appear here"}
          </Alert>
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

        <div className="traverse-buttons">
          <Button
            className="action-button"
            color="primary"
            onClick={() => {
              setAlertMessage(
                "Traversing randomly. Will pick up gold and autosell"
              );
              traverseMap(getRoomData);
            }}
          >
            Traverse Map Randomly
          </Button>
          <Button
            className="action-button"
            color="primary"
            onClick={() => {
              setIsSelectingRoom(true);
              setAlertMessage("Pick a room to move to.");
            }}
          >
            Go To Room
          </Button>
        </div>
      </div>
    );
  } else {
    return null;
  }
};

export default Sidebar;
