import {FileStatePair} from '../DataTypes/FileStatePair';
import { Guid } from "guid-typescript";
import { Cache } from '../Cache/Cache';
import { FileContent } from '../DataTypes/Content';
import { fileElementType } from '../Models/FileElementSchema';
import { Change } from '../DataTypes/Change';
import { Update } from '../DataTypes/Update';
import { ResponseDT } from '../DataTypes/ResponseDT';
import { Delete } from '../DataTypes/Delete';
import { GetRequestDT } from '../DataTypes/GetRequest';

export class GetOperation{

    sid : Guid;
    need: Guid[];
    cid : Guid;
    currentState: FileStatePair[];

    constructor(getObject : GetRequestDT) {
        this.sid= getObject.sid;
        this.need = getObject.need;
        this.cid = getObject.cid;
        this.currentState = getObject.currentState;
    }
    
    public toString() : String{
        return this.sid["value"] + " : " + this.cid["value"];
     }

     /**
      * 
      * @param ChangeCache : This is the cache which stores the change
      * @param UpdateCache : This is the cache which stores the Commit
      * @param listOfCommits : This is the cache which stores the list of commit, which is a series in the array
      * @param user : This is the user email id
      */

    public searchAndGetResponse(ChangeCache : Cache<Guid, FileContent>, UpdateCache : Cache<Guid, [Update, FileStatePair[]]>, 
        listOfCommits : Cache<String, Guid[]>, user : String) : [Update, Boolean] {
        
        var cids : Guid[] = listOfCommits.get(user);
        var new_cid : Guid;
        
        var updateCacheValue : [Update, FileStatePair] = UpdateCache.get(this.cid);
        var update : Update = updateCacheValue[0];
        var isPresentInCache : Boolean = false;

        // Check if the cid provided by the user is already is the head of the commit
        const old_cid_index : Number = cids.indexOf(this.cid);

        if(old_cid_index != -1){
            if (cids.indexOf(this.cid) == cids.length -1){
                // The cid provided by the user is the head of the commits
                new_cid = this.cid;
            }else{
                // The cid provided by the user was once the previous commits in the history
                new_cid = cids[cids.length];
                updateCacheValue = UpdateCache.get(new_cid);
            }
            isPresentInCache = true;
        }

        // Check and get if there is any data present in the cache
        this.need.forEach(element => {
            var fileContent : FileContent = ChangeCache.get(element);
            update.changes.push(new Change(element, fileContent));
        });

        // Finally create a response object to send to the client

        return [update, isPresentInCache];
    }

}