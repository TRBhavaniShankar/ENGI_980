import { FileState } from "./Value";

export class LeafValue implements FileState{
    
    private value : string;

    constructor(value : string){
        this.value = value;
    }

    toString(): string {
        return this.value;
    }

    getValue(): string {
        return this.value;
    }

    

}
