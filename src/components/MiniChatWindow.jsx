import React, { useLayoutEffect, useRef, useState } from "react";

const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    // Format de la date avec l'année en deux chiffres
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2); // Obtenir les deux derniers chiffres de l'année
    const time = date.toLocaleTimeString();
    return `${day}/${month}/${year} ${time}`;
  };
const MiniChatWindow = ({ messages, currentUser }) => {
  const chatWindowRef = useRef(null);
  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(true);

  // Auto-scroll when new messages arrive
  useLayoutEffect(() => {
    if (isAutoScrollEnabled && chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages, isAutoScrollEnabled]);

  // Handle manual scroll to disable auto-scroll
  const handleScroll = () => {
    if (!chatWindowRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatWindowRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 5;
    setIsAutoScrollEnabled(isAtBottom);
  };

  return (
    <div
      ref={chatWindowRef}
      onScroll={handleScroll}
      className="flex-grow p-3 overflow-y-auto flex flex-col space-y-2"
    >
      {messages.map((msg, idx) => {
        const isUser = msg.sender === "User";
        return (
          <div key={idx} className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
            
            <div
              className={`rounded-lg px-3 py-2 max-w-[80%] text-sm ${
                isUser ? "bg-teal-500 text-white" : "bg-gray-200 text-gray-800"
              }`}
            >
              {msg.text}
            </div>
            {/* Nom de l'envoyeur et date en dehors de la bulle */}
            <div className={`text-xs text-gray-500 mb-1 mt-1 ${isUser ? "mr-2" : "ml-2"}`}>
              <span>{msg.sender} - {formatTimestamp(msg.timestamp)}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MiniChatWindow;
