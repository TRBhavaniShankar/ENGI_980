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

// Initialte the caches
var ChangeCache : Cache<Guid, FileContent> = new Cache<Guid, FileContent>();
var UpdateCache : Cache<Guid, [Update, FileStatePair[]]> = new Cache<Guid, [Update, FileStatePair[]]>();
var listOfCommits : Cache<String, Guid[]> = new Cache<String, Guid[]>();
var CacheCommits : Cache<Guid, CommitDT> = new Cache<Guid, CommitDT>();
var userSessionPair : Cache<String, Guid> = new Cache<String, Guid>();

describe('Unt test function', () => {
    it('', () => {

        // Create initial 
        var email: string = "abc.abc@abc";
        var commitID : Guid = Guid.create();
        var sessionID : Guid = Guid.create();
        
        //
        listOfCommits.put(email, [commitID]);
        userSessionPair.put(email, sessionID);

        var login : LoginDT = new LoginDT(sessionID,commitID);

        var fid : Guid = Guid.create();
        var stateID : Guid = Guid.create();
        var metaData : MetaData = new MetaData();
        var val : LeafValue = new LeafValue("abc");

        //
        var content : FileContent = new FileContent(stateID,metaData, val);
        var change : Change = new Change(fid,content);
        var del : Delete = new Delete(Object);
        var update: Update[] = [new Update(Guid.create(), [change], [del],login.cId)];

        //
        var fileStatePair : FileStatePair[] = [new FileStatePair(fid, stateID)];
        var CMT : CommitDT = new CommitDT(login.sID,update,fileStatePair);

        var CommitRes : [Update, Boolean, String] = new CommitOperations(CMT).CommitData(ChangeCache, UpdateCache, listOfCommits, email);

        
      expect(CommitRes[0]).to.equal('Hello World!');
    });
  });