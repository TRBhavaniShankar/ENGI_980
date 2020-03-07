import { Guid } from "guid-typescript";

export class CID{
    
    public id: Guid;
    constructor() {
        this.id = Guid.create(); 
    }

    generateCID() : String{
        return String(this.id);
    }

}