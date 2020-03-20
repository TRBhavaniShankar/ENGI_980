import { GetRequestDT } from "../DataTypes/GetRequest";
import {FileStatePair} from '../DataTypes/FileStatePair';
import { CommitDT } from "../DataTypes/Commit";
import { Update } from "../DataTypes/Update";
import { Guid } from "guid-typescript";
import { Change } from "../DataTypes/Change";
import { Delete } from "../DataTypes/Delete";
import { FileContent } from "../DataTypes/Content";
import { LoginDT } from "../DataTypes/LoginDT";
import { ResponseDT } from "../Response/ResponseDT";
import { DirectoryValues } from "../DataTypes/DirectoryValue";
import { SessionID } from "../DataTypes/SessionID";
import { FileID } from "../DataTypes/FileID";
import { CommitID } from "../DataTypes/CommitID";

/**
 * Make CommitRequest class
 */
export class mkCommitRequest{

    reqCommitDT : CommitDT;

    constructor(reqCommitDT : CommitDT){
        this.reqCommitDT = reqCommitDT;
    }

    getClassInstance() : CommitDT{

        var sid : SessionID = this.reqCommitDT.sessionid;
        var updates: Update[] = new mkUpdates(this.reqCommitDT.updates).getClassInstance();

        var currentState: FileStatePair[] = new mkFileStatePairs(this.reqCommitDT.currentState).getClassInstance();

        return new CommitDT(sid, updates, currentState);
    }

}

/**
 * Make GetRequest class
 */
export class mkGetRequest{

    reqGetRequestDT : GetRequestDT;

    constructor(reqGetRequestDT : GetRequestDT){
        this.reqGetRequestDT = reqGetRequestDT;
    }

    getClassInstance() : GetRequestDT{

        var sid : SessionID = this.reqGetRequestDT.sid;
        var need: FileID[] = this.reqGetRequestDT.need;
        var cid : CommitID = this.reqGetRequestDT.cid;
        var currentState: FileStatePair[] = new mkFileStatePairs(this.reqGetRequestDT.currentState).getClassInstance();

        return new GetRequestDT(sid, need, cid, currentState);
    }

}

/**
 * Make FileStatePairs class
 */
class mkFileStatePairs{

    currentState: FileStatePair[];

    constructor(reqcurrentState: FileStatePair[]){
        this.currentState = reqcurrentState;
    }

    getClassInstance(): FileStatePair[]{

        var fStatePair : FileStatePair[] = [];

        this.currentState.forEach(Element =>{

            fStatePair.push(new FileStatePair(Element.fid, Element.stid));
        });

        return fStatePair;
    }

}

/**
 * Make Update class
 */
class mkUpdates{
    updates: Update[];

    constructor(updates: Update[]) {
        this.updates = updates;
    }

    getClassInstance() : Update[]{

        var updateClassInstance : Update[] = [];

        this.updates.forEach(element => {

            var changes : Change[] = new mkChanges(element.changes).getClassInstance();
            var deletes : Delete[] = new mkDeletes(element.deletes).getClassInstance();

            updateClassInstance.push(new Update(element.new_cid, changes, deletes, element.old_cid));
        });

        return updateClassInstance;
    }
}

/**
 * Make Change class
 */
class mkChanges{

    changes : Change[];

    constructor(changes : Change[]){
        this.changes = changes;
    }

    getClassInstance() : Change[]{
        var changesClass : Change[] = [];

        this.changes.forEach(element => {
            changesClass.push(new Change(element.fid, new mkFileContent(element.content).getClassInstance()));
        });

        return changesClass;
    }
}

/**
 * Make FileCOntent class
 */
class mkFileContent{

    fileContent: FileContent;

    constructor(fileContent: FileContent){
        this.fileContent = fileContent;
    }

    getClassInstance() : FileContent {

        return new FileContent(this.fileContent.stid, this.fileContent.metaData, this.fileContent.value);
    }

}

/**
 * Make Delete class
 */
class mkDeletes{

    deletes : Delete[];

    constructor(deletes : Delete[]){
        this.deletes = deletes;
    }

    getClassInstance() : Delete[]{

        var deleteResponce : Delete[] = [];

        this.deletes.forEach(Element => {
            deleteResponce.push(new Delete(Element.fid));
        })

        return deleteResponce;
    }

}

export class mkLogginDT{
    
    loginRes : LoginDT

    constructor(loginRes : LoginDT ){
        this.loginRes = loginRes;
    }

    getClassInstance(): LoginDT{
        return new LoginDT(this.loginRes.SessionID, this.loginRes.cId);
    }
}

export class mkResponseDT<type>{
    
    resp : ResponseDT<type>

    constructor(resp : ResponseDT<type>){
        this.resp = resp;
    }

    getClassInstance(): ResponseDT<type>{
        return new ResponseDT<type>(this.resp.status, this.resp.message, this.resp.className, this.resp.object);
    }
}


export class mkDirectoryValue{
    
    dirVal : DirectoryValues

    constructor(dirVal : DirectoryValues){
        this.dirVal = dirVal;
    }

    getClassInstance(): DirectoryValues{

        var dirObj : DirectoryValues = new DirectoryValues();

        this.dirVal.entries.forEach(ele => {
            dirObj.push(ele);
        });

        return dirObj;
        
    }
}