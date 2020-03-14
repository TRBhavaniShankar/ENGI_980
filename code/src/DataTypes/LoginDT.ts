import { Guid } from "guid-typescript";
import { resp } from "./responsesInterface";

export class LoginDT implements resp{

    sID: Guid;
    cId: Guid;

    constructor(sID: Guid, cId: Guid){
        
        this.sID = sID;
        this.cId = cId;
    }

    toString(): string {
        return this.sID.toString() +","+this.sID.toString();
    }

}