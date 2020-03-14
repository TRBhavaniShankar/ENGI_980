// import express from 'express';
// import {default as UserAccount, userAccType} from "../Models/UserAccountSchema";
// import {default as Commit, CommitType} from "../Models/CommitSchema";
// import mongoose from 'mongoose';
// import { CommitDT } from '../DataTypes/Commit';
// import { LoginDT } from '../DataTypes/LoginDT';
// import { assert } from 'console';
// import { Guid } from "guid-typescript";
// import { ResponseDT } from '../DataTypes/ResponseDT';
// import { Cache } from '../Cache/Cache';

// var db = 'mongodb://localhost/GLIFSdb'; 

// mongoose.connect(db, { useNewUrlParser: true,  useUnifiedTopology: true });

// var bodyParser = require('body-parser');
// var urlencodedparser = bodyParser.urlencoded({extended: false});

// // Global Variables

// export let login = function(req: express.Request, res:express.Response, next: express.NextFunction){
    
//     UserAccount.findOne({email: req.body.email}, (error : Error, user : userAccType) => {

//         if(error){
//             return next(error);
//         }
        
//         var loginRes:ResponseDT;

//         console.log(req.body.email, req.body.password);
//         console.log(user);

//         if(user){
//             if(user.password !== req.body.password){

//                 loginRes = new ResponseDT("402", "password is wrong", "", new Object());

//             }else{

//                 // Check if there is any result
                
//                     /**
//                      * if the user is present, send back the new session ID and
//                      * Send the last Commit ID that user made.
//                      */

//                     if(user.isLoggedIn){
                        
//                         loginRes = new ResponseDT("201", "You are already logged in!!", "LoginDT", new LoginDT(user.sessionID, user.CommitID));

//                     }else{

//                         var session: Guid = Guid.create();
//                         console.log(session);

//                         UserAccount.updateOne({email: req.body.email}, { $set: { sessionID: session, isLoggedIn : true} }, (error: Error) =>{
//                             if(error){
//                                 return next(error);
//                             }
//                         });

//                         loginRes = new ResponseDT("200", "Successfully logged in!!", "LoginDT",new LoginDT(session, user.CommitID));
//                     }
//                 }
//             }
//         else{

//             loginRes = new ResponseDT("400", "Cannot find the user", "", new Object());

//         }

//         console.log(loginRes.getResponse())
//         res.json(loginRes.getResponse());
        
//     });
// };

// export let signup = function(req: express.Request, res:express.Response, next: express.NextFunction){

//     //assert( req.body.password === req.body.confirmPassword);

//     UserAccount.findOne({email: req.body.email}, (error : Error, user : userAccType) => {
//         if(error){
//             return next(error);
//         }

//         // Check if there is any result
//         if(user){
//             // if the user is present
//             res.json('User already exists!!');
//             res.end();
//         }
//         else{

//             var commitID : Guid = Guid.create();

//             var user : UserAccount = new UserAccount({
//                 email: req.body.email,
//                 password: req.body.password,
//                 sessionID: null,
//                 isLoggedIn : false,
//                 CommitID: commitID,
//                 identifier : req.body.identifier
//             });

//             userSessionPair.put(req.body.email, )

//             user.save((err : Error) => {
                
//                 if (err) { 
//                     return next(err); 
//                 }
                
//                 /**
//                  * After saving the user details in the DB, 
//                  * send back a sessioin ID by logging in the user
//                  */

//                 res.json(user);
                
//                 res.end();
//             });
//         }
//     });
    
// };


// // API for logging out
// export let loggout = function(req: express.Request, res:express.Response, next: express.NextFunction){

//     console.log("received loggout");
//     UserAccount.findOne({email: req.body.email}, (error : Error, user : userAccType) =>{

//         if (user.isLoggedIn){
//             UserAccount.updateOne({email: req.body.email}, { $set: { sessionID: null, isLoggedIn : false} }, (error: Error) =>{
            
//                 if(error){
//                     return next(error);
//                 }
        
//                 console.log("successfully logged out");
//                 res.json('successfully logged out');
//                 res.end();
        
//             });
//         }

//     })  
    
// };