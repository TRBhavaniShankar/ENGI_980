import { Guid } from "guid-typescript";

export class FileStatePair {

    fid: Guid;
    stid: Guid;
    
    constructor(fid: Guid, stid: Guid) {
        this.fid = fid;
        this.stid = stid;
    }
    
    getFileStatePair() : [Guid, Guid]{
        return [this.fid, this.stid];
    }

    toString() : [String, String]{
        return [String(this.fid) , String(this.stid)];
    }
}

