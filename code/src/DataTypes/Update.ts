import { Delete } from "./Delete";
import { Change } from "./Change";
import { CID } from "./CID";

export class Update{
    
    new_cid : String;
    changes : Change[]; 
    deletes : Delete[]; 
    old_cid : String;

    constructor(new_cid : String,  changes: Change[], deletes: Delete[], old_cid : String){
        this.new_cid = new_cid;
        this.changes = changes;
        this.deletes = deletes;
        this.old_cid = old_cid;
    }

    getUpdate() : [String, Change[], Delete[], String]{
        return [this.new_cid, this.changes, this.deletes, this.old_cid];
    }
    
}