import { FileID } from "./FileID"
import { StateID } from "./StateID"

export class FileStatePair {

    fid: FileID;
    stid: StateID;
    
    constructor(fid: FileID, stid: StateID) {
        this.fid = fid;
        this.stid = stid;
    }
    
    getFileStatePair() {
        return this.fid, this.stid;
    }
}

