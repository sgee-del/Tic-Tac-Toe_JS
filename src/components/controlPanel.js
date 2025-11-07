import React from "react";

const ControlPanel = ({ onRestart, setGameMode, isAiMode }) => {
  return (
    <div className="control-panel my-3">
      <button onClick={onRestart}>Aloita alusta</button>
      <button onClick={() => setGameMode((prev) => !prev)}>
        Vaihda tilaa (Ihminen vs {isAiMode ? "Ihminen" : "AI"})
      </button>
    </div>
  );
};

export default ControlPanel;
