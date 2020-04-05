import { GetRequestDT } from "../DataTypes/GetRequest";
import { FileStatePair } from '../DataTypes/FileStatePair';
import { CommitDT } from "../DataTypes/Commit";
import { Update } from "../DataTypes/Update";
import { Change } from "../DataTypes/Change";
import { Delete } from "../DataTypes/Delete";
import { FileContent } from "../DataTypes/Content";
import { LoginDT } from "../DataTypes/LoginDT";
import { ResponseDT } from "../Response/ResponseDT";
import { DirectoryValues } from "../DataTypes/DirectoryValue";
import { FileID } from "../DataTypes/FileID";
import { CommitID } from "../DataTypes/CommitID";
import { StateID } from "../DataTypes/StateID";
import { MetaData } from "../DataTypes/MetaData";
import { Permissions } from "../DataTypes/Permissions";
import { LeafValue } from "../DataTypes/LeafValue";
import { DirectoryEntry } from "../DataTypes/DirectoryEntry";
import { FileState } from "../DataTypes/Value";
import { Guid } from "guid-typescript";

/**
 * Make CommitRequest class
 */
export function getCommitRequestClassInstance(reqCommitDT : CommitDT) : CommitDT{

    return new CommitDT(
        reqCommitDT.getSessionID(),
        getUpdatesClassInstance(reqCommitDT.getUpdates()),
        getFileStatePairsClassInstance(reqCommitDT.getFileStatepairs())
    );

}

/**
 * Make GetRequest class
 */
export function getGetRequestClassInstance(reqGetRequestDT : GetRequestDT) : GetRequestDT{

    return new GetRequestDT(
        reqGetRequestDT.sid,
        reqGetRequestDT.need,
        reqGetRequestDT.cid,
        getFileStatePairsClassInstance(reqGetRequestDT.currentState)
    );
}

/**
 * Make FileStatePairs class
 */
export function getFileStatePairsClassInstance(currentState: FileStatePair[]): FileStatePair[]{

    var fStatePair : FileStatePair[] = [];

    for (let i = 0; i < currentState.length; i++) {
        const element = currentState[i];

        fStatePair.push(getFileStatePairClassInstance(element));
    }

    return fStatePair;

}

export function getFileStatePairClassInstance(fileStatePair : FileStatePair) : FileStatePair{
    return new FileStatePair(
        new FileID(fileStatePair.getFileID().getGuid()),
        new StateID(fileStatePair.getStateID().getGuid())
    )
}


/**
 * Make Update class
 */
export function getUpdatesClassInstance(updates: Update[]) : Update[]{

    var updateClassInstance : Update[] = [];

    updates.forEach(element => {

        updateClassInstance.push(getUpdateClassInstance(element));
    });

    return updateClassInstance;
}

/**
 * Make Change class
 */
export function getChangesClassInstance(changes : Change[]) : Change[]{
    var changesClass : Change[] = [];

    for (let i = 0; i < changes.length; i++) {
        const element = changes[i];
        changesClass.push(new Change(element.getFileID(), getFileContentClassInstance(element.getContent())));
    }

    return changesClass;
}

/**
 * Make FileCOntent class
 */
export function getFileContentClassInstance(fileContent: FileContent) : FileContent {

    // prepare the metadata
    var metaData : MetaData = new MetaData();
    for (let j = 0; j < fileContent.getMetaData().Users.length; j++) {
        const user : string =  fileContent.getMetaData().Users[j];
        
        const perm  : Permissions | undefined =  fileContent.getMetaData().getUserPermissions(user);
        if(perm instanceof Permissions){
            metaData.putUserPermission(user, perm);
        }

    }

    // prepare the value
    var value : FileState = fileContent.getValue();
    if (  value instanceof DirectoryValues ){

        value = getDirectoryValueClassInstance( value );
        
    }else if( fileContent.getValue() instanceof LeafValue){
        value = new LeafValue( value.toString() );
    }

    return new FileContent(new StateID(fileContent.getStid().getGuid()), metaData, value);

}

/**
 * Make Delete class
 */
export function getDeleteClassInstance(deletes : Delete[]) : Delete[]{

    var deleteResponce : Delete[] = [];

    for (let i = 0; i < deletes.length; i++) {
        const element = deletes[i];
        deleteResponce.push(new Delete( new FileStatePair( element.getFileID() , element.getStateID() )));
    }

    return deleteResponce;

}

export function getLogginDTClassInstance(loginRes : LoginDT): LoginDT{
    return new LoginDT(loginRes.SessionID, loginRes.cId);   
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


export function getDirectoryValueClassInstance(dirVal : DirectoryValues): DirectoryValues{

    var dirObj : DirectoryValues = new DirectoryValues();
    var dirEntries : DirectoryEntry[] = dirVal.getValue();
    
    
    for (let i = 0; i < dirVal.getValue().length; i++) {
        const ele = dirVal.getValue()[i];
        
        dirObj.push(new DirectoryEntry(ele.getDirectoryName(), new FileID(ele.getFileID().getGuid())));
    }

    return dirObj;

}

export function getUpdateClassInstance(update : Update) : Update {
           
    return new Update(
        new CommitID(update.getNewCid().getGuid()), 
        getChangesClassInstance(update.getChanges()),  
        getDeleteClassInstance(update.getDelets()), 
        new CommitID(update.getOldCid().getGuid())
    );

}

//----------------------------------------- Helper functions to create files -----------------------------------------

export function createDirectoryValueAndFileStatePair( user : string, permission : string ) : 
    [Change,FileStatePair]{

    // Get all the ID for the file
    var fileStatePair : FileStatePair = new FileStatePair(new FileID(Guid.create()), new StateID(Guid.create()));

    // Create metadata
    var metaData : MetaData = new MetaData();
    metaData.putUserPermission(user,new Permissions(permission));

    // Create directory file change
    var directory : DirectoryValues = new DirectoryValues();
    var dirContent : FileContent = new FileContent(fileStatePair.getStateID(), metaData, directory);

    return [new Change(fileStatePair.getFileID(), dirContent) , fileStatePair];

}

export function createFileValueWithFileStatePair( fileName : string , user : string, permission : string, leafValue : string , 
    parentDirChange : Change ) : [Change , Change, FileStatePair] {

    // New File id, state id and metadata for the new file
    var fileStatePair : FileStatePair = new FileStatePair(new FileID(Guid.create()) , new StateID(Guid.create()) );
    var fileMetaData : MetaData = new MetaData();
    fileMetaData.putUserPermission(user, new Permissions(permission));

    // New File Content
    var fileContent : FileContent = new FileContent(fileStatePair.getStateID() , fileMetaData, new LeafValue(leafValue));

    // Change object for the new file
    var fileChnage : Change = new Change( fileStatePair.getFileID() , fileContent );

    // Add the file info the parent directory as file 
    var fileParentDirEnt : DirectoryEntry = new DirectoryEntry( fileName , fileStatePair.getFileID());
    var parentDirectory : DirectoryValues = < DirectoryValues > parentDirChange.getContent().getValue();
    parentDirectory.push(fileParentDirEnt);
    
    // Create new parent content object with updated state id, directory value
    var parentDirContent = new FileContent( new StateID(Guid.create()), parentDirChange.getContent().getMetaData() , parentDirectory);
    parentDirChange = new Change( parentDirChange.getFileID(), parentDirContent );

    return [parentDirChange , fileChnage , fileStatePair];
}

export function createFile(fileName : string , user : string, permission : string, leafValue : string ) :
     [ FileStatePair, Change, DirectoryEntry] {

    var fileStatePair : FileStatePair = new FileStatePair(new FileID(Guid.create()) , new StateID(Guid.create()) );
    var fileMetaData : MetaData = new MetaData();
    fileMetaData.putUserPermission(user, new Permissions(permission));

    // New File Content
    var fileContent : FileContent = new FileContent(fileStatePair.getStateID() , fileMetaData, new LeafValue(leafValue));

    // Change object for the new file
    var fileChange : Change = new Change( fileStatePair.getFileID() , fileContent );

    // Add the file info the parent directory as file 
    var fileDirEnt : DirectoryEntry = new DirectoryEntry( fileName , fileStatePair.getFileID());

    return [fileStatePair, fileChange, fileDirEnt];
}