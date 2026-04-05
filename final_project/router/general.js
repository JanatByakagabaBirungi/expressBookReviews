const axios = require('axios');
const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 6: Register a new user
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    // Check if user already exists
    let existingUser = users.filter((user) => {
      return user.username === username;
    });

    if (existingUser.length > 0) {
      return res.status(409).json({ message: "User already exists!" });
    } else {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    }
  }
  return res.status(400).json({ message: "Unable to register user. Username and/or password are not provided." });
});

// Task 1: Get the book list available in the shop
public_users.get('/', function (req, res) {
  // Send the books object as a neatly formatted JSON string
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Task 2: Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  
  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});
  
// Task 3: Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const matchingBooks = [];
  const keys = Object.keys(books);
  
  // Iterate through the keys & check if the author matches
  for (let key of keys) {
    if (books[key].author === author) {
      matchingBooks.push(books[key]);
    }
  }
  
  if (matchingBooks.length > 0) {
    return res.status(200).json(matchingBooks);
  } else {
    return res.status(404).json({ message: "No books found by this author" });
  }
});

// Task 4: Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const matchingBooks = [];
  const keys = Object.keys(books);
  
  // Iterate through the keys & check if the title matches
  for (let key of keys) {
    if (books[key].title === title) {
      matchingBooks.push(books[key]);
    }
  }
  
  if (matchingBooks.length > 0) {
    return res.status(200).json(matchingBooks);
  } else {
    return res.status(404).json({ message: "No books found with this title" });
  }
});

// Task 5: Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  
  if (book) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;

module.exports.general = public_users;
