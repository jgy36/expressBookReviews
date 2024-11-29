import express from "express";
import jwt from "jsonwebtoken";
let users = {};
import books from "./booksdb.js";


const isValid = (username) => {
  return username && typeof username === "string" && username.trim().length > 0;
};

const authenticatedUser = (username, password) => {
  if (users[username] && users[username].password === password) {
    return true;
  }
  return false;
};

const regd_users = express.Router();

regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!isValid(username)) {
    return res.status(400).json({ message: "Invalid username" });
  }

  if (authenticatedUser(username, password)) {
    const token = jwt.sign({ username }, "access", { expiresIn: "1h" });

    req.session.authorization = { accessToken: token };

    return res.status(200).json({ message: "Login successful", token });
  } else {
    return res.status(401).json({ message: "Invalid username or password" });
  }
});

regd_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  if (users[username]) {
    return res.status(409).json({ message: "Username already exists" });
  }

  users[username] = { password };
  return res.status(201).json({ message: "User registered successfully" });
});


regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = parseInt(req.params.isbn);
  const { review } = req.body;
  const username = req.user?.username;

  if (!username) {
    return res.status(403).json({ message: "User not authenticated" });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: `Book with ID ${isbn} not found` });
  }

  books[isbn].reviews = books[isbn].reviews || {};
  books[isbn].reviews[username] = review;

  return res.status(200).json({
    message: "Review added/updated successfully",
    reviews: books[isbn].reviews,
  });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = parseInt(req.params.isbn);
    const username = req.user?.username;
  
    if (!username) {
      return res.status(403).json({ message: "User not authenticated" });
    }
  
    if (!books[isbn]) {
      return res.status(404).json({ message: `Book with ID ${isbn} not found` });
    }
  
    if (!books[isbn].reviews || !books[isbn].reviews[username]) {
      return res.status(404).json({ message: "Review not found for this user" });
    }
  
    delete books[isbn].reviews[username];
  
    return res.status(200).json({
      message: "Review deleted successfully",
      reviews: books[isbn].reviews,
    });
  });
  
  
  

export { regd_users, isValid, users };
