import { FileID } from './FileID'

export class DirectoryEntry{
    
    fid: FileID;
    name: string;

    constructor(name : string, fid : FileID) {
        this.fid = fid;
        this.name = name;
    }

    getDirectoryEntry(){
        return this.fid, this.name;
    }

}