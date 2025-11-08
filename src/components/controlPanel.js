import React from "react";

const ControlPanel = ({ onRestart, setGameMode, isAiMode }) => {
  return (
    <div className="control-panel my-3 pa-3 d-flex justify-content-between w-50">
      <button onClick={onRestart}>Aloita alusta</button>
      <button onClick={() => setGameMode((prev) => !prev)}>
        Ihminen vs {isAiMode ? "Ihminen" : "AI"}
      </button>
    </div>
  );
};

export default ControlPanel;
