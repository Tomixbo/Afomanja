import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import MiniMessageInput from "./MiniMessageInput";
import MiniChatWindow from "./MiniChatWindow";


const chatbotInstruction = {
    role: "system",
    content: `
    AfoManja Assistant is specifically designed to answer questions related to the AfoManja project. Please follow these guidelines:
    If a user asks a question that does not primarily relate to the AfoManja project (for example, "What is Python?" or "How do I plant a rose?"), the assistant must NOT provide an answer. 
    Please ensure that no information outside the scope of the AfoManja project is generated or provided.

    ---
    
    ### 1. Scope of Responses:
    The chatbot will only answer questions directly related to the AfoManja project, including the following aspects:
    
    - **Project Overview:**
    AfoManja is an innovative ecological project focused on converting domestic organic waste into biogas. It offers a sustainable, cost-effective, and accessible solution for everyone. 
    The project’s mission is to address the problem of poorly managed organic waste while providing households with a green, economical, and practical energy source.
    
    - **Objectives:**
    - Reduce environmental pollution caused by organic waste.
    - Promote sustainable, renewable, and affordable energy.
    - Provide households with a portable, connected digester that requires no major installation.
    - Educate communities about ecology and the circular economy.
    
    - **Identified Problems:**
    - Pollution from organic waste.
    - High cost and lack of access to clean energy.
    - Dependence on polluting energy sources such as charcoal and wood.
    - Insufficient methods for at-home waste valorization.
    
    - **Proposed Solutions:**
    - **Paid Waste Collection:** Households can provide their organic waste to AfoManja in exchange for remuneration.
    - **Biogas Production:** Transforming collected waste into clean, usable biogas.
    - **Portable Connected Digester:** A lightweight, easy-to-install device that enables households to convert their waste into energy without extensive modifications.
    - **Smart Mobile Application:** Real-time tracking of energy production, flame time estimation, waste optimization, and maintenance notifications.
    
    - **How It Works:**
    1. **Collection:** Organic waste is gathered directly from households.
    2. **Transformation:** The waste is converted into biogas using a portable digester.
    3. **Usage:** The produced gas is immediately available for household use (e.g., cooking, heating).
    4. **Monitoring:** A mobile application helps users track and optimize biogas usage.
    
    - **Key Benefits:**
    - Significant reduction in household energy costs.
    - Easy installation and practical use.
    - Household energy autonomy.
    - Positive impact on environmental preservation.
    
    - **Business Model:**
    - Sale of portable connected digesters.
    - Direct sale of biogas to households.
    - Premium subscriptions for the intelligent energy management application.
    - Maintenance, training, and personalized support services.
    
    - **Social and Environmental Impact:**
    - Considerable decrease in organic pollution.
    - Creation of sustainable local jobs.
    - Promotion of a circular and sustainable economy.
    - Increased community awareness of environmental practices.
    
    - **Long-term Vision:**
    AfoManja aims to democratize access to green energy nationwide and beyond, becoming a leader in ecological transition through practical, scalable solutions.
    
    ---
    
    ### 2. Accuracy of Information:
    - The chatbot will provide accurate and verified information only.
    - If the information is unavailable or incomplete, the chatbot will not create or assume answers. Instead, it will advise the user to contact the AfoManja team via the provided email.
    
    ---
    
    ### 3. Tone and Style:
    - Responses should be clear, concise, and professional.
    - Maintain a friendly and helpful tone while ensuring professionalism.
    - Limit responses to 50 words to maintain clarity and brevity.
    
    ---
    
    ### 4. Fallback Message:
    - If the chatbot does not understand the question or lacks the required information, it will respond with:
    "I'm sorry, I don't have the information you are looking for. Please reach out to us at [contact@afomanja.mg](mailto:contact@afomanja.mg) for further assistance."
    
    ---
    
    Thank you for using the AfoManja Assistant! 
    Together, let's transform waste into renewable energy!
    `,
    };

const MiniChatApp = () => {
  // États du chat
  const [messages, setMessages] = useState([]);
  const [isAssistantAvailable, setIsAssistantAvailable] = useState(false);
  const [isInputEnabled, setIsInputEnabled] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showAssistantBubble, setShowAssistantBubble] = useState(false);
  const [didShowInfoBubble, setDidShowInfoBubble] = useState(false);

  // Vérification de la disponibilité de l'IA
  const checkAIAvailability = async () => {
    try {
      const response = await fetch("http://127.0.0.1:11434/api/show", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "llama3.1:latest" }),
      });
      if (response.status === 200) {
        setIsAssistantAvailable(true);
        setIsInputEnabled(true);
      } else {
        setIsAssistantAvailable(false);
        setIsInputEnabled(false);
      }
    } catch (error) {
      console.error("Erreur lors de la vérification de l'IA:", error);
      setIsAssistantAvailable(false);
      setIsInputEnabled(false);
    }
  };

  // Au chargement, vérifier l'IA et afficher un message de bienvenue
  useEffect(() => {
    checkAIAvailability();
    setMessages([
      {
        sender: "Assistant",
        text:
          "Bonjour !\nJe suis là pour te conseiller sur les produits et services de AfoManja.\nEn quoi puis-je vous aider ?",
        timestamp: new Date(),
      },
    ]);
  }, []);

  // Afficher la bulle informative après 3 secondes si le chat est fermé
  useEffect(() => {
    if (!isChatOpen && !didShowInfoBubble) {
      const timer = setTimeout(() => {
        setShowAssistantBubble(true);
        setDidShowInfoBubble(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isChatOpen, didShowInfoBubble]);

  // Ouvrir le chat et masquer la bulle
  const handleOpenChat = () => {
    setIsChatOpen(true);
    setShowAssistantBubble(false);
    setDidShowInfoBubble(true);
  };

  // Envoi d'un message
  const handleSendMessage = async (newMessage) => {
    if (!newMessage.trim()) return;

    setMessages((prev) => [
      ...prev,
      { sender: "User", text: newMessage, timestamp: new Date() },
    ]);

    try {
      const response = await fetch("http://127.0.0.1:11434/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "llama3.1:latest",
          messages: [
            chatbotInstruction,
            ...messages.map((m) => ({
              role: m.sender === "User" ? "user" : "assistant",
              content: m.text,
            })),
            { role: "user", content: newMessage },
          ],
          options: { stream: true },
        }),
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let fullMessage = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        try {
          const parsed = JSON.parse(chunk);
          if (parsed.message && parsed.message.content) {
            fullMessage += parsed.message.content;
            setMessages((prevMsgs) => {
              const last = prevMsgs[prevMsgs.length - 1];
              if (last && last.sender === "Assistant") {
                return [
                  ...prevMsgs.slice(0, -1),
                  { ...last, text: fullMessage, timestamp: new Date() },
                ];
              } else {
                return [
                  ...prevMsgs,
                  { sender: "Assistant", text: fullMessage, timestamp: new Date() },
                ];
              }
            });
          }
        } catch (e) {
          console.error("Erreur parse chunk:", e);
        }
      }
    } catch (error) {
      console.error("Erreur lors de l'appel à l'IA:", error);
    }
  };

  return (
    <>
      {/* Bulle informative */}
      {showAssistantBubble && !isChatOpen && (
        <div
          id="infobulle"
          className="fixed bottom-10 right-24 w-64 py-3 pl-4 pr-4 bg-white shadow-lg border border-gray-300 border-r-teal-400 border-r-2 rounded-lg z-40 transition-opacity duration-300"
        >
          <div className="text-sm text-gray-800 whitespace-pre-wrap">
            Bonjour !<br />
            Je suis votre assistant de AfoManja.<br />
            En quoi puis-je vous aider ?
          </div>
          <button
            className="absolute top-1 right-2 text-gray-500 hover:text-gray-700"
            onClick={() => setShowAssistantBubble(false)}
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
      )}

      {/* Bouton d'ouverture du chat */}
      {!isChatOpen && (
        <div
          className="fixed bottom-10 right-4 w-16 h-16 bg-gray-100 hover:scale-105 transition-scale duration-300 border-2 border-l-teal-400 rounded-full shadow-lg flex items-center justify-center text-white text-xl font-bold cursor-pointer z-50"
          onClick={handleOpenChat}
        >
          <img src="/static/logo_afomanja_2.png" alt="Chat Icon" className="h-10 w-10" />
        </div>
      )}

      {/* Fenêtre du mini-chat */}
      {isChatOpen && (
        <div className="fixed bottom-4 right-4 w-full max-w-sm h-[70vh] sm:h-[60vh] bg-white border border-gray-300 shadow-lg rounded-lg flex flex-col z-50">
          {/* Header */}
          <div className="px-4 py-2 bg-gray-600 text-white flex justify-between items-center rounded-t-lg">
            <div className="flex items-center space-x-2">
              <img src="/static/logo_afomanja_2.png" alt="Logo" className="h-6 w-6" />
              <span className="text-sm font-bold">AfoManja</span>
              {isAssistantAvailable ? (
                <span className="text-green-400 text-xl">●</span>
              ) : (
                <span className="text-red-400 text-xl">●</span>
              )}
            </div>
            <button
              className="text-white font-bold text-lg"
              onClick={() => setIsChatOpen(false)}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>

          {/* Zone d'affichage des messages */}
          <MiniChatWindow messages={messages} currentUser="User" />

          {/* Input */}
          <div className="p-2 border-t border-gray-300">
            <MiniMessageInput onSendMessage={handleSendMessage} isInputEnabled={isInputEnabled} />
          </div>
        </div>
      )}
    </>
  );
};

export default MiniChatApp;
