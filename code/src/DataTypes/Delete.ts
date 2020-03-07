import { FileID } from './FileID';

export class Delete {
    
    fid: FileID;

    constructor(fid: FileID){
        this.fid = fid;
    }

    delete() : FileID{
        // have to write delete functionality
        return this.fid;
    }

}