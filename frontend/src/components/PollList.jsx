/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";

const PollList = () => {
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    async function fetchPolls() {
      try {
        const response = await fetch("http://localhost:3000/api/polls");
        const data = await response.json();
        setPolls(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchPolls();
  }, []);

  return (
    <div>
      <h1>Poll List</h1>
      <ul>
        {polls.map((poll) => (
          <li key={poll.poll_id}>
            <h2>{poll.title}</h2>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PollList;
