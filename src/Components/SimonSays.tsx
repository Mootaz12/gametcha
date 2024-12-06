import { useState, useEffect } from "react";
import "./SimonSays.scss";
import { useGameContext } from "../context/GameContext";

// Utility function
function timeout(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

type PlayState = {
  isDisplay: boolean;
  colors: string[];
  userPlay: boolean;
  userColors: string[];
};

const SimonSays = () => {
  const [isOn, setIsOn] = useState(false);
  const [play, setPlay] = useState<PlayState>({
    isDisplay: false,
    colors: [],
    userPlay: false,
    userColors: [],
  });
  const [flashColor, setFlashColor] = useState<string>("");
  const [pressedColor, setPressedColor] = useState<string>("");
  const [winStreak, setWinStreak] = useState(0); // Track consecutive wins
  const [gameOver, setGameOver] = useState(false); // Track if the game is over

  const { startNewGame, setStartNewGame } = useGameContext(); // Context for transitioning to the next game
  const colorList = ["green", "red", "yellow", "blue"];

  // Start the game
  function startHandle() {
    setIsOn(true);
    setWinStreak(0); // Reset streak when the game starts
  }

  // Reset game state based on the game start or close
  useEffect(() => {
    if (isOn) {
      setPlay({ ...play, isDisplay: true });
      setGameOver(false);
    } else {
      setPlay({
        isDisplay: false,
        colors: [],
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
          // Player wins this round
          if (winStreak === 3) {
        
            setStartNewGame(true); // Trigger new game in the context
            setWinStreak(0); // Reset streak and start a new game
            setIsOn(false); // End current game
          } else {
            setWinStreak((prev) => prev + 1); // Increment win streak
            setPlay({
              ...play,
              isDisplay: true,
              userPlay: false,
              userColors: [],
            });
          }
        }
      } else {
        await timeout(1000);
        // Player loses, show reset button
        setGameOver(true);
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
    setWinStreak(0); // Reset streak on close
  }

  // Reset the game after losing
  function resetGame() {
    setIsOn(true);
    setPlay({
      isDisplay: false,
      colors: [],
      userPlay: false,
      userColors: [],
    });
    setGameOver(false);
    setWinStreak(0); // Reset win streak on reset
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
              }`} // Apply press animation when clicked
            ></div>
          ))}
        </div>

        {gameOver && (
          <div className="gameOver">
            <div>Game Over</div>
            <button onClick={resetGame}>Reset</button>
          </div>
        )}

        {!isOn && !gameOver && (
          <button onClick={startHandle} className="startButton">
            Start
          </button>
        )}

        {isOn && (play.isDisplay || play.userPlay) && !gameOver && (
          <div className="winStreak">
            {winStreak > 0 && <div>{winStreak}</div>}
          </div>
        )}
      </header>
    </div>
  );
};

export default SimonSays;
