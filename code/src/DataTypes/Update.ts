import { Delete } from "./Delete";
import { Change } from "./Change";
import { Guid } from "guid-typescript";
import { resp } from "./responsesInterface";
import { CommitID } from "./CommitID";

export class Update implements resp{
    
    new_cid : CommitID;
    changes : Change[]; 
    deletes : Delete[]; 
    old_cid : CommitID;

    constructor(new_cid : CommitID,  changes: Change[], deletes: Delete[], old_cid : CommitID){
        
        this.new_cid = new_cid;
        this.changes = changes;
        this.deletes = deletes;
        this.old_cid = old_cid;
    }

    getUpdate() : [CommitID, Change[], Delete[], CommitID]{
        return [this.new_cid, this.changes, this.deletes, this.old_cid];
    }

    toString(): string{
        return this.new_cid.toString() + "," + this.changes.toString() + "," + this.deletes.toString() + "," + this.old_cid.toString();
    }
    
}