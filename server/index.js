const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
// const pg = require("pg");
const supabase = require("./supabaseClient.js");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));
let biases = [];

app.get("/", (req, res) => {
  res.send("Bias Management Backend is running.");
});

app.post("/login", async (req, res) => {
  const { user_name, password } = req.body;
  try {
    // Query user from custom "users" table with matching username and password
    const { data: users, error } = await supabase
      .from("users")
      .select("*")
      .eq("user_name", user_name)
      .eq("password", password)
      .limit(1);

    if (error) {
      console.error("Supabase query error:", error);
      return res
        .status(500)
        .json({ success: false, message: "Database error" });
    }

    if (!users || users.length === 0) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const user = users[0];
    delete user.password;

    return res.json({ success: true, user });
  } catch (err) {
    console.error("Unexpected login error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

app.post("/register", async (req, res) => {
  const { user_name, password } = req.body;

  if (!user_name || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All fields required" });
  }

  try {
    // Check if user already exists
    const { data: existingUsers, error: checkError } = await supabase
      .from("users")
      .select("*")
      .eq("user_name", user_name);

    if (checkError) {
      console.error("Error checking user existence:", checkError);
      return res
        .status(500)
        .json({ success: false, message: "Database error" });
    }

    if (existingUsers.length > 0) {
      return res.status(409).json({
        success: false,
        message: "User name already exists, try another name",
      });
    }

    // Insert new user with hashed password
    const { error: insertError } = await supabase.from("users").insert([
      {
        user_name,
        password,
      },
    ]);

    if (insertError) {
      console.error("Error inserting user:", insertError);
      return res
        .status(500)
        .json({ success: false, message: "Failed to register user" });
    }

    res
      .status(201)
      .json({ success: true, message: "User registered successfully" });
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.listen(process.env.PORT || 4000, () => {
  console.log("Server running");
});
