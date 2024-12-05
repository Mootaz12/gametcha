import React, { createContext, useState, useContext, ReactNode } from "react";

interface GameContextType {
  message: string;
  game: number;
  startNewGame: boolean;
  progress: number;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  setGame: React.Dispatch<React.SetStateAction<number>>;
  setProgress: React.Dispatch<React.SetStateAction<number>>;
  setStartNewGame: React.Dispatch<React.SetStateAction<boolean>>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [message, setMessage] = useState<string>("Welcome to the game!");
  const [game, setGame] = useState<number>(1);
  const [progress, setProgress] = useState<number>(0);
  const [startNewGame, setStartNewGame] = useState<boolean>(true);

  return (
    <GameContext.Provider
      value={{
        message,
        game,
        startNewGame,
        progress,
        setMessage,
        setGame,
        setProgress,
        setStartNewGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = (): GameContextType => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGameContext must be used within a GameProvider");
  }
  return context;
};
