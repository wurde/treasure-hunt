import React from "react";

const ColorBox = ({ color, text }) => {
  const divColor = {
    background: `${color}`,
    height: "20px",
    width: "20px",
    margin: "5px"
  };

  return (
    <div className="colorbox">
      <div style={divColor}></div>
      <span>{text}</span>
    </div>
  );
};

export default ColorBox;
