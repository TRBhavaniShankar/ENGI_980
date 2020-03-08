import { GetRequestDT } from "../DataTypes/GetRequest";
import {FileStatePair} from '../DataTypes/FileStatePair';
import { CommitDT } from "../DataTypes/Commit";
import { Update } from "../DataTypes/Update";
import { Guid } from "guid-typescript";

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

export class mkGetRequest{

    reqGetRequestDT : GetRequestDT;

    constructor(reqGetRequestDT : GetRequestDT){
        this.reqGetRequestDT = reqGetRequestDT;
    }

    getClassInstance() : GetRequestDT{

        var sid : Guid = this.reqGetRequestDT.sid;
        var need: Guid[] = this.reqGetRequestDT.need;
        var cid : Guid = this.reqGetRequestDT.cid;
        var currentState: FileStatePair[] = new mkFileStatePairs(this.reqGetRequestDT.currentState).getClassInstance();

        return new GetRequestDT(sid, need, cid, currentState);
    }

}

class mkFileStatePairs{

    currentState: FileStatePair[];

    constructor(reqcurrentState: FileStatePair[]){
        this.currentState = reqcurrentState;
    }

    getClassInstance(): FileStatePair[]{

        var fStatePair : FileStatePair[] = [];

        this.currentState.forEach(Element =>{

            fStatePair.push(new FileStatePair(Element.fid, Element.stid));
        });

        return fStatePair;
    }

}