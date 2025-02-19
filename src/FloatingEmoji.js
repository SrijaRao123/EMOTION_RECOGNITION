// FloatingEmoji.js
import React, { useEffect } from "react";
// import "./FloatingEmoji.css";
import "./App.css";

function FloatingEmoji({ emotion }) {
  const emojiMapping = {
    angry: "😠",
    disgust: "🤢",
    fear: "😨",
    happy: "😄",
    neutral: "😐",
    sad: "😢",
    surprise: "😲",
  };

  const generateRandomPosition = () => `${Math.floor(Math.random() * 100)}vw`;

  useEffect(() => {
    if (!emotion) return;

    const interval = setInterval(() => {
      const emojiElement = document.createElement("div");
      emojiElement.className = "floating-emoji";
      emojiElement.textContent = emojiMapping[emotion] || "😊";
      emojiElement.style.left = generateRandomPosition();
      emojiElement.style.animationDuration = `${Math.random() * 2 + 4}s`;

      document.body.appendChild(emojiElement);

      setTimeout(() => {
        emojiElement.remove();
      }, 5000); // Remove after 5 seconds
    }, 500); // Controls the frequency

    return () => clearInterval(interval);
  }, [emotion]);

  return null; // This component does not render any visible elements directly
}

export default FloatingEmoji;
