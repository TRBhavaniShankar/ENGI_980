import {FileStatePair} from '../DataTypes/FileStatePair';
import { Guid } from "guid-typescript";
import { Cache } from '../Cache/Cache';
import { FileContent } from '../DataTypes/Content';
import { fileElementType } from '../Models/FileElementSchema';
import { Change } from '../DataTypes/Change';
import { Update } from '../DataTypes/Update';
import { ResponseDT } from '../Response/ResponseDT';
import { Delete } from '../DataTypes/Delete';
import { GetRequestDT } from '../DataTypes/GetRequest';
import { FileID } from '../DataTypes/FileID';
import { SessionID } from '../DataTypes/SessionID';
import { CommitID } from '../DataTypes/CommitID';
import { Failure } from '../Response/ResponseObjects';

export class GetOperation{

    sid : SessionID;
    need: FileID[];
    cid : CommitID;
    currentState: FileStatePair[];

    constructor(getObject : GetRequestDT) {
        this.sid= getObject.sid;
        this.need = getObject.need;
        this.cid = getObject.cid;
        this.currentState = getObject.currentState;
    }
    
    public toString() : String{
        return this.sid.toString() + " : " + this.cid.toString();
     }

     /**
      * 
      * @param ChangeCache : This is the cache which stores the change
      * @param CommitCache : This is the cache which stores the Commit
      * @param listOfCommits : This is the cache which stores the list of commit, which is a series in the array
      */

    public searchAndGetResponse(CommitCache : Cache<CommitID, [Update, FileStatePair[]]>, 
                                listOfCommits : CommitID[]) : 
    ResponseDT<Object> {
        
        var cids : CommitID[] = listOfCommits;
        
        // Get the head of commits
        var CommitCacheValue : [Update, FileStatePair] = CommitCache.get(cids[cids.length]);
        var update : Update = CommitCacheValue[0];

        // Check if the cid provided by the user is already is the head of the commit
        if(cids.indexOf(this.cid) != -1){
            if (cids.indexOf(this.cid) == cids.length -1){
                
                // The cid provided by the user is the head of the commits

                var new_cid : CommitID = this.cid;
                var updateRes : Update = new Update(new_cid, update.changes, update.deletes, this.cid);
                return new ResponseDT<Update>(200, "The commit ID sent by the user is same as the head of commit","Update", updateRes);

            }else{
                
                // The cid provided by the user was once the previous commits in the history
                var new_cid : CommitID = cids[cids.length];
                var fIDsToGet : FileID[] = this.need;

                // List of FID that user needs with the list of FIDs the user has in pairs
                this.currentState.forEach(Element => {
                    fIDsToGet.push(Element.fid);
                });

                var changes : Change[] = [];

                // Get all the changes that user needs from the list of FIDs that user needs and has. From the head of the commit
                fIDsToGet.forEach(needEle => {
                    update.changes.forEach(Element => {
                        
                        changes.concat(
                            update.changes.filter( filterEle =>{
                                Element.fid.isEqual(needEle);
                            })
                        )

                    })
                })

                var updateRes : Update = new Update(new_cid, changes, update.deletes, this.cid);
                return new ResponseDT<Update>(200, "A new update is present","Update", updateRes);
            }
        }else{

            return new ResponseDT<Failure>(500, "Failure", "Failure", new Failure("The server was not able to find the commit id sent"));

        }
    }

}