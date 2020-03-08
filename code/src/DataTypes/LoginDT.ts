import { Guid } from "guid-typescript";

export class LoginDT{

    sID: Guid;
    cId: Guid;

    constructor(sID: Guid, cId: Guid){
        this.sID = sID;
        this.cId = cId;
    }



}