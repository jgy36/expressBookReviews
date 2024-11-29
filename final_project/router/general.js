import express from "express";
import axios from "axios";  // Importing axios
import books from "./booksdb.js"; // Default import
import { users } from "./auth_users.js"; // Import users from auth_users.js

const public_users = express.Router();

// Route to register a user
public_users.post("/register", async (req, res) => {
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

// Route to get all books
public_users.get("/books", async (req, res) => {
    try {
      const allBooks = await Promise.resolve(Object.values(books));
  
      if (allBooks.length > 0) {
        return res.json(allBooks);
      } else {
        return res.status(404).json({ message: "No books found" });
      }
    } catch (error) {
      return res.status(500).json({ message: "Error retrieving books", error });
    }
  });
  
  // Route to get book details by ISBN
  public_users.get("/isbn/:isbn", async (req, res) => {
    const isbn = req.params.isbn;
  
    try {
      const book = await Promise.resolve(books[isbn]);
  
      if (book) {
        return res.json(book);
      } else {
        return res.status(404).json({ message: "Book not found" });
      }
    } catch (error) {
      return res.status(500).json({ message: "Error retrieving book by ISBN", error });
    }
  });
  
  // Route to get books by author
  public_users.get("/author/:author", async (req, res) => {
    const author = req.params.author;
    const matchingBooks = [];
  
    try {
      await Promise.resolve(
        Object.values(books).forEach((book) => {
          if (book.author.toLowerCase() === author.toLowerCase()) {
            matchingBooks.push(book);
          }
        })
      );
  
      if (matchingBooks.length > 0) {
        return res.json(matchingBooks);
      } else {
        return res.status(404).json({ message: "No books found for the given author" });
      }
    } catch (error) {
      return res.status(500).json({ message: "Error retrieving books by author", error });
    }
  });
  
  // Route to get books by title
  public_users.get("/title/:title", async (req, res) => {
    const title = req.params.title;
    const matchingBooks = [];
  
    try {
      await Promise.resolve(
        Object.values(books).forEach((book) => {
          if (book.title.toLowerCase() === title.toLowerCase()) {
            matchingBooks.push(book);
          }
        })
      );
  
      if (matchingBooks.length > 0) {
        return res.json(matchingBooks);
      } else {
        return res.status(404).json({ message: "No books found with the given title" });
      }
    } catch (error) {
      return res.status(500).json({ message: "Error retrieving books by title", error });
    }
  });

// Route to get reviews for a specific book by ISBN
public_users.get("/review/:isbn", async (req, res) => {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.json(books[isbn].reviews);
  } else {
    return res.status(404).json({ message: "Book not found with the given ISBN" });
  }
});

export { public_users };
