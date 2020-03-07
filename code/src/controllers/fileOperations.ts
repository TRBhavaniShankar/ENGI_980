import express from 'express';
import mongoose from 'mongoose';

// Get the document and model of the database
import {default as commit, CommitType} from "../Models/CommitSchema"
import {default as UserAccount, userAccType} from "../Models/UserAccountSchema";
import {default as fileElement, fileElementType} from "../Models/FileElementSchema";

// Get the datatypes used for the api's
import { GetRequestDT } from '../DataTypes/GetRequest';
import { FileID } from '../DataTypes/FileID';
import { FileStatePair } from '../DataTypes/FileStatePair';
import { CommitDT } from '../DataTypes/Commit';
import { Update } from '../DataTypes/Update';
import { FileContent } from '../DataTypes/Content';
import { ResponseDT } from '../DataTypes/ResponseDT';
import { mkGetRequest } from '../helper/mkGetRequest';
import { mkCommitRequest } from '../helper/mkCommitRequest';

// Setup DB component
var db = 'mongodb://localhost/GLIFSdb'; 
mongoose.connect(db, { useNewUrlParser: true,  useUnifiedTopology: true });

// Setup middleware
var bodyParser = require('body-parser');
var urlencodedparser = bodyParser.urlencoded({extended: false});

// API for the client to the request for the fileitem 
export let GetRequest = function(req : express.Request, res : express.Response, next : express.NextFunction){
    
    // req.body := SessionID, FileID[], CID, FileStatePair[]
    // var GT = new GetRequestDT(req.body.SessionID, req.body.FileID, req.body.CID, req.body.FileStatePair);
    var GT : GetRequestDT = new mkGetRequest(req.body.object).getClassInstance();
    
    var Response: ResponseDT;
    var files: Update;

    UserAccount.findOne({sessionID : GT.sid}, (error : Error, user : userAccType) => {
        if(error){
            return next(error);
        }

        if(user){
            GT.need.forEach(element => {
                /**
                 * Check if there exists a file with file state pair.
                 * 
                 * if there doesn't exists such pair then,
                 * Response: failure{ message : m }. This means that the request failed for some reason.
                 * 
                 * if the pair exists
                 * Response: update{ new_cid : cid1, update: updates, deletes: deletes, old_cid : cid0 }
                 */
                
                fileElement.findOne({ element : String }, (error : Error, fileItem : fileElementType) => {
                    
                    if(error){
                        return next(error);
                    }
                    
                    // There exists a file state pair which user is requesting
                    if(fileItem){


                       

                    }else{

                        console.log("not present");
                        res.json();
                    }
        
                    });
            });

            Response = new ResponseDT("200", "Fetched data", "update", files);

            res.json(fileElement);
            console.log();

        }else{
            console.log("Cannot find the session for the activity");
            res.json(" Cannot find the session for the activity");
        }
    })
    
};

// API for the client to the request for to commit the changes for the fileitem
export let CommitRequest = function(req: express.Request, res:express.Response, next : express.NextFunction){

    // req.body := SessionID, updates[], CID, FileStatePair 
    var CMT : CommitDT= new mkCommitRequest(req.body.object).getClassInstance();
    // console.log(CMT);
    // console.log(req.body.object);

    console.log(CMT.toString());

    UserAccount.findOne({sessionID : CMT.sid}, (error : Error, user : userAccType) => {
        if(error){
            return next(error);
        }

        if(user){


            
            const CMTDB = new commit({commit: CMT});
            CMTDB.save((err : Error) => {

                if (err) { 
                    return next(err); 
                }

                res.json("Successful");
                console.log(" Successful ");

            });

        }else{
            res.json("Please make sure you have logged in..");
            console.log("Please make sure you have logged in..");
        }
    });

    // res.json("Please make sure you have logged in..");
    // console.log("Please make sure you have logged in..");
    
};