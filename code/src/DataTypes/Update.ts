import { Delete } from "./Delete";
import { Change } from "./Change";
import { CommitID } from "./CommitID";
import { IResponse } from "../Response/ResponseObjects";

export class Update implements IResponse{
    
    private new_cid : CommitID;
    private changes : Change[]; 
    private deletes : Delete[]; 
    private old_cid : CommitID;

    constructor(new_cid : CommitID,  changes: Change[], deletes: Delete[], old_cid : CommitID){
        
        this.new_cid = new_cid;
        this.changes = changes;
        this.deletes = deletes;
        this.old_cid = old_cid;
    }

    public getNewCid() : CommitID{
        return this.new_cid;
    }

    public getChanges() : Change[]{
        return this.changes;
    }

    public getDelets() : Delete[]{
        return this.deletes;
    }

    public getOldCid() : CommitID{
        return this.old_cid;
    }


    public toString(): string{
        return this.new_cid.toString() + "," + this.changes.toString() + "," + this.deletes.toString() + "," + this.old_cid.toString();
    }
    
}