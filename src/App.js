import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import "./App.css";
import axios from "axios";
import FloatingEmoji from "./FloatingEmoji"; // Updated import for FloatingEmoji
import logo from "./logo.png";
function App() {
  const webcamRef = useRef(null);
  const [emotion, setEmotion] = useState(null);

  const emojiMapping = {
    angry: "😠",
    disgust: "🤢",
    fear: "😨",
    happy: "😄",
    neutral: "😐",
    sad: "😢",
    surprise: "😲",
  };

  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      sendImage(imageSrc);
    }
  };

  const sendImage = async (imageSrc) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/recognize_emotion",
        { image: imageSrc.split(",")[1] },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200) {
        const data = response.data;
        setEmotion(data.predicted_emotion.toLowerCase());
      } else {
        console.error("Failed to get a response from the backend");
      }
    } catch (error) {
      console.error("Error sending image:", error);
    }
  };

  return (
    <div>
      <img className="logo" alt="logo" src={logo} />
      <div className="App">
        <h1>Emotion Recognition</h1>
        <div className="background-container">
          <FloatingEmoji emotion={emotion} />
        </div>

        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width={600}
          height={450}
          className="Webcam"
        />
        <button onClick={captureImage}>Capture and Recognize Emotion</button>
        {emotion && (
          <div>
            <p>Detected Emotion: </p>
            <h2 className={`${emotion}`}>
              {emotion.toUpperCase()} <span className="emoji"></span>
            </h2>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
