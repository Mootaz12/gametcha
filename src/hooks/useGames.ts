import { useState, useEffect } from "react";
import { useGameContext } from "../context/GameContext";

const games = [
  { id: 1, message: "Solve the math problem!" },
  { id: 2, message: "Click as fast as you can!" },
  { id: 3, message: "Complete the CAPTCHA!" },
  { id: 4, message: "Play Pong against AI!" },
  { id: 5, message: "Answer the quiz questions!" },
  { id: 6, message: "Follow Simon’s commands!" },
  { id: 7, message: "Play Tic-Tac-Toe!" },
  { id: 8, message: "Answer the quiz questions again!" },
];

const useGames = () => {
  const { startNewGame, setStartNewGame } = useGameContext();
  const [gameId, setGameId] = useState<number | null>(null);
  const [message, setMessage] = useState<string>("Welcome to the game!");

  useEffect(() => {
    if (startNewGame) {
      let newGameId;

      do {
        newGameId = Math.floor(Math.random() * games.length) + 1;
      } while (newGameId === gameId);

      setGameId(newGameId);
      setMessage(
        games.find((game) => game.id === newGameId)?.message || "Game started!"
      );

      setStartNewGame(false);
    }
  }, [startNewGame, gameId, setStartNewGame]);

  return {
    message,
    gameId,
  };
};

export default useGames;
