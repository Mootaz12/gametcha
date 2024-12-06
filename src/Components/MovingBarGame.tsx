import React, { useState, useEffect } from "react";
import { useGameContext } from "../context/GameContext"; // Import the context
import "./MovingBarGame.css"; // Import the CSS file

const MovingBarGame: React.FC = () => {
  const { setStartNewGame } = useGameContext(); // Access the context's function
  const [targetPosition, setTargetPosition] = useState(0);
  const [animationSpeed, setAnimationSpeed] = useState(5); // Default speed (5s for full path)
  const [gameOver, setGameOver] = useState(false); // New state to track if the game is over
  const pathWidth = 300; // Path width
  const barWidth = 20; // Increased bar width
  const targetWidth = 50; // Width of the target area

  useEffect(() => {
    randomizeTarget();
    randomizeSpeed();
  }, []);

  useEffect(() => {
    const handleSpacePress = (event: KeyboardEvent) => {
      if (event.code === "Space" && !gameOver) {
        checkBarPosition();
      }
    };

    window.addEventListener("keydown", handleSpacePress);
    return () => {
      window.removeEventListener("keydown", handleSpacePress);
    };
  }, [targetPosition, gameOver]);

  const randomizeTarget = () => {
    setTargetPosition(Math.random() * (pathWidth - targetWidth));
  };

  const randomizeSpeed = () => {
    setAnimationSpeed(1 + Math.random() * 0.1); // Speed between 1s and 1.1s
  };

  const checkBarPosition = () => {
    const movingBarElement = document.querySelector(".moving-bar");
    const movingBarLeft = movingBarElement?.getBoundingClientRect().left || 0;
    const movingBarCenter = movingBarLeft + barWidth / 2;

    const gameAreaElement = movingBarElement?.parentElement;
    const gameAreaLeft = gameAreaElement?.getBoundingClientRect().left || 0;

    const relativeBarCenter = movingBarCenter - gameAreaLeft;
    const targetStart = targetPosition;
    const targetEnd = targetPosition + targetWidth;

    if (relativeBarCenter >= targetStart && relativeBarCenter <= targetEnd) {
      // If the player wins, start a new game
      setStartNewGame(true);
      randomizeTarget();
      randomizeSpeed();
    } 
  };

  const handleAreaClick = () => {
    checkBarPosition();
  };

  const handleReset = () => {
    // Reset the game if the player loses
    setGameOver(false);
    randomizeTarget();
    randomizeSpeed();
  };

  return (
    <div className="flex flex-col items-center mt-8">
      <h1 className="text-4xl font-bold mb-6 text-white shadow-lg">
        Neon Bar Game
      </h1>
      <div
        className="relative w-[500px] h-[60px] bg-gray-800 border border-gray-600 rounded-lg shadow-md overflow-hidden"
        onClick={handleAreaClick}
      >
        {/* Target Area */}
        <div
          className="absolute h-full bg-green-400 opacity-80 rounded-lg animate-pulse"
          style={{
            left: `${targetPosition}px`,
            width: `${targetWidth}px`,
          }}
        ></div>

        {/* Moving Bar */}
        <div
          className="moving-bar"
          style={{
            width: `${barWidth}px`,
            animationDuration: `${animationSpeed}s`, // Speed based on randomized value
          }}
        ></div>
      </div>

      {/* Reset Button (only appears if game is over) */}
      {gameOver && (
        <button
          onClick={handleReset}
          className="mt-4 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
        >
          Reset Game
        </button>
      )}
    </div>
  );
};

export default MovingBarGame;
