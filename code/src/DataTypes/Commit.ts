import { Update } from "./Update"
import { FileStatePair } from "./FileStatePair"
import { Guid } from "guid-typescript";
import { Cache } from '../Cache/Cache';
import { FileContent } from './Content';
import { Change } from "./Change";
import { Delete } from "./Delete";
import { SessionID } from "./SessionID";

export class CommitDT{

    sessionid: SessionID;
    updates: Update[];
    currentState: FileStatePair[];

    constructor(sessionid: SessionID, updates: Update[], currentState: FileStatePair[]){

        this.sessionid = sessionid;
        this.updates = updates;
        this.currentState = currentState;
    }
    
    toString() : String {
        return "Commit DT : " + this.sessionid;
    }

}