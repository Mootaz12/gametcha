import React, { useState, useEffect } from "react";

const ClickerGame: React.FC = () => {
  // Calculate the random timer duration once
  const generateRandomTimer = () => Math.floor(Math.random() * (30 - 12 + 1)) + 12;

  const [timerDuration] = useState(generateRandomTimer()); // Randomized timer
  const [targetClicks, setTargetClicks] = useState(0); // Randomized target clicks
  const [clicks, setClicks] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timerDuration); // Timer countdown
  const [milliseconds, setMilliseconds] = useState(0); // Store milliseconds separately
  const [isGameOver, setIsGameOver] = useState(false);
  const [won, setWon] = useState(false);

  // Randomize the target number of clicks to be four times the time
  const generateRandomClicks = () => {
    return timerDuration * 4; // Quadruple the time duration for the number of clicks
  };

  // Start a new game or reset the state
  const startGame = () => {
    setTargetClicks(generateRandomClicks());
    setClicks(0);
    setTimeLeft(timerDuration);
    setMilliseconds(0);
    setIsGameOver(false);
    setWon(false);
  };

  useEffect(() => {
    startGame(); // Set the initial state when the component loads
  }, [timerDuration]);

  // Handle the timer countdown (milliseconds included)
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
      // Timer ended, game over
      setIsGameOver(true);
      setWon(false); // Player loses when time runs out
    }

    return () => {
      if (timer) clearInterval(timer);
      if (msTimer) clearInterval(msTimer);
    };
  }, [timeLeft, isGameOver]);

  // Handle the click action
  const handleClick = () => {
    if (!isGameOver && clicks < targetClicks) {
      setClicks((prev) => prev + 1);
      if (clicks + 1 === targetClicks) {
        // Player reached the target clicks
        setIsGameOver(true);
        setWon(true);
      }
    }
  };

  const handleReset = () => {
    startGame(); // Start a new game when reset
  };

  // Calculate the percentage of time left for the progress bar
  const progressPercentage = (timeLeft / timerDuration) * 100;

  // Format time to show seconds and milliseconds
  const formatTime = (seconds: number, ms: number) => {
    return `${seconds}.${String(ms).padStart(2, "0")}s`;
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6 p-8 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-lg shadow-xl w-[600px] mx-auto">
      <h1 className="text-5xl font-bold text-white mb-4">Clicker Game</h1>

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

      {/* Clickable Area (Larger card with ocean/human body theme) */}
      <div
        onClick={handleClick}
        className="w-full h-[300px] bg-teal-500 flex items-center justify-center rounded-lg shadow-lg cursor-pointer transition-transform transform hover:scale-110 select-none"
      >
        <span className="text-6xl font-bold text-white absolute top-8">{targetClicks - clicks}</span>
      </div>

      {/* Game Outcome */}
      {isGameOver && (
        <div className="mt-4 text-3xl font-semibold">
          {won ? (
            <div className="text-green-600">You Win!</div>
          ) : (
            <div className="text-red-600">You Lose!</div>
          )}
        </div>
      )}

      {/* Reset Button */}
      <button
        onClick={handleReset}
        className="mt-4 px-8 py-3 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition duration-300"
      >
        Reset
      </button>
    </div>
  );
};

export default ClickerGame;
