import { Guid } from "guid-typescript";

export class Delete {
    
    fid: Guid;

    constructor(fid: Guid){
        this.fid = fid;
    }

    delete() : Guid{
        // have to write delete functionality
        return this.fid;
    }

}