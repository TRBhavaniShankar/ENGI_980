import { FileState } from './Value';
import { MetaData } from './MetaData';
import { FileStatePair } from './FileStatePair';
import { Guid } from "guid-typescript";
import { StateID } from './StateID';

export class FileContent {
    
    private stid : StateID;
    private metaData : MetaData;
    private value: FileState;

    constructor(stid : StateID, metaData : MetaData, value: FileState){
        this.metaData = metaData;
        this.stid = stid;
        this.value = value;
    }

    public getStid() : StateID{
        return this.stid;
    }

    public getMetaData() : MetaData{
        return this.metaData;
    }

    public getValue() : FileState {
        return this.value;
    }

    public toString() : string{
        return " State ID : " +this.stid.toString() + ",\n Metadata : " 
            + this.metaData.toString() +", \n Value : "+ this.value.toString();
    }

}