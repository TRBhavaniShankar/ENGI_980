import { Guid } from "guid-typescript";
import { FileID } from "./FileID";
import { FileStatePair } from "./FileStatePair";
import { StateID } from "./StateID";

export class Delete {
    
    private fileStatePair: FileStatePair;

    constructor(fileStatePair: FileStatePair){
        this.fileStatePair = fileStatePair;
    }

    public getFileID() : FileID{
        return this.fileStatePair.getFileID();
    }

    public getStateID() : StateID{
        return this.fileStatePair.getStateID();
    }


}