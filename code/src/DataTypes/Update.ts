import { Delete } from "./Delete";
import { Change } from "./Change";
import { CID } from "./CID";

export class Update{
    
    new_cid : CID;
    update: Change[] = []; 
    deletes: Delete[] = []; 
    old_cid : CID;

    constructor(new_cid : CID,  update: [Change], deletes: [Delete], old_cid : CID){
        this.new_cid = new_cid;
        this.update = update;
        this.deletes = deletes;
        this.old_cid = old_cid;
    }

    getUpdate(){
        return this.new_cid, this.update, this.deletes, this.old_cid;
    }
    
}