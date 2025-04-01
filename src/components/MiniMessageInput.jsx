import React, { useState } from "react";

const MiniMessageInput = ({ onSendMessage, isInputEnabled }) => {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSendClick = () => {
    if (isInputEnabled) {
      onSendMessage(inputValue);
      setInputValue("");
    }
  };

  const handleKeyPress = (e) => {
    // Si l'utilisateur presse "Enter" sans "Shift", on envoie le message
    if (e.key === "Enter" && !e.shiftKey && isInputEnabled) {
      e.preventDefault(); // Empêche la descente à la ligne
      handleSendClick();
    }
  };

  return (
    <div className="flex p-2">
      <textarea
        className="flex-grow p-2 border border-gray-300 rounded-l resize-none" // "resize-none" pour éviter le redimensionnement manuel
        placeholder={
          isInputEnabled ? "Type a message..." : "Waiting for connection..."
        }
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyPress} // Utilisation de onKeyDown pour intercepter Shift + Enter
        disabled={!isInputEnabled} // Désactiver lorsque isInputEnabled est faux
        rows="2" // Tu peux ajuster la hauteur initiale du textarea
      />
      
    </div>
  );
};

export default MiniMessageInput;
