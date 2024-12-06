import React, { useState, useEffect } from "react";
import { useGameContext } from "../context/GameContext"; // Import the context

const predefinedMessages: { [key: number]: string } = {
  1: "The human body and the ocean both depend on water, the molecule essential for life.",
  2: "The human body and seawater share similar salt concentrations and pH balance.",
  5: "The ocean and human sweat share roughly 5 grams of salt per kilogram of water.",
  7: "Seven major electrolytes are common to both human plasma and ocean water.",
};

const CalculationCaptcha: React.FC = () => {
  const { setStartNewGame } = useGameContext(); // Access the context's function
  const [x, setX] = useState<number>(Math.floor(Math.random() * 10) - 5); // Allow x to be negative
  const [y, setY] = useState<number>(Math.floor(Math.random() * 10) - 5); // Allow y to be negative
  const [z, setZ] = useState<number>(Math.floor(Math.random() * 10) - 5); // Allow z to be negative
  const [hint, setHint] = useState<string>("");
  const [userInput, setUserInput] = useState<string>("");
  const [feedback, setFeedback] = useState<string>("");

  useEffect(() => {
    const result = x - y - z;
    const randomHintType = Math.floor(Math.random() * 3);
    if (randomHintType === 0) {
      setHint(`${x} - ${y} - z = ${result}`);
    } else if (randomHintType === 1) {
      setHint(`${x} - z = ${result + y}`);
    } else {
      setHint(`z = ${x - y - result}`);
    }
  }, [x, y, z]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.target.value);
  };

  const handleSubmit = () => {
    const userAnswer = parseFloat(userInput); // Use parseFloat to handle negative numbers
    if (userAnswer === z) {
      const message = predefinedMessages[userAnswer];
      setFeedback(`Correct! 🎉 ${message || ""}`);

      setTimeout(() => {
        setStartNewGame(true); // This will set startNewGame to true, causing a new game to start
      }, 1500);
    } else {
      setFeedback("Incorrect, try again! ❌");
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-4 border rounded-md shadow-md bg-white w-96">
      <h2 className="text-lg font-bold">Solve for "z"</h2>
      <div className="text-xl font-mono">{hint}</div>
      <input
        type="number"
        value={userInput}
        onChange={handleInputChange}
        className="border rounded-md p-2 w-full text-center text-lg"
        placeholder="Enter your answer for z"
      />
      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
      >
        Submit
      </button>
      {feedback && (
        <div
          className={`text-lg font-semibold ${
            feedback.includes("Correct") ? "text-green-500" : "text-red-500"
          }`}
        >
          {feedback}
        </div>
      )}
    </div>
  );
};

export default CalculationCaptcha;
