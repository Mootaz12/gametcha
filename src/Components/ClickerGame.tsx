import React, { useState, useEffect } from "react";
import { useGameContext } from "../context/GameContext";

const ClickerGame: React.FC = () => {
  const generateRandomTimer = () =>
    Math.floor(Math.random() * (30 - 12 + 1)) + 12;

  const [timerDuration] = useState(generateRandomTimer()); // Randomized timer
  const [targetClicks, setTargetClicks] = useState(0); // Randomized target clicks
  const [clicks, setClicks] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timerDuration); // Timer countdown
  const [milliseconds, setMilliseconds] = useState(0); // Store milliseconds separately
  const [isGameOver, setIsGameOver] = useState(false);
  const [won, setWon] = useState<boolean | null>(null);
  const { setStartNewGame, setFailCondition } = useGameContext();

  const generateRandomClicks = () => {
    return timerDuration * 4; // Quadruple the time duration for the number of clicks
  };

  const startGame = () => {
    console.log("Starting new game");
    setTargetClicks(generateRandomClicks());
    setClicks(0);
    setTimeLeft(timerDuration);
    setMilliseconds(0);
    setIsGameOver(false);
    setWon(null); // Reset the won status before starting
  };

  useEffect(() => {
    startGame();
  }, [timerDuration]);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    let msTimer: ReturnType<typeof setInterval>;

    if (timeLeft > 0 && !isGameOver) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      msTimer = setInterval(() => {
        setMilliseconds((prev) => (prev + 1) % 100); // Count milliseconds every 10ms
      }, 10);
    } else if (timeLeft === 0 && !isGameOver) {
      console.log("Time's up! You lost.");
      setIsGameOver(true);
      setWon(false); // Player loses when time runs out
    }

    return () => {
      if (timer) clearInterval(timer);
      if (msTimer) clearInterval(msTimer);
    };
  }, [timeLeft, isGameOver]);

  const handleClick = () => {
    if (!isGameOver && clicks < targetClicks) {
      setClicks((prev) => prev + 1);
      console.log(`Click registered. Total clicks: ${clicks + 1}`);
      if (clicks + 1 === targetClicks) {
        console.log("Target clicks reached. You won!");
        setIsGameOver(true);
        setWon(true); // Player wins when target clicks are reached
      }
    }
  };

  // Effect for handling game end conditions (win or lose)
  useEffect(() => {
    if (won) {
      setStartNewGame(true); // Start a new game if player wins
    } else {
      setStartNewGame(false); // Do not start a new game if player loses
      setFailCondition(true); // Indicate failure condition for next game
      console.log("set fail condition.");
    }
  }, [won, setStartNewGame, setFailCondition]);

  const progressPercentage = (timeLeft / timerDuration) * 100;

  const formatTime = (seconds: number, ms: number) => {
    return `${seconds}.${String(ms).padStart(2, "0")}s`;
  };

  // Restart game function
  const restartGame = () => {
    startGame();
    setFailCondition(false); // Reset failure condition
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-2 p-8 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-lg shadow-xl  mx-auto">
      <h1 className="text-2xl font-bold text-white mb-4">Clicker Game</h1>

      {/* Progress Bar with Timer Display */}
      <div className="w-full bg-gray-200 rounded-full h-6 mb-4 relative overflow-hidden">
        <div
          className="bg-blue-500 h-6 absolute"
          style={{
            left: `calc(50% - ${progressPercentage / 2}%)`,
            width: `${progressPercentage}%`,
            transform: "scaleX(1)",
            transition: "transform 1s ease-out", // Smooth transition for the progress bar
          }}
        />
      </div>

      {/* Timer Display with Milliseconds */}
      <div className="text-white text-3xl font-semibold mb-4">
        {formatTime(timeLeft, milliseconds)}
      </div>

      {/* Target Clicks */}
      <div className="text-white text-2xl font-semibold mb-4">
        Target Clicks: {targetClicks}
      </div>

      {/* Clickable Area */}
      <div
        onClick={handleClick}
        className="w-full h-[80px] bg-teal-500 flex items-center justify-center rounded-lg shadow-lg cursor-pointer transition-transform transform hover:scale-110 select-none"
      >
        <span className="text-2xl font-bold text-white absolute top-8">
          {targetClicks - clicks}
        </span>
      </div>

      {/* Restart button if the game is over and the player lost */}
      {isGameOver && !won && (
        <button
          onClick={restartGame}
          className="mt-6 bg-red-500 text-white py-2 px-6 rounded-lg shadow-md hover:bg-red-600"
        >
          Restart Game
        </button>
      )}
    </div>
  );
};

export default ClickerGame;
