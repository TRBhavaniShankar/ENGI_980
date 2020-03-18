import { fileState } from './Value';
import { MetaData } from './MetaData';
import { FileStatePair } from './FileStatePair';
import { Guid } from "guid-typescript";
import { StateID } from './StateID';

export class FileContent {
    
    stid : StateID;
    metaData : MetaData;
    value: fileState;

    constructor(stid : StateID, metaData : MetaData, value: fileState){
        this.metaData = metaData;
        this.stid = stid;
        this.value = value;
    }

    getContent() : [StateID, MetaData, fileState]{
        return [this.stid, this.metaData, this.value];
    }

    toString() : string{
        return this.stid.toString() + "," + this.metaData.toString() +","+ this.value.toString();
    }

}