const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{ "username": "user", "password": "pwd123" }];

const isValid = (username)=>{
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
};

const authenticatedUser = (username,password)=>{ 
  // Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
      const { username, password } = req.body;
  
      // Check if username or password is missing
      if (!username || !password) {
          return res.status(404).json({ message: "Provide Username and Password"});
      }
  
      // Authenticate user
      if (authenticatedUser(username, password)) {
          // Generate JWT access token
          let accessToken = jwt.sign({
              data: password
          }, 'access', { expiresIn: 60 * 60 });
  
          // Store access token and username in session
          req.session.authorization = {
              accessToken, username
          }
          return res.status(200).send("User successfully logged in");
      } else {
          return res.status(208).json({ message: "Invalid Login. Check username and password" });
      }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const reviewText = req.query.review;
    const username = req.session.authorization?.username;

    if (!username) {
        return res.status(401).json({ message: "User not authenticated" });
    }
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Create reviews object if it doesn't exist
    if (!books[isbn].reviews) {
        books[isbn].reviews = {};
    }
    
    books[isbn].reviews[username] = reviewText;
    return res.status(200).json({ message: "Review submitted successfully" });
});

// Delete Book
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization?.username;

    if (!username) {
        return res.status(401).json({ message: "User not authenticated" });
    }
    if (!books[isbn]?.reviews[username]) {
        return res.status(404).json({ message: "Review not found" });
    }

    delete books[isbn].reviews[username];
    return res.status(200).json({ message: "Review deleted successfully" });


});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
