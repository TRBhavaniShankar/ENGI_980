
import { Guid } from "guid-typescript";

export class StateID{
    
    public id: Guid;
    constructor() {
        this.id = Guid.create(); 
    }

    generateStateID() : String{
        return String(this.id);
    }

}