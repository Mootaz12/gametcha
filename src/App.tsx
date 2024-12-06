import React from "react";
import useGames from "./hooks/useGames";
import CalculationCaptcha from "./Components/CalculationCaptcha";
import ClickerGame from "./Components/ClickerGame";
import MovingBarGame from "./Components/MovingBarGame";
import PlayfulCaptcha from "./Components/PlayfulCaptcha";
import QuizGame from "./Components/QuizGame";
import SimonSays from "./Components/SimonSays";
import TicTacToe from "./Components/TicTacToe";
import CustomCaptcha from "./Components/CustomCaptcha";
import ShuffleGame from "./Components/ShuffleGame";

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
        return <ShuffleGame />;
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
      <CustomCaptcha>
        {gameId !== null ? getComponentById(gameId) : null}
      </CustomCaptcha>
    </div>
  );
};

export default App;
