import { fileState } from './Value';
import { MetaData } from './MetaData';
import { FileStatePair } from './FileStatePair';
import { Guid } from "guid-typescript";

export class FileContent {
    
    stid : Guid;
    metaData : MetaData;
    value: fileState;

    constructor(stid : Guid, metaData : MetaData, value: fileState){
        this.metaData = metaData;
        this.stid = stid;
        this.value = value;
    }

    getContent() : [Guid, MetaData, fileState]{
        return [this.stid, this.metaData, this.value];
    }

}