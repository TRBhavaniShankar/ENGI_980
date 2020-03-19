import { Update } from "../DataTypes/Update"
import { FileStatePair } from "../DataTypes/FileStatePair"
import { Guid } from "guid-typescript";
import { Cache } from '../Cache/Cache';
import { FileContent } from '../DataTypes/Content';
import { Change } from "../DataTypes/Change";
import { Delete } from "../DataTypes/Delete";
import { CommitDT } from "../DataTypes/Commit";
import { DirectoryValues } from "../DataTypes/DirectoryValue";
import { mkDirectoryValue } from "../MakeClasses/CreateClasses";
import { LeafValue } from "../DataTypes/LeafValue";
import { FileID } from "../DataTypes/FileID";
import { CommitID } from "../DataTypes/CommitID";
import { GIDs } from "../DataTypes/GenerateIDs";
import { SessionID } from "../DataTypes/SessionID";
import { Success, IResponse } from "../Response/ResponseObjects";
import { ResponseDT } from "../Response/ResponseDT";

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
     * 
     * @param ChangeCache : This is the cache which stores the change
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
        console.log("augmentedData[1] "+augmentedData[1][0].fid.toString() + " "+ augmentedData[1][0].stid.toString());

        // Check if the new commit id from the user is in the cache storage already

        var test : FileID = new FileID(Guid.create());
        
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


                // Put the update into the commit cache

                var tempNewData : [Update, FileStatePair[]] = CommitCache.get(cids[cids.length - 1]);

                augmentedData[0].deletes.forEach(Element => {
                    tempNewData[0].changes = tempNewData[0].changes.filter(fileterElement => {
                        fileterElement.fid.isEqual(Element.fid);
                    });

                    tempNewData[1] = tempNewData[1].filter(fileterElement => {
                        fileterElement.fid.isEqual(Element.fid);
                    });

                });
                
                tempNewData[0].changes.concat(augmentedData[0].changes);
                tempNewData[0].deletes.concat(augmentedData[0].deletes);
                tempNewData[1].concat(augmentedData[1]);

                CommitCache.put(this.updates[0].new_cid, tempNewData);

                // Update the list of commits cache for the user, by setting the head of the commit to new_cid
                listOfCommits.push(augmentedData[0].new_cid);

                // Add the changes to the Change cache
                // augmentedData[0].changes.forEach(changeElement => {
                //     ChangeCache.put(changeElement.fid, changeElement.content);
                // });


                return new ResponseDT<Success>(200, "Successfully added the commit as the head of commit", "Success", new Success());
                // ------ Done -------

            }
            else{ //
                // Case 2 : If the server's head is not cdx, but it was in the past, then the server sends back a "files" 
                // response to update the client from state cd0

                var CommitCacheValue : [Update, FileStatePair[]] = CommitCache.get(this.updates[0].old_cid);
                var updatedData : Update = updatedData = CommitCacheValue[0];

                return new ResponseDT<Update>(200, "This commit was a commit in the past, the corresponding data at the commit "+
                                                "has been provided", "Update", updatedData)
                // ------ Done -------
            }

        }
        else{
            // Case 4 : Otherwise, the server will try to merge the proposed commit with its current head to produce 
            // a new head, CD1. It then replies with a "files" response. (The interpretation of the "files" response is as above.)

            var headOfCommit : [Update, FileStatePair[]] = CommitCache.get(cids[cids.length - 1]);
            headOfCommit = this.mergerUnknownFiles(headOfCommit, augmentedData);

            CommitCache.put(augmentedData[0].new_cid, headOfCommit);
            updatedData = headOfCommit[0];
            
            return new ResponseDT<Update>(200, "We could not find the old commit id in the list of commit, therefore we"+
                                            " have merged the data that you have sent with the head of commit data", "Update", updatedData)
        }
    }


    /**
     * 
     * @param cids : list of Commit ID in sequence of commits of the user
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
        var pairs1 : FileStatePair[] = this.currentState;
        
        var augmentedChanges : Change[] = this.updates[0].changes;
        var augmentedDeletes : Delete[] = this.updates[0].deletes;

        var i : number = 0;

        while(cids.indexOf(this.updates[i].old_cid) == -1){
            
            var currChange : Change[] = this.updates[i].changes;
            var currDelets : Delete[] = this.updates[i].deletes;

            for (let j = 0; j < augmentedChanges.length; j++) {
                const augElement : Change = augmentedChanges[j];
                for (let k = 0; k < currChange.length; k++) {
                    const currElement : Change= currChange[k];
                    if(currElement.fid.isEqual(augElement.fid)){
                        currChange.splice(k,1);
                    }
                }
                augmentedChanges.concat(currChange);
            }
            
            for (let j = 0; j < augmentedDeletes.length; j++) {
                const augElement : Delete = augmentedDeletes[j];
                for (let k = 0; k < currDelets.length; k++) {
                    const currElement : Delete = currDelets[k];
                    if(currElement.fid.isEqual(augElement.fid)){
                        currDelets.splice(k,1);
                    }
                }
                augmentedDeletes.concat(currDelets);
            }

            i += 1;
        }

        if(cids.indexOf(this.updates[i].old_cid) != -1 && i != 0){
            augmentedChanges.concat(this.updates[i].changes);
            augmentedDeletes.concat(this.updates[i].deletes);
        }

        returnUpdate = new Update(this.updates[0].new_cid, augmentedChanges, augmentedDeletes, this.updates[i].old_cid);
        
        var pairs1 : FileStatePair[] = [];

        returnUpdate.changes.forEach(changEle => {
            pairs1.concat(this.currentState.filter(element => {
                element.fid.isEqual(changEle.fid);
            })
            )    
        })
        
        return [returnUpdate, pairs1];

        // if(cids.indexOf(this.updates[0].old_cid) == -1){

        //     /**
        //      * 
        //      * If cidx was never the current head, then the server needs to combine the two updates to make one update,
        //      *  and behaves as if the request was
        //      * */
    
        //     this.updates.forEach(Element => {
        //         augmentedChanges.concat(Element.changes);
        //     });
            
        //     this.updates.forEach(Element => {
        //         augmentedDeletes.concat(Element.deletes);
        //     });

        //     returnUpdate = new Update(this.updates[0].new_cid, augmentedChanges, augmentedDeletes, this.updates[this.updates.length -1].old_cid);

        // }else{
            
        //     pairs1 = [];
            
        //     returnUpdate.changes.forEach(element => {
        //         this.currentState.forEach(pairEle => {
        //             if(pairEle.fid.isEqual(element.fid)){
        //                 pairs1.push(pairEle);
        //             }
        //         });
        //     })

        // }
    }

    /**
     * 
     * @param headOfCommit 
     * @param augmentedData 
     */
    private mergerUnknownFiles(headOfCommit : [Update, FileStatePair[]], augmentedData : [Update, FileStatePair[]]) : 
            [Update, FileStatePair[]]{

        // Remove all the deleted files from the new commit
        augmentedData[0].deletes.forEach(Element => {

            headOfCommit[0].changes.forEach(fileterElement => {
                if(fileterElement.fid.isEqual(Element.fid)){
                    headOfCommit[0].changes.splice(headOfCommit[0].changes.indexOf(fileterElement), 1);
                    headOfCommit[0].deletes.push(Element);
                }
            });

            headOfCommit[1].forEach(fileterElement => {
                if(fileterElement.fid.isEqual(Element.fid)){
                    headOfCommit[1].splice(headOfCommit[1].indexOf(fileterElement), 1);
                }
            });

        });

        // Merger the commits

        var newDir : DirectoryValues = new DirectoryValues();
        var newChanges : Change[] = [];

        augmentedData[0].changes.forEach(Element => {
            headOfCommit[0].changes.forEach(hocEle => {
                if(Element.fid.isEqual(hocEle.fid)){
                    
                    if(Element.content.value instanceof DirectoryValues && hocEle.content.value instanceof DirectoryValues){
                        // If it DirectoryValues

                        var tempReqDirVal : DirectoryValues = new mkDirectoryValue(Element.content.value).getClassInstance();
                        var tempHOCDirVal : DirectoryValues = new mkDirectoryValue(hocEle.content.value).getClassInstance();

                        tempReqDirVal.entries.forEach(reqDir => {
                            tempHOCDirVal.entries.forEach(hocEle=>{
                                if(reqDir.fID.isEqual(hocEle.fID)){
                                    newDir.push(reqDir);
                                    tempReqDirVal.entries.splice(tempReqDirVal.entries.indexOf(reqDir), 1);
                                    tempHOCDirVal.entries.splice(tempHOCDirVal.entries.indexOf(hocEle), 1);
                                }
                            })
                        });

                        newDir.entries.concat(tempHOCDirVal.entries);
                        newDir.entries.concat(tempReqDirVal.entries);

                        var newContent: FileContent = new FileContent(hocEle.content.stid, hocEle.content.metaData,newDir);

                        newChanges.push(new Change(Element.fid, newContent));

                    }
                    else if(Element.content.value instanceof LeafValue && hocEle.content.value instanceof LeafValue){
                        // If it is a leaf value
                        newChanges.push(Element);                        
                    }   
                }
                else{
                    // If it is a new change just add it to the new head, as the change is a new request from the user
                    newChanges.push(Element);
                    
                }
            })
        });

        var newHead : Update = new Update(augmentedData[0].new_cid, newChanges, headOfCommit[0].deletes, headOfCommit[0].new_cid);

        return [newHead, headOfCommit[1]];
        
    }

}