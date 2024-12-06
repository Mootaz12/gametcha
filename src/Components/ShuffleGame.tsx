import React, { useState, useEffect } from "react";
import fish from "./../assets/fish__74861.png";
import useGames from "../hooks/useGames";  // Import useGames hook
import { useGameContext } from "../context/GameContext";

interface Position {
  x: number;
  y: number;
}

const ShuffleGame: React.FC = () => {
  const [balls, setBalls] = useState<number[]>([]);
  const [highlightedBall, setHighlightedBall] = useState<number | null>(null);
  const [positions, setPositions] = useState<Position[]>([]);
  const [gameState, setGameState] = useState<"highlight" | "shuffle" | "guess" | "result">("highlight");
  const [resultMessage, setResultMessage] = useState<string>("");
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [roundInProgress, setRoundInProgress] = useState<boolean>(false); // Track if a round is in progress
  const { message, gameId } = useGames(); // Use the custom hook to get the new game message and ID
  const { setStartNewGame, setFailCondition } = useGameContext();
  const BOX_WIDTH = 300;
  const BOX_HEIGHT = 300;
  const BALL_SIZE = 32;

  const generatePositions = (count: number): Position[] => {
    return Array.from({ length: count }, () => ({
      x: Math.random() * BOX_WIDTH - 100 - BALL_SIZE,
      y: Math.random() * BOX_HEIGHT - 100 - BALL_SIZE,
    }));
  };

  const startNewRound = () => {
    const ballCount = Math.floor(Math.random() * 2) + 5;
    const ballIds = Array.from({ length: ballCount }, (_, i) => i);
    setBalls(ballIds);
    setPositions(generatePositions(ballCount));

    const randomIndex = Math.floor(Math.random() * ballCount);
    setHighlightedBall(ballIds[randomIndex]);

    setGameState("highlight");
    setRoundInProgress(true); // Round is now in progress

    setTimeout(() => {
      setGameState("shuffle");
    }, 1000);
  };

  useEffect(() => {
    startNewRound(); // Start a new round on mount
  }, []);

  useEffect(() => {
    if (gameState === "shuffle") {
      const shuffleInterval = setInterval(() => {
        setPositions((prev) => generatePositions(prev.length));
      }, 300);

      setTimeout(() => {
        clearInterval(shuffleInterval);
        setGameState("guess");
      }, 1000);

      return () => clearInterval(shuffleInterval);
    }
  }, [gameState]);

  const handleGuess = (ball: number) => {
    if (gameState === "guess") {
      if (ball === highlightedBall) {
        setResultMessage("Correct! 🎉");
        setTimeout(() => {
          setResultMessage(""); // Clear the result message
          setGameState("highlight");
          setStartNewGame(true); // Trigger new game after correct guess
        }, 1000);
      } else {
        setResultMessage("Wrong! 😢");
        setGameState("result");
      }
    }
  };

  const handleReset = () => {
    setGameOver(false); // Reset game over state
    setResultMessage(""); // Clear result message
    startNewRound(); // Immediately restart the game
  };

  return (
    <div className="relative w-full h-full bg-white overflow-hidden flex justify-center items-center mx-auto">
      {balls.map((ball, index) => (
        <div
          key={ball}
          onClick={() => handleGuess(ball)}
          className={`absolute w-8 h-8 rounded-full ${
            gameState === "highlight" && ball === highlightedBall
              ? "bg-yellow-400 border-2 border-black"
              : "bg-blue-500"
          } cursor-pointer`}
          style={{
            transform: `translate(${positions[index]?.x || 0}px, ${
              positions[index]?.y || 0
            }px)`,
            transition:
              gameState === "shuffle" ? "transform 1s" : "transform 0.5s",
          }}
        >
          <img
            src={fish}
            alt="fish"
            width={10}
            height={10}
            className="w-full aspect-square"
          />
        </div>
      ))}

      {gameState === "result" && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black text-white p-4 rounded-lg text-center">
          <h2 className="text-lg font-bold">{resultMessage}</h2>
          <h3 className="mt-2 text-md">{message}</h3> {/* Display the new game message */}
          <button
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={handleReset}
          >
            Reset Game
          </button>
        </div>
      )}
    </div>
  );
};

export default ShuffleGame;
