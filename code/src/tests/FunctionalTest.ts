import { expect } from "chai";
import { CommitDT } from "../DataTypes/Commit";
import { FileContent } from "../DataTypes/Content";
import { Cache } from "../Cache/Cache";
import { FileStatePair } from "../DataTypes/FileStatePair";
import { Update } from "../DataTypes/Update";
import { Guid } from "guid-typescript";
import { CommitOperations } from "../ServerCacheOperations/CommitOperation";
import { LoginDT } from "../DataTypes/LoginDT";
import { ResponseDT } from "../Response/ResponseDT";
import { Change } from "../DataTypes/Change";
import { LeafValue } from "../DataTypes/LeafValue";
import { MetaData } from "../DataTypes/MetaData";
import { CommitID } from "../DataTypes/CommitID";
import { SessionID } from "../DataTypes/SessionID";
import { FileID } from "../DataTypes/FileID";
import { StateID } from "../DataTypes/StateID";
import { Permissions } from "../DataTypes/Permissions";
import { IResponse } from "../Response/ResponseObjects";
import { DirectoryValues } from "../DataTypes/DirectoryValue";
import { createDirectoryValueAndFileStatePair, mkResponseDT, createFileValueWithFileStatePair, createFile, getUpdateClassInstance, getCommitRequestClassInstance } from "../MakeClasses/CreateClasses";
import { initServerOperations } from "../ServerCacheOperations/InitServerOperation";
import { GetRequestDT } from "../DataTypes/GetRequest";
import { GetOperation } from "../ServerCacheOperations/GetOperation";
import { UserAccount } from "../DataTypes/UserAccount";
import { DirectoryEntry } from "../DataTypes/DirectoryEntry";
import { commitZero, commitOne, commitTwo, commitTwo_S1 } from "../testHelpers/HelperFun";

// Initialte the server
var init : [Cache<CommitID, CommitDT> , CommitID[] , Cache<String, UserAccount>] = initServerOperations();
var CommitCache : Cache<CommitID, CommitDT> = init[0];
var listOfCommits : CommitID[] = init[1];
var userCache : Cache<String, UserAccount> = init[2];

// Get Root 
var rootData : CommitDT = < CommitDT > CommitCache.get(listOfCommits[listOfCommits.length - 1]);
var GT : GetRequestDT = new GetRequestDT(rootData.getSessionID(), [], rootData.getUpdates()[0].getNewCid(), rootData.getFileStatepairs());
var searchRes : ResponseDT<IResponse> = new GetOperation(GT).searchAndGetResponse(CommitCache, listOfCommits);

var searchResUpdate : Update = getUpdateClassInstance(< Update > searchRes.object);


// ---------------------------------------------------------------------------------
// var cmt : CommitDT = getCommitRequestClassInstance( commitZero(rootData, searchResUpdate)[0] );
// var cmtResp : ResponseDT<IResponse> = new CommitOperations(cmt).processCommit(CommitCache, listOfCommits);
// console.log(cmtResp.message);

// var cmtResp : ResponseDT<IResponse> = new CommitOperations(cmt).processCommit(CommitCache, listOfCommits);
// console.log(cmtResp.message);

// ---------------------------------------------------------------------------------
// var cmt : CommitDT = getCommitRequestClassInstance( commitZero(rootData, searchResUpdate)[0] );
// var cmtResp : ResponseDT<IResponse> = new CommitOperations(cmt).processCommit(CommitCache, listOfCommits);
// console.log(cmtResp.message);

// var GT : GetRequestDT = new GetRequestDT(rootData.getSessionID(), [], cmt.getUpdates()[cmt.getUpdates().length - 1].getNewCid(),
//                         cmt.getFileStatepairs());

// var zeroRes : ResponseDT<IResponse> = new GetOperation(GT).searchAndGetResponse(CommitCache, listOfCommits);
// var zeroResUpdate : Update = getUpdateClassInstance(< Update > zeroRes.object);

// ---------------------------------------------------------------------------------
// var cmt : [CommitDT, CommitDT] = commitOne(rootData, searchResUpdate, CommitCache,listOfCommits);  
// var cmtResp : ResponseDT<IResponse> = new CommitOperations(cmt[1]).processCommit(CommitCache, listOfCommits);
// console.log(cmtResp.message);

// var cmtResp1 : ResponseDT<IResponse> = new CommitOperations(cmt[0]).processCommit(CommitCache, listOfCommits);
// console.log(cmtResp1.message);


// ---------------------------------------------------------------------------------
// var cmt1 : [CommitDT , CommitDT, [CommitDT, Change[] , Change[]] ] = commitOne(rootData, searchResUpdate, CommitCache,listOfCommits); 
// var cmtResp : ResponseDT<IResponse> = new CommitOperations(cmt1[1]).processCommit(CommitCache, listOfCommits);

// var cmt2 : CommitDT = commitTwo(listOfCommits, cmt1[2]); 
// var cmtResp : ResponseDT<IResponse> = new CommitOperations(cmt2).processCommit(CommitCache, listOfCommits);

// console.log(" Totalno of commits : " +listOfCommits.length);
// ============================================================

// var cmt1 : [CommitDT , CommitDT, [CommitDT, Change[] , Change[]] ] = commitOne(rootData, searchResUpdate, CommitCache,listOfCommits); 
// var cmtResp : ResponseDT<IResponse> = new CommitOperations(cmt1[1]).processCommit(CommitCache, listOfCommits);

// var cmt2 : CommitDT = commitTwo_S1(listOfCommits, cmt1[2]); 
// var cmtResp : ResponseDT<IResponse> = new CommitOperations(cmt2).processCommit(CommitCache, listOfCommits);

// console.log(" Totalno of commits : " +listOfCommits.length);