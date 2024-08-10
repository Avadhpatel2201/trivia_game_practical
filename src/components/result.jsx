import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const Results = () => {
  const location = useLocation();
  const userResponses = location.state?.userResponses || [];

  const totalCorrect = userResponses.filter((res) => res.isCorrect).length;
  const totalIncorrect = userResponses.length - totalCorrect;

  const clearCacheAndFetchNewQuestions = async () => {
    localStorage.removeItem("questions");
    // await fetchQuestions();
  };

  return (
    <div><hr />
      <h2>Quiz Results</h2>
      <hr />
      <p>Total Questions Served: {userResponses.length}</p>
      <p>Total Correct Questions: {totalCorrect}</p>
      <p>Total Incorrect Questions: {totalIncorrect}</p>

<div ><hr />
      <h3>Review Your Answers</h3>
      <hr />
      <div className='review_div'>
        {userResponses.map((response, index) => (
          <div key={index} style={{ marginBottom: '20px' }}>
            <h4>Question {index + 1}: {response.question}</h4>
            <div>
              {response.correctAnswer === response.selectedOption ? (
                <p style={{
                  border: '2px solid green',
                  color: 'green',
                  padding: '5px'
                }}>
                  Your Answer: {response.selectedOption} (Correct)
                </p>
              ) : (
                <div>
                  <p style={{
                    border: '2px solid red',
                    color: 'red',
                    backgroundColor: '#ffe5e5',
                    padding: '5px'
                  }}>
                    Your Answer: {response.selectedOption} (Incorrect)
                  </p>
                  <p style={{
                    border: '2px solid green',
                    color: 'green',
                    padding: '5px'
                  }}>
                    Correct Answer: {response.correctAnswer}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      </div>
      <button onClick={clearCacheAndFetchNewQuestions}><Link to='/' style={{color: "white"}}>Play again</Link></button>
    </div>

  );
};

export default Results;
