import { Guid } from "guid-typescript";
import { resp } from "./responsesInterface";
import { FileID } from "./FileID";
import { CommitID } from "./CommitID";
import { SessionID } from "./SessionID";

export class LoginDT implements resp{

    SessionID: SessionID;
    cId: CommitID;

    constructor(SessionID: SessionID, cId: CommitID){
        
        this.SessionID = SessionID;
        this.cId = cId;
    }

    toString(): string {
        return this.SessionID.toString() +","+this.cId.toString();
    }

}