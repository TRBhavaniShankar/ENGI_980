import express from 'express';
import mongoose from 'mongoose';

// Get the datatypes used for the api's
import { GetRequestDT } from '../DataTypes/GetRequest';
import { CommitDT } from '../DataTypes/Commit';
import { ResponseDT } from '../Response/ResponseDT';
import { getGetRequestClassInstance, getCommitRequestClassInstance } from '../MakeClasses/CreateClasses';
import { Cache } from '../Cache/Cache';
import { GetOperation } from '../ServerCacheOperations/GetOperation';
import { CommitOperations } from '../ServerCacheOperations/CommitOperation';
import { CommitID } from '../DataTypes/CommitID';
import { IResponse, Failure } from '../Response/ResponseObjects';
import { SessionID } from '../DataTypes/SessionID';
import { initServerOperations } from '../ServerCacheOperations/InitServerOperation';
import { UserAccount } from '../DataTypes/UserAccount';

// Setup DB component
var db = 'mongodb://localhost/GLIFSdb'; 
mongoose.connect(db, { useNewUrlParser: true,  useUnifiedTopology: true });

// Setup middleware
var bodyParser = require('body-parser');
var urlencodedparser = bodyParser.urlencoded({extended: false});

// initialte cache objects for the file operations
var init : [Cache<CommitID, CommitDT> , CommitID[] , Cache<String, UserAccount>] = initServerOperations();
var CommitCache : Cache<CommitID, CommitDT> = init[0];
var listOfCommits : CommitID[] = init[1];
var userSessionPair : Cache<String, UserAccount> = init[2];

// --------------------------- File Operations APIs ---------------------------

// API for the client to the request for the fileitem 
export let GetRequest = function(req : express.Request, res : express.Response, next : express.NextFunction){

    var GT : GetRequestDT = getGetRequestClassInstance(req.body.object);

    try{

        var userAccount : UserAccount = < UserAccount > userSessionPair.get(req.body.email);
        
        if(userAccount.getsessionID().isEqual(GT.sid)){
            
            var searchRes : ResponseDT<IResponse>= new GetOperation(GT).searchAndGetResponse(CommitCache, listOfCommits);

            // Preasent in the cache
            res.json(searchRes);
            res.end();
            
        }else{

            // Unable to find the user
            res.json(new ResponseDT<IResponse>(400, "Please Sign up. If you have already signed up please loggin!",
                    "",new Failure("Please Sign up. If you have already signed up please loggin!")));
            res.end();
        }

    }catch(error){
        res.json(error);
        res.end();
    }
    
};

// API for the client to the request for to commit the changes for the fileitem
export let CommitRequest = function(req: express.Request, res:express.Response, next : express.NextFunction){

    // req.body := SessionID, updates[], CID, FileStatePair 
    var CMT : CommitDT= getCommitRequestClassInstance(req.body.object);

    //UserAccount.findOne({SessionID : CMT.sid}, (error : Error, user : userAccType) => {
        try{

            var userAcc : UserAccount = < UserAccount > userSessionPair.get(req.body.email);
            
            if(userAcc.getsessionID().isEqual(CMT.getSessionID())){

                console.log("CMT " +CMT);

                var CommitRes : ResponseDT<IResponse> = new CommitOperations(CMT).processCommit(CommitCache, listOfCommits);

                console.log("CommitRes " +CommitRes);

                // Preasent in the cache
                res.json(CommitRes);
                res.end();
            }else{
                // Unable to find the user
                res.json(new ResponseDT<Failure>(400, "Please Sign up. If you have already signed up please loggin!","",new Failure("Please Sign up. If you have already signed up please loggin!")));
                res.end();
            }
            
        }catch(error){
            res.json(error);
            res.end();
        }
    
};


// --------------------------- User account APIs ---------------------------


// export let login = function(req: express.Request, res:express.Response, next: express.NextFunction){
    
//     UserAccount.findOne({email: req.body.email}, (error : Error, user : userAccType) => {

//         if(error){
//             return next(error);
//         }
//         if(user){
//             if(user.password !== req.body.password){

//                 res.json(new ResponseDT<Object>(402, "password is wrong", "", new Object()));
//                 res.end();

//             }else{

//                 // Check if there is any result
                
//                     /**
//                      * if the user is present, send back the new session ID and
//                      * Send the last Commit ID that user made.
//                      */

//                     var userCommitID : Guid[] = listOfCommits.get(user.email);

//                     if(user.isLoggedIn){
                        
//                         res.json(new ResponseDT<LoginDT>(201, "You are already logged in!!", "LoginDT", new LoginDT(userSessionPair.get(user.email), userCommitID[userCommitID.length - 1])));
//                         res.end();

//                     }else{
//                         console.log(userCommitID[userCommitID.length - 1]);
//                         var session: Guid = Guid.create();
//                         console.log("session : "+session);

//                         // Add the user email paring with the session id
//                         userSessionPair.put(req.body.email, session)

//                         UserAccount.updateOne({email: req.body.email}, { $set: { sessionID: session, isLoggedIn : true} }, (error: Error) =>{
//                             if(error){
//                                 return next(error);
//                             }
//                         });
//                         console.log(userCommitID[userCommitID.length - 1]);
//                         console.log("userCommitID : "+userCommitID);

//                         res.json(new ResponseDT<LoginDT>(200, "Successfully logged in!!", "LoginDT",new LoginDT(session, userCommitID[userCommitID.length - 1])));
//                         res.end();
//                     }

//                 }
//             }
//         else{

//             res.json(new ResponseDT<Object>(400, "Cannot find the user", "", new Object()));
//             res.end();

//         }
        
//     });
// };

// export let signup = function(req: express.Request, res:express.Response, next: express.NextFunction){

//     assert( req.body.password === req.body.confirmPassword, "Password and Confirm Password does not match!!! Try again");

//     UserAccount.findOne({email: req.body.email}, (error : Error, user : userAccType) => {
//         if(error){
//             return next(error);
//         }

//         // Check if there is any result
//         if(user){
//             // if the user is present
            
//             listOfCommits.put(req.body.email, [user.CommitID]);

//             userSessionPair.put(req.body.email, user.sessionID);
//             res.json(new ResponseDT<Object>(201, "User already exists!!","Object",new LoginDT(user.sessionID,user.CommitID)));
//             res.end();
//         }
//         else{

//             var commitID : Guid = Guid.create();
//             var sessionID : Guid = Guid.create();

//             var new_user = new UserAccount({
//                 email: req.body.email,
//                 password: req.body.password,
//                 sessionID: sessionID,
//                 isLoggedIn : true,
//                 CommitID: commitID,
//                 identifier : req.body.identifier
//             });

//             // Add the initial commit to the list of commits
//             listOfCommits.put(req.body.email, [commitID]);

//             userSessionPair.put(req.body.email, sessionID);

//             new_user.save((err : Error) => {
                
//                 if (err) { 
//                     return next(err); 
//                 }
                
               
//             });
            
//              /**
//              * After saving the user details in the DB, 
//              * send back a sessioin ID by logging in the user
//              */

//             res.json(new ResponseDT<LoginDT>(200, "Your account has been successfully register and logged in. Please logg out if you dont wish to be logged in","LoginDT",new LoginDT(sessionID, commitID)));
//             res.end();
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
                
//                 userSessionPair.delete(req.body.email);

//                 var Response :  ResponseDT<Object> = new ResponseDT<Object>(200, "Successfully logged out","Object", new Object());

//                 res.json(Response);
//                 res.end();
        
//             });
//         }

//     })  
    
// };