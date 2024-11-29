// general.js
import express from "express";
import books from "./booksdb.js"; // Default import
import { users } from "./auth_users.js"; // Import users from auth_users.js
const public_users = express.Router();

public_users.post("/register", (req, res) => {
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

// Route to get book details by ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    res.json(book);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  const matchingBooks = [];

  for (const key in books) {
    if (books[key].author.toLowerCase() === author.toLowerCase()) {
      matchingBooks.push(books[key]);
    }
  }

  if (matchingBooks.length > 0) {
    res.json(matchingBooks);
  } else {
    res.status(404).json({ message: "No books found for the given author" });
  }
});

public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  const matchingBooks = [];

  for (const key in books) {
    if (books[key].title.toLowerCase() === title.toLowerCase()) {
      matchingBooks.push(books[key]);
    }
  }

  if (matchingBooks.length > 0) {
    res.json(matchingBooks);
  } else {
    res.status(404).json({ message: "No books found with the given title" });
  }
});

public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    res.json(books[isbn].reviews);
  } else {
    res.status(404).json({ message: "Book not found with the given ISBN" });
  }
});

export { public_users };
