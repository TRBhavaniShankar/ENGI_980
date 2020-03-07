import { GetRequestDT } from "./GetRequest";
import {FileID} from './FileID';
import {FileStatePair} from './FileStatePair';

export class mkGetRequest{

    reqGetRequestDT : GetRequestDT;

    constructor(reqGetRequestDT : GetRequestDT){
        this.reqGetRequestDT = reqGetRequestDT;
    }

    getClassInstance() : GetRequestDT{

        var sid : String = this.reqGetRequestDT.sid;
        var need: FileID[] = this.reqGetRequestDT.need;
        var cid : String = this.reqGetRequestDT.cid;
        var currentState: FileStatePair[] = this.reqGetRequestDT.currentState;

        return new GetRequestDT(sid, need, cid, currentState);
    }

}