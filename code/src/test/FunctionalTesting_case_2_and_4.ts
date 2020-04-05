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
import { commitZero, commitOne, commitTwo } from "../testHelpers/HelperFun"; 

describe('Test the operations of the server for case 2 and case 4', function() : void{

  it('Case 2', function () : void{
    
    var init : [[CommitDT, CommitDT, [CommitDT, Change[] , Change[]]], CommitID[], Cache<CommitID, CommitDT>] = beforeTest_2();
    var cmt1 : [CommitDT, CommitDT, [CommitDT, Change[] , Change[]]] = init[0];
    var listOfCommits : CommitID[] = init[1];
    var CommitCache : Cache<CommitID, CommitDT> = init[2];

    var cmtResp : ResponseDT<IResponse> = new CommitOperations(cmt1[1]).processCommit(CommitCache, listOfCommits);
    
    var cmtResp1 : ResponseDT<IResponse> = new CommitOperations(cmt1[0]).processCommit(CommitCache, listOfCommits);
    console.log(" Total no of commits : " +listOfCommits.length);
    expect(cmtResp1.message).to.equal("This commit was a commit in the past, the corresponding data at the commit has been provided");
    expect(cmt1[1].getUpdates()[cmt1[1].getUpdates().length -1].getNewCid()).to.equal(listOfCommits[listOfCommits.length - 1]);
    expect(3).to.equal(listOfCommits.length);
  });

  it('Case 4', function () : void{


    var init : [[CommitDT, CommitDT, [CommitDT, Change[] , Change[]]], CommitID[], Cache<CommitID, CommitDT>] = beforeTest_2();
    var cmt1 : [CommitDT, CommitDT, [CommitDT, Change[] , Change[]]] = init[0];
    var listOfCommits : CommitID[] = init[1];
    var CommitCache : Cache<CommitID, CommitDT> = init[2];

    var cmtResp : ResponseDT<IResponse> = new CommitOperations(cmt1[1]).processCommit(CommitCache, listOfCommits);

    var cmt2 : CommitDT = commitTwo(listOfCommits, cmt1[2]); 
    var cmtResp1 : ResponseDT<IResponse> = new CommitOperations(cmt2).processCommit(CommitCache, listOfCommits);
    console.log(" Total no of commits : " +listOfCommits.length);
    expect(cmtResp1.message).to.equal("We could not find the old commit id in the list of commit, therefore we"+
                                    " have merged the data that you have sent with the head of commit data");
    expect(cmt2.getUpdates()[cmt2.getUpdates().length -1].getNewCid().toString()).to.equal(listOfCommits[listOfCommits.length - 1].toString());
    expect(4).to.equal(listOfCommits.length);

  });

});


function beforeTest_2() : [[CommitDT, CommitDT, [CommitDT, Change[] , Change[]]], CommitID[], Cache<CommitID, CommitDT>] {

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
  var cmt1 : [CommitDT, CommitDT, [CommitDT, Change[] , Change[]]] = commitOne(rootData, searchResUpdate, CommitCache,listOfCommits); 

  return [cmt1, listOfCommits, CommitCache];

}