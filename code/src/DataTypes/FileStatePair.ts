import { Guid } from "guid-typescript";
import { FileID } from "./FileID";
import { StateID } from "./StateID";

export class FileStatePair {

    fid: FileID;
    stid: StateID;
    
    constructor(fid: FileID, stid: StateID) {
        this.fid = fid;
        this.stid = stid;
    }
    
    getFileStatePair() : [FileID, StateID]{
        return [this.fid, this.stid];
    }

    toString() : [String, String]{
        return [String(this.fid) , String(this.stid)];
    }
}

