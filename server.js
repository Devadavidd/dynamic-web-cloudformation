const express = require("express");
const mysql = require("mysql2/promise");
const AWS = require("aws-sdk");
const path = require("path");

const app = express();
const port = 3000;

// Configure AWS SDK
AWS.config.update({
  region: "us-east-1",
  accessKeyId: "ASIATO6BM46T7MMOUAYU",
  secretAccessKey: "Q7Zwl6FZkPCdOnohK7pr8aV7wZfBr+XkwqoR20Ng",
}); // Replace "your-region" with your AWS region

const ssm = new AWS.SSM();

// Middleware for JSON parsing
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Function to get database configuration from Parameter Store
async function getDbConfig() {
  try {
    const parameters = await ssm
      .getParameters({
        Names: ["/db/host", "/db/user", "/db/password", "/db/name"],
        WithDecryption: true, // Decrypt secure strings
      })
      .promise();

    const dbConfig = {};
    parameters.Parameters.forEach((param) => {
      const key = param.Name.split("/").pop(); // Extract the parameter name
      dbConfig[key] = param.Value;
    });

    return {
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
      database: dbConfig.name,
    };
  } catch (error) {
    console.error("Error fetching parameters:", error);
    throw new Error("Failed to retrieve database configuration");
  }
}

// Add a new user
app.post("/add", async (req, res) => {
  const { name, email } = req.body;

  try {
    const dbConfig = await getDbConfig();
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
    const dbConfig = await getDbConfig();
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
