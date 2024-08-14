import React from 'react';

const PollDetail = ({ poll }) => {
  return (
    <div>
      <h2>{poll.title}</h2>
      <ul>
        {poll.options.map((option, index) => (
          <li key={index}>{option}</li>
        ))}
      </ul>
      <ul>
        {poll.results.map((result, index) => (
          <li key={index}>{result}</li>
        ))}
      </ul>
    </div>
  );
};

export default PollDetail;


