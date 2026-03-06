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
    return res.status(404).json({ message: "Unable to register user. Username and password are required" });
  }
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  //Write your code here
  let booksFiltered = Object.values(books).filter(book => book.isbn === req.params.isbn);

  return res.send(JSON.stringify(booksFiltered[0]));

});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  let booksFiltered = Object.values(books).filter(book => book.author.includes(req.params.author));
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


//Task 10

let getBooks = new Promise((resolve, reject) => {
  resolve(books);
});

public_users.get('/async', function (req, res) {
  getBooks.then((books) => {
    return res.send(JSON.stringify(books));
  })
});

//Task 11

let getBookByIsbn = (isbn) => {
  return new Promise((resolve, reject) => {
    let book = Object.values(books).find(book => book.isbn === isbn);
    if (book) {
      resolve(book);
    } else {
      reject(new Error("Book not found"));
    }
  });
};

public_users.get('/async/isbn/:isbn', function (req, res) {
  getBookByIsbn(req.params.isbn)
    .then((book) => {
      return res.send(JSON.stringify(book));
    })
    .catch((error) => {
      return res.status(404).json({ message: error.message });
    });
});

// Task 12

let getBooksByAuthor = (author) => {
  return new Promise((resolve, reject) => {
    let booksFiltered = Object.values(books).filter(book => book.author.includes(author));
    if (booksFiltered.length > 0) {
      resolve(booksFiltered);
    } else {
      reject(new Error("No books found for the given author"));
    }
  });
};

public_users.get('/async/author/:author', function (req, res) {
  getBooksByAuthor(req.params.author)
    .then((books) => {
      return res.send(JSON.stringify(books));
    })
    .catch((error) => {
      return res.status(404).json({ message: error.message });
    });
});


// Task 13 
let getBooksByTitle = (title) => {
  return new Promise((resolve, reject) => {
    let booksFiltered = Object.values(books).filter(book => book.title === title);
    if (booksFiltered.length > 0) {
      resolve(booksFiltered);
    } else {
      reject(new Error("No books found for the given title"));
    }
  });
};

public_users.get('/async/title/:title', function (req, res) {
  getBooksByTitle(req.params.title)
    .then((books) => { 
      return res.send(JSON.stringify(books));
    })
    .catch((error) => {
      return res.status(404).json({ message: error.message });
    });
});


module.exports.general = public_users;
