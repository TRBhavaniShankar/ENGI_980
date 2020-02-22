import { Value } from './Value';
import { StateID } from './StateID';
import { MetaData } from './MetaData';

export class Content {
    
    stid : StateID;
    metaData : MetaData;
    value: Value;

    constructor(stid : StateID, metaData : MetaData, value: Value){
        this.metaData = metaData;
        this.stid = stid;
        this.value =value;
    }

    getContent(){
        return this.stid, this.metaData, this.value;
    }

}