import express from 'express';
import {default as UserAccount, userAccModel} from "../Schemas/UserAccountSchema";
import mongoose from 'mongoose';

var db = 'mongodb://localhost/GLIFSdb'; 

mongoose.connect(db, { useNewUrlParser: true,  useUnifiedTopology: true });

var bodyParser = require('body-parser');
var urlencodedparser = bodyParser.urlencoded({extended: false});

export let GetRequest = function(req: express.Request, res:express.Response){
    
    

};

export let CommitRequest = function(req: express.Request, res:express.Response){
    res.json(req.body);
    console.log(" ----- ");
};