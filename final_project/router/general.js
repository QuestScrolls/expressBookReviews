const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();



public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
    // Check if the user does not already exist
    if (!isValid(username)) {
      // Add the new user to the users array
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } 
    else {
      return res.status(404).json({message: "User already exists!"});
    }
  } else {
    // Return error if username or password is missing
    return res.status(404).json({message: "Provied Your Username and Password."});
  }  
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  
  res.send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn
  // Check if the book with the given ISBN exists
  if (isbn) {
    // Return the book details if found
    res.send(books[isbn]);
  } else {
    // Return a 404 error if not found
    res.status(404).send('Book not found');
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const filteredAuhthor = Object.keys(books).filter((isbn) => books[isbn].author === author);
  if (books[filteredAuhthor]) {
    // Return the reviews for the specific book
    return res.json(books[filteredAuhthor]);
  } else {
    // Return a 404 error if the book doesn't exist
    return res.status(404).json({ message: "Book not found" });
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title
  const filteredTitle = Object.keys(books).filter((isbn) => books[isbn].title === title);
  if (books[filteredTitle]) {
    // Return the reviews for the specific book
    return res.json(books[filteredTitle]);
  } else {
    // Return a 404 error if the book doesn't exist
    return res.status(404).json({ message: "Book not found" });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn
  // Check if the book with the given ISBN exists
  if (books[isbn]) {
    // Return the reviews for the specific book
    return res.json(books[isbn].reviews);
  } else {
    // Return a 404 error if the book doesn't exist
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
