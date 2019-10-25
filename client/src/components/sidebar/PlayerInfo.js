import React, { useState, useEffect } from "react";
import axiosWithAuth from "../../helpers/axiosWithAuth";
import { baseUrl } from "../../helpers/constants";
import { wait } from "../../helpers/util";

import { Alert } from "reactstrap";

const PlayerInfo = ({ alertMessage }) => {
  const [playerDetails, setPlayerDetails] = useState("");

  const handlePlayerDetails = async () => {
    const playerStatus = await axiosWithAuth().post(
      `${baseUrl}/api/adv/status`,
      {}
    );

    setPlayerDetails(playerStatus.data);
    await wait(playerStatus.data.cooldown);
  };

  useEffect(() => {
    handlePlayerDetails();
  }, []);

  if (playerDetails) {
    const playerInventory = playerDetails.inventory.join(", ");
    return (
      <>
        <div className="console">
          <p>Name: {playerDetails.name}</p>
          <p>Strength: {playerDetails.strength}</p>
          <p>Speed: {playerDetails.speed}</p>
          <p>Gold: {playerDetails.gold}</p>
          <p>Body: {playerDetails.bodywear || "None"}</p>
          <p>Feet: {playerDetails.footwear || "None"}</p>
          <p>Inventory: {playerInventory || "Empty"}</p>
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

export default PlayerInfo;
