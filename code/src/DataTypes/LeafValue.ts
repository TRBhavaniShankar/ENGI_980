import { fileState } from "./Value";

export class LeafValue implements fileState{
    
    value : String;

    constructor(value : String){
        this.value = value;
    }

}
