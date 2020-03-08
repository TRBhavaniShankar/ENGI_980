import { Update } from "./Update"
import { FileStatePair } from "./FileStatePair"

export class CommitDT{

    sid: String;
    updates: Update[];
    currentState: FileStatePair[];

    constructor(sid: String, updates: Update[], currentState: FileStatePair[]){

        this.sid = sid;
        this.updates = updates;
        this.currentState = currentState;
    }

    toString() : String {
        return "Commit DT : " + this.sid;
    }

}