import { expect } from "chai";
import { CommitDT } from "../DataTypes/Commit";
import { FileContent } from "../DataTypes/Content";
import { Cache } from "../Cache/Cache";
import { FileStatePair } from "../DataTypes/FileStatePair";
import { Update } from "../DataTypes/Update";
import { Guid } from "guid-typescript";
import { CommitOperations } from "../ServerCacheOperations/CommitOperation";
import * as apis from "../controllers/APIs";
import { mkLogginDT, mkResponseDT } from "../MakeClasses/CreateClasses";
import { LoginDT } from "../DataTypes/LoginDT";
import { ResponseDT } from "../Response/ResponseDT";
import { Delete } from "../DataTypes/Delete";
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
import { DirectoryEntry } from "../DataTypes/DirectoryEntry";

var RootCommitID : CommitID = new CommitID(Guid.create());
var RootDirFid : FileID = new FileID(Guid.create());
var RootStateID : StateID = new StateID(Guid.create());
var RootMetaData : MetaData = new MetaData("user1",new Permissions("rwx"));
var RootDir : DirectoryValues = new DirectoryValues();

var dirContent : FileContent = new FileContent(RootStateID,RootMetaData,RootDir);
var RootChange : Change = new Change(RootDirFid,dirContent);

var RootUpdate : Update = new Update(RootCommitID, [RootChange], [], new CommitID(Guid.create()));
// Initialte the caches
var CommitCache : Cache<CommitID, [Update, FileStatePair[]]> = new Cache<CommitID, [Update, FileStatePair[]]>();
CommitCache.put(RootCommitID, [RootUpdate, [new FileStatePair(RootDirFid, RootStateID)]]);

var listOfCommits : CommitID[] = [RootCommitID];
var userSessionPair : Cache<String, SessionID> = new Cache<String, SessionID>();

console.log(RootStateID.toString());

describe('app', function() : void{
    it('test1', function() : void{

        // Create initial 
        var email: string = "abc.abc@abc";
        var commitID : CommitID = new CommitID(Guid.create());
        var sessionID : SessionID = new SessionID(Guid.create());
        
        //
        listOfCommits.push(commitID);
        userSessionPair.put(email, sessionID);

        var login : LoginDT = new LoginDT(sessionID,commitID);

        var fid : FileID = new FileID(Guid.create());
        var stateID : StateID = new StateID(Guid.create());
        var metaData : MetaData = new MetaData("user1",new Permissions("rwx"));
        var val : LeafValue = new LeafValue("abc");

        //
        var content : FileContent = new FileContent(stateID,metaData, val);
        var change : Change = new Change(fid,content);
        var update: Update[] = [new Update(new CommitID(Guid.create()), [change], [],login.cId)];

        //
        var fileStatePair : FileStatePair[] = [new FileStatePair(fid, stateID)];
        var CMT : CommitDT = new CommitDT(login.SessionID, update, fileStatePair);

        var CommitRes : ResponseDT<IResponse> = new CommitOperations(CMT).commitData(CommitCache, listOfCommits);

        
      expect(CommitRes).to.equal('Hello World!');
    });
  });