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
import { createDirectoryValueAndFileStatePair, mkResponseDT, createFileValueWithFileStatePair } from "../MakeClasses/CreateClasses";
import { initServerOperations } from "../ServerCacheOperations/InitServerOperation";
import { GetRequestDT } from "../DataTypes/GetRequest";
import { GetOperation } from "../ServerCacheOperations/GetOperation";
import { UserAccount } from "../DataTypes/UserAccount";

// Initialte the server
var init : [Cache<CommitID, CommitDT> , CommitID[] , Cache<String, UserAccount>] = initServerOperations();
var CommitCache : Cache<CommitID, CommitDT> = init[0];
var listOfCommits : CommitID[] = init[1];
var userCache : Cache<String, UserAccount> = init[2];

// Get Root 
var rootData : CommitDT = < CommitDT > CommitCache.get(listOfCommits[listOfCommits.length - 1]);

describe('Test the operations of the server', function() : void{

  it('test for get request', function () : void{
    console.log("\n\n ---------------------------------- Test 1 ---------------------------------- \n\n");
    // Get the current data
    var GT : GetRequestDT = new GetRequestDT(rootData.getSessionID(), [], rootData.getUpdates()[0].getNewCid(), rootData.getFileStatepairs());
    var searchRes : ResponseDT<IResponse> = new GetOperation(GT).searchAndGetResponse(CommitCache, listOfCommits);
    var searchResUpdate : Update = < Update > searchRes.object;

    // Display the head of the commit in string
    console.log("---------------------- Display the head of the commit in string ----------------------")
    for (let i = 0; i < searchResUpdate.getChanges().length; i++) {
      const element = searchResUpdate.getChanges()[i];
      console.log("change " + i + ": \n" + element.toString());
    }

    // Test 1 Result 
    console.log("---------------------------------- Test 1 Result ----------------------------------");
    // expect(searchRes.message).to.equal("The commit ID sent by the user is same as the head of commit");
    expect(searchResUpdate.getOldCid()).to.equal(listOfCommits[listOfCommits.length - 1]);

  });

  it('test for commit file request', function () : void {

    console.log("\n\n ---------------------------------- Test 2 ---------------------------------- \n\n");
    // Get the current data
    var GT : GetRequestDT = new GetRequestDT(rootData.getSessionID(), [], rootData.getUpdates()[0].getNewCid(), rootData.getFileStatepairs());
    var searchRes : ResponseDT<IResponse> = new GetOperation(GT).searchAndGetResponse(CommitCache, listOfCommits);
    var searchResUpdate : Update = < Update > searchRes.object;

    // Create new leaf file
    var createFileResult : [ Change , Change , FileStatePair]= 
        createFileValueWithFileStatePair("F1" , "user1" , "rwx" , "aab" , searchResUpdate.getChanges()[0]);

    // Prepare to commit the new file
    var fileCommitId : CommitID = new CommitID( Guid.create() );
    var fileCommitUpdate = new Update(fileCommitId, [ createFileResult[0], createFileResult[1] ] , [] , searchResUpdate.getOldCid());
    
    // Commit new file
    var commit : CommitDT = new CommitDT(new SessionID(Guid.create()), [fileCommitUpdate], [ createFileResult[2] ]);
    var cmtResp : ResponseDT<IResponse> = new CommitOperations(commit).processCommit(CommitCache, listOfCommits);
    
    // Display the head of the commit in string
    console.log("---------------------- Display the head of the commit in string ----------------------")
    var resCommit : CommitDT = < CommitDT > CommitCache.get(fileCommitId);
    var headUpdate : Update = resCommit.getUpdates()[0];

    for (let i = 0; i < headUpdate.getChanges().length; i++) {
    const element = headUpdate.getChanges()[i];
    console.log("change " + i + ": \n" + element.toString());
    }

    // Test 2 Result
    console.log("---------------------------------- Test 2 Result ----------------------------------");
    expect(fileCommitId).to.equal(listOfCommits[listOfCommits.length - 1]);
    expect("Successfully added the commit as the head of commit").to.equal(cmtResp.message);
  });

});