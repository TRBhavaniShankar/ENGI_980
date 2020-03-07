import { FileID } from './FileID'

export class DirectoryEntry{
    
    name: string;
    fid: FileID;

    constructor(name : string, fid : FileID) {
        this.fid = fid;
        this.name = name;
    }

    getDirectoryEntry() : [string, FileID]{
        return [this.name, this.fid];
    }

}