import CalculationCaptcha from "./Components/CalculationCaptcha";
import ClickerGame from "./Components/ClickerGame";
import MovingBarGame from "./Components/MovingBarGame";
import PlayfulCaptcha from "./Components/PlayfulCaptcha";
import SinglePlayerMode from "./Components/PongGame";
import QuizGame from "./Components/QuizGame";
import ShuffleGame from "./Components/ShuffleGame";
import SimonSays from "./Components/SimonSays";
import TicTacToe from "./Components/TicTacToe";

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      <ShuffleGame />
    </div>
  );
}

export default App;
