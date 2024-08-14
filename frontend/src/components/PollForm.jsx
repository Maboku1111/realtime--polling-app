/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const PollForm = () => {
  const [title, setTitle] = useState("");
  const [options, setOptions] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newPoll = { title, options };
    try {
      const response = await axios.post(
        "http://localhost:3000/api/polls",
        newPoll
      );
      console.log(response.data);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddOption = () => {
    setOptions([...options, ""]);
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Title:
        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </label>
      <br />
      {options.map((option, index) => (
        <label key={index}>
          Option {index + 1}:
          <input
            type="text"
            value={option}
            onChange={(event) => handleOptionChange(index, event.target.value)}
          />
        </label>
      ))}
      <button type="button" onClick={handleAddOption}>
        Add Option
      </button>
      <br />
      <button type="submit">Create Poll</button>
    </form>
  );
};

export default PollForm;
