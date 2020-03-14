import {FileStatePair} from './FileStatePair';
import { Guid } from "guid-typescript";
import { Cache } from '../Cache/Cache';
import { FileContent } from './Content';
import { fileElementType } from '../Models/FileElementSchema';
import { Change } from './Change';
import { Update } from './Update';
import { ResponseDT } from './ResponseDT';
import { Delete } from './Delete';

export class GetRequestDT{

    sid : Guid;
    need: Guid[];
    cid : Guid;
    currentState: FileStatePair[];

    constructor(sid : Guid, need: Guid[], cid : Guid, currentState:  FileStatePair[]) {
        this.sid= sid;
        this.need = need;
        this.cid = cid;
        this.currentState = currentState;
    }
    
    public toString() : String{
        return this.sid["value"] + " : " + this.cid["value"];
     }

}