import {FileStatePair} from './FileStatePair';
import { Guid } from "guid-typescript";
import { Cache } from '../Cache/Cache';
import { FileContent } from './Content';
import { fileElementType } from '../Models/FileElementSchema';
import { Change } from './Change';
import { Update } from './Update';
import { ResponseDT } from '../Response/ResponseDT';
import { Delete } from './Delete';
import { SessionID } from './SessionID';
import { FileID } from './FileID';
import { CommitDT } from './Commit';
import { CommitID } from './CommitID';

export class GetRequestDT{

    sid : SessionID;
    need: FileID[];
    cid : CommitID;
    currentState: FileStatePair[];

    constructor(sid : SessionID, need: FileID[], cid : CommitID, currentState:  FileStatePair[]) {
        this.sid= sid;
        this.need = need;
        this.cid = cid;
        this.currentState = currentState;
    }
    
    public toString() : String{
        return this.sid + " : " + this.cid;
     }

}