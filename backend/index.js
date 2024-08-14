const express = require("express");
const cors = require("cors");
const { Client } = require("pg");

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());

const client = new Client({
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: "MahRei@43",
  database: "pollApp",
});
client
  .connect()
  .then(() => {
    console.log("Connected to PostgreSQL database");
  })
  .catch((err) => {
    console.error("Error connecting to PostgreSQL database", err);
  });

// SSE Support
app.get("/api/polls/sse", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const sendUpdates = () => {
    // Get the updated poll data from the database
    client.query("SELECT * FROM polls", (error, results) => {
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
  /* I have connected to my PostgreSQL database with my Express JS API, now query the database to get poll data. */
  try {
    client.query("SELECT * FROM polls", (error, results) => {
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
  // TODO: Handles POST requests for new poll data and inserts the data into my table poll with the databse schema of id, title, options (array), created_at, updated_at
  try {
    client.query(
      "INSERT INTO polls (title, options) VALUES ($1, $2)",
      [req.body.title, req.body.options],
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
  // TODO: Handles GET requests for individual poll data by collecting the data from my table poll with the databse schema of id, title, options (array), created_at, updated_at
  try {
    client.query(
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
  // TODO: Handles PUT requests for individual poll data by updating the data in my table poll with the databse schema of id, title, options (array), created_at, updated_at
  try {
    client.query(
      "UPDATE polls SET title = $1, options = $2 WHERE id = $3",
      [req.body.title, req.body.options, req.params.id],
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
  // TODO: Handles POST requests for votes and inserts the data into my table votes with the database schema of id, user_id, poll_id, option_index, created_at
  try {
    client.query(
      "INSERT INTO votes (user_id, poll_id, option_index) VALUES ($1, $2, $3)",
      [req.body.user_id, req.body.poll_id, req.body.option_index],
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
  // TODO: Handles POST requests for discussion messages and inserts the data into my table discussions with the database schema of id, poll_id, user_id, message, created_at
  try {
    client.query(
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
