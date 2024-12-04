import React, { useState } from "react";

const TicTacToeWithAI: React.FC = () => {
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

    for (const [a, b, c] of winningCombinations) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }

    if (board.every((cell) => cell !== "")) {
      return "Draw";
    }

    return null;
  };

  const handlePlayerMove = (index: number) => {
    if (board[index] !== "" || winner || !isPlayerTurn) return;

    const newBoard = [...board];
    newBoard[index] = "X";
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
    newBoard[bestMove] = "O";
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
        currentBoard[i] = "O";
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
    const scores: { [key: string]: number } = { X: -1, O: 1, Draw: 0 };
    const result = checkWinner(board);

    if (result) return scores[result];

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (board[i] === "") {
          board[i] = "O";
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
          board[i] = "X";
          const score = minimax(board, depth + 1, true);
          board[i] = "";
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(""));
    setIsPlayerTurn(true);
    setWinner(null);
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold">Tic Tac Toe (vs AI)</h1>
      <div className="grid grid-cols-3 gap-2">
        {board.map((cell, index) => (
          <button
            key={index}
            onClick={() => handlePlayerMove(index)}
            className={`w-20 h-20 text-2xl font-bold flex items-center justify-center border ${
              cell === "X" ? "text-blue-500" : "text-red-500"
            }`}
          >
            {cell}
          </button>
        ))}
      </div>
      {winner && (
        <div className="text-lg font-semibold">
          {winner === "Draw" ? "It's a Draw!" : `Winner: ${winner}`}
        </div>
      )}
      <button
        onClick={resetGame}
        className="mt-4 py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Restart Game
      </button>
    </div>
  );
};

export default TicTacToeWithAI;
