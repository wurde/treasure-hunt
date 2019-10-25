import React, { useState, useEffect } from "react";
import { Alert } from "reactstrap";

const RoomInfo = ({ currentRoom, selectedRoom, alertMessage }) => {
  if (currentRoom) {
    let itemsString = currentRoom.items.join(", ");
    let exitsString = currentRoom.exits.join(", ");
    return (
      <>
        <div className="console">
          <h3>
            Room #{currentRoom.room_id} : {currentRoom.title}
          </h3>
          <p className="description" >Description: {currentRoom.description}</p>
          <p>Items: {itemsString}</p>
          <p>Exits: {exitsString} </p>
          <p>Cooldown: {currentRoom.cooldown}</p>
          <p>Currently Selected Room: {selectedRoom}</p>
          <Alert color="light">
            {alertMessage || "Messages will appear here"}
          </Alert>
        </div>
      </>
    );
  } else {
    return null;
  }
};

export default RoomInfo;
