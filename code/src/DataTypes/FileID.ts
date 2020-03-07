import { Guid } from "guid-typescript";

export class FileID{
    
    public id: Guid;
    constructor() {
        this.id = Guid.create(); 
    }

    generateFileID() : String{
        return String(this.id);
    }

}