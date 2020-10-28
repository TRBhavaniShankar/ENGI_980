import { Guid } from "guid-typescript";
import { FileStatePair } from "./FileStatePair";
import { FileID } from "./FileID";

export class DirectoryEntry{
    
    private name: string;
    private fID : FileID;

    constructor(name : string, fID : FileID) {
        this.fID = fID;
        this.name = name;
    }

    public getDirectoryName() : string{
        return this.name;
    }

    public getFileID() : FileID{
        return this.fID;
    }

    toString() : string {
        return "Name : " + this.name + ", FileID : " + this.fID.toString();
    }

}