import { Guid } from "guid-typescript";
import { FileID } from "./FileID";
import { CommitID } from "./CommitID";
import { SessionID } from "./SessionID";
import { IResponse } from "../Response/ResponseObjects";

export class LoginDT implements IResponse{

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