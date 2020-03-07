import {FileID} from './FileID';
import {FileStatePair} from './FileStatePair';

export class GetRequestDT{

    sid : String;
    need: FileID[];
    cid : String;
    currentState: FileStatePair[];

    constructor(sid : String, need: FileID[], cid : String, currentState:  FileStatePair[]) {
        this.sid= sid;
        this.need = need;
        this.cid = cid;
        this.currentState = currentState;
    }
    
    

}