import { Guid } from "guid-typescript";
import { FileID } from "./FileID";
import { StateID } from "./StateID";

export class FileStatePair {

    private fid: FileID;
    private stid: StateID;
    
    constructor(fid: FileID, stid: StateID) {
        this.fid = fid;
        this.stid = stid;
    }
    
    getFileID() : FileID{
        return this.fid;
    }

    
    getStateID() : StateID{
        return this.stid;
    }

    toString() : [String, String]{
        return [String(this.fid) , String(this.stid)];
    }
}

