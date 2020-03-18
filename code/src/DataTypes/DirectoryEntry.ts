import { Guid } from "guid-typescript";
import { FileStatePair } from "./FileStatePair";
import { FileID } from "./FileID";

export class DirectoryEntry{
    
    name: string;
    fID : FileID;

    constructor(name : string, fID : FileID) {
        this.fID = fID;
        this.name = name;
    }

    getDirectoryEntry() : [string, FileID]{
        return [this.name, this.fID];
    }

}