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
import { StateID } from "../DataTypes/StateID";
import { MetaData } from "../DataTypes/MetaData";
import { Permissions } from "../DataTypes/Permissions";
import { LeafValue } from "../DataTypes/LeafValue";
import { DirectoryEntry } from "../DataTypes/DirectoryEntry";
import { fileState } from "../DataTypes/Value";

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
export class mkFileStatePairs{

    currentState: FileStatePair[];

    constructor(reqcurrentState: FileStatePair[]){
        this.currentState = reqcurrentState;
    }

    getClassInstance(): FileStatePair[]{

        var fStatePair : FileStatePair[] = [];

        for (let i = 0; i < this.currentState.length; i++) {
            const element = this.currentState[i];

            fStatePair.push(new mkFileStatePair(element).getClassInstance());
        }

        return fStatePair;
    }

}

export class mkFileStatePair{
    fileStatePair : FileStatePair;
    constructor(fileStatePair : FileStatePair){
        this.fileStatePair = fileStatePair
    }

    getClassInstance() : FileStatePair{
        return new FileStatePair(
            new FileID(this.fileStatePair.fid.getGuid()),
            new StateID(this.fileStatePair.stid.getGuid())
        )
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

            updateClassInstance.push(new mkUpdate(element).getClassInstance());
        });

        return updateClassInstance;
    }
}

/**
 * Make Change class
 */
export class mkChanges{

    changes : Change[];

    constructor(changes : Change[]){
        this.changes = changes;
    }

    getClassInstance() : Change[]{
        var changesClass : Change[] = [];

        for (let i = 0; i < this.changes.length; i++) {
            const element = this.changes[i];
            changesClass.push(new Change(element.fid, new mkFileContent(element.content).getClassInstance()));
        }

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

        // prepare the metadata
        var metaData : MetaData = new MetaData();
        for (let j = 0; j < this.fileContent.metaData.Users.length; j++) {
            const user : string =  this.fileContent.metaData.Users[j];
            
            const perm  : Permissions | undefined =  this.fileContent.metaData.getUserPermissions(user);
            if(perm instanceof Permissions){
                metaData.putUserPermission(user, perm);
            }

        }

        // prepare the value
        var value : fileState = this.fileContent.value;
        if (  this.fileContent.value instanceof DirectoryValues ){
            value  = new mkDirectoryValue( this.fileContent.value).getClassInstance();
            
        }else if( this.fileContent.value instanceof LeafValue){
            value = new LeafValue( this.fileContent.value.value);
        }

        return new FileContent(new StateID(this.fileContent.stid.getGuid()), metaData, value);
    }

}

/**
 * Make Delete class
 */
export class mkDeletes{

    deletes : Delete[];

    constructor(deletes : Delete[]){
        this.deletes = deletes;
    }

    getClassInstance() : Delete[]{

        var deleteResponce : Delete[] = [];

        for (let i = 0; i < this.deletes.length; i++) {
            const element = this.deletes[i];
            deleteResponce.push(new Delete( new FileID( element.fid.getGuid() )));
        }

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
            dirObj.push(new DirectoryEntry(ele.name, new FileID(ele.fID.getGuid())));
        });

        return dirObj;
        
    }
}

export class mkUpdate{
    update : Update
    constructor(update : Update){
        this.update = update;
    }

    getClassInstance() : Update {
        
        
        return new Update(
            new CommitID(this.update.new_cid.getGuid()), 
            new mkChanges(this.update.changes).getClassInstance(),  
            new mkDeletes(this.update.deletes).getClassInstance(), 
            new CommitID( this.update.old_cid.getGuid())
            );
    }

}