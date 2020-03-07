import { Guid } from "guid-typescript";

export class SessionID{
    
    public id: Guid;
    constructor() {
        this.id = Guid.create(); 
    }

    generateSessionID() : String{
        return String(this.id);
    }

}