const express = require("express");
const mysql = require("mysql2/promise");
const path = require("path");

const app = express();
const port = 3000;

// Middleware for JSON parsing
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Database connection
const dbConfig = {
  host: "your-database-host",
  user: "your-database-username",
  password: "your-database-password",
  database: "your-database-name",
};

// Add a new user
app.post("/add", async (req, res) => {
  const { name, email } = req.body;

  try {
    const connection = await mysql.createConnection(dbConfig);
    await connection.execute("INSERT INTO users (name, email) VALUES (?, ?)", [name, email]);
    await connection.end();

    res.status(200).json({ message: "User added successfully!" });
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ error: "Failed to add user" });
  }
});

// Get all users
app.get("/users", async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.query("SELECT * FROM users");
    await connection.end();

    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
