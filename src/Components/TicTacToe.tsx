import React, { useState, useEffect } from "react";
import { useGameContext } from "../context/GameContext";

const TicTacToe: React.FC = () => {
  const { setStartNewGame, setFailCondition } = useGameContext();
  const [board, setBoard] = useState<string[]>(Array(9).fill(""));
  const [isPlayerTurn, setIsPlayerTurn] = useState<boolean>(true);
  const [winner, setWinner] = useState<string | null>(null);

  const checkWinner = (board: string[]) => {
    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    // Check for player win
    for (const [a, b, c] of winningCombinations) {
      if (
        board[a] &&
        board[a] === board[b] &&
        board[a] === board[c] &&
        board[a] === "❤️"
      ) {
        return "❤️";
      }
    }

    // Check for AI win
    for (const [a, b, c] of winningCombinations) {
      if (
        board[a] &&
        board[a] === board[b] &&
        board[a] === board[c] &&
        board[a] === "🐟"
      ) {
        return "🐟";
      }
    }

    // Check for draw
    if (board.every((cell) => cell !== "")) {
      return "Draw";
    }

    return null;
  };

  const handlePlayerMove = (index: number) => {
    if (board[index] !== "" || winner || !isPlayerTurn) return;

    const newBoard = [...board];
    newBoard[index] = "❤️";
    setBoard(newBoard);

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
    } else {
      setIsPlayerTurn(false);
      setTimeout(() => handleAIMove(newBoard), 500);
    }
  };

  const handleAIMove = (newBoard: string[]) => {
    const bestMove = findBestMove(newBoard);
    newBoard[bestMove] = "🐟";
    setBoard(newBoard);

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
    } else {
      setIsPlayerTurn(true);
    }
  };

  const findBestMove = (currentBoard: string[]) => {
    let bestScore = -Infinity;
    let move = -1;

    for (let i = 0; i < 9; i++) {
      if (currentBoard[i] === "") {
        currentBoard[i] = "🐟";
        const score = minimax(currentBoard, 0, false);
        currentBoard[i] = "";
        if (score > bestScore) {
          bestScore = score;
          move = i;
        }
      }
    }

    return move;
  };

  const minimax = (
    board: string[],
    depth: number,
    isMaximizing: boolean
  ): number => {
    const scores: { [key: string]: number } = { "❤️": -1, "🐟": 1, Draw: 0 };
    const result = checkWinner(board);

    if (result) return scores[result];

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (board[i] === "") {
          board[i] = "🐟";
          const score = minimax(board, depth + 1, false);
          board[i] = "";
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 9; i++) {
        if (board[i] === "") {
          board[i] = "❤️";
          const score = minimax(board, depth + 1, true);
          board[i] = "";
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  };

  useEffect(() => {
    if (winner) {
      if (winner === "❤️") {
        // Player wins (X)
        setStartNewGame(true);
      } else if (winner === "Draw") {
        // Draw case
        setStartNewGame(true); // Optionally restart on draw
      } else {
        // AI wins (O)
        setFailCondition(true); // Trigger failure condition for AI win
        setStartNewGame(false); // Prevent new game until player restarts
      }
    }
  }, [winner, setStartNewGame, setFailCondition]);

  const restartGame = () => {
    setBoard(Array(9).fill("")); // Reset the board
    setWinner(null); // Reset winner
    setIsPlayerTurn(true); // Start with player's turn
    setFailCondition(false); // Reset failure condition
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold">Tic Tac Toe</h1>
      <div className="grid grid-cols-3 gap-2">
        {board.map((cell, index) => (
          <button
            key={index}
            onClick={() => handlePlayerMove(index)}
            className={`w-20 h-20 text-2xl font-bold flex items-center justify-center border ${
              cell === "❤️" ? "text-blue-500" : "text-red-500"
            }`}
          >
            {cell}
          </button>
        ))}
      </div>
      {winner && (
        <div className="mt-4 text-xl font-bold">
          {winner === "Draw" ? "It's a Draw!" : `Winner: ${winner}`}
        </div>
      )}

      {/* Restart button if the player loses or game is a draw */}
      {winner && winner !== "❤️" && (
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

export default TicTacToe;
