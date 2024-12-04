import React, { useState, useEffect } from "react";

const CalculationHintCaptcha: React.FC = () => {
  const [x, setX] = useState<number>(Math.floor(Math.random() * 10) + 1);
  const [y, setY] = useState<number>(Math.floor(Math.random() * 10) + 1);
  const [z, setZ] = useState<number>(Math.floor(Math.random() * 10) + 1);
  const [hint, setHint] = useState<string>("");
  const [userInput, setUserInput] = useState<string>("");
  const [feedback, setFeedback] = useState<string>("");

  useEffect(() => {
    // Generate a random hint based on the equation
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
    const userAnswer = parseInt(userInput, 10);
    if (userAnswer === z) {
      setFeedback("Correct! 🎉");
    } else {
      setFeedback("Incorrect, try again! ❌");
    }
  };

  const resetCaptcha = () => {
    setX(Math.floor(Math.random() * 10) + 1);
    setY(Math.floor(Math.random() * 10) + 1);
    setZ(Math.floor(Math.random() * 10) + 1);
    setUserInput("");
    setFeedback("");
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
      {feedback && (
        <button
          onClick={resetCaptcha}
          className="mt-2 text-sm underline text-blue-500 hover:text-blue-700"
        >
          Try Another
        </button>
      )}
    </div>
  );
};

export default CalculationHintCaptcha;
