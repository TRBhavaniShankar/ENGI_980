import express from 'express';
import expressValidator from "express-validator";

import * as apis from "./controllers/APIs";

// Initialize the node express server
var app: express.Application = express();

// Set up template engine
// app.set('view engine','ejs');

// Set up middleware
// app.use(express.static('./public'));
app.use(express.json());
app.use(expressValidator());

// Fire controllers
// app.post("/login",apis.login);
// app.post("/loggout",apis.loggout);
// app.post("/signup",apis.signup);

app.post("/get", apis.GetRequest);
app.post("/commit", apis.CommitRequest);
app.delete("/commit", apis.CommitRequest);

// Listen to a port
app.listen(3000);
console.log('Listing to port 3000');