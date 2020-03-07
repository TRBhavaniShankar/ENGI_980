import { GetRequestDT } from "../DataTypes/GetRequest";
import {FileID} from '../DataTypes/FileID';
import {FileStatePair} from '../DataTypes/FileStatePair';
import { CommitDT } from "../DataTypes/Commit";
import { Update } from "../DataTypes/Update";

export class mkCommitRequest{

    reqCommitDT : CommitDT;

    constructor(reqCommitDT : CommitDT){
        this.reqCommitDT = reqCommitDT;
    }

    getClassInstance() : CommitDT{

        var sid : String = this.reqCommitDT.sid;
        var updates: Update[] = this.reqCommitDT.updates;
        var currentState: FileStatePair[] = this.reqCommitDT.currentState;

        return new CommitDT(sid, updates, currentState);
    }

}