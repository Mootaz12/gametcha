import React, { useState } from "react";

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

const questions: Question[] = [
  {
    question:
      "What percentage of the human body is water, similar to the ocean?",
    options: ["50%", "60%", "70%", "80%"],
    correctAnswer: "70%",
  },
  {
    question:
      "Which mineral found in seawater is also crucial for human muscle contraction?",
    options: ["Calcium", "Potassium", "Sodium", "Magnesium"],
    correctAnswer: "Sodium",
  },
  {
    question:
      "The rhythm of ocean waves is often compared to what human bodily function?",
    options: ["Heartbeat", "Breathing", "Blinking", "Digestion"],
    correctAnswer: "Breathing",
  },
  {
    question:
      "How does the ocean regulate the Earth's temperature, benefiting human life?",
    options: [
      "It absorbs and stores heat",
      "It reflects sunlight into space",
      "It provides fresh water",
      "It filters carbon dioxide",
    ],
    correctAnswer: "It absorbs and stores heat",
  },
  {
    question: "What ocean element is essential for human thyroid health?",
    options: ["Iron", "Iodine", "Phosphorus", "Zinc"],
    correctAnswer: "Iodine",
  },
];

const QuizGame: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string>("");

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerClick = (answer: string) => {
    setSelectedAnswer(answer);
    if (answer === currentQuestion.correctAnswer) {
      setFeedback("Correct! 🎉");
      setScore((prev) => prev + 1);
    } else {
      setFeedback(
        `Incorrect! The correct answer is ${currentQuestion.correctAnswer}.`
      );
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setFeedback("");
    } else {
      setFeedback("Quiz Complete! 🎊");
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setFeedback("");
  };

  return (
    <div className="flex flex-col items-center space-y-6 p-6 border rounded-md shadow-md bg-white w-96">
      <h2 className="text-xl font-bold text-center">
        Ocean & Human Connection Quiz
      </h2>

      {currentQuestionIndex < questions.length ? (
        <>
          <div className="text-lg font-semibold text-center">
            {currentQuestion.question}
          </div>
          <div className="flex flex-col space-y-2">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerClick(option)}
                className={`py-2 px-4 rounded-md border ${
                  selectedAnswer
                    ? option === currentQuestion.correctAnswer
                      ? "bg-green-500 text-white"
                      : option === selectedAnswer
                      ? "bg-red-500 text-white"
                      : "bg-gray-200"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
                disabled={!!selectedAnswer}
              >
                {option}
              </button>
            ))}
          </div>
          {feedback && (
            <div className="text-center font-medium">{feedback}</div>
          )}
          {selectedAnswer && (
            <button
              onClick={handleNextQuestion}
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
            >
              Next Question
            </button>
          )}
        </>
      ) : (
        <>
          <div className="text-lg font-semibold">
            Your Score: {score}/{questions.length}
          </div>
          <button
            onClick={handleRestart}
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            Restart Quiz
          </button>
        </>
      )}
    </div>
  );
};

export default QuizGame;
