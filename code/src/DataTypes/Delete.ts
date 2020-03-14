import { Guid } from "guid-typescript";

export class Delete {
    
    fid: Guid | any;

    constructor(fid: Guid| any){
        this.fid = fid;
    }

    delete() : Guid{
        // have to write delete functionality
        return this.fid;
    }

    toString() : string{
        return "";
    }

}