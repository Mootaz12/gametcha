import React, { useState, useEffect } from "react";
import "./SimonSays.scss";

// Utility function
function timeout(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

type PlayState = {
  isDisplay: boolean;
  colors: string[];
  score: number;
  userPlay: boolean;
  userColors: string[];
};

const SimonSays = () => {
  const [isOn, setIsOn] = useState(false);
  const [play, setPlay] = useState<PlayState>({
    isDisplay: false,
    colors: [],
    score: 0,
    userPlay: false,
    userColors: [],
  });
  const [flashColor, setFlashColor] = useState<string>("");
  const [pressedColor, setPressedColor] = useState<string>("");

  const colorList = ["green", "red", "yellow", "blue"];

  // Start the game
  function startHandle() {
    setIsOn(true);
  }

  // Reset game state based on the game start or close
  useEffect(() => {
    if (isOn) {
      setPlay({ ...play, isDisplay: true });
    } else {
      setPlay({
        isDisplay: false,
        colors: [],
        score: 0,
        userPlay: false,
        userColors: [],
      });
    }
  }, [isOn]);

  // Add a new random color to the sequence
  useEffect(() => {
    if (isOn && play.isDisplay) {
      const newColor = colorList[Math.floor(Math.random() * 4)];
      setPlay((prev) => ({
        ...prev,
        colors: [...prev.colors, newColor],
      }));
    }
  }, [isOn, play.isDisplay]);

  // Display the colors in sequence
  useEffect(() => {
    if (isOn && play.isDisplay && play.colors.length) {
      displayColors();
    }
  }, [isOn, play.isDisplay, play.colors.length]);

  async function displayColors() {
    await timeout(1000);
    for (let i = 0; i < play.colors.length; i++) {
      setFlashColor(play.colors[i]);
      await timeout(500);
      setFlashColor(""); // Reset flash color
      await timeout(500);

      if (i === play.colors.length - 1) {
        setPlay({
          ...play,
          isDisplay: false,
          userPlay: true,
          userColors: [...play.colors].reverse(),
        });
      }
    }
  }

  // Handle user clicking on colors
  async function cardClickHandle(color: string) {
    if (!play.isDisplay && play.userPlay) {
      const copyUserColors = [...play.userColors];
      const lastColor = copyUserColors.pop();

      setPressedColor(color); // Trigger press effect

      // Only apply the press effect for the user click (no flash)
      if (color === lastColor) {
        setFlashColor(""); // Reset flash color (no flash effect for user input)
        if (copyUserColors.length) {
          setPlay({ ...play, userColors: copyUserColors });
        } else {
          await timeout(1000);
          setPlay({
            ...play,
            isDisplay: true,
            userPlay: false,
            score: play.colors.length,
            userColors: [],
          });
        }
      } else {
        await timeout(1000);
        setPlay({
          isDisplay: false,
          colors: [],
          score: play.colors.length,
          userPlay: false,
          userColors: [],
        });
      }

      // Reset pressed color after animation completes
      setTimeout(() => {
        setPressedColor("");
      }, 200); // Reset after 200ms (same duration as animation)
    }
  }

  // Close the game
  function closeHandle() {
    setIsOn(false);
  }

  return (
    <div className="App">
      <header className="App-header">
        <div className="cardWrapper">
          {colorList.map((v) => (
            <div
              key={v}
              onClick={() => cardClickHandle(v)}
              className={`colorCard ${v} ${
                flashColor === v ? "flash" : pressedColor === v ? "press" : ""
              }`}  // Apply press animation when clicked
            ></div>
          ))}
        </div>

        {isOn && !play.isDisplay && !play.userPlay && play.score && (
          <div className="lost">
            <div>Final Score: {play.score}</div>
            <button onClick={closeHandle}>Close</button>
          </div>
        )}

        {!isOn && !play.score && (
          <button onClick={startHandle} className="startButton">
            Start
          </button>
        )}

        {isOn && (play.isDisplay || play.userPlay) && (
          <div className="score">{play.score}</div>
        )}
      </header>
    </div>
  );
};

export default SimonSays;
