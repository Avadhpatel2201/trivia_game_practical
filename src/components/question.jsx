import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Question = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [userResponses, setUserResponses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
  const fetchQuestions = async () => {
    const cachedQuestions = localStorage.getItem("questions");
    if (cachedQuestions) {
      setQuestions(JSON.parse(cachedQuestions));
    } else {
      try {
        const response = await fetch("https://opentdb.com/api.php?amount=10");
        if (response.status === 429) {
          console.error("Too many requests, try again later.");
          return;
        }
        const data = await response.json();
        setQuestions(data.results);
        localStorage.setItem("questions", JSON.stringify(data.results));
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    }
  };

  fetchQuestions();
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
      navigate("/results", { state: { userResponses } });
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedOption(null);
      setIsCorrect(null);
    }
  };

  const handleSkipQuestion = () => {
    setSelectedOption(null);
    setIsCorrect(null);

    setUserResponses((prevResponses) => [
      ...prevResponses,
      {
        question: questions[currentQuestionIndex].question,
        selectedOption: null,
        correctAnswer: questions[currentQuestionIndex].correct_answer,
        isCorrect: false,
        skipped: true,
      },
    ]);

    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
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
      <h4>
        Question {currentQuestionIndex + 1} of {questions.length}
      </h4>
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
      <div>
        <button
          type="button"
          className="btnSpacing"
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </button>
        <button
        type="button"
        className="btnSpacing"
        onClick={handleSubmit}
        disabled={selectedOption === null || isCorrect !== null}
      >
        Submit
      </button>
        <button
          type="button"
          className="btnSpacing"
          onClick={handleSkipQuestion}
          disabled={isCorrect !== null}
        >
          Skip
        </button>
      </div>

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
              <p>Explanation: We can add explanation about the answer here but there is no explanation<br/> in api response so i we need to add explanation about every questions in api.</p>
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
