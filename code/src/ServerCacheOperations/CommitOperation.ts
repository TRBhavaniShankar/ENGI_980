import { Update } from "../DataTypes/Update"
import { FileStatePair } from "../DataTypes/FileStatePair"
import { Guid } from "guid-typescript";
import { Cache } from '../Cache/Cache';
import { FileContent } from '../DataTypes/Content';
import { Change } from "../DataTypes/Change";
import { Delete } from "../DataTypes/Delete";
import { CommitDT } from "../DataTypes/Commit";
import { DirectoryValues } from "../DataTypes/DirectoryValue";
import { mkDirectoryValue, mkChanges, mkDeletes, mkUpdate, mkFileStatePairs } from "../MakeClasses/CreateClasses";
import { LeafValue } from "../DataTypes/LeafValue";
import { FileID } from "../DataTypes/FileID";
import { CommitID } from "../DataTypes/CommitID";
import { GIDs } from "../DataTypes/GenerateIDs";
import { SessionID } from "../DataTypes/SessionID";
import { Success, IResponse } from "../Response/ResponseObjects";
import { ResponseDT } from "../Response/ResponseDT";
import { StateID } from "../DataTypes/StateID";
import { MetaData } from "../DataTypes/MetaData";

export class CommitOperations{

    sid: SessionID;
    updates: Update[];
    currentState: FileStatePair[];

    constructor(commitObject : CommitDT){

        this.sid = commitObject.sessionid;
        this.updates = commitObject.updates;
        this.currentState = commitObject.currentState;

        console.log(this.sid);
    }


    toString() : String {
        return "Commit DT : " + this.sid;
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

    public commitData(CommitCache : Cache<CommitID, [Update, FileStatePair[]]>, 
                      listOfCommits : CommitID[]) : 
    ResponseDT<IResponse> {
            
        var updatedData : Update ;  
        var cids : CommitID[] = listOfCommits;

        var augmentedData : [Update, FileStatePair[]] = this.processingAugmentation(cids);
        
        console.log("augmentedData[0] "+augmentedData[0].toString());

        // Check if the new commit id from the user is in the cache storage already
        
        if(augmentedData[0].new_cid == cids[cids.length - 1]){
            // Case 1 : If the server's head is cdx, it can simply reply with "success". 
            // (This can happen in the case of a resend.)

            return new ResponseDT<Success>(200, "This commit is already the head of the commit", "Success", new Success());
            // ------ Done -------
            
        }
        else if(cids.indexOf(augmentedData[0].old_cid) != -1){

            if(augmentedData[0].old_cid == cids[cids.length - 1]){
                // Case 3 : If the server's head is still cid0 at the time the commit is received, 
                // then the server can simply make the updates proposed and replies with a "success" response.

                var head : [Update, FileStatePair[]] = CommitCache.get(cids[cids.length - 1]);

                // As the head points to the CommitCache, we need to make a new object for update in head
                var headUpdate : Update = new mkUpdate(head[0]).getClassInstance();
                
                for (let i = 0; i < headUpdate.changes.length; i++) {
                    const changesElement = headUpdate.changes[i];

                    for (let j = 0; j < augmentedData[0].changes.length; j++) {
                        const augElement = augmentedData[0].changes[j];
                        
                        // Replace the ones which are updated
                        if(changesElement.fid.isEqual(augElement.fid)){
                            headUpdate.changes[i] = augElement;
                            augmentedData[0].changes.splice(j,1);
                        }
                    }
                }

                // add the ones which are new
                headUpdate.changes.concat(augmentedData[0].changes);

                // add the updated file state pairs to the commit head
                var headFileStatePair : FileStatePair[] = this.getFileStatePairFromUpdate(headUpdate);

                // add new and old commit to head
                headUpdate.new_cid = augmentedData[0].new_cid;
                headUpdate.old_cid = augmentedData[0].old_cid;

                CommitCache.put(headUpdate.new_cid, [headUpdate, headFileStatePair]);

                // Update the list of commits cache for the user, by setting the head of the commit to new_cid
                listOfCommits.push(headUpdate.new_cid);

                return new ResponseDT<Success>(200, "Successfully added the commit as the head of commit", "Success", new Success());
                // ------ Done -------

            }
            else{ //
                // Case 2 : If the server's head is not cdx, but it was in the past, then the server sends back a "files" 
                // response to update the client from state cd0

                var CommitCacheValue : [Update, FileStatePair[]] = CommitCache.get(this.updates[0].old_cid);
                var updatedData : Update = CommitCacheValue[0];

                return new ResponseDT<Update>(200, "This commit was a commit in the past, the corresponding data at the commit "+
                                                "has been provided", "Update", updatedData)
                // ------ Done -------
            }

        }
        else{
            // Case 4 : Otherwise, the server will try to merge the proposed commit with its current head to produce 
            // a new head, CD1. It then replies with a "files" response. (The interpretation of the "files" response is as above.)

            var head : [Update, FileStatePair[]] = CommitCache.get(cids[cids.length - 1]);

            // As the head points to the CommitCache, we need to make a new object for update in head
            var headUpdate : Update = new mkUpdate(head[0]).getClassInstance();

            // As the newMergedHead points to the CommitCache, we need to make a new object for update in newMergedHead
            var newMergedHead : [Update, FileStatePair[]]  = this.mergerUnknownFiles([headUpdate, head[1]], augmentedData);
            newMergedHead[0] = new mkUpdate(newMergedHead[0]).getClassInstance();
            newMergedHead[1] = new mkFileStatePairs(newMergedHead[1]).getClassInstance();

            //
            for (let i = 0; i < headUpdate.changes.length; i++) {
                const changesElement = headUpdate.changes[i];

                for (let j = 0; j < newMergedHead[0].changes.length; j++) {
                    const augElement = newMergedHead[0].changes[j];
                    
                    // Replace the ones which are updated
                    if(changesElement.fid.isEqual(augElement.fid)){
                        headUpdate.changes[i] = new Change(augElement.fid, augElement.content) ;
                        newMergedHead[0].changes.splice(j,1);
                    }
                }
            }

            // add the ones which are new
            for (let a = 0; a < newMergedHead[0].changes.length; a++) {
                const newMergeElement = newMergedHead[0].changes[a];
                
                headUpdate.changes.push(newMergeElement);

            }
            
            console.log(" head[0].changes[0].content.stid " + headUpdate.changes[0].content.stid);
            console.log(" head[0].changes[0].content.stid " + newMergedHead[0].changes[0].content.stid);
            console.log(" head[0].changes[0].content.stid " + CommitCache.get(cids[cids.length - 1])[0].changes[0].content.stid);

            // add the updated file state pairs to the commit head
            var headFileStatePair : FileStatePair[] = this.getFileStatePairFromUpdate(headUpdate);

            // add new and old commit to head
            headUpdate.new_cid = newMergedHead[0].new_cid;
            headUpdate.old_cid = newMergedHead[0].old_cid;

            // Finally put the data in the commit cache
            CommitCache.put(headUpdate.new_cid, [headUpdate, headFileStatePair]);

            // Update the list of commits cache for the user, by setting the head of the commit to new_cid
            listOfCommits.push(headUpdate.new_cid);

            // Get head of the commit to return
            return new ResponseDT<Update>(200, "We could not find the old commit id in the list of commit, therefore we"+
                                            " have merged the data that you have sent with the head of commit data", 
                                            "Update", headUpdate)
        }
    }


    /**
     * As the input that we are getting from the use Consists of series of update, i.e., list of
     *  updates, the server needs to combine all the updates and make one update for the commit.
     * 
     * If commit is :
     *   commit{ sid: s, updates: [
                                  update{ new_cid : cidy,  update: updates, deletes: deletes, old_cid : cidx }, 
                                  update{ new_cid : cidx,  update: updates, deletes: deletes, old_cid : cid0 }], 
                  currentState: pairs }

     * So here the client is proposing that the server update from cid0 to cidx and then to cidy. It does so as follows.

     * If cidx is the current head, the server can make cidy the current head and send back a success reply. 
        (This could happen if the server got an earlier update message, but the reply was lost before the client could get it.)
     * If cidx is not the current head, but was in the past, the server will ignore the second update record. 
        It behaves as if the message was
     * commit{ sid: s, updates: [
                                  update{ new_cid : cidy,  update: updates, deletes: deletes, old_cid : cidx }], 
                  currentState: pairs1 }
     * where pairs1 is a suitably modified copy of pairs.

     * If cidx was never the current head, then the server needs to combine the two updates to make one update,
       and behaves as if the request was
     *  commit{ sid: s, updates: [
                                  update{ new_cid : cidy,  update: updates1, deletes: deletes1, old_cid : cid0 }], 
                  currentState: pairs }
     * 
     * @param cids : list of Commit ID in sequence of commits of the user
     * @returns UpdateFileStatepair : Returns a tuple of Update which is processed augmentation.  
     *                                And list of filestate pair.
     */
    private processingAugmentation( cids : CommitID[]) : [Update, FileStatePair[]] {

        /**
         * 
         * Old cid of the first update is already present
         * 
         * If cidx is the current head, the server can make cidy the current head and send back a success reply. 
         * (This could happen if the server got an earlier update message, but the reply was lost before the client could get it.)
         * */

        var returnUpdate : Update = this.updates[0];

        // The lastest commit in the series of commit will consists of all the resent updates and delets
        var augmentedChanges : Change[] = augmentedChanges = this.updates[0].changes;
        var augmentedDeletes : Delete[] = augmentedDeletes = this.updates[0].deletes;

        var i : number = 1;

        // Check if the the old commit id in the series of commit, if present then break the loop
        // if not then add them up to make one update object
        while(i < this.updates.length && this.updates.length > 1){

            // if the old commit id of this update ubject is not present in the list of commit
            if(cids.indexOf(this.updates[i].old_cid) == -1){

                // Take the change and delete list from list of updates, one by one
                var currChange : Change[] = this.updates[i].changes;
                var currDelets : Delete[] = this.updates[i].deletes;

                // Go through all the change elemnts from the current update element and remove all the 
                // ones which are present in the augmentedChanges, which will be the ultimate change list for this commit
                for (let j = 0; j < augmentedChanges.length; j++) {
                    const augElement : Change = augmentedChanges[j];
        
                    for (let k = 0; k < currChange.length; k++) {
                        const currElement : Change= currChange[k];
        
                        if(currElement.fid.isEqual(augElement.fid)){
                            currChange.splice(k,1);
                        }
                    }
                }
                augmentedChanges.concat(currChange);
                
                // Go through all the delete elemnts from the current update element and remove all the ones which are present
                // in the augmentedDeletes, which will be the ultimate delete list for this commit
                for (let j = 0; j < augmentedDeletes.length; j++) {
                    const augElement : Delete = augmentedDeletes[j];
        
                    for (let k = 0; k < currDelets.length; k++) {
                        const currElement : Delete = currDelets[k];
        
                        if(currElement.fid.isEqual(augElement.fid)){
                            currDelets.splice(k,1);
                        }
                    }
                }
                augmentedDeletes.concat(currDelets);

                i += 1;
            }else{
                break;
            }

        }
        
        returnUpdate = new Update(this.updates[0].new_cid, augmentedChanges, augmentedDeletes, this.updates[i - 1].old_cid);
        
        // Make a new pair of file state pairs
        var pairs1 : FileStatePair[] = [];
        for (let i = 0; i < returnUpdate.changes.length; i++) {
            pairs1.push(new FileStatePair(returnUpdate.changes[i].fid, returnUpdate.changes[i].content.stid));
        }
        
        return [returnUpdate, pairs1];
    }

    /**
     * This function takes in the update object from the head of the commit with the user provided update 
     * and trys to merge both of them when the old commit in the user requested update is not in the commit list
     * @param headOfCommit 
     * @param augmentedData 
     * @returns UpdateFileStatepair : Returns a tuple of Update which is processed augmentation.  
     *                                And list of filestate pair.
     */
    private mergerUnknownFiles(headOfCommit : [Update, FileStatePair[]], augmentedData : [Update, FileStatePair[]]) : 
            [Update, FileStatePair[]]{

        
        // Remove all the deleted files in the request commit which are already deleted in the head of commits
        for (let k = 0; k < headOfCommit[0].deletes.length; k++) {
            const Element = headOfCommit[0].deletes[k];

            for (let i = 0; i < augmentedData[0].changes.length; i++) {
                const fileterElement = augmentedData[0].changes[i];

                if(fileterElement.fid.isEqual(Element.fid)){
                    augmentedData[0].changes.splice(i, 1);
                }
            }

        }
        

        // Remove all the deleted files in the head of commit which is given by the new commit 
        for (let k = 0; k < augmentedData[0].deletes.length; k++) {
            const Element = augmentedData[0].deletes[k];

            for (let i = 0; i < headOfCommit[0].changes.length; i++) {
                const fileterElement = headOfCommit[0].changes[i];

                if(fileterElement.fid.isEqual(Element.fid)){
                    headOfCommit[0].changes.splice(i, 1);
                    headOfCommit[0].deletes.push(Element);
                }
            }

        }

        // Merger the commits
        var newDir : DirectoryValues = new DirectoryValues();
        var newChanges : Change[] = [];

        for (let i = 0; i < augmentedData[0].changes.length; i++) {
            const augElement = augmentedData[0].changes[i];

            for (let j = 0; j < headOfCommit[0].changes.length; j++) {
                const hocEle = headOfCommit[0].changes[j];

                if(augElement.fid.isEqual(hocEle.fid) 
                    && augElement.content.value instanceof DirectoryValues 
                    && hocEle.content.value instanceof DirectoryValues){
                 
                     // If it DirectoryValues

                     var tempReqDirVal : DirectoryValues = new mkDirectoryValue(augElement.content.value).getClassInstance();
                     var tempHOCDirVal : DirectoryValues = new mkDirectoryValue(hocEle.content.value).getClassInstance();
                    
                     // If the head of the commit consists of the file id which is same as the one requested from user
                     // then the file id which is requested by user will be added to the 
                     for (let k = 0; k < tempReqDirVal.entries.length; k++) {
                         const reqDir = tempReqDirVal.entries[k];

                         for (let l = 0; l < tempHOCDirVal.entries.length; l++) {
                             const hocEle = tempHOCDirVal.entries[l];
                             
                             if(reqDir.fID.isEqual(hocEle.fID)){
                                newDir.push(reqDir);
                                tempReqDirVal.entries.splice(k, 1);
                                tempHOCDirVal.entries.splice(l, 1);
                            }

                         }

                     }

                     // Concatinate remaining file id's
                     newDir.entries.concat(tempHOCDirVal.entries);
                     newDir.entries.concat(tempReqDirVal.entries);

                     var newContent: FileContent = new FileContent(augElement.content.stid, augElement.content.metaData,newDir);

                     newChanges.push(new Change(augElement.fid, newContent));  
                }
                else{
                    // If it is a new change just add it to the new head, as the change is a new request from the user
                    newChanges.push(augElement);
                    
                }
            }   
        }

        var newHead : Update = new Update(augmentedData[0].new_cid, newChanges, headOfCommit[0].deletes, headOfCommit[0].new_cid);

        // Prepare a new filestate pair
        headOfCommit[1] = [];
        for (let i = 0; i < newHead.changes.length; i++) {
            headOfCommit[1].push(new FileStatePair(newHead.changes[i].fid, newHead.changes[i].content.stid));
        }

        return [newHead, headOfCommit[1]];
        
    }


    private getFileStatePairFromUpdate(update : Update) : FileStatePair[]{

        var returnFileStatePait : FileStatePair[] = [];

        for (let i = 0; i < update.changes.length; i++) {
            returnFileStatePait.push(new FileStatePair(
                new FileID( update.changes[i].fid.getGuid() ),
                new StateID( update.changes[i].content.stid.getGuid() ) ));
        }

        return returnFileStatePait;
    
    }

}

