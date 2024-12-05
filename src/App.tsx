import React from "react";
import useGames from "./hooks/useGames";
import CalculationCaptcha from "./Components/CalculationCaptcha";
import ClickerGame from "./Components/ClickerGame";
import MovingBarGame from "./Components/MovingBarGame";
import PlayfulCaptcha from "./Components/PlayfulCaptcha";
import PongGame from "./Components/PongGame";
import QuizGame from "./Components/QuizGame";
import SimonSays from "./Components/SimonSays";
import TicTacToe from "./Components/TicTacToe";

const App: React.FC = () => {
  const { message, gameId } = useGames();

  const getComponentById = (id: number) => {
    switch (id) {
      case 1:
        return <CalculationCaptcha />;
      case 2:
        return <ClickerGame />;
      case 3:
        return <PlayfulCaptcha />;
      case 4:
        return <PongGame />;
      case 5:
        return <QuizGame />;
      case 6:
        return <SimonSays />;
      case 7:
        return <TicTacToe />;
      case 8:
        return <MovingBarGame />;
      default:
        return null;
    }
  };

  return (
    <div className="flex justify-center items-center h-screen flex-col">
      <h1>{message}</h1>
      {gameId !== null ? getComponentById(gameId) : null}
    </div>
  );
};

export default App;
