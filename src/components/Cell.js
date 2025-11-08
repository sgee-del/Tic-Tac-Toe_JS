import React from "react";

// Määritellään yksittäinen ruutu (cell) pelilaudalle

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
