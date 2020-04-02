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

// Initialte the server
var init : [Cache<CommitID, CommitDT> , CommitID[] , Cache<String, UserAccount>] = initServerOperations();
var CommitCache : Cache<CommitID, CommitDT> = init[0];
var listOfCommits : CommitID[] = init[1];
var userCache : Cache<String, UserAccount> = init[2];

// Get Root 
var rootData : CommitDT = < CommitDT > CommitCache.get(listOfCommits[listOfCommits.length - 1]);
var GT : GetRequestDT = new GetRequestDT(rootData.getSessionID(), [], rootData.getUpdates()[0].getNewCid(), rootData.getFileStatepairs());
var searchRes : ResponseDT<IResponse> = new GetOperation(GT).searchAndGetResponse(CommitCache, listOfCommits);

function commitZero(searchResUpdate : Update) : CommitDT{

    var commitFilePair : FileStatePair[] = [];
    for (let i = 0; i < searchResUpdate.getChanges().length; i++) {
        const element = searchResUpdate.getChanges()[i];
        commitFilePair.push(new FileStatePair(element.getFileID() , element.getContent().getStid()));
    }

    for (let i = 0; i < searchResUpdate.getDelets().length; i++) {
        const element = searchResUpdate.getDelets()[i];
        commitFilePair.push(new FileStatePair(element.getFileID() , element.getStateID()));
    }

    var parentDirectory : DirectoryValues = < DirectoryValues > searchResUpdate.getChanges()[0].getContent().getValue();

    var Dir1 : [Change, FileStatePair] = createDirectoryValueAndFileStatePair("user1","rwx",[]);
    var file1 : [Change , Change , FileStatePair] = createFileValueWithFileStatePair("F1" , "user1" , "rwx" , "aab", Dir1[0]);
    var file2 : [Change , Change , FileStatePair] = createFileValueWithFileStatePair("F2" , "user1" , "rwx" , "bba", file1[0]);
    Dir1[0] = file2[0];
    parentDirectory.push(new DirectoryEntry("D1", Dir1[1].getFileID()));
    var parentChange : Change = searchResUpdate.getChanges()[0]
    parentChange.setNewStateID( new StateID( Guid.create()));
    var cid0 : CommitID = new CommitID(Guid.create());
    var update1 : Update = new Update(cid0 , [ parentChange, Dir1[0] , file1[1], file2[1] ] , [] , searchResUpdate.getOldCid());

    commitFilePair.push(Dir1[1]);
    commitFilePair.push(file1[2]);
    commitFilePair.push(file2[2]);

    var Dir2 : [Change, FileStatePair] = createDirectoryValueAndFileStatePair("user1","rwx",[]);
    var file3 : [Change , Change , FileStatePair] = createFileValueWithFileStatePair("F3" , "user1" , "rwx" , "ccd", Dir2[0]);
    var file4 : [Change , Change , FileStatePair] = createFileValueWithFileStatePair("F4" , "user1" , "rwx" , "ddc", file3[0]);
    Dir2[0] = file4[0];
    parentDirectory.push(new DirectoryEntry("D2", Dir2[1].getFileID()));
    var parentChange : Change = searchResUpdate.getChanges()[0]
    parentChange.setNewStateID( new StateID( Guid.create()));
    var cid1 : CommitID = new CommitID(Guid.create());
    var update2 : Update = new Update(cid1 , [ parentChange, Dir2[0] , file3[1], file4[1] ], [], cid0);

    commitFilePair.push(Dir2[1]);
    commitFilePair.push(file3[2]);
    commitFilePair.push(file4[2]);

    var Dir3 : [Change, FileStatePair] = createDirectoryValueAndFileStatePair("user1","rwx",[]);
    var file5 : [Change , Change , FileStatePair] = createFileValueWithFileStatePair("F5" , "user1" , "rwx" , "eef", Dir3[0]);
    var file6 : [Change , Change , FileStatePair] = createFileValueWithFileStatePair("F6" , "user1" , "rwx" , "ffe", file5[0]);
    Dir3[0] = file6[0];
    parentDirectory.push(new DirectoryEntry("D3", Dir3[1].getFileID()));
    var parentChange : Change = searchResUpdate.getChanges()[0]
    parentChange.setNewStateID( new StateID( Guid.create()));
    var cid2 : CommitID = new CommitID(Guid.create());
    
    commitFilePair.push(Dir3[1]);
    commitFilePair.push(file5[2]);
    commitFilePair.push(file6[2]);

    var Dir4 : [Change, FileStatePair] = createDirectoryValueAndFileStatePair("user1","rwx",[]);
    var file7 : [Change , Change , FileStatePair] = createFileValueWithFileStatePair("F7" , "user1" , "rwx" , "ggh", Dir4[0]);
    var file8 : [Change , Change , FileStatePair] = createFileValueWithFileStatePair("F8" , "user1" , "rwx" , "hhg", file7[0]);
    Dir4[0] = file8[0];
    parentDirectory.push(new DirectoryEntry("D4", Dir4[1].getFileID()));
    var parentChange1 : Change = searchResUpdate.getChanges()[0]
    parentChange1.setNewStateID( new StateID( Guid.create()));
    var cid3 : CommitID = new CommitID(Guid.create());

    var update3 : Update = new Update(cid2 , [ parentChange , Dir3[0] , file7[1], file5[1], file6[1] ], [], cid1);
    var update4 : Update = new Update(cid3 , [ parentChange1 , Dir4[0] , file7[1], file8[1] ], [], cid2);

    commitFilePair.push(Dir4[1]);
    commitFilePair.push(file7[2]);
    commitFilePair.push(file8[2]);
    
    return new CommitDT( rootData.getSessionID(), [ update1, update2, update3, update4], commitFilePair );
    
}

var searchResUpdate : Update = getUpdateClassInstance(< Update > searchRes.object);
var cmt : CommitDT = getCommitRequestClassInstance( commitZero(searchResUpdate) );

var cmtResp : ResponseDT<IResponse> = new CommitOperations(cmt).processCommit(CommitCache, listOfCommits);
console.log(cmtResp.message);

var cmtResp : ResponseDT<IResponse> = new CommitOperations(cmt).processCommit(CommitCache, listOfCommits);
console.log(cmtResp.message);