import React, { useState, useEffect } from "react";

import { Button, Alert } from "reactstrap";
import "./Sidebar.scss";
import traverseMap from "../../helpers/traverseMap";
import PlayerInfo from "./PlayerInfo";
import RoomInfo from "./RoomInfo";
const Sidebar = ({
  alertMessage,
  setAlertMessage,
  selectedRoom,
  setIsSelectingRoom,
  move,
  currentRoom,
  getRoomData
}) => {
  const [isViewingPlayerInfo, setIsViewingPlayerInfo] = useState(false);
  if (currentRoom) {
    return (
      <div className="Sidebar pannel">
        <div className="translucent"></div>
        {isViewingPlayerInfo ? (
          <PlayerInfo alertMessage={alertMessage} />
        ) : (
          <RoomInfo
            currentRoom={currentRoom}
            selectedRoom={selectedRoom}
            alertMessage={alertMessage}
          />
        )}

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
          <Button
            className="action-button"
            color="primary"
            onClick={() => setIsViewingPlayerInfo(!isViewingPlayerInfo)}
          >
            {isViewingPlayerInfo ? "View Room" : "View Player Details"}
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
