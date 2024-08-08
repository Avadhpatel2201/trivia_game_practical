import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Question = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [userResponses, setUserResponses] = useState([]);
  const navigate = useNavigate(); // Using useNavigate for navigation

  useEffect(() => {
    // Fetch questions from the API
    fetch("https://opentdb.com/api.php?amount=10")
      .then((response) => response.json())
      .then((data) => setQuestions(data.results))
      .catch((error) => console.error("Error fetching questions:", error));
  }, []);

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    const correctAnswer = questions[currentQuestionIndex].correct_answer;
    const isAnswerCorrect = selectedOption === correctAnswer;

    // Save the user's response
    setUserResponses((prevResponses) => [
      ...prevResponses,
      {
        question: questions[currentQuestionIndex].question,
        selectedOption,
        correctAnswer,
        isCorrect: isAnswerCorrect,
      },
    ]);

    setIsCorrect(isAnswerCorrect);
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsCorrect(null);

    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Redirect to results page after all questions
      navigate("/results", { state: { userResponses } });
    }
  };

  if (!questions || questions.length === 0) {
    return <div>Loading questions...</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const options = [
    ...currentQuestion.incorrect_answers,
    currentQuestion.correct_answer,
  ].sort();

  return (
    <div>
      <h4 id="question">{currentQuestion.question}</h4>
      <div>
        {options.map((option, index) => (
          <div
            key={index}
            style={{
              border:
                selectedOption === option
                  ? "2px solid rgb(7, 119, 217)"
                  : "1px solid white",
              color: selectedOption === option ? "rgb(7, 119, 217)" : "white",
              padding: "5px",
              margin: "5px 0",
              cursor: "pointer",
            }}
            onClick={() => handleOptionChange(option)}
          >
            {option}
          </div>
        ))}
      </div>
      <button
        type="button"
        className="btnSpacing"
        onClick={handleSubmit}
        disabled={selectedOption === null || isCorrect !== null}
      >
        Submit
      </button>

      {isCorrect !== null && (
        <div>
          {isCorrect ? (
            <p style={{ color: "green" }}>Correct!</p>
          ) : (
            <div>
              <p style={{ color: "red" }}>Wrong!</p>
              <p>
                Correct Answer:{" "}
                <strong>{currentQuestion.correct_answer}</strong>
              </p>
              <p>Explanation: Explanation about the answer.</p>{" "}
              {/* Add explanation if available */}
            </div>
          )}
          <button
            type="button"
            className="btnSpacing"
            onClick={handleNextQuestion}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Question;
