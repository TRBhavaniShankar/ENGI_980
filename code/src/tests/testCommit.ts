import { CommitDT } from "../DataTypes/Commit";
import { Cache } from "../Cache/Cache";
import { FileStatePair } from "../DataTypes/FileStatePair";
import { Update } from "../DataTypes/Update";
import { Guid } from "guid-typescript";
import { CommitOperations } from "../ServerCacheOperations/CommitOperation";
import { ResponseDT } from "../Response/ResponseDT";
import { Change } from "../DataTypes/Change";
import { CommitID } from "../DataTypes/CommitID";
import { SessionID } from "../DataTypes/SessionID";
import { IResponse } from "../Response/ResponseObjects";
import { createDirectoryValueAndFileStatePair, mkResponseDT, createFileValueWithFileStatePair, getUpdateClassInstance } from "../MakeClasses/CreateClasses";
import { initServerOperations } from "../ServerCacheOperations/InitServerOperation";
import { GetRequestDT } from "../DataTypes/GetRequest";
import { GetOperation } from "../ServerCacheOperations/GetOperation";
import { UserAccount } from "../DataTypes/UserAccount";


// Initialte the server
var init : [Cache<CommitID, CommitDT> , CommitID[] , Cache<String, UserAccount>] = initServerOperations();
var CommitCache : Cache<CommitID, CommitDT> = init[0];
var listOfCommits : CommitID[] = init[1];
var userCache : Cache<String, UserAccount> = init[2];

// get Root 
var rootData : CommitDT = < CommitDT > CommitCache.get(listOfCommits[listOfCommits.length - 1]);
console.log(rootData.getSessionID());


var GT : GetRequestDT = new GetRequestDT(rootData.getSessionID(), [], rootData.getUpdates()[0].getNewCid(), rootData.getFileStatepairs());
var searchRes : ResponseDT<IResponse> = new GetOperation(GT).searchAndGetResponse(CommitCache, listOfCommits);

var searchResUpdate : Update =  < Update> searchRes.object ;

var createFileResult : [ [Change , Change] , FileStatePair]= 
    createFileValueWithFileStatePair("F1" , "user1" , "rwx" , "aab" , searchResUpdate.getChanges()[0]);

var fileCommitId : CommitID = new CommitID( Guid.create() );
var fileCommitUpdate = new Update(fileCommitId, createFileResult[0] , [] , searchResUpdate.getOldCid());

var commit : CommitDT = new CommitDT(new SessionID(Guid.create()), [fileCommitUpdate], [ createFileResult[1] ]);

var cmtResp : ResponseDT<IResponse> = new CommitOperations(commit).processCommit(CommitCache, listOfCommits);

// for (let i = 0; i < listOfCommits.length; i++) {
//     console.log( i + " : "+ listOfCommits[i] );
//   }

var resCommit : CommitDT = < CommitDT > CommitCache.get(fileCommitId);
var headUpdate : Update = resCommit.getUpdates()[0];

for (let i = 0; i < headUpdate.getChanges().length; i++) {
const element = headUpdate.getChanges()[i];
console.log("change " + i + ":");
var resString : string = element.toString();
console.log(resString);

}
