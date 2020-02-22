import express from 'express';
var mongoose = require('mongoose');
import expressValidator from "express-validator";

import * as userController from "./controllers/user";
import * as fileOperController from "./controllers/fileOperations";

// Initialize the node express server
var app: express.Application = express();

// Set up template engine
// app.set('view engine','ejs');

// Set up middleware
// app.use(express.static('./public'));
app.use(express.json());
app.use(expressValidator());

// Fire controllers
app.post("/login",userController.login);
app.post("/signup",userController.signup);
app.get("/get", fileOperController.GetRequest);
app.post("/commit", fileOperController.CommitRequest);

// Listen to a port
app.listen(3000);
console.log('Listing to port 3000');