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
import { Dir } from "fs";
import { Delete } from "../DataTypes/Delete";


export function commitZero(rootData : CommitDT, searchResUpdate : Update) : [CommitDT, Change[], Change[]]{

    var commitFilePair : FileStatePair[] = [];
    for (let i = 0; i < searchResUpdate.getChanges().length; i++) {
        const element = searchResUpdate.getChanges()[i];
        commitFilePair.push(new FileStatePair(element.getFileID() , element.getContent().getStid()));
    }

    var parentDirectory : DirectoryValues = < DirectoryValues > searchResUpdate.getChanges()[0].getContent().getValue();

    var Dir1 : [Change, FileStatePair] = createDirectoryValueAndFileStatePair("user1","rwx");
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

    var Dir2 : [Change, FileStatePair] = createDirectoryValueAndFileStatePair("user1","rwx");
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

    var Dir3 : [Change, FileStatePair] = createDirectoryValueAndFileStatePair("user1","rwx");
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

    var Dir4 : [Change, FileStatePair] = createDirectoryValueAndFileStatePair("user1","rwx");
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

    var DirectoryList : Change[] = [parentChange1, Dir1[0], Dir2[0], Dir3[0], Dir4[0]];
    var FileChangeList : Change[] = [file1[1], file2[1], file3[1], file4[1], file5[1], file6[1], file7[1], file8[1]]

    return [new CommitDT( rootData.getSessionID(), [ update1, update2, update3, update4], commitFilePair ), DirectoryList, FileChangeList];

}

export function commitOne(rootData : CommitDT, searchResUpdate : Update,
    CommitCache : Cache<CommitID, CommitDT>, 
    listOfCommits : CommitID[]
    ) : [CommitDT , CommitDT, [CommitDT, Change[] , Change[]] ]{

    
    
    var cmtOriginal : [CommitDT, Change[] , Change[]] = commitZero(rootData, searchResUpdate) ;

    var parentChange : Change = cmtOriginal[1][0];
    var Dir1 : Change = cmtOriginal[1][1];
    var Dir2 : Change = cmtOriginal[1][2];
    var Dir3 : Change = cmtOriginal[1][3];
    var Dir4 : Change = cmtOriginal[1][4]

    var file1 : Change = cmtOriginal[2][0];
    var file2 : Change = cmtOriginal[2][1];
    var file3 : Change = cmtOriginal[2][2];
    var file4 : Change = cmtOriginal[2][3];
    var file5 : Change = cmtOriginal[2][4];
    var file6 : Change = cmtOriginal[2][5];
    var file7 : Change = cmtOriginal[2][6];
    var file8 : Change = cmtOriginal[2][7];

    var cmt : CommitDT = getCommitRequestClassInstance(cmtOriginal[0]);
    
    var cmtResp : ResponseDT<IResponse> = new CommitOperations(cmt).processCommit(CommitCache, listOfCommits);

    
    // ------------------------------------ Second commit ------------------------------------
    var updateDeletes : Delete[] = [];
    var updateChanges : Change[] = [];
    var updateFSPair : FileStatePair[] = [];
    // Change in D1
    var new_dir1Value : DirectoryValues = new DirectoryValues();
    var dir1Value : DirectoryValues = <DirectoryValues> Dir1.getContent().getValue(); 
    for (let i = 0; i < dir1Value.getValue().length; i++) {
        const element = dir1Value.getValue()[i];

        if(element.getFileID().isEqual(file2.getFileID())){
            updateDeletes.push(new Delete(new FileStatePair(element.getFileID() , file2.getContent().getStid())));
            
        }else{
            new_dir1Value.push(element);
        }

    }
    var dir1StateID : StateID = new StateID(Guid.create());
    var dir1 : Change = new Change(Dir1.getFileID(),
                    new FileContent(dir1StateID , Dir1.getContent().getMetaData(),new_dir1Value));
    updateChanges.push(dir1);
    updateFSPair.push(new FileStatePair(dir1.getFileID() , dir1.getContent().getStid()));
    updateFSPair.push(new FileStatePair(file1.getFileID() , file1.getContent().getStid()));

    updateFSPair.push(new FileStatePair(Dir3.getFileID() , Dir3.getContent().getStid()));
    updateFSPair.push(new FileStatePair(file5.getFileID() , file5.getContent().getStid()));
    updateFSPair.push(new FileStatePair(file6.getFileID() , file6.getContent().getStid()));

    // Change in D2
    var dir2Value : DirectoryValues = <DirectoryValues> Dir2.getContent().getValue(); 
    var Dir5 : [Change, FileStatePair] = createDirectoryValueAndFileStatePair("user1","rwx");
    dir2Value.push(new DirectoryEntry("D5", Dir5[0].getFileID()));

    var dir2 : Change = new Change(Dir2.getFileID(),
                    new FileContent(new StateID(Guid.create()) , Dir2.getContent().getMetaData(), dir2Value));
    updateChanges.push(dir2);
    updateChanges.push(Dir5[0]);

    updateFSPair.push(new FileStatePair(dir2.getFileID() , dir2.getContent().getStid()));
    updateFSPair.push(new FileStatePair(file3.getFileID() , file3.getContent().getStid()));
    updateFSPair.push(new FileStatePair(file4.getFileID() , file4.getContent().getStid()));
    updateFSPair.push(new FileStatePair(Dir5[0].getFileID() , Dir5[0].getContent().getStid()));

    // Change in D4
    var file9 : [Change , Change , FileStatePair] = createFileValueWithFileStatePair("F9" , "user1" , "rwx" , "zzz", Dir4);
    updateChanges.push(file9[0]);
    updateChanges.push(file9[1]);
    Dir4 = file9[0];

    updateFSPair.push(new FileStatePair(Dir4.getFileID() , Dir4.getContent().getStid()));
    updateFSPair.push(new FileStatePair(file9[1].getFileID() , file9[1].getContent().getStid()));
    updateFSPair.push(new FileStatePair(file7.getFileID() , file7.getContent().getStid()));
    updateFSPair.push(new FileStatePair(file8.getFileID() , file8.getContent().getStid()));

    var commitFirstId : CommitID = new CommitID(Guid.create());

    // New update to commit
    var update : Update = new Update(commitFirstId , updateChanges , updateDeletes , cmt.getUpdates()[cmt.getUpdates().length -1].getNewCid());

    var cmt1 : CommitDT =  new CommitDT( rootData.getSessionID(), [ update ], updateFSPair );

    return [ cmt , cmt1 , cmtOriginal];  

    }

export function commitTwo( listOfCommits : CommitID[], cmtOriginal : [CommitDT, Change[] , Change[]] ) : CommitDT{

        var parentChange : Change = cmtOriginal[1][0];
        var Dir1 : Change = cmtOriginal[1][1];
        var Dir2 : Change = cmtOriginal[1][2];
        var Dir3 : Change = cmtOriginal[1][3];
        var Dir4 : Change = cmtOriginal[1][4]
    
        var file1 : Change = cmtOriginal[2][0];
        var file2 : Change = cmtOriginal[2][1];
        var file3 : Change = cmtOriginal[2][2];
        var file4 : Change = cmtOriginal[2][3];
        var file5 : Change = cmtOriginal[2][4];
        var file6 : Change = cmtOriginal[2][5];
        var file7 : Change = cmtOriginal[2][6];
        var file8 : Change = cmtOriginal[2][7];

        
        // ------------------------------------ Third commit ------------------------------------
        var updateDeletes : Delete[] = [];
        var updateChanges : Change[] = [];
        var updateFSPair : FileStatePair[] = [];

        updateFSPair.push(new FileStatePair(Dir1.getFileID() , Dir1.getContent().getStid()));
        updateFSPair.push(new FileStatePair(file1.getFileID() , file1.getContent().getStid()));
        updateFSPair.push(new FileStatePair(file2.getFileID() , file2.getContent().getStid()));

        // Change in D2
        updateFSPair.push(new FileStatePair(Dir2.getFileID() , Dir2.getContent().getStid()));
        updateFSPair.push(new FileStatePair(file3.getFileID() , file3.getContent().getStid()));
        updateFSPair.push(new FileStatePair(file4.getFileID() , file4.getContent().getStid()));
        
        
        var Dir6 : [Change, FileStatePair] = createDirectoryValueAndFileStatePair("user1","rwx");
        var file10 : [Change , Change , FileStatePair] = createFileValueWithFileStatePair("F10" , "user1" , "rwx" , "1111", Dir6[0]);
        var file11 : [Change , Change , FileStatePair] = createFileValueWithFileStatePair("F11" , "user1" , "rwx" , "222", file10[0]);
        Dir6[0] = file11[0];
        
        var dir3Value : DirectoryValues = <DirectoryValues> Dir3.getContent().getValue(); 
        dir3Value.push(new DirectoryEntry("D6", Dir6[0].getFileID()));

        var dir3 : Change = new Change(Dir3.getFileID(),
                        new FileContent(new StateID(Guid.create()) , Dir3.getContent().getMetaData(), dir3Value));
        updateChanges.push(dir3);
        updateChanges.push(Dir6[0]);
        updateChanges.push(file10[1]);
        updateChanges.push(file11[1]);

        updateFSPair.push(new FileStatePair(Dir3.getFileID() , Dir3.getContent().getStid()));
        updateFSPair.push(new FileStatePair(file5.getFileID() , file5.getContent().getStid()));
        updateFSPair.push(new FileStatePair(file6.getFileID() , file6.getContent().getStid()));
        updateFSPair.push(new FileStatePair(Dir6[0].getFileID() , Dir6[0].getContent().getStid()));
        updateFSPair.push(file10[2]);
        updateFSPair.push(file11[2]);

        updateFSPair.push(new FileStatePair(Dir4.getFileID() , Dir4.getContent().getStid()));
        updateFSPair.push(new FileStatePair(file7.getFileID() , file7.getContent().getStid()));
        updateFSPair.push(new FileStatePair(file8.getFileID() , file8.getContent().getStid()));

        // D7 new directory to parent
        var Dir7 : [Change, FileStatePair] = createDirectoryValueAndFileStatePair("user1","rwx");

        var parentDir : DirectoryValues = <DirectoryValues> parentChange.getContent().getValue(); 
        parentDir.push(new DirectoryEntry("D7", Dir7[0].getFileID()));

        var parentChange_2 : Change = new Change(parentChange.getFileID(),
                        new FileContent(new StateID(Guid.create()) , parentChange.getContent().getMetaData(), parentDir));
        
        updateChanges.push(parentChange_2);
        updateFSPair.push(new FileStatePair(parentChange_2.getFileID() , parentChange_2.getContent().getStid()));

        var commitSecondId : CommitID = new CommitID(Guid.create());

        // New update to commit
        var update : Update = new Update(commitSecondId , updateChanges , updateDeletes , listOfCommits[listOfCommits.length-2]);

        return new CommitDT( new SessionID(Guid.create()), [ update ], updateFSPair );
      
}


export function commitTwo_S1( listOfCommits : CommitID[], cmtOriginal : [CommitDT, Change[] , Change[]] ) : CommitDT{

    var parentChange : Change = cmtOriginal[1][0];
    var Dir1 : Change = cmtOriginal[1][1];
    var Dir2 : Change = cmtOriginal[1][2];
    var Dir3 : Change = cmtOriginal[1][3];
    var Dir4 : Change = cmtOriginal[1][4]

    var file1 : Change = cmtOriginal[2][0];
    var file2 : Change = cmtOriginal[2][1];
    var file3 : Change = cmtOriginal[2][2];
    var file4 : Change = cmtOriginal[2][3];
    var file5 : Change = cmtOriginal[2][4];
    var file6 : Change = cmtOriginal[2][5];
    var file7 : Change = cmtOriginal[2][6];
    var file8 : Change = cmtOriginal[2][7];

    
    // ------------------------------------ Third commit ------------------------------------
    var updateDeletes : Delete[] = [];
    var updateChanges : Change[] = [];
    var updateFSPair : FileStatePair[] = [];

    updateFSPair.push(new FileStatePair(Dir1.getFileID() , Dir1.getContent().getStid()));
    updateFSPair.push(new FileStatePair(file1.getFileID() , file1.getContent().getStid()));
    

    var newFile2 : Change = new Change(file2.getFileID(),
        new FileContent(new StateID(Guid.create()), file2.getContent().getMetaData(), new LeafValue("aaaaaaaaaaaaa"))
    );
    updateChanges.push(newFile2);
    updateFSPair.push(new FileStatePair(newFile2.getFileID() , newFile2.getContent().getStid()));

    // Change in D2
    updateFSPair.push(new FileStatePair(Dir2.getFileID() , Dir2.getContent().getStid()));
    updateFSPair.push(new FileStatePair(file3.getFileID() , file3.getContent().getStid()));
    updateFSPair.push(new FileStatePair(file4.getFileID() , file4.getContent().getStid()));
    
    
    var Dir6 : [Change, FileStatePair] = createDirectoryValueAndFileStatePair("user1","rwx");
    var file10 : [Change , Change , FileStatePair] = createFileValueWithFileStatePair("F10" , "user1" , "rwx" , "1111", Dir6[0]);
    var file11 : [Change , Change , FileStatePair] = createFileValueWithFileStatePair("F11" , "user1" , "rwx" , "222", file10[0]);
    Dir6[0] = file11[0];
    
    var dir3Value : DirectoryValues = <DirectoryValues> Dir3.getContent().getValue(); 
    dir3Value.push(new DirectoryEntry("D6", Dir6[0].getFileID()));

    var dir3 : Change = new Change(Dir3.getFileID(),
                    new FileContent(new StateID(Guid.create()) , Dir3.getContent().getMetaData(), dir3Value));
    updateChanges.push(dir3);
    updateChanges.push(Dir6[0]);
    updateChanges.push(file10[1]);
    updateChanges.push(file11[1]);

    updateFSPair.push(new FileStatePair(Dir3.getFileID() , Dir3.getContent().getStid()));
    updateFSPair.push(new FileStatePair(file5.getFileID() , file5.getContent().getStid()));
    updateFSPair.push(new FileStatePair(file6.getFileID() , file6.getContent().getStid()));
    updateFSPair.push(new FileStatePair(Dir6[0].getFileID() , Dir6[0].getContent().getStid()));
    updateFSPair.push(file10[2]);
    updateFSPair.push(file11[2]);

    updateFSPair.push(new FileStatePair(Dir4.getFileID() , Dir4.getContent().getStid()));
    updateFSPair.push(new FileStatePair(file7.getFileID() , file7.getContent().getStid()));
    updateFSPair.push(new FileStatePair(file8.getFileID() , file8.getContent().getStid()));

    // D7 new directory to parent
    var Dir7 : [Change, FileStatePair] = createDirectoryValueAndFileStatePair("user1","rwx");

    var parentDir : DirectoryValues = <DirectoryValues> parentChange.getContent().getValue(); 
    parentDir.push(new DirectoryEntry("D7", Dir7[0].getFileID()));

    var parentChange_2 : Change = new Change(parentChange.getFileID(),
                    new FileContent(new StateID(Guid.create()) , parentChange.getContent().getMetaData(), parentDir));
    
    updateChanges.push(parentChange_2);
    updateFSPair.push(new FileStatePair(parentChange_2.getFileID() , parentChange_2.getContent().getStid()));

    var commitSecondId : CommitID = new CommitID(Guid.create());

    // New update to commit
    var update : Update = new Update(commitSecondId , updateChanges , updateDeletes , listOfCommits[listOfCommits.length-2]);

    return new CommitDT( new SessionID(Guid.create()), [ update ], updateFSPair );
  
}