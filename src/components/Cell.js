import React from "react";

const Cell = ({ value, onClick }) => {
  return (
    <button
      className="cell"
      onClick={onClick}
      style={{
        width: "100px",
        height: "100px",
        fontSize: "2rem",
        cursor: "pointer"
      }}
    >
      {value}
    </button>
  );
};

export default Cell;
