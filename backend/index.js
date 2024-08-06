const express = require("express");
const cors = require("cors");
const dbConfig = require("../config/db.config");
const { Pool } = require("pg");
const AWS = require("aws-sdk");

const PORT = process.env.PORT || 5000;
const pool = new Pool(dbConfig);

const app = express();
app.use(cors());
app.use(express.json());

// SSE Support
app.get("/api/polls/sse", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const sendUpdates = () => {
    // Get the updated poll data from the database
    pool.query("SELECT * FROM polls", (error, results) => {
      if (error) {
        console.log(error);
        return;
      }
      // Send the updated data to the client
      res.write(`data: ${JSON.stringify(results.rows)}\n\n`);
    });
  };

  // Send updates every second
  const intervalId = setInterval(sendUpdates, 1000);

  // Stop sending updates when the client disconnects
  req.on("close", () => {
    clearInterval(intervalId);
  });
});

app.get("/", (req, res) => {
  res.send("Hello world");
});

// Endpoints for Poll data
app.get("/api/polls", (req, res) => {
  /* I have connected Amazon Aurora PostgreSQL database with my Express JS API, now query the database to get poll data. */
  try {
    pool.query("SELECT * FROM polls", (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(results.rows);
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/api/polls", (req, res) => {
  // TODO: Handles POST requests for new poll data
  try {
    pool.query(
      "INSERT INTO polls (question, options) VALUES ($1, $2)",
      [req.body.question, req.body.options],
      (error, results) => {
        if (error) {
          throw error;
        }
        res.status(201).send("Poll created successfully.");
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/api/polls:id", (req, res) => {
  // TODO: Handles GET requests for individual poll data
  try {
    pool.query(
      "SELECT * FROM polls WHERE id = $1",
      [req.params.id],
      (error, results) => {
        if (error) {
          throw error;
        }
        res.status(200).json(results.rows);
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

app.put("/api/polls:id", (req, res) => {
  // TODO: Handles PUT requests for individual poll data
  try {
    pool.query(
      "UPDATE polls SET question = $1, options = $2 WHERE id = $3",
      [req.body.question, req.body.options, req.params.id],
      (error, results) => {
        if (error) {
          throw error;
        }
        res.status(200).send("Poll updated successfully.");
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

// Endpoint for Votes
app.post("/api/votes", (req, res) => {
  // TODO: Handles POST requests for votes
  try {
    pool.query(
      "INSERT INTO votes (poll_id, option_id) VALUES ($1, $2)",
      [req.body.poll_id, req.body.option_id],
      (error, results) => {
        if (error) {
          throw error;
        }
        res.status(201).send("Vote created successfully.");
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

// Endpoints for Discussions
app.post("/api/discussions", (req, res) => {
  // TODO: Handles POST requests for discussion messages
  try {
    pool.query(
      "INSERT INTO discussions (poll_id, user_id, message) VALUES ($1, $2, $3)",
      [req.body.poll_id, req.body.user_id, req.body.message],
      (error, results) => {
        if (error) {
          throw error;
        }
        res.status(201).send("Discussion created successfully.");
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
