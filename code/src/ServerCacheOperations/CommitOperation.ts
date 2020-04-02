import { Update } from "../DataTypes/Update"
import { FileStatePair } from "../DataTypes/FileStatePair"
import { Cache } from '../Cache/Cache';
import { FileContent } from '../DataTypes/Content';
import { Change } from "../DataTypes/Change";
import { Delete } from "../DataTypes/Delete";
import { CommitDT } from "../DataTypes/Commit";
import { DirectoryValues } from "../DataTypes/DirectoryValue";
import { getDirectoryValueClassInstance, getUpdateClassInstance, getFileStatePairsClassInstance, getFileStatePairClassInstance } from "../MakeClasses/CreateClasses";
import { FileID } from "../DataTypes/FileID";
import { CommitID } from "../DataTypes/CommitID";
import { SessionID } from "../DataTypes/SessionID";
import { Success, IResponse, Failure } from "../Response/ResponseObjects";
import { ResponseDT } from "../Response/ResponseDT";
import { StateID } from "../DataTypes/StateID";
import { DirectoryEntry } from "../DataTypes/DirectoryEntry";
import { FileState } from "../DataTypes/Value";

export class CommitOperations{

    
    private commitObject : CommitDT;
    private sid: SessionID ;
    private updates: Update[] ;
    private currentState: FileStatePair[];

    constructor(commitObject : CommitDT){
        this.commitObject = commitObject;
        this.sid = commitObject.getSessionID();
        this.updates = commitObject.getUpdates();
        this.currentState = commitObject.getFileStatepairs();
    }

    /**
     * This functions commits the commit data which is present in the same class, 
       according to the old commit id sent by the user, which is as follows. 
     * A commit record proposes a commit to the server.

     * Case 1 : If the server's head is cdx, it can simply reply with "success". 
                (This can happen in the case of a resend.)
     * Case 2 : If the server's head is not cdx, but it was in the past, then the 
                server sends back a "files" response to update the client from state cd0
     * Case 3 : If the server's head is still cid0 at the time the commit is received, 
                then the server can simply make the updates proposed and replies with a "success" response.
     * Case 4 : Otherwise, the server will try to merge the proposed commit with its current 
                head to produce a new head, CD1. It then replies with a "files" response. (The interpretation 
                of the "files" response is as above.)
     * 
     * @param CommitCache : This is the cache which stores the Commit
     * @param listOfCommits : This is the cache which stores the list of commit, which is a series in the array
     */

    public processCommit(CommitCache : Cache<CommitID, CommitDT>, 
                      listOfCommits : CommitID[]) : 
    ResponseDT<IResponse> {

        var cids : CommitID[] = listOfCommits;
        if(this.updates.length > 0){
            var augmentedData : Update = this.processingAugmentation(cids);

            // Get the data head of the commit
            var headCommitObject : CommitDT = < CommitDT > CommitCache.get(cids[cids.length - 1]);
            var head : Update[] = headCommitObject.getUpdates();
            // As the head points to the CommitCache, we need to make a new object for update in head
            var tempHeadUpdate : Update = getUpdateClassInstance(head[0]);

            if(cids.indexOf(augmentedData.getNewCid()) != -1){

                if(augmentedData.getNewCid().isEqual(cids[cids.length - 1])){
                    // Case 1 : If the server's head is cdx, it can simply reply with "success". 
                    // (This can happen in the case of a resend.)

                    return new ResponseDT<Success>(200, "This commit is already the head of the commit", "Success", new Success());
                }
                else{
                    // Case 2 : If the server's head is not cdx, but it was in the past, then the server sends back a "files" 
                    // response to update the client from state cd0
                    
                    // Get all the files from the head change and head delete which are related to the file id's sent by the user
                    var changes : Change[] = [];
                    var deletes : Delete[] = [];

                    // New changes
                    for (let i = 0; i < augmentedData.getChanges().length; i++) {
                        const changeElement = augmentedData.getChanges()[i];
                        
                        for (let j = 0; j < tempHeadUpdate.getChanges().length; j++) {
                            const tempHeadChange = tempHeadUpdate.getChanges()[j];

                            if(tempHeadChange.getFileID().isEqual(changeElement.getFileID())){
                                changes.push(tempHeadChange);
                            }
                    
                        }

                    }

                    // New deletes
                    for (let i = 0; i < augmentedData.getDelets().length; i++) {
                        const deleteElement = augmentedData.getDelets()[i];
                        
                        for (let j = 0; j < tempHeadUpdate.getDelets().length; j++) {
                            const tempHeadDelete = tempHeadUpdate.getDelets()[j];

                            if(tempHeadDelete.getFileID().isEqual(deleteElement.getFileID())){
                                deletes.push(tempHeadDelete);
                            }
                    
                        }

                    }

                    var updatedData : Update = new Update(augmentedData.getNewCid(), changes, deletes, augmentedData.getOldCid());

                    return new ResponseDT<Update>(200, "This commit was a commit in the past, the corresponding data at the commit has been provided",
                    "Update", updatedData);
                }
                
            }
            else{

                if(augmentedData.getOldCid().isEqual( cids[cids.length - 1])){
                    // Case 3 : If the server's head is still cid0 at the time the commit is received, 
                    // then the server can simply make the updates proposed and replies with a "success" response.
                    var newHead : Update = this.commitData(tempHeadUpdate, augmentedData, CommitCache, listOfCommits);
        
                    return new ResponseDT<Success>(200, "Successfully added the commit as the head of commit", "Success", new Success());

                }
                else{ //
                    // Case 4 : Otherwise, the server will try to merge the proposed commit with its current head to produce 
                    // a new head, CD1. It then replies with a "files" response. (The interpretation of the "files" response is as above.)

                    // As the newMergedHead points to the CommitCache, we need to make a new object for update in newMergedHead
                    var newMergedHead = getUpdateClassInstance(this.mergerUnknownFiles(tempHeadUpdate, augmentedData));

                    var newHead : Update = this.commitData(tempHeadUpdate, newMergedHead, CommitCache, listOfCommits);

                    // Get head of the commit to return
                    return new ResponseDT<Update>(200, "We could not find the old commit id in the list of commit, therefore we"+
                                                    " have merged the data that you have sent with the head of commit data", 
                                                    "Update", newHead);

                }        
            }
        }else{
            return new ResponseDT<Failure>(200, "No changes to commit", "Failure", new Failure("No changes to commit"));
        }
    }

    /**
     * As the input that we are getting from the use Consists of series of update, i.e., list of
     *  updates, the server needs to combine all the updates and make one update for the commit.
     * 
     * If commit is :
     *   commit{ sid: s, updates: [
                                  update{ getNewCid() : cidy,  update: updates, deletes: deletes, getOldCid() : cidx }, 
                                  update{ getNewCid() : cidx,  update: updates, deletes: deletes, getOldCid() : cid0 }], 
                  currentState: pairs }

     * So here the client is proposing that the server update from cid0 to cidx and then to cidy. It does so as follows.

     * If cidx is the current head, the server can make cidy the current head and send back a success reply. 
        (This could happen if the server got an earlier update message, but the reply was lost before the client could get it.)
     * If cidx is not the current head, but was in the past, the server will ignore the second update record. 
        It behaves as if the message was
     * commit{ sid: s, updates: [
                                  update{ getNewCid() : cidy,  update: updates, deletes: deletes, getOldCid() : cidx }], 
                  currentState: pairs1 }
     * where pairs1 is a suitably modified copy of pairs.

     * If cidx was never the current head, then the server needs to combine the two updates to make one update,
       and behaves as if the request was
     *  commit{ sid: s, updates: [
                                  update{ getNewCid() : cidy,  update: updates1, deletes: deletes1, getOldCid() : cid0 }], 
                  currentState: pairs }
     * 
     * @param cids : list of Commit ID in sequence of commits of the user
     * @returns UpdateFileStatepair : Returns a tuple of Update which is processed augmentation.  
     *                                And list of filestate pair.
     */
    private processingAugmentation( cids : CommitID[]) : Update {

        /**
         * 
         * Old cid of the first update is already present
         * 
         * If cidx is the current head, the server can make cidy the current head and send back a success reply. 
         * (This could happen if the server got an earlier update message, but the reply was lost before the client could get it.)
         * */

        // The lastest commit in the series of commit will consists of all the resent updates and delets
        var augmentedChanges : Change[] = augmentedChanges = this.updates[this.updates.length - 1].getChanges();
        var augmentedDeletes : Delete[] = augmentedDeletes = this.updates[this.updates.length - 1].getDelets();

        // var augmentedChanges : Change[] = [];
        // var augmentedDeletes : Delete[] = [];

        var i : number = this.updates.length - 2;

        // Check if the the old commit id in the series of commit, if present then break the loop
        // if not then add them up to make one update object
        while(0 <= i && i < this.updates.length -1 && this.updates.length > 1){

            // Take the change and delete list from list of updates, one by one
            var currChange : Change[] = this.updates[i].getChanges();
            var currDelets : Delete[] = this.updates[i].getDelets();

            // Go through all the change elemnts from the current update element and remove all the 
            // ones which are present in the augmentedChanges, which will be the ultimate change list for this commit
            for (let j = 0; j < augmentedChanges.length; j++) {
                const augElement : Change = augmentedChanges[j];
    
                for (let k = 0; k < currChange.length; k++) {
                    const currElement : Change= currChange[k];
    
                    if(currElement.getFileID().isEqual(augElement.getFileID())){
                        currChange.splice(k,1);
                    }
                }
            }
            augmentedChanges = augmentedChanges.concat(currChange);
            
            // Go through all the delete elemnts from the current update element and remove all the ones which are present
            // in the augmentedDeletes, which will be the ultimate delete list for this commit
            for (let j = 0; j < augmentedDeletes.length; j++) {
                const augElement : Delete = augmentedDeletes[j];
    
                for (let k = 0; k < currDelets.length; k++) {
                    const currElement : Delete = currDelets[k];
    
                    if(currElement.getFileID().isEqual(augElement.getFileID())){
                        currDelets.splice(k,1);
                    }
                }
            }
            augmentedDeletes.concat(currDelets);

            // if the old commit id of this update ubject is not present in the list of commit
            if(cids.indexOf(this.updates[i].getOldCid()) == -1){

                i -= 1;
            }else{
                break;
            }

        }

        return new Update(this.updates[this.updates.length - 1].getNewCid(), augmentedChanges, augmentedDeletes, 
                        this.updates[0].getOldCid());
    }

    /**
     * This function takes in the update object from the head of the commit with the user provided update 
     * and trys to merge both of them when the old commit in the user requested update is not in the commit list
     * @param headOfCommit 
     * @param augmentedData 
     * @returns UpdateFileStatepair : Returns a tuple of Update which is processed augmentation.  
     *                                And list of filestate pair.
     */
    private mergerUnknownFiles(headOfCommit : Update, augmentedData : Update) : Update{
        
        // Remove all the deleted files in the request commit which are already deleted in the head of commits
        // Which consists of same state id
        for (let k = 0; k < headOfCommit.getDelets().length; k++) {
            const Element = headOfCommit.getDelets()[k];
            for (let i = 0; i < augmentedData.getChanges().length; i++) {
                const fileterElement = augmentedData.getChanges()[i];
                // if file id and state id are equal to the one which is in the deleted items in
                // the head of commit then it is considered as deleted
                if(fileterElement.getFileID().isEqual(Element.getFileID()) &&
                   fileterElement.getContent().getStid().isEqual(Element.getStateID())
                   ){
                    augmentedData.getChanges().splice(i, 1);
                }else{
                    headOfCommit.getDelets().splice(k, 1);
                }
            }
        }

        // Remove all the deleted files in the head of commit which is given by the new commit 
        for (let k = 0; k < augmentedData.getDelets().length; k++) {
            const Element = augmentedData.getDelets()[k];
            for (let i = 0; i < headOfCommit.getChanges().length; i++) {
                const fileterElement = headOfCommit.getChanges()[i];
                if(fileterElement.getFileID().isEqual(Element.getFileID()) ){
                    headOfCommit.getChanges().splice(i, 1);
                    headOfCommit.getDelets().push(Element);
                }
            }
        }

        // Merger the commits
        var newDir : DirectoryValues = new DirectoryValues();
        var newChanges : Change[] = [];

        for (let i = 0; i < augmentedData.getChanges().length; i++) {
            const augElement = augmentedData.getChanges()[i];

            for (let j = 0; j < headOfCommit.getChanges().length; j++) {
                const hocEle = headOfCommit.getChanges()[j];

                var augFileState : FileState = augElement.getContent().getValue();
                var hocFileState : FileState = hocEle.getContent().getValue();

                if(augElement.getFileID().isEqual(hocEle.getFileID()) 
                    && augFileState instanceof DirectoryValues 
                    && hocFileState instanceof DirectoryValues){
                 
                     // If it DirectoryValues

                     var tempReqDirVal : DirectoryValues = getDirectoryValueClassInstance(augFileState);
                     var tempHOCDirVal : DirectoryValues = getDirectoryValueClassInstance(hocFileState);
                    
                     // If the head of the commit consists of the file id which is same as the one requested from user
                     // then the file id which is requested by user will be added to the 
                     var tempReqDirEntries : DirectoryEntry[] = tempReqDirVal.getValue();
                     var tempHocDirEntries : DirectoryEntry[] = tempHOCDirVal.getValue();

                     for (let k = 0; k < tempReqDirEntries.length; k++) {
                         const reqDir = tempReqDirEntries[k];

                         for (let l = 0; l < tempHocDirEntries.length; l++) {
                             const hocEle = tempHocDirEntries[l];
                             
                             if(reqDir.getFileID().isEqual(hocEle.getFileID())){
                                newDir.push(reqDir);
                                tempReqDirEntries.splice(k, 1);
                                tempReqDirEntries.splice(l, 1);
                            }

                         }

                     }

                     // Concatinate remaining file id's
                     newDir.concatnate(tempHOCDirVal.getValue());
                     newDir.concatnate(tempReqDirVal.getValue());

                     var newContent: FileContent = new FileContent(augElement.getContent().getStid(), augElement.getContent().getMetaData(),newDir);

                     newChanges.push(new Change(augElement.getFileID(), newContent));  
                }
                else{
                    // If it is a new change just add it to the new head, as the change is a new request from the user
                    newChanges.push(augElement);
                    
                }
            }   
        }

        return new Update(augmentedData.getNewCid(), newChanges, headOfCommit.getDelets(), headOfCommit.getNewCid());
        
    }

    private getFileStatePairFromUpdate(update : Update) : FileStatePair[]{

        var returnFileStatePait : FileStatePair[] = [];

        for (let i = 0; i < update.getChanges().length; i++) {
            returnFileStatePait.push(new FileStatePair(
                new FileID( update.getChanges()[i].getFileID().getGuid() ),
                new StateID( update.getChanges()[i].getContent().getStid().getGuid() ) ));
        }

        return returnFileStatePait;
    
    }

    private commitData(tempHead : Update , 
                       newUpdate : Update,
                       CommitCache : Cache<CommitID, CommitDT>, 
                       listOfCommits : CommitID[]) : Update{

        //
        for (let i = 0; i < tempHead.getChanges().length; i++) {
            const changesElement = tempHead.getChanges()[i];

            for (let j = 0; j < newUpdate.getChanges().length; j++) {
                const augElement = newUpdate.getChanges()[j];
                
                // Replace the ones which are updated
                if(changesElement.getFileID().isEqual(augElement.getFileID())){
                    tempHead.getChanges()[i] = new Change(augElement.getFileID(), augElement.getContent()) ;
                    newUpdate.getChanges().splice(j,1);
                }
            }
        }

        // add the ones which are new
        for (let a = 0; a < newUpdate.getChanges().length; a++) {
            const newMergeElement = newUpdate.getChanges()[a];
            tempHead.getChanges().push(newMergeElement);
        }

        // Create new head
        var newHead : Update = new Update( newUpdate.getNewCid(), tempHead.getChanges(), tempHead.getDelets(), newUpdate.getOldCid());

        // Commit to the data base
        CommitCache.put(newHead.getNewCid(),  new CommitDT(this.sid,  [newHead], this.getFileStatePairFromUpdate(newHead)));

        // Update the list of commits cache for the user, by setting the head of the commit to new_cid
        listOfCommits.push(newHead.getNewCid());

        return newHead;

    }

}

