import { Update } from "./Update"
import { FileStatePair } from "./FileStatePair"
import { Guid } from "guid-typescript";
import { Cache } from '../Cache/Cache';
import { FileContent } from './Content';
import { Change } from "./Change";
import { Delete } from "./Delete";

export class CommitDT{

    sid: Guid;
    updates: Update[];
    currentState: FileStatePair[];

    constructor(sid: Guid, updates: Update[], currentState: FileStatePair[]){

        this.sid = sid;
        this.updates = updates;
        this.currentState = currentState;
    }
    
    toString() : String {
        return "Commit DT : " + this.sid;
    }

}