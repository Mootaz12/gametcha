import { useState, useEffect } from "react";
import { useGameContext } from "../context/GameContext";

const games = [
  { id: 1, message: "Solve the math problem!" },
  { id: 2, message: "Click as fast as you can!" },
  { id: 3, message: "Complete the CAPTCHA!" },
  { id: 5, message: "Answer the quiz questions!" },
  { id: 6, message: "Follow Simon’s commands!" },
  { id: 7, message: "Play Tic-Tac-Toe!" },
  { id: 8, message: "Answer the quiz questions again!" },
];

const useGames = () => {
  const { startNewGame, setStartNewGame } = useGameContext();
  const [gameId, setGameId] = useState<number | null>(null);
  const [message, setMessage] = useState<string>("Welcome to the game!");
  const [previouslySelectedGames, setPreviouslySelectedGames] = useState<
    number[]
  >([]);
  const [gamesCompleted, setGamesCompleted] = useState<boolean>(false);

  useEffect(() => {
    if (!startNewGame || gamesCompleted) return;

    if (previouslySelectedGames.length === games.length) {
      // End the game loop and display a final message
      setGamesCompleted(true);
      setMessage("Captcha Verified!");
      setGameId(null); // No more games to display
      return;
    }

    let newGameId: number;
    const availableGames = games
      .map((game) => game.id)
      .filter((id) => !previouslySelectedGames.includes(id));

    if (availableGames.length === 0) {
      console.error("No available games to select from!");
      return;
    }

    // Randomly select a game from the remaining available games
    // eslint-disable-next-line prefer-const
    newGameId =
      availableGames[Math.floor(Math.random() * availableGames.length)];

    setGameId(newGameId);
    setMessage(games.find((game) => game.id === newGameId)?.message || "");

    // Update previously selected games
    setPreviouslySelectedGames((prev) => [...prev, newGameId]);

    // Reset startNewGame flag
    setStartNewGame(false);
  }, [startNewGame, previouslySelectedGames, gamesCompleted, setStartNewGame]);

  return {
    message,
    gameId,
    gamesCompleted,
  };
};

export default useGames;
