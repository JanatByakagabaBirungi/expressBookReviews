const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username, password) => {
  // Filter the users array to find a match for both username and password
  let validusers = users.filter((user) => {
    return (user.username === username && user.password === password);
  });
  // Return true if a match is found, false otherwise
  return validusers.length > 0;
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    // Generate JWT access token
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    // Store access token and username in session
    req.session.authorization = {
      accessToken, username
    };
    return res.status(200).send("Customer successfully logged in");
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  let book = books[isbn];

  if (book) {
    let review = req.query.review;
    let reviewer = req.session.authorization['username'];

    if (review) {
      // Add or update the review for this specific user
      book.reviews[reviewer] = review;
      return res.status(200).send(`The review for the book with ISBN ${isbn} has been added/updated.`);
    } else {
      return res.status(400).send("Please provide a review.");
    }
  } else {
    return res.status(404).send("Unable to find this book!");
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  let book = books[isbn];

  if (book) {
    let reviewer = req.session.authorization['username'];

    // Check if the user has a review for this book
    if (book.reviews[reviewer]) {
      delete book.reviews[reviewer];
      return res.status(200).send(`Reviews for the ISBN ${isbn} posted by the user ${reviewer} deleted.`);
    } else {
      return res.status(404).send("Review not found for this user.");
    }
  } else {
    return res.status(404).send("Unable to find this book!");
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
