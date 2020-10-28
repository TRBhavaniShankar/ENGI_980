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
import { commitZero, commitOne } from "../testHelpers/HelperFun";

describe('Test the operations of the server for case 1 and case 3', function() : void{

  it('Case 3', function () : void{
    
    // init
    var init : [CommitDT, CommitID[], Cache<CommitID, CommitDT>] = beforeTest_1();
    var cmt : CommitDT = init[0];
    var listOfCommits : CommitID[] = init[1];
    var CommitCache : Cache<CommitID, CommitDT> = init[2];

    // test
    var cmtResp_case3 : ResponseDT<IResponse> = new CommitOperations(cmt).processCommit(CommitCache, listOfCommits);
    console.log(" Totalno of commits : " +listOfCommits.length);
    expect(cmtResp_case3.message).to.equal("Successfully added the commit as the head of commit");
    expect(cmt.getUpdates()[cmt.getUpdates().length -1].getNewCid()).to.equal(listOfCommits[listOfCommits.length - 1]);
    expect(2).to.equal(listOfCommits.length);
  });

  it('Case 1', function () : void {

    var init : [CommitDT, CommitID[], Cache<CommitID, CommitDT>] = beforeTest_1();
    var cmt : CommitDT = init[0];
    var listOfCommits : CommitID[] = init[1];
    var CommitCache : Cache<CommitID, CommitDT> = init[2];

    var cmtResp : ResponseDT<IResponse> = new CommitOperations(cmt).processCommit(CommitCache, listOfCommits);

    // resend
    var cmtResp1 : ResponseDT<IResponse> = new CommitOperations(cmt).processCommit(CommitCache, listOfCommits);
    console.log(" Totalno of commits : " +listOfCommits.length);
    expect(cmtResp1.message).to.equal("This commit is already the head of the commit");
    expect(cmt.getUpdates()[cmt.getUpdates().length -1].getNewCid()).to.equal(listOfCommits[listOfCommits.length - 1]);
    expect(2).to.equal(listOfCommits.length);
  });
});


function beforeTest_1() : [CommitDT, CommitID[], Cache<CommitID, CommitDT>] {

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
  var cmt : CommitDT =  commitZero(rootData, searchResUpdate)[0];

  return [cmt, listOfCommits, CommitCache];

}