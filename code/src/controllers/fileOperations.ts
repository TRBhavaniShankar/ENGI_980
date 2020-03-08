import express from 'express';
import mongoose from 'mongoose';

// Get the document and model of the database
import {default as commit, CommitType} from "../Models/CommitSchema"
import {default as UserAccount, userAccType} from "../Models/UserAccountSchema";
import {default as fileElement, fileElementType} from "../Models/FileElementSchema";

// Get the datatypes used for the api's
import { GetRequestDT } from '../DataTypes/GetRequest';
import { FileStatePair } from '../DataTypes/FileStatePair';
import { CommitDT } from '../DataTypes/Commit';
import { Update } from '../DataTypes/Update';
import { FileContent } from '../DataTypes/Content';
import { ResponseDT } from '../DataTypes/ResponseDT';
import { mkGetRequest, mkCommitRequest } from '../MakeClasses/CreateClasses';
import { Cache } from '../Cache/Cache';
import { Change } from '../DataTypes/Change';
import { Guid } from "guid-typescript";

// Setup DB component
var db = 'mongodb://localhost/GLIFSdb'; 
mongoose.connect(db, { useNewUrlParser: true,  useUnifiedTopology: true });

// Setup middleware
var bodyParser = require('body-parser');
var urlencodedparser = bodyParser.urlencoded({extended: false});

// Create cache objects for the file operations
var ChangeCache : Cache<Guid, FileContent> = new Cache<Guid, FileContent>();
var CommitCache : Cache<Guid, Update> = new Cache<Guid, Update>();
var listOfCommits : Cache<String, Guid[]> = new Cache<String, Guid[]>();

// API for the client to the request for the fileitem 
export let GetRequest = function(req : express.Request, res : express.Response, next : express.NextFunction){

    var Response: ResponseDT;

    var GT : GetRequestDT = new mkGetRequest(req.body.object).getClassInstance();
    
    UserAccount.findOne({SessionID : GT.sid}, (error : Error, user : userAccType) => {

        if(error){
            return next(error);
        }

        if(user){
            var searchRes : [Update, Boolean] = GT.searchAndGetResponse(ChangeCache, CommitCache, listOfCommits, user.email);

            if(searchRes[1]){
                // Preasent in the cache
                var responseObject : ResponseDT = new ResponseDT("200", "Succesful", "Update", Update);
            }else{
                // Check in the DB
            }
            
        }else{
            Response = new ResponseDT("400", "Please Sign up. If you have already signed up please loggin!","",Object);
        }
        
        res.json(Response);
        res.end;
    });
    
};

// API for the client to the request for to commit the changes for the fileitem
export let CommitRequest = function(req: express.Request, res:express.Response, next : express.NextFunction){

    // req.body := SessionID, updates[], CID, FileStatePair 
    var CMT : CommitDT= new mkCommitRequest(req.body.object).getClassInstance();

    console.log(CMT.toString());

    res.json("Received");
    // console.log("Please make sure you have logged in..");
    
};