import { Update } from "./Update"
import { FileStatePair } from "./FileStatePair"
import { SessionID } from "./SessionID";

export class CommitDT{

    private sessionid: SessionID;
    private updates: Update[];
    private currentState: FileStatePair[];

    constructor(sessionid: SessionID, updates: Update[], currentState: FileStatePair[]){

        this.sessionid = sessionid;
        this.updates = updates;
        this.currentState = currentState;
    }
    
    public toString() : String {
        return "Commit DT : " + this.sessionid;
    }

    public getUpdates() : Update[]{
        return this.updates;
    }

    public getFileStatepairs() : FileStatePair[]{
        return this.currentState;
    }

    public getSessionID() : SessionID{
        return this.sessionid;
    }

}