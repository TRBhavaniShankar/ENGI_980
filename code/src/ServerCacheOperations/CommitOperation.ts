import { Update } from "../DataTypes/Update"
import { FileStatePair } from "../DataTypes/FileStatePair"
import { Guid } from "guid-typescript";
import { Cache } from '../Cache/Cache';
import { FileContent } from '../DataTypes/Content';
import { Change } from "../DataTypes/Change";
import { Delete } from "../DataTypes/Delete";
import { CommitDT } from "../DataTypes/Commit";

export class CommitOperations{

    sid: Guid;
    updates: Update[];
    currentState: FileStatePair[];

    constructor(commitObject : CommitDT){

        this.sid = commitObject.sid;
        this.updates = commitObject.updates;
        this.currentState = commitObject.currentState;
    }


    toString() : String {
        return "Commit DT : " + this.sid;
    }

    /**
     * 
     * @param ChangeCache : This is the cache which stores the change
     * @param UpdateCache : This is the cache which stores the Commit
     * @param listOfCommits : This is the cache which stores the list of commit, which is a series in the array
     * @param user : This is the user email id
     */

    public CommitData(ChangeCache : Cache<Guid, FileContent>, UpdateCache : Cache<Guid, [Update, FileStatePair[]]>, 
        listOfCommits : Cache<String, Guid[]>, user : String) : [Update, Boolean, String] {
            
            var updatedData : Update | any;
            var message : String | any ;
            var isPresentInCache : Boolean = false;
            var cids : Guid[] = listOfCommits.get(user);

            var augmentedData : [Update, FileStatePair[]] = this.processingAugmentation(cids);

            // Check if the old commit id from the user is in the cache storage already

            if(cids.indexOf(augmentedData[0].old_cid) != -1){

                if(augmentedData[0].new_cid == cids[cids.length - 1]){
                    // Case 1 : If the server's head is cdx, it can simply reply with "success". 
                    // (This can happen in the case of a resend.)
                    message = "success";

                    // ------ Done -------
                }
                else if(augmentedData[0].old_cid == cids[cids.length - 1]){
                    // Case 3 : If the server's head is still cid0 at the time the commit is received, 
                    // then the server can simply make the updates proposed and replies with a "success" response.
                    message = "success";

                    // Put the update into the commit cache
                    UpdateCache.put(this.updates[0].new_cid, augmentedData);

                    // Update the list of commits cache for the user, by setting the head of the commit to new_cid
                    cids.push(augmentedData[0].old_cid);
                    listOfCommits.put(user, cids);

                    // Add the changes to the Change cache
                    augmentedData[0].changes.forEach(changeElement => {
                        ChangeCache.put(changeElement.fid, changeElement.content);
                    });

                    // ------ Done -------

                }
                else{
                    // Case 2 : If the server's head is not cdx, but it was in the past, then the server sends back a "files" 
                    // response to update the client from state cd0
                    message = "files";
                    var updateCacheValue : [Update, FileStatePair[]] = UpdateCache.get(this.updates[0].old_cid);
                    updatedData = updateCacheValue[0];

                    // ------ Done -------
                }

                isPresentInCache = true;
            }
            else{
                // Case 4 : Otherwise, the server will try to merge the proposed commit with its current head to produce 
                // a new head, CD1. It then replies with a "files" response. (The interpretation of the "files" response is as above.)
                message = "files";

                updatedData = 
                // ------ TO BE CODED -------

                isPresentInCache = false;
            }
            
            return [updatedData, isPresentInCache, message];
        }


    /**
     * 
     * @param cids : list of Commit ID in sequence of commits of the user
     */
    private processingAugmentation( cids : Guid[]) : [Update, FileStatePair[]] {

        /**
         * 
         * Old cid of the first update is already present
         * 
         * If cidx is the current head, the server can make cidy the current head and send back a success reply. 
         * (This could happen if the server got an earlier update message, but the reply was lost before the client could get it.)
         * */

        var returnUpdate : Update = this.updates[0];
        var pairs1 : FileStatePair[] = this.currentState;
        
        var augmentedChanges : Change[] = [];
        var augmentedDeletes : Delete[] = [];

        if(cids.indexOf(this.updates[0].old_cid) == -1){

            /**
             * 
             * If cidx was never the current head, then the server needs to combine the two updates to make one update,
             *  and behaves as if the request was
             * */
    
            this.updates.forEach(Element => {
                augmentedChanges.concat(Element.changes);
            });
            
            this.updates.forEach(Element => {
                augmentedDeletes.concat(Element.deletes);
            });

            returnUpdate = new Update(this.updates[0].new_cid, augmentedChanges, augmentedDeletes, this.updates[this.updates.length -1].old_cid);

        }else{
            
            pairs1 = [];
            
            returnUpdate.changes.forEach(element => {
                this.currentState.forEach(pairEle => {
                    if(pairEle.fid["value"] == element.fid["value"]){
                        pairs1.push(pairEle);
                    }
                });
            })

        }

        return [returnUpdate, pairs1];
    }


}