import React, { useState, useEffect } from "react";
import "./MovingBarGame.css"; // Import the CSS file

const MovingBarGame: React.FC = () => {
  const [targetPosition, setTargetPosition] = useState(0);
  const [animationSpeed, setAnimationSpeed] = useState(5); // Default speed (5s for full path)
  const [score, setScore] = useState(0);
  const pathWidth = 300; // Path width
  const barWidth = 20; // Increased bar width
  const targetWidth = 50; // Width of the target area

  useEffect(() => {
    randomizeTarget();
    randomizeSpeed();
  }, []);

  useEffect(() => {
    const handleSpacePress = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        checkBarPosition();
      }
    };

    window.addEventListener("keydown", handleSpacePress);
    return () => {
      window.removeEventListener("keydown", handleSpacePress);
    };
  }, [targetPosition]);

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
      setScore((prev) => prev + 1);
      randomizeTarget();
      randomizeSpeed();
    } else {
      alert("Missed! Game over.");
      setScore(0);
      randomizeTarget();
      randomizeSpeed();
    }
  };

  const handleAreaClick = () => {
    checkBarPosition();
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
      <p className="mt-4 text-2xl font-semibold text-white">
        Score: <span className="text-green-400">{score}</span>
      </p>
    </div>
  );
};

export default MovingBarGame;
