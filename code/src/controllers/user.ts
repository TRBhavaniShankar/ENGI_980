import express from 'express';
import {default as UserAccount, userAccModel} from "../Schemas/UserAccountSchema";
import mongoose from 'mongoose';

var db = 'mongodb://localhost/GLIFSdb'; 

mongoose.connect(db, { useNewUrlParser: true,  useUnifiedTopology: true });

var bodyParser = require('body-parser');
var urlencodedparser = bodyParser.urlencoded({extended: false});

export let login = function(req: express.Request, res:express.Response, next: express.NextFunction){
    
    UserAccount.findOne({email: req.body.email}, (error : Error, user : userAccModel) => {
        if(error){
            return next(error);
        }

        // Check if there is any result
        if(user){
            // if the user is present
            res.json("successful");
            console.log("present");
        }else{
            console.log("not present");
            res.json("no user exists");
        }
        
        
    });
};

export let signup = function(req: express.Request, res:express.Response, next: express.NextFunction){

    UserAccount.findOne({email: req.body.email}, (error : Error, user : userAccModel) => {
        if(error){
            return next(error);
        }

        // Check if there is any result
        if(user){
            // if the user is present
            res.json('User already exists!!');
            res.end();
        }
        else{

            const user = new UserAccount({
                email: req.body.email,
                Password: req.body.password
            });

            user.save((err) => {
                if (err) { 
                    return next(err); 
                }
                res.json('Register completed successfully!!');
                res.end();
            });
        }
    });
    
};