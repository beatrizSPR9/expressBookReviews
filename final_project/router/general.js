const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  } else {
    return res.status(404).json({ message: "Unable to register user." });
  }
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  //Write your code here
  return res.send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  //Write your code here
  let book = books.filter(book => book.isbn === req.params.isbn)

  return res.send(book);

});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  let booksFiltered = Object.values(books).filter(book => book.author === req.params.author);
  return res.send(JSON.stringify(booksFiltered));
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  let booksFiltered = Object.values(books).filter(book => book.title === req.params.title);
  return res.send(JSON.stringify(booksFiltered));
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  let booksFiltered = Object.values(books).filter(book => book.isbn === req.params.isbn);
  return res.send(JSON.stringify(booksFiltered[0].reviews));
});

module.exports.general = public_users;
