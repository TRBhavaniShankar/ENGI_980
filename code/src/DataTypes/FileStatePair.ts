import { FileID } from "./FileID"
import { StateID } from "./StateID"

export class FileStatePair {

    fid: String;
    stid: String;
    
    constructor(fid: String, stid: String) {
        this.fid = fid;
        this.stid = stid;
    }
    
    getFileStatePair() : [String, String]{
        return [this.fid, this.stid];
    }
}

