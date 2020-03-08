import { Guid } from "guid-typescript";

export class DirectoryEntry{
    
    name: string;
    fid: Guid;

    constructor(name : string, fid : Guid) {
        this.fid = fid;
        this.name = name;
    }

    getDirectoryEntry() : [string, Guid]{
        return [this.name, this.fid];
    }

}