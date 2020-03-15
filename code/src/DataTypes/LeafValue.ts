import { fileState } from "./Value";

export class LeafValue implements fileState{
    
    value : string;

    constructor(value : string){
        this.value = value;
    }

    toString():string{
        return this.value;
    }

}
