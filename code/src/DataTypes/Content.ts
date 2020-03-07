import { fileState } from './Value';
import { StateID } from './StateID';
import { MetaData } from './MetaData';
import { FileStatePair } from './FileStatePair';

export class FileContent {
    
    stid : StateID;
    metaData : MetaData;
    value: fileState;
    fileStatePair : FileStatePair;

    constructor(stid : StateID, metaData : MetaData, value: fileState, fileStatePair : FileStatePair){
        this.metaData = metaData;
        this.stid = stid;
        this.value = value;
        this.fileStatePair = fileStatePair;
    }

    getContent() : [StateID, MetaData, fileState]{
        return [this.stid, this.metaData, this.value];
    }

}