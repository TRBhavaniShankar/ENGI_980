import { Guid } from "guid-typescript";
import { GIDs } from "./GenerateIDs";

export class SessionID extends GIDs{

    private SID : Guid

    constructor(SID :Guid){
        super(SID);
        this.SID = SID;
    }

    /**
     * This function takes in a SessionID and compairs with SessionID of the present Object
     * @param compID : The SessionID which has to be copaired with the other FIle ID
     */
    isEqual(compID : SessionID) : Boolean{
        return this.compairIDs(compID.getGuid(), this.SID);
    }

}